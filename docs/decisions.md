# Decisions

Why this build looks the way it does. Every claim below traces to
`../../research.md`, which carries the source URLs and dates.

---

## 1. The category's exit pattern is "acquired, then switched off"

| Company | Raised | Outcome |
|---|---|---|
| Everplans | $16.4M | Sold to National Guardian Life (2021), re-sold to **Precoa** — a pre-need funeral marketer — Oct 2024 |
| Cake | $3.7M | Acquired by Foundation Partners Group Oct 2024; **all consumer accounts terminated 15 Jun 2025**, data deleted |
| Lantern | undisclosed | Acquired by Wellthy 2023; standalone product **decommissioned Sept 2024** |
| Farewill (UK) | $35.4M | Sold to Dignity plc for **$16.8M** — roughly half the capital raised |

The D2C family vault has never been the business. It keeps being bought as a
lead-generation asset and then turned off.

**Precoa buying Everplans is precisely the strategy in the V9 plan** — vault
distributed through the funeral pre-need channel — already executed, in
October 2024, by the incumbent, with distribution NOK does not have.

Meanwhile every company actually growing abandoned D2C:

- **Empathy** — $162M raised, sells "LifeVault" to employers and insurers, gives it away
- **Wealth.com** — $65M Series B (Apr 2026), sells to RIAs
- **Trust & Will** — Series C investors are Northwestern Mutual, UBS, Erie Insurance and 130 credit unions. That is a distribution round
- **FreeWill** — wills are free; nonprofits pay for bequest intent

And the demand signal is worse than a deck would suggest: **only 24% of
Americans had a will in 2025, down from 33% in 2022** (Caring.com). That number
fell while every one of the above was scaling.

**Decision:** do not build a D2C vault and hope. Build the two things the
graveyard does not cover — an institutional wedge (NOKM) and a consumer
mechanic nobody has tried (the inversion, §3).

---

## 2. Three features were removed because they are company-killers

Not because they are bad ideas. Because attached to this product at this stage
they guarantee it never ships.

**Bill pay → money transmitter licensing.** Receiving money to pay an obligor's
bills is money transmission. Fifty-state coverage is $250K–$435K in minimums
and realistically **$500K–$2M** for a 40–50 state build-out. This single
feature is a company-killer at pre-seed. Use a licensed BaaS partner or drop it.

**Will/trust generation → unauthorized practice of law.** State by state, and
still unsettled for AI-generated documents. LegalZoom fought this for a decade;
North Carolina only resolved it by statute in 2016. The compliant pattern is
attorney-reviewed templates, no individualised advice, explicit disclaimers and
state registration. Holding and tracking documents carries none of that
exposure. So: hold, track, refer out.

**DNA / blood testing / in-house lab.** Laboratory certification and HIPAA
business-associate status are multi-year, six-figure undertakings with no
engineering, compliance or customer-moment overlap with a family record. The
whiteboard splitting funding across "App / Center / Lab" is the point where the
plan stops being a software company.

**Also, and not optional:** pre-need funeral sales are insurance-regulated per
state. Revenue share on a pre-need contract likely triggers a **preneed seller
licence**, plus an **insurance producer licence** where insurance-funded. "Partner
with funeral homes and take a cut" is a licensed activity.

These cuts are stated publicly at `/#honest`. Volunteering them is cheaper than
being asked in diligence.

---

## 3. The consumer product inverts who starts it

Retention is the category's actual failure mode, not awareness. Annual-plan
subscription retention runs around **17% still active after one year**
(RevenueCat, 2025). A vault's success state is that the user never opens it —
the worst possible feedback loop for a recurring subscription. No company in
this category has ever published consumer retention data, which is itself the
finding.

The usual diagnosis is that people avoid thinking about death. True, and not the
problem. **The problem is that the person being sold to is the only person in
the family who will never need the result.**

Their adult child will. So the record is opened by the child, and the invite
goes *up*. This fixes three things at once:

- **Retention** — the anxious person is the active user
- **Acquisition** — every invite is a second household, and the ask is specific and emotional rather than generic
- **Staleness** — gaps are visible to more than one person, so somebody notices

This is the only structural idea in the consumer build, and as far as the
research found, nobody has tried it.

---

## 4. NOKM is the stronger business, and it came from the whiteboards

The DD-214 / VA / military angle appears on three separate whiteboard photos
(12, 16 and 18 June) and **nowhere in the business plan**. It is the best idea
in the folder.

Why it beats the consumer product:

- **Acute, dated trigger.** Survivor benefits have deadlines. The "someday"
  problem that kills consumer vaults does not apply.
- **One document gates everything.** Rare clarity for a product to organise around.
- **Real budget holders.** Units, VSOs and state veterans affairs departments
  buy readiness. Consumers buy subscriptions and then cancel them.
- **Geography.** Huntsville and Birmingham are dense with veterans and defense
  families. The first design partner is local.

**The boundary that makes it work:** an organisation sees the aggregate score,
never the document. If that is not absolute, no service member enrols, and a
readiness product with no enrolment is a spreadsheet. It is enforced at the
query layer, not by UI convention.

## 5. Sequence

1. **Convert to a Delaware C-corp.** Cheapest now, while few people hold units. Nothing about fundraising works until this is done.
2. **Ship NOKM** to one design partner — a VSO or a National Guard unit in Huntsville or Birmingham.
3. **Finish the form register audit.** Let `npm run verify:forms` go green.
4. **Backend:** Supabase, passkeys, then envelope encryption per `key-escrow.md`.
5. **Consumer** follows the military build, reusing the same core. It is the second product, not the first.

The order matters more than the speed.

---

*Valuation benchmarks and negotiating context are kept out of this repository
deliberately — they are advice to the developer about his own position, not
product documentation. They live outside the project.*
