import Image from "next/image";

import { MASCOT_ALT, mascotConfig } from "./config";

/**
 * Rendu à partir de l'image officielle (PNG détouré, fond transparent).
 * Les reflets sont masqués par la silhouette du PNG (mask-image) : la lumière
 * glisse uniquement sur le robot, jamais sur le fond.
 */
export function MascotImage({ className }: { className?: string }) {
  const { src, width, height, screen } = mascotConfig.image;
  return (
    <div className={className}>
      <div className="mascot-float relative">
        <div className="mascot-head-image relative">
          <Image
            src={src}
            alt={MASCOT_ALT}
            width={width}
            height={height}
            priority
            sizes="(min-width: 1024px) 520px, 80vw"
            className="h-auto w-full select-none"
            draggable={false}
          />
          <div
            aria-hidden
            className="mascot-png-sheen pointer-events-none absolute inset-0 overflow-hidden"
            style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
          >
            <span />
          </div>
          {screen ? (
            <svg
              aria-hidden
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              className="pointer-events-none absolute"
              style={{
                left: `${screen.x * 100}%`,
                top: `${screen.y * 100}%`,
                width: `${screen.width * 100}%`,
                height: `${screen.height * 100}%`,
              }}
            >
              <path
                className="draw-loop"
                pathLength={1}
                d="M6 50 C 18 46, 22 36, 34 38 S 52 46, 60 34 S 78 18, 94 10"
                fill="none"
                stroke="#ff8b74"
                strokeWidth="2.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          ) : null}
        </div>
      </div>
    </div>
  );
}
