import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — warm off-white base, deep charcoal text, orange accent
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // primary orange
          600: "#ea6c0a",
          700: "#c2550a",
          800: "#9a3f0b",
          900: "#7c3009",
        },
        surface: {
          DEFAULT: "#fafaf9", // off-white page bg
          card:    "#ffffff",
          muted:   "#f5f5f4",
        },
        ink: {
          DEFAULT: "#1c1917", // near-black body text
          muted:   "#78716c", // stone-500 supporting text
          faint:   "#d6d3d1", // dividers
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
