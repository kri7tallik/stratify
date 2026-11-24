/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0b0c0e", raised: "#111215", panel: "#15171b", hover: "#1b1d22" },
        line: { DEFAULT: "#23252b", strong: "#30333a" },
        ink: { DEFAULT: "#eceef1", muted: "#9a9fa8", faint: "#62666f" },
        accent: { DEFAULT: "#ff6a1a", soft: "#ff8a4c", dim: "#3a1c0c" },
        tside: "#e8b04a",
        ctside: "#5b9cf5",
        ok: "#3fcf8e",
        warn: "#f5b544",
        bad: "#f2555a",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI Variable", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Cascadia Code", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(255,106,26,0.35), 0 8px 30px -8px rgba(255,106,26,0.35)",
      },
      borderRadius: { xl: "14px" },
    },
  },
  plugins: [],
};
