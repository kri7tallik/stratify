import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
    <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-ink-muted ring-1 ring-inset ring-line transition hover:rotate-90 hover:bg-ink hover:text-bg" aria-label="Close">
      <X size={18} />
    </button>
  );
}

export function Drawer({ open, onClose, children, width = 580, title }: { open: boolean; onClose(): void; children: ReactNode; width?: number; title?: ReactNode }) {
  useEsc(open, onClose);
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            className="fixed bottom-2 right-2 top-2 z-50 flex flex-col overflow-hidden rounded-[28px] bg-bg-raised shadow-float ring-1 ring-inset ring-line"
            style={{ width: `min(${width}px, calc(100vw - 16px))` }}
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <div className="tag-label">{title}</div>
              <CloseBtn onClose={onClose} />
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Modal({ open, onClose, children, title, className }: { open: boolean; onClose(): void; children: ReactNode; title?: ReactNode; className?: string }) {
  useEsc(open, onClose);
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-[3px] sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            onMouseDown={(e) => e.stopPropagation()}
            className={cn("frame chamfer chamfer-lg w-full max-w-lg shadow-float", className)}
            initial={{ y: 16, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div className="surface chamfer chamfer-lg">
              {title && (
                <div className="flex h-16 items-center justify-between border-b border-line px-5">
                  <div className="font-display text-[16px] font-semibold tracking-tight">{title}</div>
                  <CloseBtn onClose={onClose} />
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
