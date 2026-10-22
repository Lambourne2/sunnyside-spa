/**
 * Liquid glass edges — Chromium only.
 *
 * Every `.glass` pane already has a tinted blur from CSS, which is the whole
 * effect in Safari and Firefox. Chromium also accepts an SVG filter inside
 * `backdrop-filter`, so there each `[data-liquid]` pane gets a displacement
 * map drawn to its exact size: flat in the middle, bending hard toward the
 * rounded edge, the way a thick lens pulls what is behind its rim inward.
 *
 * Maps are redrawn when a pane changes size. They are tiny (drawn at a quarter
 * of the pane and scaled up — displacement is smooth, so nothing is lost).
 */

const supported = (() => {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
  const chromium = !!brands?.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand));
  return chromium && CSS.supports('backdrop-filter', 'url(#x)');
})();

let uid = 0;

function drawMap(w: number, h: number, radius: number, bezel: number): string {
  const s = 0.25;
  const cw = Math.max(8, Math.round(w * s));
  const ch = Math.max(8, Math.round(h * s));
  const r = Math.min(radius * s, cw / 2, ch / 2);
  const b = Math.max(2, bezel * s);
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(cw, ch);

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      // Signed distance to a rounded rectangle, and its outward normal.
      const px = x + 0.5 - cw / 2;
      const py = y + 0.5 - ch / 2;
      const qx = Math.abs(px) - (cw / 2 - r);
      const qy = Math.abs(py) - (ch / 2 - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const outside = Math.hypot(ox, oy);
      const dist = outside + Math.min(Math.max(qx, qy), 0) - r; // < 0 inside
      let nx = 0;
      let ny = 0;
      if (outside > 0) {
        nx = (ox / outside) * Math.sign(px);
        ny = (oy / outside) * Math.sign(py);
      } else if (qx > qy) {
        nx = Math.sign(px);
      } else {
        ny = Math.sign(py);
      }
      // 0 at the bezel's inner edge, 1 at the rim; squared so the bend is
      // concentrated at the very edge, like a convex rim.
      const k = Math.min(1, Math.max(0, 1 + dist / b));
      const m = k * k;
      const i = (y * cw + x) * 4;
      img.data[i] = 128 - nx * m * 127;
      img.data[i + 1] = 128 - ny * m * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

export function initLiquidGlass() {
  if (!supported) return;
  const defs = document.querySelector<SVGDefsElement>('[data-lg-defs]');
  if (!defs) return;
  document.documentElement.classList.add('has-liquid');

  const NS = 'http://www.w3.org/2000/svg';

  const apply = (el: HTMLElement) => {
    const { width: w, height: h } = el.getBoundingClientRect();
    if (w < 4 || h < 4) return;
    const radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2, w / 2);
    const bezel = Math.min(h * 0.32, 22);
    const strength = Number(el.dataset.liquid || 28);
    const id = el.dataset.lgId || `lg-${++uid}`;
    el.dataset.lgId = id;

    let filter = defs.querySelector<SVGFilterElement>(`#${id}`);
    if (!filter) {
      filter = document.createElementNS(NS, 'filter');
      filter.id = id;
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      filter.setAttribute('x', '0');
      filter.setAttribute('y', '0');
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      const fe = document.createElementNS(NS, 'feImage');
      fe.setAttribute('result', 'map');
      fe.setAttribute('preserveAspectRatio', 'none');
      const disp = document.createElementNS(NS, 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'map');
      disp.setAttribute('xChannelSelector', 'R');
      disp.setAttribute('yChannelSelector', 'G');
      filter.append(fe, disp);
      defs.append(filter);
    }
    filter.setAttribute('width', String(w));
    filter.setAttribute('height', String(h));
    const fe = filter.querySelector('feImage')!;
    fe.setAttribute('width', String(w));
    fe.setAttribute('height', String(h));
    fe.setAttribute('href', drawMap(w, h, radius, bezel));
    filter.querySelector('feDisplacementMap')!.setAttribute('scale', String(strength));
    el.style.setProperty('--lg-filter', `url(#${id})`);
  };

  const ro = new ResizeObserver((entries) => {
    for (const e of entries) apply(e.target as HTMLElement);
  });
  document.querySelectorAll<HTMLElement>('[data-liquid]').forEach((el) => ro.observe(el));
}
