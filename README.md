#  AtEase — Your Brand. Your Clients. Your Platform.

**AtEase** is a white-label SaaS platform that gives independent, self-employed service providers their own professional booking website — without needing to know how to code, design, or manage servers.

Think of it as handing every solo beauty professional, home-based salon owner, or independent freelancer their own *Linktree meets Calendly meets Fresha* — fully branded to **them**, not to AtEase.

---

##  The Core Idea: Not a Marketplace. A Brand Launcher.

Most booking platforms (Urban Company, Fresha, Sulekha) operate as **marketplaces** — they list dozens of competing providers side-by-side, and every client visit is an opportunity for the platform to cross-sell a competitor.

**AtEase flips this entirely.**

Each brand owner on AtEase gets their own:

- **Isolated storefront URL** — e.g. `atease.com/beautybyarti`
- **Zero cross-listing** — clients who open that link see *only* that provider's services, pricing, photos, and booking form
- **No platform directory** — there is no public search bar that leads clients away to another professional
- **True brand ownership** — the storefront looks like *their* personal website, not a profile on someone else's platform

```
Main Platform (/)                     Brand Pages (/[brandSlug])
────────────────────────────────      ─────────────────────────────────────
Sells AtEase to providers.            Exclusively serves the provider's clients.
Feature highlights, pricing,          Their services, photos, availability,
onboarding CTA, demo videos.          and booking form — nothing else.
```

---

##  Who Is This For?

AtEase is purpose-built for **non-tech-savvy, self-employed service professionals** who run their business from WhatsApp, Instagram DMs, and word-of-mouth — but want a more professional, automated system without the complexity of building a website.

| User | Their Current Reality | What AtEase Gives Them |
|:-----|:----------------------|:-----------------------|
| Home salon owner | Takes bookings over WhatsApp, forgets appointments | A public booking page + auto-confirmation |
| Freelance makeup artist | Sends rates in DMs, no deposit system | Service catalog with pricing + booking form |
| Independent nail tech | Loses repeat clients because there's no CRM | Client history, repeat visit tracking |
| Solo yoga instructor | Uses Google Calendar + manual invoicing | Scheduling, booking, and client record in one place |

---

##  How It Works

```
                        ┌─────────────────────────────┐
                        │      ATEASE PLATFORM         │
                        └──────────────┬──────────────┘
                                       │
              ┌────────────────────────┴────────────────────────┐
              ▼                                                  ▼
    PROVIDER JOURNEY                                  CLIENT JOURNEY
    (SaaS Dashboard)                                  (Brand Storefront)
    ─────────────────────────────────                 ──────────────────────────────
    • Sign up with phone OTP                          • Opens link shared by provider
    • Complete brand profile                            (e.g. atease.com/beautybyarti)
    • Add services + prices + photos                  • Sees only that brand's catalog
    • Set working hours & service area                • Picks a service + date + time
    • Get their unique booking link                   • Submits name, phone, notes
    • Manage appointments + clients                   • Gets WhatsApp confirmation
    • Track revenue + booking history                 • Provider is notified instantly
```

---

##  Key Features

### For the Service Provider (SaaS Dashboard)
- 📱 **Phone OTP sign-up** — no email or password needed
- 🎨 **Brand profile setup** — logo, cover photo, brand colors, bio
- 🛍️ **Service catalog management** — add/edit services with photos, prices (fixed, home/salon, hourly), and duration
- 📅 **Booking management** — view, confirm, decline, or complete appointments
- 👥 **Client records** — auto-tracks client history, visit count, and total spend per provider
- 🔗 **One-click link sharing** — instant copy of public booking URL for Instagram bio / WhatsApp status
- ⏰ **Working hours & service area config** — set availability and coverage localities

### For the Client (Public Storefront)
- 🌐 **Mobile-first storefront** — loads instantly, no app download needed
- 📋 **Clean service listing** — with pricing and estimated duration
- 🗓️ **Slot selection** — pick an available date and time
- 📲 **WhatsApp booking confirmation** — instant notification to both client and provider
- 🔒 **Data isolation** — client data belongs to the provider who brought them in, never shared

---

##  Architecture Highlights

### Scoped Routing
Every public-facing booking page is scoped entirely to a single brand owner by their `slug`:

```
GET /[brandSlug]         → Public storefront for that brand only
GET /[brandSlug]/book    → Booking form for that brand
GET /dashboard           → Provider's private SaaS portal (auth-gated)
```

### Supabase Row Level Security
All database policies enforce strict cross-tenant isolation:
- Providers can only read/write their own `brand_owners`, `services`, `clients`, and `bookings` rows
- Public clients can read active services and submit bookings — nothing more
- No provider can ever query or accidentally see another provider's client data

### No Shared Client Pool
The platform has no global client database that it "owns". Every client record belongs to a specific `owner_id` and is inaccessible to anyone else on the platform.

---

##  Tech Stack

| Component     | Technology |
|:-------------|:-----------|
| **Framework** | [React 19](https://react.dev) |
| **Bundler**   | [Vite](https://vite.dev) |
| **Routing**   | [React Router v7](https://reactrouter.com) |
| **Styling**   | Tailwind CSS v3 + Custom AtEase Design System |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Backend**   | [Supabase](https://supabase.com) (Auth, Database, RLS, Storage) |
| **Typography**| Playfair Display (Headlines) · Inter (Body) |
| **Icons**     | Material Symbols Outlined |

---

##  Getting Started

```bash
# 1. Navigate to the web app directory
cd app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Start local development server
npm run dev
```

---

##  Project Structure

```
AtEase/
├── app/                                  # React + Vite application
│   ├── src/
│   │   ├── screens/
│   │   │   ├── ClientHome.jsx            # Public storefront (client-facing)
│   │   │   ├── ProviderStorefront.jsx    # Provider's public booking page
│   │   │   ├── ProviderDashboard.jsx     # Private SaaS dashboard (auth-gated)
│   │   │   ├── OtpVerification.jsx       # Phone OTP verification flow
│   │   │   └── ServiceDetails.jsx        # Individual service detail page
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── AuthModal.jsx         # Phone auth bottom sheet
│   │   │       ├── BookingModal.jsx      # Appointment booking flow
│   │   │       ├── CartDrawer.jsx        # Service selection drawer
│   │   │       └── Header.jsx            # Shared navigation header
│   │   ├── lib/
│   │   │   ├── supabase.js              # Supabase client + DB helpers
│   │   │   └── tenancy.js               # Slug + multi-tenant utilities
│   │   ├── store/
│   │   │   └── useAppStore.js           # Zustand global state
│   │   ├── data/                         # Mock/seed data (pre-Supabase)
│   │   ├── App.jsx                       # Route definitions
│   │   ├── index.css                     # Design system tokens
│   │   └── main.jsx                      # Entry point
│   ├── index.html
│   └── package.json
├── lib/                                  # Shared utilities
├── PRD.md                                # Product requirements document
└── README.md
```

---

##  License

MIT License. Built for independent service professionals who deserve better tools.
