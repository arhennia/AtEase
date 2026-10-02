-- =============================================================================
-- VIP memberships — paste into the Supabase SQL Editor and Run.
-- Does NOT drop tables. Safe to run on an existing AtEase project.
-- A membership is not a client row: someone can be VIP before they book,
-- and removing VIP must not delete their visit history.
-- =============================================================================

create table if not exists public.vip_members (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  package_id uuid references public.packages (id) on delete set null,
  client_name text not null,
  client_phone text not null,
  package_name text not null default 'Monthly package',
  day_of_month integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vip_members_name_present check (char_length(btrim(client_name)) > 0),
  constraint vip_members_phone_present check (char_length(client_phone) = 10),
  constraint vip_members_day check (day_of_month >= 1 and day_of_month <= 28),
  constraint vip_members_owner_phone unique (owner_id, client_phone)
);

create index if not exists vip_members_owner_idx
  on public.vip_members (owner_id, created_at desc);

drop trigger if exists vip_members_set_updated_at on public.vip_members;
create trigger vip_members_set_updated_at
  before update on public.vip_members
  for each row execute function public.set_updated_at();

alter table public.vip_members enable row level security;

revoke all on table public.vip_members from public, anon, authenticated;
grant select, insert, update, delete on table public.vip_members to authenticated;

drop policy if exists "owners_select_own_vip_members" on public.vip_members;
create policy "owners_select_own_vip_members"
  on public.vip_members
  for select to authenticated
  using (owner_id = public.current_brand_owner_id());

drop policy if exists "owners_insert_own_vip_members" on public.vip_members;
create policy "owners_insert_own_vip_members"
  on public.vip_members
  for insert to authenticated
  with check (owner_id = public.current_brand_owner_id());

drop policy if exists "owners_update_own_vip_members" on public.vip_members;
create policy "owners_update_own_vip_members"
  on public.vip_members
  for update to authenticated
  using (owner_id = public.current_brand_owner_id())
  with check (owner_id = public.current_brand_owner_id());

drop policy if exists "owners_delete_own_vip_members" on public.vip_members;
create policy "owners_delete_own_vip_members"
  on public.vip_members
  for delete to authenticated
  using (owner_id = public.current_brand_owner_id());

-- Guests can join the membership shown on a public package.
-- The function writes one row and returns nothing, so a client cannot read the list.
create or replace function public.subscribe_vip(
  p_owner_id uuid,
  p_package_id uuid,
  p_client_name text,
  p_client_phone text,
  p_day_of_month integer
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  pkg public.packages;
  phone text;
  day integer;
begin
  phone := right(regexp_replace(coalesce(p_client_phone, ''), '\D', '', 'g'), 10);
  if char_length(btrim(coalesce(p_client_name, ''))) = 0 or char_length(phone) <> 10 then
    raise exception 'Enter your name and a 10-digit phone number.';
  end if;

  day := coalesce(p_day_of_month, 5);
  if day < 1 or day > 28 then
    raise exception 'Pick a day from 1 to 28.';
  end if;

  if not exists (
    select 1 from public.brand_owners b
    where b.id = p_owner_id and b.is_active = true
  ) then
    raise exception 'This studio is not accepting memberships.';
  end if;

  select * into pkg
  from public.packages
  where id = p_package_id
    and owner_id = p_owner_id
    and is_active = true
    and vip_monthly = true;

  if pkg.id is null then
    raise exception 'This membership is not available.';
  end if;

  insert into public.vip_members (
    owner_id, package_id, client_name, client_phone, package_name, day_of_month
  ) values (
    p_owner_id, pkg.id, btrim(p_client_name), phone, pkg.name, day
  )
  on conflict (owner_id, client_phone) do update set
    package_id = excluded.package_id,
    client_name = excluded.client_name,
    package_name = excluded.package_name,
    day_of_month = excluded.day_of_month,
    updated_at = now();
end;
$$;

revoke all on function public.subscribe_vip(uuid, uuid, text, text, integer) from public;
grant execute on function public.subscribe_vip(uuid, uuid, text, text, integer) to anon, authenticated;
