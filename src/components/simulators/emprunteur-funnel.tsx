"use client";

import { Building, FileText, Home, KeyRound, Sparkles, Store } from "lucide-react";
import dynamic from "next/dynamic";
import { z } from "zod";

import { ChoiceCards, NumberField, SelectField } from "@/components/funnel/fields";
import { LeadFunnel, type FunnelStep } from "@/components/funnel/lead-funnel";
import { Checklist, Kpi, Notice } from "@/components/funnel/result-ui";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { minMeaningfulSaving } from "@/config/emprunteur-hypotheses";
import { estimateSavings, type SavingsResult } from "@/lib/calc/emprunteur-savings";
import { formatDuration, formatEur, formatEurCents, formatPct } from "@/lib/format";
import { contactDefaults, contactFieldsSchema } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";
import { SERIES } from "./series";

const EmprunteurChart = dynamic(() => import("./emprunteur-chart"), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-2xl bg-white/50" />,
});

const loanTypes = {
  rp: "Résidence principale",
  rs: "Résidence secondaire",
  locatif: "Investissement locatif",
  pro: "Prêt professionnel",
} as const;
const coverages = {
  "1": "Un emprunteur assuré à 100 %",
  "1b": "Deux emprunteurs à 50 % chacun",
  "2": "Deux emprunteurs à 100 % chacun",
} as const;
const coverageValue: Record<keyof typeof coverages, number> = { "1": 1, "1b": 1, "2": 2 };
const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

/** Mois courant (référence du calcul de la durée restante). */
function currentMonth() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

const keys = <T extends Record<string, string>>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

const schema = contactFieldsSchema
  .extend({
    loanType: z.enum(keys(loanTypes), { error: "Choisissez le type de crédit." }),
    loanAmount: z
      .number({ error: "Indiquez le montant emprunté." })
      .min(10_000, { error: "Montant minimum : 10 000 €." })
      .max(5_000_000, { error: "Vérifiez ce montant." }),
    startMonth: z.string().min(1),
    startYear: z
      .number({ error: "Indiquez l'année de début du prêt." })
      .int()
      .min(1995, { error: "Année trop ancienne." })
      .max(2100, { error: "Vérifiez l'année." }),
    durationYears: z
      .number({ error: "Indiquez la durée initiale." })
      .int({ error: "Durée en années entières." })
      .min(5, { error: "5 ans minimum." })
      .max(35, { error: "35 ans maximum." }),
    age: z
      .number({ error: "Indiquez votre âge." })
      .int({ error: "Âge en années entières." })
      .min(18, { error: "Âge minimum : 18 ans." })
      .max(85, { error: "Vérifiez votre âge." }),
    smoker: z.enum(["non", "oui"]),
    coverage: z.enum(keys(coverages)),
    currentMonthly: z.number({ error: "Montant invalide." }).min(1, { error: "Montant invalide." }).max(20_000).optional(),
    loanRate: z.number({ error: "Taux invalide." }).min(0, { error: "Taux invalide." }).max(15, { error: "Vérifiez ce taux." }).optional(),
  })
  .superRefine((v, ctx) => {
    const now = currentMonth();
    const elapsed = (now.year - v.startYear) * 12 + (now.month - Number(v.startMonth));
    if (elapsed < 0) {
      ctx.addIssue({ code: "custom", path: ["startYear"], message: "La date de début ne peut pas être dans le futur." });
    } else if (v.durationYears && elapsed >= v.durationYears * 12) {
      ctx.addIssue({ code: "custom", path: ["durationYears"], message: "D'après ces dates, le prêt serait déjà remboursé." });
    }
  });
type Values = z.infer<typeof schema>;

const defaults = {
  ...contactDefaults,
  loanType: undefined,
  loanAmount: undefined,
  startMonth: "1",
  startYear: undefined,
  durationYears: 20,
  age: undefined,
  smoker: "non",
  coverage: "1",
  currentMonthly: undefined,
  loanRate: undefined,
} as unknown as Values;

function compute(v: Values): SavingsResult {
  return estimateSavings({
    loanAmount: v.loanAmount ?? 0,
    startYear: v.startYear ?? currentMonth().year,
    startMonth: Number(v.startMonth ?? 1),
    durationYears: v.durationYears ?? 20,
    age: v.age ?? 40,
    smoker: v.smoker === "oui",
    coverage: coverageValue[v.coverage ?? "1"],
    currentMonthly: v.currentMonthly,
    loanRate: v.loanRate,
    now: currentMonth(),
  });
}

const precisionLabels = {
  1: { title: "Estimation sommaire", tip: "Ajoutez votre cotisation actuelle (étape précédente) pour affiner nettement le résultat." },
  2: { title: "Estimation affinée", tip: "Ajoutez le taux de votre crédit pour préciser le capital restant dû." },
  3: { title: "Estimation précise sur vos données", tip: "Prochaine étape : vérification sur votre tableau d'amortissement, puis devis d'assureur." },
} as const;

function CompareBar({ label, value, max, color, hint }: { label: string; value: number; max: number; color: string; hint: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-semibold tabular-nums text-ink">{formatEur(value)}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ width: `${max > 0 ? Math.max(3, (value / max) * 100) : 0}%`, background: color }}
        />
      </div>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function Result({ v }: { v: Values }) {
  const r = compute(v);
  const competitive = r.saving < minMeaningfulSaving;
  const p = precisionLabels[r.precision];
  return (
    <div className="space-y-5">
      {/* Économie */}
      <div className="glass-ink relative overflow-hidden rounded-3xl p-6 sm:p-7">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-coral/30 blur-3xl" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-peach">Votre économie potentielle</p>
        {competitive ? (
          <>
            <p className="relative mt-3 text-2xl font-semibold leading-snug text-white sm:text-3xl">
              Votre contrat semble déjà bien placé.
            </p>
            <p className="relative mt-2 text-sm text-white/75">
              L&apos;écart estimé est faible. Une étude peut tout de même vérifier vos garanties et
              les options disponibles.
            </p>
          </>
        ) : (
          <>
            <p className="relative mt-3 text-white">
              <span className="block text-base text-white/80">Vous pourriez économiser environ</span>
              <span className="mt-1 block text-[2.6rem] font-semibold leading-none tracking-tight tabular-nums sm:text-6xl">
                <AnimatedNumber value={r.saving} format={formatEur} duration={1.3} />
              </span>
              <span className="mt-2 block text-sm text-white/75">
                sur les {formatDuration(r.remainingMonths)} restants de votre prêt
              </span>
            </p>
            <p className="relative mt-4 inline-flex rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white ring-1 ring-white/15">
              Fourchette probable : {formatEur(r.savingLow)} à {formatEur(r.savingHigh)}
            </p>
          </>
        )}
      </div>

      {/* Comparaison */}
      <div className="space-y-4 rounded-2xl bg-white/75 p-5 ring-1 ring-line">
        <p className="text-sm font-semibold text-ink">Coût restant de votre assurance</p>
        <CompareBar
          label="Contrat actuel"
          value={r.currentCost}
          max={r.currentCost}
          color={SERIES.gross}
          hint={
            r.currentAssumed
              ? `Estimé (contrat groupe bancaire moyen) : ≈ ${formatEurCents(r.currentMonthlyUsed)} / mois.`
              : `D'après votre cotisation : ${formatEurCents(r.currentMonthlyUsed)} / mois.`
          }
        />
        <CompareBar
          label="Après changement (estimé)"
          value={r.newCost}
          max={r.currentCost}
          color={SERIES.net}
          hint="Assurance déléguée moyenne, calculée sur le capital restant dû."
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi label="Gain mensuel moyen" value={`${formatEurCents(r.monthlyGain)}`} />
        <Kpi label="Taux d'économie" value={formatPct(Math.round(r.savingRate * 100) / 100)} />
        <Kpi label="Durée restante" value={formatDuration(r.remainingMonths)} />
      </div>

      {/* Précision */}
      <div className="rounded-2xl bg-white/75 p-5 ring-1 ring-line">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink">Niveau de précision : {p.title}</p>
          <div className="flex gap-1" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn("h-2 w-7 rounded-full", n <= r.precision ? "bg-gradient-to-r from-coral to-rose" : "bg-ink/10")} />
            ))}
          </div>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{p.tip}</p>
      </div>

      <div className="rounded-2xl bg-white/75 p-4 ring-1 ring-line">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">Coût cumulé jusqu&apos;au terme</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <li className="flex items-center gap-1.5">
              <span aria-hidden className="h-0.5 w-4 rounded" style={{ background: SERIES.gross }} /> Assurance actuelle
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden className="h-0.5 w-4 rounded" style={{ background: SERIES.net }} /> Après changement (estimé)
            </li>
          </ul>
        </div>
        <div className="mt-3" role="img" aria-label={`Coût cumulé : ${formatEur(r.currentCost)} avec l'assurance actuelle contre environ ${formatEur(r.newCost)} après changement.`}>
          <EmprunteurChart data={r.yearly} />
        </div>
      </div>

      {v.loanType !== "pro" ? (
        <Notice>
          <strong className="text-ink">Vous pouvez changer à tout moment — </strong>
          l&apos;assurance d&apos;un crédit immobilier peut être changée à tout moment, sans frais, à
          garanties équivalentes à celles exigées par la banque (loi Lemoine).
        </Notice>
      ) : null}
      <p className="text-xs leading-relaxed text-subtle">
        Estimation indicative et non contractuelle, établie à partir de grilles tarifaires moyennes du
        marché retenues par le cabinet
        {r.loanRateAssumed ? `, d'un taux de crédit moyen de ${r.loanRateUsed.toLocaleString("fr-FR")} % pour l'année de signature` : ""}
        {r.currentAssumed ? " et d'une cotisation actuelle estimée" : ""}. Le tarif réel dépend
        notamment de votre santé, de votre profession, de vos activités et des garanties exigées par
        votre banque. Seul un devis d&apos;assureur, à garanties équivalentes, confirme l&apos;économie.
      </p>
    </div>
  );
}

const steps: FunnelStep<Values>[] = [
  {
    id: "pret",
    label: "Votre prêt",
    title: "Votre prêt en quelques chiffres",
    description: "Des valeurs approximatives suffisent pour une première estimation.",
    fields: ["loanType", "loanAmount", "startMonth", "startYear", "durationYears"],
    render: () => (
      <div className="space-y-6">
        <ChoiceCards
          name="loanType"
          legend="Type de crédit"
          size="sm"
          options={[
            { value: "rp", label: loanTypes.rp, icon: <Home className="h-4 w-4" /> },
            { value: "rs", label: loanTypes.rs, icon: <KeyRound className="h-4 w-4" /> },
            { value: "locatif", label: loanTypes.locatif, icon: <Building className="h-4 w-4" /> },
            { value: "pro", label: loanTypes.pro, icon: <Store className="h-4 w-4" /> },
          ]}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField name="loanAmount" label="Montant initial du prêt" suffix="€" className="sm:col-span-2" placeholder="250000" />
          <SelectField name="startMonth" label="Début du prêt : mois" options={months.map((m, i) => ({ value: String(i + 1), label: m }))} />
          <NumberField name="startYear" label="Année" suffix="" placeholder="2021" min={1995} max={2100} />
          <NumberField name="durationYears" label="Durée initiale" suffix="ans" min={5} max={35} className="sm:col-span-2" />
        </div>
      </div>
    ),
  },
  {
    id: "assure",
    label: "Votre profil",
    title: "Vous et votre assurance actuelle",
    fields: ["age", "smoker", "coverage", "currentMonthly", "loanRate"],
    render: () => (
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField name="age" label="Votre âge actuel" suffix="ans" max={85} />
          <ChoiceCards
            name="smoker"
            legend="Statut fumeur"
            size="sm"
            options={[
              { value: "non", label: "Non-fumeur" },
              { value: "oui", label: "Fumeur" },
            ]}
          />
        </div>
        <SelectField name="coverage" label="Personnes assurées" options={Object.entries(coverages).map(([value, label]) => ({ value, label }))} />
        <div className="rounded-2xl bg-peach-2/50 p-4 ring-1 ring-coral/20">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-coral-ink" aria-hidden /> Pour affiner l&apos;estimation
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <NumberField
              name="currentMonthly"
              label="Cotisation mensuelle d'assurance"
              suffix="€ / mois"
              optional
              hint="Total pour toutes les personnes assurées."
            />
            <NumberField name="loanRate" label="Taux du crédit" suffix="%" optional step={0.01} max={15} hint="Taux nominal, hors assurance." />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "resultat",
    label: "Économie",
    kind: "result",
    title: "Votre estimation",
    nextLabel: "Faire vérifier mon économie",
    render: (v) => <Result v={v} />,
  },
];

export function EmprunteurFunnel({ className }: { className?: string }) {
  return (
    <LeadFunnel<Values>
      id="diagnostic"
      className={className}
      schema={schema}
      defaultValues={defaults}
      steps={steps}
      product={() => "emprunteur"}
      objective={() => "Vérification de l'économie sur l'assurance emprunteur"}
      contactTitle="Faites vérifier votre économie gratuitement"
      contactIntro="Je vous rappelle sous 24 h. Je recalcule votre économie sur vos véritables échéances, je la confirme avec un devis d'assureur à garanties équivalentes, puis je m'occupe des formalités si vous le souhaitez."
      submitLabel="Vérifier mon économie"
      header={
        <div className="mb-6 flex items-center gap-3 border-b border-line pb-5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white">
            <FileText className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Estimez votre économie</p>
            <p className="text-xs text-muted">1 minute · sans document · sans inscription</p>
          </div>
        </div>
      }
      summarize={(v) => {
        const r = compute(v);
        return [
          { label: "Type de crédit", value: v.loanType ? loanTypes[v.loanType] : "" },
          { label: "Montant initial", value: formatEur(v.loanAmount ?? 0) },
          { label: "Début du prêt", value: `${months[Number(v.startMonth) - 1] ?? ""} ${v.startYear ?? ""}` },
          { label: "Durée initiale", value: `${v.durationYears} ans` },
          { label: "Âge", value: v.age ? `${v.age} ans` : "" },
          { label: "Fumeur", value: v.smoker === "oui" ? "Oui" : "Non" },
          { label: "Personnes assurées", value: coverages[v.coverage] ?? "" },
          { label: "Cotisation mensuelle déclarée", value: v.currentMonthly ? formatEurCents(v.currentMonthly) : "Non renseignée" },
          { label: "Taux du crédit déclaré", value: v.loanRate ? `${v.loanRate} %` : "Non renseigné" },
          { label: "Durée restante", value: formatDuration(r.remainingMonths) },
          { label: "Coût restant estimé (actuel)", value: formatEur(r.currentCost) },
          { label: "Coût estimé après changement", value: formatEur(r.newCost) },
          { label: "Économie estimée (indicative)", value: `${formatEur(r.saving)} (fourchette ${formatEur(r.savingLow)} – ${formatEur(r.savingHigh)})` },
        ];
      }}
    />
  );
}

export const emprunteurDocuments = [
  { title: "Tableau d'amortissement", text: "pour recalculer l'économie sur vos véritables échéances." },
  { title: "Offre de prêt", text: "pour connaître les garanties et quotités exigées par la banque." },
  { title: "Fiche standardisée d'information", text: "qui récapitule les garanties minimales attendues." },
  { title: "Conditions de votre contrat actuel", text: "pour comparer à garanties équivalentes." },
];

export function DocumentsChecklist() {
  return <Checklist title="Documents utiles pour la vérification" icon={FileText} items={emprunteurDocuments} />;
}
