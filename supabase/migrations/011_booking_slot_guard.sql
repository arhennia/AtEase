-- Reject bookings outside studio hours, in the past, off the slot grid, or on a taken minute.
-- Guest insert policy from 003 is unchanged. This trigger only narrows what a passing insert may store.
-- Studio hours are wall-clock times. The product stores them without a timezone, and booking phones use +91,
-- so the check uses Asia/Kolkata.

create or replace function public.minutes_from_clock(raw text)
returns integer
language plpgsql
immutable
as $$
declare
  cleaned text := upper(trim(coalesce(raw, '')));
  meridiem text;
  hour_part integer;
  minute_part integer;
begin
  if cleaned = '' then
    return null;
  end if;
  meridiem := substring(cleaned from '(AM|PM)$');
  cleaned := trim(regexp_replace(cleaned, '(AM|PM)$', ''));
  hour_part := split_part(cleaned, ':', 1)::integer;
  minute_part := coalesce(nullif(split_part(cleaned, ':', 2), ''), '0')::integer;
  if meridiem = 'AM' and hour_part = 12 then
    hour_part := 0;
  elsif meridiem = 'PM' and hour_part < 12 then
    hour_part := hour_part + 12;
  end if;
  if hour_part < 0 or hour_part > 23 or minute_part < 0 or minute_part > 59 then
    return null;
  end if;
  return hour_part * 60 + minute_part;
exception
  when others then
    return null;
end;
$$;

create or replace function public.taken_booking_slots(
  p_owner_id uuid,
  p_day_start timestamptz,
  p_day_end timestamptz
)
returns table (slot_start timestamptz)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_owner_id is null or p_day_start is null or p_day_end is null then
    return;
  end if;
  if p_day_end <= p_day_start or p_day_end > p_day_start + interval '2 days' then
    return;
  end if;

  return query
  select date_trunc('minute', b.booking_time)
  from public.bookings b
  join public.brand_owners o on o.id = b.owner_id
  where b.owner_id = p_owner_id
    and o.is_active = true
    and b.booking_time >= p_day_start
    and b.booking_time < p_day_end
    and coalesce(b.status, '') not in ('cancelled', 'canceled', 'declined');
end;
$$;

revoke all on function public.taken_booking_slots(uuid, timestamptz, timestamptz) from public;
grant execute on function public.taken_booking_slots(uuid, timestamptz, timestamptz) to anon, authenticated;

create or replace function public.assert_booking_slot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  hours jsonb;
  days text[];
  start_min integer;
  end_min integer;
  local_ts timestamp;
  day_name text;
  minute_of_day integer;
  dow integer;
begin
  if new.booking_time is null then
    raise exception 'Choose a date and time.';
  end if;

  if new.booking_time <= now() then
    raise exception 'That time has already passed.';
  end if;

  select coalesce(
    working_hours,
    '{"start":"09:00","end":"20:00","days_open":["Mon","Tue","Wed","Thu","Fri","Sat"]}'::jsonb
  )
  into hours
  from public.brand_owners
  where id = new.owner_id;

  if hours is null then
    raise exception 'This studio is not available for booking.';
  end if;

  local_ts := new.booking_time at time zone 'Asia/Kolkata';
  dow := extract(dow from local_ts)::integer;
  day_name := (array['Sun','Mon','Tue','Wed','Thu','Fri','Sat'])[dow + 1];

  select coalesce(array_agg(value), array[]::text[])
  into days
  from jsonb_array_elements_text(coalesce(hours->'days_open', hours->'daysOpen', '[]'::jsonb));

  if not (day_name = any (days)) then
    raise exception 'The studio is closed that day.';
  end if;

  start_min := public.minutes_from_clock(coalesce(hours->>'start', '09:00'));
  end_min := public.minutes_from_clock(coalesce(hours->>'end', '20:00'));
  if start_min is null or end_min is null or start_min >= end_min then
    raise exception 'Studio hours are not set.';
  end if;

  minute_of_day := extract(hour from local_ts)::integer * 60 + extract(minute from local_ts)::integer;
  if minute_of_day < start_min or minute_of_day >= end_min then
    raise exception 'That time is outside business hours.';
  end if;

  if tg_op = 'INSERT' and ((minute_of_day - start_min) % 45) <> 0 then
    raise exception 'That time is not an available slot.';
  end if;

  if exists (
    select 1
    from public.bookings b
    where b.owner_id = new.owner_id
      and b.id is distinct from new.id
      and coalesce(b.status, '') not in ('cancelled', 'canceled', 'declined')
      and date_trunc('minute', b.booking_time) = date_trunc('minute', new.booking_time)
  ) then
    raise exception 'That time is already booked.';
  end if;

  return new;
end;
$$;

drop trigger if exists bookings_slot_guard on public.bookings;
create trigger bookings_slot_guard
  before insert or update of booking_time
  on public.bookings
  for each row
  execute function public.assert_booking_slot();
