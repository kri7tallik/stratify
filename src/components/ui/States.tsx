import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Crosshair, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { translate } from "@/i18n";
import { useAppStore } from "@/store/useAppStore";

export function EmptyState({ icon, title, text, action, className }: { icon?: ReactNode; title: string; text?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("chamfer relative flex flex-col items-center justify-center bg-white/[0.015] px-6 py-12 text-center ring-1 ring-inset ring-line", className)}>
      <div className="mb-3 grid h-12 w-12 place-items-center text-ink-faint">{icon ?? <Crosshair size={26} strokeWidth={1.5} />}</div>
      <p className="font-display text-sm font-semibold uppercase tracking-wider text-ink">{title}</p>
      {text && <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-faint">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("chamfer animate-pulse bg-white/[0.04]", className)} />;
}

export function ErrorNotice({ title, message, onRetry }: { title?: string; message: string; onRetry?(): void }) {
  const lang = useAppStore((s) => s.lang);
  return (
    <div className="chamfer flex items-start gap-3 bg-bad/5 p-4 ring-1 ring-inset ring-bad/30">
      <AlertTriangle className="mt-0.5 shrink-0 text-bad" size={18} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title ?? translate(lang, "st.errorTitle")}</p>
        <p className="mt-0.5 break-words text-[13px] text-ink-muted">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          <RotateCcw size={14} /> {translate(lang, "c.retry")}
        </Button>
      )}
    </div>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("STRATIFY crashed", error, info);
  }
  render() {
    if (this.state.error)
      return (
        <div className="p-8">
          <ErrorNotice title={translate(useAppStore.getState().lang, "st.sectionFailed")} message={this.state.error.message} onRetry={() => this.setState({ error: null })} />
        </div>
      );
    return this.props.children;
  }
}
