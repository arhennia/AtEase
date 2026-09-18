-- =============================================================================
-- WhatsApp guest bookings — paste into Supabase SQL Editor and Run.
-- Does NOT drop tables. Safe to run on an existing AtEase project.
--
-- Lets a client confirm a booking without Google / phone OTP:
-- insert a pending row, then open wa.me to the salon owner.
-- =============================================================================

-- Public (anon) insert of pending WhatsApp bookings for a live brand
drop policy if exists "Public can create bookings" on public.bookings;
drop policy if exists "Authenticated clients can create bookings" on public.bookings;
drop policy if exists "whatsapp_guest_insert_pending" on public.bookings;

create policy "whatsapp_guest_insert_pending" on public.bookings
  for insert
  with check (
    status = 'pending'
    and booking_source = 'whatsapp'
    and client_name is not null
    and length(trim(client_name)) > 0
    and client_phone is not null
    and length(regexp_replace(client_phone, '\D', '', 'g')) >= 10
    and exists (
      select 1 from public.brand_owners b
      where b.id = bookings.owner_id
        and b.is_active = true
    )
    and (client_user_id is null or client_user_id = auth.uid())
  );

-- Owners still read/update every booking on their brand (existing policy).
-- Guests do not need SELECT; the app inserts without .select() when logged out.
