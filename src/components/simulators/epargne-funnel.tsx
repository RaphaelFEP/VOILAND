"use client";

import { Landmark, PiggyBank, Sparkles } from "lucide-react";
import { z } from "zod";

import { ChoiceCards, SelectField } from "@/components/funnel/fields";
import { LeadFunnel, type FunnelStep } from "@/components/funnel/lead-funnel";
import { Checklist, Kpi, Notice } from "@/components/funnel/result-ui";
import { formatEur, formatPct } from "@/lib/format";
import { contactDefaults, contactFieldsSchema } from "@/lib/lead-schema";
import type { EpargneSnapshot } from "./epargne-experience";

const tracks = {
  av: "Assurance-vie",
  per: "Plan d'Épargne Retraite (PER)",
  conseil: "Je souhaite être conseillé(e)",
} as const;
const goals = {
  retraite: "Préparer ma retraite",
  valoriser: "Valoriser un capital",
  projet: "Financer un projet à moyen terme",
  transmettre: "Transmettre à mes proches",
  impots: "Optimiser ma fiscalité",
} as const;
const existing = {
  aucun: "Aucun contrat",
  av: "Une ou plusieurs assurances-vie",
  per: "Un PER ou ancien contrat retraite",
  both: "Les deux",
} as const;
const amounts = {
  "0-10": "Moins de 10 000 €",
  "10-50": "10 000 à 50 000 €",
  "50-150": "50 000 à 150 000 €",
  "150-500": "150 000 à 500 000 €",
  "500+": "Plus de 500 000 €",
} as const;
const risks = {
  prudent: "Prudent",
  equilibre: "Équilibré",
  dynamique: "Dynamique",
} as const;

const keys = <T extends Record<string, string>>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

const schema = contactFieldsSchema.extend({
  track: z.enum(keys(tracks), { error: "Choisissez un parcours." }),
  goal: z.enum(keys(goals), { error: "Choisissez votre objectif principal." }),
  existing: z.enum(keys(existing), { error: "Indiquez vos contrats actuels." }),
  amount: z.enum(keys(amounts)),
  risk: z.enum(keys(risks), { error: "Choisissez votre sensibilité au risque." }),
});
type Values = z.infer<typeof schema>;

export function EpargneFunnel({ snapshot, className }: { snapshot: EpargneSnapshot; className?: string }) {
  const defaults = {
    ...contactDefaults,
    track: snapshot.track,
    goal: undefined,
    existing: undefined,
    amount: "10-50",
    risk: undefined,
  } as unknown as Values;

  const simulationSummary = [
    { label: "Simulation — capital initial", value: formatEur(snapshot.input.initial) },
    { label: "Simulation — épargne mensuelle", value: formatEur(snapshot.input.monthly) },
    { label: "Simulation — horizon", value: `${snapshot.input.years} ans` },
    { label: "Simulation — taux supposé", value: formatPct(snapshot.input.rate) },
    { label: "Simulation — capital final (illustratif)", value: formatEur(snapshot.finalCapital) },
    ...(snapshot.tmi !== null ? [{ label: "TMI déclarée", value: `${Math.round(snapshot.tmi * 100)} %` }] : []),
  ];

  const steps: FunnelStep<Values>[] = [
    {
      id: "projet",
      label: "Projet",
      title: "Quel est votre projet ?",
      fields: ["track", "goal"],
      render: () => (
        <div className="space-y-6">
          <ChoiceCards
            name="track"
            legend="Parcours"
            columns={3}
            options={[
              { value: "av", label: tracks.av, icon: <PiggyBank className="h-4 w-4" /> },
              { value: "per", label: "PER", description: "Plan d'Épargne Retraite", icon: <Landmark className="h-4 w-4" /> },
              { value: "conseil", label: "Me faire conseiller", icon: <Sparkles className="h-4 w-4" /> },
            ]}
          />
          <ChoiceCards name="goal" legend="Votre objectif principal" options={Object.entries(goals).map(([value, label]) => ({ value, label }))} />
        </div>
      ),
    },
    {
      id: "situation",
      label: "Situation",
      title: "Votre situation d'épargnant",
      fields: ["existing", "amount", "risk"],
      render: () => (
        <div className="space-y-6">
          <ChoiceCards name="existing" legend="Contrats détenus" options={Object.entries(existing).map(([value, label]) => ({ value, label }))} />
          <SelectField name="amount" label="Montant total de votre épargne financière" options={Object.entries(amounts).map(([value, label]) => ({ value, label }))} />
          <ChoiceCards
            name="risk"
            legend="Votre rapport au risque"
            columns={3}
            size="sm"
            options={[
              { value: "prudent", label: risks.prudent, description: "Stabilité avant tout" },
              { value: "equilibre", label: risks.equilibre, description: "Compromis risque / potentiel" },
              { value: "dynamique", label: risks.dynamique, description: "Horizon long, fluctuations acceptées" },
            ]}
          />
        </div>
      ),
    },
    {
      id: "resultat",
      label: "Synthèse",
      kind: "result",
      title: "Votre synthèse",
      nextLabel: "Faire analyser mon épargne",
      render: (v) => (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Kpi tone="ink" label={`Capital final illustratif · ${snapshot.input.years} ans`} value={formatEur(snapshot.finalCapital)} hint={`Hypothèse de ${formatPct(snapshot.input.rate)} / an, non garantie.`} />
            <Kpi tone="accent" label="Effort d'épargne" value={formatEur(snapshot.contributions)} hint="Total des versements simulés." />
          </div>
          <Checklist
            title="Ce que j'analyserai"
            items={[
              { title: "Frais réels", text: "frais de gestion, d'arbitrage et sur versements de vos contrats, et frais des supports." },
              { title: "Allocation", text: `cohérence entre vos supports et un profil ${v.risk ? risks[v.risk].toLowerCase() : "à définir"}.` },
              ...(v.track === "per"
                ? [{ title: "Plafond de déduction", text: "montant réellement déductible et intérêt de la déduction selon votre TMI actuelle et future." }]
                : v.track === "av"
                  ? [{ title: "Clause bénéficiaire", text: "rédaction adaptée à votre situation familiale et à vos objectifs de transmission." }]
                  : [{ title: "Choix de l'enveloppe", text: "assurance-vie, PER ou combinaison des deux selon votre horizon et votre fiscalité." }]),
            ]}
          />
          <Notice>Synthèse indicative fondée sur votre simulation et vos réponses. Elle ne constitue pas un conseil en investissement.</Notice>
        </div>
      ),
    },
  ];

  return (
    <LeadFunnel<Values>
      id="diagnostic"
      className={className}
      schema={schema}
      defaultValues={defaults}
      steps={steps}
      product={(v) => (v.track === "per" ? "per" : "assurance-vie")}
      objective={(v) => (v.goal ? goals[v.goal] : "")}
      contactTitle="Recevez l'analyse de votre épargne"
      summarize={(v) => [
        { label: "Parcours", value: v.track ? tracks[v.track] : "" },
        { label: "Objectif", value: v.goal ? goals[v.goal] : "" },
        { label: "Contrats détenus", value: v.existing ? existing[v.existing] : "" },
        { label: "Épargne financière", value: amounts[v.amount] ?? "" },
        { label: "Profil de risque déclaré", value: v.risk ? risks[v.risk] : "" },
        ...simulationSummary,
      ]}
    />
  );
}
