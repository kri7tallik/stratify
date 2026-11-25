import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "shine chamfer chamfer-sm bg-gradient-to-r from-accent to-accent-amber text-black font-display font-semibold uppercase tracking-wider hover:brightness-110 shadow-[0_8px_30px_-10px_rgba(255,107,26,.7)]",
  secondary: "chamfer chamfer-sm bg-bg-hover/80 text-ink ring-1 ring-inset ring-line-strong hover:ring-accent/50 hover:text-white hover:bg-bg-hover",
  ghost: "rounded-md text-ink-muted hover:text-ink hover:bg-white/[0.04]",
  danger: "chamfer chamfer-sm bg-bad/10 text-bad ring-1 ring-inset ring-bad/30 hover:bg-bad/20",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[12px] gap-1.5",
  md: "h-10 px-4 text-[13px] gap-2",
  lg: "h-12 px-6 text-[14px] gap-2.5",
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
