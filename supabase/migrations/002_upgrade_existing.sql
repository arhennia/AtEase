-- =============================================================================
-- RUN THIS in Supabase SQL Editor if you ALREADY applied your master query
-- (brand_owners, services, clients, bookings).
--
-- Do NOT run 001_init.sql on top of that database.
-- 001_init.sql is only for a blank project. It uses different table/column
-- names (appointments, clients.name/phone). CREATE TABLE IF NOT EXISTS skipped
-- your real tables, then later SQL referenced columns they do not have
-- (that is the 42703 owner_id / phone error).
--
-- This file does not DROP your four core tables.
-- =============================================================================

create extension if not exists "pgcrypto";

-- Clean up a partial 001_init.sql run (safe if those objects were never created)
do $$
begin
  if to_regclass('public.appointments') is not null then
    drop trigger if exists on_appointment_created on public.appointments;
  end if;
end $$;
drop function if exists public.handle_appointment_created();
drop table if exists public.appointments cascade;

-- ---------------------------------------------------------------------------
-- New tables (skip if 001 already created them)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'client'
    check (role in ('brand_owner', 'client')),
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  name text not null,
  locality text,
  address text,
  city text,
  coverage_radius_km int default 10,
  metadata jsonb not null default '{}'::jsonb,
  is_primary boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.business_analytics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  booking_count int not null default 0,
  revenue numeric(12,2) not null default 0,
  unique_clients int not null default 0,
  unique (owner_id, period_start, period_end)
);

-- Extra columns the app uses (no-op if already present)
alter table public.bookings add column if not exists client_user_id uuid references auth.users (id) on delete set null;
alter table public.bookings add column if not exists salon_id uuid references public.salons (id) on delete set null;
alter table public.bookings add column if not exists booking_source text default 'storefront';
alter table public.services add column if not exists duration_mins integer default 60;
alter table public.services add column if not exists salon_id uuid references public.salons (id) on delete set null;
alter table public.brand_owners add column if not exists trial_ends_at timestamptz;
alter table public.brand_owners alter column trial_ends_at set default (now() + interval '14 days');

create index if not exists bookings_owner_idx on public.bookings (owner_id, created_at desc);
create index if not exists bookings_client_user_idx on public.bookings (client_user_id);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.current_brand_owner_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.brand_owners where user_id = auth.uid() limit 1
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists brand_owners_updated_at on public.brand_owners;
create trigger brand_owners_updated_at
  before update on public.brand_owners
  for each row execute function public.set_updated_at();

-- auth.users → profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email, phone, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'owner_name'
    ),
    new.email,
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    phone = coalesce(excluded.phone, public.profiles.phone),
    full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- bookings insert → clients (your column names) + monthly analytics
create or replace function public.handle_booking_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  period_from date := date_trunc('month', coalesce(new.created_at, now()))::date;
  period_to date := (date_trunc('month', coalesce(new.created_at, now())) + interval '1 month' - interval '1 day')::date;
  client_row public.clients;
  spent numeric := coalesce(new.amount, new.service_price, 0);
begin
  if new.client_phone is not null and new.owner_id is not null then
    insert into public.clients (
      owner_id, user_id, client_name, client_phone, client_email,
      total_bookings, total_spent, last_visited
    )
    values (
      new.owner_id,
      new.client_user_id,
      new.client_name,
      new.client_phone,
      new.client_email,
      1,
      spent,
      now()
    )
    on conflict (owner_id, client_phone) do update set
      client_name = coalesce(excluded.client_name, public.clients.client_name),
      user_id = coalesce(excluded.user_id, public.clients.user_id),
      client_email = coalesce(excluded.client_email, public.clients.client_email),
      total_bookings = public.clients.total_bookings + 1,
      total_spent = public.clients.total_spent + coalesce(excluded.total_spent, 0),
      last_visited = now()
    returning * into client_row;

    new.client_id := client_row.id;
  end if;

  insert into public.business_analytics (owner_id, period_start, period_end, booking_count, revenue, unique_clients)
  values (new.owner_id, period_from, period_to, 1, spent, 0)
  on conflict (owner_id, period_start, period_end) do update set
    booking_count = public.business_analytics.booking_count + 1,
    revenue = public.business_analytics.revenue + spent;

  update public.business_analytics a
  set unique_clients = (
    select count(distinct c.id) from public.clients c where c.owner_id = new.owner_id
  )
  where a.owner_id = new.owner_id
    and a.period_start = period_from
    and a.period_end = period_to;

  return new;
end;
$$;

drop trigger if exists on_booking_created on public.bookings;
create trigger on_booking_created
  before insert on public.bookings
  for each row execute function public.handle_booking_created();

-- ---------------------------------------------------------------------------
-- RLS for new tables + client booking insert
-- (your existing policies on brand_owners/services/clients/bookings stay)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.salons enable row level security;
alter table public.business_analytics enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "salons_public_read" on public.salons;
create policy "salons_public_read" on public.salons
  for select using (
    owner_id = public.current_brand_owner_id()
    or exists (
      select 1 from public.brand_owners b
      where b.id = salons.owner_id and b.is_active = true
    )
  );

drop policy if exists "salons_owner_write" on public.salons;
create policy "salons_owner_write" on public.salons
  for all to authenticated
  using (owner_id = public.current_brand_owner_id())
  with check (owner_id = public.current_brand_owner_id());

drop policy if exists "analytics_owner_read" on public.business_analytics;
create policy "analytics_owner_read" on public.business_analytics
  for select to authenticated
  using (owner_id = public.current_brand_owner_id());

drop policy if exists "Authenticated clients can create bookings" on public.bookings;
create policy "Authenticated clients can create bookings" on public.bookings
  for insert to authenticated
  with check (
    client_user_id = auth.uid()
    or client_user_id is null
  );

drop policy if exists "Clients can read own bookings" on public.bookings;
create policy "Clients can read own bookings" on public.bookings
  for select to authenticated
  using (client_user_id = auth.uid() or owner_id = public.current_brand_owner_id());

-- Storage: keep your service-images + portfolio; add brand-assets
insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', true)
on conflict (id) do nothing;

drop policy if exists "public_read_brand_assets" on storage.objects;
create policy "public_read_brand_assets" on storage.objects
  for select using (bucket_id = 'brand-assets');

drop policy if exists "auth_upload_brand_assets" on storage.objects;
create policy "auth_upload_brand_assets" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'brand-assets' and auth.role() = 'authenticated');
