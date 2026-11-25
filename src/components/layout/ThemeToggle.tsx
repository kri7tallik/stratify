import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useT } from "@/i18n";
import { cn } from "@/lib/cn";
import { switchTheme, useResolvedTheme } from "@/lib/theme";

/** Sun / moon button that flips between light and dark. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useResolvedTheme();
  const t = useT();
  const next = theme === "dark" ? "light" : "dark";
  const label = t(next === "dark" ? "theme.toDark" : "theme.toLight");
  return (
    <button
      type="button"
      onClick={() => switchTheme(next)}
      aria-label={label}
      title={label}
      className={cn("relative grid h-9 w-9 place-items-center overflow-hidden rounded-full text-ink-muted ring-1 ring-inset ring-line transition hover:bg-ink/[0.05] hover:text-ink", className)}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="grid place-items-center"
        >
          {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
