import { useEffect, useRef, useState } from "react";
import { MdMenu, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import DialogueBox from "../components/DialogueBox";
import TouchPad from "../components/TouchPad";
import { BUILDINGS, SIGNS, COLS, HEIGHT, ROWS, TILE, START, DIRS, isWalkable, doorAt, interactAt } from "../game/map";
import { PLAYER, TREE, toCanvas } from "../game/sprites";
import { heldDir, onButton, reducedMotion } from "../game/input";
import { sfx } from "../game/sound";
import { sections } from "../data/profile";

const W = COLS * TILE;
const H = HEIGHT * TILE;
const STEP_MS = 180;
const INK = "#1b1b2f";

const isTouch = () => typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
const welcomeLines = () => [
  "Welcome to DEV TOWN! This is where Dorje Lama keeps his story.",
  isTouch()
    ? "Walk with the pad. Tap A to talk, B for the menu."
    : "Walk with the arrow keys or WASD. Enter to talk, M or Esc for the menu.",
  "Walk into a door, or tap a roof, to go inside.",
];

// Kept outside React so the player is back at the same door after visiting a room.
let saved = null;
let welcomed = false;

// Coming back out of a room puts the player on the tile below its door.
function rememberDoor(section) {
  const { door } = BUILDINGS.find((b) => b.section === section);
  saved = { x: door.x, y: door.y + 1, dir: "down" };
  sfx.door();
}

// Same "random" pixels every time, so the grass never shimmers.
const noise = (x, y, i) => (x * 73 + y * 151 + i * 37) % 97;
const shade = (hex) =>
  "#" + hex.slice(1).match(/../g).map((h) => Math.round(parseInt(h, 16) * 0.75).toString(16).padStart(2, "0")).join("");

// Everything that never moves, painted once to an offscreen canvas.
function paintTown() {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  const px = (color, x, y, w = 1, h = 1) => {
    g.fillStyle = color;
    g.fillRect(x, y, w, h);
  };
  const box = (x, y, w, h, fill) => {
    px(INK, x, y, w, h);
    px(fill, x + 1, y + 1, w - 2, h - 2);
  };
  const flower = (x, y, color) => {
    px(color, x - 1, y);
    px(color, x + 1, y);
    px(color, x, y - 1);
    px(color, x, y + 1);
    px("#ffd84a", x, y);
  };
  const tree = toCanvas(TREE);

  ROWS.forEach((row, ty) =>
    [...row].forEach((ch, tx) => {
      const x = tx * TILE;
      const y = ty * TILE;
      if (ch === "W") return; // water is animated, drawn every frame
      if (ch === "s" || ch === "p") {
        px(ch === "s" ? "#f3e2a9" : "#e6cf8f", x, y, TILE, TILE);
        for (let i = 0; i < 4; i++)
          px(ch === "s" ? "#e0c98a" : "#cdb36f", x + (noise(tx, ty, i) % 15), y + (noise(ty, tx, i) % 15));
        return;
      }
      px("#6ccf4a", x, y, TILE, TILE);
      for (let i = 0; i < 3; i++) {
        const a = x + (noise(tx, ty, i) % 12) + 1;
        const b = y + (noise(ty, tx, i + 5) % 12) + 2;
        px("#4ea838", a, b, 1, 2);
        px("#4ea838", a + 2, b, 1, 2);
        px("#4ea838", a + 1, b + 1);
      }
      if (ch === "f") {
        flower(x + 4, y + 5, "#ffffff");
        flower(x + 11, y + 11, "#ff6b8a");
      }
      if (ch === "T") g.drawImage(tree, x, y);
    })
  );

  for (const b of BUILDINGS) {
    const x = b.x * TILE;
    const y = b.y * TILE;
    const w = b.w * TILE;
    px("rgba(0,0,0,0.25)", x + 6, y + 47, w - 6, 3);
    box(x + w - 20, y - 5, 9, 10, "#9a5a3a"); // chimney
    box(x + 4, y + 22, w - 8, 26, "#f4ead2"); // wall
    px("#d8c9a4", x + 5, y + 44, w - 10, 3);
    box(x, y + 1, w, 24, b.roof);
    for (let yy = y + 6; yy < y + 24; yy += 4) px(shade(b.roof), x + 1, yy, w - 2, 1);
    px("rgba(255,255,255,0.35)", x + 1, y + 2, w - 2, 1);
    for (const wx of [x + 12, x + w - 24]) {
      box(wx, y + 29, 12, 10, "#7fc4f0");
      px(INK, wx + 6, y + 29, 1, 10);
      px(INK, wx, y + 34, 12, 1);
      px("#d4ecff", wx + 2, y + 31, 2, 2);
    }
    const dx = b.door.x * TILE;
    box(dx + 3, y + 30, 10, 18, "#7a4a24");
    px("#5a3418", dx + 4, y + 31, 8, 1);
    px("#e0a43a", dx + 10, y + 39, 1, 2);
  }

  for (const s of SIGNS) {
    const x = s.x * TILE;
    const y = s.y * TILE;
    px("#5a3418", x + 7, y + 10, 2, 6);
    box(x + 1, y + 2, 14, 9, "#c9955a");
    px("#7a4a24", x + 4, y + 5, 8, 1);
    px("#7a4a24", x + 4, y + 7, 6, 1);
  }
  return c;
}

function paintWater(g, frame) {
  g.fillStyle = "#2a63d4";
  g.fillRect(0, 0, W, 32);
  g.fillStyle = "#3b7be0";
  g.fillRect(0, 20, W, 12);
  g.fillStyle = "#8fc0ff";
  for (let i = 0; i < 26; i++) g.fillRect((i * 53 + frame * (i % 2 ? 3 : 2)) % W, 3 + ((i * 7) % 26), 4, 1);
  g.fillStyle = "#ffffff";
  for (let x = 0; x < W; x += 8) g.fillRect(x + ((frame + x / 8) % 2) * 2, 31, 5, 1);
}

// "!" bubble over the player's head when there is something to talk to.
function paintBubble(g, x, y) {
  g.fillStyle = INK;
  g.fillRect(x + 4, y - 12, 9, 11);
  g.fillStyle = "#ffffff";
  g.fillRect(x + 5, y - 11, 7, 9);
  g.fillStyle = INK;
  g.fillRect(x + 8, y - 10, 1, 4);
  g.fillRect(x + 8, y - 5, 1, 1);
}

export default function Overworld({ onEnter, onMenu, paused, sound, onToggleSound }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(2);
  const [dialog, setDialog] = useState(() => (welcomed ? null : welcomeLines()));
  const [fading, setFading] = useState(false);

  // The game loop reads these without restarting.
  const live = useRef({});
  live.current = { dialog, paused, onEnter };

  useEffect(() => {
    welcomed = true;
  }, []);

  // Biggest whole-number zoom that fits; fractional only when the screen is tiny.
  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const s = Math.min(width / W, height / H);
      setScale(s >= 2 ? Math.floor(s) : Math.max(s, 0.5));
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const g = canvasRef.current.getContext("2d");
    g.imageSmoothingEnabled = false;
    const town = paintTown();
    const frames = Object.fromEntries(Object.entries(PLAYER).map(([dir, f]) => [dir, f.map(toCanvas)]));
    const still = reducedMotion();
    const p = { ...(saved ?? START), moving: false, t: 0, foot: 0, bumpAt: 0, busy: false };
    p.from = { x: p.x, y: p.y };

    const enter = (section) => {
      p.busy = true;
      rememberDoor(section);
      if (still) return live.current.onEnter(section);
      setFading(true);
      setTimeout(() => live.current.onEnter(section), 320);
    };

    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const { dialog: talking, paused: stopped } = live.current;

      if (p.moving) {
        p.t += dt;
        if (p.t >= STEP_MS) {
          p.moving = false;
          p.from = { x: p.x, y: p.y };
          const door = doorAt(p.x, p.y);
          if (door) enter(door.section);
        }
      }
      if (!p.moving && !p.busy && !talking && !stopped) {
        const dir = heldDir();
        if (dir) {
          p.dir = dir;
          const [dx, dy] = DIRS[dir];
          if (isWalkable(p.x + dx, p.y + dy)) {
            p.from = { x: p.x, y: p.y };
            p.x += dx;
            p.y += dy;
            p.moving = true;
            p.t = 0;
            p.foot ^= 1;
            sfx.step();
          } else if (now - p.bumpAt > 350) {
            p.bumpAt = now;
            sfx.bump();
          }
        }
      }

      g.drawImage(town, 0, 0);
      paintWater(g, still ? 0 : Math.floor(now / 350) % 8);
      const k = p.moving ? p.t / STEP_MS : 1;
      const x = Math.round((p.from.x + (p.x - p.from.x) * k) * TILE);
      const y = Math.round((p.from.y + (p.y - p.from.y) * k) * TILE) - 3;
      const frame = p.moving && k < 0.6 ? frames[p.dir][1 + p.foot] : frames[p.dir][0];
      g.drawImage(frame, x, y);
      if (!p.moving && !talking && interactAt(p.x, p.y, p.dir)) paintBubble(g, x, y);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const offButton = onButton((key) => {
      const { dialog: talking, paused: stopped } = live.current;
      if (key !== "a" || talking || stopped || p.moving || p.busy) return;
      const hit = interactAt(p.x, p.y, p.dir);
      if (hit?.type === "door") enter(hit.section);
      if (hit?.type === "sign") {
        sfx.confirm();
        setDialog(hit.lines);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      offButton();
    };
  }, []);

  const enterFromRoof = (section) => {
    rememberDoor(section);
    onEnter(section);
  };

  return (
    <div className="relative flex h-dvh flex-col bg-ink">
      <header className="flex items-center justify-between gap-2 p-3">
        <h1 className="pixel-box px-3 py-2 text-[10px] md:text-sm">Dev Town</h1>
        <div className="flex gap-2">
          <button type="button" className="pixel-btn" onClick={onToggleSound} aria-label={sound ? "Mute sound" : "Turn sound on"}>
            {sound ? <MdVolumeUp aria-hidden="true" /> : <MdVolumeOff aria-hidden="true" />}
          </button>
          <button type="button" className="pixel-btn" onClick={onMenu} aria-label="Menu">
            <MdMenu aria-hidden="true" /> <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </header>

      <div ref={wrapRef} className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2 [@media(pointer:coarse)]:pb-44">
        <div className="relative" style={{ width: W * scale, height: H * scale }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="pixelated block h-full w-full"
            role="img"
            aria-label="Dev Town: a pixel-art town by the sea with five buildings, About, Quest Log, Projects, Skills and Contact."
          />
          {BUILDINGS.map((b) => (
            <button
              key={b.section}
              type="button"
              onClick={() => enterFromRoof(b.section)}
              className="roof-label"
              style={{
                left: `${((b.x + b.w / 2) / COLS) * 100}%`,
                top: `${((b.y + 0.8) / HEIGHT) * 100}%`,
                fontSize: Math.max(8, 5.5 * scale),
              }}
            >
              {sections.find((s) => s.id === b.section).label}
            </button>
          ))}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-300 ${fading ? "opacity-100" : "opacity-0"}`}
          />
          {dialog && (
            <div className="absolute inset-x-2 bottom-2">
              <DialogueBox key={dialog[0]} lines={dialog} onDone={() => setDialog(null)} />
            </div>
          )}
        </div>
      </div>

      <p className="hidden pb-3 text-center text-[10px] text-white/70 md:block [@media(pointer:coarse)]:hidden">
        Arrows / WASD walk · Enter talk · M menu
      </p>
      <TouchPad />
    </div>
  );
}
