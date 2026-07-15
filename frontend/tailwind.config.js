/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#07090c",
        panel:  "#0f1520",
        panel2: "#131a26",
        border: "#1e2a3c",
        ink:    "#e6edf3",
        muted:  "#8b98a5",
        accent: "#7c5cff",
        accent2:"#22d3ee",
        good:   "#2ee6a6",
        warn:   "#ffb454",
        bad:    "#ff6b6b",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124, 92, 255, 0.45)",
        glowCyan: "0 0 40px -10px rgba(34, 211, 238, 0.4)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float:   "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
