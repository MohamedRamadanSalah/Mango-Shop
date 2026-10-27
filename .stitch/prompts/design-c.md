# Design C "Color Blocks"

Client brief (2026-10-27): (1) works on the web and on phones, (2) the logo colours must show strongly,
(3) a very simple, understandable menu structure with no noise.

The idea: the five menu categories already map one-to-one to the five logo colours
(Signatures yellow, Cubes orange, Smoothies purple, Juices teal, Seasonal coral). So each category
is a **full-width block in its own logo colour**. Colour *is* the structure: you always know where you
are by the colour around you. Nothing else is decorative.

## How it differs from A and B

| | A Mango Pop | B Viewfinder | C Color Blocks |
|---|---|---|---|
| Target | phone | phone | **responsive**: phone, tablet, desktop (one page) |
| Colour | cream canvas, colour accents | white canvas, soft tints | **solid logo colours** fill each category block |
| Decoration | confetti cubes, rotated stickers | viewfinder brackets | none. Cubes only in the logo mark |
| Structure | zig-zag cards | carousel + grid + rows | header > colour chip nav > 5 colour blocks > footer |
| Cards | tilted, shadows | bracketed photos | one card type everywhere: white, straight, photo / names / price |

## Structure (menu)

1. Sticky top bar: logo lockup (mark, POV, بوف) + "Cairo".
2. Brand stripe: five equal bars in the logo colours (the only "graphic").
3. Short intro: the tagline in the logo's own colours (EN + AR). No hero photo.
4. Sticky category nav: five solid chips, each in its category colour (EN + AR). Plain `#anchors`.
5. Five category blocks, in menu order. Each: number, EN title, AR title, drink count, then a grid of cards.
6. Footer: logo, tagline, stripe.

## Responsive rules

- Phone (< 700px): 2-column grid; the last card of an odd count spans both columns as a wide card.
- Tablet (700-1099px): 3 columns. Desktop (>= 1100px): 5 columns in a 1200px container
  (Signatures and Juices fill one row exactly).
- Small sections (grid class `n<count>`): from 700px a 2-drink section shows two wide horizontal cards
  across the full width; a 1-drink section (`blk-solo`) shows one wide card, and on desktop puts the
  title left and the card right. So no block is left half empty.
- Nav chips scroll sideways on phones and share the full width on desktop.
- Detail page: stacked on phones, photo left / info right on desktop.

## Colour and text rules

- Text on a colour block: ink #2A1640 on yellow, orange, teal and coral; white only on purple
  (all >= 4.5:1). Never white on yellow/teal/coral, never yellow/teal text on white.
- Cards are pure white on the colour block. The price chip uses the category colour.
- Light only. No gradients, no shadows heavier than a hairline, no rotation.

## UX rules (same as B)

Tap targets >= 44px. EN name first, AR directly under it (`ar()` only, never new Arabic).
Works with JS off (scroll-spy is optional). `prefers-reduced-motion`: no animation.
Readex Pro only. Icons as Material names, swapped to MingCute by `stitch-icons apply`.

Tokens and components: `tools/screens/c/theme.mjs`.
