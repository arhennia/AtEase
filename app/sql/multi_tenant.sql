-- AtEase multi-tenant white-label schema (target backend)
-- Every client-facing row is scoped by partner_id. Never query without that filter.

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  brand_name text not null,
  owner_email text unique not null,
  logo_url text,
  theme jsonb default '{"accent":"#111111","mode":"light"}'::jsonb,
  trial_ends_at timestamptz not null,
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'expired', 'canceled')),
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  name text not null,
  description text,
  duration_mins int,
  in_salon_price int,
  home_price int,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  client_name text,
  client_phone text,
  service_name text,
  amount int,
  date text,
  time text,
  location text,
  status text default 'confirmed',
  created_at timestamptz not null default now()
);

-- Enable row level security; policies assume auth.uid() maps to partner owner.
alter table partners enable row level security;
alter table services enable row level security;
alter table appointments enable row level security;

-- Storefront reads: public can select a single partner by slug (app still never lists all).
-- Dashboard writes: only the owning authenticated partner.
