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
  draft: boolean;
  price: string;
  duration: string;
  /** The wide feature card in the §8 grid. Exactly one. */
  feature?: boolean;
  /** SAMPLE photography — see public/img/samples/SOURCES.json. To be replaced. */
  image: string;
  alt: string;
}

export const TREATMENTS: Treatment[] = [
  {
    slug: 'massage',
    icon: 'massage',
    name: 'Massage',
    line: 'Sixty minutes, warm oil, and someone who actually listens when you say where it hurts.',
    draft: false,
    price: '[PRICE]',
    duration: '[DURATION]',
    feature: true,
    image: '/img/samples/massage.webp',
    alt: "Two hands tipping warm oil from a small dish onto someone's bare back.",
  },
  {
    slug: 'skincare',
    icon: 'skincare',
    name: 'Skincare',
    line: 'We look at your skin in daylight, ask what you already use, and work with it.',
    draft: true,
    price: '[PRICE]',
    duration: '[DURATION]',
    image: '/img/samples/skincare.webp',
    alt: 'A woman with her eyes closed, turned to the sun, the shadow of a plant falling across her face.',
  },
  {
    slug: 'body',
    icon: 'body',
    name: 'Body',
    line: 'A scrub, a wrap, and a warm shower to finish. You leave softer than you came.',
    draft: true,
    price: '[PRICE]',
    duration: '[DURATION]',
    image: '/img/samples/body.webp',
    alt: 'A bare shoulder in low gold light, cut by a hard bar of window shadow.',
  },
  {
    slug: 'wellness',
    icon: 'wellness',
    name: 'Wellness',
    line: 'Breathwork, stretching, and quiet. Bring socks.',
    draft: true,
    price: '[PRICE]',
    duration: '[DURATION]',
    image: '/img/samples/wellness.webp',
    alt: 'Someone sitting and stretching on a wooden sill in warm slatted light.',
  },
  {
    slug: 'you-time',
    icon: 'you-time',
    name: 'You time',
    line: 'Book the room for the afternoon and decide what happens once you are in it.',
    draft: true,
    price: '[PRICE]',
    duration: '[DURATION]',
    image: '/img/samples/you-time.webp',
    alt: 'Someone resting in rumpled linen, one hand open on the bed.',
  },
];
