// Pull two theme accents out of a sprite's RGBA pixels, then make them readable on a near-black page.

function toHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}

function toRgb([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r, g, b].map((v) => Math.round((v + m) * 255));
}

// Keep the hue, lift lightness (and colourful saturation) into a range that glows on #05080d.
export function readable(rgb) {
  const [h, s, l] = toHsl(rgb);
  return toRgb([h, s < 0.1 ? s : Math.max(s, 0.45), Math.min(Math.max(l, 0.6), 0.8)]);
}

const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

// data: Uint8ClampedArray from getImageData. Returns [accent, accent2] or null if the sprite is all outline.
export function pickAccents(data) {
  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // transparent background
    const key = ((data[i] >> 4) << 8) | ((data[i + 1] >> 4) << 4) | (data[i + 2] >> 4);
    const b = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    b.n++; b.r += data[i]; b.g += data[i + 1]; b.b += data[i + 2];
    buckets.set(key, b);
  }
  const colors = [...buckets.values()]
    .map(({ n, r, g, b }) => {
      const rgb = [r / n, g / n, b / n].map(Math.round);
      const [h, s, l] = toHsl(rgb);
      return { rgb, h, l, score: n * (0.3 + s) };
    })
    .filter((c) => c.l > 0.15 && c.l < 0.92) // drop black outlines and white highlights
    .sort((a, b) => b.score - a.score);
  if (!colors.length) return null;
  const second = colors.find((c) => hueGap(c.h, colors[0].h) >= 30) ?? colors[0];
  return [readable(colors[0].rgb), readable(second.rgb)];
}
