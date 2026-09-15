-- AtEase backend schema
-- Paste this entire file into Supabase → SQL Editor → Run.
-- Do not skip sections. Tables, RLS, triggers, and storage policies all live here.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. App identity (links to auth.users)
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

-- ---------------------------------------------------------------------------
-- 2. Brand owners (solopreneurs / partners)
-- ---------------------------------------------------------------------------

create table if not exists public.brand_owners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users (id) on delete cascade,
  slug text unique not null,
  owner_name text not null,
  brand_name text not null,
  owner_email text,
  owner_phone text,
  whatsapp_number text,
  professional_title text default 'Independent Studio',
  description text,
  location text,
  operating_hours jsonb not null default '{
    "start": "09:00 AM",
    "end": "08:00 PM",
    "daysOpen": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
  }'::jsonb,
  theme jsonb not null default '{"accent":"#111111","mode":"light"}'::jsonb,
  logo_url text,
  cover_url text,
  type_label text default 'Private Brand Site',
  coverage_radius_km int default 10,
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'expired', 'canceled')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Salons / business entities (one or more locations per owner)
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- 4. Services catalog
-- ---------------------------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  salon_id uuid references public.salons (id) on delete set null,
  category_name text default 'FEATURED SERVICES',
  title text not null,
  description text,
  duration text default '60 mins',
  duration_mins int default 60,
  pricing_model text not null default 'dual'
    check (pricing_model in ('fixed', 'starting_at', 'dual')),
  price_fixed int,
  price_salon int,
  price_home int,
  image_url text,
  is_active boolean not null default true,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. End-clients (per brand; never a global marketplace pool)
-- ---------------------------------------------------------------------------

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  name text,
  phone text not null,
  email text,
  total_bookings int not null default 0,
  lifetime_value int not null default 0,
  last_visited timestamptz,
  created_at timestamptz not null default now(),
  unique (owner_id, phone)
);

-- ---------------------------------------------------------------------------
-- 6. Appointments / bookings
-- ---------------------------------------------------------------------------

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  salon_id uuid references public.salons (id) on delete set null,
  service_id uuid references public.services (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  client_user_id uuid references auth.users (id) on delete set null,
  client_name text,
  client_phone text,
  service_name text,
  slot_date text,
  slot_time text,
  slot_start timestamptz,
  location text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'declined', 'completed', 'cancelled', 'no_show', 'blocked')),
  amount int default 0,
  booking_source text default 'storefront',
  created_at timestamptz not null default now()
);

create index if not exists appointments_owner_idx on public.appointments (owner_id, created_at desc);
create index if not exists appointments_client_user_idx on public.appointments (client_user_id);

-- ---------------------------------------------------------------------------
-- 7. Business analytics (dashboard aggregates)
-- ---------------------------------------------------------------------------

create table if not exists public.business_analytics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  booking_count int not null default 0,
  revenue int not null default 0,
  unique_clients int not null default 0,
  unique (owner_id, period_start, period_end)
);

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

create or replace function public.brand_site_is_live(owner public.brand_owners)
returns boolean
language sql
stable
as $$
  select owner.is_active
    and (
      owner.subscription_status = 'active'
      or (owner.subscription_status = 'trial' and owner.trial_ends_at > now())
    )
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

-- New auth user → profile row (role comes from user metadata)
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

-- Booking insert → upsert client history + monthly analytics
create or replace function public.handle_appointment_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  period_from date := date_trunc('month', coalesce(new.created_at, now()))::date;
  period_to date := (date_trunc('month', coalesce(new.created_at, now())) + interval '1 month' - interval '1 day')::date;
  client_row public.clients;
begin
  if new.client_phone is not null and new.owner_id is not null then
    insert into public.clients (owner_id, user_id, name, phone, email, total_bookings, lifetime_value, last_visited)
    values (
      new.owner_id,
      new.client_user_id,
      new.client_name,
      new.client_phone,
      null,
      1,
      coalesce(new.amount, 0),
      now()
    )
    on conflict (owner_id, phone) do update set
      name = coalesce(excluded.name, public.clients.name),
      user_id = coalesce(excluded.user_id, public.clients.user_id),
      total_bookings = public.clients.total_bookings + 1,
      lifetime_value = public.clients.lifetime_value + coalesce(excluded.lifetime_value, 0),
      last_visited = now()
    returning * into client_row;

    new.client_id := client_row.id;
  end if;

  insert into public.business_analytics (owner_id, period_start, period_end, booking_count, revenue, unique_clients)
  values (
    new.owner_id,
    period_from,
    period_to,
    1,
    coalesce(new.amount, 0),
    0
  )
  on conflict (owner_id, period_start, period_end) do update set
    booking_count = public.business_analytics.booking_count + 1,
    revenue = public.business_analytics.revenue + coalesce(new.amount, 0);

  update public.business_analytics a
  set unique_clients = (
    select count(distinct c.id)
    from public.clients c
    where c.owner_id = new.owner_id
  )
  where a.owner_id = new.owner_id
    and a.period_start = period_from
    and a.period_end = period_to;

  return new;
end;
$$;

drop trigger if exists on_appointment_created on public.appointments;
create trigger on_appointment_created
  before insert on public.appointments
  for each row execute function public.handle_appointment_created();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.brand_owners enable row level security;
alter table public.salons enable row level security;
alter table public.services enable row level security;
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.business_analytics enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

-- brand_owners: live storefronts are readable by slug; no directory listing in the app
drop policy if exists "brand_owners_public_read_live" on public.brand_owners;
create policy "brand_owners_public_read_live" on public.brand_owners
  for select
  using (public.brand_site_is_live(brand_owners) or user_id = auth.uid());

drop policy if exists "brand_owners_insert_own" on public.brand_owners;
create policy "brand_owners_insert_own" on public.brand_owners
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "brand_owners_update_own" on public.brand_owners;
create policy "brand_owners_update_own" on public.brand_owners
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- salons
drop policy if exists "salons_public_read" on public.salons;
create policy "salons_public_read" on public.salons
  for select
  using (
    owner_id = public.current_brand_owner_id()
    or exists (
      select 1 from public.brand_owners b
      where b.id = salons.owner_id and public.brand_site_is_live(b)
    )
  );

drop policy if exists "salons_owner_write" on public.salons;
create policy "salons_owner_write" on public.salons
  for all to authenticated
  using (owner_id = public.current_brand_owner_id())
  with check (owner_id = public.current_brand_owner_id());

-- services
drop policy if exists "services_public_read_active" on public.services;
create policy "services_public_read_active" on public.services
  for select
  using (
    owner_id = public.current_brand_owner_id()
    or (
      is_active = true
      and exists (
        select 1 from public.brand_owners b
        where b.id = services.owner_id and public.brand_site_is_live(b)
      )
    )
  );

drop policy if exists "services_owner_write" on public.services;
create policy "services_owner_write" on public.services
  for all to authenticated
  using (owner_id = public.current_brand_owner_id())
  with check (owner_id = public.current_brand_owner_id());

-- clients: owner only (created by trigger)
drop policy if exists "clients_owner_read" on public.clients;
create policy "clients_owner_read" on public.clients
  for select to authenticated
  using (owner_id = public.current_brand_owner_id() or user_id = auth.uid());

drop policy if exists "clients_owner_update" on public.clients;
create policy "clients_owner_update" on public.clients
  for update to authenticated
  using (owner_id = public.current_brand_owner_id());

-- appointments
drop policy if exists "appointments_owner_read" on public.appointments;
create policy "appointments_owner_read" on public.appointments
  for select to authenticated
  using (owner_id = public.current_brand_owner_id() or client_user_id = auth.uid());

drop policy if exists "appointments_client_insert" on public.appointments;
create policy "appointments_client_insert" on public.appointments
  for insert to authenticated
  with check (
    client_user_id = auth.uid()
    and exists (
      select 1 from public.brand_owners b
      where b.id = appointments.owner_id and public.brand_site_is_live(b)
    )
  );

drop policy if exists "appointments_owner_update" on public.appointments;
create policy "appointments_owner_update" on public.appointments
  for update to authenticated
  using (owner_id = public.current_brand_owner_id())
  with check (owner_id = public.current_brand_owner_id());

-- analytics
drop policy if exists "analytics_owner_read" on public.business_analytics;
create policy "analytics_owner_read" on public.business_analytics
  for select to authenticated
  using (owner_id = public.current_brand_owner_id());

-- ---------------------------------------------------------------------------
-- Storage buckets (logos, covers, service imagery)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('brand-assets', 'brand-assets', true),
  ('service-images', 'service-images', true)
on conflict (id) do nothing;

drop policy if exists "public_read_brand_assets" on storage.objects;
create policy "public_read_brand_assets" on storage.objects
  for select
  using (bucket_id in ('brand-assets', 'service-images'));

drop policy if exists "auth_upload_own_folder" on storage.objects;
create policy "auth_upload_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('brand-assets', 'service-images')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "auth_update_own_folder" on storage.objects;
create policy "auth_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('brand-assets', 'service-images')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "auth_delete_own_folder" on storage.objects;
create policy "auth_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('brand-assets', 'service-images')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
