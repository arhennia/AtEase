---
name: Quiet Luxury
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.03em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-xl: 80px
  stack-md: 32px
  stack-sm: 16px
---

## Brand & Style
The design system is centered on "Quiet Luxury"—a philosophy of restraint, premium quality, and effortless composure. It targets a discerning audience seeking wellness and beauty services without the noise of traditional marketing. 

The aesthetic is **Minimalist and Editorial**, characterized by expansive white space, a strictly limited color palette, and high-end typographic hierarchy. The emotional response is one of immediate calm and curated sophistication. The UI should feel like a high-fashion digital lookbook rather than a transactional tool.

## Colors
The palette is strictly monochromatic to maintain an atmosphere of prestige and clarity.

- **Primary (#000000):** Used for headlines, primary actions, and structural borders. It represents authority and timelessness.
- **Secondary/Surface (#F5F5F5):** A soft, neutral grey used for subtle depth, background sections, and hover states.
- **Base (#FFFFFF):** The dominant color. Extensive use of white creates the "luxury" feel through negative space.
- **Functional Grays:** Use subtle tints of black at 40% and 60% opacity for secondary text to maintain legibility without breaking the monochrome harmony.

## Typography
Typography is the primary vehicle for the brand’s voice. 

- **Headlines:** Use **Playfair Display** for all headings. Apply generous letter-spacing (tracking) to larger titles to evoke editorial luxury. 
- **Body & Functional:** Use **Inter** for its neutral, systematic clarity. It ensures that booking details and pricing are easily digestible.
- **Micro-copy:** Use uppercase labels with high tracking for category headers and small descriptors to create a rhythmic, architectural feel.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop to mimic the structured columns of a premium magazine.

- **Desktop:** 12-column grid with a maximum width of 1280px. Use wide 64px outer margins to push content toward the center, emphasizing focus.
- **Mobile:** 4-column grid with 20px margins.
- **Vertical Rhythm:** Utilize "Stack" units. Large sections should be separated by `stack-xl` (80px) to allow the design to "breathe."
- **Alignment:** Content is predominantly left-aligned or centered; avoid justified text to keep the white space organic.

## Elevation & Depth
In keeping with the "Quiet Luxury" aesthetic, traditional shadows are avoided. Depth is achieved through **Tonal Layering** and **Low-Contrast Outlines**.

- **Surface Levels:** The primary background is white. Secondary information or input areas use the light gray (#F5F5F5) to create a subtle "inset" look.
- **Borders:** Use 1px solid lines in #000000 or a 10% black tint. These "ghost borders" provide structure without visual weight.
- **No Shadows:** Do not use drop shadows. If an element needs to feel elevated (like a modal), use a sharp 1px black border to define its perimeter against the white background.

## Shapes
The shape language is primarily **Sharp (0px)** to reflect modern architectural precision. 

- **Cards & Inputs:** Square corners convey a high-end, bespoke feel.
- **Pill Exceptions:** Interactive segment controls and specific "status" chips utilize a full pill-radius (999px) to provide a soft contrast to the otherwise rigid grid.
- **Imagery:** Photos should always be sharp-edged; no rounded corners on gallery or hero images.

## Components

- **Buttons:** 
  - **Primary:** Solid #000000 background with #FFFFFF text. Sharp corners. Use high-contrast for "sticky" booking buttons that remain visible on scroll.
  - **Secondary:** Transparent background with a 1px solid #000000 border.
- **Input Fields:** Minimalist design with only a bottom border (1px solid #000000). Labels sit above the line in the `label-caps` style.
- **Cards:** No shadows. Defined by a 1px #F5F5F5 border. Content within should have generous padding (minimum 32px).
- **Segment Controls:** Pill-shaped containers with a #F5F5F5 background. The active state is a solid #000000 pill with white text.
- **List Items:** Separated by thin 1px lines (#F5F5F5). Use generous vertical padding to avoid a "cluttered" look.
- **Date/Time Pickers:** Clean, monospaced-adjacent numbers using Inter. Focus on a high-contrast selection state (Inverse: Black background, White text).