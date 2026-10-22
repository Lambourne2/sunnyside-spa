/**
 * The sun wall — the one WebGL surface the §13 amendment allows.
 *
 * Three passes a frame, all small:
 *   1. mask  — the glass mark's silhouette into a quarter-res target, so the
 *              wall can receive its shadow and caustic.
 *   2. wall  — plaster, the drifting palm-frond shadow (§7's signature, drawn
 *              procedurally because the leaf-shadow PNG never arrived) and the
 *              glass mark's shadow, into a half-res target. It is soft light on
 *              plaster, so half res costs nothing visible.
 *   3. screen — the wall blitted at full res with grain, then the glass mark,
 *              which refracts the wall target behind it.
 *
 * Colours are written in display space throughout and never converted, so the
 * palette hex values land on screen exactly. Nothing is brighter than --shell:
 * even the specular highlight tops out at paper, never white (CLAUDE.md).
 *
 * Motion is position-driven, never velocity-driven (§13 amendment): the
 * pointer moves the sun, scroll position sets it. Under reduced motion one
 * still frame is drawn and nothing animates.
 */
import {
  CatmullRomCurve3,
  Group,
  LinearSRGBColorSpace,
  Matrix4,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
  type BufferGeometry,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Mark } from '../data/marks';

export interface SunwallOptions {
  canvas: HTMLCanvasElement;
  /** The element the canvas fills. Its box is the wall. */
  host: HTMLElement;
  /** Where the glass mark sits — CSS lays it out, the scene follows. */
  slot?: HTMLElement | null;
  mark?: Mark | null;
  /** 0–1. How dark the frond shadow falls. */
  shadow?: number;
  /** Sink the sun below the waves as the host scrolls away. */
  sunset?: boolean;
  /** Draw a single frame and stop (reduced motion). */
  still?: boolean;
  /** Play the sunrise intro on first frame. */
  intro?: boolean;
}

/* ── Shared GLSL ──────────────────────────────────────────────────────────── */

const PALETTE = /* glsl */ `
  const vec3 SHELL   = vec3(0.988, 0.973, 0.937);
  const vec3 CHIFFON = vec3(0.957, 0.929, 0.745);
  const vec3 GOLD    = vec3(0.973, 0.882, 0.424);
  const vec3 INK     = vec3(0.165, 0.129, 0.110);
`;

const NOISE = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`;

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/* The wall. Units are wall heights, so fronds keep their size at any aspect. */
const WALL_FRAG = /* glsl */ `
  precision highp float;
  uniform float uAspect;
  uniform float uTime;
  uniform float uSun;
  uniform vec2  uPointer;
  uniform float uShadow;
  uniform sampler2D uMask;
  uniform vec2  uMaskOffset;
  uniform float uHasMark;
  varying vec2 vUv;
  ${PALETTE}
  ${NOISE}

  // One palm frond's shadow. Leaflets are thin tapered blades set off the spine
  // at an angle, repeated along it; the penumbra widens with distance from the
  // plant, the way a real shadow softens the further it is thrown.
  float frond(vec2 p, vec2 origin, float ang, float len, float t, float seed) {
    vec2 d = p - origin;
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(c * d.x + s * d.y, -s * d.x + c * d.y);
    float x = q.x / len;
    q.y += 0.16 * len * x * x;                       // the spine droops
    float ay = abs(q.y);
    float soft = mix(0.004, 0.022, clamp(x, 0.0, 1.0));
    float sp = len * 0.052;                          // leaflet pitch
    float a = 0.9 + 0.06 * sin(t * 0.7 + seed);      // leaflet angle off the spine
    float ca = cos(a), sa = sin(a);
    float xs = q.x - ay * ca / sa;                   // where this leaflet leaves the spine
    float id = floor(xs / sp);
    float r = ay / sa;                               // distance out along the leaflet
    float flutter = sin(t * 1.6 + id * 1.37 + seed * 7.0) * 0.16 * (r / (len * 0.35));
    float cell = xs / sp - id - 0.5 + flutter;
    float dperp = abs(cell) * sp * sa;
    float xn = clamp(xs / len, 0.0, 1.0);
    float L = len * 0.44 * sin(3.14159 * (xn * 0.9 + 0.08));
    float w = sp * 0.34 * (1.0 - smoothstep(0.0, L, r)) + sp * 0.05;
    float leaf = (1.0 - smoothstep(w - soft, w + soft, dperp))
               * (1.0 - smoothstep(L - soft * 3.0, L + soft * 3.0, r))
               * smoothstep(-soft, soft, xs) * (1.0 - smoothstep(len * 0.96, len * 1.02, xs));
    float spine = (1.0 - smoothstep(sp * 0.07, sp * 0.07 + soft * 2.0, ay))
                * smoothstep(-soft, soft, q.x) * (1.0 - smoothstep(len * 0.95, len, q.x));
    return clamp(max(leaf, spine), 0.0, 1.0);
  }

  void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y);
    float t = uTime;

    // Scroll sets the sun lower: shadows lengthen and slide.
    vec2 drift = vec2(-0.22, -0.12) * uSun + uPointer * vec2(0.035, 0.025);
    float stretch = 1.0 + 0.3 * uSun;

    float sway1 = 0.04 * sin(t * 0.31) + 0.018 * sin(t * 0.83 + 1.3);
    float sway2 = 0.05 * sin(t * 0.27 + 2.1) + 0.015 * sin(t * 0.91);
    float sway3 = 0.035 * sin(t * 0.36 + 4.0) + 0.02 * sin(t * 0.7 + 0.4);

    float sh = 0.0;
    sh = max(sh, frond(p, vec2(uAspect + 0.12, 1.16) + drift, 3.14159 + 0.62 + sway1, 1.15 * stretch, t, 1.0));
    sh = max(sh, frond(p, vec2(uAspect + 0.08, 0.62) + drift, 3.14159 + 0.12 + sway2, 0.82 * stretch, t, 2.0));
    sh = max(sh, frond(p, vec2(uAspect * 0.62, 1.3) + drift, -1.5708 - 0.42 + sway3, 0.74 * stretch, t, 3.0));
    sh = max(sh, frond(p, vec2(uAspect + 0.2, 1.42) + drift, 3.14159 + 1.02 + sway2 * 0.8, 0.95 * stretch, t, 4.0) * 0.8);

    // Dapples — light leaking through gaps in the canopy.
    float dap = smoothstep(0.58, 0.74, fbm(p * 7.0 + vec2(t * 0.03, -t * 0.02)));
    sh *= 1.0 - 0.6 * dap;
    // A portrait screen is narrow enough that the same fronds cover nearly all
    // of it; ease off so the wall still reads as lit.
    sh *= uShadow * mix(0.62, 1.0, smoothstep(0.5, 1.3, uAspect));

    // Plaster: chiffon pushed toward gold, warmer as the afternoon goes on.
    vec3 wall = mix(CHIFFON, GOLD, 0.2 + 0.16 * uSun);
    float trowel = fbm(p * vec2(2.2, 3.4)) - 0.5;
    wall *= 1.0 + trowel * 0.05;
    // Where the sun lands — a lift toward paper in the upper right.
    vec2 sunPos = vec2(uAspect * (0.92 - 0.25 * uSun), 0.98 - 0.35 * uSun) + uPointer * 0.06;
    float lit = smoothstep(1.25, 0.0, distance(p, sunPos));
    wall = mix(wall, SHELL, lit * 0.45);

    // Shadow: warm ochre, never gray — dry air, hard light (§1).
    vec3 col = mix(wall, wall * vec3(0.8, 0.69, 0.54), sh);

    // The glass mark's own shadow, with a gold caustic where light focuses
    // through it.
    if (uHasMark > 0.5) {
      // Penumbra: a wide blur. Caustic: a tighter blur, a little nearer the
      // object, so the light it focuses sits inside its own shadow.
      float m = 0.0;
      float core = 0.0;
      for (int i = 0; i < 12; i++) {
        float ang = float(i) * 0.5235988;
        vec2 dir = vec2(cos(ang), sin(ang));
        m += texture2D(uMask, vUv + uMaskOffset + dir * 0.011).r;
        core += texture2D(uMask, vUv + uMaskOffset * 0.88 + dir * 0.0035).r;
      }
      m /= 12.0;
      core /= 12.0;
      col = mix(col, col * vec3(0.8, 0.7, 0.58), m * 0.55);
      col += GOLD * smoothstep(0.55, 1.0, core) * 0.1 * (1.0 - sh * 0.6);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

const BLIT_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uScene;
  varying vec2 vUv;
  ${PALETTE}
  ${NOISE}
  void main() {
    vec3 col = texture2D(uScene, vUv).rgb;
    // §5 grain, at full resolution and static so it reads as plaster, not TV.
    col += (hash(gl_FragCoord.xy) - 0.5) * 0.045;
    float vig = smoothstep(1.15, 0.35, length((vUv - 0.5) * vec2(1.1, 1.0)));
    col *= mix(0.93, 1.0, vig);
    gl_FragColor = vec4(min(col, SHELL), 1.0);
  }
`;

const GLASS_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uWaveAmp;
  uniform mat4  uToMark;
  varying vec3 vN;
  varying vec3 vV;
  varying float vLocalY;
  void main() {
    vec3 p = position;
    #ifdef WAVE
      p.y += uWaveAmp * sin(p.x * 8.0 + uTime * 1.3);
      p.z += uWaveAmp * 0.8 * cos(p.x * 6.0 + uTime * 1.05);
    #endif
    vLocalY = (uToMark * vec4(p, 1.0)).y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const GLASS_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uScene;
  uniform vec2  uRes;
  uniform vec3  uLight;
  uniform float uClipY;
  varying vec3 vN;
  varying vec3 vV;
  varying float vLocalY;
  ${PALETTE}
  void main() {
    #ifdef CLIP
      if (vLocalY < uClipY) discard;
    #endif
    vec3 n = normalize(vN);
    vec3 v = normalize(vV);
    if (!gl_FrontFacing) n = -n;
    float ndv = clamp(dot(n, v), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 2.4);
    vec2 uv = gl_FragCoord.xy / uRes;

    // Screen-space refraction with a touch of dispersion at the rim.
    vec2 off = n.xy * (0.045 + 0.08 * fres);
    vec3 col;
    col.r = texture2D(uScene, uv - off * 0.9).r;
    col.g = texture2D(uScene, uv - off).g;
    col.b = texture2D(uScene, uv - off * 1.12).b;

    // Thick glass at grazing angles absorbs a little — warm, never gray.
    float edge = smoothstep(0.45, 0.95, 1.0 - ndv);
    col = mix(col, col * vec3(0.52, 0.42, 0.34), edge * 0.62);
    // The lens gathers light toward its core.
    col = mix(col, SHELL, 0.03 + 0.08 * ndv * ndv);

    vec3 l = normalize(uLight);
    vec3 h = normalize(l + v);
    float nh = max(dot(n, h), 0.0);
    float spec = pow(nh, 110.0) * 1.4 + pow(nh, 14.0) * 0.14;
    col += spec * vec3(1.0, 0.95, 0.8);
    col = mix(col, SHELL, fres * 0.35);

    gl_FragColor = vec4(min(col, SHELL), 1.0);
  }
`;

const MASK_FRAG = /* glsl */ `
  precision highp float;
  uniform float uClipY;
  varying float vLocalY;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    #ifdef CLIP
      if (vLocalY < uClipY) discard;
    #endif
    gl_FragColor = vec4(1.0);
  }
`;

/* ── Geometry: monoline strokes → glass tubes ─────────────────────────────── */

interface BuiltMark {
  group: Group;
  sun: Group;
  rays: Group;
  materials: ShaderMaterial[];
  masks: Map<Mesh, ShaderMaterial>;
  glass: Map<Mesh, ShaderMaterial>;
  /** Normalised width/height of the mark (max side = 1). */
  w: number;
  h: number;
  /** Local y of the waterline. */
  waterline: number;
  /** Local y of the sun's centre, which the rays turn around. */
  sunCenterY: number;
}

function strokesToGeometry(ds: string[], mark: Mark, scale: number): BufferGeometry | null {
  const loader = new SVGLoader();
  const [bw, bh] = mark.box;
  // Slightly heavier than the flat stroke: glass needs body to refract.
  const radius = (mark.stroke / 2) * scale * 1.55;
  const parts: BufferGeometry[] = [];

  for (const d of ds) {
    const svg = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
    for (const path of svg.paths) {
      for (const sub of path.subPaths) {
        const len = sub.getLength();
        const n = Math.max(6, Math.ceil(len * 1.6));
        const pts2 = sub.getSpacedPoints(n);
        const first = pts2[0];
        const last = pts2[pts2.length - 1];
        const closed = first.distanceTo(last) < 0.05;
        if (closed) pts2.pop();
        const pts = pts2.map((p) => new Vector3((p.x - bw / 2) * scale, -(p.y - bh / 2) * scale, 0));
        const curve = new CatmullRomCurve3(pts, closed, 'centripetal');
        const segs = Math.max(8, Math.ceil(pts.length * 2.2));
        parts.push(new TubeGeometry(curve, segs, radius, 16, closed));
        if (!closed) {
          for (const end of [pts[0], pts[pts.length - 1]]) {
            const cap = new SphereGeometry(radius, 16, 12);
            cap.translate(end.x, end.y, end.z);
            parts.push(cap);
          }
        }
      }
    }
  }
  if (!parts.length) return null;
  // Tubes and spheres carry uv; strip to the shared attribute set to merge.
  for (const g of parts) {
    for (const key of Object.keys(g.attributes)) {
      if (key !== 'position' && key !== 'normal') g.deleteAttribute(key);
    }
  }
  return mergeGeometries(parts, false);
}

function buildMark(mark: Mark, sceneTex: () => WebGLRenderTarget, res: Vector2): BuiltMark {
  const [bw, bh] = mark.box;
  const scale = 1 / Math.max(bw, bh);
  const group = new Group();
  const sun = new Group();
  const rays = new Group();
  const materials: ShaderMaterial[] = [];
  const masks = new Map<Mesh, ShaderMaterial>();
  const glass = new Map<Mesh, ShaderMaterial>();

  const sunPaths = mark.paths.filter((p) => p.role === 'sun');
  const rayPaths = mark.paths.filter((p) => p.role === 'ray');
  const wavePaths = mark.paths.filter((p) => p.role === 'wave');
  const restPaths = mark.paths.filter((p) => !p.role);

  // The waterline: top of the first wave, in local units. Only meaningful for
  // marks with both a sun and waves; otherwise nothing is clipped.
  const hasSea = sunPaths.length > 0 && wavePaths.length > 0;
  let waterline = -10;
  let sunCenterY = 0;
  if (hasSea) {
    const loader = new SVGLoader();
    const ys: number[] = [];
    const svg = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${wavePaths[0].d}"/></svg>`);
    svg.paths.forEach((p) => p.subPaths.forEach((s) => s.getPoints(40).forEach((pt) => ys.push(pt.y))));
    const waveMid = ys.reduce((a, b) => a + b, 0) / ys.length;
    waterline = -(waveMid - bh / 2) * scale;
    const sunSvg = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${sunPaths[0].d}"/></svg>`);
    const sy: number[] = [];
    sunSvg.paths.forEach((p) => p.subPaths.forEach((s) => s.getPoints(40).forEach((pt) => sy.push(pt.y))));
    sunCenterY = -(Math.max(...sy) - bh / 2) * scale;
  }

  const make = (ds: string[], parent: Group, defines: Record<string, string>) => {
    const geo = strokesToGeometry(ds, mark, scale);
    if (!geo) return null;
    const uniforms = {
      uScene: { value: null as unknown },
      uRes: { value: res },
      uLight: { value: new Vector3(0.5, 0.7, 1) },
      uClipY: { value: waterline },
      uTime: { value: 0 },
      uWaveAmp: { value: 0.006 },
      uToMark: { value: new Matrix4() },
    };
    const mat = new ShaderMaterial({ vertexShader: GLASS_VERT, fragmentShader: GLASS_FRAG, uniforms, defines });
    const maskMat = new ShaderMaterial({ vertexShader: GLASS_VERT, fragmentShader: MASK_FRAG, uniforms, defines });
    uniforms.uScene.value = sceneTex().texture;
    const mesh = new Mesh(geo, mat);
    parent.add(mesh);
    materials.push(mat);
    masks.set(mesh, maskMat);
    glass.set(mesh, mat);
    return mesh;
  };

  const clip = hasSea ? { CLIP: '' } : {};
  if (sunPaths.length) make(sunPaths.map((p) => p.d), sun, clip);
  if (rayPaths.length) {
    // Rays turn around the sun's centre, so offset them into a pivot.
    const mesh = make(rayPaths.map((p) => p.d), rays, clip);
    if (mesh) mesh.position.y = -sunCenterY;
    rays.position.y = sunCenterY;
    sun.add(rays);
  }
  if (wavePaths.length) make(wavePaths.map((p) => p.d), group, { WAVE: '' });
  if (restPaths.length) make(restPaths.map((p) => p.d), group, {});
  group.add(sun);

  return { group, sun, rays, materials, masks, glass, w: bw * scale, h: bh * scale, waterline, sunCenterY };
}

/* ── The scene ────────────────────────────────────────────────────────────── */

export function createSunwall(opts: SunwallOptions) {
  const { canvas, host, slot = null, mark = null, shadow = 0.85, sunset = false, still = false, intro = true } = opts;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 1);

  const ortho = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new PlaneGeometry(2, 2);
  const res = new Vector2(1, 1);

  const wallRT = new WebGLRenderTarget(1, 1, { depthBuffer: false });
  const maskRT = new WebGLRenderTarget(1, 1, { depthBuffer: true });

  const wallUniforms = {
    uAspect: { value: 1 },
    uTime: { value: 0 },
    uSun: { value: 0 },
    uPointer: { value: new Vector2() },
    uShadow: { value: shadow },
    uMask: { value: maskRT.texture },
    uMaskOffset: { value: new Vector2(0.02, 0.03) },
    uHasMark: { value: mark ? 1 : 0 },
  };
  const wallScene = new Scene();
  wallScene.add(new Mesh(quad, new ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: WALL_FRAG, uniforms: wallUniforms, depthTest: false, depthWrite: false })));

  const blitScene = new Scene();
  blitScene.add(new Mesh(quad, new ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: BLIT_FRAG, uniforms: { uScene: { value: wallRT.texture } }, depthTest: false, depthWrite: false })));

  const fov = 28;
  const camera = new PerspectiveCamera(fov, 1, 0.1, 50);
  camera.position.set(0, 0, 6);
  const markScene = new Scene();
  const built = mark ? buildMark(mark, () => wallRT, res) : null;
  if (built) markScene.add(built.group);

  // ── Layout: the mark sits wherever CSS put the slot. ──────────────────────
  let baseScale = 1;
  const basePos = new Vector3();
  let width = 1;
  let height = 1;

  const layout = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    renderer.getDrawingBufferSize(res);
    wallRT.setSize(Math.ceil(res.x / 2), Math.ceil(res.y / 2));
    maskRT.setSize(Math.ceil(res.x / 2), Math.ceil(res.y / 2));
    wallUniforms.uAspect.value = width / height;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (built && slot) {
      const s = slot.getBoundingClientRect();
      const visH = 2 * Math.tan((fov * Math.PI) / 360) * camera.position.z;
      const visW = visH * camera.aspect;
      const cx = (s.left - rect.left + s.width / 2) / width;
      const cy = (s.top - rect.top + s.height / 2) / height;
      basePos.set((cx - 0.5) * visW, (0.5 - cy) * visH, 0);
      baseScale = Math.min(((s.width / width) * visW) / built.w, ((s.height / height) * visH) / built.h);
    }
  };

  // ── State ─────────────────────────────────────────────────────────────────
  const toMarkInv = new Matrix4();
  const pointer = new Vector2();
  const pointerTarget = new Vector2();
  let scrollP = 0;
  let spin = 0;
  let spinV = 0;
  let introT = intro && !still ? 0 : 1;
  const start = performance.now();
  let last = start;
  let raf = 0;
  let visible = true;
  let disposed = false;

  const onPointer = (e: PointerEvent) => {
    pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  };
  const onTap = () => {
    spinV += 4.5;
  };
  const onScroll = () => {
    const r = host.getBoundingClientRect();
    scrollP = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  };

  const easeGlide = (x: number) => 1 - Math.pow(1 - x, 4);

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = still ? 9.0 : (now - start) / 1000;

    pointer.lerp(pointerTarget, still ? 1 : 0.045);
    if (introT < 1) introT = Math.min(1, introT + dt / 2.2);
    const ie = easeGlide(introT);

    wallUniforms.uTime.value = t;
    wallUniforms.uSun.value = sunset && !still ? scrollP : 0;
    wallUniforms.uPointer.value.copy(pointer);

    const light = new Vector3(0.55 + pointer.x * 0.6, 0.75 + pointer.y * 0.5, 1).normalize();
    wallUniforms.uMaskOffset.value.set(0.018 + pointer.x * 0.012, 0.03 + pointer.y * 0.012);

    if (built) {
      const g = built.group;
      g.position.copy(basePos);
      g.position.y += Math.sin(t * 0.8) * 0.012 * baseScale;
      g.scale.setScalar(baseScale);
      g.rotation.y = pointer.x * 0.32 + Math.sin(t * 0.33) * 0.07;
      g.rotation.x = -pointer.y * 0.22 + Math.sin(t * 0.27 + 1) * 0.04;

      // The sun rises on load, and sets as you scroll away (§10 made literal).
      const set = sunset && !still ? scrollP : 0;
      const drop = (built.sunCenterY - built.waterline + 0.22) * (1 - ie) + set * 0.42;
      built.sun.position.y = -drop;

      spinV *= Math.pow(0.04, dt);
      spin += spinV * dt;
      built.rays.rotation.z = spin + set * 0.5 + (1 - ie) * -0.6;
      built.rays.scale.setScalar(0.6 + 0.4 * ie);

      for (const m of built.materials) {
        m.uniforms.uTime.value = t;
        m.uniforms.uLight.value.copy(light);
        m.uniforms.uWaveAmp.value = 0.006 + (1 - ie) * 0.02;
      }
      // The waterline clip is tested in the mark's own space, so it holds
      // however far the rays have turned or the sun has sunk.
      g.updateMatrixWorld(true);
      toMarkInv.copy(g.matrixWorld).invert();
      for (const [mesh, mat] of built.glass) {
        mat.uniforms.uToMark.value.multiplyMatrices(toMarkInv, mesh.matrixWorld);
      }
    }

    // Pass 1 — the mark's silhouette for its shadow.
    if (built) {
      for (const [mesh, maskMat] of built.masks) mesh.material = maskMat;
      renderer.setRenderTarget(maskRT);
      renderer.setClearColor(0x000000, 1);
      renderer.clear();
      renderer.render(markScene, camera);
      for (const [mesh, mat] of built.glass) mesh.material = mat;
    }
    // Pass 2 — the wall.
    renderer.setRenderTarget(wallRT);
    renderer.render(wallScene, ortho);
    // Pass 3 — wall to screen, glass on top.
    renderer.setRenderTarget(null);
    renderer.autoClear = true;
    renderer.render(blitScene, ortho);
    if (built) {
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(markScene, camera);
      renderer.autoClear = true;
    }

    if (!canvas.classList.contains('is-ready')) canvas.classList.add('is-ready');
    if (!still && visible && !disposed) raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const ro = new ResizeObserver(() => {
    layout();
    if (still) kick();
  });
  ro.observe(host);
  if (slot) ro.observe(slot);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden;
    if (visible && !still) kick();
  });
  io.observe(host);

  const onVis = () => {
    visible = !document.hidden;
    if (visible && !still) kick();
  };
  document.addEventListener('visibilitychange', onVis);

  if (!still) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    slot?.addEventListener('pointerdown', onTap);
  }

  layout();
  onScroll();
  kick();

  return {
    burst: onTap,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    },
  };
}
