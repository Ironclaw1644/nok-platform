/**
 * npm run verify:ai [-- https://your-deployment.vercel.app]
 *
 * Proves the live AI path end to end against a deployment, so nobody has to
 * know which endpoint to poke or what a healthy response looks like.
 *
 * Checks, in order:
 *   1. /api/ai/status          — is a key configured at all
 *   2. /api/ai/scan            — does the model actually return findings
 *   3. the shape of a finding  — does it obey the two-source rule
 *
 * Prints a verdict and exits non-zero on failure. Costs about four cents.
 */

export {};

const BASE =
  process.argv.slice(2).find((a) => a.startsWith("http")) ??
  "https://nok-platform.vercel.app";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const ok = (m: string) => console.log(`  ${GREEN}✓${RESET} ${m}`);
const bad = (m: string) => console.log(`  ${RED}✗${RESET} ${m}`);
const note = (m: string) => console.log(`    ${DIM}${m}${RESET}`);

console.log(`\n  Verifying the live AI path\n  ${DIM}${BASE}${RESET}\n`);

/* --- 1. status ----------------------------------------------------------- */
interface Status { live?: boolean; model?: string | null }
let status: Status;
try {
  const res = await fetch(`${BASE}/api/ai/status`, { signal: AbortSignal.timeout(20_000) });
  status = await res.json();
} catch (err) {
  bad(`could not reach ${BASE}/api/ai/status`);
  note(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

if (!status.live) {
  bad("no API key is configured on this deployment");
  console.log(`
  ${YELLOW}The key is not in Vercel.${RESET} Storing it in OpenClaw secrets is a
  different store — OpenClaw cannot hand it to Vercel, and deliberately cannot
  hand it to an agent either.

  From ${DIM}nok-platform/${RESET}:

    vercel link            ${DIM}# only if this directory is not linked yet${RESET}
    vercel env add ANTHROPIC_API_KEY production
    vercel --prod          ${DIM}# env vars only apply to NEW deployments${RESET}

  Then run this again.
`);
  process.exit(1);
}

ok(`key configured · model ${status.model}`);

/* --- 2. a real scan ------------------------------------------------------ */
console.log(`\n  ${DIM}Running a conflict scan (about four cents)…${RESET}\n`);

let scan: { live?: boolean; findings?: unknown[]; reason?: string };
const started = Date.now();
try {
  const res = await fetch(`${BASE}/api/ai/scan`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ dataset: "military" }),
    signal: AbortSignal.timeout(120_000),
  });
  scan = await res.json();
} catch (err) {
  bad("the scan request failed");
  note(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

const elapsed = ((Date.now() - started) / 1000).toFixed(1);

if (!scan.live) {
  bad(`the scan did not run live — ${scan.reason ?? "unknown reason"}`);
  note("The UI will have fallen back to its scripted findings, which is by design.");
  process.exit(1);
}

const findings = (scan.findings ?? []) as {
  title?: string;
  severity?: string;
  sources?: string[];
}[];

ok(`model returned ${findings.length} findings in ${elapsed}s`);

/* --- 3. shape ------------------------------------------------------------ */
let shapeOk = true;
for (const f of findings) {
  if (!Array.isArray(f.sources) || f.sources.length < 2) {
    bad(`"${f.title}" cites fewer than two sources — should have been filtered`);
    shapeOk = false;
  }
  if (f.severity !== "crit" && f.severity !== "warn") {
    bad(`"${f.title}" has an unexpected severity: ${f.severity}`);
    shapeOk = false;
  }
}
if (shapeOk && findings.length) ok("every finding cites at least two sources");

console.log("");
for (const f of findings) {
  const mark = f.severity === "crit" ? `${RED}●${RESET}` : `${YELLOW}●${RESET}`;
  console.log(`  ${mark} ${f.title}`);
  note(f.sources?.join("  ·  ") ?? "");
}

console.log(
  findings.length && shapeOk
    ? `\n  ${GREEN}Live. The console badge will read "Claude Opus 5 · live".${RESET}\n`
    : `\n  ${YELLOW}Live, but check the findings above before demoing.${RESET}\n`,
);

process.exit(shapeOk ? 0 : 1);
