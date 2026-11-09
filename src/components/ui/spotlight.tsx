"use client";

import { useEffect } from "react";

/**
 * Un seul écouteur global : met à jour --mx / --my sur la surface en verre
 * survolée pour un reflet qui suit le pointeur. Aucun re-render React.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let last: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = (e.target as Element | null)?.closest?.(
          "[data-spotlight]",
        ) as HTMLElement | null;
        if (last && last !== el) {
          last.style.removeProperty("--mx");
          last.style.removeProperty("--my");
        }
        last = el;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
