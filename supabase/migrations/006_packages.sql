-- =============================================================================
-- Studio packages — paste into the Supabase SQL Editor and Run.
-- Does NOT drop tables. Safe to run on an existing AtEase project.
-- =============================================================================

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  discount_percent integer,
  duration text not null default '',
  image_url text not null default '',
  included_items text[] not null default '{}',
  vip_monthly boolean not null default false,
  vip_day_of_month integer,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packages_name_present check (char_length(btrim(name)) > 0),
  constraint packages_price_nonnegative check (price >= 0),
  constraint packages_original_price_nonnegative check (original_price is null or original_price >= 0),
  constraint packages_discount_range check (
    discount_percent is null or (discount_percent >= 0 and discount_percent <= 100)
  ),
  constraint packages_vip_day check (
    vip_day_of_month is null or (vip_day_of_month >= 1 and vip_day_of_month <= 28)
  ),
  constraint packages_vip_day_when_monthly check (
    vip_monthly = false or vip_day_of_month is not null
  )
);

create index if not exists packages_owner_idx
  on public.packages (owner_id, sort_order, created_at);

create index if not exists packages_public_idx
  on public.packages (owner_id)
  where is_active = true;

-- Bookings keep their name and amount if the package is removed.
alter table public.bookings
  add column if not exists package_id uuid references public.packages (id) on delete set null;

create index if not exists bookings_package_idx
  on public.bookings (package_id);

drop trigger if exists packages_set_updated_at on public.packages;
create trigger packages_set_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

alter table public.packages enable row level security;

revoke all on table public.packages from public, anon, authenticated;
grant select on table public.packages to anon, authenticated;
grant insert, update, delete on table public.packages to authenticated;

drop policy if exists "public_read_active_packages" on public.packages;
create policy "public_read_active_packages"
  on public.packages
  for select
  using (
    is_active = true
    and exists (
      select 1
      from public.brand_owners b
      where b.id = packages.owner_id
        and b.is_active = true
    )
  );

drop policy if exists "owners_select_own_packages" on public.packages;
create policy "owners_select_own_packages"
  on public.packages
  for select to authenticated
  using (owner_id = public.current_brand_owner_id());

drop policy if exists "owners_insert_own_packages" on public.packages;
create policy "owners_insert_own_packages"
  on public.packages
  for insert to authenticated
  with check (owner_id = public.current_brand_owner_id());

drop policy if exists "owners_update_own_packages" on public.packages;
create policy "owners_update_own_packages"
  on public.packages
  for update to authenticated
  using (owner_id = public.current_brand_owner_id())
  with check (owner_id = public.current_brand_owner_id());

drop policy if exists "owners_delete_own_packages" on public.packages;
create policy "owners_delete_own_packages"
  on public.packages
  for delete to authenticated
  using (owner_id = public.current_brand_owner_id());
