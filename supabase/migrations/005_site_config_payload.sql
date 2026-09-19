-- Extra published-site payload: banner, about, menu, categories, packages.
-- Safe to run on existing AtEase projects.

alter table public.site_configs
  add column if not exists payload jsonb not null default '{}'::jsonb;
