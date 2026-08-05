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

Transcode, audio strip, MP4/WebM, and poster export are all mechanical and can be done here.
Duration is the interesting one: retimed from 60 fps to 24 fps the clip runs 9.8 s and the
shadow drift slows by 2.5×, which lands in the §6 window and reads closer to §7's "tracking
slowly" than the current speed does. No new footage needed. This is a proposal, not a
change — nothing has been re-encoded.

### 6. The five-icon sprite has no source file

§5 makes the five icons — sun-over-water, botanical sprig, lotus, wave-and-circle, full sun —
the service taxonomy, and §8 puts them in the treatments grid and the treatments-index filter.
They exist only as pixels inside the 1536×1024 identity board. Drawing them as the §5 SVG
sprite means drawing them from scratch, which collides with "don't redraw supplied marks."

The same applies to the wave divider: §5 specifies it as "the logomark's two-wave curve as an
inline SVG rule," and the logomark is raster only.
