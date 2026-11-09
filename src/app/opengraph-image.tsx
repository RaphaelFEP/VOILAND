import { ImageResponse } from "next/og";

export const alt = "Voiland Finances & Patrimoine — Protégez aujourd'hui. Construisez demain.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
            "radial-gradient(circle at 85% 10%, #ffd9c4 0%, transparent 45%), radial-gradient(circle at 0% 80%, #fbd3df 0%, transparent 40%), #f8f5f0",
          color: "#0b1a33",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#0b1a33",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            V
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>Voiland</div>
            <div style={{ fontSize: 18, letterSpacing: 4, color: "#535d74" }}>FINANCES & PATRIMOINE</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Protégez aujourd&apos;hui.
          </div>
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
