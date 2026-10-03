-- Profile role is assigned once, when the auth user is created.
-- A signed-in user cannot change profiles.role or insert a studio
-- unless that stored role is already brand_owner.
-- Additive only: does not drop tables or existing rows.

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and new.role is distinct from 'client' then
    if coalesce(current_setting('atease.profile_role_sync', true), '') is distinct from '1' then
      raise exception 'profile role cannot be self-assigned' using errcode = '42501';
    end if;
  elsif tg_op = 'UPDATE' and new.role is distinct from old.role then
    if coalesce(current_setting('atease.profile_role_sync', true), '') is distinct from '1' then
      raise exception 'profile role cannot be changed' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard
  before insert or update on public.profiles
  for each row execute function public.protect_profile_role();

-- Same body as 002, plus the transaction-local flag so this trigger
-- can write the signup role. Later updates still cannot change role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform set_config('atease.profile_role_sync', '1', true);
  insert into public.profiles (id, role, full_name, email, phone, avatar_url)
  values (
    new.id,
    case
      when new.raw_user_meta_data->>'role' = 'brand_owner' then 'brand_owner'
      else 'client'
    end,
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

-- Reads the stored role without going through profiles RLS, so the
-- update policy can require "new role = stored role" without recursion.
create or replace function public.profile_role_is(expected text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = expected
  );
$$;

revoke all on function public.profile_role_is(text) from public;
grant execute on function public.profile_role_is(text) to authenticated;

-- Replace the permissive policies. Multiple policies are OR'd, so the
-- old "id = auth.uid()" policy has to be dropped or it would still allow
-- a role change.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and public.profile_role_is(role)
  );

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check (id = auth.uid() and role = 'client');

revoke insert (role), update (role) on table public.profiles from public, anon, authenticated;

drop policy if exists "brand_owners_insert_own" on public.brand_owners;
create policy "brand_owners_insert_own" on public.brand_owners
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'brand_owner'
    )
  );
