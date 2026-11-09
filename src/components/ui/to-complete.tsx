import type { MaybeText } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Affiche la valeur si elle est renseignée, sinon un marqueur visible
 * « [À compléter : …] ». Aucune donnée réglementaire n'est inventée.
 */
export function ToComplete({
  value,
  label,
  className,
}: {
  value: MaybeText;
  label: string;
  className?: string;
}) {
  if (value) return <>{value}</>;
  return (
    <mark
      className={cn(
        "rounded-md bg-peach-2 px-1.5 py-0.5 font-medium text-coral-ink ring-1 ring-coral/30",
        className,
      )}
    >
      [À compléter : {label}]
    </mark>
  );
}
