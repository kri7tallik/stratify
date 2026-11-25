import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "shine rounded-full bg-accent text-on-accent font-display font-semibold tracking-tight hover:bg-accent-soft shadow-[0_10px_30px_-12px_rgb(var(--accent)/.9)]",
  secondary: "rounded-full bg-bg-raised text-ink font-medium ring-1 ring-inset ring-line hover:ring-ink/25 hover:bg-bg-hover",
  ghost: "rounded-full text-ink-muted hover:text-ink hover:bg-ink/[0.05]",
  danger: "rounded-full bg-bad/10 text-bad ring-1 ring-inset ring-bad/30 hover:bg-bad/20",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[12px] gap-1.5",
  md: "h-10 px-5 text-[13px] gap-2",
  lg: "h-12 px-7 text-[14px] gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "secondary", size = "md", className, ...rest }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex select-none items-center justify-center whitespace-nowrap transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
      variants[variant],
      sizes[size],
      className,
    )}
    {...rest}
  />
));
Button.displayName = "Button";
