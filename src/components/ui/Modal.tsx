import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Drawer({ open, onClose, children, width = 560, title }: { open: boolean; onClose(): void; children: ReactNode; width?: number; title?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-50 flex flex-col border-l border-line bg-bg-raised shadow-2xl"
            style={{ width }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
              <div className="min-w-0 truncate text-sm font-semibold">{title}</div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-bg-hover hover:text-ink" aria-label="Закрыть">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Modal({ open, onClose, children, title, className }: { open: boolean; onClose(): void; children: ReactNode; title?: ReactNode; className?: string }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            className={cn("w-full max-w-lg rounded-2xl border border-line bg-bg-raised shadow-2xl", className)}
            initial={{ y: 12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            {title && (
              <div className="flex h-14 items-center justify-between border-b border-line px-5">
                <div className="text-sm font-semibold">{title}</div>
                <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-bg-hover hover:text-ink" aria-label="Закрыть">
                  <X size={16} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
