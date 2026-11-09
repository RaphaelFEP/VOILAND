# Mascotte Voiland — rendus et évolution 3D

Toutes les pages utilisent `<Mascot />` (`src/components/mascot/mascot.tsx`). Le rendu est choisi
dans `src/components/mascot/config.ts` (ou via `NEXT_PUBLIC_MASCOT_RENDERER`) : changer de rendu
ne modifie aucune page.

## 1. `svg` — rendu actuel (défaut)

Mascotte vectorielle dessinée d'après le brief (corps blanc brillant, articulations anthracite,
tête-écran, contours corail/rose, courbe de progression, indicateurs lumineux). Animations 100 % CSS
(`globals.css`, classes `.mascot-*`) : flottement, inclinaison de tête, clignement, reflets mobiles,
courbe qui se dessine, salut à l'arrivée. La parallaxe souris (`mascot-stage.tsx`) n'est active que
sur pointeur précis et hors `prefers-reduced-motion`.

## 2. `image` — image officielle 2D

1. Déposer le PNG détouré (fond transparent) dans `public/mascot/voiland-robot.png`.
2. Ajuster `width` / `height` dans `config.ts`.
3. `NEXT_PUBLIC_MASCOT_RENDERER=image`.
4. Facultatif : renseigner `screen` (position de l'écran en fractions de l'image) pour superposer
   la courbe animée sur l'écran du robot.

Les reflets sont masqués par la silhouette du PNG (`mask-image`) : aucune fausse rotation 3D.

## 3. `model` — futur modèle GLB/GLTF animé

Prérequis : un vrai modèle 3D (GLB, idéalement compressé Draco/Meshopt, < 2 Mo) avec animations
nommées (ex. `Idle`, `Wave`).

```bash
npm i three @react-three/fiber @react-three/drei
```

Créer `src/components/mascot/mascot-model.tsx` :

```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { mascotConfig } from "./config";

function Robot() {
  const { scene, animations } = useGLTF(mascotConfig.model.src);
  const { actions } = useAnimations(animations, scene);
  useEffect(() => { actions.Idle?.play(); }, [actions]);
  return <primitive object={scene} />;
}

export default function MascotModel({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.4, 3.2], fov: 32 }} frameloop="demand">
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <Robot />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

Puis, dans `mascot.tsx`, charger ce composant avec `next/dynamic(..., { ssr: false })` en conservant
`<MascotSvg />` comme `loading` (aucun trou visuel, LCP préservé) et retomber sur le SVG si
`prefers-reduced-motion` ou si WebGL est indisponible. Charger le canvas uniquement quand la
mascotte entre dans le viewport.
