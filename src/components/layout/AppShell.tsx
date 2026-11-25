import { Suspense, useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header, MobileDock } from "./Header";
import { CommandPalette } from "./CommandPalette";
import { useAppStore } from "@/store/useAppStore";
import { ErrorBoundary, Skeleton } from "@/components/ui";
import { LOCALE } from "@/i18n";
import { useApplyTheme } from "@/lib/theme";

function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-4 px-4 pt-2 sm:px-8">
      <Skeleton className="h-9 w-72" />
      <div className="grid grid-cols-3 gap-4 pt-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}

/** Ticks the active training session once per second, globally. */
function useSessionTicker() {
  const running = useAppStore((s) => !!s.active?.running);
  const tick = useAppStore((s) => s.tick);
  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const t = setInterval(() => {
      const now = Date.now();
      const delta = Math.round((now - last) / 1000);
      if (delta >= 1) {
        tick(delta);
        last += delta * 1000;
      }
    }, 250);
    return () => clearInterval(t);
  }, [running, tick]);
}

export function AppShell() {
  const [search, setSearch] = useState(false);
  const loc = useLocation();
  const outlet = useOutlet();
  const lang = useAppStore((s) => s.lang);
  useSessionTicker();
  useApplyTheme();

  useEffect(() => {
    document.documentElement.lang = LOCALE[lang].slice(0, 2);
  }, [lang]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    document.getElementById("main-scroll")?.scrollTo({ top: 0 });
  }, [loc.pathname]);

  return (
    <div className="grain relative h-screen w-screen overflow-hidden bg-bg text-ink">
      <div className="backdrop" />
      <div className="dots" />
      <Header onSearch={() => setSearch(true)} />
      <div className="relative h-full">
        <main id="main-scroll" className="h-full overflow-y-auto overflow-x-hidden pt-[5.5rem] sm:pt-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={loc.pathname}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <ErrorBoundary key={loc.pathname}>
                <Suspense fallback={<PageFallback />}>{outlet}</Suspense>
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileDock />
      <CommandPalette open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
