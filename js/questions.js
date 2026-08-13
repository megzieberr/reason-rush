/* =====================================================================
   Reason Rush — the 20-question recipe
   ---------------------------------------------------------------------
   Megan's ruling: repeat the FUN theorems and the triangle theorems a few
   times. The counts live in MIX and nowhere else, so the balance can be
   shifted in ten seconds without touching anything that draws.

   corr / alt / co-int questions come in TWO PARTS: pick the reason, then
   say which two of the three named lines are parallel for that reason to
   hold. The line names are drawn fresh each question (see LINE_NAMES in
   diagrams.js) so part 2 can never be answered from memory.
   ===================================================================== */

const MIX = [
  ['corr', 3], ['coint', 3], ['alt', 3],       // the F, the U, the N
  ['vertopp', 2], ['adjstr', 1], ['roundpt', 1],
  ['inttri', 2], ['exttri', 1], ['oppeq', 1], ['equi', 1],
  ['yesno', 2]                                  // one yes, one no
];

const TWO_PART = ['corr', 'coint', 'alt'];

function shuffleR(a, rng) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* shuffle, then pull apart any two neighbours testing the same rule */
function spread(list, rng) {
  shuffleR(list, rng);
  for (let pass = 0; pass < 12; pass++) {
    let moved = false;
    for (let i = 1; i < list.length; i++) {
      if (list[i].rule !== list[i - 1].rule) continue;
      for (let j = 0; j < list.length; j++) {
        const okHere = (list[j].rule !== list[i].rule) &&
          (j === 0 || list[j - 1].rule !== list[i].rule) &&
          (j === list.length - 1 || list[j + 1].rule !== list[i].rule) &&
          (i === 0 || list[i - 1].rule !== list[j].rule) &&
          (i === list.length - 1 || list[i + 1].rule !== list[j].rule);
        if (okHere) { [list[i], list[j]] = [list[j], list[i]]; moved = true; break; }
      }
    }
    if (!moved) break;
  }
  return list;
}

function buildGame(seed) {
  const rng = mulberry32(seed >>> 0);
  const slots = [];
  for (const [rule, n] of MIX)
    for (let i = 0; i < n; i++) slots.push({ rule, variant: i });
  spread(slots, rng);

  let yesnoSeen = 0;
  return slots.map((slot, idx) => {
    let rule = slot.rule, variant = slot.variant;
    if (rule === 'yesno') { rule = yesnoSeen++ === 0 ? 'yes' : 'no'; variant = Math.floor(rng() * 3); }

    const fig = buildFigure(rule, rng, variant);
    const isYesNo = rule === 'yes' || rule === 'no';
    const twoPart = TWO_PART.indexOf(rule) >= 0;

    const q = {
      n: idx + 1,
      total: slots.length,
      svgQ: svgWrap(fig.q),
      svgR: svgWrap(fig.r),
      answer: rule,
      why: isYesNo ? YESNO_WHY[fig.why] : null
    };

    /* every question is a LIST of parts, played in order:
         reason → relationship (when RULE_REL has one) → ∥ lines (FUN only).
       yes/no questions are their own single part; ext ∠ of Δ is reason-only
       because none of the four relationships is true of it. */
    if (isYesNo) {
      q.parts = [{ kind: 'yesno', answer: rule }];
      q.reveal = { en: YESNO[rule].en, af: YESNO[rule].af };
    } else {
      q.parts = [{ kind: 'reason', answer: rule }];
      if (RULE_REL[rule]) q.parts.push({ kind: 'rel', answer: RULE_REL[rule] });
      if (twoPart) q.parts.push({ kind: 'lines', answer: fig.answerPair, options: fig.pairOptions });
      q.reveal = twoPart
        ? { en: REASONS[rule].en + '; ' + fig.answerPair, af: REASONS[rule].af + '; ' + fig.answerPair }
        : { en: REASONS[rule].en, af: REASONS[rule].af };
    }
    return q;
  });
}
