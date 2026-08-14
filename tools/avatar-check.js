/* Proves the avatar set holds together: every face has a file, every file
   has a face, both languages present, and avValid refuses every hostile
   id shape the relay can carry (prototype keys, arrays, objects, legacy
   emoji ids). Written after the 2026-08-14 audit found two real holes. */
const fs = require('fs');
const path = require('path').join(__dirname, '..');
const fakeDoc = { createElement: () => ({ style: {}, dataset: {}, classList: { add() {} }, appendChild() {}, remove() {} }) };
const src = fs.readFileSync(path + '/js/avatars.js', 'utf8');
const api = new Function('document', src +
  '\nreturn { AV_FACES, AV_COLOURS, AV_DEFAULT, avValid, avFace, avColour, avRandom, avImg, avPaint };')(fakeDoc);
const { AV_FACES, AV_COLOURS, AV_DEFAULT, avValid, avRandom } = api;

let fails = 0;
const t = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) fails++;
  console.log((ok ? 'ok   ' : 'FAIL ') + label + ' -> ' + JSON.stringify(actual));
};

t('40 faces', AV_FACES.length, 40);
t('8 colours', AV_COLOURS.length, 8);
t('320 combinations', AV_FACES.length * AV_COLOURS.length, 320);

t('prototype key rejected', avValid('constructor.sky'), 'chill.sky');
t('__proto__ rejected', avValid('__proto__.sun'), 'chill.sky');
t('colour-half proto rejected', avValid('sunny.constructor'), 'chill.sky');
t('array rejected', avValid(['chill.sky']), 'chill.sky');
t('object rejected', avValid({ toString: 'x' }), 'chill.sky');
t('number rejected', avValid(42), 'chill.sky');
t('null rejected', avValid(null), 'chill.sky');
t('legacy emoji id rejected', avValid('fox'), 'chill.sky');
t('three-part rejected', avValid('a.b.c'), 'chill.sky');
t('valid id kept', avValid('winner.grape'), 'winner.grape');
t('always returns a string', typeof avValid(['x']), 'string');

const ids = AV_FACES.map(f => f.id);
t('face ids unique', new Set(ids).size, 40);
t('colour ids unique', new Set(AV_COLOURS.map(c => c.id)).size, 8);
t('no dots inside ids', ids.every(i => !i.includes('.')), true);

let randOk = true;
for (let i = 0; i < 2000; i++) { const r = avRandom(); if (avValid(r) !== r) randOk = false; }
t('avRandom always valid (2000 draws)', randOk, true);

const files = fs.readdirSync(path + '/img/avatars').filter(f => f.endsWith('.svg')).map(f => f.replace('.svg', ''));
t('40 svg files on disk', files.length, 40);
t('every face has a file', ids.every(i => files.includes(i)), true);
t('no orphan files', files.every(f => ids.includes(f)), true);

t('every face bilingual', AV_FACES.every(f => f.label.af && f.label.en), true);
t('every colour bilingual', AV_COLOURS.every(c => c.label.af && c.label.en), true);
t('every colour is a hex', AV_COLOURS.every(c => /^#[0-9a-f]{6}$/i.test(c.hex)), true);

t('default id is valid', avValid(AV_DEFAULT), AV_DEFAULT);

console.log(fails === 0 ? '\nall avatar checks passed' : '\n' + fails + ' CHECK(S) FAILED');
process.exit(fails === 0 ? 0 : 1);
