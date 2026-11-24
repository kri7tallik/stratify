import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-accent text-black font-semibold hover:bg-accent-soft shadow-[0_0_0_1px_rgba(255,106,26,0.6),0_6px_20px_-8px_rgba(255,106,26,0.6)]",
  secondary: "bg-bg-panel text-ink border border-line hover:border-line-strong hover:bg-bg-hover",
  ghost: "text-ink-muted hover:text-ink hover:bg-bg-hover",
  danger: "bg-bad/10 text-bad border border-bad/30 hover:bg-bad/20",
};
const sizes: Record<Size, string> = { sm: "h-8 px-3 text-[13px] gap-1.5", md: "h-9 px-4 text-sm gap-2" };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "secondary", size = "md", className, ...rest }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
      variants[variant],
      sizes[size],
      className,
    )}
    {...rest}
  />
));
Button.displayName = "Button";
