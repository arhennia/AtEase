-- =============================================================================
-- Storage ownership — paste into the Supabase SQL Editor and Run.
-- Does NOT drop buckets or files. Existing public URLs keep working.
-- Writes are allowed only when the first folder in the object path is auth.uid().
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('service-images', 'service-images', true),
  ('portfolio', 'portfolio', true),
  ('brand-assets', 'brand-assets', true)
on conflict (id) do nothing;

-- Remove every policy that mentions these buckets, including the old
-- "any authenticated user may upload" rules. Those rules are OR-combined,
-- so leaving one in place would still allow a cross-owner write.
do $$
declare
  pol record;
begin
  for pol in
    select pol.polname as policyname,
           coalesce(pg_get_expr(pol.polqual, pol.polrelid), '') as using_expr,
           coalesce(pg_get_expr(pol.polwithcheck, pol.polrelid), '') as check_expr
    from pg_policy pol
    join pg_class cls on cls.oid = pol.polrelid
    join pg_namespace nsp on nsp.oid = cls.relnamespace
    where nsp.nspname = 'storage'
      and cls.relname = 'objects'
  loop
    if (pol.using_expr || ' ' || pol.check_expr) ~* 'service-images|portfolio|brand-assets' then
      execute format('drop policy if exists %I on storage.objects', pol.policyname);
    end if;
  end loop;
end $$;

-- Public pages render these images by URL. Read stays public. Write does not.
create policy "public_read_studio_images"
  on storage.objects
  for select
  using (bucket_id in ('service-images', 'portfolio', 'brand-assets'));

create policy "owners_insert_own_studio_images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id in ('service-images', 'portfolio', 'brand-assets')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners_update_own_studio_images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id in ('service-images', 'portfolio', 'brand-assets')
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id in ('service-images', 'portfolio', 'brand-assets')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners_delete_own_studio_images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id in ('service-images', 'portfolio', 'brand-assets')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
