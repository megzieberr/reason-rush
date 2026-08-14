/* =====================================================================
   Reason Rush — the avatar set
   ---------------------------------------------------------------------
   Fun Emoji faces (Megan's pick, 2026-08-14 — "the kids asked for
   Kahoot-like avatars"). 40 curated faces from DiceBear's Fun Emoji
   style, downloaded once into img/avatars/ with transparent backgrounds:
   they are served from this site, so a lesson never depends on the
   DiceBear API (the tablets do still fetch them from the site itself,
   like any other asset). The coloured tile behind the face IS the skin,
   painted in CSS — so any face can wear any of the 8 colours without
   extra files.

   Attribution (CC BY 4.0): Fun Emoji Set by Davis Uche, remixed via
   DiceBear — credit lives in README.md, on the join screen, and inside
   every SVG's metadata.

   An avatar id travels over the relay as one string: "<face>.<colour>",
   e.g. "clever.sky". Same curation logic as before: fixed lists, no
   freeform anything. avValid() maps anything unknown (including old
   emoji ids left in sessionStorage from before the swap) to the neutral
   default, so a mangled payload can never draw junk on the projector.
   ===================================================================== */

const AV_FACES = [
  { id: "chill",      label: { en: "Chill",       af: "Rustig" } },
  { id: "happy",      label: { en: "Happy",       af: "Vrolik" } },
  { id: "beam",       label: { en: "Beaming",     af: "Straal" } },
  { id: "sweet",      label: { en: "Sweet",       af: "Oulik" } },
  { id: "cheeky",     label: { en: "Cheeky",      af: "Stout" } },
  { id: "wink",       label: { en: "Wink",        af: "Knipoog" } },
  { id: "joker",      label: { en: "Joker",       af: "Grapjas" } },
  { id: "kiss",       label: { en: "Kiss",        af: "Soentjie" } },
  { id: "shy",        label: { en: "Shy",         af: "Skaam" } },
  { id: "clever",     label: { en: "Clever",      af: "Slimkop" } },
  { id: "prof",       label: { en: "Professor",   af: "Professor" } },
  { id: "serious",    label: { en: "Serious",     af: "Ernstig" } },
  { id: "shocked",    label: { en: "Shocked",     af: "Geskok" } },
  { id: "doctor",     label: { en: "Doctor",      af: "Dokter" } },
  { id: "cool",       label: { en: "Cool",        af: "Cool" } },
  { id: "toocool",    label: { en: "Too cool",    af: "Te cool" } },
  { id: "sunny",      label: { en: "Sunny",       af: "Sonnig" } },
  { id: "rockstar",   label: { en: "Rock star",   af: "Rockster" } },
  { id: "starstruck", label: { en: "Star-struck", af: "Sterre-oë" } },
  { id: "superstar",  label: { en: "Superstar",   af: "Superster" } },
  { id: "winner",     label: { en: "Winner",      af: "Wenner" } },
  { id: "inlove",     label: { en: "In love",     af: "Verlief" } },
  { id: "hearts",     label: { en: "Heart eyes",  af: "Hartjie-oë" } },
  { id: "adore",      label: { en: "Adoring",     af: "Smoorverlief" } },
  { id: "silly",      label: { en: "Silly",       af: "Laf" } },
  { id: "giggle",     label: { en: "Giggles",     af: "Giggel" } },
  { id: "wow",        label: { en: "Wow",         af: "Wow" } },
  { id: "bliss",      label: { en: "Blissful",    af: "Salig" } },
  { id: "calm",       label: { en: "Calm",        af: "Kalm" } },
  { id: "bashful",    label: { en: "Bashful",     af: "Verleë" } },
  { id: "laugh",      label: { en: "Laughing",    af: "Lag" } },
  { id: "tease",      label: { en: "Teasing",     af: "Terg" } },
  { id: "sleepy",     label: { en: "Sleepy",      af: "Vaak" } },
  { id: "dozy",       label: { en: "Dozing",      af: "Slaperig" } },
  { id: "grumpy",     label: { en: "Grumpy",      af: "Nors" } },
  { id: "sad",        label: { en: "Sad",         af: "Hartseer" } },
  { id: "teary",      label: { en: "Teary",       af: "Tranerig" } },
  { id: "wail",       label: { en: "Crybaby",     af: "Tjankbalie" } },
  { id: "drool",      label: { en: "Drooling",    af: "Kwyl" } },
  { id: "masked",     label: { en: "Masked",      af: "Masker" } },
];

const AV_COLOURS = [
  { id: "sun",   hex: "#fcbc34", label: { en: "Yellow", af: "Geel" } },
  { id: "berry", hex: "#d84be5", label: { en: "Pink",   af: "Pienk" } },
  { id: "sky",   hex: "#059ff2", label: { en: "Blue",   af: "Blou" } },
  { id: "lime",  hex: "#71cf62", label: { en: "Green",  af: "Groen" } },
  { id: "clay",  hex: "#d9915b", label: { en: "Orange", af: "Oranje" } },
  { id: "coral", hex: "#f4707a", label: { en: "Red",    af: "Rooi" } },
  { id: "grape", hex: "#9b5de5", label: { en: "Purple", af: "Pers" } },
  { id: "teal",  hex: "#14b8a6", label: { en: "Teal",   af: "Seegroen" } },
];

const AV_FACE_BY_ID = {}, AV_COLOUR_BY_ID = {};
AV_FACES.forEach(f => { AV_FACE_BY_ID[f.id] = f; });
AV_COLOURS.forEach(c => { AV_COLOUR_BY_ID[c.id] = c; });

const AV_DEFAULT = "chill.sky";

/* "<face>.<colour>" → the validated STRING if both halves are own keys,
   else the default. Old emoji ids ("fox") have no dot and fall through to
   the default too. hasOwnProperty (not a truthy read) because the relay is
   attacker-writable: a bare AV_FACE_BY_ID[x] check passes inherited keys
   like "constructor", and returning the raw id (not its string form) lets
   a non-string crash .split() later — both found in the 2026-08-14 audit. */
function avValid(id) {
  if (typeof id !== "string") return AV_DEFAULT;   // relay payloads may be any JSON shape
  const p = id.split(".");
  return (p.length === 2 &&
          Object.prototype.hasOwnProperty.call(AV_FACE_BY_ID, p[0]) &&
          Object.prototype.hasOwnProperty.call(AV_COLOUR_BY_ID, p[1])) ? id : AV_DEFAULT;
}
function avFace(id)   { return AV_FACE_BY_ID[avValid(id).split(".")[0]]; }
function avColour(id) { return AV_COLOUR_BY_ID[avValid(id).split(".")[1]]; }
function avRandom() {
  const f = AV_FACES[Math.floor(Math.random() * AV_FACES.length)];
  const c = AV_COLOURS[Math.floor(Math.random() * AV_COLOURS.length)];
  return f.id + "." + c.id;
}

/* One face <img>, used by avPaint AND the picker grid, so the asset path
   and attributes live in exactly one place. onerror: a face that fails to
   fetch (wifi hiccup) removes itself and leaves the plain coloured disc —
   degraded but never a broken-image icon on the projector.

   lazy=true ONLY for the 40-tile picker grid, where most tiles start
   offscreen and eager loading would fire 40 requests per tablet at join
   time. Everything avPaint draws (lobby wall, leaderboard, verdict,
   podium) loads eagerly: those are few, and a deferred one shows up as an
   empty disc on the projector — seen happening in the 2026-08-14 audit. */
function avImg(faceId, lazy) {
  const img = document.createElement("img");
  img.src = "img/avatars/" + faceId + ".svg";
  img.alt = "";
  img.draggable = false;
  if (lazy) img.loading = "lazy";
  /* the SVGs carry a viewBox but no width/height, so an unloaded one has
     no shape and collapses to 0px high. These attributes give the 1:1
     ratio up front — the tile holds its square before the face lands. */
  img.width = 200;
  img.height = 200;
  img.onerror = () => img.remove();
  return img;
}

/* Paint an avatar into a container: coloured disc + the face SVG on top.
   Every avatar element in both HTMLs goes through here, so the look
   lives in one place (.avtile in app.css sizes the disc per context).
   Idempotent: repainting the same id is a no-op, so the host's per-join
   wall repaints don't tear down and re-decode 30 imgs on a join rush. */
function avPaint(el, id) {
  const v = avValid(id);
  if (el.dataset.av === v) return;
  el.dataset.av = v;
  const p = v.split(".");
  el.classList.add("avtile");
  el.style.background = AV_COLOUR_BY_ID[p[1]].hex;
  el.innerHTML = "";
  el.appendChild(avImg(p[0]));
}

/* the soft card colours behind a player's pill in the lobby — seeded from the
   pid so a card keeps its colour across repaints */
const AV_PASTELS = ["#f3edff", "#e6f7f5", "#fdeef7", "#fff4e0", "#e8f0fe", "#eafaf0"];
function avPastel(pid) {
  let h = 0;
  for (const ch of String(pid)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AV_PASTELS[h % AV_PASTELS.length];
}
function avTilt(pid) {
  let h = 0;
  for (const ch of String(pid)) h = (h * 37 + ch.charCodeAt(0)) >>> 0;
  return ((h % 7) - 3) + "deg";        // -3° … +3°, deterministic per player
}
