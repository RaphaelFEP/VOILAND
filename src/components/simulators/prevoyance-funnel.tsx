"use client";

import { Briefcase, Building2, Gavel, HandHeart, Hammer, ScanSearch, Stethoscope } from "lucide-react";
import { z } from "zod";

import { ChoiceCards, MultiChoice, NumberField, SelectField } from "@/components/funnel/fields";
import { LeadFunnel, type FunnelStep } from "@/components/funnel/lead-funnel";
import { Checklist, Kpi, Notice } from "@/components/funnel/result-ui";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { computePrevoyance } from "@/lib/calc/prevoyance";
import { formatEur, formatPct } from "@/lib/format";
import { contactDefaults, contactFieldsSchema } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";

const professions = {
  kine: "Kinésithérapeute",
  medecin: "Médecin",
  avocat: "Avocat",
  liberal: "Autre profession libérale",
  dirigeant: "Dirigeant",
  independant: "Artisan, commerçant, indépendant",
} as const;
const coverages = {
  oui: "Oui, un contrat de prévoyance",
  non: "Non, uniquement le régime obligatoire",
  inconnu: "Je ne sais pas",
} as const;
const franchises = {
  "0": "Aucune / 0 jour",
  "3": "3 jours",
  "15": "15 jours",
  "30": "30 jours",
  "90": "90 jours",
  inconnu: "Je ne sais pas",
} as const;
const targets = {
  "1": "Maintenir 100 % de mon revenu",
  "0.8": "Maintenir environ 80 % de mon revenu",
  charges: "Couvrir au minimum mes charges fixes",
} as const;
const concerns = {
  arret: "Arrêt de travail",
  invalidite: "Invalidité",
  frais: "Frais professionnels",
  deces: "Protection de mes proches",
} as const;

const keys = <T extends Record<string, string>>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];
const money = (max: number, msg: string) =>
  z.number({ error: msg }).min(0, { error: "Montant invalide." }).max(max, { error: "Vérifiez ce montant." });

const schema = contactFieldsSchema.extend({
  profession: z.enum(keys(professions), { error: "Choisissez votre profession." }),
  monthlyIncome: money(200_000, "Indiquez votre revenu net mensuel moyen."),
  proCharges: money(200_000, "Indiquez vos charges professionnelles (0 si aucune).").optional(),
  personalCharges: money(100_000, "Indiquez vos charges personnelles fixes."),
  coverage: z.enum(keys(coverages), { error: "Indiquez votre situation." }),
  dailyAllowance: money(5_000, "Montant invalide.").optional(),
  franchise: z.enum(keys(franchises)),
  savings: money(10_000_000, "Montant invalide.").optional(),
  target: z.enum(keys(targets), { error: "Choisissez le niveau de maintien souhaité." }),
  concerns: z.array(z.string()),
});
type Values = z.infer<typeof schema>;

const defaults = {
  ...contactDefaults,
  profession: undefined,
  monthlyIncome: undefined,
  proCharges: undefined,
  personalCharges: undefined,
  coverage: undefined,
  dailyAllowance: undefined,
  franchise: "inconnu",
  savings: undefined,
  target: undefined,
  concerns: ["arret"],
} as unknown as Values;

function compute(v: Values) {
  const franchiseDays = v.franchise && v.franchise !== "inconnu" ? Number(v.franchise) : 0;
  return computePrevoyance({
    monthlyIncome: v.monthlyIncome ?? 0,
    proCharges: v.proCharges ?? 0,
    personalCharges: v.personalCharges ?? 0,
    dailyAllowance: v.coverage === "oui" ? (v.dailyAllowance ?? 0) : 0,
    franchiseDays,
    targetShare: v.target === "charges" ? 0 : Number(v.target ?? 1),
    savings: v.savings ?? 0,
  });
}

const regimeNotes: Record<keyof typeof professions, string> = {
  kine: "Pour les auxiliaires médicaux, les indemnités du régime obligatoire relèvent successivement de l'Assurance maladie puis, au-delà d'une certaine durée, de votre caisse (CARPIMKO). Montants et délais sont à vérifier sur vos relevés.",
  medecin: "Pour les médecins libéraux, l'indemnisation obligatoire relève de l'Assurance maladie puis, après une certaine durée d'arrêt, de la CARMF. Montants et délais sont à vérifier sur vos relevés.",
  avocat: "Pour les avocats, la couverture obligatoire combine plusieurs dispositifs (Assurance maladie, régime de la profession, éventuels contrats du barreau). Leur articulation mérite une lecture attentive.",
  liberal: "Les professions libérales relèvent de l'Assurance maladie pour les premiers mois d'arrêt, puis, selon les cas, de leur caisse professionnelle. Montants et délais sont à vérifier.",
  dirigeant: "La protection d'un dirigeant dépend de son statut (assimilé salarié ou travailleur non salarié) et des contrats souscrits par la société. J'analyse les deux niveaux.",
  independant: "Les indemnités journalières des indépendants sont plafonnées et assorties d'un délai de carence ; elles couvrent rarement l'ensemble des charges fixes.",
};

function Gauge({ ratio }: { ratio: number }) {
  const pct = Math.max(0, Math.min(1, ratio));
  const R = 52;
  const C = Math.PI * R;
  return (
    <svg viewBox="0 0 128 76" className="h-auto w-full max-w-[200px]" role="img" aria-label={`Couverture déclarée : ${formatPct(pct)} du besoin`}>
      <defs>
        <linearGradient id="gauge-g" x1="0" x2="1">
          <stop offset="0" stopColor="#f5a6bf" />
          <stop offset="1" stopColor="#ff8b74" />
        </linearGradient>
      </defs>
      <path d="M12 66 A52 52 0 0 1 116 66" fill="none" stroke="rgb(11 26 51 / .1)" strokeWidth="10" strokeLinecap="round" />
      <path
        d="M12 66 A52 52 0 0 1 116 66"
        fill="none"
        stroke="url(#gauge-g)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - pct)}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}
      />
      <text x="64" y="60" textAnchor="middle" className="fill-ink text-[20px] font-semibold">
        {Math.round(pct * 100)} %
      </text>
    </svg>
  );
}

function PrevoyanceResult({ v }: { v: Values }) {
  const r = compute(v);
  const months = r.autonomyMonths;
  const autonomy =
    !Number.isFinite(months) ? "Écart couvert" : months < 1 ? "Moins d'un mois" : `≈ ${Math.floor(months)} mois`;
  const unknownCoverage = v.coverage !== "oui" || !v.dailyAllowance;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex flex-col items-center rounded-2xl bg-white/75 p-4 ring-1 ring-line">
          <Gauge ratio={r.coverageRatio} />
          <p className="mt-1 text-center text-xs text-muted">Besoin couvert par les indemnités déclarées</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Kpi label="Besoin mensuel" value={<AnimatedNumber value={r.monthlyNeed} format={formatEur} />} hint="Charges fixes ou revenu à maintenir, le plus élevé." />
          <Kpi label="Couverture déclarée" value={<AnimatedNumber value={r.monthlyCoverage} format={formatEur} />} hint={unknownCoverage ? "Aucune indemnité renseignée." : "Indemnités × 30 jours."} />
          <Kpi tone="ink" label="Écart mensuel" value={<AnimatedNumber value={r.monthlyGap} format={formatEur} />} hint="À financer par vous pendant l'arrêt." />
          <Kpi tone="accent" label="Autonomie avec votre épargne" value={autonomy} hint={r.franchiseCost > 0 ? `Après la franchise (≈ ${formatEur(r.franchiseCost)}).` : "Épargne de précaution ÷ écart mensuel."} />
        </div>
      </div>

      {v.profession ? (
        <Notice>
          <strong className="text-ink">{professions[v.profession]} — </strong>
          {regimeNotes[v.profession]}
        </Notice>
      ) : null}

      <Checklist
        title="Ce que je vérifierai avec vous"
        icon={ScanSearch}
        items={[
          { title: "Indemnités journalières", text: "montant, franchise, durée d'indemnisation et articulation avec votre régime obligatoire." },
          { title: "Frais professionnels", text: "prise en charge de vos charges fixes (loyer, salaires, crédits) pendant l'arrêt." },
          { title: "Invalidité", text: "barème fonctionnel ou professionnel et seuil de déclenchement de la rente." },
          { title: "Exclusions et délais", text: "pathologies exclues, délais d'attente, conditions de mi-temps thérapeutique." },
        ]}
      />
      <p className="text-xs leading-relaxed text-subtle">
        Estimation pédagogique fondée sur vos déclarations (mois de 30 jours, besoin constant). Elle
        n&apos;intègre pas les indemnités du régime obligatoire si vous ne les avez pas saisies et ne
        remplace pas l&apos;étude des conditions générales de vos contrats.
      </p>
    </div>
  );
}

const steps: FunnelStep<Values>[] = [
  {
    id: "profession",
    label: "Profession",
    title: "Quelle est votre activité ?",
    description: "Chaque régime obligatoire a ses propres règles d'indemnisation.",
    fields: ["profession"],
    render: () => (
      <ChoiceCards
        name="profession"
        legend="Votre profession"
        options={[
          { value: "kine", label: professions.kine, icon: <HandHeart className="h-4 w-4" /> },
          { value: "medecin", label: professions.medecin, icon: <Stethoscope className="h-4 w-4" /> },
          { value: "avocat", label: professions.avocat, icon: <Gavel className="h-4 w-4" /> },
          { value: "liberal", label: professions.liberal, icon: <Briefcase className="h-4 w-4" /> },
          { value: "dirigeant", label: professions.dirigeant, icon: <Building2 className="h-4 w-4" /> },
          { value: "independant", label: professions.independant, icon: <Hammer className="h-4 w-4" /> },
        ]}
      />
    ),
  },
  {
    id: "revenus",
    label: "Revenus & charges",
    title: "Vos revenus et vos charges fixes",
    description: "Des ordres de grandeur suffisent.",
    fields: ["monthlyIncome", "proCharges", "personalCharges"],
    render: () => (
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField name="monthlyIncome" label="Revenu net mensuel moyen" suffix="€ / mois" className="sm:col-span-2" hint="Après charges sociales, avant impôt sur le revenu." />
        <NumberField name="proCharges" label="Charges fixes professionnelles" suffix="€ / mois" optional hint="Loyer du cabinet, salaires, crédits pro…" />
        <NumberField name="personalCharges" label="Charges fixes personnelles" suffix="€ / mois" hint="Logement, crédits, dépenses courantes…" />
      </div>
    ),
  },
  {
    id: "garanties",
    label: "Garanties",
    title: "Vos garanties existantes",
    description: "Si vous ne connaissez pas un montant, laissez-le vide : je le vérifierai.",
    fields: ["coverage", "dailyAllowance", "franchise", "savings"],
    render: (v) => (
      <div className="space-y-6">
        <ChoiceCards
          name="coverage"
          legend="Avez-vous une prévoyance complémentaire ?"
          columns={1}
          options={Object.entries(coverages).map(([value, label]) => ({ value, label }))}
        />
        <div className={cn("grid gap-5 sm:grid-cols-2", v.coverage !== "oui" && "hidden")}>
          <NumberField name="dailyAllowance" label="Indemnités journalières totales" suffix="€ / jour" optional hint="Régime obligatoire + contrats, si vous les connaissez." />
          <SelectField name="franchise" label="Franchise de votre contrat" options={Object.entries(franchises).map(([value, label]) => ({ value, label }))} />
        </div>
        <NumberField name="savings" label="Épargne de précaution mobilisable" suffix="€" optional hint="Sommes disponibles rapidement en cas d'arrêt." />
      </div>
    ),
  },
  {
    id: "besoin",
    label: "Besoin",
    title: "Quel niveau de protection souhaitez-vous ?",
    fields: ["target", "concerns"],
    render: () => (
      <div className="space-y-7">
        <ChoiceCards name="target" legend="En cas d'arrêt, je souhaite…" columns={1} options={Object.entries(targets).map(([value, label]) => ({ value, label }))} />
        <MultiChoice name="concerns" legend="Risques qui vous préoccupent" options={Object.entries(concerns).map(([value, label]) => ({ value, label }))} />
      </div>
    ),
  },
  {
    id: "resultat",
    label: "Résultat",
    kind: "result",
    title: "Votre protection en un coup d'œil",
    description: "Résultat indicatif, à confirmer par l'étude de vos contrats.",
    nextLabel: "Vérifier ma protection",
    render: (v) => <PrevoyanceResult v={v} />,
  },
];

export function PrevoyanceFunnel() {
  return (
    <LeadFunnel<Values>
      id="diagnostic"
      schema={schema}
      defaultValues={defaults}
      steps={steps}
      product={() => "prevoyance"}
      objective={(v) => (v.target ? targets[v.target] : "")}
      contactTitle="Faisons vérifier votre protection"
      summarize={(v) => {
        const r = compute(v);
        return [
          { label: "Profession", value: v.profession ? professions[v.profession] : "" },
          { label: "Revenu net mensuel", value: formatEur(v.monthlyIncome ?? 0) },
          { label: "Charges pro mensuelles", value: formatEur(v.proCharges ?? 0) },
          { label: "Charges perso mensuelles", value: formatEur(v.personalCharges ?? 0) },
          { label: "Prévoyance complémentaire", value: v.coverage ? coverages[v.coverage] : "" },
          { label: "IJ déclarées", value: v.dailyAllowance ? `${formatEur(v.dailyAllowance)} / jour` : "Non renseignées" },
          { label: "Franchise", value: franchises[v.franchise] ?? "" },
          { label: "Épargne de précaution", value: v.savings ? formatEur(v.savings) : "Non renseignée" },
          { label: "Objectif de maintien", value: v.target ? targets[v.target] : "" },
          { label: "Risques prioritaires", value: (v.concerns ?? []).map((c) => concerns[c as keyof typeof concerns]).join(", ") },
          { label: "Écart mensuel estimé (indicatif)", value: formatEur(r.monthlyGap) },
        ];
      }}
    />
  );
}
