# Handoff v2: Unpublishable — Epistolary Direction ("Correspondence")

## Context
This supersedes the visual direction in the original handoff (`design_handoff_unpublishable/`), which used a pastel card-grid design ("Parlour"). The blog concept has changed: **Unpublishable is now framed as a personal blog of letters** — cultural criticism written as correspondence, not filed essays. If a "Parlour" build already exists, **replace its homepage/post templates with this direction**; the underlying WordPress plan (categories as taxonomy, post meta, etc.) from the v1 README still applies except where noted below.

## Design philosophy
Pure literary/editorial minimalism — closest reference points are The Paris Review's "Letters & Essays" index and The New Yorker's "The Mail" page. No cards, no boxes, no icons, no postal-literal props (no wax seals/stamps — we tried that and cut it as over-designed). The "letter" idea lives entirely in copy — a sign-off on the reading page — not in visual novelty. The list is a single, narrow, chronological column with generous-but-tightened rhythm between entries.

## Screens

### 1. Homepage — the index of letters
Single column, centered, max-width **760px**, on a near-white paper background. No sidebar, no grid, no imagery.

**Order of elements:**
1. Nav bar
2. Standfirst/tagline (one line)
3. Flowing list of letters (all on one page for now — paginate later if the archive grows)

**Nav:**
- `display: flex; justify-content: space-between; align-items: baseline; padding: 40px 0 24px;`
- Left: wordmark "unpublishable", Instrument Serif italic, 22px, plain button/link, no border, no icon.
- Right: three links `Archive`, `About`, `Subscribe` — JetBrains Mono, 11px, letter-spacing 0.14em, uppercase, color `#6b6660` (soft ink), hover → full ink `#161412`. Gap 24px.

**Standfirst:**
- Text: **"Letters about a changing world."**
- JetBrains Mono (monospace, typewriter feel), normal style (not italic), 13px, letter-spacing 0.08em, uppercase, color `#161412`.
- `white-space: nowrap` — must render on one line regardless of viewport (do not wrap).
- Margin: `8px 0 56px`.

**List of letters:**
- No border/rule between items (explicitly removed per design review — rules felt noisy).
- Each item: `padding: 22px 0;` (tightened from an earlier, airier 36px — keep it dense, not spacious).
- **Title** — Instrument Serif, 30px, weight 500, line-height 1.14, letter-spacing -0.012em, color near-black `#0e0d0b`. On hover: `opacity: 0.6` (simple fade, no underline, no color shift). Margin-bottom 6px.
- **Dek** (one-line summary) — plain (not italic), 15px, line-height 1.45, color `#6b6660`, max-width 60ch. Margin-bottom 8px.
- **Date** — small mono caps, 10.5px, letter-spacing 0.12em, uppercase, color `#6b6660`. This is the only metadata per item — **no byline, no category tag, no read-time, no issue number**. The writer is a single author (no byline needed) and epistolary pieces don't carry topic tags — the subject is implied by the title.
- No numbering anywhere in this direction. Dates are the only ordering signal.
- No "Continue reading" label, no arrow, no ellipsis — the whole row is a clickable target ending simply on the date.

### 2. Letter page (single post)
Narrow reading column, max-width **640px**.

**Order:**
1. Back link: `← Back` — plain button, JetBrains Mono 11px caps, color soft ink, hover → full ink. Top padding 40px, no border/box.
2. Date — JetBrains Mono 11px caps, color soft ink, margin `40px 0 24px`.
3. Title — Instrument Serif, `clamp(36px, 5vw, 54px)`, weight 500, line-height 1.08, letter-spacing -0.015em, near-black. Margin-bottom 40px.
4. Body — Instrument Serif, 21px, line-height 1.65, one paragraph per `<p>`, margin-bottom `1.3em` each. No drop caps, no pull quotes, no cover image — plain flowing text.
5. **Sign-off** — italic, 20px, line-height 1.5, `white-space: pre-line` (renders on two lines):
   ```
   Yours, still logged in —
   The Editor
   ```
   Margin-top 44px.
6. Footer row — flex space-between, JetBrains Mono 11px caps, soft ink, margin-top 64px, padding-top 20px, **no border rule above it** (rules were removed throughout this direction — keep it that way). Left: `Sent <date>`. Right: `Next letter → <next title>` as a clickable link, hover → full ink.

**No "Dear ___" salutation anywhere** — an earlier pass tried addressing letters to specific recipients ("Dear Algorithm," "Dear Mom,") and it was cut. Do not reintroduce it unless asked.

## Design tokens

### Colors
```
--paper:      #faf9f5   /* near-white, NOT cream — this was explicitly corrected from a warmer tone */
--ink:        #161412   /* primary text/link color */
--ink-soft:   #6b6660   /* metadata, deks, secondary nav */
--title-ink:  #0e0d0b   /* titles are slightly blacker than body ink, for Paris-Review-style contrast */
```
No accent color. No category-color system in this direction (that belonged to the old Parlour cards).

### Typography
| Role | Family | Notes |
|---|---|---|
| Titles, body, sign-off | **Instrument Serif** | Regular for titles/body, italic for the sign-off only |
| Standfirst / nav / dates / meta / buttons | **JetBrains Mono** | Always uppercase, letter-spacing 0.08–0.14em |

Google Fonts import (reuse from the v1 handoff if already present):
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```

### Spacing rhythm
Dense, not airy — this was tuned down from an initial version that felt too spacious:
- Nav: `padding: 40px 0 24px`
- Standfirst margin-bottom: `56px`
- List items: `padding: 22px 0` each, **no dividing rule**
- Title→dek gap: `6px`; dek→date gap: `8px`

### Layout
- Homepage and letter page both center a single column on the paper background — no sidebar, no grid, no multi-column layout at any breakpoint in v1. (If responsive breakpoints are needed, just scale down `max-width`/padding — don't introduce a grid.)
- Reasoning: the "whitespace" on either side of the narrow column at wide viewports is **intentional** — it's the classic editorial "measure" rule (ideal reading line ~55–75 characters), not empty space to fill. Do not widen the column or add side content to compensate.

## Content model
Same 8 seed letters as before (`data.js`), same fields (`n`, `category`, `title`, `dek`, `date`, `read`, `body[]`) — but in this direction, `category`, `read`, and `n` (issue number) are **not displayed**. Keep them in the data model for future use (e.g. an `/archive` page sorted by category), just don't render them on the homepage or letter page.

## What to build (Phase 1 — static, then WordPress per v1 plan)
1. `index.html` — the letters list as specified above.
2. `letter/<slug>.html` — one per letter.
3. Reuse the v1 handoff's **Phase 2 WordPress plan** (categories as taxonomy, essay number as post meta, etc.) but:
   - Do not render category or number on any template.
   - Drop the artwork/icon partials entirely — this direction has no imagery.
   - `single.php`'s "Next" link uses `get_adjacent_post()` as before.
   - Sign-off text can be a theme constant or an ACF-style post field if per-letter sign-offs are wanted later — for now it's static across all posts.

## Files in this bundle
- `README.md` — this file (source of truth for the new direction)
- `reference/Unpublishable.html` — open in browser, select **"A · CORRESPONDENCE"** in the Tweaks panel (top-right) to see this direction live. Ignore all other options in that panel — they're earlier explorations we moved away from.
- `reference/correspondence.jsx` — canonical source for this direction. The CSS template literal at the top is ground truth for exact values.
- `reference/data.js` — the 8 seed letters.

If anything is ambiguous, inspect `reference/Unpublishable.html` directly with devtools — it is the ground truth over this document.
