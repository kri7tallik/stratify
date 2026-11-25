/** STRATIFY mark: a lime tile with a stacked-strata "S" cut — reads on paper and on black. */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden className="shrink-0">
      <rect x="2" y="2" width="60" height="60" rx="18" fill="rgb(var(--accent))" />
      <path d="M44 20H26a6 6 0 0 0 0 12h12a6 6 0 0 1 0 12H20" fill="none" stroke="rgb(var(--on-accent))" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="46" cy="44" r="4" fill="rgb(var(--on-accent))" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={`font-hero text-[15px] font-semibold tracking-tight ${className ?? ""}`}>stratify</span>;
}
