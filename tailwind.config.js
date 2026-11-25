/** @type {import('tailwindcss').Config} */

/** Theme colours live in CSS variables (src/styles/index.css) as "R G B" so alpha modifiers work. */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: v("bg"), raised: v("bg-raised"), panel: v("bg-panel"), hover: v("bg-hover") },
        sunken: v("sunken"),
        line: { DEFAULT: v("line"), strong: v("line-strong") },
        ink: { DEFAULT: v("ink"), muted: v("ink-muted"), faint: v("ink-faint") },
        // accent = the fill colour (acid lime); text-on-accent is always dark
        accent: { DEFAULT: v("accent"), soft: v("accent-soft"), amber: v("accent-2"), dim: v("accent-dim") },
        "on-accent": v("on-accent"),
        tside: v("tside"),
        ctside: v("ctside"),
        ok: v("ok"),
        warn: v("warn"),
        bad: v("bad"),
      },
      // Lime is a great fill but unreadable as text on paper, so text / borders / rings use a darker ink variant.
      textColor: { accent: { DEFAULT: v("accent-ink"), soft: v("accent-ink"), amber: v("accent-2-ink"), dim: v("accent-dim") } },
      borderColor: { accent: { DEFAULT: v("accent-ink"), soft: v("accent-ink"), amber: v("accent-2-ink") } },
      ringColor: { accent: { DEFAULT: v("accent-ink"), soft: v("accent-ink"), amber: v("accent-2-ink") } },
      fontFamily: {
        hero: ["Unbounded Variable", "Inter Tight Variable", "Segoe UI", "sans-serif"],
        display: ["Inter Tight Variable", "Inter Variable", "Segoe UI", "sans-serif"],
        sans: ["Inter Variable", "Inter", "Segoe UI Variable", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Cascadia Code", "Consolas", "monospace"],
      },
      borderRadius: { "4xl": "2rem" },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--accent) / .55), 0 12px 40px -12px rgb(var(--accent) / .55)",
        soft: "0 1px 0 rgb(var(--ink) / .04), 0 18px 50px -28px rgb(var(--shadow) / .55)",
        float: "0 1px 0 rgb(255 255 255 / .06) inset, 0 20px 60px -24px rgb(var(--shadow) / .55)",
      },
      keyframes: {
        sweep: { to: { transform: "rotate(360deg)" } },
        march: { to: { strokeDashoffset: "-8" } },
        shine: { "0%": { transform: "translateX(-120%) skewX(-20deg)" }, "100%": { transform: "translateX(220%) skewX(-20deg)" } },
        flicker: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".55" } },
        rise: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        drift: { "0%,100%": { transform: "translate3d(0,0,0) scale(1)" }, "50%": { transform: "translate3d(4%,-3%,0) scale(1.08)" } },
      },
      animation: {
        sweep: "sweep 6s linear infinite",
        march: "march .9s linear infinite",
        shine: "shine 1.1s ease-out",
        flicker: "flicker 2.4s ease-in-out infinite",
        drift: "drift 22s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
