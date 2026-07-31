# Aura

**AI-powered SaaS platform for independent beauty professionals, helping solo beauty businesses manage appointments, customers, operations, and business growth from a single platform.**

> MVP built for **Kumari & Co.** · Bhubaneswar, India

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Current MVP](#current-mvp)
- [Vision](#vision)
- [Features](#features)
- [AI Roadmap](#ai-roadmap)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Roadmap](#development-roadmap)
- [Long-Term Goal](#long-term-goal)
- [License](#license)

---

# Overview

Aura is an AI-powered Software-as-a-Service (SaaS) platform designed for independent beauty professionals such as home salon owners, freelance makeup artists, hairstylists, nail technicians, beauticians, and other solo service providers.

Small beauty businesses often manage appointments through WhatsApp, phone calls, notebooks, or spreadsheets. While these methods work initially, they become difficult to manage as the customer base grows, leading to scheduling conflicts, missed appointments, poor customer tracking, and limited business insights.

Aura aims to provide an affordable, modern, and intelligent platform that helps independent beauty professionals run their business more efficiently while delivering a seamless booking experience for their customers.

The current implementation serves as the Minimum Viable Product (MVP) for **Kumari & Co.**, validating the customer booking workflow before expanding into a scalable multi-tenant SaaS platform.

---

# Problem Statement

Independent beauty professionals commonly face operational challenges such as:

- Managing appointments through WhatsApp and phone calls
- Double bookings and scheduling conflicts
- Lack of customer history and records
- Manual appointment reminders
- No centralized business dashboard
- Difficulty tracking revenue and bookings
- Limited digital presence
- Expensive software designed primarily for large salons

Most existing salon software targets established businesses with multiple employees, leaving solo professionals with tools that are either too expensive or unnecessarily complex.

---

# Solution

Aura provides a centralized platform that enables beauty professionals to manage their business from one place.

The platform is designed to simplify daily operations by providing:

- Online appointment booking
- Customer management
- Appointment scheduling
- Business insights
- Marketing support
- AI-powered automation
- Business analytics

Instead of building software for a single salon, Aura is designed as a scalable SaaS platform where each business receives its own secure workspace.

---

# Current MVP

The current version focuses on validating the customer booking experience through a complete mobile-first booking flow.

Implemented features include:

- Splash screen
- Phone number authentication
- OTP verification
- Service catalogue
- Service details
- Appointment scheduling
- Date and time selection
- Home service address collection
- Booking review
- Booking confirmation
- Responsive interface
- Smooth page transitions

The MVP is currently customized for **Kumari & Co.**, serving as the foundation for the larger Aura platform.

---

# Vision

Aura aims to become an operating system for independent beauty professionals.

Rather than solving only appointment booking, the platform will eventually provide complete business management capabilities including scheduling, customer management, analytics, AI assistance, marketing, and financial insights.

The goal is to help solo beauty professionals spend less time managing their business and more time serving their customers.

---

# Features

## Customer Features

- Secure phone authentication
- Browse available services
- View service details
- Select preferred appointment date and time
- Book home services
- Appointment review
- Booking confirmation
- Booking history *(planned)*
- Online payments *(planned)*

---

## Business Owner Features

- Appointment management
- Calendar view *(planned)*
- Customer management *(planned)*
- Revenue tracking *(planned)*
- Service management *(planned)*
- Business dashboard *(planned)*
- Marketing tools *(planned)*
- Notification management *(planned)*

---

# AI Roadmap

Artificial Intelligence will become a core part of Aura in future releases.

## Smart Appointment Scheduling

Automatically optimize appointment schedules by minimizing idle time, reducing conflicts, and improving daily planning.

---

## AI Marketing Assistant

Generate promotional content including:

- Instagram captions
- WhatsApp promotions
- Festival campaigns
- Service advertisements

based on current services and seasonal trends.

---

## Intelligent Service Recommendations

Recommend additional services based on customer history and previous appointments.

---

## AI Business Insights

Generate intelligent summaries including:

- Best-performing services
- Customer retention trends
- Monthly business performance
- Revenue growth
- Seasonal demand forecasting

---

## Dynamic Pricing Suggestions

Recommend pricing adjustments during peak demand periods based on historical booking trends.

---

# Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 19 |
| Build Tool | Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Authentication | OTP Authentication (Backend Planned) |
| Backend | Planned |
| Database | Planned |
| AI Integration | Planned |

---

# Architecture

```text
                   Customer
                       │
                       ▼
               React Frontend
                       │
                       ▼
             REST API (Future Backend)
                       │
      ┌────────────────────────────────┐
      │ Authentication                 │
      │ Booking Management             │
      │ Customer Management            │
      │ Analytics Engine               │
      │ AI Recommendation Engine       │
      └────────────────────────────────┘
                       │
                       ▼
                  Database
```

---

# Project Structure

```text
aura/
├── app/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── screens/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── postcss.config.js
│   └── package.json
├── design/
├── LICENSE
└── README.md
```

---

# Getting Started

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
git clone https://github.com/byarti/aura.git

cd aura/app

npm install

npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

# Development Roadmap

## Phase 1 - MVP

- Customer booking flow
- Authentication
- Service catalogue
- Appointment scheduling
- Responsive UI

---

## Phase 2

- Backend API
- Database integration
- Payment gateway
- Push notifications
- Owner dashboard

---

## Phase 3

- Multi-tenant SaaS architecture
- Customer management
- Revenue dashboard
- Analytics
- Subscription plans

---

## Phase 4

- AI Appointment Scheduling
- AI Marketing Assistant
- AI Business Insights
- Recommendation Engine
- Dynamic Pricing
- Business Forecasting

---

# Long-Term Goal

Aura aims to become an affordable AI-powered business operating platform built specifically for independent beauty professionals.

The platform is designed to simplify business operations, improve customer experience, automate repetitive tasks, and provide actionable business insights, enabling solo entrepreneurs to grow their business without relying on multiple disconnected tools.

---

# License

This project is licensed under the **MIT License**.

© 2026 arhennia
