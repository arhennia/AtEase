# What to click in the Supabase dashboard

This folder is the backend. AtEase does not run its own Node/Express server. **Supabase Auth + Postgres + Storage** is the backend. The React app talks to it with the anon key.

## 1. Create a project

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. New project → copy **Project URL** and **anon public** key
3. In `app/.env.local`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Restart `npm run dev` after saving.

## 2. Run the schema (one query)

Paste **all** of `migrations/000_master_setup.sql` into SQL Editor and Run.

That is the replacement for your old master query. It drops and recreates the AtEase tables (data in those tables is deleted). Do not also run `001` or `002`.

## 3. Turn on Google login

1. Authentication → Providers → **Google** → Enable
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
3. Authorized redirect URI from Supabase (shown on the Google provider page), usually:
   `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Paste Client ID + Client Secret into Supabase
5. Authentication → URL Configuration:
   - **Site URL:** `http://localhost:5173` (prod domain later)
   - **Redirect URLs:** add
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173/**`
     - your production origin `/auth/callback`

## 4. Turn on phone OTP

1. Authentication → Providers → **Phone** → Enable
2. Authentication → Settings → pick an SMS provider (Twilio is the usual one)
3. Add Twilio Account SID, Auth Token, and a From number that can send SMS
4. Test with a real phone. India numbers are sent as `+91XXXXXXXXXX`

Without an SMS provider, Google login still works; phone OTP will fail until this is set.

## 8. WhatsApp guest bookings (required for Phase A)

Clients book without logging in. The app inserts a **pending** row, then opens `wa.me`.

Paste **all** of `migrations/003_whatsapp_guest_bookings.sql` into SQL Editor and Run.

Then on the owner dashboard, save a real 10-digit WhatsApp number. New studios collect this during onboarding.

How you know it worked:

1. Open a storefront (`/p/your-slug`) in a private window (no login)
2. Book a service → Send on WhatsApp
3. WhatsApp opens with name, services, date, time, and total
4. Table Editor → `bookings` shows a `pending` row with `booking_source = whatsapp`

## 5. Confirm Auth settings

- Authentication → Providers → **Email** can stay on (optional email/password fallback)
- Confirm email: you can disable “Confirm email” while developing so signup is instant

## 6. Storage

Buckets are created by the SQL file. Check Storage:

- `brand-assets` (public)
- `service-images` (public)

Uploads must go under `{auth.uid()}/filename`.

## 7. How you know it worked

1. `cd app` → `npm run dev`
2. Open `/signup` → Continue with Google (as a brand owner)
3. Finish onboarding → dashboard + `/p/your-slug`
4. Open that storefront in a private window → Book without logging in → WhatsApp opens
5. Table Editor: new rows in `brand_owners`, `salons`, `services`, `bookings`, `clients`, `business_analytics`
