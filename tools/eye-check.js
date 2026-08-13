/* Proves the little man's eyes no longer touch: parses the two eye circles
   out of 40 rendered oppeq reveals and measures the rim-to-rim gap.
   Run:  node tools/eye-check.js */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = ['js/geom.js', 'js/diagrams.js']
  .map(p => fs.readFileSync(path.join(root, p), 'utf8')).join('\n');
const api = new Function(src + '\nreturn {buildFigure, mulberry32};')();

let worst = 1e9;
for (let i = 0; i < 40; i++) {
  const fig = api.buildFigure('oppeq', api.mulberry32(4000 + i * 17), 0);
  /* the eyes are the two smallest stroke-width-3 circles in the reveal */
  const eyes = [...fig.r.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="#fff" stroke="[^"]+" stroke-width="3"\/>/g)]
    .map(m => ({ x: +m[1], y: +m[2], r: +m[3] }));
  if (eyes.length !== 2) { console.log('seed', i, 'found', eyes.length, 'eye circles'); process.exit(1); }
  const d = Math.hypot(eyes[0].x - eyes[1].x, eyes[0].y - eyes[1].y);
  worst = Math.min(worst, d - eyes[0].r - eyes[1].r);
}
console.log('smallest rim-to-rim eye gap over 40 mannetjies: ' + worst.toFixed(1) + 'px');
process.exit(worst > 2 ? 0 : 1);
