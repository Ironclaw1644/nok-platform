import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * Format an ISO date as "12 Mar 2026".
 *
 * Day-first and a named month on purpose: a survivor packet read by a casualty
 * assistance officer must never be ambiguous about whether 03/04 is March or
 * April.
 *
 * Hand-rolled rather than `toLocaleDateString`, and that is not fussiness.
 * The first deploy threw React hydration error #418 on /mil/console because
 * `toLocaleDateString("en-GB", { month: "short" })` renders September as
 * "Sep" under Node's ICU build and "Sept" in Chrome — so the server HTML and
 * the client render disagreed, React discarded the server markup, and the
 * whole page silently re-rendered on the client.
 *
 * Parsed as UTC (`Z` appended for bare dates) so the calendar day cannot shift
 * by one for anyone west of Greenwich.
 */
export function formatDate(iso: string) {
  const d = new Date(/\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00Z` : iso);
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function daysSince(iso: string) {
  const then = new Date(/\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00Z` : iso);
  return Math.floor((Date.now() - then.getTime()) / 86_400_000);
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}
