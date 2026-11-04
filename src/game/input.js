// One input source for keyboard and the touch pad: held directions + A/B/START presses.
const held = [];
const listeners = new Set();

const KEYS = {
  ArrowUp: "up", w: "up", W: "up",
  ArrowDown: "down", s: "down", S: "down",
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
  Enter: "a", " ": "a", z: "a", Z: "a",
  Escape: "b", x: "b", X: "b", Backspace: "b",
  m: "start", M: "start",
};
const DIR_NAMES = ["up", "down", "left", "right"];

export function press(key) {
  if (DIR_NAMES.includes(key)) {
    if (!held.includes(key)) held.push(key);
  } else {
    listeners.forEach((fn) => fn(key));
  }
}

export function release(key) {
  const i = held.indexOf(key);
  if (i >= 0) held.splice(i, 1);
}

export const heldDir = () => held[held.length - 1] ?? null;

export const reducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// Arrow keys move focus between the buttons/links of a list (menus, item grids).
export function arrowNav(e) {
  const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
  if (!step) return;
  e.preventDefault();
  const items = [...e.currentTarget.querySelectorAll("button, a")];
  const i = items.indexOf(document.activeElement);
  items[(i + step + items.length) % items.length]?.focus();
}

export function onButton(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Buttons/links keep their own Enter/Space; arrow-navigated lists and fields keep their arrows.
const ownsKey = (el, key) =>
  el?.closest?.(
    key === "a"
      ? "button, a, input, textarea, select"
      : DIR_NAMES.includes(key)
        ? "[data-arrow-nav], input, textarea, select"
        : "input, textarea, select"
  );

export function bindKeyboard() {
  const down = (e) => {
    const key = KEYS[e.key];
    if (!key || e.ctrlKey || e.metaKey || e.altKey) return;
    if (ownsKey(e.target, key)) return;
    e.preventDefault();
    if (!e.repeat || DIR_NAMES.includes(key)) press(key);
  };
  const up = (e) => KEYS[e.key] && release(KEYS[e.key]);
  const clear = () => (held.length = 0);
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", clear);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", clear);
  };
}
