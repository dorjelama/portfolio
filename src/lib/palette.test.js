import { test } from "node:test";
import assert from "node:assert/strict";
import { pickAccents, readable } from "./palette.js";
import { KANTO } from "../data/kanto.js";

const pixels = (...groups) =>
  Uint8ClampedArray.from(groups.flatMap(([n, rgba]) => Array.from({ length: n }, () => rgba).flat()));

test("picks the dominant body colour and a second, different hue; skips outline/background", () => {
  const data = pixels(
    [500, [0, 0, 0, 0]], // transparent background
    [300, [16, 16, 16, 255]], // black outline
    [200, [49, 90, 123, 255]], // Snorlax blue
    [80, [230, 197, 172, 255]], // belly
    [60, [52, 95, 128, 255]] // blue shade, same hue as the first
  );
  const [a, b] = pickAccents(data);
  assert.ok(a[2] > a[0], "accent is blue");
  assert.ok(b[0] > b[2], "second accent is the warm belly, not another blue");
});

test("all-outline sprite gives null; dark colours are lifted to readable lightness", () => {
  assert.equal(pickAccents(pixels([10, [0, 0, 0, 255]])), null);
  const [r, g, b] = readable([40, 20, 80]);
  assert.ok((Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255 >= 0.59);
});

test("Kanto dex has 151 entries in order", () => {
  assert.equal(KANTO.length, 151);
  assert.equal(KANTO[24], "Pikachu");
  assert.equal(KANTO[142], "Snorlax");
  assert.equal(KANTO[150], "Mew");
});

test("searchDex finds by name, prefix first, and by number", async () => {
  const { searchDex } = await import("../data/kanto.js");
  const names = (q) => searchDex(q).map((p) => p.name);
  assert.deepEqual(names("pika"), ["Pikachu"]);
  assert.deepEqual(names("#025"), ["Pikachu"]);
  assert.equal(names("chu")[0], "Pikachu"); // Raichu also matches
  assert.deepEqual(names("nidoran"), ["Nidoran♀", "Nidoran♂"]);
  assert.deepEqual(names("mr mime"), ["Mr. Mime"]);
  assert.equal(names("char")[0], "Charmander");
  assert.equal(searchDex("").length, 151);
});
