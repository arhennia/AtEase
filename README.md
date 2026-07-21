# 💇‍♀️ Kumari & Co.

**Mobile-first beauty appointment booking platform for Kumari & Co., designed to simplify appointment scheduling for customers and solo salon owners.**

> Bhubaneswar · Estd. 2024

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [App Screens](#app-screens)
- [Design System](#design-system)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Kumari & Co. is a boutique appointment-booking web app built for a solo salon business in Bhubaneswar, India. The app offers a polished, mobile-first experience that guides customers through the entire booking flow — from browsing services and selecting a time slot, to providing an address and confirming the appointment. Designed with warm, earthy aesthetics and smooth page transitions, the interface reflects the salon's premium, approachable brand identity.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| **Animated Splash Screen** | Branded entry with parallax motion and auto-redirect |
| **Phone + OTP Login** | Streamlined authentication with Google sign-in option |
| **Service Catalogue** | Categorised services (Hair, Skin, Threading, Waxing, Body) with detailed descriptions |
| **Date & Time Picker** | Interactive calendar and time-slot selection |
| **Address Input** | Delivery/visit address collection for at-home services |
| **Booking Review** | Summary screen before final confirmation |
| **Confetti Success** | Celebratory confirmation with booking details card |
| **Smooth Transitions** | Page-to-page animations via Framer Motion + `AnimatePresence` |

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [React 19](https://react.dev) |
| **Bundler** | [Vite 8](https://vite.dev) |
| **Routing** | [React Router v7](https://reactrouter.com) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev) + [Material Symbols](https://fonts.google.com/icons) |
| **Confetti** | [canvas-confetti](https://github.com/catdad/canvas-confetti) |
| **Linting** | [OxLint](https://oxc.rs) |
| **Fonts** | Newsreader (serif), Inter (sans-serif), Plus Jakarta Sans, Be Vietnam Pro |

---

## 📁 Project Structure

```
kumari-and-co/
├── app/                          # Main application
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/               # Static assets (hero.png, SVGs)
│   │   ├── components/
│   │   │   ├── Layout.jsx        # Shared layout wrapper with bottom nav
│   │   │   └── TopNav.jsx        # Top navigation bar component
│   │   ├── data/
│   │   │   └── mockData.js       # Mock categories, bookings, offers, user data
│   │   ├── screens/
│   │   │   ├── Splash.jsx        # Animated brand splash screen
│   │   │   ├── Login.jsx         # Phone number + Google login
│   │   │   ├── OtpVerification.jsx  # OTP input & verification
│   │   │   ├── Home.jsx          # Dashboard with categories, bookings, offers
│   │   │   ├── ServiceDetails.jsx   # Individual service info & pricing
│   │   │   ├── DateTimeSelection.jsx # Calendar & time-slot picker
│   │   │   ├── AddressScreen.jsx    # Address form for at-home services
│   │   │   ├── BookingReview.jsx    # Order summary before confirmation
│   │   │   └── BookingSuccess.jsx   # Confetti celebration + booking card
│   │   ├── App.jsx               # Route definitions & AnimatePresence
│   │   ├── App.css               # Global app styles
│   │   ├── index.css             # Tailwind base imports
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # HTML shell
│   ├── tailwind.config.js        # Custom theme (colors, fonts, spacing)
│   ├── vite.config.js            # Vite configuration
│   ├── postcss.config.js         # PostCSS with Tailwind plugin
│   └── package.json              # Dependencies & scripts
├── stitch_kumari_co._experience_design/  # UX/UI design assets
├── LICENSE                       # MIT License
└── README.md                     # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/byarti/kumari-and-co.git
cd kumari-and-co/app

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

---

## 📱 App Screens

The booking flow follows this linear user journey:

```
Splash → Login → OTP Verification → Home → Service Details → Date & Time → Address → Review → Success
```

### Splash
Animated brand introduction with a rotating decorative ring, parallax mouse-tracking, and atmospheric gradient blurs. Auto-redirects to Login after 3.5 seconds.

### Login
Phone number input with `+91` prefix, form validation (10 digits), and an alternative Google sign-in option. Clean, minimal layout.

### OTP Verification
Four-digit OTP entry with auto-focus progression between input fields. Includes a resend timer.

### Home
The main dashboard featuring:
- 🔍 Search bar for services
- 📂 Horizontally scrollable category icons
- 📅 "Your Next Session" upcoming appointment card
- 🔁 "Book Again" quick-rebook carousel
- 🎁 Special offer banners with promo codes

### Service Details
Full-page hero image with gradient overlay, service description, "What's Included" cards (Deep Conditioning, Scalp Massage, Steam Treatment), benefit tags, and a sticky bottom price/CTA bar.

### Date & Time Selection
Interactive calendar with available date highlighting and a time-slot grid.

### Address
Form for entering the service location for at-home appointments.

### Booking Review
Complete order summary — service, date, time, address, and price — with a confirm button.

### Booking Success
Celebratory screen with canvas confetti, a large check icon, booking ID, technician info, date/time card, estimated arrival note, and action buttons (Track Booking / Back to Home).

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `primary` | `#355E3B` | Buttons, headings, brand accent (deep forest green) |
| `accent-orange` | `#D27D56` | CTAs, highlights, promo badges |
| `accent-moss` | `#8A9A5B` | Secondary accents, category badges |
| `on-surface` | `#2D2926` | Body text, dark foreground |
| `on-surface-variant` | `#595450` | Secondary text, captions |
| `background` | `#FFFFFF` | Page background |
| `surface-container-low` | `#F9F9F7` | Cards, input fields |
| `outline-variant` | `#E8E8E3` | Borders, dividers |

### Typography

| Role | Font Family | Weights |
| --- | --- | --- |
| Headings / Display | Newsreader (serif) | 400–700 |
| Body / UI | Inter (sans-serif) | 300–600 |
| Accent | Plus Jakarta Sans | 600–700 |
| Labels | Be Vietnam Pro | 400–600 |

### Spacing

| Token | Value |
| --- | --- |
| `container-margin` | 20px |
| `gutter` | 12px |
| `xs` | 4px |
| `sm` | 6px |
| `md` | 12px |
| `lg` | 20px |
| `xl` | 28px |

---

## 📜 Scripts

Run these from the `app/` directory:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run OxLint |

---

## 🗺 Roadmap

- [ ] Backend API integration (appointments, auth)
- [ ] Real OTP verification via SMS gateway
- [ ] Payment gateway integration (Razorpay / UPI)
- [ ] Push notifications for appointment reminders
- [ ] Admin dashboard for salon owner
- [ ] PWA support with offline capabilities
- [ ] Multi-language support (Odia, Hindi, English)
- [ ] Dark mode theme

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

© 2026 byarti
