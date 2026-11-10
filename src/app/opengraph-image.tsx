import { ImageResponse } from "next/og";

import { MONO, MONO_VIEWBOX, WORDMARK, WORDMARK_VIEWBOX } from "@/components/ui/brand-paths";

export const alt = "Voiland Finances Patrimoine — Protégez aujourd'hui. Construisez demain.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f3463"/><stop offset="1" stop-color="#0b1a33"/></linearGradient><linearGradient id="w" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff8b74"/><stop offset="1" stop-color="#ffd9c4"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#b)"/><svg x="6.5" y="11.2" width="35" height="25.6" viewBox="${MONO_VIEWBOX}"><path d="${MONO.V}" fill="#fff" fill-rule="evenodd"/><path d="${MONO.F}" fill="#fff" fill-rule="evenodd"/><path d="${MONO.P}" fill="#fff" fill-rule="evenodd"/><path d="${MONO.wave}" fill="url(#w)" fill-rule="evenodd"/></svg></svg>`;
const word = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WORDMARK_VIEWBOX}"><path d="${WORDMARK}" fill="#0b1a33" fill-rule="evenodd"/></svg>`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 85% 10%, rgba(255,217,196,1) 0%, rgba(248,245,240,0) 45%), radial-gradient(circle at 0% 80%, rgba(251,211,223,1) 0%, rgba(248,245,240,0) 40%), #f8f5f0",
          color: "#0b1a33",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img src={svgUri(tile)} width={84} height={84} alt="" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <img src={svgUri(word)} width={250} height={37} alt="" />
            <div style={{ fontSize: 17, letterSpacing: 6, color: "#535d74" }}>FINANCES PATRIMOINE</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>Protégez aujourd&apos;hui.</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#b8402c" }}>
            Construisez demain.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#535d74" }}>
            Mutuelle · Prévoyance · Assurance emprunteur · Assurance-vie & PER
          </div>
        </div>
      </div>
    ),
    size,
  );
}
