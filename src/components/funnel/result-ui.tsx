import { Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Kpi({
  label,
  value,
  hint,
  tone = "default",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "ink" | "accent";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 sm:p-5",
        tone === "default" && "bg-white/75 ring-1 ring-line",
        tone === "ink" && "glass-ink",
        tone === "accent" && "bg-gradient-to-br from-peach-2 to-rose-2/70 ring-1 ring-white",
        className,
      )}
    >
      <p className={cn("text-xs font-medium uppercase tracking-[0.1em]", tone === "ink" ? "text-white/70" : "text-muted")}>
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.75rem]",
          tone === "ink" ? "text-white" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className={cn("mt-1.5 text-xs leading-relaxed", tone === "ink" ? "text-white/70" : "text-muted")}>{hint}</p>
      ) : null}
    </div>
  );
}

export function Notice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-2xl bg-white/60 p-4 text-xs leading-relaxed text-muted ring-1 ring-line",
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-coral-ink" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export function Checklist({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: { title: string; text: string }[];
  icon?: LucideIcon;
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((i) => (
          <li key={i.title} className="flex gap-3 rounded-2xl bg-white/70 p-3.5 ring-1 ring-line">
            {Icon ? (
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-peach-2 text-coral-ink">
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
            ) : null}
            <span className="text-sm leading-relaxed text-muted">
              <strong className="font-semibold text-ink">{i.title}</strong> — {i.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
