"use client";

import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  consentCategories,
  useConsent,
  type ConsentCategory,
} from "./consent-provider";

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
        checked ? "bg-ink" : "bg-ink/15",
        disabled && "opacity-60",
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export function ConsentBanner() {
  const { consent, ready, preferencesOpen, openPreferences, closePreferences, save } =
    useConsent();
  const titleId = useId();
  const [choices, setChoices] = useState<Record<ConsentCategory, boolean>>({
    thirdParty: false,
    marketing: false,
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  const hasCategories = consentCategories.length > 0;
  const showBanner = ready && hasCategories && !consent && !preferencesOpen;

  useEffect(() => {
    if (preferencesOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChoices({
        thirdParty: !!consent?.thirdParty,
        marketing: !!consent?.marketing,
      });
      dialogRef.current?.focus();
    }
  }, [preferencesOpen, consent]);

  useEffect(() => {
    if (!preferencesOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePreferences();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preferencesOpen, closePreferences]);

  const all = (v: boolean) =>
    save({ thirdParty: v, marketing: v });

  return (
    <AnimatePresence>
      {showBanner ? (
        <m.div
          key="banner"
          role="region"
          aria-label="Gestion des cookies"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md"
        >
          <div className="glass glass-strong rounded-3xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-peach-2 text-coral-ink">
                <Cookie className="h-4 w-4" aria-hidden />
              </span>
              <p className="text-sm leading-relaxed text-muted">
                Nous utilisons des traceurs uniquement avec votre accord, pour
                afficher notre agenda de rendez-vous et suivre la relation
                commerciale. Vous pouvez changer d&apos;avis à tout moment.{" "}
                <Link href="/cookies" className="font-medium text-ink underline underline-offset-2">
                  En savoir plus
                </Link>
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" className="btn btn-glass min-h-11 text-sm" onClick={() => all(false)}>
                Tout refuser
              </button>
              <button type="button" className="btn btn-primary min-h-11 text-sm" onClick={() => all(true)}>
                <span className="relative z-10">Tout accepter</span>
              </button>
              <button
                type="button"
                className="col-span-2 py-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline"
                onClick={openPreferences}
              >
                Personnaliser mes choix
              </button>
            </div>
          </div>
        </m.div>
      ) : null}

      {preferencesOpen ? (
        <m.div
          key="prefs"
          className="fixed inset-0 z-[70] grid place-items-end bg-ink/25 p-3 backdrop-blur-sm sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && closePreferences()}
        >
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ y: 24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-strong w-full max-w-lg rounded-3xl p-6 outline-none sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id={titleId} className="text-xl font-semibold text-ink">
                Préférences de confidentialité
              </h2>
              <button
                type="button"
                onClick={closePreferences}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/70 ring-1 ring-line"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start justify-between gap-4 rounded-2xl bg-white/60 p-4 ring-1 ring-line">
                <div>
                  <p className="font-medium text-ink">Strictement nécessaires</p>
                  <p className="mt-1 text-sm text-muted">
                    Mémorisation de vos choix et fonctionnement des formulaires. Toujours actifs.
                  </p>
                </div>
                <Toggle checked disabled label="Strictement nécessaires (toujours actifs)" />
              </li>
              {consentCategories.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-white/60 p-4 ring-1 ring-line"
                >
                  <div>
                    <p className="font-medium text-ink">{c.title}</p>
                    <p className="mt-1 text-sm text-muted">{c.description}</p>
                  </div>
                  <Toggle
                    checked={choices[c.id]}
                    label={c.title}
                    onChange={(v) => setChoices((s) => ({ ...s, [c.id]: v }))}
                  />
                </li>
              ))}
              {!hasCategories ? (
                <li className="rounded-2xl bg-white/60 p-4 text-sm text-muted ring-1 ring-line">
                  Aucun traceur non essentiel n&apos;est actuellement utilisé sur ce site.
                </li>
              ) : null}
            </ul>
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button type="button" className="btn btn-glass min-h-11 text-sm" onClick={() => all(false)}>
                Tout refuser
              </button>
              <button type="button" className="btn btn-glass min-h-11 text-sm" onClick={() => save(choices)}>
                Enregistrer
              </button>
              <button type="button" className="btn btn-primary min-h-11 text-sm" onClick={() => all(true)}>
                <span className="relative z-10">Tout accepter</span>
              </button>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ConsentPreferencesButton({ className }: { className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      Gérer les cookies
    </button>
  );
}
