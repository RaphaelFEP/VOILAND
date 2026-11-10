/**
 * Configuration de la mascotte — point unique de bascule entre les rendus.
 *
 *  - "svg"   : mascotte vectorielle « assistant sobre » (par défaut).
 *  - "cute"  : ancienne version « personnage mignon » (yeux, joues, sourire).
 *  - "image" : image officielle 2D (PNG détouré) déposée dans /public/mascot/,
 *              animée en CSS/Motion (flottement, inclinaison, reflets masqués
 *              par la silhouette, courbe dessinée sur l'écran).
 *  - "model" : réservé au futur modèle GLB/GLTF via React Three Fiber
 *              (voir docs/MASCOTTE-3D.md). Bascule automatiquement sur "svg"
 *              tant que le composant 3D n'est pas installé.
 */
export type MascotRenderer = "svg" | "cute" | "image" | "model";

export type MascotScreenArea = {
  /** Position de l'écran dans l'image, en fraction de la largeur/hauteur (0-1). */
  x: number;
  y: number;
  width: number;
  height: number;
};

export const mascotConfig: {
  renderer: MascotRenderer;
  image: {
    src: string;
    width: number;
    height: number;
    /** Zone de l'écran sur le PNG pour y superposer la courbe animée (null = désactivé). */
    screen: MascotScreenArea | null;
  };
  model: { src: string };
} = {
  renderer:
    (process.env.NEXT_PUBLIC_MASCOT_RENDERER as MascotRenderer | undefined) ??
    "svg",
  image: {
    src: "/mascot/voiland-robot.png",
    width: 1024,
    height: 1024,
    screen: null, // ex. { x: 0.31, y: 0.16, width: 0.38, height: 0.22 }
  },
  model: { src: "/mascot/voiland-robot.glb" },
};

export const MASCOT_ALT =
  "Mascotte Voiland : un robot blanc et bienveillant dont l'écran affiche une courbe de progression patrimoniale illustrative.";
