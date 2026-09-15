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

## 2. Run the schema

1. SQL Editor → New query
2. Paste **all** of `migrations/001_init.sql`
3. Run

That creates:

| Table | Purpose |
| :--- | :--- |
| `profiles` | App role (`brand_owner` / `client`) linked to `auth.users` |
| `brand_owners` | Studio profile, WhatsApp, theme, trial / subscription |
| `salons` | Location entity per owner |
| `services` | Catalog (fixed / starting_at / dual pricing) |
| `appointments` | Bookings |
| `clients` | Per-studio customer history (filled by trigger) |
| `business_analytics` | Monthly booking/revenue rollups (filled by trigger) |

Plus RLS, `auth.users` trigger → `profiles`, appointment trigger → `clients` + analytics, and Storage buckets `brand-assets` and `service-images`.

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
4. Open that storefront in a private window → Sign in with Google or phone → Book
5. Table Editor: new rows in `brand_owners`, `salons`, `services`, `appointments`, `clients`, `business_analytics`
