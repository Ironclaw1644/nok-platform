import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { fontVars } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Next of Kin — the record your family will actually need",
    template: "%s · Next of Kin",
  },
  description:
    "A living family record. Documents, wishes and access, kept current by the people who will one day need them — and handed over cleanly when that day comes.",
};

export const viewport: Viewport = {
  themeColor: "#fbf9f6",
};

export default function ConsumerRootLayout({
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
