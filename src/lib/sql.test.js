import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenize } from "./sql.js";

test("tokens rejoin to the input and get the right types", () => {
  const sql = "-- plan\nSELECT e.role, 42 FROM t WHERE d IN ('SQL Mastery', 'it''s');";
  const tokens = tokenize(sql);
  assert.equal(tokens.map((t) => t.text).join(""), sql);
  const typeOf = (text) => tokens.find((t) => t.text === text)?.type;
  assert.equal(typeOf("-- plan"), "comment");
  assert.equal(typeOf("SELECT"), "keyword");
  assert.equal(typeOf("e.role"), "ident");
  assert.equal(typeOf("42"), "number");
  assert.equal(typeOf("'SQL Mastery'"), "string");
  assert.equal(typeOf("'it''s'"), "string");
});
