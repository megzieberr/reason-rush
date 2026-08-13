/* =====================================================================
   Reason Rush — geometry + SVG helpers
   ---------------------------------------------------------------------
   Ported from gr8-constructions/index.html (the chapter-9 "C9" figures) so
   the quiz speaks the same visual language the class already learned from:
     · ink-blue lines, rounded caps
     · a FAT TRANSLUCENT PINK stroke laid UNDER the lines = "this is the
       shape you were hunting for" (c9hi / c9letter / c9cross over there)
     · a teal wedge = "this is an angle the question is asking about"
   Nothing here draws a letter, a number or a degree size. Megan's ruling
   (2026-08-13): the quiz diagram is blank, two angles highlighted, that is
   the whole question. So none of the label-fitting machinery came across.
   ===================================================================== */

const RAD = d => d * Math.PI / 180;
const f   = n => Math.round(n * 100) / 100;
const P   = (x, y) => ({ x, y });

/* positive angle points UP, like a protractor (screen y is flipped) */
const cx = (c, r, a) => c.x + r * Math.cos(RAD(a));
const cy = (c, r, a) => c.y - r * Math.sin(RAD(a));

const dist    = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angleTo = (c, p) => Math.atan2(-(p.y - c.y), p.x - c.x) * 180 / Math.PI;
const ray     = (v, deg, L) => P(cx(v, L, deg), cy(v, L, deg));
const mid     = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2);
const lerp    = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);

/* rotate a point about a centre — this is what stops every parallel-lines
   question looking like the same picture twice */
function rot(p, c, deg) {
  const s = Math.sin(RAD(deg)), co = Math.cos(RAD(deg));
  const dx = p.x - c.x, dy = p.y - c.y;
  return P(c.x + dx * co + dy * s, c.y - dx * s + dy * co);
}

/* the intersection of line (a1->a2) with line (b1->b2), or null if parallel */
function meet(a1, a2, b1, b2) {
  const x1 = a1.x, y1 = a1.y, x2 = a2.x, y2 = a2.y;
  const x3 = b1.x, y3 = b1.y, x4 = b2.x, y4 = b2.y;
  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(den) < 1e-9) return null;
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  return P(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
}

/* arc sampled as a polyline — copied deliberately from the constructions
   player, which does it this way to sidestep the SVG large-arc/sweep flags */
function arcPath(c, r, a0, a1) {
  if (a1 < a0) [a0, a1] = [a1, a0];
  let d = "";
  const step = (a1 - a0) / Math.max(6, Math.ceil((a1 - a0) / 2));
  for (let a = a0; a <= a1 + 1e-6; a += step)
    d += (d ? "L" : "M") + f(cx(c, r, a)) + " " + f(cy(c, r, a));
  return d;
}

/* the two ray angles at v, wrapped so we always take the MINOR way round */
function spanDeg(v, p1, p2) {
  let a0 = angleTo(v, p1), a1 = angleTo(v, p2);
  while (a1 - a0 > 180) a1 -= 360;
  while (a1 - a0 < -180) a1 += 360;
  return [Math.min(a0, a1), Math.max(a0, a1)];
}

/* size of that minor angle, in degrees */
function angSize(v, p1, p2) {
  const [lo, hi] = spanDeg(v, p1, p2);
  return hi - lo;
}

/* ---------- palette (same names as C9 over in the constructions player) ---------- */
const C = {
  ink:   "#13324b",   // every line
  shape: "#db2777",   // the pink "here is your shape" highlight
  ask:   "#0d9488",   // the angles the question marks
  ask2:  "#2563eb",   // a second colour, for when one angle must stand apart
  mute:  "#64748b",
  paper: "#fdfcf4",
  edge:  "#e2e8f0"
};

/* ---------- primitives ---------- */

function seg(a, b, o) {
  o = o || {};
  return `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" ` +
         `stroke="${o.col || C.ink}" stroke-width="${o.w || 3.6}" stroke-linecap="round"/>`;
}

/* fat translucent stroke laid UNDER a line to call that line out */
function hi(a, b, col) {
  return `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" ` +
         `stroke="${col || C.shape}" stroke-width="15" stroke-linecap="round" opacity=".26"/>`;
}

/* the same fat translucent stroke, but bent round an angle — this is how the
   exterior angle gets called out on the reveal (Megan's blue-marker sketch) */
function hiArc(v, p1, p2, r, col) {
  const [lo, hiA] = spanDeg(v, p1, p2);
  return `<path d="${arcPath(v, r, lo, hiA)}" fill="none" stroke="${col || C.shape}" ` +
         `stroke-width="15" stroke-linecap="round" opacity=".26"/>`;
}

/* the wedge that says "this angle, right here" */
function wedge(v, p1, p2, o) {
  o = o || {};
  const [lo, hiA] = spanDeg(v, p1, p2);
  const r = o.r || 40, col = o.col || C.ask;
  let s = `<path d="M${f(v.x)} ${f(v.y)} ${arcPath(v, r, lo, hiA).replace(/^M/, "L")} Z" ` +
          `fill="${col}" opacity=".18"/>`;
  s += `<path d="${arcPath(v, r, lo, hiA)}" fill="none" stroke="${col}" ` +
       `stroke-width="3.6" stroke-linecap="round"/>`;
  return s;
}

/* a filled wedge only — used to flood all three interior angles on the reveal */
function wedgeFill(v, p1, p2, r, col) {
  const [lo, hiA] = spanDeg(v, p1, p2);
  return `<path d="M${f(v.x)} ${f(v.y)} ${arcPath(v, r, lo, hiA).replace(/^M/, "L")} Z" ` +
         `fill="${col || C.shape}" opacity=".26"/>` +
         `<path d="${arcPath(v, r, lo, hiA)}" fill="none" stroke="${col || C.shape}" ` +
         `stroke-width="3.4" stroke-linecap="round"/>`;
}

/* the chevron a textbook puts on a pair of parallel lines */
function chev(a, b, t, col) {
  const p = lerp(a, b, t === undefined ? .4 : t), d = angleTo(a, b), s = 12;
  return `<path d="M${f(cx(p, s, d + 148))} ${f(cy(p, s, d + 148))} L${f(p.x)} ${f(p.y)} ` +
         `L${f(cx(p, s, d - 148))} ${f(cy(p, s, d - 148))}" fill="none" ` +
         `stroke="${col || C.ink}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/* n tick marks across the middle of a side — "these sides are equal" */
function ticks(a, b, n, col) {
  const d = angleTo(a, b), m = lerp(a, b, .5), gap = 11, L = 11;
  let s = "";
  for (let i = 0; i < (n || 1); i++) {
    const off = (i - ((n || 1) - 1) / 2) * gap;
    const c0 = P(cx(m, off, d), cy(m, off, d));
    s += `<line x1="${f(cx(c0, L, d + 90))}" y1="${f(cy(c0, L, d + 90))}" ` +
         `x2="${f(cx(c0, L, d - 90))}" y2="${f(cy(c0, L, d - 90))}" ` +
         `stroke="${col || C.ink}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
  return s;
}

function dot(p, col) {
  return `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="5.4" fill="#fff" ` +
         `stroke="${col || C.ink}" stroke-width="2.6"/>`;
}

/* the ring that closes a full turn — the reveal for "angles round a point" */
function ring(p, r, col) {
  return `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(r)}" fill="none" ` +
         `stroke="${col || C.shape}" stroke-width="15" opacity=".26"/>`;
}

/* ---------- the shape traces (this is what the reveal is for) ---------- */

/* The letter the class is taught to hunt for — the F of corresponding angles,
   the N of alternate angles, the U of co-interior — traced on the figure
   itself: a spine plus one arm at each crossing. Arms the same side read as
   an F or a U, arms opposite sides read as an N. Arms are cut to a fixed
   reach so the letter stays a letter instead of becoming "the whole diagram
   is pink". (Straight port of c9letter.) */
function letterTrace(s1, s2, v1, arm1, v2, arm2, reach, col) {
  const R = reach || 120;
  const cut = (v, to) => {
    const d = dist(v, to) || 1, t = Math.min(1, R / d);
    return P(v.x + (to.x - v.x) * t, v.y + (to.y - v.y) * t);
  };
  return hi(s1, s2, col) + hi(v1, cut(v1, arm1), col) + hi(v2, cut(v2, arm2), col);
}

/* both lines through one crossing — the X of vertically opposite angles */
function crossTrace(a, b, c, d, col) {
  return hi(a, b, col) + hi(c, d, col);
}

/* ---------- the little man (angles opposite equal sides) ----------
   Megan's drawing, 2026-08-13: the two equal sides are his legs, and when the
   legs are the same length his feet are the same size. Head on top, a shoe
   sitting in each base angle. */
/* The left foot is MIRRORED, not spun round — rotating it 180° put the sole in
   the air (Megan spotted it in the first gallery, 2026-08-13). scale(-1,1)
   happens before the rotation, so the shoe lies along the base either way up
   the right way. The -5 lifts it so it stands ON the line instead of sinking
   through it. */
function shoe(p, deg, flip) {
  return `<g transform="translate(${f(p.x)},${f(p.y)}) rotate(${f(-deg)}) translate(0,-5) scale(${flip},1)">` +
    `<path d="M-8,1 C-9,-13 3,-17 12,-11 C21,-6 33,-3 38,2 C42,6 40,12 33,12 L-3,12 C-8,12 -8,6 -8,1 Z" ` +
      `fill="#b9c0cc" stroke="#3b4256" stroke-width="2.6" stroke-linejoin="round"/>` +
    `<path d="M0,-6 C4,-14 13,-13 17,-7 L11,3 L-1,1 Z" fill="#ff5722" stroke="#3b4256" stroke-width="2.2" stroke-linejoin="round"/>` +
    `<path d="M-8,7 L38,7" stroke="#3b4256" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M20,-2 L26,-1" stroke="#3b4256" stroke-width="2" stroke-linecap="round"/>` +
  `</g>`;
}

/* Head and eyes stay UPRIGHT no matter how the triangle leans — tying the eyes
   to the apex direction tipped the whole face over. */
function head(apex, up, r) {
  const R = r || 22, cH = ray(apex, 90, R + 30);
  /* eyes at 133°/47° on .55R, and their RADIUS scales with the head too —
     a fixed 5.4px still touched on the smallest triangles (tools/eye-check.js
     measured -0.3px in the worst case). At .26R the rim gap is always .23R. */
  const eR = R * .26;
  const e1 = ray(cH, 133, R * .55), e2 = ray(cH, 47, R * .55);
  return seg(apex, ray(apex, 90, 30), { w: 4.2 }) +
    `<circle cx="${f(cH.x)}" cy="${f(cH.y)}" r="${f(R)}" fill="#fff" stroke="${C.ink}" stroke-width="4"/>` +
    `<circle cx="${f(e1.x)}" cy="${f(e1.y)}" r="${f(eR)}" fill="#fff" stroke="${C.ink}" stroke-width="3"/>` +
    `<circle cx="${f(e2.x)}" cy="${f(e2.y)}" r="${f(eR)}" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`;
}

/* a line-end letter, sitting just past the end of the line it names */
function endLabel(p, from, txt, col) {
  const q = ray(p, angleTo(from, p), 24);
  return `<text x="${f(q.x)}" y="${f(q.y + 7.5)}" text-anchor="middle" font-size="22" ` +
         `font-weight="700" fill="${col || C.ink}">${txt}</text>`;
}

/* ---------- stage ---------- */
const STAGE = { w: 720, h: 470 };

function svgWrap(body, o) {
  o = o || {};
  return `<svg viewBox="0 0 ${STAGE.w} ${STAGE.h}" xmlns="http://www.w3.org/2000/svg" ` +
         `class="fig" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${o.alt || 'geometry diagram'}">` +
         `<rect x="0" y="0" width="${STAGE.w}" height="${STAGE.h}" rx="18" fill="${C.paper}"/>` +
         body + `</svg>`;
}

/* ---------- tiny seeded random, so a game can be replayed identically ---------- */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
