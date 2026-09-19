/* ---------------------------------------------------------------------------
   Seed data for the AS-SPECIFIED build (/plan).

   This surface renders Next_of_Kin_Business_Plan_V9.pdf as written — all five
   service modules, the three access tiers, the partner network and the
   13-month rollout — so the three versions can be compared on product scope
   rather than on polish.

   Nothing here is an endorsement of the scope. Three of these modules carry
   licensing or regulatory exposure documented in docs/decisions.md. The point
   of building it is that "this is what you asked for, side by side with two
   alternatives" is a far more useful conversation than a list of objections.
------------------------------------------------------------------------- */

export interface PlanModule {
  id: string;
  n: string;
  title: string;
  /** The plan's own description, compressed. */
  blurb: string;
  features: string[];
  /** What this module needs before it could legally ship. Rendered only in
   *  the comparison view, never as part of the product pitch. */
  gate?: string;
}

export const PLAN_MODULES: PlanModule[] = [
  {
    id: "memories",
    n: "01",
    title: "Memories & Family Sharing",
    blurb:
      "A personalised repository and private media wall for messages, photos, videos, announcements and family stories, shared with key relatives and trusted relationships.",
    features: ["Private media wall", "Family announcements", "Story archive", "Shared albums"],
  },
  {
    id: "wills",
    n: "02",
    title: "Trusts & Wills",
    blurb:
      "Legal document organisation and creation tools for estate planning, guardianship assignments, pre-need planning and legal asset transfers.",
    features: ["Document creation", "Guardianship", "Pre-need planning", "Asset transfer"],
    gate: "Document generation by a non-lawyer is unauthorized practice of law in most states, and unsettled where AI drafts the text.",
  },
  {
    id: "calendar",
    n: "03",
    title: "Calendars & Bill Pay",
    blurb:
      "Centralised family calendars and financial scheduling for lifecycle dates, family events, recurring bill obligations and shared financial responsibilities.",
    features: ["Shared calendar", "Recurring bill pay", "Split responsibilities", "Due reminders"],
    gate: "Receiving funds to pay a third party's obligations is money transmission. 40–50 state coverage runs $500K–$2M before the first bill is paid.",
  },
  {
    id: "lockbox",
    n: "04",
    title: "Lockbox",
    blurb:
      "Enterprise-grade encrypted vaults with advanced password protection for sensitive financial data, account credentials, medical records and critical relationship information.",
    features: ["Credential vault", "Document storage", "Medical records", "Biometric unlock"],
  },
  {
    id: "store",
    n: "05",
    title: "Family Services Storefront",
    blurb:
      "An integrated marketplace for estate planning templates, gift cards, care packages, floral delivery, pre-need funeral services, diagnostic health testing kits and family subscription plans.",
    features: ["Estate templates", "Gifting & flowers", "Pre-need services", "Health test kits"],
    gate: "Pre-need funeral sales are insurance-regulated per state; diagnostic testing is a laboratory business with its own certification regime.",
  },
];

export interface PlanTier {
  tier: 1 | 2 | 3;
  name: string;
  roles: string;
  control: string;
  grants: string[];
}

export const PLAN_TIERS: PlanTier[] = [
  {
    tier: 1,
    name: "Daily Network",
    roles: "Spouses, children, close relatives",
    control: "Single-factor biometric prompt on launch",
    grants: ["Shared calendars", "Family media wall", "Messaging", "Announcements"],
  },
  {
    tier: 2,
    name: "Contingent Beneficiary",
    roles: "Adult children, named heirs",
    control: "Biometric auth + secondary verification (PIN / SMS)",
    grants: ["Basic estate outlines", "Care directives", "Non-sensitive lockbox documents"],
  },
  {
    tier: 3,
    name: "Executive & Legal",
    roles: "Named executors, trustees, estate attorneys",
    control: "Mandatory biometric auth + multi-party verification",
    grants: ["Trusts and wills", "Financial credentials", "Account lockboxes", "Administrative tools"],
  },
];

export const PLAN_CHANNELS = [
  {
    name: "Funeral Home Partner Network",
    role: "Primary marketers",
    detail:
      "Co-branded and white-labelled onboarding given to families during pre-need and aftercare counselling.",
    kpi: "40% of B2B enterprise acquisition volume",
  },
  {
    name: "B2B2C Financial & Legal",
    role: "Enterprise",
    detail:
      "White-labelled platforms offered through wealth advisors, family offices, estate planning attorneys and insurance providers.",
    kpi: "35% of total platform user acquisition",
  },
  {
    name: "Direct-to-Consumer",
    role: "D2C",
    detail:
      "App store optimisation, content marketing on family organisation and legacy planning, and viral family invite loops.",
    kpi: "Customer acquisition cost under $85",
  },
  {
    name: "E-Commerce Marketplace",
    role: "Monetisation",
    detail:
      "In-app marketplace fees for service partners, legal document templates, memorial goods, diagnostic health testing and gifting.",
    kpi: "ARPU expansion",
  },
];

export const PLAN_STAGES = [
  {
    stage: "Stage 1",
    months: "Months 0–6",
    title: "Initial rollout & user acquisition",
    detail:
      "Services offered free to reach the rollout goal of 50,000 members. Baseline usage analytics, regional focus groups, platform performance.",
    target: "50,000 members",
  },
  {
    stage: "Stage 2",
    months: "Months 6–10",
    title: "Expansion & monetisation transition",
    detail:
      "Expand feature adoption and move free members into structured subscription tiers. Scale B2B integrations and funeral home distribution.",
    target: "Subscription conversion",
  },
  {
    stage: "Stage 3",
    months: "Months 10–13",
    title: "Full market integration",
    detail:
      "Full feature rollout, marketplace monetisation, diagnostic health testing integration and extended legacy services across all demographics.",
    target: "CAC & retention optimisation",
  },
];

export const PLAN_PIPELINE = [
  {
    title: "AI Executor Assistant",
    detail:
      "A conversational agent that walks named executors through probate, asset distribution and administrative tasks for their local jurisdiction.",
  },
  {
    title: "Blood & DNA Disease Detection",
    detail:
      "Blood and DNA testing protocols for early chronic disease detection, with diagnostic partners in the storefront.",
  },
  {
    title: "Crypto & Web3 Inheritance",
    detail:
      "Smart-contract, non-custodial asset succession for digital assets, NFTs and decentralised accounts.",
  },
  {
    title: "Kinship Caregiver Nexus",
    detail:
      "A collaborative suite for elder care, medical directives, real-time healthcare communication and daily living support.",
  },
  {
    title: "Legacy Memorial & Family Tree",
    detail:
      "An expanded memorial space with family history archiving, genealogy tools and custom printed heirloom products.",
  },
];

/* --- App surface content ------------------------------------------------- */

export const PLAN_FEED = [
  { who: "Ruth", what: "added 12 photos to “Thanksgiving 1998”", when: "2h ago", kind: "media" },
  { who: "Daniel", what: "posted an announcement: “Dad’s surgery went fine”", when: "Yesterday", kind: "post" },
  { who: "Alicia", what: "recorded a story: “How Grandad met Grandma”", when: "3 days ago", kind: "audio" },
  { who: "Ruth", what: "shared a recipe: “Sunday gravy”", when: "6 days ago", kind: "media" },
];

export const PLAN_BILLS = [
  { name: "Home insurance", amount: "$184.00", due: "Due in 3 days", who: "Shared — Alicia & Daniel", state: "due" },
  { name: "Mom's phone", amount: "$62.40", due: "Due in 9 days", who: "Alicia", state: "ok" },
  { name: "Lawn service", amount: "$110.00", due: "Paid 2 Sept", who: "Daniel", state: "paid" },
  { name: "Medicare supplement", amount: "$247.10", due: "Due in 16 days", who: "Ruth", state: "ok" },
];

export const PLAN_EVENTS = [
  { title: "Dr. Okafor — cardiology", when: "Tue 10:40", tag: "Medical" },
  { title: "Ruth & Harold — 47th anniversary", when: "Thu", tag: "Family" },
  { title: "Estate attorney call", when: "Fri 14:00", tag: "Legal" },
];

export const PLAN_VAULT = [
  { name: "Chase — joint checking", kind: "Credential", tier: 3 },
  { name: "Deed — 114 Ridgeway", kind: "Document", tier: 3 },
  { name: "Ruth — cardiology records", kind: "Medical", tier: 2 },
  { name: "Life insurance policy", kind: "Document", tier: 3 },
  { name: "Passwords — 34 items", kind: "Credential", tier: 3 },
];

export const PLAN_STORE = [
  { name: "Estate planning template pack", price: "$49", tag: "Documents" },
  { name: "Sympathy flowers — same day", price: "from $65", tag: "Gifting" },
  { name: "Pre-need funeral plan", price: "Quote", tag: "Pre-need" },
  { name: "At-home health screening kit", price: "$129", tag: "Diagnostics" },
  { name: "Care package — recovery", price: "$85", tag: "Gifting" },
  { name: "Family plan — 6 members", price: "$14/mo", tag: "Subscription" },
];
