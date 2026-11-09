"use client";

import { CalendarDays, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useLayoutEffect, useState } from "react";

import { Logo } from "@/components/ui/logo";
import { mainNav } from "@/config/products";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermeture si la route est masquée (Activity) ou à la touche Échap.
  useLayoutEffect(() => () => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        data-spotlight=""
        className={cn(
          "glass mx-auto flex h-[60px] max-w-7xl items-center justify-between gap-4 rounded-full pl-3 pr-2 transition-[background,box-shadow] duration-500 sm:pl-4",
          scrolled ? "glass-strong" : "glass-soft",
        )}
      >
        <Link
          href="/"
          className="rounded-full"
          onNavigate={() => setOpen(false)}
        >
          <Logo />
          <span className="sr-only">, accueil</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.9rem] font-medium transition-colors duration-300",
                      active
                        ? "bg-white text-ink shadow-[0_1px_0_white_inset,0_4px_14px_-6px_rgb(11_26_51/0.25)] ring-1 ring-line"
                        : "text-muted hover:bg-white/60 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/rendez-vous"
            className="btn btn-primary hidden min-h-11 px-5 text-sm sm:inline-flex"
          >
            <CalendarDays className="relative z-10 h-4 w-4" aria-hidden />
            <span className="relative z-10">Prendre rendez-vous</span>
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-ink ring-1 ring-line xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            key="backdrop"
            className="fixed inset-0 -z-10 bg-cream/40 backdrop-blur-md xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        ) : null}
        {open ? (
          <m.nav
            key="menu"
            id="mobile-menu"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-strong mx-auto mt-3 max-w-7xl rounded-[28px] p-3 xl:hidden"
          >
            <ul className="grid gap-1">
              {mainNav.map((item, i) => (
                <m.li
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onNavigate={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center rounded-2xl px-4 text-[1.05rem] font-medium",
                      isActive(item.href)
                        ? "bg-white text-ink ring-1 ring-line"
                        : "text-ink-2 hover:bg-white/60",
                    )}
                  >
                    {item.label}
                  </Link>
                </m.li>
              ))}
            </ul>
            <Link
              href="/rendez-vous"
              onNavigate={() => setOpen(false)}
              className="btn btn-primary mt-3 w-full"
            >
              <CalendarDays className="relative z-10 h-4 w-4" aria-hidden />
              <span className="relative z-10">Prendre rendez-vous</span>
            </Link>
          </m.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
