/* ---------------------------------------------------------------------------
   Domain model — shared by both surfaces.

   Written against a repository interface (see lib/data/repository.ts) rather
   than a client, so the demo adapter can be swapped for Postgres/Supabase
   without touching a component. Field names are already snake_case-compatible
   so the migration is mechanical.
------------------------------------------------------------------------- */

/** How close a record is to being usable by someone who needs it today. */
export type RecordStatus =
  | "verified" // present, and checked against an authoritative source
  | "on_file" // present, but never verified
  | "stale" // present and verified, but past its re-check interval
  | "requested" // retrieval in progress (e.g. SF-180 filed with NPRC)
  | "missing"; // not held

/** What breaks if the record is missing when it is needed. */
export type Criticality = "blocking" | "high" | "standard";

export type RecordCategory =
  | "service"
  | "benefit"
  | "legal"
  | "medical"
  | "financial"
  | "personal";

export interface VaultRecord {
  id: string;
  /** Registry key into lib/domain/forms.ts, when this record is a known form. */
  formKey?: string;
  title: string;
  category: RecordCategory;
  status: RecordStatus;
  criticality: Criticality;
  /** ISO date the record was last confirmed accurate. */
  lastVerified?: string;
  /** Re-verification interval in days. Null = never goes stale. */
  reviewDays?: number | null;
  /** Plain-language statement of what this record unlocks. This is the whole
   *  argument of the product and it belongs in the data, not in copy. */
  unlocks: string[];
  /** Which access tier may see it. */
  minTier: AccessTier;
  note?: string;
  /** Where a replacement is obtained, if missing. */
  retrievalPath?: string;
}

/* --- Access model ---------------------------------------------------------
   The three-tier structure from the original plan, tightened. The plan had
   "biometric auth" as the differentiator at each tier; biometrics are not an
   authorisation level, they are a local unlock gesture. What actually
   separates the tiers is (1) how many parties must agree and (2) whether a
   release condition has fired. That is what is modelled here.
------------------------------------------------------------------------- */

export type AccessTier = 1 | 2 | 3;

export interface TierDefinition {
  tier: AccessTier;
  name: string;
  who: string;
  /** Number of independent key-holders required to open this tier. */
  quorum: number;
  /** Whether access requires a release event (death/incapacity) to have fired. */
  requiresRelease: boolean;
  grants: string[];
}

export type MemberState = "active" | "invited" | "expired" | "declined";

export interface Member {
  id: string;
  name: string;
  relationship: string;
  tier: AccessTier;
  state: MemberState;
  /** Masked for display — never store or render a full phone number in a
   *  surface that could end up in a screenshot. */
  contactMasked: string;
  lastActive?: string;
  /** Holds a share of the recovery key. */
  isKeyHolder: boolean;
  invitedAt?: string;
}

/* --- Release protocol -----------------------------------------------------
   "Executor gets access when you die" is the hard problem in this product.
   Modelled explicitly so the UI can show its real state rather than implying
   a guarantee the crypto does not provide. */

export type ReleaseState =
  | "armed" // normal operation
  | "challenged" // a release was requested; challenge window open
  | "released"; // quorum met and window elapsed

export interface ReleaseProtocol {
  state: ReleaseState;
  /** Key-holder shares needed to reconstruct. */
  quorum: number;
  totalShares: number;
  /** Days the owner has to cancel a release request before it completes. */
  challengeWindowDays: number;
  /** Set while state === "challenged". */
  challengeOpenedAt?: string;
  challengedBy?: string;
  /** Proof-of-life cadence that silently re-arms the protocol. */
  checkInDays: number;
  lastCheckIn: string;
}

/* --- Readiness ------------------------------------------------------------ */

export interface ReadinessBreakdown {
  score: number; // 0..1
  blocking: { total: number; ready: number };
  high: { total: number; ready: number };
  standard: { total: number; ready: number };
  /** Records that would block a survivor benefit today. Ordered by urgency. */
  gaps: VaultRecord[];
  staleCount: number;
}

/* --- Service member profile (NOKM) ---------------------------------------- */

export interface ServiceProfile {
  name: string;
  branch: "Army" | "Navy" | "Air Force" | "Marine Corps" | "Space Force" | "Coast Guard";
  component: "Active" | "Reserve" | "National Guard" | "Retired" | "Veteran";
  rank: string;
  /** Deliberately NOT storing a real DoD ID or SSN anywhere in this model.
   *  Those belong in an encrypted blob keyed per-record, never in a row that
   *  gets rendered, logged, or exported to an analytics pipeline. */
  serviceYears: string;
  unit?: string;
  /** Person Authorized to Direct Disposition — recorded on the emergency-data
   *  form, and the single field families most often discover is out of date. */
  padd?: string;
}

/* --- Organisation view (the NOKM government/unit sale) -------------------- */

export interface UnitReadiness {
  id: string;
  name: string;
  population: number;
  /** Share of the population at full readiness. */
  ready: number;
  /** Members with at least one blocking gap. */
  blocked: number;
  trend30d: number;
}
