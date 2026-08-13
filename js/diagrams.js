/* =====================================================================
   Reason Rush — the diagram engine
   ---------------------------------------------------------------------
   Every builder returns { rule, q, r } where q is the QUESTION body (blank
   figure, the angles the question asks about wedged in teal) and r is the
   REVEAL body (same figure with the pink shape traced over it).

   Nothing carries a letter, a number or a degree size. The only marks that
   survive are the ones without which the question is unanswerable: the
   chevrons on parallel lines and the ticks on equal sides.

   Each builder takes an rng so a whole game can be replayed identically
   from one seed, and rotates its figure by a random few degrees so the
   same rule never looks like the same picture twice.
   ===================================================================== */

/* every builder reports the angles it marked, so tools/check.js can prove the
   marked pair really does obey the rule the question is asking for */
const mk = (v, a, b) => ({ v, a, b });

const RR = (rng, a, b) => a + rng() * (b - a);
const RI = (rng, a, b) => Math.floor(a + rng() * (b - a + 1));
const RPICK = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const COIN = rng => rng() < .5;

/* Only ever shrinks — centres the figure and pulls it in if it would spill
   off the stage. Directions survive, so wedges built from raw ray points
   still point the right way after the transform. */
function fitTransform(pts, pad) {
  pad = pad === undefined ? 40 : pad;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  pts.forEach(p => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); });
  const w = Math.max(x1 - x0, 1), h = Math.max(y1 - y0, 1);
  const k = Math.min(1, (STAGE.w - 2 * pad) / w, (STAGE.h - 2 * pad) / h);
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const T = p => P(STAGE.w / 2 + (p.x - mx) * k, STAGE.h / 2 + (p.y - my) * k);
  T.k = k;
  return T;
}

/* ============================ 1. PARALLEL LINES ============================
   Two parallel lines cut by a transversal. Corners at each crossing are named
   by the two rays that bound them: R/L along the parallel line, U/D along the
   transversal. Corresponding = the same corner at both crossings; alternate =
   interior, opposite sides of the transversal; co-interior = interior, same
   side. See the working in the build notes — the sign test is
   cross(u, ray) > 0 for the R side, always. */

const PAR_PAIRS = {
  corr:  [['RU', 'RU'], ['UL', 'UL'], ['LD', 'LD'], ['DR', 'DR']],
  alt:   [['DR', 'UL'], ['LD', 'RU']],
  coint: [['DR', 'RU'], ['LD', 'UL']]
};

const horizOf = name => name.indexOf('R') >= 0 ? 'R' : 'L';

/* Part 2 of every FUN question is "which two lines are ∥ for this to be true?"
   — so all three lines carry names, and the names are drawn fresh from this
   pool each time. If the parallel pair were always AB and CD the second part
   would be free after two questions. */
const LINE_NAMES = ['AB', 'CD', 'EF', 'GH', 'KL', 'MN', 'PQ', 'RS', 'TV', 'WX'];
const pairName = (a, b) => a < b ? a + ' ∥ ' + b : b + ' ∥ ' + a;

function parFig(rng, kind, variant) {
  const gap = RR(rng, 148, 178);
  const YA = 150, YB = YA + gap;
  let t = RR(rng, 54, 76);
  if (COIN(rng)) t = 180 - t;                 // let the transversal lean the other way
  const u = P(Math.cos(RAD(t)), -Math.sin(RAD(t)));
  const s = gap / Math.sin(RAD(t));           // distance E->F down the transversal
  const E = P(RR(rng, 300, 400), YA);
  const F = P(E.x - s * u.x, YB);

  const xL = Math.min(E.x, F.x) - RR(rng, 190, 235);
  const xR = Math.max(E.x, F.x) + RR(rng, 190, 235);
  const A = P(xL, YA), B = P(xR, YA), Cc = P(xL, YB), D = P(xR, YB);
  const topEnd = P(E.x + u.x * RR(rng, 92, 118), E.y + u.y * RR(rng, 92, 118));
  const botEnd = P(F.x - u.x * RR(rng, 78, 100), F.y - u.y * RR(rng, 78, 100));

  const spin = RR(rng, -13, 13), ctr = P(360, (YA + YB) / 2);
  const rp = p => rot(p, ctr, spin);
  const ends = [A, B, Cc, D, topEnd, botEnd].map(rp);
  /* the letters sit past the ends of the lines, so they have to be inside the
     stage before the figure is fitted, or they get clipped */
  const anchors = [[0, 1], [1, 0], [2, 3], [3, 2], [4, 5], [5, 4]]
    .map(([i, j]) => ray(ends[i], angleTo(ends[j], ends[i]), 32));
  const T = fitTransform(ends.concat(anchors));
  const g = p => T(rp(p));
  const [gA, gB, gC, gD, gTop, gBot] = ends.map(T);
  const gE = g(E), gF = g(F);

  const pool = LINE_NAMES.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const [n1, n2, nT] = pool;
  const letters =
    endLabel(gA, gB, n1[0]) + endLabel(gB, gA, n1[1]) +
    endLabel(gC, gD, n2[0]) + endLabel(gD, gC, n2[1]) +
    endLabel(gTop, gBot, nT[0]) + endLabel(gBot, gTop, nT[1]);

  const cornersAt = V => {
    const L = 220;
    return {
      R: g(P(V.x + L, V.y)), L: g(P(V.x - L, V.y)),
      U: g(P(V.x + u.x * L, V.y + u.y * L)),
      D: g(P(V.x - u.x * L, V.y - u.y * L))
    };
  };
  const cE = cornersAt(E), cF = cornersAt(F);
  const pair = PAR_PAIRS[kind][variant % PAR_PAIRS[kind].length];
  const r = 40 * T.k;

  const base = seg(gA, gB) + seg(gC, gD) + seg(gTop, gBot) +
               chev(gA, gB, .17) + chev(gC, gD, .83) + dot(gE) + dot(gF) + letters;

  const q = base +
    wedge(gE, cE[pair[0][0]], cE[pair[0][1]], { r }) +
    wedge(gF, cF[pair[1][0]], cF[pair[1][1]], { r });

  /* the F / N / U traced on the figure itself */
  const armE = cE[horizOf(pair[0])], armF = cF[horizOf(pair[1])];
  const spine = kind === 'corr' ? [gTop, gBot] : [gE, gF];
  const trace = letterTrace(spine[0], spine[1], gE, armE, gF, armF, 128 * T.k);

  const marks = [mk(gE, cE[pair[0][0]], cE[pair[0][1]]), mk(gF, cF[pair[1][0]], cF[pair[1][1]])];
  /* part 2: which two of the three lines are parallel? */
  const answerPair = pairName(n1, n2);
  const pairOptions = [answerPair, pairName(n1, nT), pairName(n2, nT)];
  for (let i = pairOptions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); [pairOptions[i], pairOptions[j]] = [pairOptions[j], pairOptions[i]];
  }
  return { rule: kind, q, r: trace + q, marks, answerPair, pairOptions };
}

/* ============================ 2. VERTICALLY OPPOSITE ============================ */
function xFig(rng) {
  const V = P(360, 235);
  const a = RR(rng, 8, 70), b = a + RR(rng, 42, 96);   // two line directions
  const L1 = RR(rng, 175, 215), L2 = RR(rng, 175, 215);
  const p1 = ray(V, a, L1), p2 = ray(V, a + 180, L1);
  const p3 = ray(V, b, L2), p4 = ray(V, b + 180, L2);

  const T = fitTransform([p1, p2, p3, p4]);
  const [gp1, gp2, gp3, gp4] = [p1, p2, p3, p4].map(T), gV = T(V);
  const r = 42 * T.k;

  /* the two that sit ACROSS the crossing from each other */
  const flip = COIN(rng);
  const A = flip ? [gp1, gp3] : [gp3, gp2];
  const Bv = flip ? [gp2, gp4] : [gp4, gp1];

  const base = seg(gp1, gp2) + seg(gp3, gp4) + dot(gV);
  const q = base + wedge(gV, A[0], A[1], { r }) + wedge(gV, Bv[0], Bv[1], { r });
  const marks = [mk(gV, A[0], A[1]), mk(gV, Bv[0], Bv[1])];
  return { rule: 'vertopp', q, r: crossTrace(gp1, gp2, gp3, gp4) + q, marks };
}

/* ============================ 3. ANGLES ON A STRAIGHT LINE ============================ */
function strFig(rng) {
  const V = P(360, 300);
  const spin = RR(rng, -22, 22);
  const half = RR(rng, 215, 255);
  let th = COIN(rng) ? RR(rng, 40, 76) : RR(rng, 104, 140);
  if (COIN(rng)) th = -th;                              // ray below the line sometimes
  const Lp = ray(V, 180 + spin, half), Rp = ray(V, spin, half);
  const Ry = ray(V, th + spin, RR(rng, 150, 180));

  const T = fitTransform([Lp, Rp, Ry]);
  const [gL, gR, gRay] = [Lp, Rp, Ry].map(T), gV = T(V);
  const r = 44 * T.k;

  const base = seg(gL, gR) + seg(gV, gRay) + dot(gV);
  const q = base + wedge(gV, gL, gRay, { r }) + wedge(gV, gRay, gR, { r });
  const marks = [mk(gV, gL, gRay), mk(gV, gRay, gR)];
  return { rule: 'adjstr', q, r: hi(gL, gR) + hi(gV, gRay) + q, marks };
}

/* ============================ 4. ANGLES ROUND A POINT ============================
   Every angle at the point gets marked — the rule is about the whole turn, so
   marking only two of them would be a question with no answer. Rejects any run
   of consecutive angles that adds to 180°, which would put a straight line
   through the point and let "adj ∠s on a str line" in through the back door. */
function ptFig(rng) {
  const n = COIN(rng) ? 3 : 4;
  let angs = null;
  for (let tries = 0; tries < 400 && !angs; tries++) {
    const a = [];
    let left = 360;
    for (let i = 0; i < n - 1; i++) {
      const room = left - (n - 1 - i) * 62;
      const v = RR(rng, 62, Math.min(150, room));
      a.push(v); left -= v;
    }
    a.push(left);
    if (a.some(v => v < 62 || v > 158)) continue;
    let bad = false;
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n - 1; j++) { sum += a[(i + j) % n]; if (Math.abs(sum - 180) < 6) bad = true; }
    }
    if (!bad) angs = a;
  }
  angs = angs || (n === 3 ? [110, 130, 120] : [80, 100, 85, 95]);

  const V = P(360, 235), start = RR(rng, 0, 360);
  const dirs = [], ends = [];
  let acc = start;
  for (let i = 0; i < n; i++) { dirs.push(acc); ends.push(ray(V, acc, RR(rng, 165, 195))); acc += angs[i]; }

  const T = fitTransform(ends);
  const gEnds = ends.map(T), gV = T(V);
  const r = 46 * T.k;

  let base = gEnds.map(e => seg(gV, e)).join('') + dot(gV);
  let wedges = '', marks = [];
  for (let i = 0; i < n; i++) {
    wedges += wedge(gV, gEnds[i], gEnds[(i + 1) % n], { r: r - i * 2 });
    marks.push(mk(gV, gEnds[i], gEnds[(i + 1) % n]));
  }
  const trace = gEnds.map(e => hi(gV, e)).join('') + ring(gV, 62 * T.k);
  return { rule: 'roundpt', q: base + wedges, r: trace + base + wedges, marks };
}

/* ============================ triangle helper ============================ */
function triangle(rng, opts) {
  opts = opts || {};
  let A = opts.A, B = opts.B;
  if (A === undefined) {
    for (let i = 0; i < 200; i++) {
      A = RR(rng, 38, 86); B = RR(rng, 38, 86);
      if (180 - A - B >= 38 && 180 - A - B <= 96) break;
    }
  }
  const Cang = 180 - A - B;
  const base = opts.base || RR(rng, 300, 360);
  /* B bottom-left, C bottom-right, apex A found from the two base angles */
  const Bp = P(360 - base / 2, 330), Cp = P(360 + base / 2, 330);
  const Ap = meet(Bp, ray(Bp, B, 500), Cp, ray(Cp, 180 - Cang, 500));
  return { A: Ap, B: Bp, C: Cp, angA: A, angB: B, angC: Cang };
}

/* ============================ 5. INTERIOR ANGLES OF A TRIANGLE ============================ */
function triFig(rng) {
  const t = triangle(rng);
  const spin = RR(rng, -16, 16), ctr = P(360, 265);
  const raw = [t.A, t.B, t.C].map(p => rot(p, ctr, spin));
  const T = fitTransform(raw);
  const [A, B, Cp] = raw.map(T);
  const r = 40 * T.k;

  const base = seg(A, B) + seg(B, Cp) + seg(Cp, A);
  const q = base + wedge(A, B, Cp, { r }) + wedge(B, Cp, A, { r }) + wedge(Cp, A, B, { r });
  const trace = wedgeFill(A, B, Cp, r + 4) + wedgeFill(B, Cp, A, r + 4) + wedgeFill(Cp, A, B, r + 4);
  const marks = [mk(A, B, Cp), mk(B, Cp, A), mk(Cp, A, B)];
  return { rule: 'inttri', q, r: base + trace, marks };
}

/* ============================ 6. EXTERIOR ANGLE ============================
   Triangle LMN with side ML carried on past L to P. The exterior angle is
   ∠PLN. mode 'ext' asks for the reason (exterior angle plus the two interior
   opposite angles marked); the yes/no modes mark ONE angle and ask whether it
   is an exterior angle at all. */
function extFig(rng, mode) {
  const t = triangle(rng, { A: RR(rng, 42, 66), B: RR(rng, 46, 74) });
  /* rename to Megan's sketch: L = apex, M = bottom-left, N = bottom-right */
  const L = t.A, M = t.B, N = t.C;
  const ext = RR(rng, 105, 135);                       // how far past L the side runs
  const Pp = P(L.x + (L.x - M.x) / dist(L, M) * ext, L.y + (L.y - M.y) / dist(L, M) * ext);
  const Q = P(L.x + (L.x - N.x) / dist(L, N) * ext, L.y + (L.y - N.y) / dist(L, N) * ext);
  const stray = ray(L, angleTo(L, Pp) + RR(rng, 34, 52) * (COIN(rng) ? 1 : -1), ext);

  const spin = RR(rng, -12, 12), ctr = P(360, 250);
  const need = { ext: [Pp], 'no-interior': [Pp], 'no-vertopp': [Pp, Q], 'no-ray': [Pp, stray] }[mode] || [Pp];
  const raw = [L, M, N].concat(need).map(p => rot(p, ctr, spin));
  const T = fitTransform(raw);
  const gp = p => T(rot(p, ctr, spin));
  const gL = gp(L), gM = gp(M), gN = gp(N), gP = gp(Pp), gQ = gp(Q), gS = gp(stray);
  const r = 40 * T.k;

  const tri = seg(gL, gM) + seg(gM, gN) + seg(gN, gL);

  if (mode === 'ext') {
    const q = tri + seg(gL, gP) + dot(gL) +
      wedge(gL, gP, gN, { r: r + 4 }) + wedge(gM, gN, gL, { r }) + wedge(gN, gL, gM, { r });
    /* her blue marker: the outside angle, then the two sides that run to the
       two opposite interior angles — P through L to M, and L out to N */
    const trace = hiArc(gL, gP, gN, r + 20) + hi(gP, gM) + hi(gL, gN);
    const marks = [mk(gL, gP, gN), mk(gM, gN, gL), mk(gN, gL, gM)];
    return { rule: 'exttri', q, r: trace + q, marks };
  }
  if (mode === 'yes') {
    const q = tri + seg(gL, gP) + dot(gL) + wedge(gL, gP, gN, { r: r + 4 });
    return { rule: 'yes', q, r: hiArc(gL, gP, gN, r + 24) + hi(gP, gM) + hi(gL, gN) + q, why: 'yes', marks: [mk(gL, gP, gN)] };
  }
  if (mode === 'no-interior') {
    const q = tri + seg(gL, gP) + dot(gL) + wedge(gL, gM, gN, { r: r + 4 });
    return { rule: 'no', q, r: wedgeFill(gL, gM, gN, r + 8) + q, why: 'no-interior', marks: [mk(gL, gM, gN)] };
  }
  if (mode === 'no-vertopp') {
    const q = tri + seg(gL, gP) + seg(gL, gQ) + dot(gL) + wedge(gL, gP, gQ, { r: r + 4 });
    const trace = wedgeFill(gL, gP, gQ, r + 8) + wedgeFill(gL, gM, gN, r + 8);
    return { rule: 'no', q, r: trace + q, why: 'no-vertopp', marks: [mk(gL, gP, gQ)] };
  }
  /* no-ray: a line out of the corner that is NOT a side carried on */
  const q = tri + seg(gL, gS) + dot(gL) + wedge(gL, gS, gN, { r: r + 4 });
  return { rule: 'no', q, r: hi(gL, gS) + hi(gM, gL) + q, why: 'no-ray', marks: [mk(gL, gS, gN)] };
}

/* ============================ 7. ANGLES OPPOSITE EQUAL SIDES ============================
   The reveal is Megan's little man (2026-08-13): the two equal sides are his
   legs, and because the legs are the same length his feet come out the same
   size. Apex stays near the top so the man reads as a man — the variation
   comes from the apex angle and a small lean. */
function isoFig(rng) {
  const apex = RR(rng, 34, 76);
  const baseAng = (180 - apex) / 2;
  /* triangle() puts opts.A at the apex and opts.B at the bottom-left corner —
     passing baseAng for BOTH silently built the equal pair at the apex instead
     of at the two feet, which is exactly what tools/check.js caught. */
  const t = triangle(rng, { A: apex, B: baseAng, base: RR(rng, 250, 310) });
  const spin = RR(rng, -9, 9), ctr = P(360, 260);
  const raw = [t.A, t.B, t.C].map(p => rot(p, ctr, spin));
  /* keep room above the apex for the head */
  const T = fitTransform(raw.concat([rot(P(t.A.x, t.A.y - 78), ctr, spin)]));
  const [A, B, Cp] = raw.map(T);
  const r = 38 * T.k;

  const base = seg(A, B) + seg(B, Cp) + seg(Cp, A) +
               ticks(A, B, 1) + ticks(A, Cp, 1);
  const q = base + wedge(B, Cp, A, { r }) + wedge(Cp, A, B, { r });

  const along = angleTo(B, Cp);
  const man = base +
    head(A, 90, 21 * T.k) +
    wedgeFill(B, Cp, A, r + 3) + wedgeFill(Cp, A, B, r + 3) +
    shoe(B, along, -1) + shoe(Cp, along, 1);
  const marks = [mk(B, Cp, A), mk(Cp, A, B)];
  return { rule: 'oppeq', q, r: man, marks };
}

/* ============================ 8. EQUILATERAL ============================ */
function equiFig(rng) {
  const t = triangle(rng, { A: 60, B: 60, base: RR(rng, 270, 320) });
  const spin = RR(rng, -18, 18), ctr = P(360, 265);
  const raw = [t.A, t.B, t.C].map(p => rot(p, ctr, spin));
  const T = fitTransform(raw);
  const [A, B, Cp] = raw.map(T);
  const r = 40 * T.k;

  const base = seg(A, B) + seg(B, Cp) + seg(Cp, A) +
               ticks(A, B, 1) + ticks(B, Cp, 1) + ticks(Cp, A, 1);
  const q = base + wedge(A, B, Cp, { r }) + wedge(B, Cp, A, { r }) + wedge(Cp, A, B, { r });
  const trace = hi(A, B) + hi(B, Cp) + hi(Cp, A) +
                wedgeFill(A, B, Cp, r + 3) + wedgeFill(B, Cp, A, r + 3) + wedgeFill(Cp, A, B, r + 3);
  const marks = [mk(A, B, Cp), mk(B, Cp, A), mk(Cp, A, B)];
  return { rule: 'equi', q, r: trace + base, marks };
}

/* ============================ the menu ============================ */
const BUILDERS = {
  corr:   (rng, v) => parFig(rng, 'corr', v),
  alt:    (rng, v) => parFig(rng, 'alt', v),
  coint:  (rng, v) => parFig(rng, 'coint', v),
  vertopp: rng => xFig(rng),
  adjstr:  rng => strFig(rng),
  roundpt: rng => ptFig(rng),
  inttri:  rng => triFig(rng),
  exttri:  rng => extFig(rng, 'ext'),
  oppeq:   rng => isoFig(rng),
  equi:    rng => equiFig(rng),
  yes:     rng => extFig(rng, 'yes'),
  no:     (rng, v) => extFig(rng, ['no-interior', 'no-vertopp', 'no-ray'][v % 3])
};

function buildFigure(rule, rng, variant) {
  return BUILDERS[rule](rng, variant || 0);
}
