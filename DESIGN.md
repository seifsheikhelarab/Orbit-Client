---
name: Orbit
description: A modern job application tracker — Kanban/table pipeline views, CV builder, analytics dashboard, and follow-up management.
colors:
  midnight: "#1a1a2e"
  midnight-hover: "#16213e"
  midnight-container: "#e8e8ed"
  on-midnight: "#ffffff"
  on-midnight-container: "#1a1a2e"
  teal: "#0f766e"
  teal-container: "#ccfbf1"
  on-teal: "#ffffff"
  on-teal-container: "#134e4a"
  surface: "#ffffff"
  surface-dim: "#f8f9fa"
  surface-container-low: "#f8f9fa"
  surface-container: "#f1f3f5"
  surface-container-high: "#e5e7eb"
  surface-container-highest: "#d1d5db"
  on-surface: "#111827"
  on-surface-variant: "#4b5563"
  background: "#fafbfc"
  on-background: "#111827"
  error: "#dc2626"
  error-container: "#fef2f2"
  on-error: "#ffffff"
  on-error-container: "#991b1b"
  success: "#059669"
  success-container: "#ecfdf5"
  on-success: "#ffffff"
  on-success-container: "#064e3b"
  outline: "#d1d5db"
  outline-variant: "#e5e7eb"
  inverse-surface: "#111827"
  inverse-on-surface: "#f8f9fa"
  status-saved: "#4f46e5"
  status-applied: "#4f46e5"
  status-phone-screen: "#8b5cf6"
  status-interview: "#f59e0b"
  status-offer: "#10b981"
  status-closed: "#64748b"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 3vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(0.875rem, 2vw, 1.125rem)"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(0.875rem, 2vw, 1rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.1em"
    textTransform: "uppercase"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.on-midnight}"
    rounded: "{rounded.md}"
    padding: "20px 20px"
    typography: "{typography.title}"
    size: "h-10"
  button-primary-hover:
    backgroundColor: "{colors.midnight-hover}"
    textColor: "{colors.on-midnight}"
    rounded: "{rounded.md}"
    padding: "20px 20px"
    typography: "{typography.title}"
    size: "h-10"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "20px 20px"
    typography: "{typography.title}"
    size: "h-10"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.md}"
    padding: "20px 20px"
    typography: "{typography.title}"
    size: "h-10"
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    rounded: "{rounded.md}"
    padding: "20px 20px"
    typography: "{typography.title}"
    size: "h-10"
  button-accent:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.on-teal}"
    rounded: "{rounded.md}"
    padding: "20px 20px"
    typography: "{typography.title}"
    size: "h-10"
  card-default:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "32px 32px"
  card-elevated:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "32px 32px"
  input-default:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px 16px"
    size: "h-10"
  input-focus:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px 16px"
    size: "h-10"
  badge-default:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.on-midnight}"
    rounded: "{rounded.sm}"
    padding: "10px 10px"
    typography: "{typography.label}"
  badge-status:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "10px 10px"
    typography: "{typography.label}"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.on-midnight}"
    rounded: "{rounded.lg}"
    padding: "14px 20px"
    typography: "{typography.title}"
  nav-item-active:
    backgroundColor: "rgba(255,255,255,0.1)"
    textColor: "{colors.on-midnight}"
    rounded: "{rounded.lg}"
    padding: "14px 20px"
    typography: "{typography.title}"
---

# Design System: Orbit

## 1. Overview

**Creative North Star: "The Command Center"**

Orbit is a command center for the job search — confident, sharp, and calm. Every surface is purposeful; nothing is decorative for the sake of filling space. The deep midnight navy background of the sidebar anchors the user, while the teal accent provides navigational clarity without demanding attention. The tonal surface palette (low to high) creates editorial depth through background shifts rather than shadows, keeping the interface clean and legible.

This system explicitly rejects the generic SaaS cream aesthetic — the muted grays, the uniform card grids, the forgettable B2B dashboard tropes. Instead, each surface has presence through intentional typography (Manrope's sharp geometry for headings, DM Sans' clean warmth for body text), generous whitespace, and a restrained color palette that lets data take center stage.

The job search is uncertain and emotionally taxing. Orbit counters that with a steady, predictable interface. Motion is exponential-eased and purposeful. Navigation is consistent. Every interaction confirms intent through crisp, tactile feedback — the scale-down on click, the hover shadow, the active-state color shift.

**Key Characteristics:**
- **Editorial clarity**: Tonal layering over shadows, generous whitespace, scannable hierarchy
- **Sharp responsiveness**: Every interaction confirms intent — scale, shadow, color shift
- **Calm confidence**: Midnight navy anchors; nothing flashes or demands attention without reason
- **Pipeline as narrative**: Data viz and Kanban views tell the story of progress, not just data

## 2. Colors

A restrained, professional palette anchored by deep midnight navy with a teal accent. The tonal surface ramp provides editorial depth without relying on shadows.

### Primary
- **Midnight** (`#1a1a2e`): The brand anchor. Used for the full-height sidebar background, primary buttons, and as an authoritative base. Its darkness makes the teal accent and white text pop with high contrast.
- **Midnight Container** (`#e8e8ed`): A light tint of midnight used as a subtle background tint for selected states and container highlights.
- **On-Midnight** (`#ffffff`): White text and icons on midnight backgrounds. Meets AAA contrast.

### Accent
- **Teal** (`#0f766e`): The single accent color. Used sparingly — the active nav indicator bar, accent buttons, and badge accents. The cool green-blue hue adds a human, optimistic note to the authoritative midnight base.
- **Teal Container** (`#ccfbf1`): Light teal tint for accent container backgrounds.

### Neutral (Surface)
- **Surface** (`#ffffff`): Primary content surface.
- **Surface Container Low** (`#f8f9fa`): Default card and input background. A whisper off-white that separates content from pure white without introducing warm tint.
- **Surface Container** (`#f1f3f5`): Secondary tier in the tonal ramp. Used for hover states and secondary containers.
- **Surface Container High** (`#e5e7eb`): Highest tier before outline. Used sparingly for emphasis.
- **On-Surface** (`#111827`): Primary body text. Nearly black — meets AAA contrast against all surface tones.
- **On-Surface Variant** (`#4b5563`): Secondary text, labels, metadata. Meets AA on surface tones.

### Semantic
- **Error** (`#dc2626`): Alerts, destructive actions, validation errors.
- **Success** (`#059669`): Confirmations, offer status, positive indicators.
- **Outline** (`#d1d5db`): Borders, dividers, input strokes at rest.
- **Outline Variant** (`#e5e7eb`): Subtle dividers and secondary borders.

### Pipeline Status Colors
Six named statuses, each with a background, text, and border token:
- **Saved / Applied** (indigo `#4f46e5`): Early pipeline.
- **Phone Screen** (violet `#8b5cf6`): Screening phase.
- **Interview** (amber `#f59e0b`): Active interview stage.
- **Offer** (emerald `#10b981`): Positive outcome.
- **Closed** (slate `#64748b`): Terminal states.

### Named Rules
**The Rarity Rule.** The teal accent appears on ≤5% of any given screen. Its rarity is what makes it directional — the active nav bar, the selected badge, the accent button. When everything is accented, nothing is.

**The One-Role Rule.** Surface-container-low is the default card background. Surface-container is for hover and secondary containers. Never use surface-container-highest as a background — it signals an active/interactive state only.

## 3. Typography

**Display Font:** Manrope (with system-ui, sans-serif fallback)
**Body Font:** DM Sans (with system-ui, sans-serif fallback)

**Character:** A geometric + humanist pairing. Manrope's sharp, open apertures give headings presence and precision. DM Sans's rounded terminals and even weight keep body text legible and warm. Together they balance authority (Manrope) with approachability (DM Sans) — the command center voice.

### Hierarchy
- **Display** (ExtraBold 800, clamp(2rem, 5vw, 3.5rem), line-height 1.1, tracking -0.02em): Dashboard metric values, page titles on landing views. `text-wrap: balance` recommended. Appears on no more than one element per viewport.
- **Headline** (Bold 700, clamp(1.25rem, 3vw, 1.75rem), line-height 1.2, tracking -0.01em): Section titles, card headers. Maximum one hierarchy per card or section.
- **Title** (SemiBold 600, clamp(0.875rem, 2vw, 1.125rem), line-height 1.4): Navigation items, button labels, list item headings. The workhorse interactive scale.
- **Body** (Regular 400, clamp(0.875rem, 2vw, 1rem), line-height 1.6): Paragraphs, descriptions, table cells. Capped at 65-75ch max-width in prose contexts.
- **Label** (Bold 600, 0.6875rem / 11px, line-height 1.4, tracking 0.1em, uppercase): Badge text, status indicators, filter chips, section kickers. All-caps by convention — use sparingly; the uppercase density fatigues at volume.

### Named Rules
**The Density Rule.** Label text (11px uppercase) is the smallest scale in the system. Nothing goes below this. If content is too long for label-sm, it belongs in body-sm or should be truncated, not font-size-10px.

## 4. Elevation

Orbit uses **tonal layering** rather than shadow-based depth. Surfaces are distinguished by their background value in the surface-container ramp (low to container to high to highest), not by drop shadows. This keeps the interface clean, editorial, and consistent with the anti-SaaS-cream stance — no floating ghost cards, no ambient shadows competing with content.

Shadows exist but are reserved exclusively for **interactive response states**:
- **Button hover**: `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)` (shadow-sm in Tailwind)
- **Button active**: `box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1)` (pressed state)
- **Elevated card variant**: `box-shadow: 0 25px 50px -12px rgba(26,26,46,0.15)` (shadow-2xl with primary tint)
- **Dropdown / dialog**: `box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1)` (shadow-xl)
- **Focus ring**: `box-shadow: 0 0 0 2px var(--color-primary)` (ring-2 ring-primary)

The tonal ramp (5 tiers) from lightest to deepest:
- surface-container-lowest -> low -> container -> high -> highest

At rest, cards use surface-container-low. Hover raises to surface-container. The elevated card variant uses white surface with shadow-2xl for modals and featured content.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, elevation). A static card should never have a visible shadow.

## 5. Components

### Buttons

**Character:** Sharp and responsive — tactile feedback through scale, shadow, and color shift. The active scale-down (scale-[0.98]) confirms the interaction without animation bloat.

- **Shape:** Gently rounded corners. Default is 12px (rounded-xl), small is 8px (rounded-lg), large is 16px (rounded-2xl). Full-pill reserved for tag/chip patterns only.
- **Primary:** Midnight background (`#1a1a2e`), white text. Hover deepens to midnight-hover (`#16213e`) with a subtle shadow lift. Focus shows a 2px midnight ring with 2px offset.
- **Secondary:** Light container background (`#f7f8fa`), dark text. Hover shifts to white surface.
- **Accent:** Teal background (`#0f766e`), white text. Used sparingly for primary actions on light surfaces.
- **Outline:** Transparent background, midnight border, dark text. Hover fills with surface-container-low.
- **Ghost:** Transparent, muted text. Hover shows surface-container-low background.
- **Destructive:** Red background (`#dc2626`), white text. Only for irreversible actions.
- **Link:** Text-only with underline-on-hover. Inline navigation.
- **Sizes:** xs (28px), sm (32px), default (40px), lg (48px), xl (56px), icon (40px square), icon-sm (32px), icon-lg (48px).
- **Transition:** 200ms ease-out-quart on all interactive properties.
- **Disabled:** 50% opacity, no pointer events.

### Cards / Containers

**Character:** Tonal depth without shadows. The default card uses surface-container-low background with a subtle outline border. The elevated variant (white surface plus shadow) is reserved for dialogs and featured content.

- **Corner Style:** 24px rounded (rounded-2xl) for default size; 16px rounded for compact.
- **Background:** Surface-container-low (`#f8f9fa`) at rest, surface-container (`#f1f3f5`) on hover.
- **Border:** 1px solid outline at 50% opacity.
- **Internal Padding:** 32px default, 20px compact.
- **Variants:** Default (tonal border), Elevated (white bg, shadow-2xl), Outline (transparent, solid border), Glass (backdrop-blur for overlays).

### Inputs / Fields

**Character:** Clean, minimal. The peer-based placeholder technique keeps the label context visible without animation.

- **Style:** 12px rounded, surface-container-low background, outline stroke at rest.
- **Focus:** Border shifts to midnight. No glow.
- **States:** Default (outline border), Focus (midnight border), Error (red border + ring), Disabled (50% opacity).
- **Messages:** Red error text via aria-describedby; muted hint text when no error.

### Badges / Status Tags

**Character:** Compact, all-caps labels for pipeline status. Each stage has its own color family.

- **Shape:** 8px rounded. Padding 10px horizontal.
- **Typography:** 11px, bold 600, uppercase, 0.08em tracking.
- **Variants:** Same structural variants as buttons (default, accent, outline, ghost, destructive) plus 6 pipeline-specific status variants (saved through closed).

### Navigation (Sidebar)

**Character:** Full-height midnight panel as the persistent command console.

- **Background:** Midnight with a subtle 40px editorial grid overlay at 2% opacity.
- **Items:** 36px tall, rounded-2xl (16px), Manrope for brand voice.
- **Active:** White at 10% opacity bg, left accent bar (3px rounded-full teal), icon scales to 110%.
- **Hover/Idle:** White at 60% opacity, hover to 5% bg + full opacity.
- **Typography:** Title scale, 0.02em tracking.

### Dialogs / Modals

**Character:** Centered overlay with backdrop blur.

- **Container:** White, rounded-xl (12px), shadow-xl, ring-1 outline.
- **Overlay:** Inverse-surface at 30% with backdrop-blur-sm, z-50.
- **Close:** Ghost icon button top-right, or explicit button in footer.
- **Transition:** Fade + zoom on open; reverse on close.

## 6. Do's and Don'ts

### Do:
- **Do** use tonal layering for depth instead of shadows. Shadow is for interactive states only.
- **Do** keep the teal accent to ≤5% of any viewport. Its rarity is directional.
- **Do** use Manrope for headings and DM Sans for body text. Don't swap them.
- **Do** cap body text at 65-75ch in reading contexts.
- **Do** use text-wrap: balance on headings and text-wrap: pretty on prose.
- **Do** use surface-container-low as the default card and container background.
- **Do** keep interactive feedback crisp — 200ms ease-out-quart with active scale-down.
- **Do** respect reduced motion: every animation has a prefers-reduced-motion fallback.
- **Do** use tonal surface-container variants for depth (low -> container -> high).

### Don't:
- **Don't** use generic SaaS cream backgrounds or warm-tinted near-whites. The palette is cool and editorial.
- **Don't** pair `border: 1px solid outline` with `box-shadow` blur >= 16px on the same element. Pick one.
- **Don't** default card radius above 24px. Use 24px for cards and 16px for compact variants.
- **Don't** use uppercase tracked text as a default eyebrow above every section.
- **Don't** use numbered section markers (01, 02, 03) as default scaffolding.
- **Don't** animate layout properties. Use transform and opacity only.
- **Don't** use gradient text. Single solid colors only.
- **Don't** use glassmorphism as a default surface treatment.
- **Don't** chain nested cards.
- **Don't** use border-left > 1px as a colored accent stripe.
- **Don't** let headings overflow their container at any breakpoint.
