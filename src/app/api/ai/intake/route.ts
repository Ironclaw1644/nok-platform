import { NextResponse } from "next/server";
import { checkAllowed } from "@/lib/ai/budget";
import { isConfigured } from "@/lib/ai/client";
import { extractDocument } from "@/lib/ai/intake";
import { FORMS } from "@/lib/domain/forms";

export const runtime = "nodejs";
export const maxDuration = 120;

/* Accepting uploads from the public internet needs limits decided BEFORE the
   feature ships, not after someone posts a 400MB file. */
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ live: false, reason: "not_configured" });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const gate = checkAllowed(ip);
  if (!gate.ok) return NextResponse.json({ live: false, reason: gate.reason }, { status: gate.status });

  let file: File | null = null;
  let hint = "";
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
    hint = String(form.get("hint") ?? "").slice(0, 300);
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large", limitMb: 5 }, { status: 413 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "unsupported_type", type: file.type }, { status: 415 });
  }

  // Held in memory for the length of one request and never written anywhere.
  // This endpoint has no storage by design: a demo that quietly retains other
  // people's documents is a liability nobody asked for.
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");

  const result = await extractDocument({
    data,
    mediaType: file.type as "application/pdf" | "image/jpeg" | "image/png" | "image/webp",
    hint: hint || undefined,
  });

  if ("error" in result) {
    return NextResponse.json({ live: false, reason: result.error });
  }

  // The model proposes a form key; the register decides. An unrecognised or
  // unverified key is dropped rather than shown — same rule as everywhere else.
  const formKey = result.formKey && FORMS[result.formKey]?.verified ? result.formKey : null;

  return NextResponse.json({
    live: true,
    ...result,
    formKey,
    form: formKey ? { number: FORMS[formKey].number, title: FORMS[formKey].title } : null,
    canCite: file.type === "application/pdf",
  });
}
