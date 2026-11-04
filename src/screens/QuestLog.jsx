import PixelFrame from "../components/PixelFrame";
import { jobs, sideQuests } from "../data/profile";

function Quest({ q }) {
  const active = q.to === "Present";
  return (
    <li className="flex gap-3">
      <span aria-hidden="true" className={`mt-0.5 text-sm ${active ? "text-gold-dark" : "text-grass-dark"}`}>
        {active ? "★" : "✓"}
      </span>
      <div className="min-w-0 space-y-1">
        <p className="text-[11px] md:text-sm">{q.role}</p>
        <p className="text-[10px] opacity-80 md:text-xs">
          {q.org}
          {q.place && ` · ${q.place}`}
        </p>
        <p className="text-[10px] md:text-xs">
          {q.from === q.to ? q.from : `${q.from} – ${q.to}`}{" "}
          <span className={`badge ${active ? "bg-gold" : "bg-grass"}`}>{active ? "Active" : "Clear"}</span>
        </p>
      </div>
    </li>
  );
}

export default function QuestLog() {
  return (
    <div className="space-y-4">
      <PixelFrame title="Main quests: work">
        <ol className="space-y-5">
          {jobs.map((q) => (
            <Quest key={q.org} q={q} />
          ))}
        </ol>
      </PixelFrame>
      <PixelFrame title="Side quests: training">
        <ol className="space-y-5">
          {sideQuests.map((q) => (
            <Quest key={q.org} q={q} />
          ))}
        </ol>
      </PixelFrame>
    </div>
  );
}
