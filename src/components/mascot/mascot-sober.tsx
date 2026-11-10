"use client";

import { useId, useRef } from "react";

import { MONO, MONO_VIEWBOX } from "@/components/ui/brand-paths";
import { useGaze } from "./use-gaze";

/**
 * Mascotte Voiland — version « assistant sobre ».
 *
 * Silhouette plus élancée, tête-écran au format appareil, yeux en pastilles
 * lumineuses qui suivent discrètement le curseur, courbe de progression
 * patrimoniale toujours présente à l'écran (illustrative), pas de salut,
 * mouvements lents. Animations CSS : classes .sober-* (globals.css).
 */
export function MascotSober({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (s: string) => `${s}-${uid}`;
  const url = (s: string) => `url(#${id(s)})`;
  const ref = useRef<SVGSVGElement>(null);
  useGaze(ref, { smoothing: 0.09 });

  const curve = "M128 214 C 146 211, 152 202, 168 203 S 192 210, 206 199 S 230 182, 244 186 S 268 172, 292 160";

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 520"
      className={className}
      role="img"
      aria-label="Mascotte Voiland : un assistant robot blanc et sobre, dont l'écran affiche une courbe de progression patrimoniale illustrative."
      style={{ ["--lx" as string]: 0, ["--ly" as string]: 0 }}
    >
      <defs>
        <radialGradient id={id("shell")} cx="34%" cy="22%" r="90%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f7f5f3" />
          <stop offset="0.85" stopColor="#e9e4e0" />
          <stop offset="1" stopColor="#dbd4ce" />
        </radialGradient>
        <radialGradient id={id("body")} cx="36%" cy="20%" r="92%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#f6f3f0" />
          <stop offset="0.85" stopColor="#e6e0db" />
          <stop offset="1" stopColor="#d6cec8" />
        </radialGradient>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9c4" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#ff8b74" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f5a6bf" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id={id("joint")} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#5d636e" />
          <stop offset="0.6" stopColor="#2c3038" />
          <stop offset="1" stopColor="#16181d" />
        </radialGradient>
        <linearGradient id={id("screen")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#152039" />
          <stop offset="0.6" stopColor="#0a0f1c" />
          <stop offset="1" stopColor="#05070d" />
        </linearGradient>
        <linearGradient id={id("eye")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffd9c4" />
        </linearGradient>
        <radialGradient id={id("eyeGlow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd9c4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd9c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("curve")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f5a6bf" />
          <stop offset="0.6" stopColor="#ff8b74" />
          <stop offset="1" stopColor="#ffd9c4" />
        </linearGradient>
        <linearGradient id={id("area")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8b74" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ff8b74" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ff8b74" stopOpacity="0.3" />
          <stop offset="0.6" stopColor="#f5a6bf" stopOpacity="0.1" />
          <stop offset="1" stopColor="#f5a6bf" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("shadow")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#0b1a33" stopOpacity="0.24" />
          <stop offset="1" stopColor="#0b1a33" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id("clipHead")}>
          <rect x="98" y="78" width="224" height="178" rx="70" />
        </clipPath>
        <clipPath id={id("clipScreen")}>
          <rect x="116" y="96" width="188" height="142" rx="52" />
        </clipPath>
      </defs>

      <ellipse cx="210" cy="270" rx="190" ry="215" fill={url("glow")} />
      <ellipse className="sober-shadow" cx="210" cy="500" rx="78" ry="10" fill={url("shadow")} />

      <g className="sober-float">
        {/* Bras, le long du corps */}
        <path d="M152 320 C 136 336, 130 362, 133 392" stroke={url("body")} strokeWidth="24" strokeLinecap="round" fill="none" />
        <path d="M268 320 C 284 336, 290 362, 287 392" stroke={url("body")} strokeWidth="24" strokeLinecap="round" fill="none" />
        <circle cx="133" cy="398" r="13" fill={url("body")} />
        <circle cx="287" cy="398" r="13" fill={url("body")} />
        <circle cx="153" cy="316" r="12" fill={url("joint")} />
        <circle cx="267" cy="316" r="12" fill={url("joint")} />

        {/* Corps */}
        <path
          d="M210 282 C 266 282 288 322 288 372 C 288 428 256 462 210 462 C 164 462 132 428 132 372 C 132 322 154 282 210 282 Z"
          fill="none"
          stroke={url("rim")}
          strokeWidth="4"
          opacity="0.4"
        />
        <path
          d="M210 288 C 262 288 282 324 282 372 C 282 424 252 456 210 456 C 168 456 138 424 138 372 C 138 324 158 288 210 288 Z"
          fill={url("body")}
        />
        <path d="M168 312 C 182 300, 204 296, 220 299 C 198 304, 180 316, 166 334 C 160 326, 161 318, 168 312 Z" fill="#fff" opacity="0.85" />
        <rect x="180" y="346" width="60" height="42" rx="16" fill="#0b1a33" opacity="0.045" />
        <rect x="180.5" y="346.5" width="59" height="41" rx="15.5" fill="none" stroke={url("rim")} opacity="0.6" />
        <svg x="189" y="352.5" width="42" height="30.7" viewBox={MONO_VIEWBOX}>
          <path d={MONO.V} fill="#0b1a33" fillRule="evenodd" />
          <path d={MONO.F} fill="#0b1a33" fillRule="evenodd" />
          <path d={MONO.P} fill="#0b1a33" fillRule="evenodd" />
          <path d={MONO.wave} fill="#ff8b74" fillRule="evenodd" />
        </svg>
        <rect className="sober-led" x="196" y="408" width="28" height="4" rx="2" fill="#ff8b74" />

        {/* Cou */}
        <rect x="192" y="248" width="36" height="44" rx="12" fill={url("joint")} />

        {/* Tête */}
        <g className="sober-look-head">
          <g className="sober-head">
            <rect x="80" y="138" width="20" height="58" rx="10" fill={url("joint")} />
            <rect x="320" y="138" width="20" height="58" rx="10" fill={url("joint")} />
            <rect className="sober-led" x="196" y="68" width="28" height="5" rx="2.5" fill="#ff8b74" />

            <rect x="93" y="73" width="234" height="188" rx="75" fill="none" stroke={url("rim")} strokeWidth="4" opacity="0.38" />
            <rect x="98" y="78" width="224" height="178" rx="70" fill={url("shell")} />
            <rect x="98.75" y="78.75" width="222.5" height="176.5" rx="69.25" fill="none" stroke="#fff" strokeWidth="1.5" />

            <rect x="116" y="96" width="188" height="142" rx="52" fill={url("screen")} />
            <g clipPath={url("clipScreen")}>
              <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1">
                <path d="M116 176 H304 M116 204 H304 M116 232 H304" />
                <path d="M163 96 V238 M210 96 V238 M257 96 V238" />
              </g>

              {/* yeux : pastilles lumineuses */}
              <g className="sober-look-eyes">
                <ellipse cx="180" cy="138" rx="18" ry="24" fill={url("eyeGlow")} />
                <ellipse cx="240" cy="138" rx="18" ry="24" fill={url("eyeGlow")} />
                <rect className="sober-eye" x="174" y="124" width="12" height="28" rx="6" fill={url("eye")} />
                <rect className="sober-eye" x="234" y="124" width="12" height="28" rx="6" fill={url("eye")} />
              </g>

              {/* courbe de progression permanente (illustrative) */}
              <path className="sober-area" d={`${curve} L 292 238 L 128 238 Z`} fill={url("area")} />
              <path
                className="sober-curve"
                d={curve}
                pathLength={1}
                fill="none"
                stroke={url("curve")}
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle className="sober-dot" cx="292" cy="160" r="4.5" fill="#ffd9c4" />

              <path d="M128 112 C 156 101, 206 99, 242 101 C 200 109, 160 122, 126 146 Z" fill="#fff" opacity="0.07" />
            </g>
            <rect x="116.5" y="96.5" width="187" height="141" rx="51.5" fill="none" stroke="#fff" strokeOpacity="0.12" />

            <path d="M126 104 C 140 88, 164 81, 192 80 C 166 87, 146 98, 134 116 C 127 114, 123 110, 126 104 Z" fill="#fff" />
            <g clipPath={url("clipHead")}>
              <rect className="sober-sheen" x="150" y="60" width="36" height="220" fill={url("sheen")} opacity="0.3" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
