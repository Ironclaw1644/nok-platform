/* ---------------------------------------------------------------------------
   Spend guard.

   A public demo with a live API key on it is an open invoice. Anyone who finds
   the endpoint can run it in a loop, and the first you know about it is the
   bill.

   So: a hard per-process ceiling, refused at the door. Deliberately simple and
   deliberately in-memory — a real deployment wants this in Redis or Postgres
   keyed by account, but an approximate ceiling that actually ships beats an
   exact one that does not.

   NOTE: in-memory means per serverless instance. Vercel may run several, so
   the real ceiling is roughly DAILY_USD × instances. Sized conservatively for
   that, and the whole thing is belt-and-braces behind the rate limiter below.
------------------------------------------------------------------------- */

/** Claude Opus 5, USD per million tokens. */
const PRICE = { input: 5, output: 25 } as const;

const DAILY_USD = Number(process.env.AI_DAILY_BUDGET_USD ?? 5);
const MAX_REQ_PER_IP_PER_HOUR = Number(process.env.AI_RATE_LIMIT ?? 20);

let spentUsd = 0;
let windowStart = Date.now();
const ipHits = new Map<string, { n: number; since: number }>();

const DAY = 86_400_000;
const HOUR = 3_600_000;

function rollDay() {
  if (Date.now() - windowStart > DAY) {
    spentUsd = 0;
    windowStart = Date.now();
  }
}

export function costOf(usage: { input_tokens: number; output_tokens: number }): number {
  return (
    (usage.input_tokens / 1_000_000) * PRICE.input +
    (usage.output_tokens / 1_000_000) * PRICE.output
  );
}

export function record(usage: { input_tokens: number; output_tokens: number }): number {
  rollDay();
  const c = costOf(usage);
  spentUsd += c;
  return c;
}

export function budgetState() {
  rollDay();
  return { spentUsd, limitUsd: DAILY_USD, remainingUsd: Math.max(0, DAILY_USD - spentUsd) };
}

export type Denial = { ok: false; reason: string; status: number };
export type Allowed = { ok: true };

export function checkAllowed(ip: string): Denial | Allowed {
  rollDay();

  if (spentUsd >= DAILY_USD) {
    return {
      ok: false,
      status: 429,
      reason:
        "The demo's daily AI budget is spent. It resets in under 24 hours — the scripted walkthrough still works in the meantime.",
    };
  }

  const now = Date.now();
  const hit = ipHits.get(ip);
  if (!hit || now - hit.since > HOUR) {
    ipHits.set(ip, { n: 1, since: now });
    return { ok: true };
  }
  if (hit.n >= MAX_REQ_PER_IP_PER_HOUR) {
    return {
      ok: false,
      status: 429,
      reason: "Too many requests from this address in the last hour.",
    };
  }
  hit.n += 1;
  return { ok: true };
}

/** Keeps the map from growing without bound on a long-lived instance. */
export function sweep() {
  const now = Date.now();
  for (const [ip, h] of ipHits) if (now - h.since > HOUR) ipHits.delete(ip);
}
