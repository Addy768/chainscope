/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // ChainScope "analyst console" palette — deliberately not SDG-green
      colors: {
        canvas: "#0b0f14",
        panel: "#111820",
        border: "#1e2a36",
        ink: "#e6edf3",
        muted: "#8b98a5",
        accent: "#7c5cff", // violet — signature ML/data-viz color
        good: "#2ee6a6",
        warn: "#ffb454",
        bad: "#ff6b6b",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
