"use client";

import { formatEur } from "@/lib/format";

type Item = { name?: string | number; value?: number | string; color?: string; dataKey?: string | number };

/** Infobulle en verre, valeurs en encre (jamais dans la couleur de la série). */
export function GlassTooltip({
  active,
  payload,
  label,
  labelFormatter,
}: {
  active?: boolean;
  payload?: Item[];
  label?: string | number;
  labelFormatter?: (l: string | number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass glass-strong min-w-44 rounded-2xl px-4 py-3 text-xs">
      <p className="font-semibold text-ink">{labelFormatter ? labelFormatter(label ?? "") : label}</p>
      <ul className="mt-2 space-y-1.5">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-muted">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="font-semibold tabular-nums text-ink">{formatEur(Number(p.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
