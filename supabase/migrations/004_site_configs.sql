-- =============================================================================
-- Published website configs — paste into Supabase SQL Editor and Run.
-- Does NOT drop tables. Safe to run on an existing AtEase project.
-- =============================================================================

create table if not exists public.site_configs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique not null references public.brand_owners (id) on delete cascade,
  slug text unique not null,
  business_name text not null default '',
  subtitle text not null default '',
  services jsonb not null default '[]'::jsonb,
  contact_phone text not null default '',
  whatsapp_message text not null default '',
  gallery_urls jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_configs_slug_published_idx
  on public.site_configs (slug)
  where published = true;

drop trigger if exists site_configs_set_updated_at on public.site_configs;
create trigger site_configs_set_updated_at
  before update on public.site_configs
  for each row execute function public.set_updated_at();

alter table public.site_configs enable row level security;

drop policy if exists "public_read_published_sites" on public.site_configs;
create policy "public_read_published_sites"
  on public.site_configs
  for select
  using (published = true);

drop policy if exists "owners_select_own_site" on public.site_configs;
create policy "owners_select_own_site"
  on public.site_configs
  for select to authenticated
  using (owner_id = public.current_brand_owner_id());

drop policy if exists "owners_insert_own_site" on public.site_configs;
create policy "owners_insert_own_site"
  on public.site_configs
  for insert to authenticated
  with check (owner_id = public.current_brand_owner_id());

drop policy if exists "owners_update_own_site" on public.site_configs;
create policy "owners_update_own_site"
  on public.site_configs
  for update to authenticated
  using (owner_id = public.current_brand_owner_id())
  with check (owner_id = public.current_brand_owner_id());
