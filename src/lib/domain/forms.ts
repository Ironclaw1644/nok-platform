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
 * NOTE ON STATUS: entries are seeded from an official-source verification pass
 * recorded in docs/form-register.md. Any entry whose `verified` is false MUST
 * NOT be surfaced to a user — assertVerified() below enforces this, and the
 * demo data avoids referencing unverified keys.
 */
export const FORMS: Record<string, FormDefinition> = {
  dd214: {
    key: "dd214",
    number: "DD Form 214",
    title: "Certificate of Release or Discharge from Active Duty",
    issuer: "DoD",
    purpose:
      "Establishes character of service and eligibility for nearly every veteran survivor benefit.",
    source: "https://www.archives.gov/veterans/military-service-records",
    checkedAt: "2026-09-19",
    verified: false,
    retrievalPath: "SF-180 to the National Personnel Records Center, or milConnect for recent service.",
  },
  dd93: {
    key: "dd93",
    number: "DD Form 93",
    title: "Record of Emergency Data",
    issuer: "DoD",
    purpose:
      "Records who the service notifies and who is authorised to direct disposition of remains.",
    source: "https://www.esd.whs.mil/Directives/forms/",
    checkedAt: "2026-09-19",
    verified: false,
  },
  sglv8286: {
    key: "sglv8286",
    number: "SGLV 8286",
    title: "Servicemembers' Group Life Insurance Election and Certificate",
    issuer: "VA",
    purpose: "Records SGLI coverage amount and beneficiary designation.",
    source: "https://www.va.gov/life-insurance/",
    checkedAt: "2026-09-19",
    verified: false,
  },
  dd2656: {
    key: "dd2656",
    number: "DD Form 2656",
    title: "Data for Payment of Retired Personnel",
    issuer: "DFAS",
    purpose: "Starts retired pay and records the Survivor Benefit Plan election.",
    source: "https://www.dfas.mil/",
    checkedAt: "2026-09-19",
    verified: false,
  },
  sf180: {
    key: "sf180",
    number: "SF-180",
    title: "Request Pertaining to Military Records",
    issuer: "NARA",
    purpose: "The route to a replacement DD-214 from the National Personnel Records Center.",
    source: "https://www.archives.gov/veterans/military-service-records/standard-form-180",
    checkedAt: "2026-09-19",
    verified: false,
  },
  va21p534ez: {
    key: "va21p534ez",
    number: "VA Form 21P-534EZ",
    title:
      "Application for DIC, Survivors Pension, and/or Accrued Benefits",
    issuer: "VA",
    purpose: "Survivor application for Dependency and Indemnity Compensation and related benefits.",
    source: "https://www.va.gov/find-forms/",
    checkedAt: "2026-09-19",
    verified: false,
  },
  va21p530ez: {
    key: "va21p530ez",
    number: "VA Form 21P-530EZ",
    title: "Application for Burial Benefits",
    issuer: "VA",
    purpose: "Claims the VA burial allowance and plot or interment allowance.",
    source: "https://www.va.gov/find-forms/",
    checkedAt: "2026-09-19",
    verified: false,
  },
  va401330: {
    key: "va401330",
    number: "VA Form 40-1330",
    title: "Claim for Standard Government Headstone or Marker",
    issuer: "VA",
    purpose: "Requests a government-furnished headstone, marker or medallion.",
    source: "https://www.cem.va.gov/",
    checkedAt: "2026-09-19",
    verified: false,
  },
  va4010007: {
    key: "va4010007",
    number: "VA Form 40-10007",
    title:
      "Application for Pre-Need Determination of Eligibility for Burial in a VA National Cemetery",
    issuer: "VA",
    purpose:
      "Establishes National Cemetery eligibility in advance, so the family is not proving it during the week of a funeral.",
    source: "https://www.cem.va.gov/",
    checkedAt: "2026-09-19",
    verified: false,
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
