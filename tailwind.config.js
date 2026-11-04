/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b1b2f",
        paper: "#fbfbf4",
        sky: "#2a8fd0",
        sea: { DEFAULT: "#2a63d4", light: "#6f9de0" },
        grass: { DEFAULT: "#6ccf4a", dark: "#2f7a2a" },
        gold: { DEFAULT: "#ffd84a", dark: "#b88a00" },
        roof: "#d94a3a",
        // Theme accents, set at runtime by the Pokémon theme picker (see src/index.css :root).
        accent: "rgb(var(--accent) / <alpha-value>)",
        accent2: "rgb(var(--accent-2) / <alpha-value>)",
      },
    },
    fontFamily: {
      pokemon: ["Pokemon", "sans-serif"],
      mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
    },
  },
  plugins: [],
};
