// Dev Town: 20x15 tiles of 16px (320x240 internal pixels).
// W water, s sand, T tree, g grass, f flowers, p path. Buildings and signs sit on top.
export const TILE = 16;

export const ROWS = [
  "WWWWWWWWWWWWWWWWWWWW",
  "WWWWWWWWWWWWWWWWWWWW",
  "ssssssssssssssssssss",
  "TggggggfggggggfggggT",
  "TggggggggggggggggggT",
  "TggggggggggggggggggT",
  "TggggggggggggggggggT",
  "TppppppppppppppppppT",
  "TgggfggggpgggggfgggT",
  "TggggggggpgggggggggT",
  "TggggggggpgggggggggT",
  "TggggggggpgggggggggT",
  "TgggppppppppppppgggT",
  "TgfggggggpgggggggfgT",
  "TTTTTTTTTTTTTTTTTTTT",
];

export const COLS = ROWS[0].length;
export const HEIGHT = ROWS.length;

// Each building is 5x3 tiles; the door is the bottom-middle tile.
export const BUILDINGS = [
  { section: "about", x: 1, y: 4, roof: "#d94a3a" },
  { section: "quests", x: 7, y: 4, roof: "#3a6fd9" },
  { section: "projects", x: 13, y: 4, roof: "#8a4ad9" },
  { section: "skills", x: 4, y: 9, roof: "#d9a13a" },
  { section: "contact", x: 11, y: 9, roof: "#3aa86a" },
].map((b) => ({ ...b, w: 5, h: 3, door: { x: b.x + 2, y: b.y + 2 } }));

export const SIGNS = [
  {
    x: 11,
    y: 13,
    lines: [
      "DEV TOWN, home of Dorje Lama.",
      "Each building holds a part of his story. Walk up to a door to go in.",
    ],
  },
];

export const START = { x: 9, y: 13, dir: "up" };

export const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

const inBuilding = (x, y) =>
  BUILDINGS.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);

export const doorAt = (x, y) =>
  BUILDINGS.find((b) => b.door.x === x && b.door.y === y) ?? null;

export const signAt = (x, y) => SIGNS.find((s) => s.x === x && s.y === y) ?? null;

export function isWalkable(x, y) {
  if (x < 0 || y < 0 || x >= COLS || y >= HEIGHT) return false;
  if (doorAt(x, y)) return true;
  if (inBuilding(x, y) || signAt(x, y)) return false;
  return "sgfp".includes(ROWS[y][x]);
}

// What the player is facing: a door to enter or a sign to read.
export function interactAt(x, y, dir) {
  const [dx, dy] = DIRS[dir];
  const tx = x + dx;
  const ty = y + dy;
  const door = doorAt(tx, ty);
  if (door) return { type: "door", section: door.section };
  const sign = signAt(tx, ty);
  if (sign) return { type: "sign", lines: sign.lines };
  return null;
}
