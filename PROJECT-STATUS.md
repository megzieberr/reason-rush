# Project status — updated 2026-08-13 (evening)

## Where we are

**Reason Rush** — a Kahoot-style geometry-reasons game for her Grade 8s, built from
scratch today. Blank diagram, two angles wedged in teal, kids tap the reason from a
list of fourteen (ten real + four wrong-wording traps).

- **Live and used in a real lesson today**: teacher screen
  `https://megzieberr.github.io/reason-rush/host.html`, learners
  `https://megzieberr.github.io/reason-rush/`, class code **MATH**.
- Repo `megzieberr/reason-rush`, GitHub Pages off `main`, root, no build step.
- Supabase project `gr8-quiz-relay` (org mathwithmegan, eu-west-1, free) is a
  **message relay only** — no tables, no rows, no accounts. End Game closes the
  channel and every name and score is gone. There are no migrations, ever.
- Diagrams are drawn to scale by code (`js/geom.js` + `js/diagrams.js`), sharing the
  visual language of `gr8-constructions/index.html`. Megan has signed off on them —
  **the diagrams are settled, do not restyle them.**

## Decisions

- **2026-08-13** — Clicking, not typing. Started as a type-the-reason quiz; she
  switched it to a fixed list of buttons before the marker was written. The four
  wrong-wording traps do the teaching the strict marker was going to do.
- **2026-08-13** — Each trap sits *directly beside* the reason it imitates
  (`OPTION_ORDER`), never parked at the bottom where everyone learns to avoid the
  last four.
- **2026-08-13** — Question structure: reason → what the angles do
  (equal / supplementary 180° / complementary 90° / 360°) → for F/U/N only, which two
  lines are ∥. Line names are drawn fresh each question so part 3 can't be memorised.
- **2026-08-13** — `ext ∠ of Δ` gets **no** relationship part: none of the four options
  is true of it (the outside angle *equals the other two added together*). Yes/no
  questions stay single-part.
- **2026-08-13** — Equilateral Δ accepts **both** "Equal" and "adds up to 180°" — all
  three angles are marked, so both are genuinely true. Parts carry an `accept` LIST,
  so a future double-answer is a one-line change. Only such case in the round.
- **2026-08-13** — "Complementary — 90°" is a standing distractor; nothing in this
  round makes 90°.
- **2026-08-13** — Timers 20s → 30s → **60s** (reason) and **20s** (follow-ups). Every
  part ends the moment the last learner answers, so a long clock only helps slow
  readers. Worst case (nobody answers) a 20-question game is ~33 min.
- **2026-08-13** — Reveal shows the reason and the pink shape, **no names and no
  who-got-it-right**. Each learner sees their own ✓/✗ privately. Mid-game leaderboard
  stays (she asked for it back after I'd removed it).
- **2026-08-13** — Ending a game logs learners fully out; a new round means typing a
  name again (her rule, for the 2D-shapes round later).
- **2026-08-13** — Design: her FUNKY X posters are the brand. Letter rail
  `F U N K Y X Δ` is the signature — hero strip, **the question timer** (tiles drain
  grey), and the answer's family tile glows on the reveal. Self-hosted Fredoka.
- **2026-08-13** — Avatars are the 52 Circle Geo emoji, ported verbatim from
  `circle-geometry-game/js/config.js`. Kahoot-style lobby wall of tilted pastel cards.
- **2026-08-13** — The little man (∠s opp equal sides) is her drawing: legs the same
  length, feet the same size. Eyes and head scale with the triangle.
- **2026-08-13 (evening)** — **Host screen got an EN|AF pill** (top-right, remembered in
  localStorage, flips mid-game). Every learner string already carried both languages in
  reasons.js; only the host's own labels needed translating. Verified in the browser:
  lobby, question, tally, chips, reveal, podium and the took-over overlay all flip.
  Her ruling: "Leaderboard" stays English in both languages ("Ranglys" sounds like
  something in prison).
- **2026-08-13 (evening)** — Playtest false alarms settled, nothing changed: the 60→20
  "jump" is the per-part clocks doing their job (class moves in lock-step, a part ends
  when the LAST learner answers — solo play makes it look instant); partial marks per
  part already exist (reason 600+400, follow-ups 300+200 each); the equilateral
  double-answer WAS live — her "no" came from a half-stale browser cache (fresh
  config.js beside stale questions.js). She confirmed all three after a hard refresh.
- **2026-08-13** — **Test rigs must never share the live channel.** `roomCode()`:
  explicit `?room=` wins, localhost gets `DEV`, only a real deploy with no param uses
  the class code. Cause: my rig used code MATH and three fake "Test" players appeared
  on her projector mid-lesson.

## Pending on Megan

- 🌐 2 min **[whenever]**: after the toggle deploys, open the host screen, tap AF and
  check the projector reads naturally to you — the teacher-label translations are mine.

## Next up

Three things offered and not yet built — none blocking, all small:

1. **Tap-to-remove a player** in the lobby. Right now a kid whose tablet dies stays on
   the roster forever, so every part runs its full clock waiting for them (Skip works,
   but it's a tap per part). This is the most useful of the three.
2. **Show the relationship answer on the reveal.** A learner who picks the wrong
   relationship is told "look again at what the angles do" but never sees which one was
   right. The reason and the ∥ lines are both shown; this one isn't.
3. **Solo fallback** for dead school wifi — each device plays the same 20 questions
   alone, no lobby, so the lesson survives.

Then, on a different day with the class: **the 2D shapes round**. Same engine — a new
question bank and a few new diagram templates in `js/diagrams.js`, plus entries in
`js/reasons.js`. Learners log in fresh; nothing carries over.

## Files and checks

Everything lives in `C:\Users\megzi\Desktop\Claude Code Projects\gr8-reason-rush`.

| Command | What it proves |
|---|---|
| `node tools/check.js` | 720/720 figures obey their own rule (caught a real isosceles bug) |
| `node tools/game-check.js` | 200 whole games: counts, parts recipe, no rule twice in a row, answer never a trap |
| `node tools/eye-check.js` | the little man's eyes never touch (3.2px worst case) |
| `node tools/gallery.js [rule]` | renders every diagram, question + reveal, to `out/gallery.html` |
| `node tools/serve.js` | local server on :5173 |

`test-twoup.html` puts teacher and learner side by side for relay testing — it pins
`?room=RIG`, **never remove those query strings**.

Tunables in one place: `MIX` (question balance) in `js/questions.js`; timers, points and
class code in `js/config.js`; buttons and traps in `js/reasons.js`.
