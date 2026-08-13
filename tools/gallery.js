/* Headless render of every diagram template, question + reveal side by side,
   so the figures get eyeballed before a single line of game code is written.
   Run:  node tools/gallery.js   ->  out/gallery.html */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = ['js/geom.js', 'js/diagrams.js']
  .map(p => fs.readFileSync(path.join(root, p), 'utf8')).join('\n');
const api = new Function(src + '\nreturn {buildFigure, svgWrap, mulberry32};')();

const PLAN = [
  ['corr', 4, 'corresponding angles — the F'],
  ['alt', 2, 'alternate angles — the N'],
  ['coint', 2, 'co-interior angles — the U'],
  ['vertopp', 3, 'vertically opposite angles — the X'],
  ['adjstr', 3, 'angles on a straight line'],
  ['roundpt', 3, 'angles round a point'],
  ['inttri', 3, 'interior angles of a triangle'],
  ['exttri', 3, 'exterior angle of a triangle'],
  ['oppeq', 3, 'angles opposite equal sides — the little man'],
  ['equi', 2, 'equilateral triangle'],
  ['yes', 2, 'IS it an exterior angle?  (answer: yes)'],
  ['no', 3, 'IS it an exterior angle?  (answer: no)']
];

let html = `<!doctype html><meta charset="utf-8"><title>Reason Rush — diagram gallery</title>
<style>
 body{font:15px/1.5 "Segoe UI",system-ui,sans-serif;background:#f1f5f9;color:#13324b;margin:0;padding:28px}
 h1{font-size:26px;margin:0 0 4px} .sub{color:#64748b;margin:0 0 26px}
 h2{font-size:18px;margin:34px 0 10px;padding-bottom:6px;border-bottom:2px solid #cbd5e1}
 .row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
 .card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:10px}
 .tag{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin:0 0 6px}
 .tag.rev{color:#db2777} svg{width:100%;height:auto;display:block}
</style>
<h1>Reason Rush — diagram gallery</h1>
<p class="sub">Left = what the class sees. Right = the reveal, with the shape traced in pink.</p>`;

const only = process.argv[2];        // e.g. `node tools/gallery.js oppeq`
for (const [rule, n, label] of PLAN.filter(p => !only || p[0] === only)) {
  html += `<h2>${label} &middot; <code>${rule}</code></h2>`;
  for (let v = 0; v < n; v++) {
    const rng = api.mulberry32(1000 + v * 37 + rule.length * 91);
    const fig = api.buildFigure(rule, rng, v);
    html += `<div class="row">
      <div class="card"><p class="tag">question ${v + 1}</p>${api.svgWrap(fig.q)}</div>
      <div class="card"><p class="tag rev">reveal${fig.why ? ' &middot; ' + fig.why : ''}</p>${api.svgWrap(fig.r)}</div>
    </div>`;
  }
}

fs.mkdirSync(path.join(root, 'out'), { recursive: true });
fs.writeFileSync(path.join(root, 'out', 'gallery.html'), html);
console.log('wrote out/gallery.html');
