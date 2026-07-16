---
name: Organic Community Platform
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#424941'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#727970'
  outline-variant: '#c1c9be'
  surface-tint: '#3e6844'
  primary: '#1d4626'
  on-primary: '#ffffff'
  primary-container: '#355e3b'
  on-primary-container: '#a8d6a9'
  inverse-primary: '#a4d2a6'
  secondary: '#924a28'
  on-secondary: '#ffffff'
  secondary-container: '#ffa278'
  on-secondary-container: '#783615'
  tertiary: '#36430d'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d5b23'
  on-tertiary-container: '#c1d28d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bfeec1'
  primary-fixed-dim: '#a4d2a6'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#274f2e'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb596'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#753413'
  tertiary-fixed: '#d9eaa3'
  tertiary-fixed-dim: '#bdce89'
  on-tertiary-fixed: '#161f00'
  on-tertiary-fixed-variant: '#3e4c16'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: beVietnamPro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: beVietnamPro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: beVietnamPro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: beVietnamPro
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 12px
---

## Brand & Style
The design system is built on the philosophy of the "trusted local expert." It moves away from the cold, sterile aesthetics of high-end luxury spas and instead embraces a **Warm Modernist** style. The goal is to evoke the feeling of walking into a sun-drenched, well-kept local boutique in Bhubaneswar—professional yet deeply personal.

The interface prioritizes high-density information to facilitate quick booking, drawing inspiration from efficient consumer apps like Swiggy, but softened through a tactile color palette and rounded geometry. The experience should feel dependable, approachable, and human-centric.

## Colors
The palette is rooted in earth tones to reinforce the "local and organic" narrative. 

- **Primary (Hunter Green):** Used for main actions and brand signifiers. It represents growth, stability, and professional expertise.
- **Background (Cream):** Replaces pure white to reduce eye strain and provide a "paper-like" warmth that feels more personal and less corporate.
- **Secondary (Terracotta):** An accent color used sparingly for notifications, badges, or "New" tags to provide a warm contrast to the green.
- **Neutrals:** We use a deep charcoal instead of pure black for text to maintain a softer contrast against the cream background.

## Typography
The typography strategy pairs **Plus Jakarta Sans** for headlines with **BeVietnamPro** for body text. 

Plus Jakarta Sans offers a soft, modern geometry that feels welcoming in a mobile environment. Its slightly wider apertures ensure legibility at smaller sizes. BeVietnamPro is utilized for all functional text; its contemporary, slightly casual tone avoids the stiffness of traditional corporate fonts, making the app feel like a conversation with a friend.

For mobile-first efficiency, we emphasize the `headline-md` and `body-md` levels to ensure content density remains high without sacrificing the ability to scan information quickly.

## Layout & Spacing
This design system utilizes an **8px grid system** tailored for mobile-first interactions. 

- **Grid Model:** A fluid 4-column grid for mobile devices with a 16px side margin.
- **Compactness:** Vertical spacing is kept tight (using 8px and 16px increments) to allow users to see multiple service options or time slots on a single screen without excessive scrolling.
- **Responsive Behavior:** On larger mobile screens or small tablets, the layout remains centered with a max-width of 480px to maintain the "hand-held" intimacy of a booking tool.

## Elevation & Depth
To maintain the friendly, approachable aesthetic, we avoid heavy drop shadows. Instead, we use **Tonal Layering** and **Soft Umber Shadows**.

- **Surface Tiers:** The primary background is Cream. Interactive cards use a slightly lighter "Off-White" or a very thin 1px border in a muted olive (#E1E5D5) to define boundaries.
- **Shadows:** When depth is required (e.g., for floating booking bars or active cards), shadows use a low-opacity Hunter Green tint rather than gray. This keeps the shadow looking "warm" and integrated into the brand's color story.
- **State Changes:** Selection is indicated by a subtle inner glow or a shift to a slightly more saturated background tone, rather than a lift in elevation.

## Shapes
The shape language is consistently **Rounded**. 

The use of 0.5rem (8px) as the base radius for buttons and cards strikes a balance between modern efficiency and organic softness. Circular elements are used exclusively for user avatars or specific status indicators (like "Active" dots) to provide a clear visual distinction from interactive UI components.

## Components

- **Primary Action Buttons:** These are high-contrast Hunter Green with Cream text. They use the `rounded-lg` (16px) setting to feel "squishy" and tappable.
- **Service Cards:** Designed for density. They feature a small 80x80 thumbnail with rounded corners, a `headline-md` for the service name, and a `label-md` for price and duration. The entire card acts as a single hit area.
- **Time-Slot Chips:** Compact, pill-shaped outlines. When selected, they fill with Hunter Green. Their small footprint allows for a 3-column grid of time slots on a mobile screen.
- **Input Fields:** Minimalist design with a bottom-border only or a very light background fill. Labels are always visible in `label-sm` to ensure the user never loses context during the booking flow.
- **Bottom Navigation:** A simple, 4-item bar with clear icons and `label-sm` text. The active state is indicated by the Hunter Green color and a subtle dot below the icon.
- **Sticky Booking Bar:** A persistent element at the bottom of service pages that displays the current selection total and a "Book Now" button, ensuring the primary goal is always within thumb's reach.