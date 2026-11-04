import { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdCloudDownload, MdEmail, MdPerson, MdPlayArrow, MdRefresh } from "react-icons/md";
import CV from "../assets/Dorje Lama CV.pdf";
import { career, jobs, profile, projects, skills, uptime } from "../data/profile";
import { EXAMPLES, getDb, planRows, resetDb, run, schema } from "../lib/db";
import SqlEditor from "../components/SqlEditor";
import ThemePicker from "../components/ThemePicker";

// Every value shown on the page comes from profile.js; the playground runs real PostgreSQL in the browser.

const shortOrg = (org) => org.replace(/ Pvt\. Ltd\.$/, "");
const topSkills = [...skills].sort((a, b) => b.level - a.level);

// Curated career overview drawn as a plan tree (not a real plan: those are in the Execution Plan tab).
const CAREER_PLAN = {
  op: "SELECT",
  object: "career",
  rows: 1,
  output: [profile.name, profile.title, shortOrg(jobs[0].org), profile.home],
  children: [
    {
      op: "Nested Loop",
      object: "on jobs",
      rows: jobs.length,
      output: [`${career().lv}+ years`, `${jobs.at(-1).from} → ${jobs[0].to}`],
      children: jobs.map((j) => ({
        op: "Index Scan",
        object: "using jobs_pkey on jobs",
        details: [["Index Cond", `org = '${shortOrg(j.org)}'`]],
        rows: 1,
        output: [j.role, `${j.from} → ${j.to}`, j.place],
      })),
    },
    {
      op: "HashAggregate",
      object: "database design",
      rows: 2,
      output: ["MS SQL Server", "schemas I designed"],
      children: [
        {
          op: "Index Scan",
          object: "using projects_name_key on projects",
          details: [["Index Cond", "name = 'Channakya Base'"]],
          rows: 1,
          output: ["queries · stored procedures · functions · views", "AJAX, no full-page post-backs"],
        },
        {
          op: "Index Scan",
          object: "using projects_name_key on projects",
          details: [["Index Cond", "name = 'Ayurbeda Information Management System'"]],
          rows: 1,
          output: ["SQL database design", "patient records · treatments · pharmacy inventory"],
        },
      ],
    },
    {
      op: "Seq Scan",
      object: "on projects",
      rows: projects.length,
      children: projects.map((p) => ({
        op: "Index Scan",
        object: "using project_stack_pkey on project_stack",
        details: [["Index Cond", `project = '${p.name}'`]],
        rows: p.stack.length,
        output: p.stack,
      })),
    },
    {
      op: "Sort",
      object: "on skills",
      details: [["Sort Key", "level DESC"]],
      rows: skills.length,
      output: ["levels are self-rated", "top 6 shown"],
      children: topSkills.slice(0, 6).map((s) => ({
        op: "Index Scan",
        object: "using skills_pkey on skills",
        details: [["Index Cond", `name = '${s.name}'`]],
        rows: 1,
        level: s.level,
      })),
    },
  ],
};

const flatten = (n, depth = 0) => [{ ...n, depth }, ...(n.children ?? []).flatMap((c) => flatten(c, depth + 1))];
const CAREER_ROWS = flatten(CAREER_PLAN);

const glow = {
  accent: "bg-accent shadow-[0_0_8px_2px_rgb(var(--accent)/0.65)]",
  accent2: "bg-accent2 shadow-[0_0_8px_2px_rgb(var(--accent-2)/0.65)]",
};

function Dot({ color = "accent" }) {
  return <span aria-hidden className={`inline-block h-2 w-2 shrink-0 animate-pulse rounded-full ${glow[color]}`} />;
}

// Hexagon + terminal prompt. Same shape as public/favicon.svg.
function Mark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M16 2 28 9v14l-12 7L4 23V9z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m10 12 5 4-5 4M17 21h6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}

// --- vitals: real figures, labelled like Postgres catalog views ------------

function VitalsBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const { lv, xp } = career(now);

  const tiles = [
    {
      label: "Server Uptime",
      source: "pg_postmaster_start_time()",
      value: uptime(now),
      note: `first role Sep 2017 · ${Math.round(xp * 100)}% of the way to ${lv + 1} yrs`,
      bar: xp * 100,
    },
    {
      label: "Employers",
      source: "pg_stat_activity",
      value: jobs.length,
      note: `active: ${shortOrg(jobs[0].org)} since ${jobs[0].from}`,
      color: "accent2",
    },
    {
      label: "Systems Shipped",
      source: "pg_database",
      value: projects.length,
      note: "finance · real estate · healthcare · inspections",
    },
    {
      label: "Skills Indexed",
      source: "pg_indexes",
      value: skills.length,
      note: `top: ${topSkills[0].name}, ${topSkills[1].name}`,
      color: "accent2",
    },
  ];

  return (
    <section aria-label="Engine vitals" className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="panel flex flex-col p-3">
          <span className="flex items-center gap-2 truncate text-[10px] uppercase tracking-widest text-slate-500">
            <Dot color={t.color} />
            {t.label}
          </span>
          <p
            className={`glow mt-2 font-semibold tabular-nums ${
              typeof t.value === "number" ? "text-2xl md:text-3xl" : "text-sm sm:text-base md:text-lg"
            } ${t.color === "accent2" ? "text-accent2" : "text-accent"}`}
          >
            {t.value}
          </p>
          <p className="mt-1 text-[10px] leading-4 text-slate-400">{t.note}</p>
          {t.bar != null && (
            <div className="mt-2 h-1 overflow-hidden rounded bg-slate-800">
              <div className="h-full bg-accent shadow-[0_0_6px_rgb(var(--accent)/0.8)]" style={{ width: `${t.bar}%` }} />
            </div>
          )}
          <p className="mt-auto pt-2 text-[9px] text-slate-600">{t.source}</p>
        </div>
      ))}
    </section>
  );
}

// --- plan tree row (shared by the curated career plan and real EXPLAIN output) --

function PlanRow({ row, i }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(i, 25) * 0.05, duration: 0.25 }}
      style={{ paddingLeft: row.depth * 18 }}
    >
      <div className={`py-1.5 ${row.depth ? "border-l border-slate-800 pl-3" : ""}`}>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-accent2">-&gt;</span>
          <span className="font-semibold text-accent">{row.op}</span>
          <span className="text-slate-500">{row.object}</span>
          <span className="ml-auto text-[10px] tabular-nums text-slate-400">actual rows={row.rows}</span>
        </div>
        <div className="space-y-1 pl-6">
          {row.details?.map(([k, v]) => (
            <p key={k} className="break-words text-[11px] text-slate-400">
              <span className="text-slate-600">{k}:</span> {v}
            </p>
          ))}
          {row.output && (
            <div className="flex flex-wrap gap-1.5">
              {row.output.map((m, j) => (
                <span key={j} className="rounded border border-slate-800 bg-slate-900/60 px-1.5 py-0.5 text-[10px] text-slate-300">
                  {m}
                </span>
              ))}
            </div>
          )}
          {row.level != null && (
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <div className="h-1 w-32 overflow-hidden rounded bg-slate-800">
                <motion.div
                  className="h-full bg-accent2 shadow-[0_0_6px_rgb(var(--accent-2)/0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${row.level}%` }}
                  transition={{ delay: Math.min(i, 25) * 0.05 + 0.2, duration: 0.6 }}
                />
              </div>
              level = {row.level}
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}

function Empty({ children }) {
  return <div className="grid h-full min-h-[16rem] place-items-center px-4 text-center text-[12px] text-slate-500">{children}</div>;
}

// --- result views -----------------------------------------------------------

const cell = (v) =>
  v === null || v === undefined ? (
    <span className="text-slate-600">NULL</span>
  ) : v instanceof Date ? (
    v.toISOString().slice(0, 10)
  ) : typeof v === "object" ? (
    JSON.stringify(v)
  ) : (
    String(v)
  );

const MAX_ROWS = 500;

function Results({ out }) {
  if (!out) return <Empty>Run a query (Ctrl+Enter) to see rows here.</Empty>;
  if (out.error)
    return (
      <pre className="whitespace-pre-wrap text-[12px] text-rose-400">
        ERROR: {out.error}
      </pre>
    );
  const { fields, rows, affected, statements, ms } = out.result;
  if (!fields.length)
    return (
      <p className="text-[12px] text-slate-300">
        <span className="text-accent">OK</span> · {affected ?? 0} row(s) affected · {statements} statement(s) · {ms.toFixed(1)} ms
      </p>
    );
  return (
    <div>
      <div className="overflow-x-auto rounded border border-slate-800">
        <table className="w-full text-left text-[12px]">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              {fields.map((f) => (
                <th key={f.name} scope="col" className="whitespace-nowrap px-2.5 py-1.5 font-semibold">
                  {f.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, MAX_ROWS).map((r, i) => (
              <tr key={i} className="border-t border-slate-800/70 hover:bg-slate-800/30">
                {fields.map((f) => (
                  <td key={f.name} className="whitespace-nowrap px-2.5 py-1.5 text-slate-200">
                    {cell(r[f.name])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        ({rows.length} row{rows.length === 1 ? "" : "s"}
        {rows.length > MAX_ROWS ? `, first ${MAX_ROWS} shown` : ""}) · {ms.toFixed(1)} ms
      </p>
    </div>
  );
}

function ExecutionPlan({ out }) {
  const plan = out?.result?.plan;
  if (!out || out.error) return <Empty>Run a SELECT to see its real execution plan.</Empty>;
  if (!plan)
    return (
      <Empty>
        No plan for this statement. EXPLAIN ANALYZE executes the query, so it only runs for a single read-only SELECT;
        writes never run twice.
      </Empty>
    );
  return (
    <div>
      <ol>
        {planRows(plan).map((row, i) => (
          <PlanRow key={i} row={row} i={i} />
        ))}
      </ol>
      <p className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-500">
        Planning Time: {plan["Planning Time"].toFixed(3)} ms · Execution Time: {plan["Execution Time"].toFixed(3)} ms ·
        EXPLAIN (ANALYZE, BUFFERS)
      </p>
    </div>
  );
}

function Tables({ db, tables, onConnect, onQuery }) {
  if (db.state !== "ready")
    return (
      <Empty>
        <span>
          {db.state === "loading" ? "Starting PostgreSQL…" : "PostgreSQL loads in your browser on first use."}
          <br />
          {db.state !== "loading" && (
            <button type="button" onClick={onConnect} className="mt-3 rounded border border-accent2 px-3 py-1.5 text-accent2 hover:bg-accent2/10">
              Start database
            </button>
          )}
        </span>
      </Empty>
    );
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tables.map((t) => (
        <div key={t.name} className="rounded border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between border-b border-slate-800 px-2.5 py-1.5">
            <span className="font-semibold text-accent">{t.name}</span>
            <span className="text-[10px] text-slate-500">{t.rows} rows</span>
          </div>
          <ul className="px-2.5 py-1.5 text-[11px]">
            {t.columns.map(([name, type]) => (
              <li key={name} className="flex justify-between gap-3">
                <span className="text-slate-200">{name}</span>
                <span className="text-slate-500">{type}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onQuery(`SELECT * FROM ${t.name} LIMIT 100;`)}
            className="w-full border-t border-slate-800 px-2.5 py-1.5 text-left text-[11px] text-accent2 hover:bg-slate-800/40"
          >
            SELECT * FROM {t.name} →
          </button>
        </div>
      ))}
    </div>
  );
}

// --- playground workspace ---------------------------------------------------

const TABS = ["Career Plan", "Results", "Execution Plan", "Tables"];

function Workspace() {
  const [sql, setSql] = useState(EXAMPLES[0].sql);
  const [db, setDb] = useState({ state: "idle" }); // idle | loading | ready | error
  const [tables, setTables] = useState([]);
  const [out, setOut] = useState(null); // { result } | { error }
  const [tab, setTab] = useState("Career Plan");
  const [busy, setBusy] = useState(false);
  const [runs, setRuns] = useState(0);

  // PGlite is a few MB, so it starts on first interaction, not on page load.
  const connect = async (fresh = false) => {
    if (!fresh && db.state === "ready") return getDb();
    setDb({ state: "loading" });
    try {
      const conn = await (fresh ? resetDb() : getDb());
      const { rows } = await conn.query("SHOW server_version");
      setTables(await schema(conn));
      setDb({ state: "ready", version: rows[0].server_version });
      return conn;
    } catch (e) {
      setDb({ state: "error", message: e.message });
      return null;
    }
  };

  const execute = async (text = sql) => {
    if (busy) return;
    setBusy(true);
    setSql(text);
    try {
      const conn = await connect();
      if (!conn) return;
      try {
        setOut({ result: await run(conn, text) });
      } catch (e) {
        setOut({ error: e.message });
      }
      setTab((t) => (t === "Execution Plan" ? t : "Results"));
      setTables(await schema(conn)); // DDL/DML may have changed tables or counts
      setRuns((r) => r + 1);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setOut(null);
    await connect(true);
  };

  const engine =
    db.state === "ready"
      ? `PostgreSQL ${db.version} · in-browser`
      : db.state === "loading"
        ? "starting PostgreSQL…"
        : db.state === "error"
          ? "PostgreSQL failed to load"
          : "PostgreSQL · loads on first run";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section aria-label="SQL playground" className="panel flex flex-col">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded-t border-b-2 border-accent2 px-2 py-1 text-slate-200">query.sql</span>
            <label className="sr-only" htmlFor="examples">
              Example queries
            </label>
            <select
              id="examples"
              value=""
              onChange={(e) => e.target.value && execute(EXAMPLES[Number(e.target.value)].sql)}
              className="h-7 max-w-[11rem] rounded border border-slate-800 bg-slate-950 px-1.5 text-[11px] text-slate-300 focus:border-accent2"
            >
              <option value="">Examples…</option>
              {EXAMPLES.map((ex, i) => (
                <option key={ex.label} value={i}>
                  {ex.label}
                </option>
              ))}
            </select>
          </div>
          <span className="flex items-center gap-2 text-[11px] text-slate-500">
            {db.state === "ready" && <Dot />}
            {db.state === "loading" && <Dot color="accent2" />}
            {engine}
          </span>
        </header>

        <SqlEditor value={sql} onChange={setSql} onRun={() => execute()} onFocus={() => connect()} />

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-3 py-3">
          <span className="text-[11px] text-slate-500">
            {db.state === "error" ? `✗ ${db.message}` : "Ctrl+Enter to run"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              disabled={busy || db.state !== "ready"}
              className="flex items-center gap-1 rounded border border-slate-800 px-2.5 py-2 text-[11px] text-slate-400 hover:border-accent2 hover:text-accent2 disabled:opacity-40"
            >
              <MdRefresh aria-hidden /> Reset DB
            </button>
            <motion.button
              type="button"
              onClick={() => execute()}
              disabled={busy}
              whileTap={{ scale: 0.97 }}
              className={`${runs === 0 && !busy ? "pulse-glow" : ""} flex items-center gap-2 rounded border border-accent bg-accent/10 px-4 py-2 text-xs font-semibold tracking-widest text-accent transition-colors hover:bg-accent/20 disabled:cursor-wait disabled:opacity-60`}
            >
              <MdPlayArrow aria-hidden className="text-base" />
              {busy ? (db.state === "loading" ? "STARTING POSTGRES…" : "RUNNING…") : "RUN EXPLAIN ANALYZE"}
            </motion.button>
          </div>
        </footer>
      </section>

      {/* lg:h-0 + min-h-full: the editor sets the row height, the output scrolls inside it. */}
      <section aria-label="Query output" className="panel flex min-h-[24rem] flex-col lg:h-0 lg:min-h-full">
        <div role="tablist" aria-label="Output" className="flex overflow-x-auto border-b border-slate-800 text-xs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => {
                setTab(t);
                if (t === "Tables") connect();
              }}
              className={`whitespace-nowrap border-b-2 px-3 py-2 ${
                tab === t ? "border-accent2 text-slate-100" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div role="tabpanel" aria-live="polite" className="flex-1 overflow-y-auto p-3 text-[12px] md:text-[13px]">
          {tab === "Career Plan" && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-slate-600">Curated from CV · real plans are in Execution Plan</p>
              <ol>
                {CAREER_ROWS.map((row, i) => (
                  <PlanRow key={i} row={row} i={i} />
                ))}
              </ol>
            </div>
          )}
          {tab === "Results" && <Results out={out} />}
          {tab === "Execution Plan" && <ExecutionPlan key={runs} out={out} />}
          {tab === "Tables" && <Tables db={db} tables={tables} onConnect={() => connect()} onQuery={execute} />}
        </div>
      </section>
    </div>
  );
}

// --- page ----------------------------------------------------------------

const LINKS = [
  { href: `mailto:${profile.links.email}`, label: "Email", Icon: MdEmail },
  { href: profile.links.linkedin, label: "LinkedIn", Icon: FaLinkedin },
  { href: profile.links.github, label: "GitHub", Icon: FaGithub },
  { href: CV, label: "Résumé", Icon: MdCloudDownload, download: "Dorje Lama CV.pdf" },
];

export default function Diagnostics({ onSwitch }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="terminal-grid min-h-dvh font-mono text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:py-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Mark className="h-9 w-9 text-accent drop-shadow-[0_0_6px_rgb(var(--accent)/0.6)]" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold tracking-[0.35em] text-slate-100">ENGINE DIAGNOSTICS</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">PostgreSQL · career database</p>
                </div>
              </div>
              <h1 className="glow mt-4 text-2xl font-semibold text-slate-100 md:text-3xl">{profile.name}</h1>
              <p className="mt-1 text-sm text-slate-400">
                {profile.title} <span className="text-accent2">(.NET)</span> · {profile.guild} · {profile.home}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <ThemePicker />
              <nav aria-label="Contact" className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onSwitch("simple")}
                  title="A plain-English version of this page, no tech knowledge needed"
                  className="flex items-center gap-1.5 rounded border border-accent bg-accent/10 px-2.5 py-1.5 text-xs text-accent transition-colors hover:bg-accent/20"
                >
                  <MdPerson aria-hidden /> Simple view
                </button>
                {LINKS.map(({ href, label, Icon, download }) => (
                  <a
                    key={label}
                    href={href}
                    download={download}
                    {...(href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
                    className="flex items-center gap-1.5 rounded border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-accent2 hover:text-accent2"
                  >
                    <Icon aria-hidden /> {label}
                  </a>
                ))}
              </nav>
            </div>
          </header>

          <VitalsBar />
          <Workspace />

          <footer className="flex flex-col gap-1 border-t border-slate-800 pt-3 text-[10px] text-slate-600 sm:flex-row sm:justify-between">
            <span className="uppercase tracking-widest">MS SQL Server · .NET · ASP.NET Core · React</span>
            <span>
              Playground: PostgreSQL via PGlite, runs in your browser. Theme colours from PokéAPI sprites. Pokémon © Nintendo, Game
              Freak, The Pokémon Company; not affiliated.
            </span>
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}
