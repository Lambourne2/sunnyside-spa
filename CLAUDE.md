# Sunnyside Spa

Marketing site for a single-location day spa in Utah. Single conversion goal: book a treatment.

## Before any UI work
Read `docs/design.md`. It defines the token system, type scale, motion, copy voice,
and an explicit list of things not to do. Do not introduce a color, font, radius,
shadow, or easing that isn't in it.

## Stack
Astro, plain CSS with custom properties. No Tailwind, no CSS-in-JS, no animation library.

## Non-negotiables
- No pure white anywhere. Page background is --shell (#FCF8EF).
- Body text is --ink (#2A211C). Never a neutral or magenta-leaning black.
- Dusty rose and ocean blue never carry small text. See the contrast rules in docs/design.md §3.
- Handwriting (Caveat) never appears in nav, buttons, forms, or repeated UI.
- No serif in any type the site sets — font stacks, stylesheets, components. Serif lettering
  already baked into supplied photography and footage (the hero video and footer.png taglines)
  is a deliberate grandfathered exception, not a bug. Don't restyle it, don't extend it.
  See the 2026-08-05 amendment in docs/design.md §4.
- All line art is single-weight monoline. No fills, no second color, no shadows on icons.
