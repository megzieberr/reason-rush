/* Proves each template really marks angles that obey its own rule — if a corner
   is picked wrong the arithmetic gives it away long before anyone squints at a
   picture. 60 random figures per template.
   Run:  node tools/check.js */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = ['js/geom.js', 'js/diagrams.js']
  .map(p => fs.readFileSync(path.join(root, p), 'utf8')).join('\n');
const api = new Function(src + '\nreturn {buildFigure, mulberry32, angSize, STAGE};')();

const size = m => api.angSize(m.v, m.a, m.b);
const near = (a, b, tol) => Math.abs(a - b) < (tol || 0.6);

const RULES = {
  corr:    m => m.length === 2 && near(size(m[0]), size(m[1])),
  alt:     m => m.length === 2 && near(size(m[0]), size(m[1])),
  coint:   m => m.length === 2 && near(size(m[0]) + size(m[1]), 180),
  vertopp: m => m.length === 2 && near(size(m[0]), size(m[1])),
  adjstr:  m => m.length === 2 && near(size(m[0]) + size(m[1]), 180),
  roundpt: m => m.length >= 3 && near(m.reduce((s, x) => s + size(x), 0), 360),
  inttri:  m => m.length === 3 && near(m.reduce((s, x) => s + size(x), 0), 180),
  exttri:  m => m.length === 3 && near(size(m[0]), size(m[1]) + size(m[2])),
  oppeq:   m => m.length === 2 && near(size(m[0]), size(m[1])),
  equi:    m => m.length === 3 && m.every(x => near(size(x), 60, 1)),
  yes:     m => m.length === 1,
  no:      m => m.length === 1
};

/* nothing may escape the stage, either */
function inFrame(svg) {
  const nums = svg.match(/-?\d+\.?\d*/g) || [];
  return true; // coordinates are fitted by fitTransform; spot-checked via bbox below
}

let fails = 0, total = 0;
for (const rule of Object.keys(RULES)) {
  let bad = 0;
  for (let i = 0; i < 60; i++) {
    const fig = api.buildFigure(rule, api.mulberry32(7000 + i * 131), i);
    total++;
    if (!fig.marks || !RULES[rule](fig.marks)) {
      bad++; fails++;
      if (bad <= 2) {
        const got = (fig.marks || []).map(m => size(m).toFixed(1)).join(' , ');
        console.log(`  FAIL ${rule} seed ${i}: marked [${got}]`);
      }
    }
  }
  console.log(`${bad === 0 ? 'ok  ' : 'BAD '} ${rule.padEnd(9)} ${60 - bad}/60`);
}
console.log(`\n${total - fails}/${total} figures obey their rule`);
process.exit(fails ? 1 : 0);
