import { ImageResponse } from "next/og";
import { instrumentSerifData } from "@/lib/og-font";

export const alt = "NOKM — survivor readiness infrastructure";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, generated rather than designed in a file, so it cannot drift
 * away from the brand tokens the way an exported PNG always does.
 *
 * ImageResponse renders with Satori: flexbox only, no CSS variables, no
 * Tailwind, and every element with more than one child needs an explicit
 * `display: flex`. The hex values below are therefore duplicated from
 * globals.css by necessity — keep them in step.
 */
export default async function Image() {
  const serif = await instrumentSerifData();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07090a",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* Amber bloom, matching the hero. borderRadius is load-bearing:
            Satori clips a radial gradient to the element box, so without it
            the bloom renders as a visible rectangle. */}
        <div
          style={{
            position: "absolute",
            top: -320,
            left: 200,
            width: 760,
            height: 640,
            borderRadius: 760,
            background:
              "radial-gradient(circle at center, rgba(224,162,46,0.20), rgba(224,162,46,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 30,
              height: 30,
              border: "2px solid #e0a22e",
              borderRadius: 3,
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: "#e9efed",
              fontWeight: 600,
            }}
          >
            NOKM
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.04,
              color: "#e9efed",
              letterSpacing: -2,
              maxWidth: 900,
              fontFamily: serif ? "Instrument Serif" : undefined,
            }}
          >
            The honors he earned run through one document.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 27,
              lineHeight: 1.4,
              color: "#8b9a97",
              maxWidth: 820,
            }}
          >
            Survivor readiness infrastructure. Service records kept verified and
            current, and one complete packet on the day a family needs it.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 20,
            color: "#5d6c69",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex", width: 9, height: 9, borderRadius: 9, background: "#e0a22e" }} />
          <div style={{ display: "flex" }}>EVERY FORM NUMBER CITED TO AN OFFICIAL SOURCE</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: serif
        ? [{ name: "Instrument Serif", data: serif, style: "normal", weight: 400 }]
        : [],
    },
  );
}
