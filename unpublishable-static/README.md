# Unpublishable — Phase 1 static site (Correspondence direction)

Plain HTML/CSS build of the CORRESPONDENCE direction from
`../design_handoff_unpublishable_v2/` — a personal blog of letters.
No build step, no JavaScript — open `index.html` in a browser.

This replaces the earlier Parlour card-grid build (see git history).

## Structure

```
index.html            homepage: nav, one-line mono standfirst,
                      single-column flowing list of 8 letters
letter/<slug>.html    one page per letter (8 total), cyclical
                      "Next letter →" links
assets/theme.css      all styles, ported from reference/correspondence.jsx
```

## How it maps to the design source

- `assets/theme.css` is a port of the CSS template literal in
  `reference/correspondence.jsx`. One deliberate deviation, per art
  direction: the serif is **Libre Caslon Text** (a Caslon revival,
  New Yorker-style) instead of Instrument Serif, for titles, body,
  wordmark, and sign-off. Titles use weight 400 — the family's
  regular — in place of the spec's 500, which the family doesn't
  carry. JetBrains Mono handles standfirst/nav/dates as specced.
- No rules/borders, no cards, no imagery, no category colors — the
  `n`, `category`, and `read` fields in `data.js` are kept in the
  data model but rendered nowhere.
- Each list row is one click target via a stretched link on the
  title (`.item .ttl a::after` covers the row); hovering anywhere
  fades the title to 0.6 opacity.
- Letter pages use the 640px `.letter-shell` column: back link,
  date, title, plain body, the static two-line sign-off, and the
  `Sent <date>` / `Next letter →` footer row.

## Regenerating pages

Pages were generated from `reference/data.js`; they're plain static
files and can be edited directly. Phase 2 converts this into a
WordPress theme per the v1 handoff plan minus artwork/color-map/
numbering (see the v2 README).
