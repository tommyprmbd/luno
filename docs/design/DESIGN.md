---
name: Nocturne Kinetic
colors:
  surface: '#f4fbf4'
  surface-dim: '#d4dcd5'
  surface-bright: '#f4fbf4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef6ee'
  surface-container: '#e8f0e8'
  surface-container-high: '#e2eae3'
  surface-container-highest: '#dde4dd'
  on-surface: '#161d19'
  on-surface-variant: '#454935'
  inverse-surface: '#2b322d'
  inverse-on-surface: '#ebf3eb'
  outline: '#767963'
  outline-variant: '#c6c9af'
  surface-tint: '#556500'
  primary: '#556500'
  on-primary: '#ffffff'
  primary-container: '#d4f34a'
  on-primary-container: '#5c6d00'
  inverse-primary: '#b6d32a'
  secondary: '#4c635b'
  on-secondary: '#ffffff'
  secondary-container: '#cbe6da'
  on-secondary-container: '#50685f'
  tertiary: '#5d5f5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#e5e6e2'
  on-tertiary-container: '#656764'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
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
  background: '#f4fbf4'
  on-background: '#161d19'
  surface-variant: '#dde4dd'
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

The visual style is rooted in **Modern Editorial Light Minimalism with High-Contrast Cyber-Botanical Accents**. Surfaces shift from clean off-white layers to dense forest modules. High-impact typographic weight contrasts against hyper-tactile neon lime focal points. The interface feels fast, precise, and deliberately engineered—eschewing frivolous decoration in favor of crisp boundaries, structural rhythm, and purposeful hierarchy.

## Colors

The palette establishes an immediate optical tension between deep, low-luminance forest greens and piercing chartreuse neon. 

- **Primary (`#D4F34A`):** The kinetic lime driver. Reserved strictly for conversion CTAs, interactive highlights, key state active indicators, and high-priority badge highlights. Text placed over primary fills is always high-contrast obsidian (`#0A110D`).
- **Secondary (`#122922`):** A dense botanical evergreen, grounding structured sections, headers, and container surfaces.
- **Tertiary (`#F6F7F3`):** Light bone / off-white, employed for high-contrast inverted card surfaces, contextual quote containers, and clean editorial paper-blocks.
- **Neutral (`#0A110D`):** The foundational midnight slate canvas. Deep enough to feel substantial, but softly tinted with emerald undertones.

### Color Hierarchy & Accessibility
- **Light Mode Default:** The canvas lives in light mode by default (`#F6F7F3`), layering into elevated botanical surfaces.
- **Surface Transitions:** When transitioning to dark containers (`#122922`), all interior typography flips to light tones, maintaining AAA contrast ratios.
- **Accents:** Accent borders use muted forest strokes to maintain crisp boundaries without competing with neon elements.

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

- **Tonal Stepping:** Elevation is communicated by stepped surface colors. Canvas sits at base light layers, foundational cards sit at elevated tiers, and interactive tiles rest at structural contrast levels.
- **Surface Inversion:** For focal cards, surfaces shift dramatically to botanical evergreen (`#122922`) or bone-white (`#F6F7F3`), creating instant visual foreground dominance through luminosity rather than drop shadows.
- **Crisp Vector Outlines:** Every container features a 1px uniform structural border. Interactive states swap borders to neon lime (`#D4F34A`).
- **Glow Accents:** Occasional diffuse ambient halos (e.g., `0px 0px 48px rgba(212, 243, 74, 0.12)`) are applied exclusively behind primary conversion blocks to simulate low-light phosphor luminescence.

## Shapes

The geometric identity relies on high-curvature, friendly contours anchored by rigorous architectural grids:

- **Pill Philosophy (`rounded-full`):** All call-to-action buttons, interactive filter chips, badges, and status indicators strictly employ pill shapes (`roundedness: 3` / `9999px`).
- **Curved Structural Enclosures:** Structural cards and major editorial groupings utilize generous radii (`rounded-2xl` / `1.5rem`), softening the technical geometry of the interface.
- **Sub-elements:** Inner interactive modules, form controls, and simulated chat dialogue bubbles use medium rounding (`0.75rem` to `1rem`) to maintain nested harmony inside parent containers.

## Components

### Buttons
- **Primary Button:** Pill-shaped (`rounded-full`), solid electric lime fill (`#D4F34A`), deep noir bold text (`#0A110D`, `label-lg`). Subtle scale on hover (`scale-102`), background shifting to `#CEF138`. No exterior shadow.
- **Secondary / Ghost Button:** Pill-shaped, transparent background with a 1px border, high-contrast typography. Hover initiates a background shift and border tint to `#D4F34A`.
- **Icon Suffix:** Action buttons include directional arrows or indicators enclosed in subtle circular badges.

### Badges & Chips
- **Status Badges:** Miniature pill tags (`py-1 px-3`). Text is `label-sm` in bold uppercase. Background uses a low-opacity botanical or soft chartreuse tint with a crisp 1px perimeter border.
- **Filter Chips:** Pill shape with neutral background. When active, transitions to solid `#D4F34A` background with black text.

### Cards & Containers
- **Editorial Cards:** Clean background, border 1px solid, radius `1.5rem`, padding `space-lg` to `space-xl`.
- **Inverted Cards:** Background `#122922` or `#F6F7F3`, border 1px solid, radius `1.5rem`. Internal text configured for optimal contrast.
- **Highlight Card Modules:** Feature yellow-lime header callouts or highlighted inline tabs that segment steps (e.g., "01 / Step One").

### Form Controls & Inputs
- **Text Fields:** Surface fill, border 1px, rounded-xl (`0.75rem`). Text styled for high contrast, placeholder muted. On focus: border swaps immediately to `#D4F34A` without heavy ring blurs.
- **Radio & Checkboxes:** Circular / rounded-md toggles with 1.5px borders. Selected state fills with `#D4F34A` housing an obsidian glyph indicator.

### Simulated Dialogue & Interaction Previews
- **Prompt Bubbles:** Used for interactive walk-throughs and scenario previews. User prompts rest in structured containers with muted borders; automated or assistant responses utilize soft mint/chartreuse tints or clean surfaces with clear typography.