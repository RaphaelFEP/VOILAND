import { Check, Clock3 } from "lucide-react";

import { Mascot } from "@/components/mascot/mascot";
import type { Product } from "@/config/products";

/** Visuel de hero des pages produit : mascotte + cartes de verre flottantes. */
export function ProductVisual({ product, duration }: { product: Product; duration: string }) {
  return (
    <div className="relative mx-auto hidden w-full max-w-[460px] lg:block" aria-hidden>
      <div className="absolute inset-[8%_4%_12%_4%] rounded-full glass glass-soft opacity-80" />
      <div className="relative mx-auto w-[78%]">
        <Mascot className="h-auto w-full drop-shadow-[0_40px_60px_rgba(11,26,51,0.12)]" />
      </div>
      <div className="animate-float absolute -left-6 top-[18%]" style={{ animationDelay: "0.8s" }}>
        <div className="glass glass-strong flex items-center gap-3 rounded-[20px] px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-peach to-rose-2 text-coral-ink">
            <Clock3 className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-ink">Diagnostic</span>
            <span className="block text-xs text-muted">{duration} · gratuit</span>
          </span>
        </div>
      </div>
      <div className="animate-float-slow absolute -right-6 bottom-[2%]" style={{ animationDelay: "0.2s" }}>
        <div className="glass glass-strong w-60 rounded-[20px] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-coral-ink">Nous analysons</p>
          <ul className="mt-2 space-y-1.5">
            {product.analysis.slice(0, 3).map((a) => (
              <li key={a} className="flex items-start gap-2 text-xs leading-snug text-ink-2">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-coral-ink" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
