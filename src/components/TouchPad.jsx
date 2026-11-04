import { press, release } from "../game/input";

// On-screen D-pad + A/B for touch screens. Feeds the same input bus as the keyboard.
function Pad({ k, label, className, children }) {
  const up = () => release(k);
  return (
    <button
      type="button"
      aria-label={label}
      className={`touch-btn ${className}`}
      onPointerDown={(e) => {
        e.preventDefault();
        press(k);
      }}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

export default function TouchPad() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden select-none items-end justify-between p-4 [@media(pointer:coarse)]:flex">
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1">
        <Pad k="up" label="Up" className="col-start-2">▲</Pad>
        <Pad k="left" label="Left" className="col-start-1 row-start-2">◀</Pad>
        <Pad k="right" label="Right" className="col-start-3 row-start-2">▶</Pad>
        <Pad k="down" label="Down" className="col-start-2 row-start-3">▼</Pad>
      </div>
      <div className="pointer-events-auto flex gap-3 pb-2">
        <Pad k="b" label="B: menu" className="mt-6 rounded-full">B</Pad>
        <Pad k="a" label="A: talk or enter" className="rounded-full">A</Pad>
      </div>
    </div>
  );
}
