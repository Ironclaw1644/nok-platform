import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

/**
 * One font contract, two brands.
 *
 * Instrument Serif is the through-line: it marks both surfaces as the same
 * company. Serif reads permanence and inheritance, which a geometric sans
 * cannot do for a product about what outlives you.
 *
 * What differs is DOSAGE, not typeface. The consumer surface uses the serif
 * broadly — headlines, pull quotes, numerals, anywhere warmth helps. NOKM
 * rations it to top-level headlines and display figures only, and hands every
 * label, status and data cell to the mono. That asymmetry is what makes one
 * surface feel like an archive and the other like an instrument, using the
 * same two fonts.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});

export const fontVars = `${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`;
