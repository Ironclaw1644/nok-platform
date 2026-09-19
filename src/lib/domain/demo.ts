import type {
  Member,
  ReleaseProtocol,
  ServiceProfile,
  TierDefinition,
  UnitReadiness,
  VaultRecord,
} from "./types";

/* ---------------------------------------------------------------------------
   Seed data for the working demo.

   All dates are fixed ISO strings, never computed from Date.now() at module
   scope — a server-rendered "14 days ago" and a client-hydrated "14 days ago"
   can straddle midnight and produce a hydration mismatch. Anything relative is
   computed inside a client component.

   The gaps in this data are chosen, not random: the veteran profile is missing
   its DD-214 and has a stale emergency-data form, because that specific pair
   is the most common real-world failure and it makes the readiness cap visible
   the moment the console loads.
------------------------------------------------------------------------- */

export const ACCESS_TIERS: TierDefinition[] = [
  {
    tier: 1,
    name: "Daily circle",
    who: "Spouse, adult children, anyone in the day-to-day",
    quorum: 1,
    requiresRelease: false,
    grants: ["Shared calendar", "Family wall", "Announcements", "Contact sheet"],
  },
  {
    tier: 2,
    name: "Named beneficiary",
    who: "Adult children and named heirs",
    quorum: 1,
    requiresRelease: false,
    grants: [
      "Estate outline",
      "Care directives",
      "Funeral and burial wishes",
      "Non-sensitive documents",
    ],
  },
  {
    tier: 3,
    name: "Executor and counsel",
    who: "Named executor, trustee, estate attorney",
    quorum: 2,
    requiresRelease: true,
    grants: [
      "Full document vault",
      "Account register",
      "Credentials",
      "Benefit claim packet",
    ],
  },
];

/* --- NOKM: service member --------------------------------------------- */

export const DEMO_PROFILE: ServiceProfile = {
  name: "Marcus Ellison",
  branch: "Army",
  component: "Retired",
  rank: "SFC (E-7)",
  serviceYears: "2001 – 2023",
  unit: "Ret. — 1st Bn, 187th Inf Rgt",
  padd: "Denise Ellison (spouse)",
};

export const DEMO_MILITARY_RECORDS: VaultRecord[] = [
  {
    id: "r-dd214",
    formKey: "dd214",
    title: "Discharge certificate",
    category: "service",
    status: "missing",
    criticality: "blocking",
    reviewDays: null,
    minTier: 2,
    unlocks: [
      "National Cemetery interment",
      "Government headstone or marker",
      "Burial flag",
      "Military funeral honors",
      "VA burial allowance",
    ],
    retrievalPath:
      "Request from the National Personnel Records Center. Allow weeks, not days — which is why this is retrieved now and not later.",
    note: "Lost in the 2019 move. Never replaced.",
  },
  {
    id: "r-dd93",
    formKey: "dd93",
    title: "Record of emergency data",
    category: "service",
    status: "verified",
    criticality: "blocking",
    lastVerified: "2023-02-14",
    reviewDays: 365,
    minTier: 2,
    unlocks: [
      "Who the service notifies first",
      "Authority to direct disposition of remains",
    ],
    note: "Last updated before the divorce and remarriage. Almost certainly names the wrong person.",
  },
  {
    id: "r-sgli",
    formKey: "sglv8286",
    title: "Life insurance election and beneficiaries",
    category: "benefit",
    status: "verified",
    criticality: "blocking",
    lastVerified: "2026-06-02",
    reviewDays: 365,
    minTier: 3,
    unlocks: ["Life insurance payout routing", "Beneficiary split"],
  },
  {
    id: "r-sbp",
    formKey: "dd2656",
    title: "Retired pay and survivor annuity election",
    category: "benefit",
    status: "on_file",
    criticality: "high",
    lastVerified: "2023-08-30",
    reviewDays: 730,
    minTier: 3,
    unlocks: ["Survivor annuity to surviving spouse", "Retired pay records"],
  },
  {
    id: "r-rating",
    title: "VA disability rating decision letter",
    category: "benefit",
    status: "verified",
    criticality: "high",
    lastVerified: "2026-04-18",
    reviewDays: 365,
    minTier: 2,
    unlocks: [
      "Survivor compensation eligibility",
      "Dependents' education benefits",
      "Accrued benefits claim",
    ],
  },
  {
    id: "r-preneed",
    formKey: "va4010007",
    title: "Pre-need cemetery eligibility determination",
    category: "benefit",
    status: "missing",
    criticality: "high",
    minTier: 2,
    unlocks: ["Confirmed National Cemetery eligibility, decided in advance"],
    retrievalPath:
      "Filed once, while living. Turns a week of proving eligibility into a phone call.",
  },
  {
    id: "r-will",
    title: "Will",
    category: "legal",
    status: "verified",
    criticality: "high",
    lastVerified: "2024-11-05",
    reviewDays: 1095,
    minTier: 3,
    unlocks: ["Estate distribution", "Executor authority"],
    note: "Drafted by counsel. Original with the firm; certified copy held here.",
  },
  {
    id: "r-poa",
    title: "Durable power of attorney",
    category: "legal",
    status: "verified",
    criticality: "high",
    lastVerified: "2024-11-05",
    reviewDays: 1095,
    minTier: 3,
    unlocks: ["Authority to act during incapacity"],
  },
  {
    id: "r-directive",
    title: "Advance healthcare directive",
    category: "medical",
    status: "stale",
    criticality: "high",
    lastVerified: "2021-03-22",
    reviewDays: 730,
    minTier: 2,
    unlocks: ["Treatment decisions during incapacity", "Named health proxy"],
  },
  {
    id: "r-accounts",
    title: "Account and policy register",
    category: "financial",
    status: "on_file",
    criticality: "standard",
    lastVerified: "2026-01-09",
    reviewDays: 365,
    minTier: 3,
    unlocks: ["Locating assets", "Closing accounts", "Stopping recurring charges"],
  },
  {
    id: "r-wishes",
    title: "Funeral and burial wishes",
    category: "personal",
    status: "verified",
    criticality: "standard",
    lastVerified: "2026-05-30",
    reviewDays: 730,
    minTier: 2,
    unlocks: ["Service preferences", "Honors requested", "Interment location"],
  },
  {
    id: "r-letters",
    title: "Letters to family",
    category: "personal",
    status: "on_file",
    criticality: "standard",
    reviewDays: null,
    minTier: 2,
    unlocks: ["Released to named recipients"],
  },
];

export const DEMO_MEMBERS: Member[] = [
  {
    id: "m-1",
    name: "Denise Ellison",
    relationship: "Spouse",
    tier: 1,
    state: "active",
    contactMasked: "+1 (•••) •••-4417",
    lastActive: "2026-09-17",
    isKeyHolder: true,
  },
  {
    id: "m-2",
    name: "Jordan Ellison",
    relationship: "Son",
    tier: 2,
    state: "active",
    contactMasked: "+1 (•••) •••-9052",
    lastActive: "2026-09-11",
    isKeyHolder: true,
  },
  {
    id: "m-3",
    name: "Alicia Ellison-Ward",
    relationship: "Daughter",
    tier: 2,
    state: "active",
    contactMasked: "+1 (•••) •••-2288",
    lastActive: "2026-08-29",
    isKeyHolder: false,
  },
  {
    id: "m-4",
    name: "Raymond Teague",
    relationship: "Executor",
    tier: 3,
    state: "active",
    contactMasked: "+1 (•••) •••-6130",
    lastActive: "2026-07-02",
    isKeyHolder: true,
  },
  {
    id: "m-5",
    name: "Priya Anand",
    relationship: "Estate attorney",
    tier: 3,
    state: "invited",
    contactMasked: "+1 (•••) •••-7741",
    invitedAt: "2026-09-14",
    isKeyHolder: true,
  },
  {
    id: "m-6",
    name: "Curtis Ellison",
    relationship: "Brother",
    tier: 1,
    state: "expired",
    contactMasked: "+1 (•••) •••-3364",
    invitedAt: "2026-06-21",
    isKeyHolder: false,
  },
];

export const DEMO_RELEASE: ReleaseProtocol = {
  state: "armed",
  quorum: 2,
  totalShares: 4,
  challengeWindowDays: 7,
  checkInDays: 90,
  lastCheckIn: "2026-08-24",
};

/* --- NOKM: organisation view ------------------------------------------- */

export const DEMO_UNITS: UnitReadiness[] = [
  { id: "u-1", name: "1-187 IN", population: 642, ready: 0.71, blocked: 84, trend30d: 0.06 },
  { id: "u-2", name: "2-506 IN", population: 588, ready: 0.63, blocked: 112, trend30d: 0.04 },
  { id: "u-3", name: "3-320 FA", population: 431, ready: 0.82, blocked: 31, trend30d: 0.09 },
  { id: "u-4", name: "626 BSB", population: 517, ready: 0.55, blocked: 158, trend30d: -0.02 },
  { id: "u-5", name: "1-101 AVN", population: 705, ready: 0.77, blocked: 62, trend30d: 0.05 },
];

/* --- NOK: consumer ------------------------------------------------------ */

/**
 * The consumer circle, seeded to show the inversion: the record was started by
 * Alicia (the daughter), and her mother Ruth is a Tier 1 member who joined
 * afterward. Every competitor's demo data has the parent as account owner.
 * Ours does not, and that is the product.
 */
export const DEMO_FAMILY: Member[] = [
  {
    id: "f-1",
    name: "Ruth Vance",
    relationship: "Mother",
    tier: 1,
    state: "active",
    contactMasked: "+1 (•••) •••-2041",
    lastActive: "2026-09-18",
    isKeyHolder: true,
  },
  {
    id: "f-2",
    name: "Daniel Vance",
    relationship: "Brother",
    tier: 2,
    state: "active",
    contactMasked: "+1 (•••) •••-8876",
    lastActive: "2026-09-09",
    isKeyHolder: true,
  },
  {
    id: "f-3",
    name: "Harold Vance",
    relationship: "Father",
    tier: 1,
    state: "invited",
    contactMasked: "+1 (•••) •••-5519",
    invitedAt: "2026-09-16",
    isKeyHolder: false,
  },
  {
    id: "f-4",
    name: "Marion Keel",
    relationship: "Executor",
    tier: 3,
    state: "active",
    contactMasked: "+1 (•••) •••-3302",
    lastActive: "2026-06-30",
    isKeyHolder: true,
  },
];

export const DEMO_CONSUMER_RECORDS: VaultRecord[] = [
  {
    id: "c-will",
    title: "Will",
    category: "legal",
    status: "missing",
    criticality: "blocking",
    minTier: 3,
    unlocks: ["Who decides", "Who inherits", "Who raises the children"],
    retrievalPath: "Drafted with an attorney. We hold the certified copy and tell you when it ages out.",
  },
  {
    id: "c-directive",
    title: "Healthcare directive",
    category: "medical",
    status: "verified",
    criticality: "blocking",
    lastVerified: "2026-03-14",
    reviewDays: 730,
    minTier: 2,
    unlocks: ["Treatment decisions", "Named health proxy"],
  },
  {
    id: "c-policy",
    title: "Life insurance policy",
    category: "financial",
    status: "verified",
    criticality: "high",
    lastVerified: "2026-07-21",
    reviewDays: 365,
    minTier: 3,
    unlocks: ["Payout routing", "Beneficiary designation"],
  },
  {
    id: "c-accounts",
    title: "Account register",
    category: "financial",
    status: "stale",
    criticality: "high",
    lastVerified: "2024-09-02",
    reviewDays: 365,
    minTier: 3,
    unlocks: ["Finding the accounts", "Stopping the subscriptions"],
  },
  {
    id: "c-deed",
    title: "Property deed and mortgage",
    category: "financial",
    status: "on_file",
    criticality: "high",
    lastVerified: "2025-12-01",
    reviewDays: 1095,
    minTier: 3,
    unlocks: ["Title transfer", "Mortgage payoff"],
  },
  {
    id: "c-wishes",
    title: "Funeral wishes",
    category: "personal",
    status: "verified",
    criticality: "standard",
    lastVerified: "2026-08-02",
    reviewDays: 730,
    minTier: 2,
    unlocks: ["Burial or cremation", "Service preferences", "Who speaks"],
  },
  {
    id: "c-letters",
    title: "Letters and recordings",
    category: "personal",
    status: "on_file",
    criticality: "standard",
    reviewDays: null,
    minTier: 2,
    unlocks: ["Released to named recipients"],
  },
  {
    id: "c-pets",
    title: "Care instructions",
    category: "personal",
    status: "verified",
    criticality: "standard",
    lastVerified: "2026-09-01",
    reviewDays: 365,
    minTier: 1,
    unlocks: ["Pets", "Plants", "The things nobody wrote down"],
  },
];
