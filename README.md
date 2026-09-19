# NOK Platform

Two products, one codebase.

- **`/` — Next of Kin.** Consumer family record. Warm, editorial, ivory and ink.
- **`/mil` — NOKM.** Military and government survivor-readiness infrastructure. Dark, precision console.

Both are live and interactive. Nothing here is a mockup.

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # typecheck + lint + form register report
npm run build
```

| Route | What it is |
|---|---|
| `/` | Consumer landing |
| `/app` | The Vance family record — working product |
| `/mil` | NOKM landing |
| `/mil/console` | Readiness console — working product |
| `/mil/console/packet` | Survivor packet generation |

---

## The two theses

**NOKM** is the stronger business and it came out of the whiteboards, not the
business plan. When a veteran dies the family has days, not weeks, to produce
records that prove service — and the single document everything depends on is
the one most commonly lost. NOKM keeps those records verified and current, and
produces one complete packet on the day. It sells to units, veterans service
organisations and state veterans affairs departments, which is a real budget
line rather than a consumer subscription.

**Next of Kin** is the consumer product, rebuilt around one inversion: **it
starts with the adult child, not the parent.** Every vault in this category
sold a subscription to the one person in the family who will never need the
result, and every one of them churned. The person with urgency is the daughter
who does not know where the will is. So the record is opened by her, and the
invite goes *up*.

That inversion is the whole consumer product. Everything else is table stakes.

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 ·
Motion 13 · deployed on Vercel.

No database yet, deliberately. All state runs through typed domain models in
`src/lib/domain/` so the Supabase migration is mechanical rather than a
rewrite — see *Data layer* below.

### Two root layouts, on purpose

`src/app/(consumer)/layout.tsx` and `src/app/(military)/layout.tsx` are both
root layouts. Next.js allows one per top-level route group, which gives each
product its own `<html>` attributes, metadata and brand tokens with no runtime
theme switching and no flash of the wrong palette. Crossing between `/` and
`/mil` triggers a hard navigation — correct, because they are two products.

### Design system

One token contract, two brands, in `src/app/globals.css`. Components consume
semantic tokens (`bg-surface`, `text-ink`, `border-line`, `bg-accent`) and
never reference a brand. Flipping `data-brand` on `<html>` reskins the entire
tree with zero component changes.

| | Consumer (`nok`) | Military (`nokm`) |
|---|---|---|
| Ground | Bone `#fbf9f6` | Near-black `#07090a` |
| Accent | Sienna `#b4531f` | Signal amber `#e0a22e` |
| Display | Instrument Serif, used broadly | Instrument Serif, rationed to headlines |
| Structure | Sans | Mono labels, tabular figures |

Sage green and navy — the two palettes every competitor in this category uses —
are deliberately absent.

### Motion

Motion 13 (`motion/react`). House rules, enforced in
`src/components/motion/primitives.tsx`:

1. **Reduced motion is gated at the source.** Every primitive checks
   `useReducedMotion()` and renders the *end state*, never a half-built layout.
   `<MotionConfig reducedMotion="user">` covers the component layer; a media
   query in `globals.css` covers CSS.
2. **Only transform and opacity animate on scroll paths.** Those are composited
   everywhere. `filter` and `clip-path` are not.
3. **Scroll position lives in MotionValues, never in `useState`.**
4. **Reduced-motion end states are derived at render, not pushed through
   `setState` in an effect.** `useReducedMotion()` resolves after first paint,
   so writing it to state cascades a render for every animated node on the page.

---

## Data layer

`src/lib/domain/` holds the entire model. Nothing else knows what a record is.

- `types.ts` — `VaultRecord`, `Member`, `AccessTier`, `ReleaseProtocol`,
  `ServiceProfile`. Field names are already snake_case-compatible.
- `readiness.ts` — the scoring rule, in one testable function.
- `forms.ts` — the form register. See below; this one matters.
- `demo.ts` — seed data. Fixed ISO dates, never `Date.now()` at module scope,
  so server and client cannot straddle midnight and produce a hydration
  mismatch.

### The readiness rule

Two opinions are encoded in `computeReadiness()` rather than left to the UI:

**Weighted, not counted.** A completion percentage that treats "burial flag
preference" the same as the discharge certificate is a vanity metric. Blocking
records are worth 5×.

**One blocking gap caps the score at 60%.** If the document that gates every
other benefit is missing, the family is not 92% ready — they are stuck. The
readiness instrument animates *up* to the naive number and then visibly drops
to the capped one, because the drop is the argument.

---

## The form register — read this before touching `forms.ts`

A form number is a factual claim. If the product tells a grieving family to
file the wrong one, they lose weeks at the worst possible moment.

So no form number appears inline in a component anywhere in this codebase.
Every one is declared in `src/lib/domain/forms.ts` with a `source` URL that a
human actually read, a `checkedAt` date, and a `verified` flag.

```bash
npm run verify:forms            # structural check; exits 1 on any unverified entry
npm run verify:forms -- --net   # additionally resolves every source URL
npm run verify:forms -- --report # prints status without failing
```

The checker also rejects any source that is not a `.gov` or `.mil` host. A law
firm's summary of a form is not a source for that form's number.

`getForm()` throws in production for unverified entries. The UI renders them
with a visible *"awaiting source verification"* badge in development, and the
survivor packet withholds them rather than printing them on trust.

**This machinery exists because of a real incident**: a form number that was
never a real document shipped in a product and stayed there for about a year,
because it looked plausible and nobody had a way to check. A failing check
beats a confident sentence.

---

## What was cut, and why

All four of these were in `Next_of_Kin_Business_Plan_V9.pdf`. Each is a real
business. Each one, attached to this one, is why it would never ship.

**Bill pay.** Receiving money to pay a third party's obligations is money
transmission. Fifty-state licensing is a $500K–$2M, multi-year project before a
single bill is paid.

**Will and trust generation.** Producing legal documents as a non-lawyer is
regulated state by state and still unsettled where AI is involved. This product
*holds* the will, tracks whether it has aged out, and tells you when to go back
to a lawyer.

**DNA, blood testing, in-house lab, telemedicine.** Laboratory certification and
HIPAA business-associate status are multi-year six-figure undertakings sharing
no engineering, no compliance surface, and no customer moment with a family
record.

**E-commerce marketplace.** Flowers and memorial goods are a different company
wearing this one's logo.

Also note: **pre-need funeral revenue share is regulated.** Taking a cut of a
pre-need contract likely requires a preneed seller licence, and an insurance
producer licence where the contract is insurance-funded. It is not a BD deal.

The consumer site says all of this out loud at `/#honest`. Stating the scope
cuts publicly is cheaper than being asked about them in diligence.

---

## What is not built yet

Stated plainly so nobody demos this as finished.

- **No backend.** No auth, no database, no persistence. Every mutation is local
  React state and resets on reload.
- **No encryption.** The security model at `/mil#security` describes the
  intended design; `docs/key-escrow.md` specifies it. None of it is implemented.
- **No passkey enrolment.** The invite flow is a UI demonstration.
- **No real form verification yet.** All nine register entries are
  `verified: false` pending the audit recorded in `docs/form-register.md`.
- **Entity is wrong for raising.** An Alabama Series LLC does not survive
  institutional diligence; conversion to a Delaware C-corp is step one and is
  cheapest before anyone else holds units.

---

## Next

1. Convert the entity. Nothing else about fundraising matters until this is done.
2. Finish the form register audit; flip the nine flags; let the check go green.
3. Supabase — Postgres, row-level security, storage. The domain models drop in
   as tables with no reshaping.
4. Passkey auth (WebAuthn), then client-side envelope encryption per
   `docs/key-escrow.md`.
5. One funeral home or one VSO in Birmingham or Huntsville, contracted. This is
   worth more than any amount of further building — see `docs/decisions.md`.
