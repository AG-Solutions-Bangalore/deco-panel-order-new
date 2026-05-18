# DESIGN.md — Universal Admin Dashboard Design System

## Product identity

**System name:** Universal Admin Dashboard System
**Product type:** Reusable enterprise-grade admin dashboard design system for SaaS, ERP, CRM, LMS, inventory, operations, finance, HR, analytics, healthcare, logistics, and institutional platforms
**Primary users:** Admins, operators, managers, analysts, support staff, internal teams
**Core goal:** Provide a scalable, production-ready UI foundation for operational web applications with consistent layouts, components, theming, accessibility, data-heavy workflows, and modern dashboard architecture.

This document is the single source of truth for UI, theming, typography, spacing, components, layouts, interaction patterns, accessibility rules, and AI-assisted generation constraints.

The system is designed to support:

* Data-heavy workflows
* CRUD interfaces
* Table-first dashboards
* Reporting systems
* Internal tools
* Multi-role admin products
* Operational SaaS applications
* Enterprise workflows
* Scalable frontend architectures

---

# Design philosophy

The UI must feel:

* Professional
* Quietly premium
* Structured
* Reliable
* Operational
* Typography-led
* Dense but readable
* Systematic instead of decorative

The interface should prioritize:

* Clarity over novelty
* Information hierarchy over visual noise
* Structured spacing over visual effects
* Neutral surfaces over colorful decoration
* Real operational usability over marketing aesthetics

---

# Hard anti-AI rules

The UI must not look like a generic AI-generated SaaS template.

## Never do these

* Do not use purple, violet, or indigo as the primary brand color.
* Do not use mesh gradients.
* Do not use glowing blobs or aurora backgrounds.
* Do not use neon visual effects.
* Do not use glassmorphism for core app surfaces.
* Do not use oversized rounded corners everywhere.
* Do not use decorative gradient borders.
* Do not use crypto-style dark dashboards.
* Do not use floating cards with random spacing.
* Do not use center-aligned dashboard layouts by default.
* Do not use excessive shadows.
* Do not use icon-in-colored-circle feature grids repeatedly.
* Do not use random visual styles outside the token system.
* Do not use Dribbble-style concept-art dashboards.

## General aesthetic rule

The UI must be:

* Neutral-first
* Border-driven
* Surface-layered
* Typography-led
* Layout-consistent
* Production-ready

Visual hierarchy should come primarily from:

* Spacing
* Contrast
* Surface layering
* Typography
* Alignment
* Density
* Border structure

—not from loud colors or effects.

---

# Core stack

## Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* React
* shadcn/ui-style architecture
* React Hook Form
* Zod
* TanStack Table
* Zustand or Context API
* Recharts or Chart.js

## Backend

* Node.js
* Express.js
* MongoDB or PostgreSQL
* Mongoose or Prisma
* JWT authentication
* bcrypt
* Nodemailer
* Background jobs / cron support

---

# Theme system

The design system uses dual themes:

* Warm editorial light mode
* Crisp engineering-focused dark mode

## Theme principles

### Light mode

Should feel:

* Warm
* Calm
* Paper-like
* Intelligent
* Soft-neutral
* Editorial

### Dark mode

Should feel:

* Technical
* Crisp
* Layered
* Minimal
* High readability
* Enterprise-grade

## Accent strategy

Use a single primary accent:

* **Teal**

### Semantic colors

* Primary → Teal
* Success → Green
* Warning → Amber
* Danger → Rose-red
* Info → Blue only when necessary
* Purple/violet → Avoid entirely as primary branding

---

# Color tokens

## Light theme

```css
:root,
[data-theme="light"] {
  --bg: #f7f5f1;
  --bg-subtle: #f1eee8;

  --panel: #fcfbf8;
  --panel-2: #f6f2ec;
  --panel-3: #ece7df;

  --border: #ddd6cc;
  --border-strong: #cfc6bb;

  --text: #1f1c18;
  --text-muted: #6e675f;
  --text-soft: #9d958b;
  --text-inverse: #faf8f4;

  --primary: #0f766e;
  --primary-hover: #0b5f59;
  --primary-active: #084d48;
  --primary-soft: #d7ebe8;

  --success: #2f6f3e;
  --warning: #9a5b00;
  --danger: #a33a44;
  --info: #245ea8;

  --shadow-sm: 0 1px 2px rgba(34, 26, 17, 0.05);
  --shadow-md: 0 6px 18px rgba(34, 26, 17, 0.07);
  --shadow-lg: 0 16px 40px rgba(34, 26, 17, 0.10);
}
```

---

## Dark theme

```css
[data-theme="dark"] {
  --bg: #0b0b0c;
  --bg-subtle: #111214;

  --panel: #141518;
  --panel-2: #1a1c20;
  --panel-3: #202329;

  --border: #2a2d34;
  --border-strong: #3a3f47;

  --text: #f5f7fa;
  --text-muted: #a1a7b0;
  --text-soft: #6f7680;
  --text-inverse: #0b0b0c;

  --primary: #2dd4bf;
  --primary-hover: #22c1ad;
  --primary-active: #18a08f;
  --primary-soft: rgba(45, 212, 191, 0.14);

  --success: #4ade80;
  --warning: #f59e0b;
  --danger: #fb7185;
  --info: #60a5fa;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 10px 24px rgba(0, 0, 0, 0.34);
  --shadow-lg: 0 20px 48px rgba(0, 0, 0, 0.45);
}
```

---

# Typography

Typography should drive hierarchy more than color.

## Font system

### Primary UI font

* Geist Sans

### Alternative UI font

* Inter
* Satoshi

### Monospace font

* Geist Mono

### Optional marketing font

* Instrument Serif

---

## Typography tokens

```css
:root {
  --font-sans: "Geist Sans", "Inter", system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-md: 18px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 30px;
  --text-3xl: 36px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.65;
}
```

---

## Typography usage rules

* Body text → 14px–16px
* Input text → 14px
* Button text → 14px
* Table text → 14px
* Metadata labels → 12px
* Section headings → 18px–20px
* Page headings → 24px–30px
* KPI values → 28px–36px

### Rules

* Use weight before color for hierarchy.
* Avoid oversized marketing typography inside dashboards.
* Use monospace for:

  * IDs
  * codes
  * financial values
  * timestamps
  * metrics
  * tabular values

---

# Spacing system

## Spacing tokens

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

## Layout spacing rules

* Desktop page padding → 24px–32px
* Mobile page padding → 16px
* Card padding → 20px–24px
* Grid gap → 20px
* Form gap → 16px
* Section gap → 24px–32px
* Sidebar item height → 40px–44px
* Primary action height → 44px
* Compact action height → 36px

---

# Radius system

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 999px;
}
```

## Radius rules

* Inputs → 12px
* Buttons → 12px
* Cards → 16px
* Modals → 20px
* Badges → Pill radius

Never over-soften the UI.

---

# Border and surface rules

## Surface roles

* `--bg` → app background
* `--bg-subtle` → sidebar/background shell
* `--panel` → default cards
* `--panel-2` → nested surfaces
* `--panel-3` → active/selected states

## Border rules

* Use neutral 1px borders.
* Prefer borders over shadows.
* Avoid colored left-border cards.
* Never use gradient borders.

## Shadow rules

* Shadows should remain subtle.
* Dark mode should rely mostly on layered surfaces.
* Never use glow effects.

---

# Layout principles

## Global app frame

### Desktop

* Left sidebar
* Top navigation/header
* Main content shell
* Structured content grids

### Mobile

* Sidebar becomes drawer
* Sticky topbar
* Scrollable tables
* Action-first layouts

---

## Layout rhythm

* Left-align dashboard content
* Use structured grids
* Maintain predictable spacing
* Keep one primary action per major section
* Avoid random card stacking

---

# Core pages

These patterns should work across:

* ERP systems
* CRM systems
* Inventory tools
* LMS platforms
* HR systems
* Finance dashboards
* Analytics platforms
* Healthcare admin tools
* Logistics systems

---

## Dashboard overview

Recommended order:

1. KPI row
2. Activity feed
3. Alerts
4. Trends
5. Operational summaries
6. Recent actions
7. Quick actions

---

## Table-first pages

Most enterprise apps are table-heavy.

### Required structure

* Page title
* Search
* Filters
* Bulk actions
* Table
* Pagination
* Detail panel or modal

---

## Forms

Forms should prioritize:

* Validation clarity
* Density
* Accessibility
* Keyboard usability

### Form rules

* Labels always visible
* Avoid placeholder-only forms
* Group related fields
* Keep primary actions aligned consistently
* Use inline validation where possible

---

# Component system

## Buttons

### Primary button

* Background → `--primary`
* Text → `--text-inverse`

### Secondary button

* Neutral background
* Subtle border

### Ghost button

* Transparent background
* Hover surface only

### Destructive button

* Use `--danger`
* Only for destructive actions

---

## Inputs

* Height → 44px
* Radius → `--radius-md`
* Border → `1px solid var(--border)`
* Background → `--panel`
* Focus → subtle teal ring

---

## Cards

* Neutral surfaces
* Moderate radius
* Border-first styling
* Avoid decorative headers

---

## Tables

Tables are a core UI primitive.

### Table rules

* Dense but readable
* Sticky headers optional
* Neutral hover states
* Right-align numerical values
* Use monospace for technical values

---

## Badges

### Semantic badge styles

* Success → soft green
* Warning → soft amber
* Danger → soft rose
* Info → soft blue
* Neutral → layered gray

Badges should remain subtle.

---

## Modals and drawers

* Clear title hierarchy
* Action buttons aligned right
* Minimal decorative styling
* Structured spacing

---

# Navigation system

## Sidebar

Sidebar should:

* Remain compact
* Use grouped navigation
* Avoid oversized icons
* Support collapse behavior

### Sidebar structure

* Logo / workspace
* Main navigation
* Secondary navigation
* User/account area

---

## Topbar

Include:

* Search
* Theme toggle
* Notifications
* User menu
* Context actions

---

# Icon system

## Rules

* Use line icons (Lucide recommended)
* Maintain consistent sizing
* Avoid decorative icon clutter
* Avoid icon-in-circle repetition

---

# Data visualization

Charts are secondary to operational clarity.

## Chart rules

* Use charts only where trends matter
* Prefer line and bar charts
* Use teal as primary chart color
* Use neutral grays for secondary series
* Avoid rainbow palettes
* Avoid flashy gradients

---

# Accessibility rules

## Requirements

* AA contrast compliance where possible
* Keyboard accessibility
* Semantic structure
* Focus visibility
* Touch-friendly controls
* Do not rely on color alone for status

---

# Motion rules

## Allowed

* Subtle hover transitions
* Drawer transitions
* Modal fades
* Skeleton loading
* Sidebar collapse animation

## Disallowed

* Floating blobs
* Bouncy cards
* Overanimated interfaces
* Constant glowing animations
* Long spring effects

---

# Theme behavior

* Default to system theme
* Persist user preference
* Ensure both themes feel intentional
* Dark mode must not simply invert light mode


---

---

# Operational UX priorities

The system should optimize for:

* Fast search
* Dense readable information
* Clear validation
* Fast workflows
* Multi-step operations
* Data visibility
* Reusable layouts
* Predictable interactions

---

# Empty states

## Rules

* Neutral illustration/icon
* One sentence explanation
* One clear action
* No playful emoji-heavy designs

---

# Loading states

* Skeleton tables
* Skeleton cards
* Minimal shimmer
* No flashy loaders

---

# Error states

* Clear inline messaging
* Minimal danger emphasis
* No full-screen panic UIs

---

# Copywriting rules

## Tone

* Direct
* Operational
* Clear
* Neutral

## Avoid

* Startup buzzwords
* Over-marketing language
* AI hype terminology

## Prefer

* “Save changes”
* “Create user”
* “Pending approval”
* “Export report”
* “View details”

---

# AI generation instructions

This file is the mandatory design source of truth for all generated UI.

## Mandatory generation rules

* Use only the defined token system.
* Never invent random colors.
* Never introduce purple/violet branding.
* Never use neon or glowing visuals.
* Reuse shared layouts and components.
* Keep the UI production-ready.
* Prioritize operational usability.
* Every screen must support both themes.
* Prefer reusable components over one-off styling.
* Maintain consistent spacing and hierarchy.
* Follow App Router layout composition patterns.

---
