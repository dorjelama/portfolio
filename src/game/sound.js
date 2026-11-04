// 8-bit sound effects generated with Web Audio: no audio files. Off until the visitor turns it on.
const KEY = "portfolio:sound";
let ctx = null;
let on = false;
try {
  on = localStorage.getItem(KEY) === "on";
} catch {
  /* storage blocked: stay muted */
}

export const soundOn = () => on;

export function setSoundOn(value) {
  on = value;
  try {
    localStorage.setItem(KEY, value ? "on" : "off");
  } catch {
    /* not persisted, fine */
  }
}

function tone(freq, dur, { type = "square", at = 0, vol = 0.04 } = {}) {
  if (!on) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch {
    /* audio unavailable */
  }
}

export const sfx = {
  blip: () => tone(880, 0.05),
  confirm: () => {
    tone(660, 0.06);
    tone(990, 0.09, { at: 0.06 });
  },
  back: () => {
    tone(660, 0.06);
    tone(440, 0.09, { at: 0.06 });
  },
  step: () => tone(140, 0.03, { type: "triangle", vol: 0.03 }),
  bump: () => tone(80, 0.09),
  door: () => [392, 523, 659].forEach((f, i) => tone(f, 0.08, { at: i * 0.06 })),
  text: () => tone(1200, 0.015, { vol: 0.015 }),
  levelUp: () =>
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
      tone(f, i === 5 ? 0.3 : 0.1, { at: i * 0.09 })
    ),
};
