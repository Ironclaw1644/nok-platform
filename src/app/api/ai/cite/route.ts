import { NextResponse } from "next/server";
import { checkAllowed } from "@/lib/ai/budget";
import { isConfigured } from "@/lib/ai/client";
import { citeField } from "@/lib/ai/intake";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * "Where did you read that?"
 *
 * A second pass, because citations and structured outputs cannot share a
 * request. Returns the model's answer plus the exact quoted source text and
 * page number — the most convincing thing this product can show.
 */
export async function POST(req: Request) {
  if (!isConfigured()) return NextResponse.json({ live: false, reason: "not_configured" });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const gate = checkAllowed(ip);
  if (!gate.ok) return NextResponse.json({ live: false, reason: gate.reason }, { status: gate.status });

  let file: File | null = null;
  let question = "";
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
    question = String(form.get("question") ?? "").slice(0, 300);
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "citations_require_pdf" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });
  if (!question) return NextResponse.json({ error: "no_question" }, { status: 400 });

  const data = Buffer.from(await file.arrayBuffer()).toString("base64");
  const result = await citeField({ data, mediaType: "application/pdf", question });

  if ("error" in result) return NextResponse.json({ live: false, reason: result.error });
  return NextResponse.json({ live: true, ...result });
}
