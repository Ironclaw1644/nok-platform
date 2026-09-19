import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { fontVars } from "@/lib/fonts";
import "../globals.css";

/**
 * Root layout for the AS-SPECIFIED surface.
 *
 * Third root layout, same pattern as the other two. It deliberately reuses the
 * consumer brand tokens: if this version looked worse than the other two, the
 * comparison would be about design rather than about scope, which is not the
 * question being asked.
 */
export const metadata: Metadata = {
  title: {
    default: "N.O.K. — family information, communication and commerce",
    template: "%s · N.O.K.",
  },
  description:
    "A comprehensive family and critical relationship information sharing, e-commerce and communication platform. Memories, trusts and wills, calendars and bill pay, lockbox, and a family services storefront.",
};

export const viewport: Viewport = { themeColor: "#fafafb" };

export default function PlanRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-brand="nok" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full bg-bg text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
