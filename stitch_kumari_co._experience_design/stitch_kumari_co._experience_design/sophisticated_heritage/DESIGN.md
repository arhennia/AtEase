---
name: Sophisticated Heritage
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
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system is anchored in an aesthetic of "Refined Utility." It bridges the gap between traditional editorial prestige and modern functional minimalism. The brand personality is authoritative yet approachable, evoking the feeling of a premium physical publication translated into a high-performance digital interface.

The visual style is **Corporate Modern with Editorial influence**. It prioritizes clarity and intentionality, using a white-space-first approach to create "breathing room" (the spaciousness) while maintaining tight, disciplined component densities (the compactness). The result is an interface that feels expensive, stable, and highly legible.

## Colors
The palette is a sophisticated "earth-and-ink" combination. **Hunter Green** serves as the primary driver for brand presence and primary actions, offering a sense of growth and stability. **Burnt Orange** is utilized as a strategic accent color for notifications, highlights, or secondary calls-to-action that require warmth and visibility.

**Moss Green** functions as a subtle tertiary tone, ideal for success states, secondary badges, or background washes. **Deep Charcoal** is the dedicated color for all typography and structural iconography, ensuring high legibility and a grounded feel against the stark **White** background. This combination avoids pure blacks to maintain a softer, more "ink-on-paper" quality.

## Typography
The typographic system uses a high-contrast pairing to achieve its classy character. **Newsreader** is the primary display face; its serif terminals and variable weights provide an intellectual, editorial rhythm to headlines. 

**Hanken Grotesk** is used for all functional UI elements, body copy, and labels. Its clean, sharp geometry ensures that even when the layout is "compact," readability remains uncompromised. Labels should frequently use uppercase styling with slight letter spacing to differentiate them from body content.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. To achieve the "compact but spacious" requirement:
1.  **Internal Spacing (Compact):** Use `sm` (16px) or `xs` (8px) for padding inside components like cards and list items. This keeps data-dense areas efficient.
2.  **External Spacing (Spacious):** Use `lg` (40px) and `xl` (64px) for margins between major sections and page headers. 

The vertical rhythm is based on a 4px baseline grid. Components should be grouped tightly, while the groups themselves should be separated by significant white space to guide the eye.

## Elevation & Depth
Depth is communicated through **low-contrast outlines** and **tonal layering** rather than aggressive shadows. This keeps the interface "clean" and "modern."

-   **Level 0 (Background):** Solid White (#FFFFFF).
-   **Level 1 (Cards/Surface):** A 1px border using a 10% opacity of Deep Charcoal. No shadow.
-   **Level 2 (Hover/Active):** A very soft, diffused shadow (Blur: 12px, Y: 4px) with 5% opacity Hunter Green to give a subtle "lift."
-   **Overlays:** Use a 40% opacity Deep Charcoal backdrop blur for modals to maintain focus on the "spacious" layout beneath.

## Shapes
The shape language is **Soft**. A 0.25rem (4px) base radius is applied to buttons, inputs, and small components. This creates a "tailored" look that is friendlier than sharp corners but more professional and "classic" than fully rounded circles. 

Larger containers like cards may scale up to 0.5rem (8px) to soften the overall composition of the page.

## Components
### Buttons
Primary buttons utilize a solid Hunter Green background with White text. Secondary buttons use a Hunter Green 1px outline with Deep Charcoal text. The "Compact" feel is achieved through 8px vertical and 20px horizontal padding.

### Input Fields
Inputs are defined by a 1px border in a lightened charcoal. Upon focus, the border shifts to Hunter Green. Labels are positioned above the field in `label-sm` style for a structured, professional appearance.

### Cards
Cards are flat with a 1px stroke. They should never have "busy" backgrounds. Use Moss Green sparingly for headers or small accents within the card to denote category or status.

### Chips & Badges
Chips use a light wash of Moss Green or Burnt Orange (10% opacity) with the full-strength color used for the text. This keeps the UI light and "spacious" even when multiple tags are present.

### Lists
Lists should have generous vertical padding (`sm` 16px) between items but thin, low-contrast separators to maintain a clean, organized flow.