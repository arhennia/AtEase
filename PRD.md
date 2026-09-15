# PRD: AtEase — Isolated brand sites for solo service professionals

<div align="center">

| Field | Value |
| :--- | :--- |
| **Product Title** | AtEase |
| **Author** | Arti Reddy — Founder / Product Manager |
| **Document Status** | Active / In Development |
| **Version** | 2.1 — Multi-tenant white-label + Supabase auth |
| **Target Users** | Independent studio owners and the clients of those studios |

</div>

---

## 1. Problem

Independent beauty and wellness professionals run real businesses on WhatsApp and Instagram. They need a professional booking page **in their own brand**, not a ranking next to competitors.

Marketplaces (Urban Company, Fresha directories) put providers side by side and own the client relationship. AtEase does the opposite.

---

## 2. Product vision

> White-label SaaS: each owner gets a private client website and a private dashboard. The platform homepage only sells AtEase to new owners.

### Positioning

```
[ Enterprise / complex ]     →  Mindbody, Fresha, Calendly
[ Commoditizes the brand ]   →  Urban Company, Sulekha
[ Manual ]                   →  Instagram DMs, WhatsApp
[ AtEase ]                   →  Branded micro-site + ops dashboard
```

---

## 3. Roles & access

| Role | Can access | Cannot access |
| :--- | :--- | :--- |
| **Platform guest** | `/` marketing, pricing, trial CTA | Dashboards, other people’s sites as a directory |
| **Brand owner** | `/dashboard`, preview of `/p/[slug]` | Other owners’ dashboards or bookings |
| **End-client** | Only the studio link they were given (`/p/[slug]`) | Platform homepage as a shop, other studios, owner dashboard |

End-clients **must sign in** (Google or phone OTP) to confirm a booking so the appointment is tied to `auth.users`.

---

## 4. Product flows

### 4.1 Platform home `/`

B2B landing: value prop, 14-day trial, ₹999/mo after trial. CTA: Start trial / Get started.

### 4.2 Owner auth & onboarding `/signup` `/login` `/onboarding`

1. Google or phone OTP (email/password is a fallback)
2. Brand setup: name, logo, theme, WhatsApp, area, services
3. `trial_ends_at` = now + 14 days, `subscription_status = trial`
4. Unique slug → live site at `/p/[slug]`

### 4.3 Owner dashboard `/dashboard`

Auth + active trial or paid plan required.

- View my website (opens `/p/[slug]?preview=1`)
- Bookings for **this owner only**
- Trial banner / paywall
- Catalog, hours, coverage tools

Expired trial: dashboard and public site pause until subscription is active.

### 4.4 Client site `/p/[slug]`

Shows that brand only. No “back to marketplace”, no other studios. Booking stays on `/p/[slug]/date-time|address|review|success`.

---

## 5. Backend model (Supabase)

There is no custom application server. Supabase is the system of record.

### Core tables (`public`)

- **`brand_owners`** — `user_id` → `auth.users`, slug, owner details, WhatsApp, hours, theme, trial/subscription
- **`salons`** — location entity mapped to an owner
- **`services`** — catalog (`owner_id` / `salon_id`, pricing model, images, `is_active`)
- **`appointments`** — client user + phone, service, slot, status, booking source
- **`clients`** — upserted by trigger on appointment insert (history, LTV)
- **`business_analytics`** — monthly booking count and revenue, updated by the same trigger
- **`profiles`** — `brand_owner` | `client` for the signed-in user

### Supabase-managed

- **`auth.users`** — Google, phone OTP, optional email
- **`storage.objects`** — `brand-assets`, `service-images`

### Isolation rules

- Queries from the app are always scoped by `owner_id` or slug
- RLS: owners only see their rows; clients insert bookings as `client_user_id = auth.uid()`; public can read a **live** storefront by slug, never a listing of all owners
- No global client pool across brands

---

## 6. Auth requirements

| Actor | Methods | After success |
| :--- | :--- | :--- |
| Brand owner | Google, phone OTP | Dashboard, or onboarding if no `brand_owners` row |
| End-client | Google, phone OTP | Stay on the studio URL; allowed to insert an appointment |

OAuth redirect: `/auth/callback`. Phone numbers stored as E.164 (`+91…`).

---

## 7. Routes

```
/                          B2B marketing
/signup /login /onboarding Owner acquisition
/auth/callback             OAuth return
/dashboard                 Owner portal (auth + plan)
/p/:slug                   Isolated client site
/p/:slug/date-time|address|review|success
```

Legacy marketplace paths (`/home`, `/storefront`, `/provider`) redirect away from the directory model.

---

## 8. What AtEase is not

| Not this | Why |
| :--- | :--- |
| Public provider directory | Protects each brand |
| Shared client CRM across studios | Clients belong to the owner who booked them |
| Payment gateway (phase 1) | Direct pay to the studio |
| End-client accounts on the main marketing site | Clients only exist in the context of a studio |

---

## 9. KPIs

| Metric | Target |
| :--- | :--- |
| Onboarding completion | > 70% of owner signups finish brand setup |
| Booking completion | > 60% of “Book” clicks finish after login |
| Owner 30-day return | > 50% |
| Repeat client (same owner) | > 40% within 90 days |

---

## 10. Phased rollout

### Phase 1 (current)

- [x] White-label routes and tenant isolation in the UI
- [x] Supabase schema: owners, salons, services, appointments, clients, analytics
- [x] RLS + booking triggers
- [x] Google + phone OTP in the app (requires dashboard provider setup)
- [ ] Live SMS provider configured in the project
- [ ] Google OAuth credentials in the project
- [ ] Storefront and dashboard fully sourced from DB (demo seed still used when env is empty)

### Phase 2

- Deposits (Razorpay)
- Native WhatsApp / SMS reminders
- Analytics charts from `business_analytics`

### Phase 3

- Custom domains
- Multi-staff under one brand
