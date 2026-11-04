import { useEffect, useRef } from "react";
import { MdArrowBack, MdMenu } from "react-icons/md";
import { sections } from "../data/profile";
import { sfx } from "../game/sound";

// Inside a building: wooden floor, header with back/menu, the section's content.
export default function Room({ id, onBack, onMenu, children }) {
  const section = sections.find((s) => s.id === id);
  const heading = useRef(null);

  useEffect(() => {
    document.title = `${section.label} · Dorje Lama`;
    heading.current?.focus();
    return () => {
      document.title = "Dorje Lama";
    };
  }, [section]);

  return (
    <div className="room h-dvh overflow-y-auto">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 p-3">
        <button
          type="button"
          className="pixel-btn"
          onClick={() => {
            sfx.back();
            onBack();
          }}
        >
          <MdArrowBack aria-hidden="true" /> Town
        </button>
        <h1 ref={heading} tabIndex={-1} className="pixel-box px-3 py-2 text-[10px] outline-none md:text-sm">
          {section.place} · {section.label}
        </h1>
        <button type="button" className="pixel-btn" onClick={onMenu} aria-label="Menu">
          <MdMenu aria-hidden="true" />
        </button>
      </header>
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-2">{children}</div>
    </div>
  );
}
