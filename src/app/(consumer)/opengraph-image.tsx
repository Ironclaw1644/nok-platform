import { ImageResponse } from "next/og";
import { displayFontData } from "@/lib/og-font";

export const alt = "Next of Kin — the record your family will actually need";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** See the NOKM card for why the hex values are duplicated here. */
export default async function Image() {
  const display = await displayFontData();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafafb",
          padding: "72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background:
              "radial-gradient(circle at center, rgba(180,83,31,0.13), rgba(180,83,31,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 12,
              background: "#6247c9",
            }}
          />
          <div style={{ fontSize: 26, color: "#1a1a22" }}>Next of Kin</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.0,
              color: "#1a1a22",
              letterSpacing: -3,
              maxWidth: 880,
              fontFamily: display ? "Plus Jakarta Sans" : undefined,
              fontWeight: 700,
            }}
          >
            You don&apos;t know where anything is.
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 28,
              lineHeight: 1.4,
              color: "#565667",
              maxWidth: 800,
            }}
          >
            Neither does your brother. So this starts with you asking — not with
            them filing.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 20, color: "#666678" }}>
          No bill pay. No marketplace. No DNA kits. A record, and the conversation
          that keeps it current.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: display
        ? [{ name: "Plus Jakarta Sans", data: display, style: "normal", weight: 700 }]
        : [],
    },
  );
}
