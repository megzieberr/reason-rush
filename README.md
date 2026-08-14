# Reason Rush

A Kahoot-style geometry-reasons game for Grade 8. The class sees a blank
diagram with two angles coloured in, and taps the reason from a list.

Built 2026-08-13 for the FUNKY X and TRIANGLES chapters.

## Running it

```bash
node tools/serve.js
```

- **Teacher / projector:** `http://localhost:5173/host.html`
- **Learners:** `http://localhost:5173/`
- **Class code:** `MATH` (one code for every class)

Learners need to reach the same address, so for a real lesson this has to be
deployed somewhere they can open — localhost only works on your own laptop.

## How a round goes

1. Learners type a name + the class code, pick English or Afrikaans, and land
   in a lobby. Their names pop up on your screen.
2. You press Start. 20 questions, shuffled, never the same two in a row.
3. Each question: blank figure, two angles wedged in teal, **"For why?"**, and
   fourteen buttons. 20 seconds.
4. Then the follow-ups, 10 seconds each. Almost every question asks what the
   marked angles actually are — **equal / supplementary (180°) /
   complementary (90°) / add up to 360°** — and the F / U / N questions ask a
   third part, "which two lines are ∥ for this to be true?", with the line
   names drawn fresh each time. Ext ∠ of Δ skips the relationship pick on
   purpose: none of the four is true of it (the outside angle *equals the
   other two added together*), and the yes/no questions stay single-part.
5. Reveal: the correct reason in words, the same figure with the shape traced
   in pink, and the leaderboard. **No names, no who-got-it-right.** Each learner
   sees their own ✓ or ✗ privately on their own device.
6. After Q20, a podium for 1st / 2nd / 3rd with confetti.
7. **End game** wipes every name and score and sends the class back to the join
   screen. Nothing was ever stored.

## The 14 buttons

Ten real reasons and four wrong wordings. Every trap sits directly beside the
reason it imitates, because a trap parked at the bottom of the list teaches
nothing. When a learner picks one, their own screen says why it was wrong.

| Trap | What's wrong with it |
|---|---|
| `corr sides` | sides, not angles |
| `co-int ∠s =` | co-interior angles add to 180°, they are not equal |
| `∠s on a str line` | the word *adj* is missing |
| `∠s of Δ` | the word *int* is missing |

## What's where

| File | What it does |
|---|---|
| `host.html` | teacher screen — owns the game, marks the answers, keeps the scores |
| `index.html` | learner screen — shows what it is told to show |
| `js/geom.js` | SVG helpers, the palette, the little man |
| `js/diagrams.js` | the twelve diagram templates and their reveal shapes |
| `js/questions.js` | the 20-question recipe (`MIX`) |
| `js/reasons.js` | the button list, the traps, the Afrikaans wording |
| `js/config.js` | class code, timers, points |
| `js/net.js` | the Supabase Realtime relay |
| `js/avatars.js` | the 40 faces, the 8 colours, `avPaint()` |
| `img/avatars/` | the 40 face SVGs, served from this site (never from DiceBear) |

Diagrams are drawn to scale by code, not pictures. The visual language is
lifted from `gr8-constructions/index.html`: ink-blue lines, a fat translucent
pink stroke for "here is the shape you were hunting for", teal wedges for the
angles the question is about.

## Changing things

- **Balance of the 20 questions** — `MIX` in `js/questions.js`.
- **Timers, points, class code** — `js/config.js`.
- **Button wording / traps** — `REASONS`, `TRAPS`, `OPTION_ORDER` in `js/reasons.js`.

## Checking it still works

```bash
node tools/check.js
```

Builds 60 figures per template and proves the marked angles really obey the
rule — corresponding angles come out equal, co-interior add to 180, the three
interior angles of a triangle add to 180, the exterior angle equals the two
opposite interior ones. This caught a real bug on day one: the isosceles
template was marking the equal pair at the wrong two corners.

```bash
node tools/game-check.js
```

Builds 200 whole games and checks the recipe holds: 20 questions, right counts
per rule, no rule twice in a row, the answer is never a trap, part 2 always
contains the right pair.

```bash
node tools/avatar-check.js
```

Proves the avatar set holds together: 40 faces ↔ 40 files with no orphans
either way, both languages on every label, and `avValid` refusing every junk
id the relay can carry (prototype names like `constructor.sky`, arrays,
objects, numbers, and the old emoji ids) so nothing but a real face can ever
reach the projector.

```bash
node tools/gallery.js          # every template, question + reveal, into out/gallery.html
node tools/gallery.js oppeq    # just one template
```

`test-twoup.html` puts the teacher and a learner side by side in one page for
testing the relay without a second device.

## Avatars

Learners pick a face (40 of them) and a colour (8) — the colour disc behind
the face is painted in CSS, so any face can wear any colour from one file per
face. The faces are the [Fun Emoji Set](https://www.figma.com/community/file/968125295144990435)
by **Davis Uche**, generated through [DiceBear](https://www.dicebear.com/styles/fun-emoji/)
and used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
The face list and colours live in `js/avatars.js`; an avatar travels over the
relay as one string, `"<face>.<colour>"`.

## The Supabase project

`gr8-quiz-relay` (org `mathwithmegan`, eu-west-1, free). It is a **message
relay only** — no tables, no rows, no accounts, nothing written. Scores live in
the browsers. The key in `config.js` is public by design; there is nothing
behind it.

## Not built yet

- **Solo fallback** for when the school wifi dies mid-lesson.
- **The 2D shapes round.** Same engine — a new question bank and a few new
  diagram templates.
