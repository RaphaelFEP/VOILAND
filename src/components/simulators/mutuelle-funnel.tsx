"use client";

import { Briefcase, ScanSearch, Stethoscope, User, UserRound, Users } from "lucide-react";
import { z } from "zod";

import { ChoiceCards, MultiChoice, NumberField, SelectField } from "@/components/funnel/fields";
import { LeadFunnel, type FunnelStep } from "@/components/funnel/lead-funnel";
import { Checklist, Kpi, Notice } from "@/components/funnel/result-ui";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { contactDefaults, contactFieldsSchema } from "@/lib/lead-schema";
import { formatEur } from "@/lib/format";

const profiles = {
  particulier: "Particulier",
  famille: "Famille",
  independant: "Travailleur indépendant",
  liberal: "Profession libérale",
  senior: "Senior / retraité",
} as const;
const ages = {
  "-30": "Moins de 30 ans",
  "30-44": "30 à 44 ans",
  "45-59": "45 à 59 ans",
  "60-69": "60 à 69 ans",
  "70+": "70 ans et plus",
} as const;
const contracts = {
  individuel: "Oui, un contrat individuel",
  collectif: "Oui, via mon entreprise",
  aucun: "Non, pas de mutuelle",
} as const;
const priorities = {
  optique: "Optique",
  dentaire: "Dentaire",
  hospitalisation: "Hospitalisation",
  depassements: "Spécialistes & dépassements",
  douces: "Médecines douces",
  audio: "Aides auditives",
  maternite: "Maternité",
} as const;
const needs = {
  economie: "Payer le juste prix",
  remboursement: "Être mieux remboursé(e)",
  famille: "Couvrir toute la famille",
  retraite: "Adapter ma mutuelle à la retraite",
  complement: "Compléter le contrat de mon entreprise",
} as const;

const keys = <T extends Record<string, string>>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

const schema = contactFieldsSchema.extend({
  profile: z.enum(keys(profiles), { error: "Choisissez le profil qui vous correspond." }),
  ageRange: z.enum(keys(ages), { error: "Indiquez votre tranche d'âge." }),
  contractType: z.enum(keys(contracts), { error: "Indiquez votre situation actuelle." }),
  monthlyPremium: z
    .number({ error: "Montant invalide." })
    .min(0, { error: "Montant invalide." })
    .max(3000, { error: "Vérifiez ce montant (cotisation mensuelle)." })
    .optional(),
  priorities: z.array(z.string()).min(1, { error: "Sélectionnez au moins une priorité." }),
  mainNeed: z.enum(keys(needs), { error: "Choisissez votre besoin principal." }),
});
type Values = z.infer<typeof schema>;

const defaults = {
  ...contactDefaults,
  profile: undefined,
  ageRange: "30-44",
  contractType: undefined,
  monthlyPremium: undefined,
  priorities: [],
  mainNeed: undefined,
} as unknown as Values;

const checks: Record<keyof typeof priorities, string> = {
  optique:
    "plafonds de remboursement des montures et verres hors panier 100 % Santé, et fréquence de renouvellement.",
  dentaire:
    "prise en charge des prothèses, de l'implantologie et de l'orthodontie hors 100 % Santé, ainsi que les plafonds annuels.",
  hospitalisation:
    "chambre particulière, forfait journalier hospitalier et dépassements d'honoraires en clinique.",
  depassements:
    "taux exprimé en % de la base de remboursement et écart entre médecins adhérents ou non aux dispositifs de pratique tarifaire maîtrisée (OPTAM).",
  douces: "nombre de séances et montant remboursé par séance (ostéopathie, etc.).",
  audio: "prise en charge des aides auditives hors panier 100 % Santé et renouvellement.",
  maternite: "forfait naissance et chambre particulière en maternité.",
};

const profileTips: Record<keyof typeof profiles, string> = {
  particulier: "Un contrat ajusté à vos postes de dépenses réels évite de payer des garanties inutilisées.",
  famille: "Vérifiez la tarification des enfants (gratuité éventuelle à partir d'un certain rang) et les garanties orthodontie et optique.",
  independant: "Sous conditions, les cotisations d'un contrat « Madelin » peuvent être déductibles de votre bénéfice imposable.",
  liberal: "Sous conditions, les cotisations d'un contrat « Madelin » peuvent être déductibles de votre bénéfice imposable.",
  senior: "Après un an de contrat individuel, la résiliation est en principe possible à tout moment : l'occasion de revoir garanties et cotisation.",
};

function MutuelleResult({ v }: { v: Values }) {
  const annual = v.monthlyPremium ? v.monthlyPremium * 12 : null;
  const selected = (v.priorities ?? []) as (keyof typeof priorities)[];
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Kpi
          tone="ink"
          label="Votre cotisation annuelle"
          value={annual ? <AnimatedNumber value={annual} format={formatEur} /> : "Non renseignée"}
          hint={annual ? `Soit ${formatEur(v.monthlyPremium ?? 0)} par mois.` : "Indiquez-la pour une analyse plus précise."}
        />
        <Kpi
          tone="accent"
          label="Priorités à analyser"
          value={`${selected.length} poste${selected.length > 1 ? "s" : ""}`}
          hint={selected.map((p) => priorities[p]).join(" · ")}
        />
      </div>
      <Checklist
        title="Ce que nous vérifierons dans votre contrat"
        icon={ScanSearch}
        items={selected.map((p) => ({ title: priorities[p], text: checks[p] }))}
      />
      {v.profile ? (
        <Notice>
          <strong className="text-ink">Bon à savoir — </strong>
          {profileTips[v.profile]}
          {v.contractType === "collectif"
            ? " Votre contrat d'entreprise peut, le cas échéant, être complété par une surcomplémentaire."
            : ""}
        </Notice>
      ) : null}
      <p className="text-xs leading-relaxed text-subtle">
        Résultat indicatif fondé sur vos réponses. Aucun tarif ni niveau de garantie n&apos;est
        présumé : la comparaison est réalisée sur la base de votre tableau de garanties.
      </p>
    </div>
  );
}

const steps: FunnelStep<Values>[] = [
  {
    id: "profil",
    label: "Profil",
    title: "Commençons par vous.",
    description: "Votre profil oriente les points de vigilance de l'analyse.",
    fields: ["profile", "ageRange"],
    render: () => (
      <div className="space-y-6">
        <ChoiceCards
          name="profile"
          legend="Vous êtes"
          options={[
            { value: "particulier", label: profiles.particulier, icon: <User className="h-4 w-4" /> },
            { value: "famille", label: profiles.famille, icon: <Users className="h-4 w-4" /> },
            { value: "independant", label: profiles.independant, icon: <Briefcase className="h-4 w-4" /> },
            { value: "liberal", label: profiles.liberal, icon: <Stethoscope className="h-4 w-4" /> },
            { value: "senior", label: profiles.senior, icon: <UserRound className="h-4 w-4" /> },
          ]}
        />
        <SelectField
          name="ageRange"
          label="Tranche d'âge (assuré principal)"
          options={Object.entries(ages).map(([value, label]) => ({ value, label }))}
        />
      </div>
    ),
  },
  {
    id: "contrat",
    label: "Contrat",
    title: "Où en êtes-vous aujourd'hui ?",
    fields: ["contractType", "monthlyPremium"],
    render: (v) => (
      <div className="space-y-6">
        <ChoiceCards
          name="contractType"
          legend="Avez-vous une mutuelle actuellement ?"
          columns={1}
          options={Object.entries(contracts).map(([value, label]) => ({ value, label }))}
        />
        {v.contractType && v.contractType !== "aucun" ? (
          <NumberField
            name="monthlyPremium"
            label="Cotisation mensuelle actuelle"
            hint="Montant total pour l'ensemble des personnes couvertes, à votre charge."
            suffix="€ / mois"
            optional
            max={3000}
          />
        ) : null}
      </div>
    ),
  },
  {
    id: "priorites",
    label: "Priorités",
    title: "Quelles sont vos priorités de remboursement ?",
    fields: ["priorities", "mainNeed"],
    render: () => (
      <div className="space-y-7">
        <MultiChoice
          name="priorities"
          legend="Postes importants pour vous (plusieurs choix possibles)"
          options={Object.entries(priorities).map(([value, label]) => ({ value, label }))}
        />
        <ChoiceCards
          name="mainNeed"
          legend="Votre besoin principal"
          options={Object.entries(needs).map(([value, label]) => ({ value, label }))}
        />
      </div>
    ),
  },
  {
    id: "resultat",
    label: "Résultat",
    kind: "result",
    title: "Votre première lecture",
    description: "Voici les points clés à examiner pour votre situation.",
    nextLabel: "Comparer ma couverture",
    render: (v) => <MutuelleResult v={v} />,
  },
];

export function MutuelleFunnel() {
  return (
    <LeadFunnel<Values>
      id="diagnostic"
      schema={schema}
      defaultValues={defaults}
      steps={steps}
      product={() => "mutuelle"}
      objective={(v) => (v.mainNeed ? needs[v.mainNeed] : "")}
      contactTitle="Comparons votre couverture"
      summarize={(v) => [
        { label: "Profil", value: v.profile ? profiles[v.profile] : "" },
        { label: "Tranche d'âge", value: ages[v.ageRange] ?? "" },
        { label: "Mutuelle actuelle", value: v.contractType ? contracts[v.contractType] : "" },
        { label: "Cotisation mensuelle", value: v.monthlyPremium ? formatEur(v.monthlyPremium) : "Non renseignée" },
        {
          label: "Priorités",
          value: (v.priorities ?? []).map((p) => priorities[p as keyof typeof priorities]).join(", "),
        },
        { label: "Besoin principal", value: v.mainNeed ? needs[v.mainNeed] : "" },
      ]}
    />
  );
}

