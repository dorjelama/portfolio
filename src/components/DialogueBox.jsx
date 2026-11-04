import { useCallback, useEffect, useState } from "react";
import { onButton, reducedMotion } from "../game/input";
import { sfx } from "../game/sound";

// Typewriter dialogue. A / Enter / click finishes the line, then moves to the next one.
// Pass a new `key` to restart it with other lines.
export default function DialogueBox({ lines, onDone, className = "" }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const line = lines[index] ?? "";
  const typed = shown >= line.length;
  const last = index === lines.length - 1;

  useEffect(() => {
    if (typed) return;
    if (reducedMotion()) return setShown(line.length);
    const t = setTimeout(() => {
      setShown((n) => n + 1);
      if (shown % 3 === 0) sfx.text();
    }, 28);
    return () => clearTimeout(t);
  }, [shown, typed, line]);

  const advance = useCallback(() => {
    if (!typed) return setShown(line.length);
    if (!last) {
      sfx.blip();
      setIndex((i) => i + 1);
      setShown(0);
    } else if (onDone) {
      sfx.blip();
      onDone();
    }
  }, [typed, last, line, onDone]);

  useEffect(() => onButton((k) => k === "a" && advance()), [advance]);

  return (
    <button
      type="button"
      onClick={advance}
      className={`pixel-box relative block w-full p-4 pr-8 text-left text-[10px] leading-relaxed md:text-sm ${className}`}
    >
      <span className="sr-only" aria-live="polite">
        {line}
      </span>
      <span aria-hidden="true">{line.slice(0, shown)}</span>
      {typed && (!last || onDone) && (
        <span aria-hidden="true" className="blink absolute bottom-2 right-3 text-sea">
          ▼
        </span>
      )}
    </button>
  );
}
