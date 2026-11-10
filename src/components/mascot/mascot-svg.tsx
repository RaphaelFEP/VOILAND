"use client";

import { useEffect, useId, useRef } from "react";

import { MONO, MONO_VIEWBOX } from "@/components/ui/brand-paths";

/**
 * Mascotte Voiland — rendu vectoriel.
 *
 * Grosse tête-écran arrondie, grands yeux brillants qui suivent le curseur
 * (et regardent autour d'eux sur mobile), joues roses, sourire, corps blanc
 * brillant, articulations anthracite, contours translucides corail/rose.
 * Toutes les ~11 s, l'écran affiche la courbe de progression patrimoniale
 * (illustrative) avant de revenir au visage.
 *
 * Le regard est piloté par deux variables CSS (--lx, --ly ∈ [-1, 1]) écrites
 * directement sur le <svg> : aucun re-render React. Désactivé si
 * prefers-reduced-motion.
 */
export function MascotSvg({
  className,
  wave = true,
}: {
  className?: string;
  wave?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const id = (s: string) => `${s}-${uid}`;
  const url = (s: string) => `url(#${id(s)})`;
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let lastMove = 0;
    let visible = true;

    const apply = () => {
      raf = 0;
      // lissage (ressort simple)
      cur.x += (target.x - cur.x) * 0.16;
      cur.y += (target.y - cur.y) * 0.16;
      svg.style.setProperty("--lx", cur.x.toFixed(3));
      svg.style.setProperty("--ly", cur.y.toFixed(3));
      if (Math.abs(target.x - cur.x) > 0.002 || Math.abs(target.y - cur.y) > 0.002) {
        raf = requestAnimationFrame(apply);
      }
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(apply);
    };

    const lookAt = (clientX: number, clientY: number) => {
      const r = svg.getBoundingClientRect();
      // centre approximatif des yeux (≈ 30 % de la hauteur)
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.3;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const range = Math.max(260, r.width * 1.4);
      target = {
        x: Math.max(-1, Math.min(1, dx / range)),
        y: Math.max(-1, Math.min(1, dy / range)),
      };
      lastMove = performance.now();
      kick();
    };

    const onPointer = (e: PointerEvent) => lookAt(e.clientX, e.clientY);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });

    // Sans pointeur actif (mobile, ou souris immobile) : il regarde autour de lui.
    const idle = window.setInterval(() => {
      if (performance.now() - lastMove < 4000) return;
      const spots = [
        { x: 0, y: 0 },
        { x: -0.8, y: -0.2 },
        { x: 0.8, y: -0.3 },
        { x: 0.3, y: 0.6 },
        { x: -0.4, y: 0.4 },
      ];
      target = spots[Math.floor(Math.random() * spots.length)];
      kick();
    }, 2600);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(svg);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.clearInterval(idle);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const curve =
    "M120 206 C 140 202, 146 188, 164 190 S 190 204, 206 186 S 232 160, 246 166 S 276 140, 300 120";

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 520"
      className={className}
      role="img"
      aria-label="Mascotte Voiland : un petit robot blanc souriant, dont l'écran affiche un visage et une courbe de progression patrimoniale illustrative."
      style={{ ["--lx" as string]: 0, ["--ly" as string]: 0 }}
    >
      <defs>
        <radialGradient id={id("shell")} cx="34%" cy="22%" r="88%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f8f6f4" />
          <stop offset="0.85" stopColor="#ebe6e2" />
          <stop offset="1" stopColor="#ddd6d0" />
        </radialGradient>
        <radialGradient id={id("body")} cx="38%" cy="22%" r="90%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#f7f4f1" />
          <stop offset="0.82" stopColor="#e8e3de" />
          <stop offset="1" stopColor="#d8d0ca" />
        </radialGradient>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9c4" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#ff8b74" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f5a6bf" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id={id("joint")} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#5d636e" />
          <stop offset="0.6" stopColor="#2c3038" />
          <stop offset="1" stopColor="#16181d" />
        </radialGradient>
        <linearGradient id={id("screen")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17203a" />
          <stop offset="0.6" stopColor="#0a0f1c" />
          <stop offset="1" stopColor="#05070d" />
        </linearGradient>
        <radialGradient id={id("eye")} cx="45%" cy="38%" r="65%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#fff3ec" />
          <stop offset="1" stopColor="#ffd9c4" />
        </radialGradient>
        <radialGradient id={id("blush")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff8b74" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff8b74" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("curve")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f5a6bf" />
          <stop offset="0.55" stopColor="#ff8b74" />
          <stop offset="1" stopColor="#ffd9c4" />
        </linearGradient>
        <linearGradient id={id("area")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8b74" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ff8b74" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff8b74" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#f5a6bf" stopOpacity="0.14" />
          <stop offset="1" stopColor="#f5a6bf" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("shadow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#0b1a33" stopOpacity="0.26" />
          <stop offset="1" stopColor="#0b1a33" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id("clipHead")}>
          <rect x="70" y="56" width="280" height="214" rx="96" />
        </clipPath>
        <clipPath id={id("clipBody")}>
          <path d="M210 286 C 270 286 292 330 290 372 C 288 420 256 444 210 444 C 164 444 132 420 130 372 C 128 330 150 286 210 286 Z" />
        </clipPath>
        <clipPath id={id("clipScreen")}>
          <rect x="94" y="80" width="232" height="166" rx="74" />
        </clipPath>
      </defs>

      <ellipse cx="210" cy="250" rx="200" ry="210" fill={url("glow")} />
      <ellipse className="mascot-shadow" cx="210" cy="496" rx="88" ry="11" fill={url("shadow")} />

      <g className="mascot-float">
        {/* ---------- Bras ---------- */}
        <g>
          <path d="M138 324 C 116 338, 108 362, 112 388" stroke={url("body")} strokeWidth="30" strokeLinecap="round" fill="none" />
          <circle cx="112" cy="394" r="18" fill={url("body")} />
          <circle cx="112" cy="394" r="18" fill="none" stroke={url("rim")} strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="140" cy="318" r="15" fill={url("joint")} />
        </g>
        <g className={wave ? "mascot-wave" : undefined}>
          <path d="M282 318 C 306 308, 322 284, 326 258" stroke={url("body")} strokeWidth="30" strokeLinecap="round" fill="none" />
          <circle cx="327" cy="250" r="18" fill={url("body")} />
          <circle cx="327" cy="250" r="18" fill="none" stroke={url("rim")} strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="280" cy="318" r="15" fill={url("joint")} />
        </g>

        {/* ---------- Corps ---------- */}
        <g>
          <path
            d="M210 280 C 276 280 298 328 296 374 C 294 426 260 450 210 450 C 160 450 126 426 124 374 C 122 328 144 280 210 280 Z"
            fill="none"
            stroke={url("rim")}
            strokeWidth="5"
            opacity="0.45"
          />
          <path
            d="M210 286 C 270 286 292 330 290 372 C 288 420 256 444 210 444 C 164 444 132 420 130 372 C 128 330 150 286 210 286 Z"
            fill={url("body")}
          />
          <path d="M162 312 C 178 298, 204 294, 222 298 C 196 302, 174 314, 158 334 C 152 326, 154 318, 162 312 Z" fill="#fff" opacity="0.9" />
          {/* plastron : monogramme Voiland (logo officiel) */}
          <rect x="178" y="342" width="64" height="46" rx="18" fill="#0b1a33" opacity="0.05" />
          <rect x="178.5" y="342.5" width="63" height="45" rx="17.5" fill="none" stroke={url("rim")} opacity="0.7" />
          <svg x="188" y="350" width="44" height="32.2" viewBox={MONO_VIEWBOX}>
            <path d={MONO.V} fill="#0b1a33" fillRule="evenodd" />
            <path d={MONO.F} fill="#0b1a33" fillRule="evenodd" />
            <path d={MONO.P} fill="#0b1a33" fillRule="evenodd" />
            <path d={MONO.wave} fill="#ff8b74" fillRule="evenodd" />
          </svg>
          <circle className="mascot-led" cx="198" cy="408" r="3" fill="#ff8b74" />
          <circle className="mascot-led-2" cx="210" cy="408" r="3" fill="#f5a6bf" />
          <circle className="mascot-led-3" cx="222" cy="408" r="3" fill="#ffd9c4" />
          <g clipPath={url("clipBody")}>
            <rect className="mascot-sheen" x="150" y="270" width="44" height="200" fill={url("sheen")} opacity="0.5" />
          </g>
        </g>

        {/* ---------- Cou ---------- */}
        <rect x="190" y="258" width="40" height="34" rx="14" fill={url("joint")} />

        {/* ---------- Tête (suit le regard) ---------- */}
        <g className="mascot-look-head">
          <g className="mascot-head">
            {/* oreilles */}
            <circle cx="64" cy="164" r="24" fill={url("joint")} />
            <circle cx="356" cy="164" r="24" fill={url("joint")} />
            <circle cx="58" cy="157" r="6" fill="#fff" opacity="0.14" />
            <circle cx="350" cy="157" r="6" fill="#fff" opacity="0.14" />
            <circle className="mascot-led" cx="64" cy="164" r="5" fill="#ff8b74" />
            <circle className="mascot-led-2" cx="356" cy="164" r="5" fill="#ff8b74" />

            {/* antenne */}
            <g className="mascot-antenna">
              <rect x="206" y="24" width="8" height="38" rx="4" fill={url("joint")} />
              <circle className="mascot-halo" cx="210" cy="20" r="12" fill="#ff8b74" opacity="0.5" />
              <circle cx="210" cy="20" r="10" fill="#ff8b74" />
              <circle cx="206.5" cy="16.5" r="3.2" fill="#fff" opacity="0.85" />
            </g>

            {/* coque */}
            <rect x="64" y="50" width="292" height="226" rx="102" fill="none" stroke={url("rim")} strokeWidth="6" opacity="0.42" />
            <rect x="70" y="56" width="280" height="214" rx="96" fill={url("shell")} />
            <rect x="70.75" y="56.75" width="278.5" height="212.5" rx="95.25" fill="none" stroke="#fff" strokeWidth="1.5" />

            {/* écran */}
            <rect x="94" y="80" width="232" height="166" rx="74" fill={url("screen")} />
            <g clipPath={url("clipScreen")}>
              {/* Visage */}
              <g className="mascot-face">
                <g className="mascot-look-face">
                  {/* joues */}
                  <ellipse cx="136" cy="190" rx="22" ry="12" fill={url("blush")} opacity="0.7" />
                  <ellipse cx="284" cy="190" rx="22" ry="12" fill={url("blush")} opacity="0.7" />
                  {/* yeux */}
                  <g className="mascot-eye">
                    <ellipse cx="170" cy="150" rx="22" ry="26" fill={url("eye")} />
                    <g className="mascot-look-pupil">
                      <circle cx="170" cy="152" r="12.5" fill="#0b1a33" />
                      <circle cx="175" cy="146" r="4.6" fill="#fff" />
                      <circle cx="166" cy="158" r="2" fill="#fff" opacity="0.7" />
                    </g>
                  </g>
                  <g className="mascot-eye">
                    <ellipse cx="250" cy="150" rx="22" ry="26" fill={url("eye")} />
                    <g className="mascot-look-pupil">
                      <circle cx="250" cy="152" r="12.5" fill="#0b1a33" />
                      <circle cx="255" cy="146" r="4.6" fill="#fff" />
                      <circle cx="246" cy="158" r="2" fill="#fff" opacity="0.7" />
                    </g>
                  </g>
                  {/* sourire */}
                  <path d="M194 196 Q 210 212 226 196" fill="none" stroke="#ffd9c4" strokeWidth="5" strokeLinecap="round" />
                </g>
              </g>

              {/* Courbe de progression (illustrative) */}
              <g className="mascot-chart">
                <g stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1">
                  <path d="M94 124 H326 M94 162 H326 M94 200 H326" />
                  <path d="M152 80 V246 M210 80 V246 M268 80 V246" />
                </g>
                <path className="mascot-area" d={`${curve} L 300 246 L 120 246 Z`} fill={url("area")} />
                <path
                  className="mascot-curve"
                  d={curve}
                  pathLength={1}
                  fill="none"
                  stroke={url("curve")}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g className="mascot-dot">
                  <circle cx="300" cy="120" r="11" fill="#ff8b74" opacity="0.25" />
                  <circle cx="300" cy="120" r="5.5" fill="#ffd9c4" />
                </g>
              </g>

              {/* reflet de la vitre */}
              <path d="M110 104 C 140 90, 200 86, 246 88 C 196 98, 146 116, 108 146 Z" fill="#fff" opacity="0.08" />
            </g>
            <rect x="94.5" y="80.5" width="231" height="165" rx="73.5" fill="none" stroke="#fff" strokeOpacity="0.14" />

            {/* indicateurs sous l'écran */}
            <circle className="mascot-led" cx="198" cy="258" r="2.6" fill="#2f9e7a" />
            <circle className="mascot-led-2" cx="210" cy="258" r="2.6" fill="#ff8b74" />
            <circle className="mascot-led-3" cx="222" cy="258" r="2.6" fill="#f5a6bf" />

            {/* reflets coque */}
            <path d="M104 98 C 118 78, 146 66, 180 63 C 152 72, 130 86, 114 108 C 107 106, 102 103, 104 98 Z" fill="#fff" />
            <g clipPath={url("clipHead")}>
              <rect className="mascot-sheen" x="140" y="30" width="40" height="270" fill={url("sheen")} opacity="0.35" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
