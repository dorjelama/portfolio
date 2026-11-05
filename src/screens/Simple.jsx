import { MotionConfig, motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdCode, MdCloudDownload, MdEmail, MdPlace, MdWork } from "react-icons/md";
import CV from "../assets/Dorje Lama CV.pdf";
import photo from "../assets/ProfilePicClear.jpg";
import { career, jobs, profile, projects, sideQuests, skills, tenure } from "../data/profile";
import ThemePicker from "../components/ThemePicker";

// Plain-English version of the same profile.js data, for readers who don't write software.

const shortOrg = (org) => org.replace(/ Pvt\. Ltd\.$/, "");

const GROUPS = [
  {
    title: "Behind the scenes",
    plain: "The engine of an app: storing data, applying business rules, talking to other systems.",
    names: ["C#", ".NET / ASP.NET Core", "ASP.NET MVC", "Web API", "ADO.NET", "IIS"],
  },
  {
    title: "What people see and click",
    plain: "The pages, forms and buttons that people actually use.",
    names: ["JavaScript", "jQuery", "React", "Tailwind CSS"],
  },
  {
    title: "Data",
    plain: "Designing databases so business records stay organised, fast and safe.",
    names: ["MS SQL"],
  },
  {
    title: "Quality and teamwork",
    plain: "Automatic checks that catch mistakes, and tools for working in a team.",
    names: ["NUnit", "Git"],
  },
];
// Anything added to profile.js later still shows up.
const grouped = new Set(GROUPS.flatMap((g) => g.names));
const leftovers = skills.filter((s) => !grouped.has(s.name)).map((s) => s.name);
const SKILL_GROUPS = [...GROUPS, ...(leftovers.length ? [{ title: "Other", plain: "", names: leftovers }] : [])].map((g) => ({
  ...g,
  skills: g.names.map((n) => skills.find((s) => s.name === n)).filter(Boolean),
}));

const levelWord = (n) => (n >= 85 ? "Expert" : n >= 75 ? "Advanced" : "Comfortable");

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4 },
};

function Section({ id, title, intro, children }) {
  return (
    <motion.section {...fade} aria-labelledby={id} className="scroll-mt-6">
      <h2 id={id} className="text-xl font-semibold text-slate-100 md:text-2xl">
        {title}
      </h2>
      {intro && <p className="mt-1 text-sm text-slate-400 md:text-base">{intro}</p>}
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

const card = "rounded-2xl border border-slate-800 bg-slate-900/50 p-5";

export default function Simple({ onSwitch }) {
  const { lv } = career();
  const contact = [
    { href: `mailto:${profile.links.email}`, label: "Email me", Icon: MdEmail, primary: true },
    { href: profile.links.linkedin, label: "LinkedIn", Icon: FaLinkedin },
    { href: profile.links.github, label: "GitHub", Icon: FaGithub },
    { href: CV, label: "Download résumé (PDF)", Icon: MdCloudDownload, download: "Dorje Lama CV.pdf" },
  ];
  const facts = [
    [`${lv}+ years`, "building software"],
    [jobs.length, "companies"],
    [projects.length, "major systems shipped"],
    ["BSc. CSIT", "computer science degree"],
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-[#05080d] font-sans text-slate-300">
        <div className="mx-auto flex max-w-4xl flex-col gap-14 px-4 py-6 md:gap-20 md:py-10">
          <header className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-200">{profile.name}</span>
            <button
              type="button"
              onClick={() => onSwitch("technical")}
              title="Switch to the technical version with a live SQL playground"
              className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-accent2 hover:text-accent2"
            >
              <MdCode aria-hidden /> Engineer view
            </button>
          </header>

          {/* Hero */}
          <motion.section {...fade} className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <img
              src={photo}
              alt={`Portrait of ${profile.name}`}
              width="160"
              height="160"
              className="h-32 w-32 shrink-0 rounded-full border-2 border-accent object-cover shadow-[0_0_30px_rgb(var(--accent)/0.35)] md:h-40 md:w-40"
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-50 md:text-4xl">Hi, I’m Dorje.</h1>
              <p className="mt-3 text-base leading-relaxed text-slate-300 md:text-lg">
                I’m a <strong className="text-accent">{profile.title}</strong> at {profile.guild} in {profile.home}. For{" "}
                {lv}+ years I’ve built business software: systems for financial institutions, Ayurvedic healthcare, real estate and collateral inspections.
              </p>
              <p className="mt-2 flex items-center justify-center gap-1 text-sm text-slate-500 md:justify-start">
                <MdPlace aria-hidden /> {profile.home}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                {contact.slice(0, 2).map(({ href, label, Icon, primary }) => (
                  <a
                    key={label}
                    href={href}
                    {...(href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                      primary ? "bg-accent text-slate-950 hover:opacity-90" : "border border-slate-700 text-slate-200 hover:border-accent2"
                    }`}
                  >
                    <Icon aria-hidden /> {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Quick facts */}
          <motion.dl {...fade} className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {facts.map(([value, label]) => (
              <div key={label} className={`${card} text-center`}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-2xl font-bold text-accent">{value}</dd>
                <dd className="mt-1 text-xs text-slate-400">{label}</dd>
              </div>
            ))}
          </motion.dl>

          <Section id="what-i-do" title="What I do, in plain words">
            <ul className="grid gap-3 md:grid-cols-3">
              {[
                ["Turn paperwork into software", "I take a business process, like an inspection or a bank transaction, and build the web app that runs it."],
                ["Keep data organised", "I design the databases underneath, so records are accurate, quick to find and safe."],
                ["Build the whole thing", "Both the behind-the-scenes engine and the screens people use."],
              ].map(([t, d]) => (
                <li key={t} className={card}>
                  <p className="font-semibold text-slate-100">{t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{d}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="experience" title="Where I’ve worked" intro="Most recent first.">
            <ol className="relative space-y-4 border-l border-slate-800 pl-6">
              {jobs.map((j) => (
                <li key={j.org} className="relative">
                  <span
                    aria-hidden
                    className={`absolute -left-[31px] top-5 h-3 w-3 rounded-full ${j.to === "Present" ? "bg-accent shadow-[0_0_10px_rgb(var(--accent)/0.8)]" : "bg-slate-600"}`}
                  />
                  <div className={card}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-slate-100">{j.role}</p>
                      {j.to === "Present" && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">Current job</span>
                      )}
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-300">
                      <MdWork aria-hidden className="text-slate-500" /> {shortOrg(j.org)} · {j.place}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {j.from} to {j.to} · {tenure(j.from, j.to)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="projects" title="Things I’ve built" intro="The main systems from my CV.">
            <ul className="grid gap-4 md:grid-cols-2">
              {projects.map((p) => (
                <li key={p.name} className={`${card} flex flex-col`}>
                  <p className="font-semibold text-slate-100">{p.name}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{p.text}</p>
                  <p className="mt-3 text-[11px] text-slate-500">Built with: {p.stack.join(", ")}</p>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-semibold text-sky-400 underline">
                      Play it<span className="sr-only"> {p.name} (opens in a new tab)</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="skills" title="Skills" intro="Grouped by what they’re for. Levels are my own rating.">
            <div className="grid gap-4 md:grid-cols-2">
              {SKILL_GROUPS.map((g) => (
                <div key={g.title} className={card}>
                  <p className="font-semibold text-slate-100">{g.title}</p>
                  {g.plain && <p className="mt-1 text-sm text-slate-400">{g.plain}</p>}
                  <ul className="mt-4 space-y-2.5">
                    {g.skills.map((s) => (
                      <li key={s.name}>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-200">{s.name}</span>
                          <span className="text-xs text-slate-500">{levelWord(s.level)}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800" aria-hidden>
                          <div className="h-full rounded-full bg-accent2" style={{ width: `${s.level}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="education" title="Education">
            <ul className="grid gap-3 md:grid-cols-3">
              {sideQuests.map((q) => (
                <li key={q.role} className={card}>
                  <p className="font-semibold text-slate-100">{q.role}</p>
                  <p className="mt-1 text-sm text-slate-400">{q.org}</p>
                  <p className="mt-1 text-xs text-slate-500">{q.from === q.to ? q.from : `${q.from} to ${q.to}`}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="contact" title="Let’s talk" intro="The quickest way to reach me is email.">
            <div className="flex flex-wrap gap-3">
              {contact.map(({ href, label, Icon, download, primary }) => (
                <a
                  key={label}
                  href={href}
                  download={download}
                  {...(href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium ${
                    primary ? "bg-accent text-slate-950 hover:opacity-90" : "border border-slate-700 text-slate-200 hover:border-accent2"
                  }`}
                >
                  <Icon aria-hidden /> {label}
                </a>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-500">{profile.links.email}</p>
          </Section>

          <footer className="flex flex-col gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row md:items-start md:justify-between">
            <div>
              <p>Want the technical version? It has a live SQL playground.</p>
              <button type="button" onClick={() => onSwitch("technical")} className="mt-1 text-accent2 hover:underline">
                Switch to engineer view →
              </button>
            </div>
            <ThemePicker />
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}
