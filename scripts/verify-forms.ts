/**
 * npm run verify:forms
 *
 * Fails the build if any form number reachable by a user is not backed by a
 * source URL someone actually read.
 *
 * This exists because of a specific, expensive mistake: a form number that was
 * never a real document shipped in a product and stayed there for about a
 * year, because it looked plausible and nobody had a way to check. A confident
 * sentence is not evidence. A failing check is.
 *
 *   npm run verify:forms         structural check, offline, fails on unverified
 *   npm run verify:forms -- --net   additionally resolves every source URL
 *   npm run verify:forms -- --report  prints status, never fails (for CI logs)
 */

import { FORMS, type FormDefinition } from "../src/lib/domain/forms.ts";

const args = new Set(process.argv.slice(2));
const CHECK_NET = args.has("--net");
const REPORT_ONLY = args.has("--report");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

type Problem = { key: string; issue: string };

const problems: Problem[] = [];
const entries = Object.values(FORMS);

function structural(f: FormDefinition) {
  if (!f.number?.trim()) problems.push({ key: f.key, issue: "missing form number" });
  if (!f.title?.trim()) problems.push({ key: f.key, issue: "missing official title" });
  if (!/^https:\/\//.test(f.source ?? "")) {
    problems.push({ key: f.key, issue: "source is not an https URL" });
  }
  // Only .gov and .mil count. A law firm's summary of a form is not a source
  // for that form's number.
  const host = (() => {
    try {
      return new URL(f.source).hostname;
    } catch {
      return "";
    }
  })();
  if (host && !/\.(gov|mil)$/.test(host)) {
    problems.push({ key: f.key, issue: `source host "${host}" is not .gov or .mil` });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.checkedAt ?? "")) {
    problems.push({ key: f.key, issue: "checkedAt is not an ISO date" });
  }
  if (!f.verified) {
    problems.push({ key: f.key, issue: "not verified against its source" });
  }
}

async function reachable(f: FormDefinition): Promise<boolean> {
  try {
    const res = await fetch(f.source, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "nok-form-verifier/1.0" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

const verified = entries.filter((f) => f.verified);
const unverified = entries.filter((f) => !f.verified);

for (const f of entries) structural(f);

console.log(`\n  Form register — ${entries.length} entries\n`);

for (const f of entries) {
  const mark = f.verified ? `${GREEN}✓${RESET}` : `${YELLOW}?${RESET}`;
  console.log(
    `  ${mark} ${f.number.padEnd(22)} ${DIM}${f.title.slice(0, 58)}${RESET}`,
  );
}

if (CHECK_NET) {
  console.log(`\n  Resolving sources…\n`);
  const results = await Promise.all(
    entries.map(async (f) => ({ f, ok: await reachable(f) })),
  );
  for (const { f, ok } of results) {
    if (!ok) problems.push({ key: f.key, issue: `source did not resolve: ${f.source}` });
    console.log(
      `  ${ok ? GREEN + "✓" : RED + "✗"}${RESET} ${f.key.padEnd(14)} ${DIM}${f.source}${RESET}`,
    );
  }
}

console.log(
  `\n  ${GREEN}${verified.length} verified${RESET}` +
    (unverified.length ? `  ${YELLOW}${unverified.length} awaiting verification${RESET}` : ""),
);

if (problems.length) {
  console.log(`\n  ${RED}${problems.length} problem(s):${RESET}`);
  for (const p of problems) console.log(`    ${RED}·${RESET} ${p.key}: ${p.issue}`);
  console.log(
    `\n  ${DIM}Unverified entries are withheld from production surfaces by\n` +
      `  getForm() in src/lib/domain/forms.ts. Confirm each against its\n` +
      `  official source, record it in docs/form-register.md, then set\n` +
      `  verified: true.${RESET}\n`,
  );
  if (!REPORT_ONLY) process.exit(1);
} else {
  console.log(`\n  ${GREEN}All form numbers carry a source.${RESET}\n`);
}
