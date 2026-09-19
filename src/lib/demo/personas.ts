/* ---------------------------------------------------------------------------
   Onboarding presets.

   The whole point is that nobody typing on a demo should have to type. Every
   step offers a one-click preset, so a viewer can be inside a populated
   account in about fifteen seconds — while still having walked through the
   same screens a real user would.

   Four personas, chosen to cover the two products and both sides of the
   consumer inversion.
------------------------------------------------------------------------- */

export type PersonaId = "daughter" | "parent" | "veteran" | "spouse";

export interface Persona {
  id: PersonaId;
  /** What the viewer clicks. First person, because they are choosing a role. */
  label: string;
  sub: string;
  /** Preset account holder name. */
  name: string;
  /** Where this persona lands after onboarding. */
  destination: "/app" | "/mil/console";
  /** Which product this persona belongs to, for the summary screen. */
  product: "Next of Kin" | "NOKM";
  /** Preset circle, shown pre-filled at the circle step. */
  circle: { name: string; relationship: string; tier: 1 | 2 | 3 }[];
  /** Records the persona says they already have, pre-ticked. */
  has: string[];
  /** The one line that explains why this persona is the right starting point. */
  rationale: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "daughter",
    label: "I'm the adult child",
    sub: "My parents have the information. I have the worry.",
    name: "Alicia Ellison-Ward",
    destination: "/app",
    product: "Next of Kin",
    circle: [
      { name: "Ruth Vance", relationship: "Mother", tier: 1 },
      { name: "Harold Vance", relationship: "Father", tier: 1 },
      { name: "Daniel Vance", relationship: "Brother", tier: 2 },
      { name: "Marion Keel", relationship: "Executor", tier: 3 },
    ],
    has: ["Healthcare directive", "Life insurance policy", "Funeral wishes"],
    rationale:
      "The recommended build. You start the record and invite your parents up into it.",
  },
  {
    id: "parent",
    label: "I'm the parent",
    sub: "I have the documents. I'd like them found when it matters.",
    name: "Ruth Vance",
    destination: "/app",
    product: "Next of Kin",
    circle: [
      { name: "Alicia Ellison-Ward", relationship: "Daughter", tier: 2 },
      { name: "Daniel Vance", relationship: "Son", tier: 2 },
      { name: "Harold Vance", relationship: "Husband", tier: 1 },
      { name: "Marion Keel", relationship: "Executor", tier: 3 },
    ],
    has: [
      "Will",
      "Healthcare directive",
      "Life insurance policy",
      "Property deed and mortgage",
      "Funeral wishes",
    ],
    rationale:
      "The traditional shape. Notice how much more you have to fill in alone.",
  },
  {
    id: "veteran",
    label: "I'm a veteran",
    sub: "I served. My family will need to prove it.",
    name: "Marcus Ellison",
    destination: "/mil/console",
    product: "NOKM",
    circle: [
      { name: "Denise Ellison", relationship: "Spouse", tier: 1 },
      { name: "Jordan Ellison", relationship: "Son", tier: 2 },
      { name: "Raymond Teague", relationship: "Executor", tier: 3 },
    ],
    has: ["Record of emergency data", "VA disability rating decision letter", "Will"],
    rationale: "Survivor readiness. The one document everything else runs through.",
  },
  {
    id: "spouse",
    label: "I'm a military spouse",
    sub: "I'd rather know now than find out then.",
    name: "Denise Ellison",
    destination: "/mil/console",
    product: "NOKM",
    circle: [
      { name: "Marcus Ellison", relationship: "Spouse (SFC, Ret.)", tier: 1 },
      { name: "Jordan Ellison", relationship: "Son", tier: 2 },
      { name: "Alicia Ellison-Ward", relationship: "Daughter", tier: 2 },
    ],
    has: ["Record of emergency data", "Will", "Funeral and burial wishes"],
    rationale:
      "The same readiness picture, from the side that will actually have to use it.",
  },
];

export function getPersona(id: PersonaId | null | undefined): Persona | null {
  return PERSONAS.find((p) => p.id === id) ?? null;
}

/** Records offered at the "what do you already have" step. */
export const RECORD_CHOICES = [
  "Will",
  "Healthcare directive",
  "Durable power of attorney",
  "Life insurance policy",
  "Property deed and mortgage",
  "Account register",
  "Funeral wishes",
  "Record of emergency data",
  "VA disability rating decision letter",
  "Discharge certificate",
] as const;
