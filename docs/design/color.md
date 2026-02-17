

# 🎨 `COLORS.md`

## Color System — Orchestra

### Purpose

The color system for **Orchestra** is designed to support **clarity, focus, and execution visibility**.
Colors should never distract from workflow structure or execution state.

The palette is **muted, neutral, and utilitarian**, suitable for long work sessions.

---

## Core Palette

```text
#333333  — Dark Neutral
#FFFFFF  — White
#E1F4F3  — Soft Mint (Accent)
#706C61  — Muted Gray-Brown
```

---

## Color Roles

### Primary Background

* **#333333**
* Used for:

  * main app background (dark-first UI)
  * terminal backgrounds
  * execution panels

Provides contrast and reduces eye strain.

---

### Primary Foreground

* **#FFFFFF**
* Used for:

  * primary text
  * cards
  * panels
  * execution plans

Ensures readability against dark backgrounds.

---

### Accent Color

* **#E1F4F3**
* Used sparingly for:

  * primary actions (Run Workflow)
  * active steps
  * focused inputs
  * running state indicators

This is the **hero color**. Overuse reduces effectiveness.

---

### Secondary / Muted Color

* **#706C61**
* Used for:

  * labels
  * helper text
  * timestamps
  * inactive UI elements
  * separators

Keeps the UI calm and professional.

---

## Status Colors (Derived)

Status colors should remain **muted** and consistent with the core palette.

| Status  | Usage Guidance             |
| ------- | -------------------------- |
| Running | Accent color (`#E1F4F3`)   |
| Success | Slightly deeper teal/green |
| Failed  | Muted red (never bright)   |
| Skipped | Muted gray (`#706C61`)     |

Status should be communicated via **color + icon + text**, never color alone.

---

## Color Usage Rules

### Do

* Use color to convey **state**, not decoration
* Prefer contrast through light/dark, not saturation
* Keep most UI neutral

### Avoid

* Bright or neon colors
* Heavy gradients
* Multiple accent colors
* Fully black backgrounds everywhere

---

## Design Intent

> The color system exists to make structure and execution state visible, not to decorate the interface.

---
