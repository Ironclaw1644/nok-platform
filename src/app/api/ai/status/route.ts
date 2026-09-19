import { NextResponse } from "next/server";
import { budgetState, sweep } from "@/lib/ai/budget";
import { MODEL, isConfigured } from "@/lib/ai/client";

/**
 * Lets the UI decide whether to offer the live path or the scripted one,
 * without ever exposing whether a key exists to anyone who cannot already
 * tell by using the feature.
 */
export const runtime = "nodejs";

export async function GET() {
  sweep();
  const { remainingUsd } = budgetState();
  return NextResponse.json({
    live: isConfigured() && remainingUsd > 0,
    model: isConfigured() ? MODEL : null,
  });
}
