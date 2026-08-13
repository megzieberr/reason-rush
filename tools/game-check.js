/* Builds 200 whole games and checks the recipe holds every time.
   Run:  node tools/game-check.js */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = ['js/geom.js', 'js/diagrams.js', 'js/reasons.js', 'js/questions.js']
  .map(p => fs.readFileSync(path.join(root, p), 'utf8')).join('\n');
const api = new Function(src +
  '\nreturn {buildGame, MIX, OPTION_ORDER, REASONS, TRAPS, ordinal};')();

let fails = [];
const tally = {};

for (let g = 0; g < 200; g++) {
  const game = api.buildGame(12345 + g * 7);
  if (game.length !== 20) fails.push(`game ${g}: ${game.length} questions, expected 20`);

  const seen = {};
  game.forEach((q, i) => {
    seen[q.answer] = (seen[q.answer] || 0) + 1;
    tally[q.answer] = (tally[q.answer] || 0) + 1;

    if (!q.svgQ || q.svgQ.indexOf('<svg') !== 0) fails.push(`game ${g} q${i}: no question svg`);
    if (!q.svgR || q.svgR.indexOf('<svg') !== 0) fails.push(`game ${g} q${i}: no reveal svg`);
    if (!q.reveal || !q.reveal.en || !q.reveal.af) fails.push(`game ${g} q${i}: reveal text missing`);

    /* the answer must be a real option id, never a trap */
    if (q.kind === 'reason') {
      if (api.OPTION_ORDER.indexOf(q.answer) < 0) fails.push(`game ${g} q${i}: answer ${q.answer} not on the list`);
      if (api.TRAPS[q.answer]) fails.push(`game ${g} q${i}: answer is a trap!`);
    } else if (q.answer !== 'yes' && q.answer !== 'no') {
      fails.push(`game ${g} q${i}: bad yes/no answer ${q.answer}`);
    }

    /* two-part questions */
    const twoPart = ['corr', 'coint', 'alt'].indexOf(q.answer) >= 0;
    if (twoPart) {
      if (!q.part2) fails.push(`game ${g} q${i}: ${q.answer} has no part 2`);
      else {
        if (q.part2.options.length !== 3) fails.push(`game ${g} q${i}: part 2 has ${q.part2.options.length} options`);
        if (q.part2.options.indexOf(q.part2.answer) < 0) fails.push(`game ${g} q${i}: right pair not among the options`);
        if (new Set(q.part2.options).size !== 3) fails.push(`game ${g} q${i}: duplicate pair options`);
        if (q.reveal.en.indexOf(q.part2.answer) < 0) fails.push(`game ${g} q${i}: reveal does not name the ∥ lines`);
      }
    } else if (q.part2) fails.push(`game ${g} q${i}: ${q.answer} should not have a part 2`);

    /* the yes/no pair must be one of each */
    if (q.kind === 'yesno' && !q.why) fails.push(`game ${g} q${i}: yes/no with no explanation`);
  });

  for (const [rule, n] of api.MIX) {
    if (rule === 'yesno') {
      if ((seen.yes || 0) !== 1 || (seen.no || 0) !== 1)
        fails.push(`game ${g}: yes=${seen.yes || 0} no=${seen.no || 0}, expected 1 each`);
    } else if ((seen[rule] || 0) !== n) {
      fails.push(`game ${g}: ${rule} appeared ${seen[rule] || 0}x, expected ${n}`);
    }
  }

  /* the same rule should not land twice in a row */
  for (let i = 1; i < game.length; i++)
    if (game[i].answer === game[i - 1].answer && game[i].kind === 'reason')
      fails.push(`game ${g}: ${game[i].answer} twice in a row at q${i}`);
}

/* part 2 must not always want the same letters */
const pairs = new Set();
for (let g = 0; g < 60; g++)
  api.buildGame(777 + g).forEach(q => { if (q.part2) pairs.add(q.part2.answer); });

console.log('rule counts over 200 games:', tally);
console.log('distinct ∥ pairs asked for:', pairs.size);
console.log('ordinals:', [1, 2, 3, 8, 11, 21].map(n => api.ordinal(n, 'en')).join(' '),
            '·', [1, 2, 3, 8, 11, 21].map(n => api.ordinal(n, 'af')).join(' '));

if (pairs.size < 10) fails.push(`only ${pairs.size} distinct parallel pairs — part 2 is guessable`);

if (fails.length) {
  console.log('\n' + fails.length + ' PROBLEMS:');
  fails.slice(0, 15).forEach(f => console.log('  ' + f));
  process.exit(1);
}
console.log('\nall 200 games well formed');
