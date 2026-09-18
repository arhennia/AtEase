# AtEase System Requirements — Audit & Implementation Plan

**Audit date:** 18 Sep 2026  
**Scope:** every file under `app/src/` plus Supabase migrations  
**Method:** static code review of routes, UI, store, and data models (not a live browser booking run)

---

## Scorecard

| Area | Requirement | Status |
| --- | --- | --- |
| 1. Routing | Landing / Auth (`/`) | **FULFILLED** |
| 1. Routing | Client storefront (`/[brand-slug]`) | **PARTIALLY FULFILLED** |
| 1. Routing | Owner dashboard (`/dashboard`) | **FULFILLED** |
| 1. Routing | Multi-brand admin / managed storefront | **UNFULFILLED** |
| 2. Storefront | Mobile-first `h-[100dvh]`, no overflow | **PARTIALLY FULFILLED** |
| 2. Storefront | Service menu (categories, price, duration) | **FULFILLED** |
| 2. Storefront | Interactive date + time-slot picker | **PARTIALLY FULFILLED** |
| 2. Storefront | Double-booking prevention | **UNFULFILLED** |
| 2. Storefront | Client intake (name, phone, services) | **PARTIALLY FULFILLED** |
| 3. WhatsApp | `wa.me` deep-link with booking details | **UNFULFILLED** |
| 3. WhatsApp | Booking form → WhatsApp launch | **UNFULFILLED** |
| 3. WhatsApp | Save pending/confirmed state on WA initiate | **UNFULFILLED** |
| 4. Dashboard | Today's appointment timeline | **PARTIALLY FULFILLED** |
| 4. Dashboard | Daily revenue + service counters | **PARTIALLY FULFILLED** |
| 4. Dashboard | Catalog + offers (discounts, promo banners) | **PARTIALLY FULFILLED** |
| 5. Supabase | `brands`, `services`, `time_slots`, `appointments` | **PARTIALLY FULFILLED** |
| 5. Supabase | Appointment logging on submit | **PARTIALLY FULFILLED** |

---

## [FULFILLED] Currently working in the codebase

### Landing / Auth (`/`)
- `PlatformLanding` is a public B2B marketing page (value prop, 14-day trial, ₹999/mo).
- Owner login/signup exists via Supabase Auth: Google / phone OTP (`AuthMethods`) plus email/password fallback.
- Routes: `/`, `/login`, `/signup`, `/onboarding`, `/auth/callback`.
- Guards: `RequirePartnerAuth` + `RequireActivePlan` wrap `/dashboard`.

### Isolated client storefront (functional, not exact URL)
- Live brand site at `/p/:partnerSlug` (`ProviderStorefront`).
- Loads brand by slug from Zustand, then Supabase (`fetchPartnerBySlug`).
- Service menu grouped by category, with duration, “upto” price, and optional image.
- Cart + `BookingModal` for book-now / multi-service checkout.
- Owner preview of paused sites: `/p/:slug?preview=1`.

### Owner dashboard (`/dashboard`)
- Auth-gated hub with tabs: Bookings, Menu, Hours, Area.
- Catalog manager can add services, change prices, upload images (Supabase Storage when configured).
- Copy client-site link; open storefront preview.

### Supabase core (owner + catalog + bookings)
- Live schema (master / upgrade migrations) has `brand_owners`, `salons`, `services`, `clients`, `bookings`, `business_analytics`, `profiles`.
- `createAppointmentRecord` inserts into `bookings` when the user is signed in.
- RLS isolates owner data; public can read live storefronts by slug.

---

## [PARTIALLY FULFILLED] Exists but needs adjustments

### 1. Storefront URL is `/p/:slug`, not `/[brand-slug]`
- Spec: `/:brand-slug`. App and PRD use `/p/:partnerSlug`.
- Legacy `/storefront/:providerId` redirects to `/p/:id`.
- **Fix:** keep `/p/:slug` (safer vs colliding with `/dashboard`) *or* add a top-level slug route with a reserved-word denylist.

### 2. Mobile-first viewport
- Layouts use `min-h-screen`, not `h-[100dvh]`.
- Storefront is responsive (`px-4`, sticky category chips, bottom cart bar) but not locked to a mobile viewport.
- Horizontal scroll is used on chips; no global overflow lock on `html/body`.
- Unused `Layout.jsx` still assumes a 480px phone shell; current screens do not use it.
- **Fix:** apply `h-[100dvh] overflow-x-hidden` on storefront + booking shells; prevent layout shift from sticky header / cart bar.

### 3. Date / time picker (static demo slots)
- UI exists in `BookingModal` (primary path) and `DateTimeSelection` (orphaned route).
- Slots are hardcoded morning/afternoon/evening arrays.
- No filter of past times for “today”.
- Hours / blocked slots in `AvailabilityEditor` are local React state only — they do not drive the picker.
- **Fix:** generate slots from owner hours, hide past times, exclude booked + blocked slots.

### 4. Client intake form
- Name + phone exist in `BookingModal` step 4 and `AddressScreen`.
- Both default to dummy `Priya Menon` / `+91 98765 43210`.
- Cart checkout (`CartDrawer`) does not pass `partnerId` / `partnerSlug` into the modal, so the booking can fail owner lookup.
- **Fix:** empty defaults (or auth profile), require name/phone, always pass tenant IDs.

### 5. Today's timeline
- `BookingsList` has ALL / TODAY / TOMORROW chips and a time + client + phone row.
- TODAY filter is string matching (`includes('today')` or day-of-month), which works for seed rows (`date: 'Today'`) and fails for real `booking_time` dates like `Sep 18, 2026`.
- Status is hardcoded “Confirmed”; delay-15 is local-only (toast says “client notified”, nothing is sent).
- **Fix:** filter by calendar day of `booking_time`; sort ascending; show real status.

### 6. Daily metrics
- Dashboard cards show **all-time booking count** and **menu item count**.
- `BookingsList` computes `totalRevenue` but **never renders it**.
- `fetchAnalyticsByOwnerId` exists and is unused. Analytics table is monthly, not daily.
- **Fix:** derive today’s revenue and today’s service count from today’s appointments; show them on the dashboard home.

### 7. Catalog vs offers
- Add / edit price / photo / delete: working (`ServiceCatalogManager` + store sync to `services`).
- No discount fields, no strikethrough promo price, no promotional banner upload on the storefront.
- Cover image is set from logo during onboarding; no banner manager.
- `mockOffers` in `mockData.js` is unused.
- **Fix:** `discount_percent` / `promo_price` on services + `cover_url` / banner upload on the brand.

### 8. Appointment logging
- `BookingModal` does async insert to `bookings` when Supabase is configured.
- `BookingReview.jsx` calls `createAppointmentRecord` / `isSupabaseConfigured` **without importing them** — that path would throw if used.
- The multi-step routes (`/date-time` → `/address` → `/review` → `/success`) are **not linked** from the storefront; `ServiceDetails` still navigates to `/date-time`, which redirects home.
- No Realtime subscription. Dashboard copy says “real time”; it only refetches on login.
- Guest booking is blocked: client must sign in (`client_user_id = auth.uid()`). Spec’s WhatsApp flow is meant to work without that.
- Demo seed appointments still hydrate localStorage when DB is empty.
- **Fix:** one booking path; insert as `pending` before WhatsApp; optional anonymous insert policy; subscribe to `bookings` for the owner.

### 9. Schema names vs spec
| Spec table | What exists | Gap |
| --- | --- | --- |
| `brands` | `brand_owners` | Rename not required; map in docs |
| `services` | `services` | OK |
| `appointments` | `bookings` (live) / `appointments` (unused `001_init.sql`) | Dual schema; app uses `bookings` |
| `time_slots` | none | Missing |

`whatsapp_number` is a column on `brand_owners` and is mapped in `mappers.js`, but onboarding UI never collects it (falls back to phone). Nothing in the UI reads it.

---

## [UNFULFILLED] Missing features / models

### WhatsApp booking (core product gap)
No `wa.me` helper, no pre-filled message, no “Confirm on WhatsApp” CTA.

Need:
1. `buildWhatsAppBookingUrl({ phone, clientName, services, date, time, total })` → `https://wa.me/<e164>?text=...`
2. On confirm: insert `bookings` row (`status: pending`, `booking_source: whatsapp`), then `window.location` / `window.open` the link.
3. Persist owner WhatsApp from onboarding + dashboard; use it as the `wa.me` target.

### Double-booking prevention
- No uniqueness on `(owner_id, booking_time)`.
- Picker never queries existing bookings or blocked slots.
- Two clients can confirm the same slot.

Need: query overlapping `bookings` (pending/confirmed) + duration; disable those slots; add a DB unique/exclusion constraint.

### `time_slots` table
Does not exist. Slots are constants in JS. Either:
- generate from `brand_owners.working_hours` + duration, or
- add `time_slots` / `blocked_slots` and drive the picker from it.

### Admin / managed storefront
- `profiles.role` is only `brand_owner` | `client`.
- No platform-admin role, no impersonation, no “open this brand’s dashboard” switcher.
- `RoleSwitcher` is leftover marketplace UI (Client vs Provider), unused by current routes.

Need: `platform_admin` role + ability to load any `brand_owners` row into the dashboard/storefront editor.

### Promotional offers / banners
No discount editor, no storefront offer badges, no dedicated banner upload.

### Dead / leftover `src` surfaces (not requirements, but they hide the gaps)
Unrouted: `ClientHome`, `ServiceDetails`, `Splash`, `CreateAccount`, `OtpVerification`, `RoleSwitcher`, `Layout`, `TopNav`.  
These still look like a marketplace, not a WhatsApp-first salon storefront.

---

## File-by-file notes (`app/src`)

### Routing & shell
| File | Verdict |
| --- | --- |
| `App.jsx` | Routes `/`, `/dashboard`, `/p/:slug` (+ booking subroutes). No `/:brand-slug`, no admin. |
| `main.jsx` | Vite + React Router bootstrap. |
| `index.css` | Tokens, no-scrollbar. No `dvh` / overflow-x lock. |
| `App.css` | Unused leftover. |
| `Layout.jsx` / `TopNav.jsx` | Unused 480px phone shell. |

### Screens
| File | Verdict |
| --- | --- |
| `PlatformLanding.jsx` | Marketing `/` — fulfilled. |
| `Login.jsx` / `Signup.jsx` / `AuthCallback.jsx` | Owner auth — fulfilled. |
| `Onboarding.jsx` | Brand setup; **no WhatsApp field**. |
| `ProviderStorefront.jsx` | Menu storefront; `min-h-screen`; Book opens modal (not WA). |
| `ProviderDashboard.jsx` | Hub; metrics are not daily revenue. |
| `DateTimeSelection.jsx` | Static slots; not linked from storefront. |
| `AddressScreen.jsx` | Intake with dummy defaults. |
| `BookingReview.jsx` | Missing Supabase imports; confirm is in-app, not WA. |
| `BookingSuccess.jsx` | Success UI; no WA handoff. |
| `TenantStatus.jsx` | Not-found / offline storefront. |
| `ClientHome.jsx` / `ServiceDetails.jsx` / `Splash.jsx` / `CreateAccount.jsx` / `OtpVerification.jsx` | Unrouted leftovers. |

### Components
| File | Verdict |
| --- | --- |
| `BookingModal.jsx` | Full in-app scheduler + Supabase insert. No WA, no slot occupancy check. Dummy intake. |
| `CartDrawer.jsx` | Opens modal **without** `partnerId`. |
| `AuthModal.jsx` / `AuthMethods.jsx` | Client/owner Google + OTP. |
| `RequirePartnerAuth.jsx` / `RequireActivePlan.jsx` | Dashboard gates. |
| `BookingsList.jsx` | Timeline + broken TODAY filter; unused `totalRevenue`. |
| `ServiceCatalogManager.jsx` | CRUD catalog; no discounts/banners. |
| `AvailabilityEditor.jsx` | Local hours/blocks; not wired to picker or DB. |
| `CoverageRadiusEditor.jsx` | Area tool; out of current spec. |
| `PlatformHeader.jsx` / `PlatformFooter.jsx` / `AtEaseLogo.jsx` | Marketing chrome. |
| `TenantHeader.jsx` | Storefront header. |
| `RoleSwitcher.jsx` | Unused marketplace switcher. |
| `Toast.jsx` / `Header.jsx` / `LocationModal.jsx` | Support UI. |

### Data / lib / store
| File | Verdict |
| --- | --- |
| `store/useAppStore.js` | Auth, catalog, local + Supabase appointments. Saves `whatsapp_number`, never uses it. |
| `lib/tenancy.js` | Slug, plan, catalog isolation. Paths are `/p/:slug`. |
| `lib/supabase/*` | Client, auth, brand_owners, services, bookings insert/fetch. No `time_slots`, no WA util, no realtime. |
| `data/tenants.js` / `providerData.js` / `mockData.js` / `mockProviders.js` | Demo seed; `whatsappNumber` unused; `mockOffers` unused. |
| `data/onboardingQuiz.js` | Onboarding presets. |

---

## Implementation plan (close the gaps)

### Phase A — WhatsApp booking (P0) — done in app

1. [x] `app/src/lib/whatsapp.js` — E.164 digits, pre-filled message, `wa.me` URL
2. [x] Collect and edit `whatsapp_number` in onboarding + dashboard
3. [x] Confirm CTA is **Send on WhatsApp**: validate → insert `pending` / `booking_source: whatsapp` → open `wa.me`
4. [x] App no longer requires client Google/OTP to book. **You must run** `supabase/migrations/003_whatsapp_guest_bookings.sql` in the Supabase SQL Editor so guest inserts are allowed.

### Phase B — Honest slots (P0)

1. Prefer generating slots from owner hours + service duration over a new table, unless you need staff-level inventory — then add `time_slots` / `blocked_slots`.
2. On date change, fetch that day’s `bookings` for the owner; disable occupied + past slots.
3. Unique constraint on `(owner_id, booking_time)` where status in (`pending`, `confirmed`).
4. Wire `AvailabilityEditor` hours/blocks to the same source of truth (persist `working_hours` on `brand_owners`).

### Phase C — Dashboard that matches the spec (P1)

1. **Today’s timeline:** filter `booking_time` to local today; sort by time; show name + phone.
2. **Metrics:** today’s revenue sum, today’s booking count (not all-time / menu size).
3. Persist delay / status updates to Supabase.
4. Optional: `supabase.channel` on `bookings` for the owner.

### Phase D — Offers & mobile shell (P1)

1. Storefront shell: `h-[100dvh] overflow-x-hidden`; sticky header + safe-area cart.
2. Service discounts (`promo_price` or `discount_percent`) shown on the menu.
3. Promotional banner: owner uploads `cover_url` / `banner_url`; storefront hero uses it.
4. Empty (not dummy) intake fields.

### Phase E — Admin managed brands (P2)

1. Add `platform_admin` to `profiles.role`.
2. Admin brand picker: load any `brand_owners` into `currentPartnerId` so dashboard + storefront editors work on behalf of the owner.
3. RLS policies for admin read/write.

### Phase F — Cleanup (P2)

1. Delete or stop shipping unrouted marketplace screens.
2. Either wire `/p/:slug/date-time|address|review` into one flow **or** remove them and keep `BookingModal` as the only path (recommended: one path).
3. Fix `BookingReview` imports if that route stays.
4. Document live tables as `brand_owners` + `bookings` (not `brands` / `appointments` / `time_slots`) unless you migrate names.

---

## Suggested build order

1. WhatsApp util + pending insert + deep-link launch  
2. Persist owner WhatsApp number  
3. Occupied-slot query + hide past times  
4. Today timeline + daily revenue/service counters  
5. `h-[100dvh]` storefront + empty intake  
6. Discounts + promo banner  
7. Platform admin impersonation  
8. Remove dead marketplace files  

Until 1–3 ship, the product is an in-app booking demo with a catalog, not the WhatsApp-native salon system in the checklist.
