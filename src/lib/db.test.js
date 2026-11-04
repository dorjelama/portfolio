import { test } from "node:test";
import assert from "node:assert/strict";
import { EXAMPLES, explainable, getDb, planRows, resetDb, run, schema, toDate } from "./db.js";
import { jobs, projects, skills } from "../data/profile.js";

test("toDate parses CV month strings", () => {
  assert.equal(toDate("Mar 2024"), "2024-03-01");
  assert.equal(toDate("Present"), null);
});

test("explainable: only single read-only statements", () => {
  assert.ok(explainable("-- c\nSELECT 1;"));
  assert.ok(explainable("WITH x AS (SELECT 1) SELECT * FROM x"));
  assert.ok(!explainable("SELECT 1; SELECT 2;"));
  assert.ok(!explainable("INSERT INTO skills VALUES ('Go', 10)"));
  assert.ok(!explainable("WITH d AS (DELETE FROM skills RETURNING *) SELECT * FROM d"));
});

test("seeds the CV into real Postgres; examples run; plans are real", { timeout: 60_000 }, async () => {
  const db = await getDb();

  const tables = await schema(db);
  const count = Object.fromEntries(tables.map((t) => [t.name, t.rows]));
  assert.equal(count.jobs, jobs.length);
  assert.equal(count.projects, projects.length);
  assert.equal(count.skills, skills.length);

  for (const ex of EXAMPLES) {
    const r = await run(db, ex.sql);
    assert.ok(r.rows.length > 0, ex.label);
    assert.ok(r.plan, `${ex.label} has a plan`);
  }

  const r = await run(db, "SELECT name FROM skills WHERE level >= 85 ORDER BY level DESC;");
  assert.equal(r.rows.length, skills.filter((s) => s.level >= 85).length);
  assert.ok(r.plan["Execution Time"] >= 0);
  const rows = planRows(r.plan);
  assert.equal(rows[0].depth, 0);
  assert.ok(rows.every((n) => typeof n.op === "string" && Number.isFinite(n.rows)));

  const ins = await run(db, "INSERT INTO skills VALUES ('Go', 10);");
  assert.equal(ins.plan, null);
  assert.equal(ins.affected, 1);

  const fresh = await resetDb();
  assert.equal((await fresh.query("SELECT count(*)::int AS n FROM skills")).rows[0].n, skills.length);
  await fresh.close();
});
