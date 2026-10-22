# Design B "Viewfinder"

The brand name is "Point Of View", so B turns that into the visual idea: a camera **viewfinder**.
Every photo is framed by four L-shaped corner brackets in a brand colour, like a camera focusing on
the drink. The logo's rounded diamond cubes stay, but only as small functional markers (category
dots, list bullets, the active tab), never as confetti.

B is the UX-first option: clean, fast to scan, easy to use with one thumb in a busy shop.

## How it differs from A "Mango Pop"

| | A Mango Pop | B Viewfinder |
|---|---|---|
| Canvas | warm cream #FFF8E7 | clean white #FFFFFF with soft tinted category fields |
| Photos | tilted white cards, drop shadows | straight, rounded 24px, viewfinder brackets, colour-tinted backdrop |
| Prices | rotated sticker tags | straight bold numerals ("95" + small "EGP"), ink on a mango-yellow chip |
| Decoration | falling confetti cubes and dots | none; cubes only as markers |
| Hero | giant tagline + one photo | "Today in focus" swipe carousel of the 5 signatures (scroll-snap) |
| Layout | zig-zag cards | 2-column photo grid + compact list rows for juices (mixed density) |
| Detail | colour hero + card | photo stage + bottom sheet, "Say this at the counter" card, related carousel, thumb-zone bottom bar |

## UX rules (must hold on both screens)

- Sticky header (logo + "Cairo") and a sticky category rail under it. Rail links are plain `#anchors`
  (works with no JS); an optional small script highlights the category in view (scroll-spy).
- Every tap target is at least 44x44px.
- Text contrast AA: never yellow (#F9CD18) or teal (#17AE9D) as text on white. Use the `*Deep` tones
  in `theme.mjs` for coloured text; yellow is a fill with ink text.
- English name is primary, Arabic name always directly under it (`ar()` helper, `lang="ar" dir="rtl"`).
- Page must be complete with JS disabled (the HTML is uploaded to Stitch, where scripts may not run).
- `prefers-reduced-motion`: no animation.
- Back / share and the main actions sit in the thumb zone on the detail screen (bottom bar).
- Light only. Never dark backgrounds.

## Type

Readex Pro only (brand font, Latin + Arabic). Headings 700, tight letter-spacing (-0.02em),
small labels 600 uppercase letter-spaced .08em. Prices 700 with tabular numbers.

Tokens and shared components: `tools/screens/b/theme.mjs`.
