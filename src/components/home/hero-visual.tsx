"use client";

import { HeartPulse, Home, ShieldCheck, Sprout } from "lucide-react";
import Link from "next/link";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

import { Mascot } from "@/components/mascot/mascot";
import { Layer, MascotStage } from "@/components/mascot/mascot-stage";
import { products } from "@/config/products";
import { cn } from "@/lib/utils";

type FloatCard = {
  href: string;
  title: string;
  caption: string;
  icon: ReactNode;
  position: string;
  depth: number;
  delay: number;
  extra?: ReactNode;
};

const Spark = () => (
  <svg viewBox="0 0 80 24" className="mt-2 h-6 w-full" aria-hidden>
    <defs>
      <linearGradient id="spark-g" x1="0" x2="1">
        <stop offset="0" stopColor="#f5a6bf" />
        <stop offset="1" stopColor="#ff8b74" />
      </linearGradient>
    </defs>
    <path
      className="draw-loop"
      pathLength={1}
      d="M2 20 C 12 19, 16 14, 26 15 S 40 18, 48 12 S 64 6, 78 3"
      fill="none"
      stroke="url(#spark-g)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const cards: FloatCard[] = [
  {
    href: products.mutuelle.href,
    title: "Santé",
    caption: "Mutuelle adaptée",
    icon: <HeartPulse className="h-4 w-4" />,
    position: "lg:left-[-22%] lg:top-[36%]",
    depth: 1.8,
    delay: 0,
  },
  {
    href: products.prevoyance.href,
    title: "Prévoyance",
    caption: "Revenus protégés",
    icon: <ShieldCheck className="h-4 w-4" />,
    position: "lg:right-[-16%] lg:top-[2%]",
    depth: 2.3,
    delay: 1.2,
  },
  {
    href: products.emprunteur.href,
    title: "Assurance emprunteur",
    caption: "Coût du crédit maîtrisé",
    icon: <Home className="h-4 w-4" />,
    position: "lg:left-[-12%] lg:bottom-[6%]",
    depth: 2.1,
    delay: 2.1,
  },
  {
    href: products.epargne.href,
    title: "Épargne & Retraite",
    caption: "Trajectoire illustrative",
    icon: <Sprout className="h-4 w-4" />,
    position: "lg:right-[-18%] lg:bottom-[24%]",
    depth: 1.6,
    delay: 0.6,
    extra: <Spark />,
  },
];

function CardInner({ card }: { card: FloatCard }) {
  return (
    <>
      <span className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-peach to-rose-2 text-coral-ink shadow-[inset_0_1px_0_white]">
          {card.icon}
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.92rem] font-semibold text-ink">{card.title}</span>
          <span className="text-[0.78rem] text-muted">{card.caption}</span>
        </span>
      </span>
      {card.extra}
    </>
  );
}

export function HeroVisual() {
  return (
    <div className="relative">
      <MascotStage className="relative mx-auto aspect-[420/520] w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[480px]">
        {(layer) => (
          <>
            {/* disque de verre derrière la mascotte */}
            <Layer layer={layer(0.5)} className="absolute inset-[6%_-4%_10%_-4%]">
              <div className="glass glass-soft h-full w-full rounded-full opacity-80" />
            </Layer>

            <m.div
              className="absolute inset-0"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <Layer layer={layer(1)} tilt className="h-full w-full">
                <Mascot className="h-full w-full drop-shadow-[0_40px_60px_rgba(11,26,51,0.12)]" />
              </Layer>
            </m.div>

            {/* Cartes flottantes (desktop) */}
            {cards.map((card, i) => (
              <m.div
                key={card.href}
                className={cn("absolute hidden lg:block", card.position)}
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.7 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Layer layer={layer(card.depth)}>
                  <div
                    className="animate-float"
                    style={{ animationDelay: `${card.delay}s` }}
                  >
                    <Link
                      href={card.href}
                      data-spotlight=""
                      className="glass glass-strong block w-[212px] rounded-[22px] p-3.5 transition-transform duration-500 hover:-translate-y-1 hover:scale-[1.02]"
                    >
                      <CardInner card={card} />
                    </Link>
                  </div>
                </Layer>
              </m.div>
            ))}
          </>
        )}
      </MascotStage>

      {/* Cartes en grille (mobile / tablette) */}
      <ul className="mt-6 grid grid-cols-2 gap-3 lg:hidden">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="glass glass-strong block h-full rounded-[20px] p-3"
            >
              <CardInner card={card} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
