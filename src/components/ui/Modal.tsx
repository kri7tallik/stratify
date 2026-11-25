import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

function useEsc(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
}

function CloseBtn({ onClose }: { onClose(): void }) {
  return (
    <button onClick={onClose} className="grid h-8 w-8 place-items-center text-ink-muted transition hover:rotate-90 hover:text-accent" aria-label="Close">
      <X size={18} />
    </button>
  );
}

export function Drawer({ open, onClose, children, width = 580, title }: { open: boolean; onClose(): void; children: ReactNode; width?: number; title?: ReactNode }) {
  useEsc(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-50 flex max-w-full flex-col border-l border-accent/30 bg-bg-raised/95 shadow-2xl backdrop-blur-xl"
            style={{ width }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="stripes absolute left-0 top-0 h-full w-[3px] opacity-60" />
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-5">
              <div className="tag-label !text-ink">{title}</div>
              <CloseBtn onClose={onClose} />
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Modal({ open, onClose, children, title, className }: { open: boolean; onClose(): void; children: ReactNode; title?: ReactNode; className?: string }) {
  useEsc(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            className={cn("frame frame-hot chamfer chamfer-lg w-full max-w-lg", className)}
            initial={{ y: 16, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div className="surface chamfer chamfer-lg">
              {title && (
                <div className="flex h-14 items-center justify-between border-b border-line px-5">
                  <div className="tag-label !text-ink">{title}</div>
                  <CloseBtn onClose={onClose} />
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
