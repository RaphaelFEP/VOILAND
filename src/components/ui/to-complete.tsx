import type { MaybeText } from "@/config/site";

/**
 * Affiche la valeur si elle est renseignée dans src/config/site.ts, sinon rien.
 * (Les pages masquent déjà les phrases qui dépendent d'une information absente.)
 */
export function ToComplete({ value }: { value: MaybeText; label?: string; className?: string }) {
  return value ? <>{value}</> : null;
}
