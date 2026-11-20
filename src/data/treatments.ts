import type { IconName } from '../components/Icon.astro';
import { BOOKING } from '../config/site';

/**
 * The menu, as it is actually booked on Square.
 *
 * Services, descriptions, durations and prices are verbatim from the live
 * Square booking site (read 2026-11-19), grouped into the four categories
 * the site is organised around. Service names match Square's
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
  /** This service's id on the Square booking site — its direct booking page is
   *  BOOKING.url + '/' + squareId. Read from the live Square site 2026-11-19.
   *  A service added in Square needs its id copied here too. */
  squareId: string;
}

/** Where tapping a service goes: its own page on Square, or /booking/ until
 *  Square is connected. */
export const serviceBooking = (s: Service, category: string) => {
  const live = BOOKING.configured && !BOOKING.url.startsWith('[');
  return live
    ? { href: `${BOOKING.url}/${s.squareId}`, external: true }
    : { href: `/booking/?t=${category}`, external: false };
};

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
  /** Real photography for this category on /treatments/ and its own page.
   *  Falls back to `image`/`alt`. */
  menuImage?: string;
  menuAlt?: string;
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
    need: 'In need of a little relaxation and a reset for your skin?',
    line: 'Built around your skin on the day, from a quick express reset to my 80 minute Ultimate, plus a facial-inspired treatment for your back.',
    feature: true,
    image: '/img/samples/skincare.webp',
    alt: 'A woman with her eyes closed, turned to the sun, the shadow of a plant falling across her face.',
    menuImage: '/img/facial-portrait.webp',
    menuAlt: 'Seen from above, a client lies back with eyes closed and hair wrapped, while two hands work a creamy mask across the face and shoulders.',
    services: [
      { name: 'Sunnyside Signature Facial', squareId: 'F3SSFFGVVUFZZVQSV53ZBFAX', description: "A fully customized facial designed around your skin's needs that day. Enjoy a refreshing cleanse, tailored exfoliation, extractions as needed, a nourishing mask, and a relaxing face, hand and arm massage. Leave feeling refreshed, restored, and glowing.", minutes: 60, price: 65 },
      { name: 'Sunnyside Express Facial (no massage)', squareId: 'XYDRPCUJHNYKKCCOR57XBCA4', description: "A refreshing reset for when you're short on time but your skin needs a little love. Enjoy a customized cleanse, thorough exfoliation, and nourishing mask to leave your skin feeling refreshed, smooth, and glowing.", minutes: 45, price: 50 },
      { name: 'Sunnyside Ultimate Facial', squareId: 'N42ZX6ELYWLGHQXU7KSYNEBJ', description: "An elevated version of my Signature Facial, with extra time dedicated to your skin's unique needs and relaxation. Enjoy everything included in the Signature Facial, plus additional time for targeted treatments and extractions or an enhanced massage, along with your choice of a soothing scalp and/or foot massage.", minutes: 80, price: 85 },
      { name: 'Sunny Side Up Back Treatment', squareId: '6VVYO52ZXBVBH4MFCF7AOHOQ', description: 'Give your back a little extra love with this relaxing, facial-inspired treatment. Perfect for dry, rough, or congested skin, this service includes a thorough cleanse, gentle exfoliation, warm towels, a customized mask, and a soothing back massage. Leave feeling relaxed with soft, refreshed skin.', minutes: 45, price: 55 },
    ],
    detail: {
      lede: 'I look at your skin on the day, ask what you already use, and build the facial around what it needs.',
      expect: [
        'We start with a few minutes of talking: what your skin does, what you use, and what is bothering you.',
        'Cleanse, exfoliate, and extractions only where they are needed.',
        'A mask chosen for your skin. The Signature and Ultimate add a face, hand and arm massage; the Express skips the massage when you are short on time.',
        'On the Ultimate there is extra time for targeted treatment or a longer massage, plus a scalp or foot massage.',
      ],
    },
  },
  {
    slug: 'brows',
    icon: 'brows',
    name: 'Brows',
    need: 'Looking to frame your face and make getting ready easier?',
    line: 'Shaped to suit your face, tinted if you want them fuller, or laminated so they stay brushed up for weeks.',
    image: '/img/samples/founder.webp',
    alt: 'A woman standing in a bare, sunlit room, hard shadow from a blind falling in stripes across her and the wall behind.',
    menuImage: '/img/brows-portrait.webp',
    menuAlt: 'Brushing a brow into shape with a spoolie, checking it in a hand mirror held out at arm’s length, under the curve of a lash lamp.',
    services: [
      { name: 'Brow Wax', squareId: 'NPYZZKKYUA6GU7IMILUY6KYU', description: 'A customized brow shaping designed to complement your natural features. Includes brow mapping and precise waxing to create clean, balanced, beautifully defined brows.', minutes: 20, price: 20 },
      { name: 'Brow Wax & Tint', squareId: 'T6LDGWVM55WRPBSQX3TKSXCJ', description: 'A complete brow refresh in one appointment. Each service begins with brow mapping to create a shape that complements your facial features, followed by precise waxing and a custom-matched tint for fuller, more defined brows. Enjoy beautifully shaped brows with less need for daily makeup.', minutes: 45, price: 35 },
      { name: "Men's Brow Wax", squareId: '3ZN2ZHV4C7VE57B3Z7K7KHDA', description: 'A natural-looking cleanup to keep brows neat and well-groomed without over-shaping. Stray hairs are carefully removed while maintaining your natural brow shape and fullness.', minutes: 20, price: 20 },
      { name: 'Quick Brow Cleanup', squareId: 'X4UHCUWQYWUJZGF3RMKREDUI', description: 'Perfect for maintaining your existing brow shape between appointments. A quick removal of unwanted stray hairs to keep your brows looking clean and polished.', minutes: 15, price: 20 },
      { name: 'Custom Brow Tint', squareId: '4QE2OXASRTQCMHCLIQCVPKGV', description: 'A custom-matched tint that enhances your natural brows by adding depth, definition, and a fuller-looking appearance. Perfect for filling in lighter or sparse areas and minimizing the need for daily brow makeup.', minutes: 20, price: 20 },
      { name: 'The Full Brow Refresh', squareId: 'RQB7MZ2L67XS2TBRYUEOTWCM', description: 'The ultimate brow refresh! Includes brow lamination to create fuller-looking, beautifully lifted brows, customized shaping with brow mapping and waxing, and a custom-matched tint for added depth and definition. Wake up to effortlessly polished brows with minimal daily styling.', minutes: 60, price: 70 },
    ],
    detail: {
      lede: 'A quick tidy between appointments, or the Full Brow Refresh. Either way I map your brows first and shape to your face, not to a trend.',
      expect: [
        'I map your brows first, and we agree on the shape together in the mirror before anything happens.',
        'Wax first, a few strays at a time, then tint if you booked it. The tint sits for a few minutes.',
        'For the Full Brow Refresh, the hairs are lifted and set first, then waxed and tinted.',
        'You see them before you go, and I adjust anything you are not sure about.',
      ],
    },
  },
  {
    slug: 'lashes',
    icon: 'lashes',
    name: 'Lashes',
    need: 'Tired of curling them every morning?',
    line: 'Your own lashes, lifted from the root, tinted, or both for the mascara look without the mascara.',
    image: '/img/samples/you-time.webp',
    alt: 'Someone resting in rumpled linen, one hand open on the bed.',
    menuImage: '/img/lashes-portrait.webp',
    menuAlt: 'A client lying back on a dark towel, smiling up at the camera, lashes lifted and curled above green eyes.',
    services: [
      { name: 'Lash Tint', squareId: 'XSZK3HF2MDR5O35KCQOC4ZDR', description: 'Enhance your natural lashes with a custom dark tint from root to tip. Perfect for darkening lighter lashes and adding subtle definition without the need for daily mascara.', minutes: 30, price: 20 },
      { name: 'Lash Lift', squareId: 'THEPOZ3GQNNWJFRZUNRFRZO3', description: 'Enhance your natural lashes with a beautiful curl lifted from the root. Enjoy longer-looking, wide-awake lashes without extensions or an eyelash curler. Results typically last 4–8 weeks.', minutes: 60, price: 60 },
      { name: 'Lash Lift & Tint', squareId: 'WXMSES62MVS5ZYI7OBHHGF6S', description: 'Everything you love about a lash lift, with a custom dark tint to add depth and definition from root to tip. Enjoy a naturally fuller, mascara-like look with minimal daily upkeep. Results typically last 4–8 weeks.', minutes: 75, price: 75 },
    ],
    detail: {
      lede: 'No extensions and no curler. Your own lashes, lifted from the root for four to eight weeks, or simply tinted darker.',
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
    need: 'Done with shaving every other day?',
    line: 'Lip, chin and face, underarms, arms, legs and the happy trail. Quick, smooth, and longer-lasting than a razor.',
    image: '/img/samples/body.webp',
    alt: 'A bare shoulder in low gold light, cut by a hard bar of window shadow.',
    menuImage: '/img/waxing-portrait.webp',
    menuAlt: 'A gloved hand lifting a wooden spatula from a wax warmer, a ribbon of warm wax dripping back into the pot, beside the curve of a ring light.',
    services: [
      { name: 'Upper Lip Wax', squareId: 'CTGTTPNORX72M32OER5HMKBK', description: 'A quick and precise wax to remove unwanted hair from the upper lip, leaving skin feeling smooth.', minutes: 20, price: 12 },
      { name: 'Chin Wax', squareId: 'XMGASO3ZOECXE7JKRMWTC5Q4', description: 'Remove unwanted chin hair with a quick, precise wax for a smoother, more polished finish.', minutes: 20, price: 15 },
      { name: 'Lip & Chin Wax', squareId: 'FROPMTTGXTHOSZWLAYFIOKM6', description: 'A convenient combination to remove unwanted hair from both the upper lip and chin. Enjoy smooth, refreshed skin with just one quick appointment.', minutes: 25, price: 22 },
      { name: 'Sideburn Wax', squareId: 'PLECBXYNWSR2FRMY4NKWQK3V', description: 'Remove unwanted hair along the sides of the face for a smooth finish.', minutes: 30, price: 15 },
      { name: 'Nose Wax', squareId: 'QSBBBALCUIZ7PWOKMK2MARZI', description: 'A quick cleanup of visible nose hair for a neat, groomed appearance. Only hair near the entrance of the nostrils are removed.', minutes: 15, price: 15 },
      { name: 'Lower Leg Wax', squareId: '4A777HOJMVKTW7RO3MNMYRI4', description: 'Smooth, hair-free skin from ankle to just above the knee. Enjoy weeks of silky smoothness without the daily hassle of shaving.', minutes: 35, price: 40 },
      { name: 'Full Arm Wax', squareId: '7N5VIVGHN5O3Z453YMUKCY54', description: 'Smooth, hair-free skin from wrist to shoulder. Enjoy longer-lasting smoothness without the daily hassle of shaving.', minutes: 40, price: 40 },
      { name: 'Full Leg Wax', squareId: 'AWPPC2OZZYOSBX5H7XGGJ6RA', description: 'Silky, smooth legs from ankle to upper thigh. Enjoy weeks of smoothness without the daily hassle of shaving.', minutes: 60, price: 60 },
      { name: 'Happy Trail Wax', squareId: 'DNFMX4ELMF5EVCN3LXV6P6QK', description: 'A quick cleanup of the hair below the belly button for a smooth, groomed look. Perfect as an easy add-on to any wax.', minutes: 10, price: 15 },
      { name: 'Half arm wax', squareId: 'GBPDPD5FSEBJC6UCQIZZWYMN', description: 'Wrist to elbow for smooth, clean forearms. A quick option for the most visible area.', minutes: 30, price: 35 },
      { name: 'Underarm Wax', squareId: 'KFNFAQX3HZK3Q6L4QW7J7YVU', description: 'Enjoy smooth underarms that last longer than shaving. Removes unwanted hair at the root for a clean finish and less frequent upkeep.', minutes: 15, price: 20 },
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
