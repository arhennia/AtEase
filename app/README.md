# 💅 At Ease Web App

The React + Vite front-end web application for **At Ease Beauty Booking & Provider SaaS Platform**.

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📱 Persona Views & Routes

| Route | View | Description |
| ----- | ---- | ----------- |
| `/` or `/home` | **Client Booking View** | Artist profile (Ananya Sharma), In-Salon vs Home Visit price toggle, expandable service catalog, date & time picker, sticky WhatsApp checkout. |
| `/login` | **Auth & Persona Switcher** | Bottom sheet modal with dual tabs ("Client" vs "Provider Partner"), phone input, country code picker, and OTP verification step. |
| `/provider` or `/dashboard` | **Provider SaaS Dashboard** | Pro Subscription Plan status (`₹999/mo`), operational stats, Fast-Actions (Add/Edit service, Marketing Graphic generator, Copy public link, Quick block slot), catalog price manager, and today's appointment schedule with delay controls. |

---

## 🎨 Design Tokens & Utilities

Defined in `tailwind.config.js` & `src/index.css`:
- **Typography**: `Playfair Display` (Headlines), `Inter` (Body & UI controls).
- **Custom Utilities**: `.ghost-border`, `.solid-border`, `.inset-bg`, `.scrim-bg`, `.slide-up`, `.strikethrough-diagonal`, `.no-scrollbar`.
- **Icons**: `Material Symbols Outlined`.
