/* =====================================================================
   Reason Rush — the avatar set
   ---------------------------------------------------------------------
   Ported verbatim from circle-geometry-game/js/config.js (Megan's ruling,
   2026-08-13: "sommer use the avatars from circle geo"). Same curation
   logic as over there: fixed list, no freeform anything, so it stays
   school-appropriate and gender-neutral — animals / creatures / space /
   nature / sport / music, no flags, no skin-toned faces.

   Unlike Circle Geo there is no server-side allow-list here, because
   nothing is stored: the id travels once over the relay and dies with
   the game. avEmoji() maps unknown ids to the neutral circle, so a
   mangled payload can never draw junk on the projector.
   ===================================================================== */

const AVATARS = [
  { id: "fox",         emoji: "🦊", label: { en: "Fox",        af: "Jakkals" } },
  { id: "owl",         emoji: "🦉", label: { en: "Owl",        af: "Uil" } },
  { id: "otter",       emoji: "🦦", label: { en: "Otter",      af: "Otter" } },
  { id: "panda",       emoji: "🐼", label: { en: "Panda",      af: "Panda" } },
  { id: "koala",       emoji: "🐨", label: { en: "Koala",      af: "Koala" } },
  { id: "cat",         emoji: "🐱", label: { en: "Cat",        af: "Kat" } },
  { id: "dog",         emoji: "🐶", label: { en: "Dog",        af: "Hond" } },
  { id: "lion",        emoji: "🦁", label: { en: "Lion",       af: "Leeu" } },
  { id: "tiger",       emoji: "🐯", label: { en: "Tiger",      af: "Tier" } },
  { id: "frog",        emoji: "🐸", label: { en: "Frog",       af: "Padda" } },
  { id: "monkey",      emoji: "🐵", label: { en: "Monkey",     af: "Aap" } },
  { id: "penguin",     emoji: "🐧", label: { en: "Penguin",    af: "Pikkewyn" } },
  { id: "shark",       emoji: "🦈", label: { en: "Shark",      af: "Haai" } },
  { id: "dolphin",     emoji: "🐬", label: { en: "Dolphin",    af: "Dolfyn" } },
  { id: "turtle",      emoji: "🐢", label: { en: "Turtle",     af: "Skilpad" } },
  { id: "octopus",     emoji: "🐙", label: { en: "Octopus",    af: "Seekat" } },
  { id: "butterfly",   emoji: "🦋", label: { en: "Butterfly",  af: "Skoenlapper" } },
  { id: "bee",         emoji: "🐝", label: { en: "Bee",        af: "By" } },
  { id: "parrot",      emoji: "🦜", label: { en: "Parrot",     af: "Papegaai" } },
  { id: "hedgehog",    emoji: "🦔", label: { en: "Hedgehog",   af: "Krimpvarkie" } },
  { id: "unicorn",     emoji: "🦄", label: { en: "Unicorn",    af: "Eenhoring" } },
  { id: "dragon",      emoji: "🐉", label: { en: "Dragon",     af: "Draak" } },
  { id: "trex",        emoji: "🦖", label: { en: "T-rex",      af: "T-rex" } },
  { id: "robot",       emoji: "🤖", label: { en: "Robot",      af: "Robot" } },
  { id: "alien",       emoji: "👾", label: { en: "Alien",      af: "Ruimtewese" } },
  { id: "ghost",       emoji: "👻", label: { en: "Ghost",      af: "Spook" } },
  { id: "comet",       emoji: "☄️", label: { en: "Comet",      af: "Komeet" } },
  { id: "rocket",      emoji: "🚀", label: { en: "Rocket",     af: "Vuurpyl" } },
  { id: "star",        emoji: "⭐", label: { en: "Star",       af: "Ster" } },
  { id: "planet",      emoji: "🪐", label: { en: "Planet",     af: "Planeet" } },
  { id: "moon",        emoji: "🌙", label: { en: "Moon",       af: "Maan" } },
  { id: "ufo",         emoji: "🛸", label: { en: "UFO",        af: "Ruimteskip" } },
  { id: "circle",      emoji: "🔵", label: { en: "Circle",     af: "Sirkel" } },
  { id: "leaf",        emoji: "🍃", label: { en: "Leaf",       af: "Blaar" } },
  { id: "sprout",      emoji: "🌱", label: { en: "Sprout",     af: "Saailing" } },
  { id: "wave",        emoji: "🌊", label: { en: "Wave",       af: "Golf" } },
  { id: "rainbow",     emoji: "🌈", label: { en: "Rainbow",    af: "Reënboog" } },
  { id: "lightning",   emoji: "⚡", label: { en: "Lightning",  af: "Weerlig" } },
  { id: "snowflake",   emoji: "❄️", label: { en: "Snowflake",  af: "Sneeuvlokkie" } },
  { id: "cactus",      emoji: "🌵", label: { en: "Cactus",     af: "Kaktus" } },
  { id: "football",    emoji: "⚽", label: { en: "Football",   af: "Sokker" } },
  { id: "basketball",  emoji: "🏀", label: { en: "Basketball", af: "Basketbal" } },
  { id: "tennis",      emoji: "🎾", label: { en: "Tennis",     af: "Tennis" } },
  { id: "medal",       emoji: "🏅", label: { en: "Medal",      af: "Medalje" } },
  { id: "target",      emoji: "🎯", label: { en: "Target",     af: "Teiken" } },
  { id: "dice",        emoji: "🎲", label: { en: "Dice",       af: "Dobbelsteen" } },
  { id: "gamepad",     emoji: "🎮", label: { en: "Gamepad",    af: "Speletjie" } },
  { id: "skateboard",  emoji: "🛹", label: { en: "Skateboard", af: "Skaatsplank" } },
  { id: "guitar",      emoji: "🎸", label: { en: "Guitar",     af: "Kitaar" } },
  { id: "drum",        emoji: "🥁", label: { en: "Drum",       af: "Trom" } },
  { id: "trumpet",     emoji: "🎺", label: { en: "Trumpet",    af: "Trompet" } },
  { id: "pizza",       emoji: "🍕", label: { en: "Pizza",      af: "Pizza" } },
  { id: "donut",       emoji: "🍩", label: { en: "Donut",      af: "Donut" } },
  { id: "watermelon",  emoji: "🍉", label: { en: "Watermelon", af: "Waatlemoen" } },
];

const AV_BY_ID = {};
AVATARS.forEach(a => { AV_BY_ID[a.id] = a; });

/* unknown / missing id → the neutral circle, never junk on the projector */
function avEmoji(id) { return (AV_BY_ID[id] || AV_BY_ID.circle).emoji; }
function avValid(id) { return AV_BY_ID[id] ? id : "circle"; }
function avRandom()  { return AVATARS[Math.floor(Math.random() * AVATARS.length)].id; }

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
