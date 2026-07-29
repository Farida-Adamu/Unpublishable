# Unpublishable — WordPress theme (Correspondence)

Phase 2 conversion of the static Correspondence build in
`../unpublishable-static/`. Classic PHP theme, no build step, no
JavaScript.

## Files

```
style.css            theme registration header (styles live in assets/)
theme.json           editor tokens: palette, two font families,
                     640px content / 760px wide layout
functions.php        enqueues, homepage-shows-all query, comments off,
                     meta registration, sign-off/next-letter/standfirst helpers
header.php           opens .site/.shell; nav renders only on non-letter pages
footer.php           closes the shells
home.php             homepage: standfirst + full list of letters
index.php            fallback (archives/search) — same list
single.php           a letter: back, date, title, body, sign-off, next arrow
inc/letter-item.php  one index row (stretched-link click target)
assets/theme.css     all styles (static theme.css + small WP additions)
screenshot.png       admin theme-picker preview
```

## Content mapping

| Design element | WordPress source |
|---|---|
| Letter title / body | post title / content |
| Dek (index summary) | manual excerpt (empty = row shows title + date only) |
| Date | post date, `M j, Y`, uppercased by CSS |
| Standfirst | site tagline, falling back to "Letters about a changing world." |
| Wordmark | site title (CSS lowercases it) |
| About link | appears only if a page with slug `about` exists |
| Subscribe link | RSS feed by default; `unpublishable_subscribe_url` filter overrides |
| Sign-off | static default; `_unpublishable_signoff` post meta or `unpublishable_signoff` filter overrides |
| Next arrow | `get_previous_post()` (newer → older), wrapping oldest → newest |
| Category / essay number / read time | not rendered; `_essay_number` + `_read_time_minutes` meta registered for future use |

Comments and pings are force-closed via filters; there is no
comments.php and no comment markup anywhere.
