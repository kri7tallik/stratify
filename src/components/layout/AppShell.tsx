import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { useAppStore } from "@/store/useAppStore";
import { ErrorBoundary, Skeleton } from "@/components/ui";

function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-4 px-8 pt-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-80" />
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
  useSessionTicker();

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
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onSearch={() => setSearch(true)} />
        <main id="main-scroll" className="flex-1 overflow-y-auto">
          <ErrorBoundary key={loc.pathname}>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette open={search} onClose={() => setSearch(false)} />
    </div>
  );
}
