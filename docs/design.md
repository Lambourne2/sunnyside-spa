# Sunnyside Spa — Website Design Prompt

**The brief in one line:** Design and build the website for Sunnyside Spa, a single-location, appointment-based day spa in Utah. The site's only real job is to get a first-time visitor to book a treatment. Everything else serves that.

**Confirmed scope:** One location, Utah. Appointment-based. A small retail line is coming but is not for sale yet. No memberships and no gift cards yet — build the page so both can be added later without a redesign. Audience is women 25–45 who buy skincare, not medspa patients.

---

## 1. What the brand feels like — and where it lives

Luxurious, calm, and warm — but the warmth comes first. This is a friend who happens to have excellent taste, not a clinic and not a wellness institution. Closer to a beauty brand's website (Glossier, Ilia, Tata Harper) than to a spa's.

The whole identity lives in **one tension**: irregular hand-lettering against precisely tracked capitals. The handwriting is the friend. The tracking is the luxury. Drop either half and the brand collapses — handwriting alone reads as a home-based Etsy business, tracked caps alone reads as a hotel spa menu. Every screen needs both.

### Utah, not the coast

The identity collage was rendered with California cues — bougainvillea, an ocean pool, a Laguna Beach address on the business card. Those are placeholders and need replacing, including in the printed collateral. Shot literally, they'd make a single-location spa look like it belongs to a business somewhere else, which is the fastest way to lose local trust.

The palette survives the move intact, because it was never really a coastal palette:

| Token | What it is here |
|---|---|
| Dusty rose `#A57878` | Sandstone, canyon wall, adobe |
| Lemon chiffon `#F4EDBE` | Sun-bleached plaster, dry grass, high-desert light |
| Royal gold `#F8E16C` | Direct sun at altitude |
| Ocean blue `#2E86AB` | Utah sky and pool water — not the sea |
| Pearl aqua `#8BC6BA` | Mineral spring, still reservoir, sage-adjacent green |

**Photography direction.** Interior-first: the treatment room, light falling across the table, oils and unglazed ceramic, linen, hands, a shoulder, a robe. Water appears in a vessel or a pool, never as surf. Landscape enters only as texture and only as Utah's own — sandstone, dry light, an intensely blue sky. Dry air throws harder-edged shadows than coastal haze does, which works in the signature element's favor: shoot for crisp shadow edges, not soft diffusion.

Keep the arch. Plaster archways read Mediterranean *and* Southwestern; it's the one borrowed form that carries across without lying about the location.

---

## 2. Design DNA — the non-negotiables pulled from the identity

1. **The wordmark is drawn, not typed.** Irregular baseline, single-weight marker stroke, hand-drawn rays around the leading S. Ship it as an optimized SVG traced from the identity artwork. Do not substitute a handwriting font for the wordmark.
2. **One stroke weight for all line art.** The logomark and all five icons are monoline, roughly 1.5px at 24px, round caps, no fills, no second color, no shadows. Scale the stroke with the icon so it never thins out or thickens.
3. **The logomark is a system, not a lockup.** Sun + rays + two waves. It decomposes: waves alone become section dividers, rays alone become the loading and hover flourish, the full mark becomes the favicon and the scroll-to-top. Reuse the parts.
4. **Blue is punctuation.** In the identity, ocean blue appears twice and covers maybe 5% of the surface. Hold it to one full-bleed band and the footer. Blue everywhere turns this into a dental office.
5. **Nothing sits on flat white.** Every surface is a material: warm paper, plaster, linen, water. Add a subtle grain to flat color fields.
6. **Warm neutrals carry the page.** Lemon chiffon and paper do the structural work; rose, aqua, gold, and blue are accents on top of them.

---

## 3. Color

### Brand palette (locked)
```css
--lemon-chiffon: #F4EDBE;  /* soft section grounds, cards, ribbons */
--royal-gold:    #F8E16C;  /* on dark only: headings, marks, highlights */
--dusty-rose:    #A57878;  /* line art, icons, decorative rules, tinted panels */
--ocean-blue:    #2E86AB;  /* accent only — never a text color on light */
--pearl-aqua:    #8BC6BA;  /* tags, badges, quiet panels, hover states */
```

### Required extensions (the brand palette has no legible text color)
```css
--shell:      #FCF8EF;  /* default page background — warm paper, never #FFF */
--ink:        #2A211C;  /* body copy — warm espresso, 14.9:1 on shell */
--ink-soft:   #6E5A50;  /* secondary copy, captions, meta — 6.1:1 on shell */
--rose-deep:  #7E5555;  /* rose used as text or links — 6:1 on shell */
--deep-sea:   #1D5A75;  /* any surface that carries light text — 7.6:1 with shell text */
```

**On the ink specifically.** It has to lean orange-brown, not neutral and not magenta. A fully neutral near-black (#151515) sits on warm paper like a separate layer printed on top; the print-standard rich black (#231F20) leans magenta, which reads faintly purple in long paragraphs against a yellow-warm ground. #2A211C is within half a point of contrast of both and carries the same warmth as the plaster and gold. Set headings at full `--ink` rather than softening them — Jost 300 in tracked caps is thin enough that lightening the color makes large type look washed rather than elegant.

**Contrast rules, stated plainly because the brand palette will fail an audit otherwise:**
- Dusty rose on lemon chiffon is 3.2:1 — decorative and large display type only, never body copy. Use `--rose-deep` for any rose-colored text.
- Dusty rose as a *panel* fails in both directions: ink on rose is 4.1:1, shell on rose is 3.6:1. Rose-filled panels carry large display type only. If a panel needs body copy on it, darken the panel itself to `--rose-deep` and set the text in shell (7.9:1).
- Ocean blue on cream is 3.5:1 — same restriction. Use `--deep-sea` for the blue band so cream text on it clears 7:1.
- Royal gold only ever appears on `--deep-sea` or on photography with a darkening overlay. Gold on cream is invisible.

### Surface ratio
Roughly 55% shell + lemon chiffon, 25% photography, 10% dusty rose tints, 5% pearl aqua, 5% deep-sea and gold combined.

---

## 4. Typography

Deliberately **no serif in DOM type.** The identity is handwriting plus light geometric caps; adding a display serif would be inventing a third voice and would drift toward the generic cream-and-serif look.

> **Amended 2026-08-05.** The rule was originally "no serif anywhere." The supplied hero
> footage and `footer.png` both bake the tagline SUNSHINE FOR YOUR SOUL into the pixels in a
> bracketed serif, while the supplied logo lockups use the correct geometric sans. Rather
> than block the hero on a re-render, the ban now applies to **type the site sets** — every
> font stack, every stylesheet, every component. Serif lettering already baked into supplied
> photography and footage is grandfathered in. This is a deliberate exception, not an
> oversight: do not "fix" it by restyling, and do not treat it as license to add a serif to
> the type system. Revisit when those assets are re-rendered. See `docs/asset-audit/`.

| Role | Face | Treatment |
|---|---|---|
| Wordmark | Hand-lettered SVG | Fixed artwork |
| Pull quotes, testimonials, small warm asides | **Caveat** 500–600 | Sentence case, slight rotation (−1.5°) allowed |
| Display headings, section titles | **Jost** 300 | Uppercase, `letter-spacing: 0.16em` |
| Eyebrows, labels, nav, buttons, prices | **Jost** 400 | Uppercase, `letter-spacing: 0.28em`, small |
| Body copy | **Karla** 400 | Sentence case, `line-height: 1.75` |

**Scale**
```
display   clamp(2.5rem, 6vw, 4.5rem)   Jost 300, 0.10em
h2        clamp(1.5rem, 2.6vw, 2.25rem) Jost 300, 0.16em, uppercase
h3        1.125rem                      Jost 400, 0.20em, uppercase
eyebrow   0.6875rem                     Jost 400, 0.28em, uppercase
quote     clamp(1.75rem, 4vw, 3rem)     Caveat 600
body      1.0625rem / 1.75              Karla 400
meta      0.8125rem                     Jost 400, 0.14em
```

Rules: handwriting never appears in navigation, buttons, forms, or any repeated UI — it's reserved for three or four emotional moments per page. Tracked caps never run longer than about six words. Body copy maxes at 62 characters per line.

---

## 5. Shape, texture, icons

- **The arch.** Large and mid-size images are framed with a semicircular top: `border-radius: 50vw 50vw 4px 4px`. This is the plaster doorway from the identity and it's the primary image shape.
- **The hang tag.** Full stadium radius — rounded at both ends — from the aqua tag in the identity. It does double duty: buttons, badges, and pills, *and* small or portrait images. Cards stay at 4–8px, not 16px.
- **Two image shapes, not one and not three.** Arch for the hero-adjacent and feature images, hang tag for the small ones — gallery tiles, testimonial portraits, the product shot. Running everything as an arch goes monotonous over a long homepage, and a third organic shape would give the site two competing image languages. Both of these are already in the identity, so neither has to be invented.
- **Grain.** An SVG `feTurbulence` overlay at 3–4% opacity on every flat color field. Flat color with no texture is the fastest way to lose the material feeling.
- **Dividers are waves.** Never a straight `<hr>`. Use the logomark's two-wave curve as an inline SVG rule, dusty rose at 60% opacity.
- **The five icons** — sun-over-water, botanical sprig, lotus, wave-and-circle, full sun — map to Massage, Skincare, Body, Wellness, You Time. These are the service taxonomy. Draw them as one SVG sprite in the shared monoline style.

---

## 6. Assets on hand

All of this already exists. Build against it — don't recreate it, and don't substitute fonts or redraw marks that have already been made.

### Logo set

Four lockups plus the bare mark. Give each a fixed role so the same logo never appears at two different proportions on one screen:

| Asset | Where it goes |
|---|---|
| Horizontal / long | Desktop nav, footer, email signature |
| Stacked / tall | Mobile hero, hang-tag cards, portrait social, print collateral |
| Wide | Open Graph and Twitter cards (1200×630), full-bleed banner ends |
| Logomark alone | Favicon, condensed mobile nav, scroll-to-top, accordion marker, loading state, social avatar |

Prep before handoff: every file as optimized SVG with strokes set to `currentColor` wherever the artwork allows, so one file recolors by context instead of shipping ink, gold, rose, and shell copies of each. PNGs at 1x/2x only for email and OG, where SVG isn't supported. The favicon needs 32px and 180px raster alongside the SVG — the mark's rays will fill in and turn to mud at 32px, so hand-tune a simplified small variant rather than letting it downscale.

### Hero video

Yellow wall, plant shadow moving in the wind, wordmark and tagline in frame on the wall. This *is* the signature element in section 7, shot for real rather than simulated in CSS, which is a straight upgrade. Three things need handling before it ships.

**The text is baked into the footage.** The wordmark and tagline live in the pixels, so they're invisible to search engines and screen readers, can't reflow, and can't be changed seasonally. Ship the hero with no overlaid heading and a visually hidden `<h1>Sunnyside Spa — sunshine for your soul</h1>` in the DOM, so the page announces itself correctly while the video does the visual work.

**It will crop badly in portrait.** A landscape frame composed around wall text loses that text on a phone. Either render a 9:16 version, or let mobile fall back to the poster still with real DOM type set in Jost and Caveat over it. Don't letterbox or scale the landscape render to fit — the lettering goes tiny and the shadow motion becomes illegible, which is the whole point of the shot.

**Request a clean plate.** A second render of the same wall with no text on it is worth getting now. It gives a text-free background for the mobile fallback, for interior page headers, and for any future hero messaging. If the footage was generated rather than filmed, that's a re-prompt, not a reshoot.

**Check the lettering matches.** If the wall wordmark was generated rather than traced from the real SVG, the letterforms won't line up exactly — and the nav wordmark sits within a couple hundred pixels of the video wordmark during the scroll transition, where any mismatch reads as sloppiness. Compare them at full size, side by side, before committing to the shot.

**Delivery specs**
- H.264 MP4 and VP9 WebM, audio track stripped entirely — not just muted.
- 10–15 second seamless loop. If the plant motion doesn't cycle cleanly, crossfade the last 0.5s into the first rather than accepting a visible jump.
- Under 3 MB for the desktop render, under 1.5 MB for the portrait one.
- `<video autoplay muted loop playsinline preload="none" poster="…">`, with the poster exported from frame one as WebP.
- The poster is the LCP element, preloaded via `<link rel="preload" as="image">`. The video must never be the LCP.
- Load the video only above 768px and only when `navigator.connection?.saveData` is false.
- Under `prefers-reduced-motion: reduce`, never load the video at all — render the poster still.

---

## 7. Signature element

**The light moves.**

The hero video carries this: a leaf shadow tracking slowly across warm plaster, so the page reads as afternoon light moving rather than a static image. It's the tagline demonstrated instead of stated.

Echo it in CSS everywhere the video isn't. On interior page headers and on the poster-still fallback, run a leaf shadow PNG overlay on a 45-second loop — translate plus a 2% scale, opacity around 0.18, `mix-blend-mode: multiply`. Same idea, one image and one keyframe, so the whole site feels lit by the same sun rather than having one impressive hero bolted onto a flat site.

This is where the boldness gets spent. Everything else stays quiet and disciplined.

---

## 8. Homepage structure

```
┌──────────────────────────────────────────────┐
│ ribbon: NOW BOOKING · [NEIGHBORHOOD], UT     │  lemon chiffon, tracked caps
├──────────────────────────────────────────────┤
│ [wordmark]    treatments  about  visit ⟨BOOK⟩│ transparent → shell on scroll
├──────────────────────────────────────────────┤
│                                              │
│   [looping hero video: yellow wall, moving       │  HERO — no overlaid heading;
│    plant shadow, wordmark + tagline in frame]    │  wordmark is in the footage.
│                                                  │  Visually-hidden h1 in DOM.
│        ⟨Book a visit⟩   see treatments →         │  Mobile: poster still + real
│                                                  │  DOM type, or 9:16 render.
│                                              │
├──────────────────────────────────────────────┤
│        ～～～ wave divider ～～～               │
│   "come as you are,          [arched photo]  │  WELCOME — off-center,
│    leave more you."          of the room     │  Caveat quote + 2 sentences
├──────────────────────────────────────────────┤
│  ⊙ TREATMENTS                                │  asymmetric, not a 5-up grid:
│  ┌──────────┐ ┌────┐ ┌────┐                  │  one wide feature card,
│  │ massage  │ │skin│ │body│                  │  four standard, arched tops,
│  └──────────┘ └────┘ └────┘                  │  icon + name + one line +
│  ┌────┐ ┌────┐                               │  "from $145 · 60 min"
│  │well│ │you │                               │
├──────────────────────────────────────────────┤
│ [arched photo] │  THE SUNRISE RITUAL         │  2–3 alternating rows,
│                │  copy + ⟨book⟩              │  image side alternates
├──────────────────────────────────────────────┤
│  THE SPACE — mixed-ratio gallery strip       │  horizontal scroll on mobile,
│  [tall][wide][water/stone tile][tall]        │  one texture tile
├──────────────────────────────────────────────┤
│  KIND WORDS — Caveat quotes on hang-tag      │  aqua/rose tinted cards
│  shaped cards, slight rotation               │
├──────────────────────────────────────────────┤
│  THE SHELF, SOON — one product, one email    │  lemon chiffon. Pre-launch
│  field. No cart, no prices.                  │  list-building, not a store.
├──────────────────────────────────────────────┤
│ ▓▓▓ deep-sea band — gold hand-lettering ▓▓▓  │  THE CLOSER. Booking, not
│ "Two hours that are only yours" + ⟨book⟩     │  membership. Only dark moment.
├──────────────────────────────────────────────┤
│  YOUR FIRST VISIT — accordion, hairline      │  arrive 15 early, what to wear,
│  rose rules, no boxes                        │  cancellation, parking
├──────────────────────────────────────────────┤
│  FOOTER — deep-sea, gold wordmark, hours,    │
│  address, newsletter, instagram row          │
└──────────────────────────────────────────────┘
```

**Why the dark band moved.** It was carrying a membership offer that doesn't exist yet. Rather than delete the page's only dark moment — it's also the only place royal gold appears, so losing it costs the palette a color — it becomes the booking closer: the last push after testimonials have done the persuading. Testimonials moved above it for that reason.

**When memberships and gift cards launch**, memberships take this band back and booking returns to a lighter band above the FAQ; gift cards go in the footer utility row and as a secondary nav item. Nothing else has to move.

**The shelf section** is a waitlist, not a store. One product photographed properly, one line, one email field. Building the list before the line exists is worth more than a placeholder shop, and it keeps the section slot warm for a real product trio later.

Mobile keeps a persistent bottom booking bar (shell background, rose pill button, hairline top rule).

> **Amended 2026-08-05.** Two changes to the top of the homepage, both on request.
>
> **The ribbon is gone.** §8 opened with a lemon chiffon strip reading
> `NOW BOOKING · [NEIGHBOURHOOD], UT`. It was removed; the neighbourhood still
> appears in the page ledes and the footer, so only the strip was lost. With it
> gone the chrome above the hero dropped from ~126px to a 64px nav.
>
> **The hero CTAs moved out of the hero.** §8 draws `⟨Book a visit⟩ see
> treatments →` over the footage. They now sit in a chiffon bar directly beneath
> it, so nothing is overlaid on the wall at all, and "see treatments" became a §9
> secondary button rather than a text link so the pair reads as a bar.
>
> **The nav floats over the footage** and is `position: fixed`, not sticky —
> sticky was bounded by its parent and scrolled away after the hero. Over the
> video it carries a soft shell gradient scrim, because the frond shadow crosses
> the top-left and dark ink on it measured 3.81:1. With the scrim, 7.62:1
> measured on rendered pixels. The scrim is a tint, not a frosted panel, so §13
> still holds.

### Other pages
Treatments index (filter by the five icons) · Treatment detail (arched hero, what to expect, duration/price, add-ons, book) · Our story (founder photo, Caveat-heavy) · Visit (hours, map, parking, what to expect on arrival) · Booking (embedded scheduler, restyled to the palette).

That's five pages plus the homepage. No shop, no product detail, no memberships, no gift cards — building empty versions of those now would make a small spa look like it's pretending to be a chain. Add them when the offerings are real.

---

## 9. Components

- **Primary button** — `--rose-deep` fill, shell text, full pill radius, Jost 0.24em tracking, 14px/28px padding. Hover: darkens further, no lift, no shadow.

> **Amended 2026-08-05.** This originally read "dusty rose fill, shell text."
> Measured, shell on `--dusty-rose` is **3.56:1**, which fails the 4.5:1 floor in
> §12 for a label set in small tracked caps. There is no rescue via text colour —
> `--ink` on dusty rose is only 4.17:1, so that mid-tone fill is a contrast dead
> zone in both directions. §3 already prescribes the fix for this exact case
> ("darken the panel itself to `--rose-deep` and set the text in shell"), which
> measures **5.97:1**. Confirmed by Peyton. Do not revert the fill to
> `--dusty-rose`. The knock-on: hover has nowhere darker to go within the named
> palette, so it mixes `--rose-deep` toward `--ink` — the one colour in the
> button that the palette does not name.
- **Secondary** — 1px rose border, transparent fill. Hover: fills with lemon chiffon.
- **Text link** — ink with a 1px rose underline offset 4px; on hover the underline redraws left-to-right over 300ms.
- **Arched image frame** — arch radius, 1px rose border at 30% opacity, no drop shadow. Any shadow used anywhere is warm and diffuse: `0 20px 40px -24px rgba(42,33,28,0.22)` — the ink at low alpha, never a gray or black shadow.
- **Treatment card** — arched photo, icon, name in tracked caps, one line of body, price/duration in meta. Hover: image scales to 1.03 over 800ms, icon rays extend 2px.
- **Form fields** — underline only (1px rose), no boxes, no fills. Label sits above in eyebrow style. Focus: underline thickens to 2px and shifts to deep-sea, plus a visible 2px offset focus ring for keyboard users.
- **Accordion** — hairline rose rules, no containers; the marker is the logomark's rays rotating 45° on open.

---

## 10. Motion

- Palm shadow drift: 45s, linear, infinite (the signature).
- Logomark draw-on at page load: `stroke-dashoffset` animation, 900ms, sun first, then waves, then rays staggered 40ms apart.
- Scroll reveals: 24px rise plus fade, 700ms, `cubic-bezier(0.22, 0.61, 0.36, 1)`, 80ms stagger between siblings.
- Wave dividers: ±6px horizontal drift over 12s, the two waves offset from each other so they never move in lockstep.
- Nav condense: transparent to shell over 240ms once the hero clears.

Under `prefers-reduced-motion`, drop the drift, the draw-on, and the transforms. Keep opacity fades only.

### Optional: scroll advances the sun

One scroll-linked effect is worth building, and it should be the light rather than the surface. As the page scrolls, update a single CSS custom property from scroll position and let it drive two things: the leaf-shadow overlay's `translateX` and rotation by a few degrees, and a warm overlay that shifts from midday to late-afternoon gold — roughly `hsl(45 70% 60% / 0.03)` at the top to `hsl(30 75% 55% / 0.07)` at the footer.

The whole page then reads as one long afternoon. It reinforces the tagline instead of decorating around it, it's the same metaphor as the hero video rather than a competing one, and it costs one `requestAnimationFrame`-throttled scroll listener setting one variable. Under reduced motion, skip the shadow movement and keep the color shift, which is imperceptible as motion.

### Directions considered and rejected

Recorded so they don't get reintroduced later:

- **Viscous / liquid scroll distortion — a WebGL shader rippling water or melting cream, tracking scroll velocity.** Three problems. It's a second ambient motion system fighting the hero video, and when two things move ambiently, neither reads as deliberate. Scroll-linked distortion makes a page feel unstable, which is the opposite of what a spa is selling, and it's a known vestibular trigger. And it costs a shader runtime plus continuous GPU work on a site whose hardest requirement is LCP under 2.0s on a mid-tier phone. The instinct behind it — that the page should feel like living material — is right, and the grain overlay, drifting wave dividers, and scroll-advanced light above are how it gets served.
- **Morphing water-droplet image masks.** Blob masks conflict with the arch, which is doing real work as the one borrowed form that reads both Mediterranean and Southwestern. Animated blob morphs also date the site to a specific trend window. The monotony problem they solve is real — see the two-shape system in §5, which solves it with a shape the brand already owns.

---

## 11. Copy voice

Second person, present tense, plain verbs, sentence case, no exclamation points. Say what actually happens instead of selling a feeling. Ban list: indulge, pamper, oasis, sanctuary, journey, elevate, unwind, "your me-time awaits."

Real strings to use:
- Hero CTA: `Book a visit` — and the confirmation says `Booked.`
- Treatment lead-in: `Sixty minutes, warm oil, and someone who actually listens when you say where it hurts.`
- Dark closing band: `Two hours that are only yours` / `Book a visit`
- Retail waitlist: `The shelf is almost ready` / `Facial oil first. Tell us where to send it.` → button `Join the list` → confirmation `You're on the list.`
- Form error: `That email is missing an @.` — not `Please enter a valid email address.`
- Booking unavailable: `That time just went. Here are three nearby openings.`
- Footer sign-off: the tagline, hand-lettered, in gold.

---

## 12. Quality floor

Responsive to 360px. Visible keyboard focus on every interactive element. Reduced motion respected. All body text at 4.5:1 minimum. Images lazy-loaded with warm-tinted blur placeholders, never gray. Alt text written by someone who saw the photo. Type at 100% zoom must not require horizontal scroll at 320px.

**Performance budget**, because a video hero is the easiest way to lose it: LCP under 2.0s on a mid-tier Android over 4G, with the hero poster as the LCP element and preloaded. Homepage transfer under 1.5 MB excluding the video. The video loads after first paint and never blocks render. CLS under 0.05 — reserve the hero's aspect ratio in CSS so nothing jumps when the video swaps in for the poster.

---

## 13. Hard no's

> **Amended 2026-10-22 — the redesign.** Peyton asked for a full redesign with
> "liquid glass" and three.js. Two bans below are lifted, on request, and only
> within these limits so §10's reasons for them still hold:
>
> - **WebGL is allowed in exactly one form: the sun wall.** A plaster wall with a
>   procedural leaf shadow (§7's signature, now drawn in a shader rather than
>   waiting on a PNG that never arrived), plus the logomark or a service icon
>   rendered as monoline glass tubes in front of it. One canvas per page, hero or
>   page header only. It never distorts content and never responds to scroll
>   velocity — it responds to scroll *position* (the sun sets as you read, which is
>   §10's "scroll advances the sun" made literal). Loaded after first paint; the
>   DOM headline is the LCP. Reduced motion renders one still frame. No WebGL →
>   CSS wall and the flat logomark.
> - **Liquid glass is allowed for floating chrome only**: the nav pill, the mobile
>   booking dock, the mobile menu sheet, and small labels sitting on photography.
>   Never a content card on the page ground — glass on flat shell has nothing to
>   refract and reads as gray. Glass is tinted with `--shell`, never white.
> - **New tokens, all derived:** `--glass-*` (tint, border, highlight) in
>   tokens.css, and one expressive easing `--ease-glide`
>   `cubic-bezier(0.16, 1, 0.3, 1)` for large moves (arch expanding, menu sheet).
>   Small UI keeps `--ease-reveal`. One new type step, `--fs-hero`
>   `clamp(2.75rem, 9vw, 8.5rem)`, Jost 300 tracked caps, for the cover line only
>   — still four words, still under §4's six-word cap.
> - **The hero video moves.** The hero is now the sun wall with a real DOM
>   headline, which also fixes §6's portrait problem — no baked text to crop. The
>   footage becomes the mid-page "afternoon" moment: an arch that opens to full
>   bleed as you scroll into it.
>
> Everything else in this section stands: no white, no serif in DOM type, no
> blobs, no purple, no gradient text or buttons, no coastal scenery.

No pure white. No glassmorphism or frosted panels. No WebGL or shader backgrounds, no liquid or viscous scroll distortion, no morphing blob masks — see §10 for why. No serif display face in DOM type — see the 2026-08-05 amendment in §4 for the one grandfathered exception, which covers baked-in lettering in supplied imagery only and never the type system. No gradient text or gradient buttons. No drop shadows on every card. No even 5-column icon row. No centered-everything layout. No dark mode. No stock spa imagery — white robes, folded towel stacks, hot stones, orchids on bamboo, cucumber slices. No borrowed coastal scenery — surf, palm groves, bougainvillea, beach towns — the brand is warm and sunlit, not oceanfront. No purple, lavender, or sage. No terracotta accent. No corporate "Book Your Appointment Today!" energy anywhere in the copy. No placeholder Laguna Beach address surviving into production, including on reprinted collateral.

---

## Short version (for pasting into a generator)

> Design a website for Sunnyside Spa, a single-location day spa in Utah. It should feel like a beauty brand, not a clinic — sunlit, warm, hand-made, and quietly expensive. Warm and high-desert, never coastal: sandstone, plaster, dry light, intensely blue sky, water in a vessel rather than surf. The identity pairs an irregular hand-lettered wordmark with widely tracked light geometric capitals; keep both, always together. Palette: warm paper #FCF8EF and lemon chiffon #F4EDBE carry the page, dusty rose #A57878 draws all the line art, pearl aqua #8BC6BA tags and badges, ocean blue used once as a deep #1D5A75 band, royal gold #F8E16C only on that dark band. Body text is warm espresso #2A211C — orange-brown leaning, never a neutral or magenta-leaning near-black, which both go cold against the warm ground. Type: Jost 300 for tracked-caps headings, Karla for body, Caveat for three or four handwritten pull-quote moments — no serif anywhere. All icons and the rising-sun-over-water logomark are single-weight monoline, no fills. Images are framed in plaster archways; buttons are full pills like a hang tag; section dividers are hand-drawn waves, never straight rules. Every flat color field carries a faint grain. The hero is a supplied looping video — a yellow wall with a plant shadow moving in the wind and the wordmark and tagline already in frame — so no heading is overlaid on it; the same drifting-shadow effect is echoed in CSS on interior page headers so the whole site reads as lit by one sun. Homepage: hero, handwritten welcome quote, asymmetric five-service grid (massage, skincare, body, wellness, you time), alternating ritual features, gallery strip, testimonials on hang-tag cards, a retail waitlist section with one product and one email field, one dark booking band, first-visit accordion, deep-sea footer. No shop, no memberships, no gift cards. Single conversion goal: book a visit.
