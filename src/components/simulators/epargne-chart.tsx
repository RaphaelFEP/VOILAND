"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { EpargnePoint } from "@/lib/calc/epargne";
import { formatCompactEur } from "@/lib/format";
import { GlassTooltip } from "./chart-tooltip";
import { SERIES } from "./series";


const axis = { fontSize: 11, fill: "#6e778c" };
const yearLabel = (l: string | number) => `Année ${l}`;

export function ProjectionChart({ data }: { data: EpargnePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="net-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SERIES.net} stopOpacity={0.22} />
            <stop offset="1" stopColor={SERIES.net} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgb(11 26 51 / .07)" />
        <XAxis dataKey="year" tickLine={false} axisLine={false} tick={axis} tickFormatter={(v) => `${v} a`} minTickGap={18} />
        <YAxis tickLine={false} axisLine={false} tick={axis} width={56} tickFormatter={formatCompactEur} />
        <Tooltip content={<GlassTooltip labelFormatter={yearLabel} />} cursor={{ stroke: "rgb(11 26 51 / .25)", strokeDasharray: "3 3" }} />
        <Area type="monotone" dataKey="net" name="Capital net de frais" stroke={SERIES.net} strokeWidth={2.2} fill="url(#net-fill)" activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
        <Line type="monotone" dataKey="gross" name="Capital brut (sans frais)" stroke={SERIES.gross} strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
        <Line type="monotone" dataKey="real" name="Net en euros constants" stroke={SERIES.real} strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
        <Line type="monotone" dataKey="contributions" name="Versements cumulés" stroke={SERIES.contributions} strokeWidth={2} strokeDasharray="2 4" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export type ScenarioPoint = { year: number; low: number; mid: number; high: number; contributions: number };

export function ScenarioChart({ data, labels }: { data: ScenarioPoint[]; labels: { low: string; mid: string; high: string } }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="rgb(11 26 51 / .07)" />
        <XAxis dataKey="year" tickLine={false} axisLine={false} tick={axis} tickFormatter={(v) => `${v} a`} minTickGap={18} />
        <YAxis tickLine={false} axisLine={false} tick={axis} width={56} tickFormatter={formatCompactEur} />
        <Tooltip content={<GlassTooltip labelFormatter={yearLabel} />} cursor={{ stroke: "rgb(11 26 51 / .25)", strokeDasharray: "3 3" }} />
        <Line type="monotone" dataKey="high" name={labels.high} stroke={SERIES.high} strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
        <Line type="monotone" dataKey="mid" name={labels.mid} stroke={SERIES.mid} strokeWidth={2.4} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
        <Line type="monotone" dataKey="low" name={labels.low} stroke={SERIES.low} strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
        <Line type="monotone" dataKey="contributions" name="Versements cumulés" stroke={SERIES.contributions} strokeWidth={2} strokeDasharray="2 4" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
