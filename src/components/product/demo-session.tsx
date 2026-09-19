"use client";

import Link from "next/link";
import { Badge, Button, Dot } from "@/components/ui/kit";
import { useDemoState } from "@/lib/demo/store";

/**
 * Shows whose account you are in, when someone has been through onboarding.
 *
 * Renders nothing before hydration or for a first-time visitor — the store's
 * server snapshot is null, so there is no markup to mismatch.
 */
export function DemoSession() {
  const { state, clear } = useDemoState();

  if (!state) {
    return (
      <Badge tone="warn">
        <Dot tone="warn" pulse />
        Demo data
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="accent">
        <Dot tone="accent" />
        {state.name}
      </Badge>
      {state.enrolled && <Badge tone="neutral">Passkey active</Badge>}
      <Button size="sm" variant="ghost" onClick={clear}>
        Reset
      </Button>
    </div>
  );
}

/** Invitation to run setup, for viewers who landed straight in an app. */
export function DemoSetupPrompt() {
  const { state } = useDemoState();
  if (state) return null;

  return (
    <div className="surface-card mb-5 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
      <p className="text-[13.5px] text-muted">
        This is a populated example. Want to see how an account gets set up?
      </p>
      <Link
        href="/start"
        className="shrink-0 text-[13.5px] text-accent underline-offset-4 hover:underline"
      >
        Set one up — takes 15 seconds →
      </Link>
    </div>
  );
}
