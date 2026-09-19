import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

/**
 * One font contract, three surfaces. No serif anywhere.
 *
 * The first build used Instrument Serif for display. It was rejected on sight
 * — read as "Times New Roman", which is fatal for a product that has to look
 * current. Serif was the wrong call: it signals *archive*, and this product
 * needs to signal *software*.
 *
 * Plus Jakarta Sans carries display. It is geometric enough to look modern at
 * large sizes but has slightly humanist terminals, so it stays warm next to a
 * pastel palette instead of going cold and corporate. Inter runs body and UI.
 * JetBrains Mono is rationed to data cells and micro-labels only.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});

export const fontVars = `${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable}`;
