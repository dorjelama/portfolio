import { useState } from "react";
import { MdAccountBalance, MdFactCheck, MdHomeWork, MdLocalFlorist } from "react-icons/md";
import PixelFrame from "../components/PixelFrame";
import { projects } from "../data/profile";
import { arrowNav } from "../game/input";
import { sfx } from "../game/sound";

const ICONS = { MdAccountBalance, MdFactCheck, MdHomeWork, MdLocalFlorist };

export default function Projects() {
  const [selected, setSelected] = useState(0);
  const item = projects[selected];
  const Icon = ICONS[item.icon];

  const pick = (i) => {
    if (i !== selected) sfx.blip();
    setSelected(i);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[13rem,1fr]">
      <PixelFrame title="Bag">
        <ul data-arrow-nav onKeyDown={arrowNav} className="grid grid-cols-4 gap-2 md:grid-cols-2">
          {projects.map((p, i) => {
            const SlotIcon = ICONS[p.icon];
            return (
              <li key={p.name}>
                <button
                  type="button"
                  aria-label={p.name}
                  aria-pressed={i === selected}
                  onClick={() => pick(i)}
                  onFocus={() => pick(i)}
                  className="item-slot"
                >
                  <SlotIcon aria-hidden="true" className="h-7 w-7" />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[9px] opacity-70">Pick an item to inspect it.</p>
      </PixelFrame>

      <PixelFrame aria-live="polite">
        <div className="mb-3 flex items-center gap-3">
          <Icon aria-hidden="true" className="h-8 w-8 shrink-0 text-sea" />
          <h2 className="text-xs md:text-sm">{item.name}</h2>
        </div>
        <p className="text-[10px] leading-relaxed md:text-xs">{item.text}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
          {item.stack.map((s) => (
            <li key={s} className="badge bg-sky text-white">
              {s}
            </li>
          ))}
        </ul>
      </PixelFrame>
    </div>
  );
}
