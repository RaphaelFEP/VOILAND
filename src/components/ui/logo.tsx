import { cn } from "@/lib/utils";

import { MONO, MONO_VIEWBOX, WORDMARK, WORDMARK_VIEWBOX } from "./brand-paths";

/**
 * Identité Voiland modernisée.
 *
 * Le monogramme VFP et le mot « VOILAND » sont les tracés exacts du logo
 * officiel. Modernisation : tuile en verre bleu nuit avec liseré et reflet,
 * lettres blanches, vague du P en dégradé pêche → corail (couleurs de la
 * mascotte), sous-titre en linéale Geist espacée.
 */

/** Monogramme seul (sans tuile). `tone` = couleur des lettres. */
export function Monogram({
  className,
  tone = "ink",
  gradientId = "vfp-wave",
}: {
  className?: string;
  tone?: "ink" | "white";
  gradientId?: string;
}) {
  const fill = tone === "ink" ? "#0b1a33" : "#ffffff";
  return (
    <svg viewBox={MONO_VIEWBOX} aria-hidden className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ff8b74" />
          <stop offset="1" stopColor="#ffd9c4" />
        </linearGradient>
      </defs>
      <path d={MONO.V} fill={fill} fillRule="evenodd" />
      <path d={MONO.F} fill={fill} fillRule="evenodd" />
      <path d={MONO.P} fill={fill} fillRule="evenodd" />
      <path d={MONO.wave} fill={`url(#${gradientId})`} fillRule="evenodd" />
    </svg>
  );
}

/** Tuile « Liquid Glass » contenant le monogramme. */
export function LogoMark({ className, id = "lm" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("h-10 w-10 shrink-0", className)}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f3463" />
          <stop offset="0.55" stopColor="#0f2245" />
          <stop offset="1" stopColor="#0b1a33" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="85%" cy="100%" r="70%">
          <stop offset="0" stopColor="#ff8b74" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff8b74" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ffb9a6" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${id}-bg)`} />
      <rect width="48" height="48" rx="14" fill={`url(#${id}-glow)`} />
      <path d="M14 0.5h20a13.5 13.5 0 0 1 13.5 13.5v4C40 14 26 12.5 0.5 21V14A13.5 13.5 0 0 1 14 0.5z" fill={`url(#${id}-shine)`} />
      <rect x="0.5" y="0.5" width="47" height="47" rx="13.5" fill="none" stroke={`url(#${id}-rim)`} />
      <svg x="6.5" y="11.2" width="35" height="25.6" viewBox={MONO_VIEWBOX}>
        <defs>
          <linearGradient id={`${id}-wave`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#ff8b74" />
            <stop offset="1" stopColor="#ffd9c4" />
          </linearGradient>
        </defs>
        <path d={MONO.V} fill="#fff" fillRule="evenodd" />
        <path d={MONO.F} fill="#fff" fillRule="evenodd" />
        <path d={MONO.P} fill="#fff" fillRule="evenodd" />
        <path d={MONO.wave} fill={`url(#${id}-wave)`} fillRule="evenodd" />
      </svg>
    </svg>
  );
}

/** Mot « VOILAND » + « FINANCES PATRIMOINE », calés sur la même largeur. */
export function Wordmark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const [, , w, h] = WORDMARK_VIEWBOX.split(" ").map(Number);
  const sub = 34;
  const gap = 24;
  const total = h + gap + sub;
  return (
    <svg viewBox={`0 0 ${w} ${total}`} aria-hidden className={className}>
      <path d={WORDMARK} fill={tone === "dark" ? "#0b1a33" : "#ffffff"} fillRule="evenodd" />
      <text
        x="2"
        y={total - 2}
        textLength={w - 4}
        lengthAdjust="spacing"
        fontFamily="var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
        fontSize={sub * 1.05}
        fontWeight={500}
        fill={tone === "dark" ? "#535d74" : "rgba(255,255,255,0.72)"}
      >
        FINANCES PATRIMOINE
      </text>
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  id = "lm",
}: {
  className?: string;
  tone?: "dark" | "light";
  id?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark id={id} />
      <Wordmark tone={tone} className="h-[30px] w-auto" />
      <span className="sr-only">Voiland Finances Patrimoine</span>
    </span>
  );
}
