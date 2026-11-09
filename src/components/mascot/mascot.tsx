import { mascotConfig } from "./config";
import { MascotImage } from "./mascot-image";
import { MascotSvg } from "./mascot-svg";

/**
 * Point d'entrée unique de la mascotte. Les pages n'importent que ce
 * composant : changer de rendu (SVG → PNG → 3D) ne touche aucune page.
 */
export function Mascot({
  className,
  wave,
}: {
  className?: string;
  wave?: boolean;
}) {
  switch (mascotConfig.renderer) {
    case "image":
      return <MascotImage className={className} />;
    case "model":
    // Le modèle 3D sera branché ici (docs/MASCOTTE-3D.md) via next/dynamic
    // avec ssr:false et ce même SVG comme fallback de chargement.
    // falls through
    case "svg":
    default:
      return <MascotSvg className={className} wave={wave} />;
  }
}
