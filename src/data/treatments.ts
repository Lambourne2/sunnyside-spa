import type { IconName } from '../components/Icon.astro';

/**
 * The five services are the §5 icon taxonomy. Names, prices and durations are
 * placeholders until Peyton supplies them — deliberately bracketed so they
 * cannot be mistaken for real numbers in review.
 *
 * The one-liners marked DRAFT are written to the §11 voice: second person,
 * present tense, plain verbs, sentence case, no exclamation points, nothing
 * from the ban list. The massage line is the verbatim §11 string.
 */
export interface Treatment {
  slug: string;
  icon: IconName;
  name: string;
  /** One line. Verbatim §11 copy where it exists, otherwise DRAFT. */
  line: string;
  /** The week this one is for — the homepage finder leads with it. DRAFT,
   *  §11 voice, and kept to six words so it can run in tracked caps (§4). */
  need: string;
  draft: boolean;
  price: string;
  duration: string;
  /** The wide feature card in the §8 grid. Exactly one. */
  feature?: boolean;
  /** SAMPLE photography — see public/img/samples/SOURCES.json. To be replaced. */
  image: string;
  alt: string;
  /** Detail page. All DRAFT until the real menu exists. */
  detail: {
    lede: string;
    /** "What to expect" — three or four plain steps, §11 voice. */
    expect: string[];
    /** Add-ons. Names bracketed until priced. */
    addOns: { name: string; price: string }[];
  };
}

export const TREATMENTS: Treatment[] = [
  {
    slug: 'massage',
    need: 'Shoulders up by your ears',
    icon: 'massage',
    name: 'Massage',
    line: 'Sixty minutes, warm oil, and someone who actually listens when you say where it hurts.',
    draft: false,
    price: '[PRICE]',
    duration: '[DURATION]',
    feature: true,
    image: '/img/samples/massage.webp',
    alt: "Two hands tipping warm oil from a small dish onto someone's bare back.",
    detail: {
      lede:
        'One room, one therapist, and the time set aside for it. You say where it hurts and I work from there.',
      expect: [
        'You arrive fifteen minutes early, change into a robe, and fill in a short intake form.',
        'We talk for a few minutes about what hurts, what you do all day, and anywhere you would rather I left alone.',
        'You stay covered apart from the area being worked on. Say so at any point if the pressure is wrong.',
        'Afterwards there is water and a chair, and no rush to be anywhere.',
      ],
      addOns: [
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
      ],
    },
  },
  {
    slug: 'skincare',
    need: 'Skin that looks how you feel',
    icon: 'skincare',
    name: 'Skincare',
    line: 'I look at your skin in daylight, ask what you already use, and work with it.',
    draft: true,
    price: '[PRICE]',
    duration: '[DURATION]',
    image: '/img/samples/skincare.webp',
    alt: 'A woman with her eyes closed, turned to the sun, the shadow of a plant falling across her face.',
    detail: {
      lede:
        'I look at your skin in daylight, ask what you already use, and work with it rather than starting over.',
      expect: [
        'I start by looking at your skin in daylight, without a lamp in your face.',
        'You tell us what you already use and what your skin does in winter.',
        'Cleanse, treat, and finish. Nothing that needs a week of hiding afterwards.',
        'You leave with a note of what I used, so you can decide what is worth buying.',
      ],
      addOns: [
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
      ],
    },
  },
  {
    slug: 'body',
    need: 'You want to feel soft again',
    icon: 'body',
    name: 'Body',
    line: 'A scrub, a wrap, and a warm shower to finish. You leave softer than you came.',
    draft: true,
    price: '[PRICE]',
    duration: '[DURATION]',
    image: '/img/samples/body.webp',
    alt: 'A bare shoulder in low gold light, cut by a hard bar of window shadow.',
    detail: {
      lede:
        'A scrub, a wrap, and a warm shower to finish. You leave softer than you came.',
      expect: [
        'You shower first, then the scrub, working from the feet up.',
        'The wrap goes on warm and stays on for about twenty minutes while you lie still.',
        'A second shower to finish, then oil while your skin is still damp.',
        'Bring a hair tie. You will want one.',
      ],
      addOns: [
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
      ],
    },
  },
  {
    slug: 'wellness',
    need: 'Your head will not switch off',
    icon: 'wellness',
    name: 'Wellness',
    line: 'Breathwork, stretching, and quiet. Bring socks.',
    draft: true,
    price: '[PRICE]',
    duration: '[DURATION]',
    image: '/img/samples/wellness.webp',
    alt: 'Someone sitting and stretching on a wooden sill in warm slatted light.',
    detail: {
      lede:
        'Breathwork, stretching, and quiet. Bring socks.',
      expect: [
        'We start sitting, with a few minutes of breathing before anything else.',
        'Assisted stretching, slow, with your feet on the floor for most of it.',
        'The last ten minutes are quiet. You do not have to fill them.',
        'Wear something you can move in. Socks help.',
      ],
      addOns: [
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
      ],
    },
  },
  {
    slug: 'you-time',
    need: 'You need one whole afternoon',
    icon: 'you-time',
    name: 'You time',
    line: 'Book the room for the afternoon and decide what happens once you are in it.',
    draft: true,
    price: '[PRICE]',
    duration: '[DURATION]',
    image: '/img/samples/you-time.webp',
    alt: 'Someone resting in rumpled linen, one hand open on the bed.',
    detail: {
      lede:
        'Book the room for the afternoon and decide what happens once you are in it.',
      expect: [
        'The room is yours for the block you book.',
        'We agree roughly what you want when you arrive, and adjust as we go.',
        'You can talk the whole time or not at all. Both are normal.',
        'Tea, water, and the door stays shut.',
      ],
      addOns: [
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
        { name: '[ADD-ON NAME]', price: '[PRICE]' },
      ],
    },
  },
];
