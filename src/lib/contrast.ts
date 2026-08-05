/**
 * WCAG 2.1 relative luminance and contrast ratio.
 * Used by /styleguide so the ratios shown are measured at build time rather
 * than transcribed by hand — §12 asks for body text at 4.5:1 "verified".
 */

export function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** Rounded to 2dp for display. */
export function ratio(a: string, b: string): string {
  return contrast(a, b).toFixed(2);
}

export type Level = 'pass' | 'large-only' | 'fail';

/** `large` marks pairs the doc restricts to display/decorative use (§3). */
export function level(a: string, b: string, large = false): Level {
  const c = contrast(a, b);
  if (c >= 4.5) return 'pass';
  if (c >= 3 && large) return 'large-only';
  return 'fail';
}

export const PALETTE = {
  'lemon-chiffon': '#F4EDBE',
  'royal-gold': '#F8E16C',
  'dusty-rose': '#A57878',
  'ocean-blue': '#2E86AB',
  'pearl-aqua': '#8BC6BA',
  shell: '#FCF8EF',
  ink: '#2A211C',
  'ink-soft': '#6E5A50',
  'rose-deep': '#7E5555',
  'deep-sea': '#1D5A75',
} as const;
