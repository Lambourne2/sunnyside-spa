// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The first menu had five placeholder treatments; the real menu (2026-11-10)
  // has four categories. Old links land on the full menu instead of a 404.
  redirects: {
    '/treatments/massage': '/treatments/',
    '/treatments/skincare': '/treatments/facials/',
    '/treatments/body': '/treatments/waxing/',
    '/treatments/wellness': '/treatments/',
    '/treatments/you-time': '/treatments/',
  },
});
