"use client";

import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useId, useState } from "react";

/** Champ numérique large avec flèches (style calculatrice). */
export function StepperField({
  label,
  info,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  decimals = 0,
}: {
  label: string;
  info?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: string;
  decimals?: number;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const shown =
    draft ?? value.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const commit = (raw: string) => {
    const n = Number(raw.replace(/\s| /g, "").replace(",", "."));
    if (Number.isFinite(n)) onChange(clamp(Number(n.toFixed(decimals))));
  };
  const bump = (dir: 1 | -1) => {
    setDraft(null);
    onChange(clamp(Number((value + dir * step).toFixed(decimals))));
  };

  return (
    <div className="border-b border-line py-4 last:border-0">
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-muted">
          {label}
        </label>
        {info ? (
          <span className="group relative inline-flex">
            <button type="button" aria-label={`Information : ${label}`} aria-describedby={`${id}-info`} className="grid h-5 w-5 place-items-center rounded-full text-subtle hover:text-ink">
              <Info className="h-3.5 w-3.5" aria-hidden />
            </button>
            <span
              id={`${id}-info`}
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-6 z-10 w-56 -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
            >
              {info}
            </span>
          </span>
        ) : null}
      </div>
      <div className="mt-1.5 flex items-center gap-3">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={shown}
          onChange={(e) => {
            setDraft(e.target.value);
            commit(e.target.value);
          }}
          onBlur={() => setDraft(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              bump(1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              bump(-1);
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-[2rem] font-medium leading-none tracking-tight text-ink tabular-nums outline-none focus-visible:outline-none"
        />
        <div className="flex flex-col gap-0.5">
          <button type="button" onClick={() => bump(1)} aria-label={`Augmenter : ${label}`} className="grid h-5 w-6 place-items-center rounded-md bg-white/70 text-muted ring-1 ring-line hover:text-ink">
            <ChevronUp className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button type="button" onClick={() => bump(-1)} aria-label={`Diminuer : ${label}`} className="grid h-5 w-6 place-items-center rounded-md bg-white/70 text-muted ring-1 ring-line hover:text-ink">
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
        <span className="w-9 text-right text-lg text-subtle">{suffix}</span>
      </div>
    </div>
  );
}
