"use client";

import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { SavingsResult } from "@/lib/calc/emprunteur-savings";
import { formatCompactEur } from "@/lib/format";
import { GlassTooltip } from "./chart-tooltip";
import { SERIES } from "./series";

export default function EmprunteurChart({ data }: { data: SavingsResult["yearly"] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="emp-gap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={SERIES.gross} stopOpacity={0.16} />
              <stop offset="1" stopColor={SERIES.gross} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgb(11 26 51 / .07)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6e778c" }} interval="preserveStartEnd" minTickGap={18} />
          <YAxis tickLine={false} axisLine={false} width={52} tick={{ fontSize: 11, fill: "#6e778c" }} tickFormatter={formatCompactEur} />
          <Tooltip content={<GlassTooltip />} cursor={{ stroke: "rgb(11 26 51 / .25)", strokeDasharray: "3 3" }} />
          <Area type="monotone" dataKey="current" name="Assurance actuelle" stroke={SERIES.gross} strokeWidth={2.2} fill="url(#emp-gap)" activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
          <Line type="monotone" dataKey="next" name="Après changement (estimé)" stroke={SERIES.net} strokeWidth={2.4} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
