import { useEffect, useRef } from "react";
import { arrowNav } from "../game/input";
import { sfx } from "../game/sound";
import { sections } from "../data/profile";
import CV from "../assets/Dorje Lama CV.pdf";

function Item({ onClick, children }) {
  return (
    <li>
      <button type="button" className="menu-item" onFocus={sfx.blip} onClick={onClick}>
        {children}
      </button>
    </li>
  );
}

export default function StartMenu({ onPick, onClose, sound, onToggleSound }) {
  const list = useRef(null);
  useEffect(() => list.current.querySelector("button")?.focus(), []);

  return (
    <div className="fixed inset-0 z-40 bg-ink/30" onClick={onClose}>
      <nav
        aria-label="Menu"
        className="pixel-box absolute right-3 top-3 w-60 p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <ul ref={list} data-arrow-nav onKeyDown={arrowNav} className="space-y-1">
          {sections.map((s) => (
            <Item key={s.id} onClick={() => onPick(s.id)}>
              {s.label}
            </Item>
          ))}
          <li>
            <a className="menu-item" href={CV} download onFocus={sfx.blip}>
              Résumé
            </a>
          </li>
          <Item onClick={onToggleSound}>Sound: {sound ? "On" : "Off"}</Item>
          <Item onClick={() => onPick("town")}>Town map</Item>
          <Item onClick={onClose}>Close</Item>
        </ul>
      </nav>
    </div>
  );
}
