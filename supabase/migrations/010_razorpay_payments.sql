-- =============================================================================
-- Razorpay payments — paste into the Supabase SQL Editor and Run.
-- Requires 009_subscriptions.sql. Does NOT drop studios or subscription rows.
--
-- The browser cannot insert these rows or call these functions.
-- Edge Functions verify Razorpay, then call them with the service role.
-- apply_subscription_event remains the only writer of paid subscription status.
-- Card numbers are not stored.
-- =============================================================================

create table if not exists public.subscription_payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  plan_id text not null references public.plans (id),
  amount_paise integer not null,
  currency text not null default 'INR',
  status text not null default 'created',
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  failure_reason text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  constraint subscription_payments_amount_positive check (amount_paise > 0),
  constraint subscription_payments_currency check (currency = 'INR'),
  constraint subscription_payments_status_check check (
    status in ('created', 'paid', 'failed', 'refunded', 'checkout_cancelled')
  )
);

create index if not exists subscription_payments_owner_idx
  on public.subscription_payments (owner_id, created_at desc);

create table if not exists public.razorpay_webhook_events (
  event_id text primary key,
  event_type text not null,
  outcome text not null,
  created_at timestamptz not null default now()
);

alter table public.subscription_payments enable row level security;
alter table public.razorpay_webhook_events enable row level security;

drop policy if exists "owners_select_own_subscription_payments" on public.subscription_payments;
create policy "owners_select_own_subscription_payments"
  on public.subscription_payments
  for select
  to authenticated
  using (owner_id = public.current_brand_owner_id());

revoke all on table public.subscription_payments from public, anon, authenticated;
grant select on table public.subscription_payments to authenticated;

revoke all on table public.razorpay_webhook_events from public, anon, authenticated;

create or replace function public.expire_elapsed_subscriptions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  sub public.subscriptions;
  expired_count integer := 0;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'subscription updates require the server';
  end if;

  for sub in
    select *
    from public.subscriptions
    where status = 'active'
      and current_period_end is not null
      and current_period_end <= now()
  loop
    perform public.apply_subscription_event(
      sub.owner_id,
      sub.plan_id,
      'expired',
      sub.current_period_end,
      sub.provider,
      sub.provider_customer_id,
      sub.provider_subscription_id,
      sub.provider_payment_id
    );
    expired_count := expired_count + 1;
  end loop;

  return expired_count;
end;
$$;

create or replace function public.register_razorpay_order(
  p_owner_id uuid,
  p_plan_id text,
  p_amount_paise integer,
  p_order_id text
)
returns public.subscription_payments
language plpgsql
security definer
set search_path = public
as $$
declare
  plan_price integer;
  created public.subscription_payments;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'subscription updates require the server';
  end if;

  if p_order_id is null or length(btrim(p_order_id)) = 0 then
    raise exception 'missing order id';
  end if;

  select price_inr into plan_price
  from public.plans
  where id = p_plan_id;

  if plan_price is null or plan_price <= 0 then
    raise exception 'unknown paid plan';
  end if;

  if p_amount_paise <> plan_price * 100 then
    raise exception 'amount does not match the plan';
  end if;

  if not exists (select 1 from public.brand_owners where id = p_owner_id) then
    raise exception 'unknown studio';
  end if;

  insert into public.subscription_payments (
    owner_id,
    plan_id,
    amount_paise,
    currency,
    status,
    razorpay_order_id
  )
  values (
    p_owner_id,
    p_plan_id,
    p_amount_paise,
    'INR',
    'created',
    p_order_id
  )
  returning * into created;

  return created;
end;
$$;

create or replace function public.apply_verified_razorpay_payment(
  p_order_id text,
  p_payment_id text,
  p_owner_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pay public.subscription_payments;
  sub public.subscriptions;
  period_start timestamptz;
  period_end timestamptz;
  updated public.subscriptions;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'subscription updates require the server';
  end if;

  if p_payment_id is null or length(btrim(p_payment_id)) = 0 then
    raise exception 'missing payment id';
  end if;

  select * into pay
  from public.subscription_payments
  where razorpay_order_id = p_order_id
  for update;

  if not found then
    return jsonb_build_object('outcome', 'unknown');
  end if;

  if p_owner_id is not null and pay.owner_id <> p_owner_id then
    raise exception 'order does not belong to this studio';
  end if;

  if pay.status = 'paid' and pay.razorpay_payment_id = p_payment_id then
    return jsonb_build_object('outcome', 'duplicate', 'owner_id', pay.owner_id, 'plan_id', pay.plan_id);
  end if;

  if pay.status = 'paid' then
    raise exception 'order already has a different payment';
  end if;

  if pay.status = 'refunded' then
    return jsonb_build_object('outcome', 'refunded', 'owner_id', pay.owner_id);
  end if;

  if exists (
    select 1
    from public.subscription_payments other
    where other.razorpay_payment_id = p_payment_id
      and other.id <> pay.id
  ) then
    return jsonb_build_object('outcome', 'duplicate', 'owner_id', pay.owner_id, 'plan_id', pay.plan_id);
  end if;

  select * into sub
  from public.subscriptions
  where owner_id = pay.owner_id
  for update;

  period_start := now();
  if found then
    if sub.status = 'active' and sub.current_period_end is not null and sub.current_period_end <= now() then
      perform public.apply_subscription_event(
        sub.owner_id,
        sub.plan_id,
        'expired',
        sub.current_period_end,
        sub.provider,
        sub.provider_customer_id,
        sub.provider_subscription_id,
        sub.provider_payment_id
      );
      sub.status := 'expired';
    end if;
    if sub.status = 'active' and sub.current_period_end > now() then
      period_start := sub.current_period_end;
    end if;
  end if;
  period_end := period_start + interval '1 month';

  update public.subscription_payments
  set
    status = 'paid',
    razorpay_payment_id = p_payment_id,
    paid_at = now(),
    failure_reason = null
  where id = pay.id;

  updated := public.apply_subscription_event(
    pay.owner_id,
    pay.plan_id,
    'active',
    period_end,
    'razorpay',
    null,
    pay.razorpay_order_id,
    p_payment_id
  );

  return jsonb_build_object(
    'outcome', 'paid',
    'owner_id', updated.owner_id,
    'plan_id', updated.plan_id,
    'current_period_end', updated.current_period_end
  );
end;
$$;

create or replace function public.mark_razorpay_payment_failed(
  p_order_id text,
  p_payment_id text,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pay public.subscription_payments;
  sub public.subscriptions;
  live boolean;
  period_end timestamptz := now();
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'subscription updates require the server';
  end if;

  select * into pay
  from public.subscription_payments
  where razorpay_order_id = p_order_id
  for update;

  if not found then
    return jsonb_build_object('outcome', 'unknown');
  end if;

  if pay.status = 'paid' or pay.status = 'refunded' then
    return jsonb_build_object('outcome', 'ignored', 'status', pay.status);
  end if;

  if pay.status = 'failed' and pay.razorpay_payment_id is not distinct from nullif(p_payment_id, '') then
    return jsonb_build_object('outcome', 'duplicate');
  end if;

  update public.subscription_payments
  set
    status = 'failed',
    razorpay_payment_id = coalesce(nullif(p_payment_id, ''), razorpay_payment_id),
    failure_reason = left(coalesce(p_reason, 'payment failed'), 200)
  where id = pay.id;

  select * into sub from public.subscriptions where owner_id = pay.owner_id;
  live := false;
  if found then
    period_end := coalesce(sub.current_period_end, now());
    live := (sub.status = 'trial' and sub.current_period_end > now())
      or (sub.status = 'active' and sub.current_period_end > now());
  end if;

  if live then
    return jsonb_build_object('outcome', 'failed_access_kept', 'owner_id', pay.owner_id);
  end if;

  perform public.apply_subscription_event(
    pay.owner_id,
    pay.plan_id,
    'payment_failed',
    period_end,
    'razorpay',
    null,
    pay.razorpay_order_id,
    nullif(p_payment_id, '')
  );

  return jsonb_build_object('outcome', 'payment_failed', 'owner_id', pay.owner_id);
end;
$$;

create or replace function public.mark_razorpay_payment_refunded(
  p_payment_id text,
  p_refund_paise integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pay public.subscription_payments;
  sub public.subscriptions;
  full_refund boolean;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'subscription updates require the server';
  end if;

  select * into pay
  from public.subscription_payments
  where razorpay_payment_id = p_payment_id
  for update;

  if not found then
    return jsonb_build_object('outcome', 'unknown');
  end if;

  full_refund := p_refund_paise is null or p_refund_paise >= pay.amount_paise;

  if pay.status = 'refunded' then
    return jsonb_build_object('outcome', 'duplicate', 'owner_id', pay.owner_id);
  end if;

  if not full_refund then
    return jsonb_build_object('outcome', 'partial_refund', 'owner_id', pay.owner_id);
  end if;

  update public.subscription_payments
  set status = 'refunded'
  where id = pay.id;

  select * into sub from public.subscriptions where owner_id = pay.owner_id;
  if found
    and (
      sub.provider_payment_id is not distinct from pay.razorpay_payment_id
      or sub.provider_subscription_id is not distinct from pay.razorpay_order_id
    )
  then
    perform public.apply_subscription_event(
      pay.owner_id,
      pay.plan_id,
      'refunded',
      coalesce(sub.current_period_end, now()),
      'razorpay',
      sub.provider_customer_id,
      pay.razorpay_order_id,
      pay.razorpay_payment_id
    );
  end if;

  return jsonb_build_object('outcome', 'refunded', 'owner_id', pay.owner_id);
end;
$$;

create or replace function public.mark_razorpay_checkout_cancelled(
  p_order_id text,
  p_owner_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pay public.subscription_payments;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'subscription updates require the server';
  end if;

  select * into pay
  from public.subscription_payments
  where razorpay_order_id = p_order_id
  for update;

  if not found or pay.owner_id <> p_owner_id then
    return jsonb_build_object('outcome', 'unknown');
  end if;

  if pay.status <> 'created' then
    return jsonb_build_object('outcome', 'ignored', 'status', pay.status);
  end if;

  update public.subscription_payments
  set status = 'checkout_cancelled'
  where id = pay.id;

  return jsonb_build_object('outcome', 'checkout_cancelled');
end;
$$;

create or replace function public.cancel_owner_subscription(p_owner_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  sub public.subscriptions;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'subscription updates require the server';
  end if;

  select * into sub
  from public.subscriptions
  where owner_id = p_owner_id
  for update;

  if not found or sub.status <> 'active' then
    return jsonb_build_object('outcome', 'ignored');
  end if;

  perform public.apply_subscription_event(
    sub.owner_id,
    sub.plan_id,
    'cancelled',
    sub.current_period_end,
    coalesce(sub.provider, 'razorpay'),
    sub.provider_customer_id,
    sub.provider_subscription_id,
    sub.provider_payment_id
  );

  return jsonb_build_object('outcome', 'cancelled', 'owner_id', sub.owner_id);
end;
$$;

revoke all on function public.expire_elapsed_subscriptions() from public, anon, authenticated;
revoke all on function public.register_razorpay_order(uuid, text, integer, text) from public, anon, authenticated;
revoke all on function public.apply_verified_razorpay_payment(text, text, uuid) from public, anon, authenticated;
revoke all on function public.mark_razorpay_payment_failed(text, text, text) from public, anon, authenticated;
revoke all on function public.mark_razorpay_payment_refunded(text, integer) from public, anon, authenticated;
revoke all on function public.mark_razorpay_checkout_cancelled(text, uuid) from public, anon, authenticated;
revoke all on function public.cancel_owner_subscription(uuid) from public, anon, authenticated;

grant execute on function public.expire_elapsed_subscriptions() to service_role;
grant execute on function public.register_razorpay_order(uuid, text, integer, text) to service_role;
grant execute on function public.apply_verified_razorpay_payment(text, text, uuid) to service_role;
grant execute on function public.mark_razorpay_payment_failed(text, text, text) to service_role;
grant execute on function public.cancel_owner_subscription(uuid) to service_role;
grant execute on function public.mark_razorpay_payment_refunded(text, integer) to service_role;
grant execute on function public.mark_razorpay_checkout_cancelled(text, uuid) to service_role;
