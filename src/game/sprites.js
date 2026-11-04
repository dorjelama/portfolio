// Original pixel art as string grids: one char per pixel, "." is transparent.
// The player is Dorje in a navy beanie and teal scarf.
export const PALETTE = {
  k: "#1b1b2f", // outline
  n: "#2b2f77", // beanie
  N: "#4a52b3", // beanie cuff
  w: "#ffffff",
  h: "#1a1a1a", // hair
  s: "#f2c29b", // skin
  S: "#d99b73",
  e: "#1a1a1a", // eyes
  t: "#1f9e9a", // scarf
  o: "#e0a43a", // scarf stripe
  j: "#2a2a2a", // jacket
  b: "#4a3424", // trousers / boots
  G: "#8fe05a", // leaf light
  g: "#4ea838", // leaf
  d: "#2f7a2a", // leaf dark
  r: "#7a4a24", // trunk
};

const HEAD_FRONT = [
  "....kkkkkkkk....",
  "...knnnnNNnnk...",
  "..knnnnnnwnnnk..",
  "..kNNNNNNNNNNk..",
  "..khhhhhhhhhhk..",
  "..khsssssssshk..",
  "..khsesssseshk..",
  "...ksssSSsssk...",
];

const HEAD_BACK = [
  "....kkkkkkkk....",
  "...knnnnNNnnk...",
  "..knnnnnnnnnnk..",
  "..kNNNNNNNNNNk..",
  "..khhhhhhhhhhk..",
  "..khhhhhhhhhhk..",
  "..khhhhhhhhhhk..",
  "...khhhhhhhhk...",
];

const BODY_FRONT = [
  "..kttottttottk..",
  ".kjttttttttttjk.",
  ".kjjjtottotjjjk.",
  ".ksjjjjjjjjjjsk.",
  "..kjjjjjjjjjjk..",
];

const BODY_BACK = [
  "..kttttttttttk..",
  ".kjttttttttttjk.",
  ".kjjjjjjjjjjjjk.",
  ".ksjjjjjjjjjjsk.",
  "..kjjjjjjjjjjk..",
];

const SIDE_TOP = [
  ".....kkkkkkk....",
  "....knnnnNNnk...",
  "...knnnnnnnnnk..",
  "...kNNNNNNNNNk..",
  "...khhhhhhhhhk..",
  "..ksssshhhhhhk..",
  "..ksesshhhhhhk..",
  "...ksssshhhhk...",
  "...kttttttttok..",
  "..kttttjjjjjjk..",
  "...kjjjjjjjjk...",
  "...kjsjjjjjjk...",
  "...kjjjjjjjjk...",
];

const LEGS = {
  stand: ["...kbbbbbbbbk...", "...kbbk..kbbk...", "...kkkk..kkkk..."],
  walk: ["...kbbbbbbbbk...", "..kbbk...kbbk...", "..kkkk....kkk..."],
  sideStand: ["....kbbbbbbk....", "....kbbkkbbk....", "....kkk..kkk...."],
  sideWalk: ["...kbbbbbbbbk...", "..kbbk....kbbk..", "..kkk......kkk.."],
};

const mirror = (rows) => rows.map((r) => [...r].reverse().join(""));

// PLAYER[dir] = [standFrame, walkFrameA, walkFrameB]
const front = [...HEAD_FRONT, ...BODY_FRONT];
const back = [...HEAD_BACK, ...BODY_BACK];
const left = [
  [...SIDE_TOP, ...LEGS.sideStand],
  [...SIDE_TOP, ...LEGS.sideWalk],
  [...SIDE_TOP, ...LEGS.sideWalk],
];
export const PLAYER = {
  down: [[...front, ...LEGS.stand], [...front, ...LEGS.walk], [...front, ...mirror(LEGS.walk)]],
  up: [[...back, ...LEGS.stand], [...back, ...LEGS.walk], [...back, ...mirror(LEGS.walk)]],
  left,
  right: left.map(mirror),
};

export const TREE = [
  ".....kkkkkk.....",
  "...kkGGGGGGkk...",
  "..kGGGGGGgggGk..",
  ".kGGGGGgggggggk.",
  ".kGGGgggggggddk.",
  "kGGgggggggggddk.",
  "kGgggggggggdddk.",
  "kggggggggggdddk.",
  "kgggggggggddddk.",
  ".kgggggggddddk..",
  ".kddggggddddddk.",
  "..kkddddddddkk..",
  "....kkkrrkkk....",
  "......krrk......",
  "......krrk......",
  ".....kkkkkk.....",
];

// Draws a grid to its own canvas once, so the game loop only blits images.
export function toCanvas(rows) {
  const c = document.createElement("canvas");
  c.width = rows[0].length;
  c.height = rows.length;
  const ctx = c.getContext("2d");
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      ctx.fillStyle = PALETTE[ch];
      ctx.fillRect(x, y, 1, 1);
    })
  );
  return c;
}
