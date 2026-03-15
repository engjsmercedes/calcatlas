import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-soft": "rgb(var(--color-accent-soft) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-manrope)"],
        display: ["var(--font-space-grotesk)", "var(--font-manrope)"]
      },
      boxShadow: {
        card: "0 18px 50px -28px rgba(15, 23, 42, 0.18)",
        glow: "0 30px 80px -50px rgba(14, 116, 144, 0.32)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top left, rgba(14,165,233,.16), transparent 26%), radial-gradient(circle at top right, rgba(251,191,36,.18), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))"
      }
    }
  },
  plugins: []
};

export default config;
