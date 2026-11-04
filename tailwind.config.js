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
      },
    },
    fontFamily: {
      pokemon: ["Pokemon", "sans-serif"],
    },
  },
  plugins: [],
};
