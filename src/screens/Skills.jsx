import { useEffect, useState } from "react";
import PixelFrame from "../components/PixelFrame";
import { skills } from "../data/profile";
import { sfx } from "../game/sound";

const LOGOS = import.meta.glob("../assets/*.png", { eager: true, import: "default" });
let celebrated = false; // the level-up fanfare plays once per visit

export default function Skills() {
  const [filled, setFilled] = useState(false);
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilled(true);
      if (celebrated) return;
      celebrated = true;
      setLevelUp(true);
      sfx.levelUp();
      setTimeout(() => setLevelUp(false), 2400);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative">
      <PixelFrame title="Stats">
        <ul className="space-y-3">
          {skills.map((s, i) => {
            const logo = s.logo && LOGOS[`../assets/${s.logo}`];
            return (
              <li key={s.name} className="grid grid-cols-[2rem,1fr] items-center gap-3 sm:grid-cols-[2rem,11rem,1fr]">
                {logo ? (
                  <img src={logo} alt="" className="h-8 w-8 object-contain" />
                ) : (
                  <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded bg-ink text-[9px] text-white">
                    {s.name.slice(0, 2)}
                  </span>
                )}
                <span className="text-[10px] md:text-xs">{s.name}</span>
                <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                  <div
                    className="bar flex-1"
                    role="meter"
                    aria-label={s.name}
                    aria-valuenow={s.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="bar-fill bg-grass transition-[width] duration-700 ease-out"
                      style={{ width: filled ? `${s.level}%` : "0%", transitionDelay: `${i * 60}ms` }}
                    />
                  </div>
                  <span className="w-12 text-right text-[10px]">LV{s.level}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </PixelFrame>

      {levelUp && (
        <p role="status" className="level-up pixel-box fixed left-1/2 top-1/3 z-30 px-6 py-4 text-sm md:text-xl">
          LEVEL UP!
        </p>
      )}
    </div>
  );
}
