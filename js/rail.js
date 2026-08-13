/* =====================================================================
   Reason Rush — the FUNKY X letter rail
   ---------------------------------------------------------------------
   The app's signature element (frontend-design pass, 2026-08-13). Seven
   candy tiles — F U N K Y X Δ — in the same colours as Megan's one-pagers.

   Three jobs:
     · hero strip on the join screen and lobby (gentle stagger on load)
     · THE TIMER on a question: tiles drain grey left-to-right as time
       runs out, so every countdown silently rehearses the checklist order
     · on the reveal, only the answer's family tile lights up

   Shared by host.html and index.html so the two pages cannot drift.
   The drain order is fixed and identical for every question — it must
   never hint at the answer.
   ===================================================================== */

const RAIL = [
  { L: 'F', bg: '#ccfbf1', fg: '#0d9488' },   // corresponding — mint
  { L: 'U', bg: '#dbeafe', fg: '#2563eb' },   // co-interior — periwinkle
  { L: 'N', bg: '#ffedd5', fg: '#ea580c' },   // alternate — peach
  { L: 'K', bg: '#fef9c3', fg: '#ca8a04' },   // straight line — gold
  { L: 'Y', bg: '#dcfce7', fg: '#16a34a' },   // round a point — leaf
  { L: 'X', bg: '#fce7f3', fg: '#db2777' },   // vertically opposite — rose
  { L: 'Δ', bg: '#ede9fe', fg: '#7c3aed' }    // every triangle rule — grape
];

const RULE_LETTER = {
  corr: 'F', coint: 'U', alt: 'N', adjstr: 'K', roundpt: 'Y', vertopp: 'X',
  inttri: 'Δ', exttri: 'Δ', oppeq: 'Δ', equi: 'Δ', yes: 'Δ', no: 'Δ'
};

/* build the tiles into el once; repeated calls are cheap no-ops */
function railMount(el, opts) {
  opts = opts || {};
  if (!el || el.dataset.rail) return;
  el.dataset.rail = '1';
  RAIL.forEach((t, i) => {
    const s = document.createElement('span');
    s.className = 'tile' + (opts.stagger ? ' in' : '');
    s.textContent = t.L;
    s.style.setProperty('--tbg', t.bg);
    s.style.setProperty('--tfg', t.fg);
    if (opts.stagger) s.style.animationDelay = (i * 70) + 'ms';
    el.appendChild(s);
  });
}

/* timer mode: frac 0 → all lit, frac 1 → all drained */
function railDrain(el, frac) {
  if (!el || !el.dataset.rail) return;
  const gone = Math.floor(Math.min(1, Math.max(0, frac)) * RAIL.length + 1e-9);
  [...el.children].forEach((tile, i) => tile.classList.toggle('drained', i < gone));
}

/* reveal mode: everything quiet except the answer's family */
function railGlow(el, letter) {
  if (!el || !el.dataset.rail) return;
  [...el.children].forEach(tile => {
    tile.classList.remove('drained');
    tile.classList.toggle('glow', tile.textContent === letter);
    tile.classList.toggle('dim', tile.textContent !== letter);
  });
}

/* back to plain (question start wipes any reveal styling) */
function railReset(el) {
  if (!el || !el.dataset.rail) return;
  [...el.children].forEach(tile => tile.classList.remove('drained', 'glow', 'dim'));
}
