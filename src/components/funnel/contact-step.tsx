"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

import { callbackSlots } from "@/lib/lead-schema";
import { CheckboxField, ChoiceCards, TextField } from "./fields";

/** Étape coordonnées commune à tous les parcours. */
export function ContactStep({ intro }: { intro?: string }) {
  const { register } = useFormContext();
  return (
    <div className="space-y-6">
      {intro ? <p className="text-muted">{intro}</p> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="firstName" label="Prénom" autoComplete="given-name" />
        <TextField name="lastName" label="Nom" autoComplete="family-name" />
        <TextField
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="prenom.nom@exemple.fr"
        />
        <TextField
          name="phone"
          label="Téléphone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="06 12 34 56 78"
        />
      </div>

      <ChoiceCards
        name="callbackSlot"
        legend="Quand préférez-vous être rappelé(e) ?"
        columns={2}
        size="sm"
        options={callbackSlots.map((s) => ({ value: s, label: s }))}
      />

      {/* Pot de miel : invisible pour les humains, rempli par les robots */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Site web
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="space-y-3 rounded-2xl bg-white/60 p-4 ring-1 ring-line">
        <CheckboxField name="consentContact" required>
          J&apos;accepte d&apos;être recontacté(e) par Voiland Finances &amp;
          Patrimoine, par téléphone ou par e-mail, afin de traiter ma demande.{" "}
          <span className="text-ink">(obligatoire)</span>
        </CheckboxField>
        <CheckboxField name="consentMarketing">
          J&apos;accepte de recevoir ponctuellement des informations et conseils
          de Voiland Finances &amp; Patrimoine. Désinscription possible à tout
          moment. (facultatif)
        </CheckboxField>
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-subtle">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          Vos données sont utilisées uniquement pour répondre à votre demande et
          ne sont jamais revendues. Vous disposez de droits d&apos;accès, de
          rectification et d&apos;effacement :{" "}
          <Link href="/politique-de-confidentialite" className="underline underline-offset-2">
            politique de confidentialité
          </Link>
          .
        </span>
      </p>
    </div>
  );
}
