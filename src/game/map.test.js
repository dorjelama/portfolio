import { test } from "node:test";
import assert from "node:assert/strict";
import { ROWS, COLS, BUILDINGS, SIGNS, START, isWalkable, interactAt, doorAt } from "./map.js";
import { PLAYER, TREE, PALETTE } from "./sprites.js";

test("map rows are all the same width", () => {
  ROWS.forEach((r, i) => assert.equal(r.length, COLS, `row ${i}`));
});

test("start tile is walkable, water/trees/walls/edges are not", () => {
  assert.ok(isWalkable(START.x, START.y));
  assert.ok(!isWalkable(0, 0)); // water
  assert.ok(!isWalkable(0, 7)); // tree border
  assert.ok(!isWalkable(-1, 7));
  assert.ok(!isWalkable(COLS, 7));
  const b = BUILDINGS[0];
  assert.ok(!isWalkable(b.x, b.y)); // roof
  SIGNS.forEach((s) => assert.ok(!isWalkable(s.x, s.y)));
});

test("every door is walkable and reachable from the path below it", () => {
  for (const b of BUILDINGS) {
    assert.ok(isWalkable(b.door.x, b.door.y), b.section);
    assert.ok(isWalkable(b.door.x, b.door.y + 1), `${b.section} below`);
    assert.equal(doorAt(b.door.x, b.door.y).section, b.section);
    assert.deepEqual(interactAt(b.door.x, b.door.y + 1, "up"), { type: "door", section: b.section });
  }
});

test("every door can be reached from the start", () => {
  const seen = new Set([`${START.x},${START.y}`]);
  const queue = [[START.x, START.y]];
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const k = `${x + dx},${y + dy}`;
      if (!seen.has(k) && isWalkable(x + dx, y + dy)) {
        seen.add(k);
        queue.push([x + dx, y + dy]);
      }
    }
  }
  BUILDINGS.forEach((b) => assert.ok(seen.has(`${b.door.x},${b.door.y}`), b.section));
});

test("sprites are 16x16 and only use palette colours", () => {
  const grids = [TREE, ...Object.values(PLAYER).flat()];
  for (const g of grids) {
    assert.equal(g.length, 16);
    g.forEach((row, i) => {
      assert.equal(row.length, 16, `row ${i}: "${row}"`);
      [...row].forEach((ch) => assert.ok(ch === "." || ch in PALETTE, `unknown "${ch}"`));
    });
  }
});
