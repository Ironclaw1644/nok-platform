/* ---------------------------------------------------------------------------
   FORM REGISTRY — single source of truth for every form number this product
   shows a user.

   Why this file exists as its own module:

   A form number is a factual claim. If the product tells a grieving family
   "file VA Form 40-1330 to request a headstone" and that number is wrong, the
   family loses weeks at the worst possible moment and the product's core
   promise — that it knows what you need — is destroyed.

   So: no form number appears inline in a component anywhere in this codebase.
   Every one is declared here with a `source` URL that a human actually read,
   and a `verified` flag. `npm run verify:forms` fails the build if any entry
   reachable from a user-facing surface is unverified. The machine asserts it;
   a human reads green or red.

   Entries below were checked against official .gov/.mil sources — see
   docs/form-register.md for the audit trail and the date of each check.
------------------------------------------------------------------------- */

export interface FormDefinition {
  key: string;
  /** Exact official designation, e.g. "DD Form 214". */
  number: string;
  /** Exact official title as published by the issuing agency. */
  title: string;
  issuer: "DoD" | "VA" | "NARA" | "DFAS" | "SSA";
  /** One sentence, plain language: what this is for. */
  purpose: string;
  /** Official URL that was read to confirm number + title. */
  source: string;
  /** ISO date the source was last read by a human or verification pass. */
  checkedAt: string;
  /** False until confirmed against `source`. Gates rendering — see
   *  assertVerified() below. */
  verified: boolean;
  /** Where to obtain it if the family does not have it. */
  retrievalPath?: string;
}

/**
 * Verified 2026-09-19 against official .gov / .mil sources. The full audit
 * trail — including the claims that could NOT be confirmed — is in
 * docs/form-register.md. Read that before changing anything here.
 *
 * The audit changed the product, which is the point of having done it:
 * two benefits originally attributed to the DD 214 ("burial flag",
 * "national cemetery interment") are not stated as DD 214 requirements on
 * any official page that was read, and have been removed from the copy.
 */
export const FORMS: Record<string, FormDefinition> = {
  dd214: {
    key: "dd214",
    number: "DD Form 214",
    title: "Certificate of Release or Discharge from Active Duty",
    issuer: "DoD",
    purpose:
      "Establishes active service and character of discharge. Accepted for a government headstone or marker and required to establish eligibility for military funeral honors — in both cases, or another discharge document showing honorable service.",
    // `source` cites the form's NUMBER AND TITLE, which is this field's job.
    // The two benefit claims in `purpose` are sourced separately in
    // docs/form-register.md — headstone/marker to cem.va.gov/hmm, funeral
    // honors to militaryonesource.mil. cem.va.gov is deliberately not used
    // here: it serves an incomplete TLS chain that browsers repair via AIA
    // and Node does not, so the automated check cannot reach it.
    source: "https://www.archives.gov/personnel-records-center/dd-214",
    checkedAt: "2026-09-19",
    verified: true,
    retrievalPath:
      "eVetRecs at the National Archives (via VA.gov, needs an ID.me account), or milConnect for recent service. SF 180 by mail or fax is the paper route.",
  },
  dd93: {
    key: "dd93",
    number: "DD Form 93",
    title: "Record of Emergency Data",
    issuer: "DoD",
    purpose:
      "Records next of kin, death-gratuity beneficiaries, and the Person Authorized to Direct Disposition of remains.",
    source: "https://download.militaryonesource.mil/12038/Casualty/padd-rights-trifold.pdf",
    checkedAt: "2026-09-19",
    verified: true,
  },
  dd1300: {
    key: "dd1300",
    number: "DD Form 1300",
    title: "Report of Casualty",
    issuer: "DoD",
    purpose:
      "The official DoD report of death. For a death on active duty it does the job the DD 214 does for a veteran.",
    source: "https://www.va.gov/records/discharge-documents/",
    checkedAt: "2026-09-19",
    verified: true,
  },
  sglv8286: {
    key: "sglv8286",
    number: "SGLV 8286",
    title: "Servicemembers' Group Life Insurance Election and Certificate",
    issuer: "VA",
    purpose:
      "SGLI coverage amount and beneficiary election. Note: this paper form now applies to part-time coverage — full-time members elect through SOES online, so do not route an active-duty member here by default.",
    source: "https://www.benefits.va.gov/INSURANCE/forms/8286.htm",
    checkedAt: "2026-09-19",
    verified: true,
  },
  dd2656: {
    key: "dd2656",
    number: "DD Form 2656",
    title: "Data for Payment of Retired Personnel",
    issuer: "DFAS",
    purpose:
      "Establishes the retired-pay account — beneficiary for unpaid retired pay, withholding, dependents — and carries the Survivor Benefit Plan election.",
    source:
      "https://home.army.mil/bavaria/download_file/view/3f4875b5-6fc4-4671-b0f0-e2a84ecb0d4a/1414",
    checkedAt: "2026-09-19",
    verified: true,
  },
  dd26567: {
    key: "dd26567",
    number: "DD Form 2656-7",
    title: "Verification for Survivor Annuity",
    issuer: "DFAS",
    purpose:
      "The survivor's claim to start the annuity after the retiree dies. Distinct from DD 2656, which is the retiree's own election.",
    source: "https://home.army.mil/campbell/1616/7423/3465/dd2656-7.pdf",
    checkedAt: "2026-09-19",
    verified: true,
  },
  sf180: {
    key: "sf180",
    number: "SF 180",
    title: "Request Pertaining to Military Records",
    issuer: "NARA",
    purpose:
      "The mail or fax route to the National Personnel Records Center for a replacement DD 214.",
    source: "https://www.archives.gov/veterans/military-service-records/standard-form-180",
    checkedAt: "2026-09-19",
    verified: true,
  },
  va21p534ez: {
    key: "va21p534ez",
    number: "VA Form 21P-534EZ",
    title: "Application for DIC, Survivors Pension, and/or Accrued Benefits",
    issuer: "VA",
    purpose:
      "The survivor's claim for Dependency and Indemnity Compensation, Survivors Pension and accrued benefits.",
    source: "https://www.va.gov/find-forms/about-form-21p-534ez/",
    checkedAt: "2026-09-19",
    verified: true,
  },
  va21p530ez: {
    key: "va21p530ez",
    number: "VA Form 21P-530EZ",
    title: "Application for Burial Benefits (Under 38 U.S.C. Chapter 23)",
    issuer: "VA",
    purpose: "Claims the burial allowance, plot or interment allowance, and transportation.",
    source: "https://www.va.gov/find-forms/about-form-21p-530ez/",
    checkedAt: "2026-09-19",
    verified: true,
  },
  va401330: {
    key: "va401330",
    number: "VA Form 40-1330",
    title: "Claim for Standard Government Headstone or Marker",
    issuer: "VA",
    purpose: "Requests a government-furnished headstone, marker or medallion.",
    source: "https://www.va.gov/find-forms/about-form-40-1330/",
    checkedAt: "2026-09-19",
    verified: true,
  },
  va4010007: {
    key: "va4010007",
    number: "VA Form 40-10007",
    title:
      "Application for Pre-Need Determination of Eligibility for Burial in a VA National Cemetery",
    issuer: "VA",
    purpose:
      "Settles national cemetery eligibility in advance, so it is not being established during the week of a funeral.",
    source: "https://www.va.gov/find-forms/about-form-40-10007/",
    checkedAt: "2026-09-19",
    verified: true,
  },
  va272008: {
    key: "va272008",
    number: "VA Form 27-2008",
    title: "Application for United States Flag for Burial Purposes",
    issuer: "VA",
    purpose: "Requests the burial flag.",
    source: "https://www.va.gov/burials-memorials/memorial-items/burial-flags/",
    checkedAt: "2026-09-19",
    verified: true,
  },
  va400247: {
    key: "va400247",
    number: "VA Form 40-0247",
    title: "Presidential Memorial Certificate Request Form",
    issuer: "VA",
    purpose: "Requests the engraved certificate signed by the sitting President.",
    source: "https://www.va.gov/find-forms/about-form-40-0247/",
    checkedAt: "2026-09-19",
    verified: true,
  },
  va2122: {
    key: "va2122",
    number: "VA Form 21-22",
    title: "Appointment of Veterans Service Organization as Claimant's Representative",
    issuer: "VA",
    purpose:
      "Appoints an accredited VSO to represent the claimant before VA. Free, and the single highest-leverage form most families never file.",
    source: "https://www.va.gov/find-forms/about-form-21-22/",
    checkedAt: "2026-09-19",
    verified: true,
  },
};

/** Thrown at render time rather than silently shipping an unchecked claim. */
export class UnverifiedFormError extends Error {
  constructor(key: string) {
    super(
      `Form "${key}" is not verified against an official source. ` +
        `Confirm it in docs/form-register.md and set verified: true before surfacing it.`,
    );
    this.name = "UnverifiedFormError";
  }
}

/**
 * Resolve a form for display.
 *
 * In production an unverified form throws — a hard failure is strictly better
 * than a confident wrong sentence in front of a grieving family. In dev it
 * returns the entry so the surface is still buildable while verification is
 * in flight, but every unverified entry is visibly flagged in the UI.
 */
export function getForm(key: string): FormDefinition {
  const form = FORMS[key];
  if (!form) throw new Error(`Unknown form key: ${key}`);
  if (!form.verified && process.env.NODE_ENV === "production") {
    throw new UnverifiedFormError(key);
  }
  return form;
}

export function isVerified(key: string): boolean {
  return FORMS[key]?.verified ?? false;
}

export function unverifiedKeys(): string[] {
  return Object.values(FORMS)
    .filter((f) => !f.verified)
    .map((f) => f.key);
}
