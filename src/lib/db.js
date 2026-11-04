// In-browser PostgreSQL (PGlite) seeded with the CV from profile.js. Loaded lazily: it's a few MB of WASM.
import { MONTHS, jobs, projects, skills, sideQuests } from "../data/profile.js";

// "Mar 2024" -> "2024-03-01"; "Present" -> null (current role)
export function toDate(s) {
  const [m, y] = s.split(" ");
  const i = MONTHS.indexOf(m);
  return i < 0 ? null : `${y}-${String(i + 1).padStart(2, "0")}-01`;
}

const SCHEMA = `
CREATE TABLE jobs (
  id      int  PRIMARY KEY,
  role    text NOT NULL,
  org     text NOT NULL,
  place   text NOT NULL,
  started date NOT NULL,
  ended   date            -- NULL = current role
);
CREATE TABLE projects (
  id      int  PRIMARY KEY,
  name    text NOT NULL UNIQUE,
  summary text NOT NULL
);
CREATE TABLE project_stack (
  project_id int  REFERENCES projects (id),
  tech       text NOT NULL,
  PRIMARY KEY (project_id, tech)
);
CREATE TABLE skills (
  name  text PRIMARY KEY,
  level int  NOT NULL CHECK (level BETWEEN 0 AND 100)  -- self-rated
);
CREATE TABLE education (
  id      int  PRIMARY KEY,
  course  text NOT NULL,
  school  text NOT NULL,
  started int  NOT NULL,
  ended   int  NOT NULL
);
CREATE INDEX skills_level_idx ON skills (level DESC);
`;

async function seed(db) {
  await db.exec(SCHEMA);
  const insert = async (sql, rows) => {
    for (const r of rows) await db.query(sql, r);
  };
  await insert(
    "INSERT INTO jobs VALUES ($1, $2, $3, $4, $5, $6)",
    jobs.map((j, i) => [i + 1, j.role, j.org, j.place, toDate(j.from), toDate(j.to)])
  );
  await insert("INSERT INTO projects VALUES ($1, $2, $3)", projects.map((p, i) => [i + 1, p.name, p.text]));
  await insert("INSERT INTO project_stack VALUES ($1, $2)", projects.flatMap((p, i) => p.stack.map((t) => [i + 1, t])));
  await insert("INSERT INTO skills VALUES ($1, $2)", skills.map((s) => [s.name, s.level]));
  await insert(
    "INSERT INTO education VALUES ($1, $2, $3, $4, $5)",
    sideQuests.map((q, i) => [i + 1, q.role, q.org, Number(q.from), Number(q.to)])
  );
  await db.exec("ANALYZE"); // real statistics, so EXPLAIN estimates are sane
}

let dbPromise = null;

export function getDb() {
  dbPromise ??= (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const db = new PGlite();
    await seed(db);
    return db;
  })().catch((e) => {
    dbPromise = null; // let the next call retry
    throw e;
  });
  return dbPromise;
}

export async function resetDb() {
  const old = dbPromise;
  dbPromise = null;
  await (await old?.catch(() => null))?.close();
  return getDb();
}

// EXPLAIN ANALYZE executes the statement, so only read-only single statements get a plan.
const WRITES = /\b(insert|update|delete|merge|truncate|drop|alter|create|grant|revoke|copy|call|do|vacuum|set)\b/i;
export function explainable(sql) {
  const body = sql.replace(/--[^\n]*/g, "").trim().replace(/;\s*$/, "");
  return /^(select|with|values|table)\b/i.test(body) && !body.includes(";") && !WRITES.test(body);
}

export async function run(db, sql) {
  const t0 = performance.now();
  const results = await db.exec(sql);
  const ms = performance.now() - t0;
  const last = results.at(-1) ?? { rows: [], fields: [] };
  let plan = null;
  if (explainable(sql)) {
    const body = sql.trim().replace(/;\s*$/, "");
    const [{ rows }] = await db.exec(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)\n${body}`);
    plan = rows[0]["QUERY PLAN"][0];
  }
  return { fields: last.fields, rows: last.rows, affected: last.affectedRows, statements: results.length, ms, plan };
}

export async function schema(db) {
  const { rows } = await db.query(
    `SELECT table_name, column_name, data_type
     FROM information_schema.columns
     WHERE table_schema = 'public'
     ORDER BY table_name, ordinal_position`
  );
  const tables = new Map();
  for (const r of rows) {
    if (!tables.has(r.table_name)) tables.set(r.table_name, { name: r.table_name, columns: [] });
    tables.get(r.table_name).columns.push([r.column_name, r.data_type]);
  }
  for (const t of tables.values()) {
    const res = await db.query(`SELECT count(*)::int AS n FROM "${t.name.replaceAll('"', '""')}"`);
    t.rows = res.rows[0].n;
  }
  return [...tables.values()];
}

// Postgres JSON plan -> flat rows for the plan tree (same shape as the curated career plan).
const AGG = { Hashed: "HashAggregate", Sorted: "GroupAggregate", Plain: "Aggregate", Mixed: "MixedAggregate" };
const DETAILS = ["Index Cond", "Hash Cond", "Merge Cond", "Join Filter", "Filter", "Sort Key", "Group Key"];

export function planRows(plan) {
  const walk = (n, depth) => {
    const type = n["Node Type"] === "Aggregate" ? AGG[n.Strategy] ?? "Aggregate" : n["Node Type"];
    const rel = n["Relation Name"];
    const object = [
      n["Index Name"] && `using ${n["Index Name"]}`,
      rel && `on ${rel}${n.Alias && n.Alias !== rel ? ` ${n.Alias}` : ""}`,
    ]
      .filter(Boolean)
      .join(" ");
    const output = [
      `est ${n["Plan Rows"]}`,
      `${n["Actual Total Time"].toFixed(3)} ms`,
      n["Actual Loops"] > 1 && `loops ${n["Actual Loops"]}`,
      n["Rows Removed by Filter"] && `removed by filter ${n["Rows Removed by Filter"]}`,
      n["Shared Hit Blocks"] != null && `buffers hit ${n["Shared Hit Blocks"]}`,
    ].filter(Boolean);
    return [
      {
        depth,
        op: n["Join Type"] && n["Join Type"] !== "Inner" ? `${type} (${n["Join Type"]})` : type,
        object,
        rows: n["Actual Rows"],
        details: DETAILS.filter((k) => n[k]).map((k) => [k, [].concat(n[k]).join(", ")]),
        output,
      },
      ...(n.Plans ?? []).flatMap((c) => walk(c, depth + 1)),
    ];
  };
  return walk(plan.Plan, 0);
}

export const EXAMPLES = [
  {
    label: "Career timeline",
    sql: `-- Career timeline. Ctrl+Enter runs; then open Execution Plan.
SELECT role,
       org,
       to_char(started, 'Mon YYYY')                    AS started,
       coalesce(to_char(ended, 'Mon YYYY'), 'Present') AS ended,
       age(coalesce(ended, current_date), started)     AS tenure
FROM   jobs
ORDER  BY jobs.started DESC;`,
  },
  {
    label: "SQL mastery: skills ≥ 80",
    sql: `-- Strongest skills and how many shipped projects list them.
SELECT s.name,
       s.level,
       count(ps.project_id) AS projects
FROM   skills s
LEFT   JOIN project_stack ps ON ps.tech ILIKE '%' || s.name || '%'
WHERE  s.level >= 80
GROUP  BY s.name, s.level
ORDER  BY s.level DESC, projects DESC;`,
  },
  {
    label: "Stack frequency",
    sql: `-- Which technologies show up across projects.
SELECT ps.tech,
       count(*)                                   AS projects,
       string_agg(p.name, ', ' ORDER BY p.name)   AS used_in
FROM   project_stack ps
JOIN   projects p ON p.id = ps.project_id
GROUP  BY ps.tech
ORDER  BY projects DESC, ps.tech;`,
  },
  {
    label: "Years per employer (window)",
    sql: `-- Tenure per employer with a running total.
SELECT org,
       years,
       sum(years) OVER (ORDER BY started) AS running_total
FROM  (SELECT org, started,
              round((coalesce(ended, current_date) - started) / 365.25, 1) AS years
       FROM   jobs) t
ORDER  BY started;`,
  },
  {
    label: "Projects with stack",
    sql: `SELECT p.name,
       string_agg(ps.tech, ' · ' ORDER BY ps.tech) AS stack
FROM   projects p
JOIN   project_stack ps ON ps.project_id = p.id
GROUP  BY p.id
ORDER  BY p.name;`,
  },
  { label: "Education", sql: "SELECT * FROM education ORDER BY started DESC;" },
];
