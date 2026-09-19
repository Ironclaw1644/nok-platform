# Key escrow and the release protocol

Status: **design, not implemented.** Nothing in `src/` does cryptography yet.
This document exists so that when it is built, it is built once.

This is the hard problem in the product. Everything else — the record list, the
readiness score, the packet — is ordinary application work. The sentence *"your
executor gets access when you die"* is not, and every product in this category
writes that sentence without explaining it.

---

## 1. What the original plan got wrong, and it matters

`Next_of_Kin_Business_Plan_V9.pdf` §4 describes:

> *Biometric authentication unlocks local cryptographic keys on the recipient's
> phone, enabling zero-knowledge access to designated vaults and media feeds
> without storing raw biometric data on central servers.*

The second half is right and well stated. The framing around it is not, in a
way that will be caught in technical diligence:

**Biometrics are not an authorisation level.** The plan's three access tiers are
distinguished by "single-factor biometric", "biometric + PIN/SMS" and "biometric
+ multi-party verification". The first two are the same security property — a
gesture that unlocks a key already on that device. Face ID does not produce a
key and does not prove identity to a server; it gates the device's secure
enclave. Two tiers separated only by whether a PIN is also typed are one tier.

What actually separates the tiers is: **(a) how many independent parties must
agree, and (b) whether a release condition has fired.** That is what
`TierDefinition` models in `src/lib/domain/types.ts`, and it is the correction
that makes the tier system mean something.

**"Zero-knowledge" has a cost the plan does not name.** If the server cannot
decrypt, the server cannot help a user who has lost their device. Every vendor
that advertises zero-knowledge and also offers account recovery by email is
doing one of those two things falsely. The scheme below pays the cost honestly
via quorum recovery, and the marketing surface at `/mil#security` states the
residual risk out loud.

---

## 2. Threat model

Ranked by how likely each is to actually happen to this product.

| # | Threat | Addressed by |
|---|---|---|
| 1 | Owner loses their phone | Quorum recovery (§4) |
| 2 | Family member coerces early release | Challenge window (§5) |
| 3 | Our database is breached or subpoenaed | Client-side encryption (§3) |
| 4 | Owner dies; executor must get in | Release protocol (§5) |
| 5 | Estranged relative gains one device | Quorum ≥ 2 (§4) |
| 6 | Insider at the vendor reads records | No server-side plaintext (§3) |
| 7 | Owner forgets everything, all key-holders unreachable | **Not addressed.** §7 |

Threat 1 is first because it is the one that occurs weekly, and it is the one
that a naive client-side-encryption design turns into permanent data loss.
Designing for threat 3 while ignoring threat 1 is how vaults lose their users'
data and their reputation in the same week.

---

## 3. Key hierarchy

Three levels. Standard envelope encryption; nothing novel, which is the point.

```
Account Key (AK)              256-bit, generated on device at signup.
  │                           Never transmitted. Never derivable by the server.
  │
  ├── wraps ──> Record Key (RK)   one per record, 256-bit
  │                 │
  │                 └── AES-256-GCM ──> record ciphertext + blob
  │
  ├── split ──> Shamir shares s₁..sₙ   (§4)
  │
  └── wrapped by ──> Device Key (DK)   one per enrolled device
                         │
                         └── held in Secure Enclave / Android Keystore,
                             released by passkey assertion (WebAuthn, UV required)
```

**What the server stores:** record ciphertext, per-record wrapped keys, wrapped
AK blobs per device, Shamir share ciphertexts, and metadata (titles, statuses,
review dates, tier assignments). **What it never stores:** AK, DK, RK, or any
plaintext record body.

**Deliberate leak:** record *titles* and readiness metadata are stored in the
clear so the server can compute scores, drive review reminders, and serve the
aggregate unit view in `/mil#scale` without decrypting anything. This is a real
disclosure — the server knows a user has "Advance healthcare directive — stale"
— and it is accepted because encrypting metadata would make the product's core
loop impossible. It is written down here rather than glossed.

**Biometrics:** none collected, none transmitted, none stored. A passkey
assertion with user verification is what releases DK. The phrase "biometric
authentication" should not appear in any customer-facing security claim; it
implies a template we do not have and would not want.

---

## 4. Recovery: Shamir over named key-holders

The AK is split with Shamir's Secret Sharing into **n = 4** shares at threshold
**k = 2**, distributed to key-holders the owner names — the people already
modelled as `Member.isKeyHolder`.

Each share is encrypted to that key-holder's own device key. A key-holder's
phone therefore holds a share they cannot read as plaintext and cannot use
alone.

Why `k = 2, n = 4` as the default:

- **k = 1 is a single point of compromise.** Any one relative could open the
  vault.
- **k = 3 fails in practice.** Families are geographically scattered and
  sometimes estranged; requiring three people to act in the same week is how a
  recovery never completes.
- **n = 4 tolerates one unreachable and one uncooperative key-holder** and still
  recovers.

Both are configurable per account. The default is what most families should use
and what the demo shows.

**Device loss is therefore survivable:** the owner enrols a new device, two
key-holders approve, AK is reconstructed on the new device, DK is re-wrapped.
No vendor involvement, no support ticket, no backdoor.

---

## 5. Release protocol

Modelled in `ReleaseProtocol` and demonstrated end-to-end in
`src/components/product/release-panel.tsx`.

**States:** `armed → challenged → released`

1. **Armed.** Normal operation. Tier 3 sealed. The owner checks in every 90
   days. A missed check-in does *not* release anything — it only notifies
   key-holders that they may begin a request. A dead-man's switch that fires on
   silence alone will eventually fire on a long holiday.
2. **Challenged.** k key-holders have signed a release request. Every device on
   the account is notified, including the owner's, through every channel on
   file. A 7-day window opens.
3. **Released.** The window elapsed without cancellation. AK is reconstructed,
   tier 3 opens, and every subsequent access is logged and visible to all
   key-holders.

**The window is the entire security property.** A release that cannot be
cancelled is a release that can be coerced — by a relative who wants to see the
will early, by a creditor, by anyone who gets control of two devices. Quorum
alone stops one bad actor; the window is what stops two.

The owner cancelling is silent to the key-holders by default. Someone attempting
a coerced release should not learn that the attempt was detected.

---

## 6. Implementation notes

- **WebCrypto only.** `AES-256-GCM` for content, `HKDF-SHA-256` for derivation.
  No hand-rolled primitives, no JS reimplementation of AES.
- **Shamir:** use an audited library. Do not write the field arithmetic.
- **Passkeys:** WebAuthn with `userVerification: "required"` and a
  platform authenticator. This is what makes Face ID and Android
  BiometricPrompt work — via the standard, not via a native SDK.
- **PWA constraint, unresolved:** a browser-only PWA has no Secure Enclave
  access, so DK lives in IndexedDB protected by a passkey-derived wrapping key
  rather than in hardware. That is meaningfully weaker than the native path.
  Ship the PWA first anyway, and note the difference; wrapping in Expo later
  upgrades the storage without changing the scheme.
- **Key rotation:** rotating AK means re-wrapping every RK. Cheap, because RKs
  are small and record counts are in the dozens. Rotate on key-holder removal.
- **Never log a key.** Not in Sentry breadcrumbs, not in a debug build, not in
  a screenshot of the console. This is the same discipline the repo applies to
  form numbers: the machine should make it impossible, not the developer
  remember.

---

## 7. What this does not protect against

Stated here and, more importantly, stated to users at `/mil#security`.

- **Total key-holder loss.** If the owner's devices are gone and fewer than k
  key-holders can be reached, the records are unrecoverable. There is no vendor
  override. That is the price of the vendor having no backdoor, and it should
  be surfaced at enrolment, not discovered at recovery.
- **A compromised device at the moment of unlock.** If malware owns the phone
  after passkey assertion, it sees what the user sees. No key hierarchy fixes
  this.
- **Coercion of the owner directly.** The challenge window protects against
  key-holders acting without the owner. It does nothing if the owner is
  compelled to unlock.
- **Metadata analysis.** Per §3, record titles and readiness state are in the
  clear.

A security page that lists only strengths is marketing. This one is the spec.
