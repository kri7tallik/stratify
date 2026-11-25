import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

const base =
  "w-full bg-sunken px-3.5 text-sm text-ink placeholder:text-ink-faint outline-none ring-1 ring-inset ring-line transition focus:ring-2 focus:ring-accent/60 focus:bg-bg-raised disabled:opacity-50";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(base, "h-10 rounded-xl", props.className)} />;
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(base, "min-h-[84px] rounded-xl py-2 leading-relaxed", props.className)} />;
}
export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(base, "h-10 cursor-pointer appearance-none rounded-full bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9 [&>option]:bg-bg-panel", props.className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888780' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
    >
      {children}
    </select>
  );
}
export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="tag-label mb-1.5 block !text-[10px]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-faint">{hint}</span>}
    </label>
  );
}
