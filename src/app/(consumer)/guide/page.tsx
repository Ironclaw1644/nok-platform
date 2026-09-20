import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/primitives";
import { NokFooter, NokMark } from "@/components/marketing/nok-chrome";
import { ButtonLink, Eyebrow } from "@/components/ui/kit";

/* ---------------------------------------------------------------------------
   The entry page. This is the URL to send someone.

   Everything else on this site was built to be walked through by someone who
   already knows what it is. Sent as a bare link it fails differently: you land
   on a consumer marketing page with no way of knowing there are three versions,
   which one is which, or that anything is clickable at all.

   So this page does three things and nothing else: says what this is, says what
   to press, and says what is real. Written for someone reading it alone on a
   phone with nobody to ask.
------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Start here",
  description:
    "Three working versions of the Next of Kin app, and what to look at in each one.",
};

const VERSIONS = [
  {
    n: "1",
    name: "As you specified it",
    href: "/plan",
    demo: { href: "/plan/app", label: "Open the app" },
    what:
      "The V9 business plan built literally — all five modules on one screen, the three access tiers, the funeral-home and advisor channels, the rollout.",
    look:
      "Click through the five tabs. This is what the plan looks like when nothing is left out.",
  },
  {
    n: "2",
    name: "For families",
    href: "/",
    demo: { href: "/app", label: "Open the app" },
    what:
      "The same vault with one thing changed: the adult child opens it and invites the parent, rather than the other way round.",
    look:
      "Open the record and look at the blanks. The gaps are the product — they are the things worth asking a parent about while you still can.",
  },
  {
    n: "3",
    name: "For service families",
    href: "/mil",
    demo: { href: "/mil/console", label: "Open the console" },
    what:
      "NOKM. The same idea aimed at veterans and their survivors, built around the discharge certificate that every honor and benefit runs through.",
    look:
      "Watch the readiness number climb and then drop. One missing document caps the whole score, and that drop is the entire argument.",
  },
] as const;

interface TourStep {
  step: string;
  time: string;
  title: string;
  href: string;
  cta: string;
  body: string;
  /** The one step worth queuing up first. Gets the solid button. */
  emphasis?: boolean;
}

const TOUR: TourStep[] = [
  {
    step: "1",
    time: "1 min",
    title: "Set up an account",
    href: "/start",
    cta: "Open setup",
    body:
      "Four steps, and every one has a preset you can click — you never have to type anything. Pick any of the four people at the start; they each see a different version of the app.",
  },
  {
    step: "2",
    time: "1 min",
    title: "Look at a family record",
    href: "/app",
    cta: "Open the record",
    body:
      "What exists, what is missing, and who can see it. Click any row to open it. Nothing here is a real person or a real document.",
  },
  {
    step: "3",
    time: "40 sec",
    title: "Run the conflict scan",
    href: "/mil/console/conflicts",
    cta: "Open the scan",
    body:
      "Press “Scan the record” and give it about forty seconds. It is genuinely reading all fourteen documents and writing what it finds — it is not a canned animation, which is why it takes that long.",
    emphasis: true,
  },
];

export default function GuidePage() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-4xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/guide">
            <NokMark />
          </Link>
          <span className="label-micro">Start here</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* --- What this is ------------------------------------------------ */}
        <section className="py-16 sm:py-24">
          <Reveal>
            <Eyebrow>Next of Kin · working mockup</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.1rem)] leading-[1.04] text-balance">
              Three versions of the app, side by side.
            </h1>
          </Reveal>
          <div className="mt-7 max-w-2xl space-y-4 text-[16.5px] leading-relaxed text-muted text-pretty">
            <Reveal delay={0.12}>
              <p>
                This is a mockup built to show what the Next of Kin app could look like —
                not a product you can sign up for. Everything on it is clickable and
                everything responds, but there is no account, no server, and no real
                document anywhere in it.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p>
                There are three versions because there were three good ways to build it.
                All three are here to click through.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.22}>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/start" size="lg">
                Start the tour
              </ButtonLink>
              <ButtonLink href="#versions" variant="secondary" size="lg">
                Jump to the three versions
              </ButtonLink>
            </div>
          </Reveal>
        </section>

        {/* --- What to press ----------------------------------------------- */}
        <section className="border-t border-line py-16 sm:py-20">
          <Reveal>
            <Eyebrow>If you only have five minutes</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-[1.1] text-balance">
              Press these three things, in this order.
            </h2>
          </Reveal>

          <ol className="mt-10 space-y-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
            {/* Reveal renders a div, so it has to go INSIDE the li — wrapping
                the li broke ol > li and axe caught it as a list violation. */}
            {TOUR.map((t, i) => (
              <li key={t.step} className="bg-surface p-6 sm:p-7">
                <Reveal delay={0.1 + i * 0.06}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[12px] text-accent">
                      {t.step}
                    </span>
                    <h3 className="font-display text-[19px] leading-none text-ink">
                      {t.title}
                    </h3>
                    <span className="label-micro tnum ml-auto">{t.time}</span>
                  </div>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
                    {t.body}
                  </p>
                  <ButtonLink
                    href={t.href}
                    size="sm"
                    variant={t.emphasis ? "primary" : "secondary"}
                    className="mt-5"
                  >
                    {t.cta}
                  </ButtonLink>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-[13.5px] leading-relaxed text-faint">
              Step three is the one worth waiting for. Everywhere else on this site the
              speed is a design choice; there, the wait is a real model reading real
              contradictions between fourteen documents and writing them up.
            </p>
          </Reveal>
        </section>

        {/* --- The three versions ------------------------------------------ */}
        <section id="versions" className="scroll-mt-20 border-t border-line py-16 sm:py-20">
          <Reveal>
            <Eyebrow>The three versions</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-[1.1] text-balance">
              Same idea, three different bets.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
            {VERSIONS.map((v, i) => (
              <Reveal key={v.n} delay={0.1 + i * 0.07}>
                <article className="bg-surface p-6 sm:p-7">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[12px] text-faint">{v.n}</span>
                    <h3 className="font-display text-[21px] leading-none text-ink">
                      {v.name}
                    </h3>
                  </div>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
                    {v.what}
                  </p>
                  <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-accent text-pretty">
                    {v.look}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <ButtonLink href={v.demo.href} size="sm">
                      {v.demo.label}
                    </ButtonLink>
                    <ButtonLink href={v.href} size="sm" variant="secondary">
                      See the pitch page
                    </ButtonLink>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* --- What is real ------------------------------------------------ */}
        <section className="border-t border-line py-16 sm:py-20">
          <Reveal>
            <Eyebrow>Before anyone asks</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.2rem)] leading-[1.1] text-balance">
              What is real here, and what is drawn.
            </h2>
          </Reveal>

          <div className="mt-9 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
            <div className="bg-surface p-6">
              <div className="label-micro text-accent">Genuinely working</div>
              <ul className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-ink">
                <li>
                  The conflict scan. A real model reads the record and writes its own
                  findings — nothing on that screen was written in advance.
                </li>
                <li>
                  Document intake. Upload a PDF and it will pull the fields out, then show
                  you the page it read them from.
                </li>
                <li>
                  Every form number quoted anywhere on this site, each checked against the
                  agency that issues it.
                </li>
                <li>
                  Your progress. Set up as one of the four people, reload, and you are
                  still them — it is remembered in your own browser and nowhere else.
                </li>
              </ul>
            </div>
            <div className="bg-surface p-6">
              <div className="label-micro">Not built yet</div>
              <ul className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-muted">
                <li>Real accounts and real sign-in. The passkey step is a simulation.</li>
                <li>
                  Encryption. It is specified properly, down to what it deliberately cannot
                  protect against, but none of it is implemented.
                </li>
                <li>
                  Storage. Nothing you upload is kept — it is held for one request and
                  then gone.
                </li>
                <li>
                  The people. Every name, document and date is invented for the
                  demonstration.
                </li>
              </ul>
            </div>
          </div>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-[13.5px] leading-relaxed text-faint">
              That split is deliberate. The parts that are hard to believe are the parts
              that are real; the parts that are expensive to build are the parts that are
              honestly labelled as not built.
            </p>
          </Reveal>
        </section>

        {/* --- Out ---------------------------------------------------------- */}
        <section className="border-t border-line py-16 sm:py-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] text-balance">
              Every page has a menu with all three versions in it.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
              And this page is always at <span className="text-ink">/guide</span> if you
              want to come back to the beginning.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/start" size="lg">
                Start the tour
              </ButtonLink>
              <ButtonLink href="/mil/console/conflicts" variant="secondary" size="lg">
                Skip to the conflict scan
              </ButtonLink>
            </div>
          </Reveal>
        </section>
      </main>

      <NokFooter />
    </>
  );
}
