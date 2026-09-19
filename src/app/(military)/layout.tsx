import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { fontVars } from "@/lib/fonts";
import "../globals.css";

/**
 * Root layout for the NOKM surface.
 *
 * This is a SECOND root layout — the consumer group has its own. Next.js
 * supports one root layout per top-level route group, which is exactly right
 * here: the two products get independent <html> attributes, independent
 * metadata, and independent brand tokens with no runtime theme switching and
 * no flash of the wrong palette. The tradeoff is a hard navigation when
 * crossing between /  and /mil, which is correct — they are two products.
 */
export const metadata: Metadata = {
  title: {
    default: "NOKM — Survivor Readiness Infrastructure",
    template: "%s · NOKM",
  },
  description:
    "Service record readiness and survivor benefit continuity. NOKM keeps DD-214, DD-93, SGLI and SBP records verified and current, and produces a complete survivor packet the moment a family needs one.",
};

export const viewport: Viewport = {
  themeColor: "#07090a",
};

export default function MilitaryRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-brand="nokm" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full bg-bg text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
