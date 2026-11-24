import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Inbox, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function EmptyState({ icon, title, text, action, className }: { icon?: ReactNode; title: string; text?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-12 text-center", className)}>
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl border border-line bg-bg-panel text-ink-faint">{icon ?? <Inbox size={20} />}</div>
      <p className="text-sm font-medium text-ink">{title}</p>
      {text && <p className="mt-1 max-w-md text-[13px] leading-relaxed text-ink-faint">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/[0.04]", className)} />;
}

export function ErrorNotice({ title = "Что-то пошло не так", message, onRetry }: { title?: string; message: string; onRetry?(): void }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-bad/30 bg-bad/5 p-4">
      <AlertTriangle className="mt-0.5 shrink-0 text-bad" size={18} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-0.5 break-words text-[13px] text-ink-muted">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          <RotateCcw size={14} /> Повторить
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
          <ErrorNotice title="Раздел не загрузился" message={this.state.error.message} onRetry={() => this.setState({ error: null })} />
        </div>
      );
    return this.props.children;
  }
}
