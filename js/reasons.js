/* =====================================================================
   Reason Rush — the answer list
   ---------------------------------------------------------------------
   The same fourteen buttons appear on every question, in the same order,
   so the list doubles as the FUNKY X checklist on screen and the class
   gets fast at scanning it.

   Four of the fourteen are WRONG WORDINGS, and each one sits directly
   beside the reason it imitates. That is the point: "∠s on a str line"
   is only wrong because "adj" is missing, and you cannot learn to see
   that if the trap is parked at the bottom of the list where everyone
   knows never to look.

   Afrikaans is quoted from the two one-pagers and from the C9RAF table in
   gr8-constructions/index.html — the textbook wording is the only
   authority, so: regoorst. (not teenoorst.), verwiss. (not verwis.),
   ko-binne, "reguit lyn" as two words, plural as a raised e (∠ᵉ).
   ===================================================================== */

const REASONS = {
  corr:    { en: 'corr ∠s',              af: 'ooreenk. ∠ᵉ' },
  coint:   { en: 'co-int ∠s',            af: 'ko-binne ∠ᵉ' },
  alt:     { en: 'alt ∠s',               af: 'verwiss. ∠ᵉ' },
  adjstr:  { en: 'adj ∠s on a str line', af: "aangr. ∠ᵉ op 'n reguit lyn" },
  roundpt: { en: '∠s round a pt',        af: "∠ᵉ om 'n punt" },
  vertopp: { en: 'vert opp ∠s =',        af: 'regoorst. ∠ᵉ =' },
  inttri:  { en: 'int ∠s of Δ',          af: 'binne ∠ᵉ v. Δ' },
  exttri:  { en: 'ext ∠ of Δ',           af: 'buite ∠ v. Δ' },
  oppeq:   { en: '∠s opp equal sides',   af: '∠ᵉ t.o. = sye' },
  equi:    { en: 'equilateral Δ',        af: 'gelyksydige Δ' }
};

/* wrong wordings — never the answer to anything */
const TRAPS = {
  'x-sides': { en: 'corr sides',           af: 'ooreenk. sye',
               whyEn: 'Sides, not angles.', whyAf: 'Sye, nie hoeke nie.' },
  'x-coint': { en: 'co-int ∠s =',          af: 'ko-binne ∠ᵉ =',
               whyEn: 'Co-interior angles add to 180°, they are not equal.',
               whyAf: 'Ko-binnehoeke tel op tot 180°, hulle is nie gelyk nie.' },
  'x-str':   { en: '∠s on a str line',     af: "∠ᵉ op 'n reguit lyn",
               whyEn: 'The word "adj" is missing.', whyAf: 'Die woord "aangr." kort.' },
  'x-tri':   { en: '∠s of Δ',              af: '∠ᵉ v. Δ',
               whyEn: 'The word "int" is missing.', whyAf: 'Die woord "binne" kort.' }
};

/* screen order — every trap sits next to the reason it imitates */
const OPTION_ORDER = [
  'corr', 'x-sides',
  'coint', 'x-coint',
  'alt',
  'adjstr', 'x-str',
  'roundpt',
  'vertopp',
  'inttri', 'x-tri',
  'exttri',
  'oppeq',
  'equi'
];

function optionText(id, lang) {
  const o = REASONS[id] || TRAPS[id];
  return o ? o[lang] || o.en : id;
}

/* why a wrong pick was wrong — shown only on the picker's own screen */
function trapWhy(id, lang) {
  const t = TRAPS[id];
  if (!t) return '';
  return lang === 'af' ? t.whyAf : t.whyEn;
}

/* the yes/no round */
const YESNO = {
  yes: { en: 'Yes', af: 'Ja' },
  no:  { en: 'No',  af: 'Nee' }
};

const YESNO_WHY = {
  'yes': {
    en: 'Yes — the side carries on past the corner, so the angle outside it is an exterior angle.',
    af: 'Ja — die sy loop verby die hoekpunt, so die hoek buite is ’n buitehoek.'
  },
  'no-interior': {
    en: 'No — that angle is inside the triangle.',
    af: 'Nee — daardie hoek is binne die driehoek.'
  },
  'no-vertopp': {
    en: 'No — both sides carry on, so that angle is vertically opposite the inside angle, not an exterior angle.',
    af: 'Nee — albei sye loop deur, so daardie hoek is regoorstaande die binnehoek, nie ’n buitehoek nie.'
  },
  'no-ray': {
    en: 'No — that line is not a side carried on, so the angle it makes is not an exterior angle.',
    af: 'Nee — daardie lyn is nie ’n sy wat deurloop nie, so die hoek wat dit maak is nie ’n buitehoek nie.'
  }
};

/* 1st / 2nd / 3rd — and 1ste / 2de / 8ste on the Afrikaans side. Lives here
   because the learner's page loads reasons.js but not questions.js. */
function ordinal(n, lang) {
  if (lang === 'af') return n + (n === 1 || n === 8 || n >= 20 ? 'ste' : 'de');
  const t = n % 100;
  if (t >= 11 && t <= 13) return n + 'th';
  return n + (['th', 'st', 'nd', 'rd'][n % 10] || 'th');
}

const UI = {
  forWhy:     { en: 'For why?',  af: 'Want hoekom?' },
  whichPar:   { en: 'Which two lines are ∥ for this to be true?',
                af: 'Watter twee lyne is ∥ sodat dit waar is?' },
  isExt:      { en: 'Is the highlighted angle an exterior angle of a triangle?',
                af: 'Is die gemerkte hoek ’n buitehoek van ’n driehoek?' }
};
