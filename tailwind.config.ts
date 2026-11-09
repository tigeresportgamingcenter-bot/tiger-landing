import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: "#0a0612",
        panel: "#150f22",
        paper: "#f3effc",
        accent: "#b44dff",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "sans-serif"],
        display: ["var(--font-archivo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
