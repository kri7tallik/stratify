export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffb22e" />
          <stop offset="1" stopColor="#ff6b1a" />
        </linearGradient>
      </defs>
      <path d="M8 4h40l8 8v48H16l-8-8z" fill="none" stroke="url(#lg)" strokeWidth="3" />
      <path d="M20 42 L32 18 L44 42 Z" fill="none" stroke="url(#lg)" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M24 50H40" stroke="url(#lg)" strokeWidth="4.5" strokeLinecap="square" />
    </svg>
  );
}
