import { mascotConfig } from "./config";
import { MascotImage } from "./mascot-image";
import { MascotSober } from "./mascot-sober";
import { MascotSvg } from "./mascot-svg";

/**
 * Point d'entrée unique de la mascotte. Les pages n'importent que ce
 * composant : changer de rendu ne touche aucune page.
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
    case "cute":
      // Ancienne version « personnage mignon », conservée en option.
      return <MascotSvg className={className} wave={wave} />;
    case "model":
    // Le modèle 3D sera branché ici (docs/MASCOTTE-3D.md).
    // falls through
    case "svg":
    default:
      return <MascotSober className={className} />;
  }
}
