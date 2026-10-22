/**
 * Monoline path data for the logomark and the five service icons, in one place
 * so the flat SVG sprite and the glass 3D versions (sunwall.ts) are drawn from
 * the same strokes and can never drift apart.
 *
 * ── The logomark is an interpretation, not a trace ───────────────────────────
 * The supplied logomark is raster only (docs/asset-audit §1). These paths were
 * set by eye against public/brand/logomark.png at 1/10 scale: same seven rays,
 * same dome, same two waves at the same pitch. They exist because the glass
 * mark needs real strokes. Replace with the traced SVG when it exists — every
 * consumer reads from here.
 */

export interface Mark {
  /** viewBox width and height. */
  box: [number, number];
  /** Stroke width in viewBox units. */
  stroke: number;
  /** Subpaths. `sun` paths sink below the waterline on scroll; `wave` paths ripple. */
  paths: { d: string; role?: 'sun' | 'ray' | 'wave' }[];
}

/** A hand-drawn-ish wave as a smooth polyline: y = base − amp·cos(2π(x − peak)/period). */
function wave(x0: number, x1: number, base: number, amp: number, period: number, peak: number) {
  const pts: string[] = [];
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    // A slight swell toward the middle keeps it from reading as a math plot.
    const swell = 0.85 + 0.3 * Math.sin((Math.PI * i) / n);
    const y = base - amp * swell * Math.cos((2 * Math.PI * (x - peak)) / period);
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(' ');
}

export const LOGOMARK: Mark = {
  box: [68, 56],
  stroke: 1.3,
  paths: [
    { role: 'sun', d: 'M19.6 41.4 C18.6 31.2 25.6 23.6 34.9 23.6 C44.4 23.6 50.8 31.4 50.6 41.6' },
    { role: 'ray', d: 'M34.6 5.2 L34.8 18.8' },
    { role: 'ray', d: 'M21.1 10.9 L25.9 20.8' },
    { role: 'ray', d: 'M48.1 10.9 L43 20.6' },
    { role: 'ray', d: 'M9 20.9 L17.2 25' },
    { role: 'ray', d: 'M58.9 21.4 L50.6 26' },
    { role: 'ray', d: 'M3.1 33.1 L13.4 34.6' },
    { role: 'ray', d: 'M64.8 32.9 L54.6 34.9' },
    { role: 'wave', d: wave(2, 66, 43.2, 2.2, 23.5, 11) },
    { role: 'wave', d: wave(6, 62, 51.4, 1.9, 23, 14.5) },
  ],
};

/** The five service icons — §5 taxonomy. Drawn 2026-08-05 (see IconSprite). */
export const ICONS: Record<string, Mark> = {
  massage: {
    box: [24, 24],
    stroke: 1.5,
    paths: [
      { role: 'sun', d: 'M7 14.6a5 5 0 0 1 10 0' },
      { role: 'ray', d: 'M12 3.2v2.4' },
      { role: 'ray', d: 'M6.1 6.1l1.7 1.7' },
      { role: 'ray', d: 'M17.9 6.1l-1.7 1.7' },
      { role: 'ray', d: 'M2.8 12h2.4' },
      { role: 'ray', d: 'M21.2 12h-2.4' },
      { role: 'wave', d: 'M2.5 17.9c1.9-1.5 3.8-1.5 5.7 0s3.8 1.5 5.7 0 3.8-1.5 5.6 0' },
      { role: 'wave', d: 'M2.5 21.3c1.9-1.5 3.8-1.5 5.7 0s3.8 1.5 5.7 0 3.8-1.5 5.6 0' },
    ],
  },
  skincare: {
    box: [24, 24],
    stroke: 1.5,
    paths: [
      { d: 'M12 21.8V4.6' },
      { d: 'M12 4.6Q10.3 2.9 12 1.4 13.7 2.9 12 4.6Z' },
      { d: 'M12 9.2Q15 5.2 18.6 5.4 18 9.2 12 9.2Z' },
      { d: 'M12 14Q9 10 5.4 10.2 6 14 12 14Z' },
      { d: 'M12 18.6Q15 14.6 18.6 14.8 18 18.6 12 18.6Z' },
    ],
  },
  body: {
    box: [24, 24],
    stroke: 1.5,
    paths: [
      { d: 'M12 18.4C10.5 15.5 10.3 11.9 12 8.2c1.7 3.7 1.5 7.3 0 10.2Z' },
      { d: 'M13 18.5c.9-2.7 3.1-5.2 6-6.2.1 3.1-2.2 5.7-6 6.2Z' },
      { d: 'M11 18.5c-.9-2.7-3.1-5.2-6-6.2-.1 3.1 2.2 5.7 6 6.2Z' },
      { role: 'wave', d: 'M4.5 21.6c1.6-1.2 3.2-1.2 4.8 0s3.2 1.2 4.8 0 3.2-1.2 4.7 0' },
    ],
  },
  wellness: {
    box: [24, 24],
    stroke: 1.5,
    paths: [
      { role: 'sun', d: 'M12 3.8a4.6 4.6 0 1 0 0.001 0Z' },
      { role: 'wave', d: 'M2.5 17.2c1.9-1.5 3.8-1.5 5.7 0s3.8 1.5 5.7 0 3.8-1.5 5.6 0' },
      { role: 'wave', d: 'M2.5 21c1.9-1.5 3.8-1.5 5.7 0s3.8 1.5 5.7 0 3.8-1.5 5.6 0' },
    ],
  },
  'you-time': {
    box: [24, 24],
    stroke: 1.5,
    paths: [
      { role: 'sun', d: 'M12 7.4a4.6 4.6 0 1 0 0.001 0Z' },
      { role: 'ray', d: 'M12 2.2v2.6' },
      { role: 'ray', d: 'M12 19.2v2.6' },
      { role: 'ray', d: 'M21.8 12h-2.6' },
      { role: 'ray', d: 'M4.8 12H2.2' },
      { role: 'ray', d: 'M18.9 5.1 17 7' },
      { role: 'ray', d: 'M7 17l-1.9 1.9' },
      { role: 'ray', d: 'M18.9 18.9 17 17' },
      { role: 'ray', d: 'M7 7 5.1 5.1' },
    ],
  },
};
