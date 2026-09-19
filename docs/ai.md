# Where AI actually belongs in this product

Ranked by value, with the ones to refuse stated at the end. The test applied
throughout: **does the model do work a person would otherwise skip, or does it
produce an opinion someone might act on?** The first is the product. The second
is liability wearing a product's clothes.

---

## 1. Document intake — the highest-value use, and the least risky

**The problem it solves.** Filling the record is the entire friction. Nobody
wants to type in twelve documents. Every product in this category loses users
at exactly this step, and no amount of good UI fixes typing.

**What the model does.** Photograph a document. A vision model identifies what
it is, extracts the fields that matter — issue date, expiry, named
beneficiaries, policy or claim numbers — files it in the right row, and sets
its re-verification clock.

**Why it is safe.** It classifies and extracts. It does not advise. A wrong
classification is visible and correctable in one tap; a wrong *opinion* is not.

**Why it is worth the most.** It turns a forty-minute chore into a stack of
photographs. That is the difference between a record that gets filled and one
that does not — which, per `decisions.md`, is the difference between this
category's products working and dying.

*In the demo:* `/start` step 4, and the intake panel in both apps.

---

## 2. Cross-document conflict detection — the genuinely differentiated one

Nobody reads their twelve documents side by side. A model does it instantly,
and the conflicts it finds are precisely the ones that cause the disasters:

- The emergency-data form names an ex-spouse as the person authorised to
  direct disposition, while the circle lists a current spouse.
- The life insurance beneficiary and the will disagree about who gets what.
  **The policy wins, and the family finds out at the worst moment.**
- The will predates the youngest child's birth.
- The healthcare proxy named in the directive is no longer in the circle.
- The executor named in the will has never been invited to the account.

**This is the feature I would lead with.** It is not "AI-powered" as a
marketing line — it is a thing no human does, producing findings that are
checkable, specific, and occasionally alarming in a useful way. It also
generates the *reason to open the app again*, which is the retention problem
this whole category has failed to solve.

**The boundary:** it reports a contradiction between two documents. It does not
say which one is correct, and it does not say what to do about it beyond "these
disagree — speak to your attorney."

*In the demo:* the conflict scan in the readiness console.

---

## 3. The ask — writing the awkward message

Already in the consumer build, currently templated. The real version drafts the
text to your mother, in your register, about one specific missing document —
and redrafts it when you say "softer" or "she'll find this upsetting."

Small feature. It removes a genuine emotional barrier, which is the actual
reason people do not ask.

---

## 4. Voice intake — the one that reaches the actual user

The 72-year-old holding the information does not want to type into a form. He
will happily talk for ten minutes.

A phone call or a voice note, transcribed and structured into records, with
follow-up questions asked conversationally. This is the single feature most
likely to get a parent's knowledge out of their head, and it is the most
technically mature thing on this list.

---

## 5. The executor assistant — in the plan already, and it can be done safely

The V9 plan calls for an agent that walks executors through probate. That is a
good idea with a sharp edge.

**Safe version:** it sequences *tasks*, cites *forms from the verified
register*, tracks what has been filed, and says what typically comes next.
Logistics.

**Unsafe version:** it interprets a will, advises on distribution, or tells
someone whether they qualify for a benefit. That is legal advice, and doing it
by model is the fastest route to the UPL problem documented in `decisions.md`.

The line is: **sequence and cite, never interpret.**

---

## 6. NOKM: turning the aggregate dashboard into a recommendation

A unit commander does not need another dashboard. They need: *"158 of your
people are blocked, 71% of it is the same two record types, and a records drive
on those two moves readiness 18 points. Here is the list to contact."*

That is ordinary analysis over aggregate data, and it is what makes the
institutional product buyable rather than merely interesting. It reads only the
aggregates — never individual records — which is the boundary the whole NOKM
model rests on.

---

## What to refuse

**Generating wills or trusts.** Unauthorized practice of law, state by state,
and explicitly unsettled where a model drafts the text. The compliant pattern
is attorney-reviewed templates; the model's role is to *organise the intake*,
not to produce the instrument.

**Benefits determinations.** "You qualify for DIC" is a decision only VA makes.
The product may show what a form requires. It may not predict an outcome.

**Anything clinical.** Summarising medical records into guidance is a
regulated activity and an unbounded risk surface for a product whose job is
filing cabinets.

**Chatbot-on-the-vault.** An assistant with read access to every document in a
family's account, answering free-form questions, is the single worst place to
put a model in this product — maximum blast radius, minimum added value over a
search box. If it ships at all it ships after the encryption model does, and it
runs client-side.

---

## A note on the demo

Every AI interaction in the deployed demo is **scripted, not live**. No model
is called, no key is present, no data leaves the browser. The flows show what
the interaction feels like and what the output looks like; they are not
evidence that the extraction works. Building the real version is a week or two
per feature on top of a backend, and the ranking above is the order I would
build them in.
