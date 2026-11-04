import { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight, MdClose, MdSearch } from "react-icons/md";
import { KANTO, searchDex, spriteUrl } from "../data/kanto";
import { pickAccents } from "../lib/palette";

const THEME_KEY = "theme-dex";
const DEFAULT_ACCENTS = [
  [52, 211, 153],
  [34, 211, 238],
];
const hex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
const label = (dex) => `#${String(dex).padStart(3, "0")} ${KANTO[dex - 1]}`;

function applyAccents([a, b]) {
  const { style } = document.documentElement;
  style.setProperty("--accent", a.join(" "));
  style.setProperty("--accent-2", b.join(" "));
}

function savedDex() {
  try {
    const n = Number(localStorage.getItem(THEME_KEY));
    return Number.isInteger(n) && n >= 0 && n <= KANTO.length ? n : 0;
  } catch {
    return 0;
  }
}

// Load the sprite, pull two accents from its pixels, apply them as the site theme.
function useDexTheme(dex) {
  const [accents, setAccents] = useState(DEFAULT_ACCENTS);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, String(dex));
    } catch {
      /* storage blocked: theme just won't be remembered */
    }
    setFailed(false);
    const use = (picked) => {
      setAccents(picked);
      applyAccents(picked);
    };
    if (!dex) return use(DEFAULT_ACCENTS);

    let live = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!live) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const picked = pickAccents(ctx.getImageData(0, 0, img.width, img.height).data);
        picked ? use(picked) : setFailed(true);
      } catch {
        setFailed(true); // tainted canvas if the CDN ever drops CORS
      }
    };
    img.onerror = () => live && setFailed(true);
    img.src = spriteUrl(dex);
    return () => {
      live = false;
    };
  }, [dex]);

  return { accents, failed };
}

export default function ThemePicker() {
  const [dex, setDex] = useState(savedDex);
  const { accents, failed } = useDexTheme(dex);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef(null);

  const matches = searchDex(query);

  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (n) => {
    setDex(n);
    setOpen(false);
    setQuery("");
  };
  const step = (d) => setDex((n) => (n + d + KANTO.length + 1) % (KANTO.length + 1));

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const d = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => Math.min(Math.max(a + d, 0), matches.length - 1));
    } else if (e.key === "Enter" && open && matches[active]) {
      e.preventDefault();
      choose(matches[active].dex);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  const iconBtn =
    "grid h-9 w-9 shrink-0 place-items-center rounded border border-slate-800 bg-slate-950/70 text-slate-400 hover:border-accent2 hover:text-accent2";

  return (
    <div className="flex w-full flex-col gap-1.5 md:w-auto md:items-end">
      <span className="text-[10px] uppercase tracking-widest text-slate-500">Theme · Gen 1 Pokémon</span>
      <div className="flex w-full items-center gap-2 md:w-auto">
        <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded border border-slate-800 bg-slate-950/70">
          {dex ? (
            <img src={spriteUrl(dex)} alt="" width="36" height="36" className="pixelated scale-125" />
          ) : (
            <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--accent)/0.8)]" />
          )}
        </div>

        <div className="relative min-w-0 flex-1 md:w-64 md:flex-none">
          <MdSearch aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            role="combobox"
            aria-label="Search Gen 1 Pokémon by name or number"
            aria-expanded={open}
            aria-controls="dex-list"
            aria-activedescendant={open && matches[active] ? `dex-${matches[active].dex}` : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder={dex ? label(dex) : "Search Pokémon or #"}
            value={open ? query : dex ? label(dex) : ""}
            onFocus={() => {
              setOpen(true);
              setActive(0);
            }}
            onBlur={() => setOpen(false)}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className="h-9 w-full rounded border border-slate-800 bg-slate-950 pl-8 pr-8 text-xs text-slate-200 placeholder:text-slate-500 focus:border-accent2 focus:outline-none"
          />
          {dex > 0 && !open && (
            <button
              type="button"
              onClick={() => choose(0)}
              aria-label="Reset to default theme"
              className="absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-slate-500 hover:text-accent2"
            >
              <MdClose aria-hidden />
            </button>
          )}

          {open && (
            <ul
              id="dex-list"
              role="listbox"
              ref={listRef}
              aria-label="Gen 1 Pokémon"
              className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded border border-slate-800 bg-slate-950/95 py-1 shadow-2xl backdrop-blur"
            >
              {matches.length === 0 && <li className="px-3 py-2 text-xs text-slate-500">No Gen 1 Pokémon matches “{query}”</li>}
              {matches.map((p, i) => (
                <li
                  key={p.dex}
                  id={`dex-${p.dex}`}
                  data-i={i}
                  role="option"
                  aria-selected={p.dex === dex}
                  // mousedown + preventDefault so the input's blur doesn't close the list before the click lands
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(p.dex);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center gap-2 px-2 py-1 text-xs ${
                    i === active ? "bg-slate-800/80 text-slate-100" : "text-slate-300"
                  }`}
                >
                  <img src={spriteUrl(p.dex)} alt="" width="28" height="28" loading="lazy" className="pixelated" />
                  <span className="w-9 tabular-nums text-slate-500">#{String(p.dex).padStart(3, "0")}</span>
                  <span className="flex-1">{p.name}</span>
                  {p.dex === dex && <span className="text-accent">●</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-1">
          <button type="button" className={iconBtn} onClick={() => step(-1)} aria-label="Previous Pokémon">
            <MdChevronLeft aria-hidden />
          </button>
          <button type="button" className={iconBtn} onClick={() => step(1)} aria-label="Next Pokémon">
            <MdChevronRight aria-hidden />
          </button>
        </div>
      </div>

      <span className="flex items-center gap-2 text-[10px] text-slate-500" aria-live="polite">
        {accents.map((rgb, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm border border-slate-700" style={{ background: hex(rgb) }} />
            {hex(rgb)}
          </span>
        ))}
        {failed && <span>· sprite unavailable, theme unchanged</span>}
      </span>
    </div>
  );
}
