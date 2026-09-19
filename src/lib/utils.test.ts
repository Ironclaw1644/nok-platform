import assert from "node:assert/strict";
import test from "node:test";
import { formatDate } from "./utils.ts";

/* Regression guard for React hydration error #418, which shipped to the first
   production deploy: toLocaleDateString("en-GB", { month: "short" }) renders
   September as "Sep" under Node's ICU and "Sept" in Chrome, so server and
   client HTML disagreed and the page silently re-rendered client-side. */

test("month abbreviations are fixed, not locale-derived", () => {
  assert.equal(formatDate("2024-09-01"), "01 Sep 2024"); // never "Sept"
  assert.equal(formatDate("2023-02-14"), "14 Feb 2023");
  assert.equal(formatDate("2026-12-31"), "31 Dec 2026");
});

test("day is zero-padded and the month is named, never numeric", () => {
  const s = formatDate("2026-03-04");
  assert.equal(s, "04 Mar 2026");
  assert.doesNotMatch(s, /\d{2}\/\d{2}/, "03/04 is ambiguous and must never render");
});

test("a bare date does not shift a day west of Greenwich", () => {
  // Parsed as UTC. Without the explicit Z this renders as the previous day
  // for anyone in a negative offset — which would misdate a packet.
  assert.equal(formatDate("2026-01-01"), "01 Jan 2026");
  assert.equal(formatDate("2026-07-04"), "04 Jul 2026");
});

test("full ISO timestamps still format", () => {
  assert.equal(formatDate("2026-05-30T18:20:00.000Z"), "30 May 2026");
});

test("output is byte-identical across repeated calls", () => {
  // The property that actually matters for hydration.
  const a = formatDate("2024-09-01");
  const b = formatDate("2024-09-01");
  assert.equal(a, b);
});
