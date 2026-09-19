"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useHydrated } from "@/components/motion/primitives";
import { AiIntake } from "@/components/product/ai-intake";
import { Badge, Button, Dot } from "@/components/ui/kit";
import { PERSONAS, RECORD_CHOICES, type Persona } from "@/lib/demo/personas";
import { useDemoState } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Account setup.

   Shows a viewer the real shape of onboarding — who you are, securing it,
   naming your circle, saying what you hold — without making them type a
   single character. Every step has a preset; the Continue button is always
   live because a demo that blocks on a form field is a demo nobody finishes.

   State persists to localStorage, so reloading lands them back in their
   account rather than at step one.
------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;
const STEPS = ["Who you are", "Secure it", "Your circle", "What you have"] as const;

export function Onboarding() {
  const router = useRouter();
  const { state, save, clear } = useDemoState();
  const prefersReduce = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = prefersReduce && hydrated;

  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [circle, setCircle] = useState<Persona["circle"]>([]);
  const [has, setHas] = useState<string[]>([]);
  const [scanned, setScanned] = useState<string[]>([]);

  // Simulated passkey enrolment. The pause is the point — it is the only
  // moment in onboarding that should feel like something is being secured.
  useEffect(() => {
    if (!enrolling) return;
    const t = window.setTimeout(() => {
      setEnrolling(false);
      setEnrolled(true);
    }, reduce ? 200 : 1500);
    return () => window.clearTimeout(t);
  }, [enrolling, reduce]);

  function choose(p: Persona) {
    setPersona(p);
    setCircle(p.circle);
    setHas(p.has);
    setStep(1);
  }

  function finish() {
    if (!persona) return;
    save({
      persona: persona.id,
      name: persona.name,
      enrolled,
      circle,
      has,
      scanned,
      completedAt: new Date().toISOString(),
    });
    router.push(persona.destination);
  }

  /* Returning visitor: offer their account back rather than making them redo it. */
  if (state && step === 0 && !persona) {
    return (
      <div className="surface-card mx-auto max-w-lg p-6 sm:p-8">
        <div className="label-micro">Welcome back</div>
        <h2 className="mt-4 font-display text-2xl leading-tight text-ink">
          Your account is set up, {state.name.split(" ")[0]}.
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
          {state.circle.length} people in your circle · {state.has.length + state.scanned.length}{" "}
          records on file.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            onClick={() =>
              router.push(
                PERSONAS.find((p) => p.id === state.persona)?.destination ?? "/app",
              )
            }
          >
            Open my record
          </Button>
          <Button variant="secondary" onClick={clear}>
            Start over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <ol className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] transition-colors duration-300",
                i < step
                  ? "bg-accent text-accent-ink"
                  : i === step
                    ? "border border-accent text-accent"
                    : "border border-line text-faint",
              )}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span
              className={cn(
                "text-[12.5px] transition-colors duration-300",
                i === step ? "text-ink" : "text-faint",
              )}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && <span aria-hidden className="mx-1 h-px w-4 bg-line" />}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        {/* ---- 1. Persona ---- */}
        {step === 0 && (
          <motion.div
            key="s0"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            <h1 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.06] text-ink">
              Who are you in this family?
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Pick one. Everything after this is pre-filled — you will not have to type.
            </p>

            <div className="mt-7 space-y-3">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => choose(p)}
                  className="group flex w-full items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 text-left transition-colors duration-200 hover:border-accent"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[15.5px] font-medium text-ink">{p.label}</span>
                      <Badge tone="neutral">{p.product}</Badge>
                    </div>
                    <p className="mt-1.5 text-[14px] text-muted">{p.sub}</p>
                    <p className="mt-2.5 text-[12.5px] text-accent">{p.rationale}</p>
                  </div>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ---- 2. Passkey ---- */}
        {step === 1 && (
          <motion.div
            key="s1"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            <h1 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.06] text-ink">
              Secure it with your face.
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              No password. A passkey is created on this device and the key stays in its
              secure hardware — we never receive it, and no biometric data is ever
              transmitted or stored.
            </p>

            <div className="mt-9 flex flex-col items-center gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-10">
              <button
                onClick={() => !enrolled && setEnrolling(true)}
                disabled={enrolling}
                aria-label={enrolled ? "Passkey created" : "Create passkey"}
                className={cn(
                  "relative flex h-24 w-24 items-center justify-center rounded-full border-2 transition-colors duration-500",
                  enrolled
                    ? "border-accent bg-accent-soft"
                    : "border-line-strong hover:border-accent",
                )}
              >
                {enrolling && !reduce && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border-2 border-accent"
                    style={{ animation: "pulse-ring 1.2s ease-out infinite" }}
                  />
                )}
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 8V6a2 2 0 0 1 2-2h2M20 8V6a2 2 0 0 0-2-2h-2M4 16v2a2 2 0 0 0 2 2h2M20 16v2a2 2 0 0 1-2 2h-2M9 10v1M15 10v1M9.5 15c.8.7 1.6 1 2.5 1s1.7-.3 2.5-1"
                    stroke={enrolled ? "var(--accent)" : "var(--faint)"}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <p className="text-[13.5px] text-muted">
                {enrolled
                  ? "Passkey created on this device"
                  : enrolling
                    ? "Waiting for Face ID…"
                    : "Tap to create your passkey"}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button onClick={() => setStep(2)}>
                {enrolled ? "Continue" : "Skip for now"}
              </Button>
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* ---- 3. Circle ---- */}
        {step === 2 && persona && (
          <motion.div
            key="s2"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            <h1 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.06] text-ink">
              Who else should see this?
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Invites go by text. Each person gets a tier, and tier 3 stays sealed until a
              release — two of them have to agree, and you get seven days to stop it.
            </p>

            <div className="mt-7 space-y-2">
              {persona.circle.map((m) => {
                const on = circle.some((c) => c.name === m.name);
                return (
                  <button
                    key={m.name}
                    onClick={() =>
                      setCircle((c) =>
                        on ? c.filter((x) => x.name !== m.name) : [...c, m],
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[var(--radius-field)] border px-4 py-3 text-left transition-colors duration-200",
                      on ? "border-accent bg-accent-soft/40" : "border-line hover:border-line-strong",
                    )}
                  >
                    <Dot tone={on ? "accent" : "neutral"} />
                    <span className="flex-1 text-[14px] text-ink">{m.name}</span>
                    <span className="text-[12.5px] text-muted">{m.relationship}</span>
                    <span className="label-micro shrink-0">T{m.tier}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button onClick={() => setStep(3)}>Continue with {circle.length}</Button>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* ---- 4. Records ---- */}
        {step === 3 && persona && (
          <motion.div
            key="s3"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            <h1 className="font-display text-[clamp(1.8rem,3.6vw,2.5rem)] leading-[1.06] text-ink">
              What do you already have?
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Tick what exists. The blanks are the point — they become the things to ask
              about.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {RECORD_CHOICES.map((r) => {
                const on = has.includes(r);
                return (
                  <button
                    key={r}
                    onClick={() => setHas((h) => (on ? h.filter((x) => x !== r) : [...h, r]))}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-200",
                      on
                        ? "border-accent bg-accent text-accent-ink"
                        : "border-line text-muted hover:border-line-strong hover:text-ink",
                    )}
                  >
                    {r}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <AiIntake
                compact
                onFiled={(title) => setScanned((s) => (s.includes(title) ? s : [...s, title]))}
              />
              {scanned.length > 0 && (
                <p className="mt-3 text-[13px] text-ok">
                  {scanned.length} document{scanned.length > 1 ? "s" : ""} filed from a photo.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button onClick={finish}>Open my record</Button>
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
