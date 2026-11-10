import type { IconName } from '../components/Icon.astro';

/**
 * The menu, as it is actually booked on Square.
 *
 * Services, descriptions, durations and prices are verbatim from
 * sunnyside_spa_services.csv (supplied 2026-11-10), grouped into the four
 * categories the site is organised around. Service names match Square's
 * exactly, so someone who picks one here finds the same line on the booking
 * page. When the Square menu changes, change it here.
 *
 * The category copy — `need`, `line`, `detail` — is DRAFT, written to the §11
 * voice in the first person (Sunnyside is one person). The service
 * descriptions are hers and stay as she wrote them.
 */
export interface Service {
  name: string;
  description: string;
  /** Minutes. */
  minutes: number;
  /** Whole dollars. Every service on the menu is fixed-price. */
  price: number;
}

export interface Treatment {
  slug: string;
  icon: IconName;
  name: string;
  /** The week this one is for — the homepage finder leads with it. DRAFT,
   *  §11 voice, six words at most so it can run in tracked caps (§4). */
  need: string;
  /** One line. DRAFT. */
  line: string;
  /** The wide feature row in the finder. Exactly one. */
  feature?: boolean;
  /** SAMPLE photography — see public/img/samples/SOURCES.json. To be replaced. */
  image: string;
  alt: string;
  services: Service[];
  detail: {
    lede: string;
    /** "What to expect" — three or four plain steps, §11 voice. DRAFT. */
    expect: string[];
  };
  /** Derived below: lowest price and shortest/longest service. */
  price: string;
  duration: string;
}

/** 75 → "1 hr 15 min", 60 → "1 hr", 45 → "45 min". */
export function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r} min`;
  return r ? `${h} hr ${r} min` : `${h} hr`;
}

type Draft = Omit<Treatment, 'price' | 'duration'>;

const CATEGORIES: Draft[] = [
  {
    slug: 'facials',
    icon: 'skincare',
    name: 'Facials',
    need: 'Skin that looks how you feel',
    line: 'Tailored to your skin on the day, with a hand and arm massage while the mask works.',
    feature: true,
    image: '/img/samples/skincare.webp',
    alt: 'A woman with her eyes closed, turned to the sun, the shadow of a plant falling across her face.',
    services: [
      { name: '60 minute customized facial', description: 'Tailored to your skin on the day. Includes consultation, cleanse, exfoliation, extractions as needed, mask and massage. Includes hand and arm massage', minutes: 60, price: 80 },
      { name: '80 minute customized facial', description: 'Everything in our 60 minute facial, with extra time for targeted treatment and a longer massage. Our most relaxing option. Includes hand and arm massage and/or more targeted treatment or foot and scalp massage', minutes: 80, price: 100 },
    ],
    detail: {
      lede: 'I look at your skin on the day, ask what you already use, and build the facial around what it needs.',
      expect: [
        'We start with a few minutes of talking: what your skin does, what you use, and what is bothering you.',
        'Cleanse, exfoliate, and extractions only where they are needed.',
        'A mask chosen for your skin, with a hand and arm massage while it works.',
        'On the 80 minute facial there is time for more targeted treatment, or a foot and scalp massage.',
      ],
    },
  },
  {
    slug: 'brows',
    icon: 'brows',
    name: 'Brows',
    need: 'Brows that have lost their shape',
    line: 'Shaped to suit your face, tinted if you want them fuller, or laminated so they stay brushed up for weeks.',
    image: '/img/samples/founder.webp',
    alt: 'A woman standing in a bare, sunlit room, hard shadow from a blind falling in stripes across her and the wall behind.',
    services: [
      { name: 'Brow wax quick clean up', description: 'Love your current shape? We remove strays and refine the edges for a polished, well-groomed look.', minutes: 15, price: 20 },
      { name: 'Brow tint', description: 'A custom-matched tint that darkens and defines brows, filling in sparse or light areas. Less brow makeup needed.', minutes: 20, price: 20 },
      { name: 'Male brow wax', description: 'Cleans up between and around the brows while keeping a natural, masculine shape. Groomed, never overdone.', minutes: 20, price: 20 },
      { name: 'Brow wax and tint', description: 'Shaping and color in one visit. We wax to suit your face, then tint for fuller, more defined brows.', minutes: 45, price: 45 },
      { name: 'Brow lamination wax and tint', description: 'Our full brow makeover. Hairs are lifted and set for a fluffy, brushed-up look, then waxed and tinted. Lasts 6-8 weeks.', minutes: 60, price: 80 },
    ],
    detail: {
      lede: 'A quick tidy between appointments, or the full lamination. Either way I shape to your face, not to a trend.',
      expect: [
        'We look at your brows together in the mirror and agree on the shape before anything happens.',
        'Wax first, a few strays at a time, then tint if you booked it. The tint sits for a few minutes.',
        'For lamination, the hairs are lifted and set first, then waxed and tinted.',
        'You see them before you go, and I adjust anything you are not sure about.',
      ],
    },
  },
  {
    slug: 'lashes',
    icon: 'lashes',
    name: 'Lashes',
    need: 'Tired of curling them every morning',
    line: 'Your own lashes, lifted from the root, with a tint if you want the mascara look without the mascara.',
    image: '/img/samples/you-time.webp',
    alt: 'Someone resting in rumpled linen, one hand open on the bed.',
    services: [
      { name: 'Lash lift', description: 'A natural curl from the root, no extensions or curler needed. Wide-awake lashes that last 6-8 weeks.', minutes: 60, price: 65 },
      { name: 'Lash lift and tint', description: 'Our lash lift plus a dark tint for a lifted, mascara-like look from root to tip. Low maintenance, big impact.', minutes: 75, price: 80 },
    ],
    detail: {
      lede: 'No extensions and no curler. Your own lashes, lifted from the root, for six to eight weeks.',
      expect: [
        'Come without eye makeup if you can. If not, I take it off for you.',
        'You lie back with your eyes closed the whole time. Most people doze off.',
        'The lift sets in stages, then the tint goes on if you booked it.',
        'Keep them dry for the rest of the day so the curl holds.',
      ],
    },
  },
  {
    slug: 'waxing',
    icon: 'waxing',
    name: 'Waxing',
    need: 'Done with shaving every other day',
    line: 'Underarms, arms, legs and the happy trail. Quick, smooth, and longer-lasting than a razor.',
    image: '/img/samples/body.webp',
    alt: 'A bare shoulder in low gold light, cut by a hard bar of window shadow.',
    services: [
      { name: 'Happy trail wax', description: 'A quick tidy of the line below the belly button for a clean, groomed look. Easy add-on to any wax.', minutes: 10, price: 15 },
      { name: 'Underarm waxing', description: 'Quick, smooth results that outlast shaving. No stubble, no razor bumps.', minutes: 15, price: 20 },
      { name: 'Half arm wax', description: 'Wrist to elbow for smooth, clean forearms. A quick option for the most visible area.', minutes: 30, price: 35 },
      { name: 'Full arm wax', description: 'Wrist to shoulder for smooth, hair-free arms that stay that way for weeks.', minutes: 40, price: 45 },
      { name: 'Leg wax', description: 'Ankle to upper thigh for silky, hair-free legs that stay smooth for weeks. Skip the daily shave.', minutes: 60, price: 60 },
    ],
    detail: {
      lede: 'Quick appointments, warm wax, and smooth skin that lasts for weeks instead of days.',
      expect: [
        'Let the hair grow for about two weeks first, so the wax has something to hold.',
        'Skip exfoliating and tanning on the day.',
        'The wax goes on warm and comes off quickly, a small section at a time.',
        'Afterwards, give it a day before hot baths, the gym or the pool.',
      ],
    },
  },
];

export const TREATMENTS: Treatment[] = CATEGORIES.map((c) => {
  const prices = c.services.map((s) => s.price);
  const mins = c.services.map((s) => s.minutes);
  const lo = Math.min(...mins);
  const hi = Math.max(...mins);
  return {
    ...c,
    price: `$${Math.min(...prices)}`,
    duration: lo === hi ? formatMinutes(lo) : `${formatMinutes(lo)} – ${formatMinutes(hi)}`,
  };
});
