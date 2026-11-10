"use client";

import { AlertTriangle, Landmark, PiggyBank } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { projectEpargne, type EpargneInput } from "@/lib/calc/epargne";
import { formatEur } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EpargneFunnel } from "./epargne-funnel";
import { SERIES } from "./series";
import { StepperField } from "./stepper-field";

const EpargneChart = dynamic(() => import("./epargne-chart"), {
  ssr: false,
  loading: () => <div className="h-full animate-pulse rounded-2xl bg-white/50" />,
});

export type Track = "av" | "per";

/** Valeurs de départ — hypothèses illustratives, modifiables, non garanties. */
const DEFAULTS: EpargneInput = { initial: 10_000, monthly: 100, years: 20, rate: 0.05 };

const TMI = [0, 0.11, 0.3, 0.41, 0.45];

export type EpargneSnapshot = {
  track: Track;
  input: EpargneInput;
  finalCapital: number;
  contributions: number;
  interest: number;
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
  const [tmi, setTmi] = useState(0.3);
  const set = <K extends keyof EpargneInput>(k: K) => (v: EpargneInput[K]) => setInput((s) => ({ ...s, [k]: v }));

  const result = useMemo(() => projectEpargne(input), [input]);
  const { final } = result;
  const annualContribution = input.monthly * 12;

  const snapshot: EpargneSnapshot = {
    track,
    input,
    finalCapital: final.total,
    contributions: final.contributions,
    interest: final.interest,
    tmi: track === "per" ? tmi : null,
  };

  return (
    <>
      <div className="mt-12">
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

        <div id="epargne-panel" role="tabpanel" className="mt-6 grid items-start gap-5 lg:grid-cols-[400px_1fr]">
          {/* Saisie */}
          <div className="glass glass-strong rounded-[28px] px-6 py-2">
            <StepperField label="Capital initial" info="Somme placée dès aujourd'hui." value={input.initial} onChange={set("initial")} min={0} max={10_000_000} step={1_000} suffix="€" />
            <StepperField label="Épargne mensuelle" info="Montant versé chaque mois." value={input.monthly} onChange={set("monthly")} min={0} max={100_000} step={50} suffix="€" />
            <StepperField label="Horizon de placement" value={input.years} onChange={set("years")} min={1} max={50} step={1} suffix="ans" />
            <StepperField
              label="Taux d'intérêt"
              info="Rendement annuel moyen supposé constant. Hypothèse illustrative, non garantie."
              value={Math.round(input.rate * 1000) / 10}
              onChange={(v) => set("rate")(v / 100)}
              min={-5}
              max={20}
              step={0.5}
              decimals={2}
              suffix="%"
            />
          </div>

          {/* Résultat */}
          <div className="glass glass-strong flex min-w-0 flex-col rounded-[28px] p-5 sm:p-7">
            <div className="text-center">
              <p className="text-sm font-medium text-muted">Capital final</p>
              <p className="mt-1 text-5xl font-semibold tracking-tight text-ink tabular-nums sm:text-6xl">
                <AnimatedNumber value={final.total} format={formatEur} />
              </p>
              <p className="mt-1 text-sm text-subtle">après {input.years} an{input.years > 1 ? "s" : ""}</p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
                <li className="inline-flex items-center gap-2 rounded-full bg-peach-2 px-3.5 py-1.5 ring-1 ring-coral/20">
                  <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: SERIES.net }} />
                  <span className="text-muted">Intérêts</span>
                  <span className="font-semibold tabular-nums text-ink">{formatEur(final.interest)}</span>
                </li>
                <li className="inline-flex items-center gap-2 rounded-full bg-[#e9eef8] px-3.5 py-1.5 ring-1 ring-[#2f58a6]/15">
                  <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: SERIES.gross }} />
                  <span className="text-muted">Versements</span>
                  <span className="font-semibold tabular-nums text-ink">{formatEur(final.contributions)}</span>
                </li>
              </ul>
            </div>

            <div
              className="mt-6 h-64 min-w-0 sm:h-72"
              role="img"
              aria-label={`Capital final ${formatEur(final.total)} après ${input.years} ans, dont ${formatEur(final.contributions)} de versements et ${formatEur(final.interest)} d'intérêts.`}
            >
              <EpargneChart data={result.series} years={input.years} />
            </div>

            {track === "per" ? (
              <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-peach-2 to-rose-2/60 p-4 ring-1 ring-white sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm">
                  <p className="font-semibold text-ink">
                    Économie d&apos;impôt théorique : <span className="tabular-nums">{formatEur(annualContribution * tmi)} / an</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Versements annuels × TMI, si déduits et dans votre plafond (non vérifié ici).
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-muted">
                  TMI
                  <select value={tmi} onChange={(e) => setTmi(Number(e.target.value))} className="field min-h-10 w-auto py-1.5">
                    {TMI.map((t) => (
                      <option key={t} value={t}>
                        {Math.round(t * 100)} %
                      </option>
                    ))}
                  </select>
                </label>
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
                Simulation illustrative à taux constant, hors frais, fiscalité et prélèvements sociaux :
                elle ne constitue ni une promesse de rendement, ni un conseil. Les supports en unités de
                compte présentent un risque de perte en capital ; le rendement des fonds en euros varie
                chaque année. Les performances passées ne préjugent pas des performances futures.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <div className="text-center">
          <p className="eyebrow">Étape suivante</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Faites analyser votre épargne</h2>
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
