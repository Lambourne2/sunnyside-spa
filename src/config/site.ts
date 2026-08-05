/**
 * Everything Peyton needs to fill in, in one file.
 *
 * Bracketed values are deliberate placeholders — §11 and the build brief both
 * say never to invent plausible-looking numbers, because a fake price or phone
 * number is the kind of thing that survives review and ships.
 *
 * Search the repo for `[` to find anything still outstanding.
 */

export const SITE = {
  name: 'Sunnyside Spa',
  tagline: 'Sunshine for your soul',
  neighbourhood: '[NEIGHBOURHOOD]',
  city: '[CITY]',
  state: 'UT',
  zip: '[ZIP]',
  street: '[STREET ADDRESS]',
  phone: '[PHONE]',
  email: '[EMAIL]',
  instagram: '[INSTAGRAM URL]',
} as const;

export const HOURS: { days: string; hours: string }[] = [
  { days: '[DAYS]', hours: '[HOURS]' },
  { days: '[DAYS]', hours: '[HOURS]' },
  { days: '[CLOSED DAY]', hours: 'Closed' },
];

/**
 * ── Booking: Square Appointments ─────────────────────────────────────────
 *
 * IMPORTANT, and it changes what §8 asked for.
 *
 * §8 specifies "Booking (embedded scheduler, restyled to the palette)". Square
 * does not support that. Square's "embed code" is a link that hands off to
 * their hosted booking site, and they block framing, so there is no inline
 * flow to restyle and no CSS of ours can reach it. Confirmed against Square's
 * own community guidance (their Appointments team, March 2025: the embed
 * redirecting to the hosted experience is "expected behaviour").
 *
 * So /booking is a branded handoff page rather than an embed: everything up to
 * the moment of handoff is ours, and the scheduling itself happens on Square.
 *
 * What CAN still be brought onto the palette, in the Square dashboard under
 * Appointments → Online Booking → Booking Site:
 *   - accent / button colour  #7E5555   (--rose-deep)
 *   - cover image             a frame from the hero, or the treatment room shot
 *   - logo                    public/brand/logo-stacked.png
 * That gets the hosted flow close. It will not match exactly, and it cannot.
 *
 * If an inline, fully-styled scheduler matters more than staying on Square,
 * Boulevard, Vagaro and Mindbody all support real iframe embeds. Building a
 * custom flow on Square's Bookings API is also possible but is a project in
 * its own right, not a page.
 */
export const BOOKING = {
  provider: 'square' as const,
  /** From Square: Appointments → Online Booking → your booking site URL. */
  url: '[SQUARE_BOOKING_URL]',
  /** Set true once `url` is real, to swap the placeholder panel for the CTA. */
  configured: false,
} as const;

export const isPlaceholder = (v: string) => v.startsWith('[') && v.endsWith(']');
