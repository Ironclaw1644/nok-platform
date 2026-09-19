import { NextResponse } from "next/server";
import { checkAllowed } from "@/lib/ai/budget";
import { isConfigured } from "@/lib/ai/client";
import { scanForConflicts } from "@/lib/ai/conflicts";
import { DEMO_CONSUMER_RECORDS, DEMO_FAMILY, DEMO_MEMBERS, DEMO_MILITARY_RECORDS } from "@/lib/domain/demo";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Conflict scan.
 *
 * Takes a dataset NAME, not a payload. The demo's records are server-side
 * constants, so there is nothing for a caller to inject and no way to turn
 * this endpoint into a general-purpose model proxy on someone else's key.
 */
export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ live: false, reason: "not_configured" }, { status: 200 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const gate = checkAllowed(ip);
  if (!gate.ok) {
    return NextResponse.json({ live: false, reason: gate.reason }, { status: gate.status });
  }

  let dataset: unknown;
  try {
    ({ dataset } = await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const pick =
    dataset === "military"
      ? { records: DEMO_MILITARY_RECORDS, members: DEMO_MEMBERS }
      : dataset === "family"
        ? { records: DEMO_CONSUMER_RECORDS, members: DEMO_FAMILY }
        : null;

  if (!pick) return NextResponse.json({ error: "unknown_dataset" }, { status: 400 });

  const result = await scanForConflicts(pick.records, pick.members);
  if ("error" in result) {
    return NextResponse.json({ live: false, reason: result.error }, { status: 200 });
  }

  return NextResponse.json({ live: true, findings: result.findings });
}
