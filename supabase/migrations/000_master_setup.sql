-- =============================================================================
-- AtEase Master Setup — paste this WHOLE file into SQL Editor and Run once.
-- Replaces your old master query. This DELETES existing AtEase table data.
-- =============================================================================

-- 1. Remove leftover functions/triggers from earlier attempts
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.handle_booking_created() cascade;
drop function if exists public.handle_appointment_created() cascade;
drop function if exists public.current_brand_owner_id() cascade;
drop function if exists public.set_updated_at() cascade;

do $$
begin
  drop function if exists public.brand_site_is_live(public.brand_owners) cascade;
exception
  when others then null;
end $$;

-- 2. Drop tables (children first)
drop table if exists public.appointments cascade;
drop table if exists public.bookings cascade;
drop table if exists public.business_analytics cascade;
drop table if exists public.clients cascade;
drop table if exists public.services cascade;
drop table if exists public.salons cascade;
drop table if exists public.profiles cascade;
drop table if exists public.brand_owners cascade;

create extension if not exists "pgcrypto";

-- =============================================================================
-- 3. Tables
-- =============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'client' check (role in ('brand_owner', 'client')),
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brand_owners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete cascade,
  brand_name text not null default '',
  owner_name text not null default '',
  owner_email text,
  owner_phone text,
  whatsapp_number text,
  slug text unique,
  professional_title text default 'Independent Studio',
  description text,
  logo_url text,
  cover_url text,
  location text,
  service_area jsonb default '[]',
  coverage_radius_km integer default 10,
  working_hours jsonb default '{"start": "09:00", "end": "20:00", "days_open": ["Mon","Tue","Wed","Thu","Fri","Sat"]}',
  theme jsonb default '{"accent": "#111111", "mode": "light"}',
  type_label text default 'Private Brand Site',
  subscription_status text default 'trial',
  trial_ends_at timestamptz default (now() + interval '14 days'),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.salons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  name text not null,
  locality text,
  address text,
  city text,
  coverage_radius_km integer default 10,
  metadata jsonb not null default '{}'::jsonb,
  is_primary boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  salon_id uuid references public.salons (id) on delete set null,
  category_name text default 'FEATURED SERVICES',
  title text not null,
  description text,
  duration text,
  duration_mins integer default 60,
  price_fixed numeric(10,2),
  price_home numeric(10,2),
  price_salon numeric(10,2),
  price_model text default 'fixed',
  image_url text,
  tags text[] default '{}',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  client_name text not null,
  client_phone text not null,
  client_email text,
  notes text,
  total_bookings integer default 0,
  total_spent numeric(12,2) default 0,
  last_visited timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (owner_id, client_phone)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text unique not null default ('ATEASE-' || lpad(floor(random() * 99999)::text, 5, '0')),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  salon_id uuid references public.salons (id) on delete set null,
  service_id uuid references public.services (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  client_user_id uuid references auth.users (id) on delete set null,
  client_name text not null,
  client_phone text not null,
  client_email text,
  service_name text,
  service_price numeric(10,2),
  booking_time timestamptz not null,
  duration_mins integer,
  location text,
  service_type text default 'at-home',
  status text default 'pending',
  notes text,
  provider_notes text,
  amount numeric(10,2),
  payment_method text default 'direct',
  payment_status text default 'unpaid',
  booking_source text default 'storefront',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.business_analytics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.brand_owners (id) on delete cascade,
  period_start date not null,
  period_end date not null,
  booking_count integer not null default 0,
  revenue numeric(12,2) not null default 0,
  unique_clients integer not null default 0,
  unique (owner_id, period_start, period_end)
);

create index bookings_owner_idx on public.bookings (owner_id, created_at desc);
create index bookings_client_user_idx on public.bookings (client_user_id);
create index services_owner_idx on public.services (owner_id);
create index clients_owner_idx on public.clients (owner_id);

-- =============================================================================
-- 4. Functions + triggers
-- =============================================================================

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

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger brand_owners_updated_at
  before update on public.brand_owners
  for each row execute function public.set_updated_at();

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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

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

create trigger on_booking_created
  before insert on public.bookings
  for each row execute function public.handle_booking_created();

-- =============================================================================
-- 5. Row Level Security
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.brand_owners enable row level security;
alter table public.salons enable row level security;
alter table public.services enable row level security;
alter table public.clients enable row level security;
alter table public.bookings enable row level security;
alter table public.business_analytics enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());

create policy "Public can view active brand owners" on public.brand_owners
  for select using (is_active = true);
create policy "Owner can read own profile" on public.brand_owners
  for select using (auth.uid() = user_id);
create policy "Owner can update own profile" on public.brand_owners
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Owner can insert own profile" on public.brand_owners
  for insert with check (auth.uid() = user_id);
create policy "Owner can delete own profile" on public.brand_owners
  for delete using (auth.uid() = user_id);

create policy "Public can view active services" on public.services
  for select using (is_active = true);
create policy "Owner can manage own services" on public.services
  for all
  using (owner_id in (select id from public.brand_owners where user_id = auth.uid()))
  with check (owner_id in (select id from public.brand_owners where user_id = auth.uid()));

create policy "salons_public_read" on public.salons
  for select using (
    exists (select 1 from public.brand_owners b where b.id = salons.owner_id and b.is_active = true)
    or owner_id in (select id from public.brand_owners where user_id = auth.uid())
  );
create policy "Owner can manage own salons" on public.salons
  for all
  using (owner_id in (select id from public.brand_owners where user_id = auth.uid()))
  with check (owner_id in (select id from public.brand_owners where user_id = auth.uid()));

create policy "Owner can manage own clients" on public.clients
  for all
  using (owner_id in (select id from public.brand_owners where user_id = auth.uid()))
  with check (owner_id in (select id from public.brand_owners where user_id = auth.uid()));

create policy "Owner can manage own bookings" on public.bookings
  for all
  using (owner_id in (select id from public.brand_owners where user_id = auth.uid()))
  with check (owner_id in (select id from public.brand_owners where user_id = auth.uid()));
create policy "Public can create bookings" on public.bookings
  for insert with check (true);
create policy "Authenticated clients can create bookings" on public.bookings
  for insert to authenticated
  with check (client_user_id = auth.uid() or client_user_id is null);
create policy "Clients can read own bookings" on public.bookings
  for select to authenticated
  using (
    client_user_id = auth.uid()
    or owner_id in (select id from public.brand_owners where user_id = auth.uid())
  );

create policy "Owner can read own analytics" on public.business_analytics
  for select to authenticated
  using (owner_id in (select id from public.brand_owners where user_id = auth.uid()));

-- =============================================================================
-- 6. Storage
-- =============================================================================

insert into storage.buckets (id, name, public) values ('service-images', 'service-images', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('brand-assets', 'brand-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can view service images" on storage.objects;
create policy "Public can view service images" on storage.objects
  for select using (bucket_id in ('service-images', 'portfolio', 'brand-assets'));

drop policy if exists "Owner can upload to service-images" on storage.objects;
create policy "Owner can upload to service-images" on storage.objects
  for insert with check (bucket_id = 'service-images' and auth.role() = 'authenticated');

drop policy if exists "Owner can upload to portfolio" on storage.objects;
create policy "Owner can upload to portfolio" on storage.objects
  for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');

drop policy if exists "Owner can upload to brand-assets" on storage.objects;
create policy "Owner can upload to brand-assets" on storage.objects
  for insert with check (bucket_id = 'brand-assets' and auth.role() = 'authenticated');
