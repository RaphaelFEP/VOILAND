"use client";

import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scène de profondeur : la mascotte et les éléments flottants réagissent
 * discrètement au pointeur (parallaxe à plusieurs plans). Désactivé sur
 * écrans tactiles et si l'utilisateur préfère réduire les animations.
 */
export function MascotStage({
  children,
  className,
}: {
  children: (layer: (depth: number) => LayerStyle) => ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      px.set(Math.max(-1, Math.min(1, nx)));
      py.set(Math.max(-1, Math.min(1, ny)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduce]);

  const layer = (depth: number): LayerStyle => ({ sx, sy, depth });

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      {children(layer)}
    </div>
  );
}

export type LayerStyle = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  depth: number;
};

export function Layer({
  layer,
  children,
  className,
  tilt = false,
  style,
}: {
  layer: LayerStyle;
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  style?: React.CSSProperties;
}) {
  const { sx, sy, depth } = layer;
  const x = useTransform(sx, (v) => v * 14 * depth);
  const y = useTransform(sy, (v) => v * 10 * depth);
  const rotateY = useTransform(sx, (v) => (tilt ? v * 7 : 0));
  const rotateX = useTransform(sy, (v) => (tilt ? v * -5 : 0));
  return (
    <m.div
      className={className}
      style={{ ...style, x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {children}
    </m.div>
  );
}
