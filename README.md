# AtEase — White-label booking SaaS for solo studios

**AtEase** is a multi-tenant brand platform for independent service professionals. It is **not** a marketplace. The main domain sells the product to brand owners. Each owner gets an isolated client site. Clients of Partner A cannot browse Partner B.

---

## What changed (architecture)

| Surface | Who sees it | Route |
| :--- | :--- | :--- |
| B2B marketing home | Prospective brand owners | `/` |
| Trial signup / login | Brand owners | `/signup` `/login` `/onboarding` |
| Owner dashboard | Authenticated brand owner only | `/dashboard` |
| Isolated client site | That studio's clients only | `/p/[brandSlug]` |

There is no public directory of studios. Booking flows stay under `/p/[brandSlug]/…`.

---

## Auth (owners and clients)

Both **brand owners** and **end-clients** sign in with:

- **Google**
- **Phone OTP** (SMS)

Owners use `/login` and `/signup`. Clients sign in on the studio site before a booking is saved. Credentials live in Supabase `auth.users`. App roles live in `public.profiles` (`brand_owner` or `client`).

---

## Backend (Supabase — there is no custom Node server)

Postgres + Auth + Storage **is** the backend. The React app calls it with the anon key. Row Level Security enforces tenant isolation.

### App tables

| Table | Purpose |
| :--- | :--- |
| `profiles` | Role + name/phone linked to `auth.users.id` |
| `brand_owners` | Studio profile, WhatsApp, theme, trial / subscription |
| `salons` | Business location(s) for an owner |
| `services` | Catalog (fixed / starting_at / dual prices, images, active flag) |
| `appointments` | Bookings (client, service, slot, status, source) |
| `clients` | Per-studio customer history + lifetime value (trigger on booking) |
| `business_analytics` | Monthly booking count / revenue (trigger on booking) |

### Managed by Supabase

| Schema | Role |
| :--- | :--- |
| `auth.users` | Google / phone / email identities. `brand_owners.user_id` and `profiles.id` point here. |
| `storage.objects` | Metadata for logos, covers, service photos in buckets `brand-assets` and `service-images`. |

SQL, RLS, triggers, and storage policies: [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)

Click-by-click dashboard setup: [`supabase/README.md`](supabase/README.md)

---

## Tech stack

| Layer | Tool |
| :--- | :--- |
| App | React 19 + Vite + React Router v7 |
| State | Zustand |
| Style | Tailwind CSS + AtEase tokens |
| Backend | Supabase (Auth, Postgres, RLS, Storage) |

---

## Run locally

```bash
cd app
npm install
cp .env.example .env.local
# fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

On Windows PowerShell, if `npm` is blocked, use `npm.cmd run dev`.

Until env vars are set, the UI still runs with local demo data. Google and phone login need a live Supabase project.

**Useful URLs**

- Platform: `/`
- Owner login: `/login`
- Dashboard (after auth): `/dashboard`
- Example tenant: `/p/rajkumari-beauty`

---

## Repo layout

```
AtEase/
├── app/                         React + Vite client
│   ├── src/
│   │   ├── lib/supabase/        Supabase client split by domain
│   │   │   ├── client.js
│   │   │   ├── auth.js          Google + phone OTP + email
│   │   │   ├── profiles.js
│   │   │   ├── brandOwners.js
│   │   │   ├── salons.js
│   │   │   ├── services.js
│   │   │   ├── appointments.js
│   │   │   ├── clients.js       clients + analytics reads
│   │   │   └── index.js
│   │   ├── screens/             Landing, auth, dashboard, tenant site
│   │   ├── components/auth/     Guards + AuthMethods
│   │   └── store/useAppStore.js
│   └── .env.example
├── supabase/
│   ├── migrations/001_init.sql  Schema + RLS + triggers + storage
│   └── README.md                Dashboard checklist
├── PRD.md
└── README.md
```

---

## License

MIT. Built for independent service professionals who need a branded site, not a marketplace listing.
