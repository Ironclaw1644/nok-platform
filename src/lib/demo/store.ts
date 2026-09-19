"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { PersonaId } from "./personas";

/* ---------------------------------------------------------------------------
   Demo persistence.

   localStorage, not a database. The reasoning is in docs/ai.md's sibling
   argument and worth restating here: a real backend for a demo means auth,
   which means a signup wall in front of the thing you want people to see, and
   it means holding other people's documents before any encryption exists.

   localStorage buys the property that actually matters to a viewer — "I did
   something and it stuck" — for none of that cost. Nothing leaves the browser.

   Read through useSyncExternalStore so the server snapshot is always `null`
   and hydration cannot mismatch. That bug has already cost us two rounds.
------------------------------------------------------------------------- */

const KEY = "nok.demo.v1";

export interface DemoState {
  persona: PersonaId;
  name: string;
  /** Simulated passkey enrolment completed. */
  enrolled: boolean;
  circle: { name: string; relationship: string; tier: 1 | 2 | 3 }[];
  /** Record titles the user said they already hold. */
  has: string[];
  /** Records added via the intake flow this session. */
  scanned: string[];
  completedAt: string;
}

const listeners = new Set<() => void>();
let cache: string | null = null;
let cacheRaw: string | null = null;

function read(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    // Safari private mode throws on localStorage access. A demo must not die
    // because of a browser setting — it just stops persisting.
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Cross-tab: if they open the console in a second tab, keep both honest.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

/** Raw snapshot must be referentially stable or useSyncExternalStore loops. */
function getSnapshot(): string | null {
  const raw = read();
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cache = raw;
  }
  return cache;
}

const getServerSnapshot = () => null;

export function useDemoState(): {
  state: DemoState | null;
  save: (s: DemoState) => void;
  clear: () => void;
} {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let state: DemoState | null = null;
  if (raw) {
    try {
      state = JSON.parse(raw) as DemoState;
    } catch {
      state = null;
    }
  }

  const save = useCallback((s: DemoState) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* private mode — session simply will not persist */
    }
    emit();
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    emit();
  }, []);

  return { state, save, clear };
}
