
---

# 🔤 `FONTS.md`

## Typography System — Orchestra

### Purpose

Typography in Orchestra is optimized for **clarity, precision, and long-term usability**.
Fonts should feel neutral and disappear into the interface.

---

## Font Strategy

Orchestra uses **two fonts only**:

1. **UI Font** — for all interface text
2. **Monospace Font** — for technical output

No additional fonts are used.

---

## UI Font

### Primary UI Font

**Inter**

Used for:

* headings
* body text
* buttons
* forms
* labels
* helper text
* execution plans
* summaries

Why Inter:

* Designed specifically for screens
* Excellent readability at small sizes
* Neutral, professional tone
* Widely used in serious developer tools

---

## Monospace Font

### Technical Output Font

**JetBrains Mono**

Used for:

* commands
* logs
* stdout / stderr
* file paths
* terminal panels

Why JetBrains Mono:

* Clear character differentiation
* Comfortable spacing
* Optimized for code and logs

Monospace fonts are **never** used for paragraphs or general UI text.

---

## Font Weights

Typography hierarchy is created using **weight and spacing**, not font changes.

Recommended weights:

* Headings: `500–600`
* Body text: `400`
* Buttons: `500`
* Labels: `400`
* Disabled text: `400` with reduced opacity
* Logs: `400` (monospace)

Avoid ultra-bold weights (`700+`) except for empty states.

---

## Font Sizes (Guidelines)

| Usage           | Size    |
| --------------- | ------- |
| App title       | 18–20px |
| Section headers | 14–16px |
| Body text       | 13–14px |
| Helper text     | 12px    |
| Logs / commands | 12–13px |

Consistency is more important than exact values.

---

## Typography Rules

### Do

* Use Inter everywhere except logs
* Keep line lengths comfortable
* Use spacing and hierarchy for clarity

### Avoid

* Decorative fonts
* Monospace for body text
* Mixed font families
* Excessive bold text

---

## Design Intent

> Typography should never compete with workflow structure or execution output.

---