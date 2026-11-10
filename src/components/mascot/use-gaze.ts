"use client";

import { useEffect, type RefObject } from "react";

/**
 * Regard de la mascotte : écrit --lx / --ly ∈ [-1, 1] sur l'élément selon la
 * position du pointeur (lissé), et le fait regarder autour de lui quand le
 * pointeur est inactif. Aucun re-render React ; coupé si reduced-motion.
 */
export function useGaze(
  ref: RefObject<SVGSVGElement | null>,
  {
    smoothing = 0.16,
    idleMs = 4000,
    field = "local",
  }: {
    smoothing?: number;
    idleMs?: number;
    /** "viewport" : suivi proportionnel sur tout l'écran ; "local" : autour de la mascotte */
    field?: "local" | "viewport";
  } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let lastMove = 0;
    let visible = true;

    const apply = () => {
      raf = 0;
      cur.x += (target.x - cur.x) * smoothing;
      cur.y += (target.y - cur.y) * smoothing;
      el.style.setProperty("--lx", cur.x.toFixed(3));
      el.style.setProperty("--ly", cur.y.toFixed(3));
      if (Math.abs(target.x - cur.x) > 0.002 || Math.abs(target.y - cur.y) > 0.002) {
        raf = requestAnimationFrame(apply);
      }
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(apply);
    };

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.3;
      const rx = field === "viewport" ? Math.max(cx, window.innerWidth - cx) : Math.max(260, r.width * 1.4);
      const ry = field === "viewport" ? Math.max(cy, window.innerHeight - cy, 200) : rx;
      target = {
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / rx)),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / ry)),
      };
      lastMove = performance.now();
      kick();
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const idle = window.setInterval(() => {
      if (finePointer && lastMove > 0) return; // à la souris : il garde la position du curseur
      if (performance.now() - lastMove < idleMs) return;
      const spots = [
        { x: 0, y: 0 },
        { x: -0.6, y: 0.1 },
        { x: 0.6, y: 0 },
        { x: 0, y: 0.5 },
      ];
      target = spots[Math.floor(Math.random() * spots.length)];
      kick();
    }, 3200);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(el);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.clearInterval(idle);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, smoothing, idleMs, field]);
}
