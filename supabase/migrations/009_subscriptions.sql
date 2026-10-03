-- =============================================================================
-- Subscriptions — paste into the Supabase SQL Editor and Run.
-- Does NOT drop brand_owners or any studio data.
--
-- brand_owners.subscription_status stays as a mirror for brand_site_is_live.
-- The subscriptions row is the source of truth. Signed-in owners can read
-- their own row and cannot insert or update it. A later Razorpay webhook
-- should call apply_subscription_event with the service role.
-- Existing "active" values written by the app are not treated as paid:
-- there is no provider payment id, so each studio is backfilled as trial
-- or expired from trial_ends_at.
-- =============================================================================

do $$
declare
  conname text;
begin
  select c.conname into conname
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  join pg_namespace n on n.oid = t.relnamespace
  where n.nspname = 'public'
    and t.relname = 'brand_owners'
    and c.contype = 'c'
    and pg_get_constraintdef(c.oid) ilike '%subscription_status%';
  if conname is not null then
    execute format('alter table public.brand_owners drop constraint %I', conname);
  end if;
end $$;

alter table public.brand_owners
  drop constraint if exists brand_owners_subscription_status_check;

alter table public.brand_owners
  add constraint brand_owners_subscription_status_check
  check (
    subscription_status in (
      'trial',
      'active',
      'expired',
      'canceled',
      'cancelled',
      'payment_failed',
      'refunded'
    )
  );

create or replace function public.brand_site_is_live(owner public.brand_owners)
returns boolean
language sql
stable
as $$
  select owner.is_active
    and owner.trial_ends_at is not null
    and owner.trial_ends_at > now()
    and owner.subscription_status in ('trial', 'active')
$$;

create or replace function public.protect_brand_owner_subscription()
returns trigger
language plpgsql
as $$
begin
  if coalesce(current_setting('atease.subscription_sync', true), '') = '1' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.subscription_status := 'trial';
    new.trial_ends_at := now() + interval '14 days';
    return new;
  end if;

  new.subscription_status := old.subscription_status;
  new.trial_ends_at := old.trial_ends_at;
  return new;
end;
$$;

drop trigger if exists brand_owners_protect_subscription on public.brand_owners;
create trigger brand_owners_protect_subscription
  before insert or update on public.brand_owners
  for each row execute function public.protect_brand_owner_subscription();

revoke insert (subscription_status, trial_ends_at)
  on public.brand_owners from anon, authenticated;
revoke update (subscription_status, trial_ends_at)
  on public.brand_owners from anon, authenticated;

create table if not exists public.plans (
  id text primary key,
  name text not null,
  price_inr integer not null,
  billing_interval text not null,
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  constraint plans_price_nonnegative check (price_inr >= 0),
  constraint plans_interval_check check (billing_interval in ('trial', 'month'))
);

insert into public.plans (id, name, price_inr, billing_interval, description, features, sort_order, is_public)
values
  (
    'trial',
    '14 days free',
    0,
    'trial',
    'Full access to your booking page and dashboard. No card required.',
    '["Your branded booking page","Dashboard & scheduling","Client records","No card required"]'::jsonb,
    1,
    true
  ),
  (
    'self_managed',
    'Run it yourself',
    549,
    'month',
    'For professionals who want to manage and run every dashboard feature on their own.',
    '["Everything in the trial","Unlimited bookings","Offers & client follow-ups","You run the dashboard"]'::jsonb,
    2,
    true
  ),
  (
    'managed',
    'We run it with you',
    999,
    'month',
    'For professionals who want us to fully manage, support, and boost their business.',
    '["Everything in Self-Managed","We handle the dashboard","Support when you need it","Marketing boost"]'::jsonb,
    3,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  price_inr = excluded.price_inr,
  billing_interval = excluded.billing_interval,
  description = excluded.description,
  features = excluded.features,
  sort_order = excluded.sort_order,
  is_public = excluded.is_public;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.brand_owners (id) on delete cascade,
  plan_id text not null references public.plans (id),
  status text not null,
  started_at timestamptz not null default now(),
  current_period_end timestamptz,
  cancelled_at timestamptz,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  provider_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_status_check check (
    status in ('trial', 'active', 'expired', 'cancelled', 'payment_failed', 'refunded')
  ),
  constraint subscriptions_provider_check check (
    provider is null or provider in ('razorpay')
  ),
  constraint subscriptions_paid_needs_provider check (
    status not in ('active', 'payment_failed', 'refunded') or provider is not null
  )
);

create index if not exists subscriptions_owner_idx on public.subscriptions (owner_id);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create or replace function public.sync_brand_owner_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform set_config('atease.subscription_sync', '1', true);
  update public.brand_owners
  set
    subscription_status = new.status,
    trial_ends_at = new.current_period_end
  where id = new.owner_id;
  return new;
end;
$$;

drop trigger if exists subscriptions_sync_owner on public.subscriptions;
create trigger subscriptions_sync_owner
  after insert or update on public.subscriptions
  for each row execute function public.sync_brand_owner_subscription();

create or replace function public.create_trial_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.subscriptions (owner_id, plan_id, status, started_at, current_period_end)
  values (new.id, 'trial', 'trial', now(), new.trial_ends_at)
  on conflict (owner_id) do nothing;
  return new;
end;
$$;

drop trigger if exists brand_owners_create_trial_subscription on public.brand_owners;
create trigger brand_owners_create_trial_subscription
  after insert on public.brand_owners
  for each row execute function public.create_trial_subscription();

insert into public.subscriptions (owner_id, plan_id, status, started_at, current_period_end)
select
  b.id,
  'trial',
  case
    when b.trial_ends_at is not null and b.trial_ends_at > now() then 'trial'
    else 'expired'
  end,
  coalesce(b.created_at, now()),
  coalesce(b.trial_ends_at, now())
from public.brand_owners b
where not exists (
  select 1 from public.subscriptions s where s.owner_id = b.id
);

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "public_read_plans" on public.plans;
create policy "public_read_plans"
  on public.plans
  for select
  using (is_public = true);

drop policy if exists "owners_select_own_subscription" on public.subscriptions;
create policy "owners_select_own_subscription"
  on public.subscriptions
  for select
  to authenticated
  using (owner_id = public.current_brand_owner_id());

revoke all on table public.plans from public, anon, authenticated;
grant select on table public.plans to anon, authenticated;

revoke all on table public.subscriptions from public, anon, authenticated;
grant select on table public.subscriptions to authenticated;

revoke all on function public.protect_brand_owner_subscription() from public, anon, authenticated;
revoke all on function public.sync_brand_owner_subscription() from public, anon, authenticated;
revoke all on function public.create_trial_subscription() from public, anon, authenticated;

create or replace function public.apply_subscription_event(
  p_owner_id uuid,
  p_plan_id text,
  p_status text,
  p_current_period_end timestamptz,
  p_provider text,
  p_provider_customer_id text default null,
  p_provider_subscription_id text default null,
  p_provider_payment_id text default null
)
returns public.subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.subscriptions;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'subscription updates require the server';
  end if;

  if p_status not in ('trial', 'active', 'expired', 'cancelled', 'payment_failed', 'refunded') then
    raise exception 'unknown subscription status';
  end if;

  if not exists (select 1 from public.plans where id = p_plan_id) then
    raise exception 'unknown plan';
  end if;

  if p_status in ('active', 'payment_failed', 'refunded') and coalesce(p_provider, '') = '' then
    raise exception 'paid status requires a payment provider';
  end if;

  if p_status = 'active' and p_provider_subscription_id is null and p_provider_payment_id is null then
    raise exception 'active status requires a provider payment or subscription id';
  end if;

  if p_status = 'active' and (p_current_period_end is null or p_current_period_end <= now()) then
    raise exception 'active status requires a future renewal date';
  end if;

  insert into public.subscriptions as s (
    owner_id,
    plan_id,
    status,
    started_at,
    current_period_end,
    cancelled_at,
    provider,
    provider_customer_id,
    provider_subscription_id,
    provider_payment_id
  )
  values (
    p_owner_id,
    p_plan_id,
    p_status,
    now(),
    p_current_period_end,
    case when p_status = 'cancelled' then now() else null end,
    nullif(p_provider, ''),
    p_provider_customer_id,
    p_provider_subscription_id,
    p_provider_payment_id
  )
  on conflict (owner_id) do update set
    plan_id = excluded.plan_id,
    status = excluded.status,
    current_period_end = excluded.current_period_end,
    cancelled_at = case
      when excluded.status = 'cancelled' then coalesce(s.cancelled_at, now())
      else null
    end,
    provider = excluded.provider,
    provider_customer_id = excluded.provider_customer_id,
    provider_subscription_id = excluded.provider_subscription_id,
    provider_payment_id = excluded.provider_payment_id,
    updated_at = now()
  returning * into result;

  return result;
end;
$$;

revoke all on function public.apply_subscription_event(uuid, text, text, timestamptz, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.apply_subscription_event(uuid, text, text, timestamptz, text, text, text, text)
  to service_role;

do $$
begin
  if to_regclass('public.site_configs') is null then
    return;
  end if;

  execute 'drop policy if exists "public_read_published_sites" on public.site_configs';
  execute $policy$
    create policy "public_read_published_sites"
      on public.site_configs
      for select
      using (
        published = true
        and exists (
          select 1
          from public.brand_owners b
          where b.id = site_configs.owner_id
            and public.brand_site_is_live(b)
        )
      )
  $policy$;
end $$;
