"use client";

import { AlertTriangle, Landmark, PiggyBank } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { Kpi } from "@/components/funnel/result-ui";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { projectEpargne, scenarioRates, type EpargneInput } from "@/lib/calc/epargne";
import { formatEur, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EpargneFunnel } from "./epargne-funnel";
import { SERIES } from "./series";
import { SliderField } from "./slider-field";

const chartLoading = () => <div className="h-full animate-pulse rounded-2xl bg-white/50" />;
const ProjectionChart = dynamic(() => import("./epargne-chart").then((m) => m.ProjectionChart), {
  ssr: false,
  loading: chartLoading,
});
const ScenarioChart = dynamic(() => import("./epargne-chart").then((m) => m.ScenarioChart), {
  ssr: false,
  loading: chartLoading,
});

export type Track = "av" | "per";

/** Hypothèses par défaut — illustratives, modifiables, non garanties. */
const DEFAULTS: EpargneInput = {
  initial: 10_000,
  monthly: 200,
  years: 15,
  grossRate: 0.03,
  annualFees: 0.0085,
  entryFees: 0.01,
  inflation: 0.02,
};

const TMI = [0, 0.11, 0.3, 0.41, 0.45];

const pct = (v: number) => formatPct(v);

export type EpargneSnapshot = {
  track: Track;
  input: EpargneInput;
  finalNet: number;
  finalGross: number;
  finalReal: number;
  contributions: number;
  tmi: number | null;
};

const trackInfo: Record<Track, { title: string; points: { title: string; text: string }[] }> = {
  av: {
    title: "Assurance-vie : les repères essentiels",
    points: [
      {
        title: "Disponibilité",
        text: "L'épargne reste disponible à tout moment (rachat partiel ou total), selon les conditions du contrat.",
      },
      {
        title: "Fiscalité des gains",
        text: "Elle dépend notamment de l'ancienneté du contrat (le seuil des 8 ans est déterminant), de la date et du montant des versements. Les prélèvements sociaux s'appliquent. Non intégrée à la simulation.",
      },
      {
        title: "Transmission",
        text: "Un cadre spécifique s'applique aux capitaux transmis aux bénéficiaires désignés, différent selon l'âge auquel les versements ont été effectués.",
      },
    ],
  },
  per: {
    title: "PER : les repères essentiels",
    points: [
      {
        title: "Objectif retraite",
        text: "L'épargne est en principe bloquée jusqu'au départ à la retraite, sauf cas de déblocage anticipé prévus par la loi (dont l'acquisition de la résidence principale).",
      },
      {
        title: "Avantage à l'entrée",
        text: "Les versements volontaires peuvent être déduits du revenu imposable, dans la limite d'un plafond personnel figurant sur votre avis d'imposition.",
      },
      {
        title: "Fiscalité à la sortie",
        text: "Elle dépend de l'option choisie à l'entrée (déduction ou non) et du mode de sortie (capital ou rente). Non intégrée à la simulation.",
      },
    ],
  },
};

export function EpargneExperience() {
  const [track, setTrack] = useState<Track>("av");
  const [input, setInput] = useState<EpargneInput>(DEFAULTS);
  const [view, setView] = useState<"projection" | "scenarios">("projection");
  const [tmi, setTmi] = useState(0.3);

  const set = <K extends keyof EpargneInput>(k: K) => (v: EpargneInput[K]) => setInput((s) => ({ ...s, [k]: v }));

  const result = useMemo(() => projectEpargne(input), [input]);
  const rates = scenarioRates(input.grossRate);
  const scenarioLabels = {
    low: `Défavorable (${pct(rates.low)})`,
    mid: `Central (${pct(rates.mid)})`,
    high: `Favorable (${pct(rates.high)})`,
  };
  const scenarios = useMemo(() => {
    const low = projectEpargne({ ...input, grossRate: rates.low }).series;
    const high = projectEpargne({ ...input, grossRate: rates.high }).series;
    return result.series.map((p, i) => ({
      year: p.year,
      contributions: p.contributions,
      mid: p.net,
      low: low[i]?.net ?? 0,
      high: high[i]?.net ?? 0,
    }));
  }, [input, rates.low, rates.high, result.series]);

  const annualContribution = input.monthly * 12;
  const taxSaving = annualContribution * tmi;

  const snapshot: EpargneSnapshot = {
    track,
    input,
    finalNet: result.final.net,
    finalGross: result.final.gross,
    finalReal: result.final.real,
    contributions: result.final.contributions,
    tmi: track === "per" ? tmi : null,
  };

  const legend =
    view === "projection"
      ? [
          { label: "Capital net de frais", color: SERIES.net, dash: false },
          { label: "Capital brut (sans frais)", color: SERIES.gross, dash: false },
          { label: "Net en euros constants", color: SERIES.real, dash: true },
          { label: "Versements cumulés", color: SERIES.contributions, dash: true },
        ]
      : [
          { label: scenarioLabels.high, color: SERIES.high, dash: false },
          { label: scenarioLabels.mid, color: SERIES.mid, dash: false },
          { label: scenarioLabels.low, color: SERIES.low, dash: true },
          { label: "Versements cumulés", color: SERIES.contributions, dash: true },
        ];

  return (
    <>
      <div className="mt-12">
        {/* Parcours distincts */}
        <div role="tablist" aria-label="Type de contrat" className="glass glass-soft inline-flex rounded-full p-1.5">
          {(
            [
              ["av", "Assurance-vie", PiggyBank],
              ["per", "Plan d'Épargne Retraite", Landmark],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={track === id}
              aria-controls="epargne-panel"
              onClick={() => setTrack(id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-all duration-300 sm:px-5",
                track === id ? "bg-ink text-white shadow-[0_8px_20px_-8px_rgb(11_26_51/0.6)]" : "text-muted hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <div id="epargne-panel" role="tabpanel" className="mt-6 grid gap-5 lg:grid-cols-[360px_1fr]">
          {/* Hypothèses */}
          <div className="glass glass-strong rounded-[28px] p-6">
            <p className="text-sm font-semibold text-ink">Vos hypothèses</p>
            <p className="mt-1 text-xs text-muted">Toutes les valeurs sont modifiables.</p>
            <div className="mt-6 space-y-5">
              <SliderField label="Capital initial" value={input.initial} onChange={set("initial")} min={0} max={500_000} step={1_000} format={formatEur} />
              <SliderField label="Versement mensuel" value={input.monthly} onChange={set("monthly")} min={0} max={5_000} step={25} format={formatEur} />
              <SliderField label="Horizon de placement" value={input.years} onChange={set("years")} min={1} max={40} step={1} format={(v) => `${v} an${v > 1 ? "s" : ""}`} />
              <SliderField
                label="Hypothèse de rendement brut"
                value={input.grossRate}
                onChange={set("grossRate")}
                min={-0.02}
                max={0.08}
                step={0.0025}
                format={(v) => `${pct(v)} / an`}
                hint="Hypothèse constante, non garantie."
              />
              <SliderField label="Frais de gestion annuels" value={input.annualFees} onChange={set("annualFees")} min={0} max={0.03} step={0.0005} format={pct} />
              <SliderField label="Frais sur versements" value={input.entryFees} onChange={set("entryFees")} min={0} max={0.05} step={0.0025} format={pct} />
              <SliderField label="Inflation annuelle" value={input.inflation} onChange={set("inflation")} min={0} max={0.06} step={0.0025} format={pct} />
              {track === "per" ? (
                <div>
                  <label htmlFor="tmi" className="text-sm font-medium text-ink">
                    Tranche marginale d&apos;imposition
                  </label>
                  <select
                    id="tmi"
                    value={tmi}
                    onChange={(e) => setTmi(Number(e.target.value))}
                    className="field mt-2"
                  >
                    {TMI.map((t) => (
                      <option key={t} value={t}>
                        {Math.round(t * 100)} %
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          </div>

          {/* Résultats */}
          <div className="glass glass-strong flex min-w-0 flex-col rounded-[28px] p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Kpi
                tone="ink"
                label={`Capital projeté net · ${input.years} ans`}
                value={<AnimatedNumber value={result.final.net} format={formatEur} />}
                hint="Après frais, avant fiscalité."
              />
              <Kpi label="Effort d'épargne" value={formatEur(result.final.contributions)} hint="Total de vos versements." />
              <Kpi label="Impact des frais" value={formatEur(result.totalFeesImpact)} hint="Écart brut − net." />
              <Kpi label="En euros constants" value={formatEur(result.final.real)} hint={`Inflation de ${pct(input.inflation)} / an.`} />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div role="tablist" aria-label="Affichage du graphique" className="inline-flex rounded-full bg-ink/5 p-1">
                {(
                  [
                    ["projection", "Brut / net"],
                    ["scenarios", "Scénarios"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    role="tab"
                    type="button"
                    aria-selected={view === id}
                    onClick={() => setView(id)}
                    className={cn(
                      "min-h-9 rounded-full px-4 text-xs font-semibold transition-all",
                      view === id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
                {legend.map((l) => (
                  <li key={l.label} className="flex items-center gap-1.5">
                    <svg width="18" height="6" aria-hidden>
                      <line x1="1" y1="3" x2="17" y2="3" stroke={l.color} strokeWidth="2.4" strokeDasharray={l.dash ? "4 3" : undefined} strokeLinecap="round" />
                    </svg>
                    {l.label}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="mt-4 h-72 min-w-0 sm:h-80"
              role="img"
              aria-label={
                view === "projection"
                  ? `Projection sur ${input.years} ans : capital net ${formatEur(result.final.net)}, brut ${formatEur(result.final.gross)}, versements ${formatEur(result.final.contributions)}.`
                  : `Trois scénarios de rendement : ${scenarioLabels.low}, ${scenarioLabels.mid}, ${scenarioLabels.high}.`
              }
            >
              {view === "projection" ? (
                <ProjectionChart data={result.series} />
              ) : (
                <ScenarioChart data={scenarios} labels={scenarioLabels} />
              )}
            </div>

            <details className="mt-4 text-sm">
              <summary className="cursor-pointer font-medium text-ink">Voir les données sous forme de tableau</summary>
              <div className="mt-3 max-h-64 overflow-auto rounded-2xl ring-1 ring-line">
                <table className="w-full text-left text-xs tabular-nums">
                  <caption className="sr-only">Projection année par année</caption>
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-muted">
                      <th scope="col" className="px-3 py-2 font-medium">Année</th>
                      <th scope="col" className="px-3 py-2 font-medium">Versements</th>
                      <th scope="col" className="px-3 py-2 font-medium">Brut</th>
                      <th scope="col" className="px-3 py-2 font-medium">Net</th>
                      <th scope="col" className="px-3 py-2 font-medium">€ constants</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white/60">
                    {result.series.map((p) => (
                      <tr key={p.year}>
                        <th scope="row" className="px-3 py-1.5 font-medium text-ink">{p.year}</th>
                        <td className="px-3 py-1.5">{formatEur(p.contributions)}</td>
                        <td className="px-3 py-1.5">{formatEur(p.gross)}</td>
                        <td className="px-3 py-1.5">{formatEur(p.net)}</td>
                        <td className="px-3 py-1.5">{formatEur(p.real)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

            {track === "per" ? (
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-peach-2 to-rose-2/60 p-4 ring-1 ring-white">
                <p className="text-sm font-semibold text-ink">
                  Économie d&apos;impôt théorique à l&apos;entrée :{" "}
                  <span className="tabular-nums">{formatEur(taxSaving)} / an</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {formatEur(annualContribution)} versés par an × TMI de {Math.round(tmi * 100)} %, si les
                  versements sont déduits et restent dans votre plafond de déduction (non vérifié ici).
                  Cette économie est en principe compensée en partie par l&apos;imposition à la sortie.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="glass rounded-[28px] p-6">
            <p className="text-sm font-semibold text-ink">{trackInfo[track].title}</p>
            <ul className="mt-4 space-y-3">
              {trackInfo[track].points.map((p) => (
                <li key={p.title} className="text-sm leading-relaxed text-muted">
                  <strong className="text-ink">{p.title}. </strong>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3 rounded-[28px] bg-[#fff6ef] p-6 ring-1 ring-coral/25">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral-ink" aria-hidden />
            <div className="text-sm leading-relaxed text-muted">
              <p className="font-semibold text-ink">Avertissement</p>
              <p className="mt-2">
                Simulation illustrative reposant sur des hypothèses constantes que vous choisissez :
                elle ne constitue ni une promesse de rendement, ni un conseil. Les supports en unités
                de compte présentent un risque de perte en capital ; les fonds en euros ont un rendement
                variable chaque année. Les performances passées ne préjugent pas des performances
                futures. Fiscalité et prélèvements sociaux ne sont pas intégrés.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <div className="text-center">
          <p className="eyebrow">Étape suivante</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Faites analyser votre épargne
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Frais réels, allocation, horizon, fiscalité : nous examinons vos contrats pour vérifier
            qu&apos;ils suivent la bonne trajectoire.
          </p>
        </div>
        <EpargneFunnel className="mt-10" snapshot={snapshot} />
      </div>
    </>
  );
}
