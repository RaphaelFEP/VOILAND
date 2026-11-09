import type { ReactNode } from "react";

/**
 * Transition douce entre les pages. Animation CSS (et non JS) : le contenu
 * reste visible avant hydratation et le LCP n'est pas retardé.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>;
}
