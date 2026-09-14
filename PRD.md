# PRD: AtEase — Independent Brand Micro-Sites for Solo Service Professionals

<div align="center">

| Field | Value |
| :--- | :--- |
| **Product Title** | AtEase |
| **Author** | Arti Reddy — Founder / Product Manager |
| **Document Status** | Active / In Development |
| **Version** | 2.0 — Brand Enhancer Architecture |
| **Target Users** | Non-tech-savvy, self-employed solo service providers & their clients |

</div>

---

## 1. Problem Statement & Market Context

### Who We're Building For

Independent service professionals — home salon owners, freelance makeup artists, solo nail technicians, private yoga instructors — run real businesses entirely through informal channels: WhatsApp groups, Instagram DMs, and word-of-mouth referrals.

They are operationally capable and often creatively talented, but they are **not technical**. They don't build websites. They don't use CRMs. They manage bookings in their heads or in a notebook.

### The Real Pain Points

| Pain Point | Current Workaround | The Actual Cost |
|:-----------|:-------------------|:----------------|
| No professional booking system | WhatsApp messages, DM replies | Double bookings, missed appointments, no-shows |
| No consistent pricing display | Screenshots of rate cards sent over chat | Clients haggle, brand looks unprofessional |
| No client history or CRM | Memory, paper notes | Lost repeat clients, zero retention data |
| No digital brand presence | A single Instagram grid | No booking link in bio, no standalone page |
| Complex existing platforms | Avoid Fresha/Calendly (too complex) | Stay stuck with informal tools indefinitely |

### What Marketplaces Get Wrong

Existing platforms like Urban Company, Sulekha, and Fresha solve some of these problems — but introduce a critical new one: **they commoditize the provider**.

On a marketplace:
- A client browsing for a facial sees 12 competing providers side-by-side
- The platform suggests "cheaper alternatives" or runs paid promotions for competitors
- The provider's brand identity is subordinate to the platform's brand
- Client data is **owned by the platform**, not the provider

**The provider built their reputation. A marketplace extracts value from it.**

---

## 2. Product Vision

> **AtEase is a white-label SaaS platform that gives every solo service professional their own isolated, professional digital storefront — without writing a single line of code.**

AtEase is positioned **not** as a client-facing directory or marketplace, but as a **brand operating system** for the self-employed. The platform's value flows entirely to the provider and their existing client base.

### Positioning

```
[ High Complexity / Enterprise ]  ──→  Mindbody, Fresha, Calendly
[ Commoditizes the Brand ]        ──→  Urban Company, Sulekha, Housejoy
[ Unstructured / Manual ]         ──→  Instagram DMs, WhatsApp Chat
[ AtEase Sweet Spot ]             ──→  White-label, branded, zero-tech, solo-first
```

---

## 3. Core Architecture: The Isolated Brand Micro-Site Model

This is the foundational design decision that separates AtEase from every competitor.

### 3.1 One URL. One Brand. No Distractions.

Each provider on AtEase receives a unique, permanent URL:

```
atease.com/beautybyarti       → Arti's storefront, exclusively
atease.com/glowbymeena        → Meena's storefront, exclusively
atease.com/navya-nails        → Navya's storefront, exclusively
```

When a client opens one of these URLs:
- They see **only** that provider's services, photos, pricing, and booking form
- There is **no platform navigation** leading them elsewhere
- There is **no "explore similar providers" section**
- There is **no AtEase branding** competing for attention with the provider's brand

### 3.2 Two Completely Separate Route Domains

| Route | Audience | Purpose |
|:------|:---------|:--------|
| `/` (main site) | Potential providers | Sells the AtEase SaaS product: features, pricing, onboarding CTA |
| `/[brandSlug]` | Provider's clients | The provider's isolated booking storefront — no platform context |

The main marketing homepage has **zero overlap** with any brand page. A client who lands on `atease.com/beautybyarti` has no way to accidentally discover `atease.com/glowbymeena`.

### 3.3 Cross-Tenant Data Isolation

All database access is governed by Supabase Row Level Security (RLS):

- A provider can only ever read or write their **own** `brand_owners`, `services`, `clients`, and `bookings` rows
- Public clients can read a provider's active services and submit a booking — nothing more
- The platform never builds or exposes a cross-provider client pool
- **Clients belong to the brand owner who brought them in, permanently**

---

## 4. User Personas

### Persona 1: The Solo Service Professional (Provider)

**Who she is:** Meena, 31, runs a home-based beauty salon in Patia, Bhubaneswar. She has 80+ regular clients, earns ₹40,000–₹70,000/month, and manages everything via WhatsApp. She has an Instagram page with 2,400 followers but no website. She has never used Calendly, Notion, or any SaaS tool.

**Her Goals:**
- Look professional and trustworthy to new clients
- Stop spending 2 hours/day managing bookings over chat
- Collect advance deposits to reduce no-shows
- Track which clients are regulars

**Her Blockers:**
- "I'm not good with tech" — she needs zero-config setup
- "I don't want to pay for a website" — she needs low cost/high value
- "I already have my regulars" — she doesn't need a marketplace to find clients

**What AtEase gives her:**
- A personal booking page she sets up in under 10 minutes
- A shareable link she puts in her Instagram bio and WhatsApp status
- Automated booking notifications so she stops tracking appointments in her head
- A client CRM that builds itself from booking history

---

### Persona 2: The Client / End-User

**Who they are:** Priya, 27, found Meena through Instagram. Meena sends her the AtEase link.

**Her Goals:**
- Book an appointment quickly without calling or waiting for a DM reply
- See clear service prices and time slots upfront
- Get a confirmation she can refer back to

**What AtEase gives her:**
- A clean, mobile-first booking page that loads instantly
- Service catalog with pricing, duration, and photos
- Available time slot selection
- Instant WhatsApp confirmation

Priya never sees any other provider on the platform. She never creates an "AtEase account." She just books with Meena.

---

## 5. Key Features & Functional Requirements

### Module 1: Provider Onboarding (Zero-Code Setup)

The entire setup experience must be completable by a non-technical user in under 10 minutes on a mobile phone.

**Onboarding Steps:**
1. Sign up with phone number + OTP (no email, no password)
2. Enter brand name, owner name, and short bio
3. Upload logo and cover photo (optional but encouraged)
4. Add services — name, description, price, duration, photo
5. Set working hours and service area (locality selection)
6. Add WhatsApp number for booking confirmations
7. Receive unique booking URL → copy and share instantly

**Design Constraint:** Every screen must be operable with one thumb on a mid-range Android phone. Zero jargon. No form should have more than 4–5 fields.

---

### Module 2: Public Brand Storefront (Client-Facing)

The provider's public page at `/[brandSlug]`:

- **Header:** Brand logo, cover image, owner name, professional title, star rating, service area tags
- **About section:** Short bio + WhatsApp contact button
- **Service catalog:** Category-grouped cards with image, name, price (home/salon toggle if applicable), and duration
- **Booking flow:** Select service → pick date → pick time slot → enter name + phone + notes → confirm
- **Confirmation:** On-screen summary + WhatsApp message sent to provider

**Critical constraint:** The storefront has no AtEase navigation, no "explore other providers" links, and no platform branding beyond a subtle footer credit.

---

### Module 3: Provider SaaS Dashboard (Private, Auth-Gated)

The provider's management portal at `/dashboard`:

- **Appointments feed:** Upcoming, today's, and past bookings with status management (pending → confirm / decline → complete)
- **Client list:** Auto-populated from booking history. Shows visit count, total spend, last visited date, and private notes field
- **Service management:** Add, edit, hide, or delete service listings with live preview of how they appear on the public storefront
- **Business settings:** Update working hours, service area, WhatsApp number, brand profile
- **Analytics overview:** Total bookings this month, revenue estimate, top services

---

### Module 4: Booking Engine & Notifications

- **Conflict prevention:** A slot cannot be double-booked; concurrent submissions are handled safely at the database level
- **Status workflow:** `pending` → `confirmed` or `declined` by provider → `completed` or `no_show` or `cancelled`
- **WhatsApp notifications:** Booking confirmation sent to both client and provider via pre-filled WhatsApp deep link (Phase 1) or Twilio API (Phase 2)
- **Advance deposit:** Provider can enable a deposit requirement (Phase 2 feature, noted for scope)

---

## 6. What AtEase Is NOT

Being explicit about what AtEase avoids is as important as what it builds:

| ❌ AtEase Does NOT | Why |
|:---|:---|
| Show competing providers on a client's storefront visit | Protects provider brand and client loyalty |
| Own or share client data across providers | Clients belong to the brand owner |
| Require the provider to build or maintain a website | Platform handles all tech |
| Send marketing emails to a provider's clients about other providers | Data ethics + trust |
| Act as a payment gateway or financial intermediary (Phase 1) | Keep scope small and compliant |
| List providers in a public searchable directory | This is a SaaS tool, not a marketplace |

---

## 7. Technical Architecture

### Route Structure
```
/                          → Main marketing homepage (sell to providers)
/pricing                   → SaaS pricing and plan comparison
/onboarding                → Provider sign-up and setup flow
/dashboard                 → Provider management portal (auth-gated)
/[brandSlug]               → Public booking storefront (client-facing)
/[brandSlug]/book          → Booking form for that specific brand
```

### Database Schema (Supabase)

**`brand_owners`** — Provider profile, location, working hours, WhatsApp number, slug, subscription status

**`services`** — Service listings linked to a brand owner (title, description, price, duration, image_url, is_active)

**`clients`** — Repeat client records per provider (client_name, client_phone, total_bookings, total_spent, last_visited)

**`bookings`** — Appointment records (client_name, client_phone, service_id, booking_time, status, amount)

### RLS Policy Summary
- Providers: full CRUD on their own rows only (`owner_id = auth.uid()`)
- Public: read active services for any brand by slug; insert bookings
- No cross-tenant reads possible at the database level

### Storage
- `service-images` bucket — public read, provider-only upload
- `portfolio` bucket — public read, provider-only upload
- Files namespaced under `{user_id}/` to enforce ownership

---

## 8. Success Metrics (KPIs)

| Metric | Target | Measurement |
|:-------|:-------|:------------|
| Onboarding completion rate | > 70% of signups complete storefront setup | Funnel analytics |
| Booking conversion rate | > 60% of storefront visitors who click "Book" complete a booking | Event tracking |
| Provider 30-day retention | > 50% of providers log in within 30 days of signup | Auth events |
| Client repeat booking rate | > 40% of clients make a second booking within 90 days | Bookings table |
| Avg. provider setup time | < 10 minutes from signup to shareable link | Session recording |

---

## 9. Edge Cases & Handling

| Scenario | Resolution |
|:---------|:-----------|
| Slot booked simultaneously by two clients | DB-level uniqueness constraint + PostgREST concurrency handling prevents double-booking |
| Provider cancels an appointment | Status updated to `cancelled`; client notified via WhatsApp message |
| Client no-show | Provider marks as `no_show`; noted in client record for future reference |
| Provider changes working hours mid-day | New hours apply from next calendar day; existing bookings unaffected |
| Provider wants to block a slot (walk-in) | Quick Block Slot tool creates a `blocked` booking entry for that time |

---

## 10. Phased Rollout Plan

### Phase 1 — Foundation (Current)
- [x] Supabase schema: `brand_owners`, `services`, `clients`, `bookings`
- [x] RLS policies + storage buckets
- [ ] Phone OTP auth wired to Supabase Auth
- [ ] Provider onboarding flow (signup → profile → services → link)
- [ ] Public storefront rendering from live DB data
- [ ] Basic booking form → inserts to `bookings` table
- [ ] Provider dashboard: appointments + status management

### Phase 2 — Growth
- [ ] Twilio SMS notifications (replace WhatsApp deep links)
- [ ] Advance deposit collection (Razorpay integration)
- [ ] Client-facing booking confirmation page at `/booking/[id]`
- [ ] Service portfolio/gallery section on storefronts
- [ ] Provider analytics dashboard (revenue charts, top services)

### Phase 3 — Scale
- [ ] Custom domain support (`bookwithmeena.com` → powered by AtEase)
- [ ] Multi-staff support (add team members under one brand)
- [ ] Add-on services and package bundles
- [ ] Automated review/feedback collection post-completion
- [ ] WhatsApp Business API integration for automated reminders
