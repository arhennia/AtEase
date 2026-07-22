# 💇‍♀️ Kumari & Co. — App

The front-end application for **Kumari & Co.**, a mobile-first beauty appointment booking platform built with React + Vite.

> This is the runnable web app inside the [`kumari-and-co`](../) monorepo. For a high-level project overview, design system details, and roadmap, see the [root README](../README.md).

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev
```

### Prerequisites

| Requirement | Minimum Version |
| ----------- | --------------- |
| Node.js     | 18+             |
| npm         | 9+              |

---

## 🛠 Tech Stack

| Layer         | Technology                                                        |
| ------------- | ----------------------------------------------------------------- |
| Framework     | [React 19](https://react.dev)                                     |
| Bundler       | [Vite 8](https://vite.dev)                                        |
| Routing       | [React Router v7](https://reactrouter.com)                        |
| Styling       | [Tailwind CSS v3](https://tailwindcss.com)                        |
| Animations    | [Framer Motion](https://www.framer.com/motion/)                   |
| Icons         | [Lucide React](https://lucide.dev)                                |
| Confetti      | [canvas-confetti](https://github.com/catdad/canvas-confetti)      |
| Linting       | [OxLint](https://oxc.rs)                                          |

---

## 📁 Directory Structure

```
app/
├── public/                        # Static assets served as-is
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                    # Images & SVGs imported by components
│   ├── components/
│   │   ├── Layout.jsx             # Shared layout wrapper with bottom nav
│   │   └── TopNav.jsx             # Top navigation bar
│   ├── data/
│   │   └── mockData.js            # Mock categories, bookings, offers, user data
│   ├── screens/
│   │   ├── Splash.jsx             # Animated brand splash screen
│   │   ├── Login.jsx              # Phone number + Google login
│   │   ├── OtpVerification.jsx    # OTP input & verification
│   │   ├── Home.jsx               # Main dashboard (categories, bookings, offers)
│   │   ├── ServiceDetails.jsx     # Individual service info & pricing
│   │   ├── DateTimeSelection.jsx  # Calendar & time-slot picker
│   │   ├── AddressScreen.jsx      # Address form for at-home services
│   │   ├── BookingReview.jsx      # Order summary before confirmation
│   │   └── BookingSuccess.jsx     # Confetti celebration + booking card
│   ├── App.jsx                    # Route definitions & AnimatePresence
│   ├── App.css                    # Global app styles
│   ├── index.css                  # Tailwind base imports
│   └── main.jsx                   # React DOM entry point
├── index.html                     # HTML shell
├── tailwind.config.js             # Custom theme (colors, fonts, spacing)
├── postcss.config.js              # PostCSS with Tailwind plugin
├── vite.config.js                 # Vite configuration
└── package.json                   # Dependencies & scripts
```

---

## 📱 User Flow

The app follows a linear booking journey:

```
Splash → Login → OTP → Home → Service Details → Date & Time → Address → Review → Success
```

### Routes

| Path          | Screen               | Description                               |
| ------------- | -------------------- | ----------------------------------------- |
| `/`           | `Splash`             | Animated brand intro, auto-redirects      |
| `/login`      | `Login`              | Phone number entry + Google sign-in       |
| `/otp`        | `OtpVerification`    | 4-digit OTP with auto-focus progression   |
| `/home`       | `Home`               | Dashboard with categories & quick-rebook  |
| `/service`    | `ServiceDetails`     | Service info, included items, pricing     |
| `/date-time`  | `DateTimeSelection`  | Calendar & time-slot grid                 |
| `/address`    | `AddressScreen`      | Address form for at-home appointments     |
| `/review`     | `BookingReview`      | Full order summary & confirm button       |
| `/success`    | `BookingSuccess`     | Confetti, booking ID, and action buttons  |

> Page transitions are powered by Framer Motion's `AnimatePresence` with `mode="wait"`.

---

## 📜 Available Scripts

All commands should be run from the `app/` directory.

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start Vite dev server with HMR                |
| `npm run build`     | Build optimised production bundle to `dist/`   |
| `npm run preview`   | Locally preview the production build           |
| `npm run lint`      | Run OxLint for code quality checks             |

---

## 🧩 Key Architectural Decisions

- **`AnimatePresence` at the router level** — wraps all `<Routes>` so every page transition is animated. The `location` object is passed as a `key` to trigger exit/enter animations.
- **Layout route for authenticated pages** — the `/home` route is nested inside a `<Layout />` route that renders a shared bottom navigation bar; other screens (splash, login, booking flow) render without it.
- **Mock data layer** — all data lives in `src/data/mockData.js`, making it straightforward to swap in a real API later without touching UI components.
- **Tailwind v3 with a custom theme** — brand colours, fonts, and spacing tokens are defined in `tailwind.config.js` so the design system stays consistent across the app.

---

## 🔧 Configuration Files

| File                  | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| `vite.config.js`      | Vite settings + React plugin                      |
| `tailwind.config.js`  | Custom colour palette, fonts, and spacing tokens   |
| `postcss.config.js`   | PostCSS pipeline with Tailwind + Autoprefixer      |
| `.oxlintrc.json`      | OxLint rule configuration                          |

---

## 📄 License

MIT — see the [LICENSE](../LICENSE) file in the repo root.
