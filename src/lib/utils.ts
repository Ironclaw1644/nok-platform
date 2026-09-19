import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date as "12 Mar 2026". Stable across locales — a survivor
 *  packet read by a casualty assistance officer should never be ambiguous
 *  about whether 03/04 is March or April. */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}
