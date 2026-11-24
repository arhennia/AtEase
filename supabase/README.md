# What to click in the Supabase dashboard

This folder is the backend. AtEase does not run its own Node/Express server. **Supabase Auth + Postgres + Storage** is the backend. The React app talks to it with the anon key.

## Migration files

| File | Purpose | When to run |
| :--- | :--- | :--- |
| `000_master_setup.sql` | **Full reset** — drops and recreates all tables | ⚠️ Development only. Deletes all data. |
| `001_init.sql` | Empty-project schema (alternative to 000) | Only on a brand-new project. **Never** on top of 000. |
| `002_upgrade_existing.sql` | Adds new columns + RLS to an existing project | Only if you already have the old schema. |
| `003_whatsapp_guest_bookings.sql` | Guest booking RLS policy | Required for WhatsApp bookings. |
| `004_site_configs.sql` | Published site config table | Required for `/s/[slug]` sites. |
| `005_site_config_payload.sql` | Adds `payload` column to site_configs | Additive. |
| `006_packages.sql` | Service packages table | Additive. |
| `007_vip_members.sql` | VIP membership table | Additive. |
| `008_storage_ownership.sql` | Tighter storage policies | Additive. |
| `009_subscriptions.sql` | Plans + subscriptions tables + triggers | Required for paid plans. |
| `010_razorpay_payments.sql` | Razorpay payment records + RPCs | Required for payments. |
| `011_booking_slot_guard.sql` | Booking slot conflict trigger | Required. Prevents double-booking. |
| `012_profile_role_guard.sql` | Locks profile role after signup | Required. Prevents role escalation. |

> **Do not run `001` or `002` if you already ran `000`.** They define the same tables with different column names and will cause errors.

---

## Setup steps

### 1. Create a project

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. New project → copy **Project URL** and **anon public** key
3. In `app/.env.local`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Restart `npm run dev` after saving.

### 2. Run the schema

**Fresh project (recommended):** Paste `000_master_setup.sql` into SQL Editor and Run.

> ⚠️ **`000` drops all AtEase tables and their data.** It is a development reset tool.

**Existing project with old schema:** Run `002_upgrade_existing.sql` first, then run `003` through `012` in order.

**Already have the new schema?** Run only `003` through `012` in order.

### 3. Turn on Google login

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

### 4. Turn on phone OTP

1. Authentication → Providers → **Phone** → Enable
2. Authentication → Settings → pick an SMS provider (Twilio is the usual one)
3. Add Twilio Account SID, Auth Token, and a From number that can send SMS
4. Test with a real phone. India numbers are sent as `+91XXXXXXXXXX`

Without an SMS provider, Google login still works; phone OTP will fail until this is set.

### 5. Confirm Auth settings

- Authentication → Providers → **Email** can stay on (optional email/password fallback)
- Confirm email: you can disable "Confirm email" while developing so signup is instant

### 6. Storage

Buckets are created by the SQL file. Check Storage:

- `brand-assets` (public)
- `service-images` (public)

Uploads must go under `{auth.uid()}/filename`.

### 7. Set up Razorpay (for paid subscriptions)

1. Create a Razorpay account at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Copy your test keys from Settings → API Keys
3. Set Edge Function secrets via the Supabase CLI or dashboard:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxx
   RAZORPAY_KEY_SECRET=your_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   RAZORPAY_ALLOW_LIVE=false
   ```
4. In Razorpay dashboard, add webhook URL:
   `https://YOUR_PROJECT.supabase.co/functions/v1/razorpay-webhook`
5. Subscribe to events: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`

### 8. Verify it works

1. `cd app` → `npm run dev`
2. Open `/signup` → Continue with Google (as a brand owner)
3. Finish onboarding → dashboard + `/p/your-slug`
4. Open that storefront in a private window → Book without logging in → WhatsApp opens
5. Table Editor: new rows in `brand_owners`, `salons`, `services`, `bookings`, `clients`, `business_analytics`
