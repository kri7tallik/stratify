/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#07090c", raised: "#0c1016", panel: "#10161e", hover: "#17202b" },
        line: { DEFAULT: "#1c2631", strong: "#2a3746" },
        ink: { DEFAULT: "#e9eef4", muted: "#95a3b3", faint: "#5d6b7b" },
        accent: { DEFAULT: "#ff6b1a", soft: "#ff8f45", amber: "#ffb22e", dim: "#3a1a08" },
        tside: "#e8b04a",
        ctside: "#5b9cf5",
        ok: "#3fd68f",
        warn: "#f5b544",
        bad: "#ff5a5f",
      },
      fontFamily: {
        display: ["Tektur", "Inter Variable", "Segoe UI", "sans-serif"],
        sans: ["Inter Variable", "Inter", "Segoe UI Variable", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Cascadia Code", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,107,26,0.45), 0 10px 40px -10px rgba(255,107,26,0.55)",
        soft: "0 20px 60px -30px rgba(0,0,0,0.9)",
      },
      keyframes: {
        sweep: { to: { transform: "rotate(360deg)" } },
        march: { to: { strokeDashoffset: "-8" } },
        shine: { "0%": { transform: "translateX(-120%) skewX(-20deg)" }, "100%": { transform: "translateX(220%) skewX(-20deg)" } },
        flicker: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".55" } },
        rise: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        sweep: "sweep 6s linear infinite",
        march: "march .9s linear infinite",
        shine: "shine 1.1s ease-out",
        flicker: "flicker 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
