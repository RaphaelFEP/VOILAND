import { cn } from "@/lib/utils";

export function FunnelProgress({ steps, current }: { steps: string[]; current: number }) {
  const pct = Math.round(((current + 1) / steps.length) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-coral-ink">
          Étape {current + 1} sur {steps.length}
        </span>
        <span className="text-subtle">{steps[current]}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Progression du diagnostic"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`Étape ${current + 1} sur ${steps.length} : ${steps[current]}`}
        className="mt-3 flex gap-1.5"
      >
        {steps.map((s, i) => (
          <span
            key={s}
            className={cn(
              "h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10",
            )}
          >
            <span
              className={cn(
                "block h-full origin-left rounded-full bg-gradient-to-r from-coral to-rose transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
                i <= current ? "scale-x-100" : "scale-x-0",
              )}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
