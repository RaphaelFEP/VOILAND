import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={cn("h-9 w-9 shrink-0", className)}
    >
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b2d55" />
          <stop offset="1" stopColor="#0b1a33" />
        </linearGradient>
        <linearGradient id="lm-curve" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd9c4" />
          <stop offset="1" stopColor="#ff8b74" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#lm-bg)" />
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="11.5"
        fill="none"
        stroke="white"
        strokeOpacity=".18"
      />
      <path
        d="M10 12.5 L18.2 28 L23.4 18.6"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.4 18.6 C25.6 14.8 27.4 13.4 30.5 12"
        fill="none"
        stroke="url(#lm-curve)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="30.6" cy="12" r="2.3" fill="#ff8b74" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.05rem] font-semibold tracking-tight",
            tone === "dark" ? "text-ink" : "text-white",
          )}
        >
          Voiland
        </span>{" "}
        <span
          className={cn(
            "mt-1 text-[0.62rem] font-medium uppercase tracking-[0.16em]",
            tone === "dark" ? "text-muted" : "text-white/70",
          )}
        >
          Finances &amp; Patrimoine
        </span>
      </span>
    </span>
  );
}
