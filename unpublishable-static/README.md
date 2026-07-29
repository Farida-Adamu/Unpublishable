# Unpublishable — Phase 1 static site

Plain HTML/CSS/vanilla-JS build of the PARLOUR direction from
`../design_handoff_unpublishable/`. No build step — open `index.html`
in a browser.

## Structure

```
index.html            homepage: sticky nav, hero wordmark, tagline,
                      4×2 top grid (hero card spans 2×2), 3×1 bottom grid
essay/<slug>.html     one page per essay (8 total), cyclical Next → links
assets/theme.css      all styles, ported from reference/parlour.jsx
assets/theme.js       nav wordmark scroll toggle (>220px)
```

## How it maps to the design source

- `assets/theme.css` is a 1:1 port of the CSS template literal in
  `reference/parlour.jsx` (class names follow the handoff README:
  `.nav`, `.frame`, `.card`, `.card-ttl`, `.essay`, …).
- Per-category card colors are driven by `data-category` on each
  `.card` (and on the `.site` root of essay pages), which sets
  `--card-bg` / `--art-ink`. The hero card hard-overrides to
  `#b8c8e6` / `#1a2f8a` per spec.
- Artwork is CSS shapes + inline SVG; SVG strokes/fills use
  `currentColor`, colored by `.art svg { color: var(--art-ink) }`.
- Whole-card click targets use a stretched link on the card title
  (`.card-ttl a::after` covers the card above the decorative
  "Read →" chip).
- Essay pages pin the nav wordmark via a permanent `.is-scrolled`
  class plus `data-wordmark-fixed`, which tells `theme.js` to skip
  the scroll listener there.

## Regenerating pages

Pages were generated from `reference/data.js`; they're plain static
files and can be edited directly. Phase 2 converts this into a
WordPress theme (see the implementation plan in the handoff README).
