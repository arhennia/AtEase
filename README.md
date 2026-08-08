#  AtEase — Beauty Booking & Provider SaaS Platform

**At Ease** is an AI-enhanced, dual-persona SaaS platform crafted for independent beauty professionals, boutique studio owners, home salon specialists, and their clients.

> Re-architected from design systems in `stitch_at_ease_beauty_booking (3)`, `(4)`, and `(5)`.

---

##  Key Personas & User Journeys

At Ease distinguishes clearly between the **Client** and **Provider (SaaS Partner)** journeys:

```
                          ┌────────────────────────┐
                          │   AT EASE PLATFORM     │
                          └───────────┬────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
   CLIENT BOOKING PERSONA                          PROVIDER SAAS PERSONA
   (Bespoke Service Booking)                       (Business & Catalog Portal)
   • Specialist Profile & Rating                   • Pro Subscription (₹999/mo)
   • In-Salon vs Home Visit Switch                 • Daily Revenue & Booking Stats
   • Service Catalog & Products                    • Fast-Action Tools (Marketing, Block Slot)
   • Date & Time Picker Grid                       • Live Pricing & Policy Controls
   • Sticky WhatsApp Confirmation                  • Today's Schedule & Client Delays
```

---

##  Interactive Screen Implementations

### 1. Client Booking Experience (`/home`) — *Stitch (3)*
- **Specialist Profile**: Artist header showcasing 15+ years experience, 4.9⭐ rating (128 reviews), and service area tags (*Patia & Boutique Studio*).
- **Dynamic Pricing Mode Switch**: Toggle between **In-Salon / Studio** and **Home Visit** rates. All service costs and total calculations update in real-time.
- **Service Catalog**: Expandable cards for Hair Treatments and Facial Care featuring treatment descriptions, images, and curated product lists (Olaplex, Kerastase, Skinceuticals, L'Oréal).
- **Date & Time Picker**: Interactive date strip (Sun 23 - Sat 29) and slot selection grid with availability indicators.
- **Sticky WhatsApp Booking Footer**: Real-time service counter and calculated total with direct pre-filled WhatsApp confirmation messaging.

### 2. Authentication & Persona Switcher (`/login`) — *Stitch (4)*
- **Dual Role Selector**: Top tab toggles between **Client (Book Services)** and **Provider Partner (SaaS)**.
- **Ambient Bottom Sheet Modal**: Slide-up sheet (`scrim-bg`) over tranquil retreat backdrop.
- **Phone & OTP Verification**: Phone input with country code selector (`+91`, `+1`, `+44`, `+971`), 4-digit auto-advancing OTP input, and automated role-based routing.

### 3. Provider SaaS Business Portal (`/provider`) — *Stitch (5)*
- **Pro Monthly Subscription Tier**: Prominent plan badge (`PRO TIER - ₹999/mo`) with an interactive **Subscription Benefits Modal** detailing plan features (Unlimited WhatsApp bookings, Marketing Generator, Multi-tier Pricing, Priority Support).
- **Operational Metrics**: "Good Morning, Aisha" greeting displaying daily schedule metrics (*3 Bookings Today • ₹5,400 Estimated Revenue*).
- **Fast-Action Grid**:
  - **Add / Edit Service**: Modal form to add treatments with separate in-salon & home visit rates.
  - **Generate Festival Marketing Graphic**: Generates promotional WhatsApp status banners with one-click download & WhatsApp share.
  - **Share Public Booking Link**: One-click link copier with toast feedback (`atease.beauty/luxe-studio-aisha`).
  - **Quick Block Slot**: Blocks time slots for walk-in offline clients or breaks.
- **Service Catalog & Policy Controls**: Live pricing edits for In-Salon & Home Visit rates, toggle for Home Visit availability, toggle for required consultation, and duration editors.
- **Live Schedule & Client Delay**: Today's appointment feed with segment filter (*TODAY*, *TOMORROW*, *THIS WEEK*), delay controller (+15m / +30m notification trigger), and direct Google Maps directions link.

---

## 🛠 Tech Stack

| Component     | Technology |
| ------------- | ---------- |
| **Framework** | [React 19](https://react.dev) |
| **Bundler**   | [Vite 8](https://vite.dev) |
| **Routing**   | [React Router v7](https://reactrouter.com) |
| **Styling**   | [Tailwind CSS v3](https://tailwindcss.com) + Custom At Ease Design System |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Typography**| Playfair Display (Headlines) & Inter (Body & Controls) |
| **Icons**      | Material Symbols Outlined |

---

## Getting Started

```bash
# 1. Navigate to web application directory
cd app

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build production bundle
npm run build
```

---

##  Workspace Structure

```
AtEase/
├── app/                                 # React + Vite application
│   ├── src/
│   │   ├── screens/
│   │   │   ├── Home.jsx                 # Client Bespoke Beauty Booking View (Stitch 3)
│   │   │   ├── Login.jsx                # Phone Auth & Persona Switcher Modal (Stitch 4)
│   │   │   ├── ProviderDashboard.jsx    # Provider SaaS Portal & Catalog/Schedule (Stitch 5)
│   │   │   └── OtpVerification.jsx      # Standalone OTP sheet handler
│   │   ├── App.jsx                      # Route definitions (/home, /login, /provider)
│   │   ├── index.css                    # Design system tokens & utility classes
│   │   └── main.jsx                     # Entry point
│   ├── index.html                       # Google fonts setup
│   ├── tailwind.config.js               # At Ease typography, color, & spacing tokens
│   └── package.json
├── stitch_at_ease_beauty_booking (3)/   # Client View Design Source HTML
├── stitch_at_ease_beauty_booking (4)/   # Authentication Sheet Design Source HTML
├── stitch_at_ease_beauty_booking (5)/   # Provider Dashboard Design Source HTML
└── README.md                            # Project documentation
```

---

##  License

MIT License. Designed and developed for **At Ease** Beauty SaaS.
