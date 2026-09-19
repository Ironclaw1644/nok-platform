# Turning the AI on

The AI layer is built, wired and deployed. It is **dark** — no key is
configured, so every surface falls back to its scripted path. Nothing spends
anything until someone deliberately turns it on.

## What is already real

- `src/lib/ai/client.ts` — Anthropic client, model policy, refusal handling
- `src/lib/ai/intake.ts` — document extraction (strict tool schema) and the
  separate citations pass
- `src/lib/ai/conflicts.ts` — cross-document reasoning over a whole record
- `src/lib/ai/budget.ts` — daily spend ceiling and per-address rate limit
- `src/app/api/ai/scan` — the conflict scan endpoint
- `src/app/api/ai/status` — tells the UI whether to offer the live path

## To go live

```bash
vercel env add ANTHROPIC_API_KEY production
# paste the key at the prompt — it is never echoed, never committed,
# and never appears in any log

vercel --prod
```

Two optional dials, both with safe defaults:

| Variable | Default | What it does |
|---|---|---|
| `AI_DAILY_BUDGET_USD` | `5` | Hard daily ceiling. Requests are refused above it. |
| `AI_RATE_LIMIT` | `20` | Requests per address per hour. |

Confirm it took:

```bash
curl -s https://nok-platform.vercel.app/api/ai/status
# {"live":true,"model":"claude-opus-5"}
```

The conflict scan's badge then reads **Claude Opus 5 · live** instead of
*Scripted demo*. That badge is the honest signal — if it says scripted, it is
scripted.

## What it costs

Claude Opus 5 is $5 per million input tokens and $25 per million output.

- One conflict scan over a fourteen-record family: roughly 6K in, 1.5K out —
  **about four cents.**
- One document extraction: **under a cent.**
- A full walkthrough where someone scans both datasets and files three
  documents: **around a dime.**

The $5 daily ceiling is therefore roughly fifty full walkthroughs. It exists
because a public endpoint with a live key on it is an open invoice, not
because the feature is expensive.

## Why one model and not a cascade

Opus 5 does both jobs. The obvious optimisation — a cheaper model for bulk
extraction, the expensive one only for reasoning — is wrong here:

1. **The volume does not justify it.** A family holds a dozen documents. Saving
   a fraction of a cent buys a second code path maintained forever.
2. **Prompt caches are model-scoped.** A cascade forfeits cache reuse across
   its models, so the cheap path can cost more per completed task.
3. **Extraction quality is reasoning quality.** Reading a beneficiary
   designation off a scanned policy and noticing it contradicts the will are
   the same skill. A model worse at the first is worse at the second — and the
   second is the feature worth selling.

Revisit when measured volume makes it matter, and measure cost per completed
task, not per request.

## The constraint worth knowing

**Citations and structured outputs cannot be used in the same request** — the
API returns 400. So intake runs two passes: extraction with a strict tool
schema, then a separate citations call only when someone asks *"where did you
read that?"*

That is better UX than it sounds. Most intakes never need the second pass, so
most cost one call — and "show me where" becomes a deliberate act instead of
noise on every field.

## What is still not built

- **No persistence.** The demo stores state in `localStorage`. Real accounts
  need Postgres, auth and row-level security.
- **No real passkeys.** The enrolment step is a simulation. WebAuthn is real
  work, and it is the foundation the encryption model sits on.
- **No encryption.** `docs/key-escrow.md` specifies it properly, including what
  it deliberately cannot protect against. None of it is implemented.
Order I would build them: passkeys, then persistence, then encryption.
That order is not negotiable — encryption before auth is a foundation on sand.

## Live intake is wired

Once the key is set, the intake panel grows an **Upload a real document**
option above the three samples. PDF or photo, 5 MB ceiling, allow-list on
content type, held in memory for one request and written nowhere — this
endpoint has no storage by design.

On a PDF, every extracted field gets a **"where did you read that?"** link.
That runs the citations pass and returns the model's answer plus the exact
quoted source text and page number.

That is the moment worth showing. Not *"the beneficiary is Denise Ellison"* but
*"page 3 says so, and here is the line."*
