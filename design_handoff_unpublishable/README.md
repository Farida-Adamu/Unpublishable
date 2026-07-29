# Handoff: Unpublishable — Personal Essay Blog

## Overview
**Unpublishable** is a personal essay blog about pop modernism, technology, and the changing world around it. The voice is serious cultural criticism (think *n+1*, *The Drift*, *Dirt*) but the visual identity contrasts that gravity with a playful, retro-modernist aesthetic: muted earth-tone background, pastel category-coded cards, geometric abstract illustrations, and mixed serif/sans/mono typography.

The final goal is a **WordPress theme**. The recommended path is:
1. **Phase 1** — Build the design as a static HTML/CSS/JS site to lock the markup, styling, and behavior.
2. **Phase 2** — Convert that static site into a WordPress theme (PHP templates + functions.php + theme.json) and wire the essay grid to the WordPress post loop.

This README documents Phase 1 in full and gives Phase-2 conversion guidance at the end.

---

## About the Design Files
The files in `reference/` are **design references**, not production code:
- `Unpublishable.html` — the prototype shell (loads React + Babel inline, switches between four other directions via a Tweaks panel — IGNORE the other directions, only **PARLOUR** is shipping)
- `parlour.jsx` — the canonical design for the homepage + essay page (uses React + JSX as a prototyping shorthand; the final theme should be plain HTML/CSS/JS, not React)
- `data.js` — the 8 sample essays with full body copy, dates, categories, read times

Recreate the look/behavior in **plain HTML, CSS, and a small amount of vanilla JavaScript**. No React, no build step. Then port the static result to WordPress.

## Fidelity
**High-fidelity.** All colors, font sizes, spacing, and interactions in the prototype are intentional. Match them. Where `clamp()` values appear in the prototype CSS, keep them — they're part of the responsive behavior.

---

## Screens

### 1. Homepage (`index.html` → eventually `home.php` / `index.php`)

**Purpose:** Land the reader, establish brand, surface the eight most recent essays in an editorial grid where one essay is featured.

**Top-level layout:**
- The entire page is wrapped in an outer `<div>` with:
  - Background: vertical radial gradient (earth tones, see Design Tokens)
  - Padding: `14px` on all sides
  - `background-attachment: fixed`
- Inside the wrapper, a **paper frame** (`<div class="frame">`):
  - Background: `#d9d8c2` (paper)
  - Border: `1.5px solid #2a261e`
  - Padding: `0 24px 24px`
  - `min-height: calc(100vh - 28px)`

**Order of blocks inside the frame:**

1. **Sticky nav bar**
2. **Hero wordmark** (`unpub / lishable`, two lines)
3. **Tagline paragraph** (block-level, max-width 600px)
4. **Top grid** — 4 columns × 2 rows: hero card spans cols 1–2 × rows 1–2; cards 2–5 fill the 2×2 area to the right
5. **Bottom grid** — 3 columns × 1 row: cards 6, 7, 8
6. No footer.

**Block specs:**

#### Nav (sticky)
- `position: sticky; top: 0; z-index: 50;`
- `display: flex; justify-content: space-between; align-items: center;`
- `padding: 14px 0 10px;`
- Background: `#d9d8c2` (same as paper so it covers content under it on scroll)
- **No border-bottom rule** — this was explicitly removed.
- **Left side:** a small wordmark `unpublishable` (Major Mono Display, 18px, letter-spacing 0.04em, lowercase, color `#2a261e`).
  - On initial page load, `opacity: 0; transform: translateY(-4px); pointer-events: none;` — invisible.
  - When `window.scrollY > 220`, add `.is-scrolled` class to `.nav`; this fades the wordmark in with `opacity 1; transform: translateY(0); pointer-events: auto;` (transition 0.25s ease).
- **Right side:** three nav links `ARCHIVE`, `ABOUT`, `SUBSCRIBE ↗`
  - JetBrains Mono, 11px, letter-spacing 0.18em, uppercase, color `#2a261e`
  - Gap 28px between links
  - Underline on hover via `border-bottom: 1px solid currentColor` toggle

#### Hero wordmark
- `<h1>` with Major Mono Display
- Font-size: `clamp(80px, 13vw, 200px)`
- Line-height: 0.86, letter-spacing: -0.01em, lowercase, color `#2a261e`
- Content broken onto two lines: `unpub` then `<br>` then `lishable`
- Margin: `0 0 12px`
- Padding above: `8px` (from `.hero` container `padding: 8px 0 4px`)

#### Tagline
- **Important:** Block-level paragraph, **not** inside any grid container. Sits directly between the hero and the top grid as a sibling.
- Instrument Serif, italic
- Font-size: `clamp(22px, 2.2vw, 28px)`, line-height 1.3, letter-spacing -0.005em
- Color `#2a261e`
- `max-width: 600px; width: 100%;`
- `margin: 0 0 16px;`
- Text: *"Essays on pop modernism, technology & the changing world around it."*

#### Top grid
- `display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, minmax(200px, 1fr)); gap: 12px; margin-top: 8px;`
- **Hero card** (essay 1.0) — `grid-column: 1 / 3; grid-row: 1 / 3;` (spans 2 cols × 2 rows)
- Cards 2–5 — placed by default flow into the remaining 2×2 area

#### Bottom grid
- `display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 12px;`
- Cards 6, 7, 8 fill it.

---

### 2. Card components

There are **two variants** sharing the same base structure: **hero card** and **regular card**.

#### Base card markup
```html
<article class="card [card-regular | card-hero]" data-category="POP CULTURE">
  <div class="card-cat">
    <span>POP CULTURE</span>
    <span class="card-n">1.0</span>             <!-- " · Featured" suffix on hero only -->
  </div>
  <h3 class="card-ttl">The Algorithm Ate Sincerity</h3>
  <p class="card-dek">…short italic dek, HERO ONLY…</p>
  <div class="card-meta">
    <span>MAY 24, 2026</span>
    <span class="card-sep"></span>
    <span>9 MIN</span>
  </div>
  <div class="card-img"><!-- artwork SVG/div composition --></div>
  <span class="card-read">Read <span class="card-arr">→</span></span>
</article>
```

#### Base card styles
- Background: per-category (see Color Map below)
- Border: `1.5px solid #2a261e`
- Padding: `16px 16px 14px` (hero: `22px 24px`)
- Cursor: pointer
- `position: relative; overflow: hidden;`
- `display: flex; flex-direction: column;`
- Hover: `transform: translate(-3px, -3px); box-shadow: 5px 5px 0 #2a261e;` with transition `0.25s cubic-bezier(.2,.7,.2,1)` on transform, `0.25s` on box-shadow.

#### Card pieces
- **`.card-cat`** — JetBrains Mono 10.5px, letter-spacing 0.18em, uppercase. `display: flex; justify-content: space-between;`. The right-side `.card-n` is `#6b6458` (soft ink) and reads `"1.0"`, `"2.0"`, etc. (issue number formatted as `<int>.0`). On the hero only it reads `"1.0 · Featured"`.
- **`.card-ttl`** — Instrument Serif, weight 400, letter-spacing -0.012em, color `#2a261e`, margin `14px 0 8px`, `text-wrap: balance`.
  - **Regular**: `font-size: 26px; line-height: 1.05;`
  - **Hero**: `font-size: clamp(40px, 4.4vw, 68px); line-height: 1.0; margin: 18px 0 12px;`
  - **No colored italic on any word.** Title text is plain, one consistent style.
- **`.card-dek`** (hero only) — Instrument Serif italic, 20px, line-height 1.4, color `#2a261e`, `max-width: 38ch; margin: 0 0 16px;`
- **`.card-meta`** — JetBrains Mono 10.5px, letter-spacing 0.14em, uppercase, color `#6b6458`. `display: flex; gap: 14px; align-items: center; margin-bottom: 14px;`. Format: `<date> · <readtime>` where the bullet is `.card-sep` — a 3px circle, same color, between the two values.
- **`.card-img`** — the artwork area.
  - `margin: auto -16px 0;` (flushes to card edges and pushes to bottom of flex container)
  - `flex: 1; min-height: 120px;` (hero: `min-height: 240px;`)
  - `border-top: 1.5px solid #2a261e;`
  - Background = card background color (artwork sits on top)
  - `::after` pseudo overlays a radial-dot noise: `background-image: radial-gradient(rgba(20,20,20,0.07) 0.7px, transparent 0.9px); background-size: 3px 3px; mix-blend-mode: multiply;`
- **`.card-read`** — absolute positioned at `right: 14px; bottom: 14px`. JetBrains Mono 11px, letter-spacing 0.16em, uppercase, color `#2a261e`. Background `#d9d8c2` (paper), border `1.5px solid #2a261e`, padding `6px 10px`. Contains text `"Read"` + a `.card-arr` span containing `→`. On card hover: background flips to `#2a261e`, color to paper; arrow translates `transform: translateX(3px);`.

#### Hero card extras
- Hard-coded palette override (regardless of category): `background: #b8c8e6;` and uses art-ink `#1a2f8a`.
- Uses the custom **`hero` artwork** (see below).

---

### 3. Artwork compositions

All artwork is built from CSS shapes + inline SVG. No raster images. Each category has its own artwork "kind". Artwork is positioned absolutely inside `.card-img`.

For each kind below, root is `<div class="art art-<kind>">`, `position: absolute; inset: 0;`. Two CSS variables drive color:
- `--card-bg` — the card's background
- `--art-ink` — the foreground ink

#### `hero` (used only by the hero card)
Bold high-contrast geometry. Children:
```html
<div class="bar bar1"></div>
<div class="ring1"></div>
<div class="ring2"></div>
<div class="ring3"></div>
<div class="square sq1"></div>
<div class="square sq2"></div>
<div class="tri"></div>
<div class="bar bar2"></div>
```
Specifics (see `parlour.jsx` CSS for exact values):
- Two full-width horizontal bars (`height: 14px`, art-ink), top 6%, bottom 8%
- Three concentric circles (ink → bg → ink), 70% / 42% / 20% width, stacked center
- One outlined rotated square (sq1: 70px bottom-left, outlined art-ink, bg fill, rotated 12°)
- One solid rotated square (sq2: 50px top-right, solid art-ink, rotated -10°)
- One triangle (border trick, art-ink, bottom-right, rotated 8°)

#### `halftone` — POP CULTURE
Two overlapping ink circles (one 70%×130% top-left at 0.9 opacity, one 60%×100% bottom-right at 0.5 multiply), plus a small bg-color circle at center-right.

#### `signal` — TECHNOLOGY
Inline SVG. Four concentric half-arcs radiating from a centered base point at the bottom (radii 20, 50, 80, 110, 140), stroke art-ink, decreasing opacity. Solid 9px dot at the apex.

#### `wave` — IDENTITY
Inline SVG. Five concentric circles centered at bottom-middle (cx=100, cy=160), radii 28, 56, 84, 112, 140, no fill, art-ink stroke 2px, decreasing opacity. Solid 14px ink dot at center.

#### `pill` — MEDIA
Two stacked pills. Outer: 120% wide, 50% tall, full ink, mid-height. Inner: 50% wide, 50% tall, card-bg color at 0.6 opacity, centered.

#### `grid` — BODY
Background pattern `radial-gradient(var(--art-ink) 24%, transparent 26%); background-size: 18px 18px;` — a uniform dot grid. Plus one absolute `36% × 36%` block at center-right with `mix-blend-mode: multiply; opacity: 0.55;` to break the grid.

#### `letters` — LANGUAGE
A typographic flourish: italic Fraunces, font-size 180px, color art-ink, content `"aa"`, rotated -6°, centered.

#### `cassette` — CULTURE
Three full-width horizontal stripes (heights 14%, ink, at 22%, 42%, 62% — middle one at 0.5 opacity). Two reel circles (38px, bg-color fill, 4px ink border) on top.

---

### 4. Essay page (one per post)

**Layout:** narrow centered column inside the same paper frame + sticky nav.
- `.essay { max-width: 720px; margin: 0 auto; padding: 16px 32px 96px; }`
- Sticky nav: same component as homepage but **always show the wordmark** on essay pages (apply `.is-scrolled` class permanently).

**Order:**
1. Back button: `← Back to index`
   - `border: 1.5px solid #2a261e; padding: 6px 12px;` JetBrains Mono 11px, letter-spacing 0.14em, uppercase.
   - Hover: invert (ink bg, paper text).
2. **Essay header** — two-column grid `auto 1fr`, `gap: 28px`, `align-items: end`, `border-bottom: 1.5px solid #2a261e; padding-bottom: 24px;`
   - Left: huge number, Major Mono Display, `clamp(80px, 11vw, 140px)`, line-height 0.86. Same `<int>.0` format.
   - Right: three rows of metadata (Cat. · Filed · Read), JetBrains Mono 11px, letter-spacing 0.16em, uppercase. Labels (`Cat.`, `Filed`, `Read`) in soft ink, values in normal ink.
3. **Title** — Instrument Serif, `clamp(40px, 5.4vw, 64px)`, weight 400, line-height 1.04, letter-spacing -0.02em, margin `28px 0 18px`. **Plain — no colored italic.**
4. **Dek** — Instrument Serif italic, 21px, line-height 1.45, color `#6b6458`, `max-width: 36ch; margin: 0 0 36px;`
5. **Cover artwork** — `height: 280px; border: 1.5px solid #2a261e;` background = category card-bg. Renders the same artwork kind as the card. `margin-bottom: 40px;`
6. **Body** — paragraphs of Instrument Serif 21px, line-height 1.55, margin `0 0 1.2em`. First paragraph has a drop cap: `::first-letter` floated left, Major Mono Display, 72px, line-height 0.9, padding `6px 14px 0 0`, color = art-ink.
7. **Essay foot** — `border-top: 1.5px solid #2a261e; padding-top: 20px; margin-top: 56px;`. Flex space-between. Left: `— End № 01`. Right: `Next →` button: bg `#2a261e`, color `#d9d8c2`, padding `10px 14px`, no border, JetBrains Mono 11px caps. Hover: bg flips to art-ink.

---

## Interactions & Behavior

| Action | Behavior |
|---|---|
| Click anywhere on a card | Navigate to that essay's page |
| Scroll past 220px on homepage | Wordmark fades into the nav (`.is-scrolled` toggle, 0.25s ease) |
| Hover a card | Card translates up-and-left 3px and gains a 5px hard offset shadow; "Read →" button inverts to ink-on-paper-flipped style; arrow nudges 3px right |
| Hover nav link | Underline appears (border-bottom from transparent to ink) |
| Click "Back to index" | Return to homepage, scroll to top |
| Click "Next →" on essay | Open next essay in the sequence (cyclical) |

All transitions: `0.25s cubic-bezier(.2,.7,.2,1)` for transforms; `0.15–0.25s ease` for color/background.

---

## State Management

For the static HTML/JS phase, the only client-side state is the scroll listener for the nav wordmark. Two pages: `index.html` (homepage) and `essay-<slug>.html` (one per essay) — link via real anchors, not SPA routing.

For the WordPress phase, state is server-rendered. The scroll listener stays as a small `theme.js`.

---

## Design Tokens

### Colors
```
--paper:       #d9d8c2   /* main background, button bg */
--ink:         #2a261e   /* primary text, borders, button hover bg */
--ink-soft:    #6b6458   /* metadata, sublabels */
--rule:        #2a261e   /* all borders/rules */
```

### Page background (outer wrapper)
Radial gradient, `background-attachment: fixed`:
```css
background: radial-gradient(120% 80% at 50% 0%,
  #c8d4c0 0%,
  #d4d2b8 38%,
  #c2b896 80%,
  #a89876 100%);
```

### Category → card style map
| Category    | Card BG    | Art ink    | Artwork kind |
|-------------|------------|------------|--------------|
| POP CULTURE | `#dde4f0`  | `#2c4ab8`  | halftone     |
| TECHNOLOGY  | `#cfdfd1`  | `#2a4a3c`  | signal       |
| IDENTITY    | `#e9ddc4`  | `#c14a1f`  | wave         |
| MEDIA       | `#d4ddc0`  | `#7a2e2e`  | pill         |
| BODY        | `#e0d2d8`  | `#5a3b8a`  | grid         |
| LANGUAGE    | `#d8d2bf`  | `#1e3d8f`  | letters      |
| CULTURE     | `#e6d6c2`  | `#1a1a1a`  | cassette     |

**Hero card override (always):** card-bg `#b8c8e6`, art-ink `#1a2f8a`, artwork `hero`.

### Typography
| Role | Family | Weight | Notes |
|---|---|---|---|
| Wordmark / numerals | **Major Mono Display** | 400 | Lowercase, letter-spacing -0.01em on hero, +0.04em on small wordmark |
| Titles / deks / body | **Instrument Serif** | 400 | Italic variant used for deks and tagline only |
| Decorative letters art | **Fraunces** | 400 italic | Only inside `art-letters` |
| Labels / metadata / nav / buttons | **JetBrains Mono** | 400 / 500 | Always uppercase, letter-spacing 0.14–0.18em |
| Fallback sans | Space Grotesk → system-ui | — | Used as the root `font-family` though only via system fallback |

All fonts from Google Fonts. Import line in the prototype:
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,700;0,9..144,800;1,9..144,400&family=IBM+Plex+Mono:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Major+Mono+Display&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
```

### Spacing rhythm
- Outer page padding: `14px`
- Frame inner padding: `0 24px 24px` (top is 0 because the sticky nav sits flush; nav has its own `padding: 14px 0 10px`)
- Nav → hero: nav `padding-bottom: 10px`, then hero `padding: 8px 0 4px`
- Hero → tagline: `12px` (margin-bottom on wordmark)
- Tagline → grid: `16px` (margin-bottom on tagline) + `8px` (margin-top on top grid)
- Grid gap: `12px`
- Top grid → bottom grid: `12px` (margin-top on bottom grid)
- All other padding/margin from card specs above.

The rhythm is **compact and editorial**, not airy. Match this.

### Borders & rules
All rules and borders: `1.5px solid #2a261e`. There is **no rule between nav and hero** — this was explicitly removed.

### Shadows
Only one shadow in the design — the card hover offset: `5px 5px 0 #2a261e` (hard offset, no blur, ink color).

---

## Content

Eight essays. Use `reference/data.js` as the source of truth — it has the full body copy, dates, categories, read times. Treat it as your seed data when building the WordPress posts.

The eight titles:
1. The Algorithm Ate Sincerity *(POP CULTURE)*
2. Parasocial Is Just Love Now *(TECHNOLOGY)*
3. On Being Perceived Too Well *(IDENTITY)*
4. Everyone's a Critic, Nobody's a Reader *(MEDIA)*
5. Biohacking Your Way to a Personality *(BODY)*
6. Death of the Considered Opinion *(LANGUAGE)*
7. Nostalgia Is a Feature, Not a Bug *(CULTURE)*
8. It's Not the Phone. It's You With the Phone. *(TECHNOLOGY)*

---

## Assets
- No raster images.
- No external icons. The single `→` is a Unicode glyph.
- All artwork is CSS shapes + inline SVG generated per category.

---

## Implementation plan

### Phase 1 — Static site
Recommended file structure:
```
unpublishable-static/
├── index.html
├── essay/
│   ├── algorithm-ate-sincerity.html
│   ├── parasocial-is-just-love-now.html
│   └── …
├── assets/
│   ├── theme.css            # all styles from parlour.jsx, ported
│   └── theme.js             # scroll listener for nav wordmark
└── README.md
```

Steps:
1. Translate the CSS-in-JS template literal in `parlour.jsx` into `assets/theme.css`. Strip the React-specific bits (CSS variables driven by inline `style={{}}` need to become per-category classes like `.card[data-category="POP CULTURE"]`).
2. Build `index.html` with the static markup matching the homepage spec above. Hard-code the 8 cards from `data.js`. Use a `data-category` attribute on each card and have CSS apply the right `--card-bg` and `--art-ink` based on that attribute (`.card[data-category="POP CULTURE"] { --card-bg: #dde4f0; --art-ink: #2c4ab8; }` etc).
3. Build `essay/<slug>.html` for each post.
4. Add a tiny `theme.js`:
   ```js
   const nav = document.querySelector('.nav');
   const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 220);
   onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
   ```

### Phase 2 — Port to WordPress theme
Template files to create:
```
unpublishable-theme/
├── style.css              # theme metadata header + main CSS
├── theme.json             # block editor tokens (colors, typography)
├── functions.php          # enqueue styles/scripts, register category taxonomies
├── header.php             # opens HTML, renders nav
├── footer.php             # closes HTML
├── index.php              # archive fallback
├── home.php               # the homepage grid
├── single.php             # essay page
├── assets/
│   ├── theme.css
│   └── theme.js
└── inc/
    └── card.php           # reusable card partial (get_template_part('inc/card'))
```

Notes for the WordPress conversion:
- **Categories**: Use WordPress's built-in `category` taxonomy. Create one category per design token (POP CULTURE, TECHNOLOGY, etc.). In `card.php`, read the post's primary category, slug it, and emit `data-category="<UPPERCASE NAME>"` so the CSS color map applies.
- **Essay number**: store as a post meta `_essay_number` (integer). Render with `printf('%d.0', $n)`.
- **Read time**: store as post meta `_read_time_minutes`; render `%d MIN`.
- **Featured/hero**: On `home.php`, query the most recent post and mark it `.card-hero`. The next 4 fill the top-grid auto-flow area; the next 3 fill `.grid-bottom`. After 8, paginate or hide — your call.
- **Artwork**: ship the artwork compositions as PHP partials in `inc/artwork/<kind>.php`. `card.php` picks the partial via a `switch` on category. No content needed inside them — they're decorative.
- **Body drop cap**: implemented in CSS (`::first-letter` on `.essay-body > p:first-of-type`), no PHP work.
- **Next →** link on `single.php`: use `get_adjacent_post()` and link by permalink.
- **Block editor**: register a `theme.json` so the editor's color palette and typography match. Disable the default container width — the essay column is exactly 720px.
- **Comments**: explicitly off in this design. In `functions.php`, `add_filter('comments_open', '__return_false');` and don't include `comments.php`.

### Phase 3 — Hardening
- Add `<meta name="viewport">` and basic responsive rules. The prototype is desktop-first; below ~900px collapse the top grid to `repeat(2, 1fr)` with hero spanning all 2 cols × 1 row, and below ~640px collapse to a single column. (Not specified by the designer — you have license here.)
- Add Open Graph meta tags. The OG image can be a server-rendered SVG of the post's number + category artwork on the category background.
- RSS: WordPress generates this by default. Keep it.

---

## Files in this bundle
- `README.md` — this file
- `reference/Unpublishable.html` — the prototype shell. Open it in a browser to see the design live. The Tweaks panel in the top-right lets you switch directions — **only the PARLOUR direction (default) is shipping**.
- `reference/parlour.jsx` — the canonical design source. Read the CSS template literal at the top of the file; that's the source of truth for spacing/colors/typography.
- `reference/data.js` — the eight seed essays.

If anything is ambiguous, the **prototype is the ground truth**. Open `Unpublishable.html`, inspect with devtools, and read the rendered styles.
