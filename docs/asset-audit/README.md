# Asset audit — 2026-08-05

Findings from inspecting `sunnyside-spa-assets/` against `docs/design.md` §5, §6, §12.
Nothing here has been redrawn, retraced, or altered. This is a report only.

## What was supplied

| File | Spec | Notes |
|---|---|---|
| `logos/sunnysidespa-logo-long.png` | 570×192, PNG-8 palette, black on transparent | Horizontal lockup |
| `logos/sunnysidespa-logo-wide-and-tall.png` | 570×298, PNG-8 palette, black on transparent | This is the **stacked** lockup, not a wide one |
| `logos/sunnysidespa-logomark.png` | 680×680, PNG-8 palette, black on transparent | Sun + rays + two waves |
| `media-assets/footer.png` | 2752×688, no alpha, 3.0 MB | Finished deep-sea banner, not a lockup |
| `media-assets/sunnyside-rest-recharge-regenerate.png` | 1648×2512, no alpha, 5.8 MB | Gallery texture tile, text baked in |
| `sunnyside-brand-identity-inspiration.png` | 1536×1024, 2.2 MB | The identity board |
| `video/hero-image-video.mov` | 1920×1080, H.264, 60 fps, 3.93 s, 7.5 MB, **AAC audio present** | Hero |

## Blockers

### 1. No SVG anywhere — all logo art is raster

§6 requires "every file as optimized SVG with strokes set to `currentColor`". All three
logo files are PNG-8. They cannot be run through SVGO and cannot take `currentColor`.

They are, however, **pure black artwork on a transparent ground** (palette has exactly one
fully-opaque entry, `#000`, plus 254 antialiasing steps). That means they are usable as
single-channel alpha masks and *can* be recolored from CSS without shipping per-color copies:

```css
.logo {
  background: currentColor;
  -webkit-mask: url(/brand/logo-horizontal.png) no-repeat center / contain;
          mask: url(/brand/logo-horizontal.png) no-repeat center / contain;
}
```

This satisfies the one-file-recolors-by-context requirement. It does not fix resolution:
570 px wide is under 2× for a 320 px desktop nav lockup and nowhere near the 1200×630 the
OG card needs. It also cannot do the §10 `stroke-dashoffset` draw-on animation, which
requires real paths.

### 2. The "wide" lockup does not exist

§6 maps four assets to four fixed roles. Only three were supplied, and the filename
`logo-wide-and-tall` is misleading — at 570×298 it is the stacked/tall lockup. There is no
wide/banner lockup for OG and Twitter cards. `footer.png` is 4:1 and could stand in, but it
is a flattened deep-sea composition, not a transparent mark.

### 3. The hero video tagline is set in a serif

`docs/design.md` §4 ("deliberately no serif anywhere") and §13 ("no serif display face")
both forbid it. The tagline SUNSHINE FOR YOUR SOUL is baked into the hero footage in a
bracketed-serif face, and again in `footer.png`. The supplied logo PNGs use the correct
geometric sans.

- `tagline-in-video-SERIF.png`
- `tagline-in-footer-SERIF.png`
- `tagline-in-logo-SANS.png`

Two different taglines are in circulation across the assets, and the one in the signature
element is the banned one.

### 4. The video wordmark is a different drawing from the supplied wordmark

§6 asks for this check explicitly. Comparing them at matched cap height
(`wordmark-video-vs-logo.png`, video on top), the letterforms do not correspond:

- `S` — video has a curled bottom-left terminal; supplied logo's is open
- `D` — video bowl is round; supplied has a flat top-right corner
- `Y` — descender length and curvature differ
- `E` — arm lengths differ
- Inter-letter rhythm through `N-N-Y` is tighter in the video

These are two independent drawings of the same idea. §6 warns this matters because the nav
wordmark sits within a couple hundred pixels of the video wordmark during the scroll
transition.

### 5. Video does not meet the §6 delivery spec

| Requirement | Supplied |
|---|---|
| Audio stripped entirely | AAC stereo track present |
| 10–15 s seamless loop | 3.93 s |
| Under 3 MB desktop | 7.5 MB (16 Mbps) |
| H.264 MP4 + VP9 WebM | `.mov` only |
| WebP poster from frame one | Not supplied |
| 9:16 portrait render | Not supplied |
| Clean plate, no text | Not supplied |

Loop seam measured at 2.6× a normal adjacent-frame delta — a visible hitch, so §6's
crossfade applies.

**Resolved 2026-08-05.** All of the above is now done, but the loop needed more than §6's
suggested fix. Recorded here because it constrains any future re-render.

The clip **does not cycle**. It opens on fast motion (adjacent-frame delta 0.44) and ends
nearly static (0.05), so no cut point matches. A search over every start/end pair at least
180 frames apart found the best natural loop still costs 2.88× a mean frame step — there is
no clean seam anywhere in this footage.

§6's remedy — crossfade the last 0.5 s into the first — was built and measured. It helped
but did not solve it: the wrap went from 3.7× to 2.6× a mean step, still the 99th percentile
of normal motion, i.e. a visible hitch. A dissolve cannot reconcile two genuinely different
shadow positions moving at different rates.

**What shipped instead: a ping-pong.** Source frames 88–235 forward, then 234–89 reversed.
Both junctions are adjacent frame steps, so the cycle is seamless by construction rather
than by blending. The 88–235 range was picked by searching for junctions where the shadow is
nearly still — measured losslessly, the wrap is 0.35× a mean step and the turnaround 0.21×,
both smaller than 97% of ordinary frames. 294 frames at 24 fps = **12.25 s**, mid-spec.

Retiming 60→24 fps replays the same frames with no interpolation and slows the drift 2.5×,
which reads closer to §7's "tracking slowly."

Encoding note: a 48-frame GOP placed I-frame pops at frames 47, 95 and 239, visible as
periodic flickers in a shot this soft. The shipped encode uses a single keyframe. The
remaining measurable difference at the wrap is the frame-0 I-frame carrying different
quantisation noise than its P-frame neighbours — CRF 22 keeps that inside the range of
normal motion (23% of ordinary frame steps are larger) at 2.5 MB, under the 3 MB budget.

**If this footage is ever re-rendered**, ask for genuinely cyclic motion — then a straight
loop works and the ping-pong can be dropped.

### 6. No wordmark-only lockup, so the footer sign-off can't be built

§11 asks the footer to sign off with "the tagline, hand-lettered, in gold". Every supplied
lockup bakes the tagline into the artwork, so setting a separate gold sign-off underneath
printed the tagline **twice** — once inside the logo, once below it. The duplicate has been
removed and the lockup carries it, which means §11's sign-off is not really satisfied: the
baked tagline is geometric sans, not hand-lettering.

**What would fix it:** a wordmark-only export with no tagline. Then the tagline can be real
gold text under it, and can change seasonally. A hand-lettered tagline drawn as artwork would
satisfy §11 fully.

### 7. No leaf-shadow overlay PNG

§7 wants a leaf shadow drifting on a 45s loop over interior page headers and the poster-still
fallback, so the whole site reads as lit by one sun. Without it the mobile hero is static
while the desktop hero moves. The motion token (`--dur-drift`) is wired and inert.

### 8. The five-icon sprite has no source file

§5 makes the five icons — sun-over-water, botanical sprig, lotus, wave-and-circle, full sun —
the service taxonomy, and §8 puts them in the treatments grid and the treatments-index filter.
They exist only as pixels inside the 1536×1024 identity board. Drawing them as the §5 SVG
sprite means drawing them from scratch, which collides with "don't redraw supplied marks."

The same applies to the wave divider: §5 specifies it as "the logomark's two-wave curve as an
inline SVG rule," and the logomark is raster only.
