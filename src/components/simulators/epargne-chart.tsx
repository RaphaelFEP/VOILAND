"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { EpargnePoint } from "@/lib/calc/epargne";
import { formatCompactEur } from "@/lib/format";
import { GlassTooltip } from "./chart-tooltip";
import { SERIES } from "./series";

const axis = { fontSize: 11, fill: "#6e778c" };

/** Capital = versements (bas) + intérêts (haut), empilés. */
export default function EpargneChart({ data, years }: { data: EpargnePoint[]; years: number }) {
  const mid = Math.round(years / 2);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="ep-contrib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SERIES.gross} stopOpacity={0.28} />
            <stop offset="1" stopColor={SERIES.gross} stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="ep-interest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SERIES.net} stopOpacity={0.4} />
            <stop offset="1" stopColor={SERIES.net} stopOpacity={0.08} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgb(11 26 51 / .07)" strokeDasharray="3 4" />
        <XAxis
          dataKey="year"
          type="number"
          domain={[0, years]}
          ticks={years >= 2 ? [0, mid, years] : [0, years]}
          tickLine={false}
          axisLine={false}
          tick={axis}
          tickFormatter={(v: number) => (v === 0 ? "Aujourd'hui" : v === years ? `dans ${v} ans` : `${v} ans`)}
        />
        <YAxis tickLine={false} axisLine={false} tick={axis} width={56} tickFormatter={formatCompactEur} />
        <Tooltip
          content={<GlassTooltip labelFormatter={(l) => (Number(l) === 0 ? "Aujourd'hui" : `Année ${l}`)} />}
          cursor={{ stroke: "rgb(11 26 51 / .25)", strokeDasharray: "3 3" }}
        />
        <Area type="monotone" dataKey="contributions" name="Versements" stackId="1" stroke={SERIES.gross} strokeWidth={2} fill="url(#ep-contrib)" activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} />
        <Area type="monotone" dataKey="interest" name="Intérêts" stackId="1" stroke={SERIES.net} strokeWidth={2.2} fill="url(#ep-interest)" activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
