import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tiger: {
          red: "#ef2b23",
          orange: "#ff6a00",
          black: "#070707",
        },
      },
      boxShadow: {
        glow: "0 0 38px rgba(255, 74, 0, 0.22)",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "sans-serif"],
        display: ["var(--font-orbitron)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
