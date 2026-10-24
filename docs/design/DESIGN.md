---
name: Nocturne Kinetic
colors:
  surface: '#0e1511'
  surface-dim: '#0e1511'
  surface-bright: '#333b36'
  surface-container-lowest: '#09100c'
  surface-container-low: '#161d19'
  surface-container: '#1a211d'
  surface-container-high: '#242c27'
  surface-container-highest: '#2f3632'
  on-surface: '#dde4dd'
  on-surface-variant: '#c6c9af'
  inverse-surface: '#dde4dd'
  inverse-on-surface: '#2b322d'
  outline: '#90937b'
  outline-variant: '#454935'
  surface-tint: '#b6d32a'
  primary: '#ffffff'
  on-primary: '#2b3400'
  primary-container: '#d1f047'
  on-primary-container: '#5a6b00'
  inverse-primary: '#556500'
  secondary: '#b2ccc2'
  on-secondary: '#1e352d'
  secondary-container: '#374e46'
  on-secondary-container: '#a4beb4'
  tertiary: '#ffffff'
  on-tertiary: '#2e312f'
  tertiary-container: '#e2e3df'
  on-tertiary-container: '#636562'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d1f047'
  primary-fixed-dim: '#b6d32a'
  on-primary-fixed: '#181e00'
  on-primary-fixed-variant: '#3f4c00'
  secondary-fixed: '#cee8dd'
  secondary-fixed-dim: '#b2ccc2'
  on-secondary-fixed: '#081f19'
  on-secondary-fixed-variant: '#344b43'
  tertiary-fixed: '#e2e3df'
  tertiary-fixed-dim: '#c5c7c3'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#454745'
  background: '#0e1511'
  on-background: '#dde4dd'
  surface-variant: '#2f3632'
  canvas-noir: '#0A110D'
  surface-dark: '#162019'
  surface-bone: '#F6F7F3'
  border-dark-subtle: '#233227'
  border-dark-strong: '#2E4234'
  neon-lime: '#D4F34A'
  neon-lime-hover: '#CEF138'
  text-on-lime: '#0A110D'
  text-muted: '#8F9D93'
  highlight-tint: '#23381B'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 38px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

The design system embodies a modern, tech-forward editorial personality tailored for frontier software builders, AI practitioners, and forward-looking digital craftspeople. The aesthetic pairs the disciplined restraint of nocturnal editorial design with the energetic punch of utilitarian digital acceleration. It balances high-velocity technical authority with approachable clarity.

The visual style is rooted in **Modern Editorial Dark Minimalism with High-Contrast Cyber-Botanical Accents**. Surfaces shift from obsidian forest-night layers to bone-white modules. High-impact typographic weight contrasts against hyper-tactile neon lime focal points. The interface feels fast, precise, and deliberately engineered—eschewing frivolous decoration in favor of crisp boundaries, structural rhythm, and purposeful hierarchy.

## Colors

The palette establishes an immediate optical tension between deep, low-luminance forest greens and piercing chartreuse neon. 

- **Primary (`#D4F34A`):** The kinetic lime driver. Reserved strictly for conversion CTAs, interactive highlights, key state active indicators, and high-priority badge highlights. Text placed over primary fills is always high-contrast obsidian (`#0A110D`).
- **Secondary (`#122922`):** A dense botanical evergreen, grounding structured sections, headers, and container surfaces.
- **Tertiary (`#F6F7F3`):** Light bone / off-white, employed for high-contrast inverted card surfaces, contextual quote containers, and clean editorial paper-blocks.
- **Neutral (`#0A110D`):** The foundational midnight slate canvas. Deep enough to feel like pure black, but softly tinted with emerald undertones to prevent eye fatigue.

### Color Hierarchy & Accessibility
- **Dark Mode Default:** The canvas lives in dark mode by default (`#0A110D`), layering into `#162019` for elevated cards.
- **Surface Transitions:** When transitioning to bone containers (`#F6F7F3`), all interior typography flips to dark slate (`#0A110D`), maintaining AAA contrast ratios.
- **Accents:** Accent borders on dark cards use muted forest strokes (`#233227`) to maintain crisp boundaries without competing with neon elements.

## Typography

Typography prioritizes geometric confidence and sharp legibility. **Plus Jakarta Sans** serves as the primary system-wide engine, bridging the line between clinical SaaS utility and contemporary editorial punch.

- **Weight Pairing:** High-impact bolding (`700` and `800`) anchors page sections, contrasting cleanly against lighter body weights (`400`). Headlines feature tight negative letter tracking (`-0.02em` to `-0.03em`) for a modern poster sensibility.
- **Editorial Inline Accents:** Key terms or secondary header lines leverage highlighted spans—either via inline block fills of `primary` (`#D4F34A`) with inverted black typography or via delicate cursive sub-annotations when humanizing technical copy.
- **Labels & Micro-Copy:** Small uppercase labels and badge text employ slight positive letter tracking (`+0.02em` to `+0.04em`) to ensure scanability across small viewports.

## Layout & Spacing

The layout is built around a flexible 12-column fluid grid system on desktop, collapsing to 6 columns on tablet and 4 columns on mobile. 

- **Grid Rhythms:** Gutter widths scale from `1rem` on mobile to `1.5rem` across desktop screens. Container max-width tops out at `1200px` for optimal reading velocity and editorial column integrity.
- **Spacing Scale:** Built around an 8-point harmonic base. Element internal spacing leverages micro steps (`space-xs`, `space-sm`) for compact badge padding, while macro intervals (`space-xl`, `space-2xl`) separate distinct narrative content modules.
- **Adaptive Stacking:** Dual-card comparative layouts (such as conversational prompt vs. automated action) stretch horizontally on desktop screens (`6-col / 6-col`) and stack vertically on mobile screens with uniform `space-md` gaps.

## Elevation & Depth

This design system avoids traditional dropped blur shadows, opting instead for **tactile tonal layering and structural vector delineation**:

- **Tonal Stepping:** Elevation is communicated by stepped surface colors. Canvas sits at base zero (`#0A110D`), foundational cards sit at level one (`#162019`), and elevated interactive tiles or inner speech bubbles rest at level two (`#233227`).
- **Surface Inversion:** For focal cards, surfaces shift dramatically to bone-white (`#F6F7F3`), creating instant visual foreground dominance through luminosity rather than drop shadows.
- **Crisp Vector Outlines:** Every container features a 1px uniform structural border (`#233227` on dark layers; `#E5E7EB` on light bone layers). Interactive states swap borders to neon lime (`#D4F34A`).
- **Glow Accents:** Occasional diffuse ambient halos (e.g., `0px 0px 48px rgba(212, 243, 74, 0.12)`) are applied exclusively behind primary conversion blocks to simulate low-light phosphor luminescence.

## Shapes

The geometric identity relies on high-curvature, friendly contours anchored by rigorous architectural grids:

- **Pill Philosophy (`rounded-full`):** All call-to-action buttons, interactive filter chips, badges, and status indicators strictly employ pill shapes (`roundedness: 3` / `9999px`).
- **Curved Structural Enclosures:** Structural cards and major editorial groupings utilize generous radii (`rounded-2xl` / `1.5rem`), softening the technical darkness of the interface.
- **Sub-elements:** Inner interactive modules, form controls, and simulated chat dialogue bubbles use medium rounding (`0.75rem` to `1rem`) to maintain nested harmony inside parent containers.

## Components

### Buttons
- **Primary Button:** Pill-shaped (`rounded-full`), solid electric lime fill (`#D4F34A`), deep noir bold text (`#0A110D`, `label-lg`). Subtle scale on hover (`scale-102`), background shifting to `#CEF138`. No exterior shadow.
- **Secondary / Ghost Button:** Pill-shaped, transparent background with a 1px border (`#233227` or `#2E4234`), bone-white typography (`#F6F7F3`). Hover initiates a background shift to `#162019` and border tint to `#D4F34A`.
- **Icon Suffix:** Action buttons include directional arrows or indicators enclosed in subtle circular badges.

### Badges & Chips
- **Status Badges:** Miniature pill tags (`py-1 px-3`). Text is `label-sm` in bold uppercase. Background uses a low-opacity dark green or soft chartreuse tint with a crisp 1px perimeter border.
- **Filter Chips:** Pill shape with dark background (`#162019`). When active, transitions to solid `#D4F34A` background with black text.

### Cards & Containers
- **Dark Editorial Cards:** Background `#162019`, border 1px solid `#233227`, radius `1.5rem`, padding `space-lg` to `space-xl`.
- **Inverted Bone Cards:** Background `#F6F7F3`, border 1px solid `#E5E7EB`, radius `1.5rem`. Internal text uses `#0A110D`. Interactive inputs within use off-white backings with clean inner boundaries.
- **Highlight Card Modules:** Feature yellow-lime header callouts or highlighted inline tabs that segment steps (e.g., "01 / Step One").

### Form Controls & Inputs
- **Text Fields:** Dark surface (`#122922`), border 1px `#233227`, rounded-xl (`0.75rem`). Text `#F6F7F3`, placeholder `#8F9D93`. On focus: border swaps immediately to `#D4F34A` without heavy ring blurs.
- **Radio & Checkboxes:** Circular / rounded-md toggles with 1.5px borders. Selected state fills with `#D4F34A` housing an obsidian glyph indicator.

### Simulated Dialogue & Interaction Previews
- **Prompt Bubbles:** Used for interactive walk-throughs and scenario previews. User prompts rest in dark containers with muted borders; automated or assistant responses utilize soft mint/chartreuse tints or bone surfaces with clear typography.