/**
 * The site's shared behaviour. One scroll listener, rAF-throttled, drives
 * everything position-based; IntersectionObserver handles reveals.
 *
 *  - nav: floats over the hero, condenses once it clears, tucks away while
 *    you read downward and comes back the moment you scroll up (§10).
 *  - --sun: 0 at the top, 1 at the footer — §10's one long afternoon.
 *  - [data-progress]: sets --p (0→1) as the element crosses the viewport, for
 *    CSS-driven scroll effects (the opening arch, parallax).
 *  - reveals and split headings (§10: 24px rise, 700ms, 80ms stagger).
 *  - [data-magnetic]: CTAs lean toward a fine pointer.
 *  - the sun wall: three.js is loaded only after first paint, and only where a
 *    page has a [data-sunwall] canvas.
 *
 * Under reduced motion: no nav hiding, no parallax, no magnetism, and the sun
 * wall draws one still frame. Opacity fades remain (§10).
 */
import { initLiquidGlass } from './liquid-glass';
import { LOGOMARK, ICONS } from '../data/marks';

declare global {
  interface Window { __sunnyside?: boolean }
}
window.__sunnyside = true;

const doc = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

initLiquidGlass();

/* ── Split headings ─────────────────────────────────────────────────────── */
// Words, not letters: tracked caps already space the letters, and per-letter
// motion on a 0.16em-tracked line reads as jitter. Whole words stay intact in
// the text, so screen readers read the heading exactly as written.
document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
  if (el.dataset.splitDone) return;
  let i = 0;
  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        const parts = (child.textContent ?? '').split(/(\s+)/);
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(' '));
            continue;
          }
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.setProperty('--i', String(i++));
          outer.append(inner);
          frag.append(outer);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !(child as Element).classList.contains('visually-hidden')) {
        walk(child);
      }
    }
  };
  walk(el);
  el.dataset.splitDone = '1';
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
});

/* ── Reveals ────────────────────────────────────────────────────────────── */
const revealTargets = document.querySelectorAll<HTMLElement>('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const siblings = el.parentElement
          ? [...el.parentElement.children].filter((n) => n.classList.contains('reveal'))
          : [el];
        const i = Math.max(0, siblings.indexOf(el));
        if (!el.hasAttribute('data-split')) el.style.transitionDelay = `${i * 80}ms`;
        el.classList.add('is-revealed');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-revealed'));
}

/* ── Scroll: nav, --sun, progress ───────────────────────────────────────── */
const nav = document.querySelector<HTMLElement>('[data-nav]');
const heroEl = document.querySelector<HTMLElement>('[data-hero]');
const progressEls = [...document.querySelectorAll<HTMLElement>('[data-progress]')];
let lastY = window.scrollY;
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  const vh = window.innerHeight;

  if (nav) {
    const clearAt = heroEl ? heroEl.offsetHeight - 80 : 24;
    nav.classList.toggle('is-condensed', y > clearAt || nav.hasAttribute('data-nav-solid') && y > 8);
    if (!reduce && !nav.classList.contains('is-open')) {
      const down = y > lastY + 4;
      const up = y < lastY - 4;
      if (down && y > 240) nav.classList.add('is-tucked');
      else if (up || y < 240) nav.classList.remove('is-tucked');
    }
  }
  lastY = y;

  const scrollable = doc.scrollHeight - vh;
  doc.style.setProperty('--sun', (scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0).toFixed(4));

  for (const el of progressEls) {
    const r = el.getBoundingClientRect();
    // 0 when the top edge enters from below, 1 when the bottom edge leaves the top.
    const mode = el.dataset.progress;
    let p: number;
    if (mode === 'pin') {
      // A tall section with a sticky child: 0 when it pins, 1 when it unpins.
      p = -r.top / Math.max(1, r.height - vh);
    } else if (mode === 'leave') {
      // 0 while its top sits at the top of the viewport, 1 once it has gone.
      p = -r.top / Math.max(1, r.height);
    } else if (mode === 'enter') {
      // 0 as it enters, 1 once its top reaches the top of the viewport.
      p = 1 - r.top / vh;
    } else {
      p = (vh - r.top) / (vh + r.height);
    }
    el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
  }
  ticking = false;
};

const requestTick = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
};
window.addEventListener('scroll', requestTick, { passive: true });
window.addEventListener('resize', requestTick, { passive: true });
onScroll();

/* ── Mobile menu — a native <dialog>, so focus trapping and Esc are free ── */
const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
const menuOpen = document.querySelector<HTMLButtonElement>('[data-menu-open]');
if (menu && menuOpen) {
  const close = () => {
    menu.classList.add('is-closing');
    const done = () => {
      menu.classList.remove('is-closing');
      menu.close();
    };
    if (reduce) done();
    else setTimeout(done, 420);
  };
  menuOpen.addEventListener('click', () => {
    menu.showModal();
    menuOpen.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', () => menuOpen.setAttribute('aria-expanded', 'false'));
  menu.querySelectorAll('[data-menu-close], a').forEach((el) => el.addEventListener('click', (e) => {
    if ((el as HTMLElement).hasAttribute('data-menu-close')) e.preventDefault();
    close();
  }));
  menu.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  // A click on the backdrop lands on the dialog element itself.
  menu.addEventListener('click', (e) => {
    if (e.target === menu) close();
  });
}

/* ── Magnetic CTAs ──────────────────────────────────────────────────────── */
if (finePointer && !reduce) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.28;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.setProperty('--mx', `${(dx * strength).toFixed(1)}px`);
      el.style.setProperty('--my', `${(dy * strength).toFixed(1)}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });
}

/* ── The sun wall ───────────────────────────────────────────────────────── */
const walls = document.querySelectorAll<HTMLCanvasElement>('[data-sunwall]');
if (walls.length) {
  const boot = async () => {
    const { createSunwall } = await import('./sunwall');
    walls.forEach((canvas) => {
      const host = (canvas.closest('[data-sunwall-host]') as HTMLElement) ?? canvas.parentElement!;
      const slot = host.querySelector<HTMLElement>('[data-mark-slot]');
      const name = canvas.dataset.mark;
      const mark = name === 'logomark' ? LOGOMARK : name ? ICONS[name] ?? null : null;
      const wall = createSunwall({
        canvas,
        host,
        slot,
        mark,
        shadow: Number(canvas.dataset.shadow ?? 0.85),
        sunset: canvas.hasAttribute('data-sunset'),
        still: reduce,
        intro: canvas.hasAttribute('data-intro'),
      });
      if (!wall) host.classList.add('no-webgl');
    });
  };
  // After the load event, so the headline — the LCP — never waits on WebGL.
  const go = () => ('requestIdleCallback' in window ? requestIdleCallback(() => boot(), { timeout: 600 }) : setTimeout(boot, 60));
  if (document.readyState === 'complete') go();
  else window.addEventListener('load', go, { once: true });
}
