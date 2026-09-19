import type Anthropic from "@anthropic-ai/sdk";
import { EFFORT, MODEL, getClient, refusalOf } from "./client";
import { record } from "./budget";

/* ---------------------------------------------------------------------------
   Document intake. docs/ai.md §1.

   Two passes, and the reason is a real API constraint rather than a design
   preference:

     Citations (`citations: {enabled: true}` on a document block) are
     INCOMPATIBLE with structured outputs — sending both returns a 400.

   So:
     Pass 1  extract  — strict tool schema, guarantees well-formed fields.
     Pass 2  cite     — only when the user asks "where did you read that",
                        returns the exact source text and page number.

   That split turns out to be better UX anyway: most intakes never need pass 2,
   so most intakes cost one call, and "show me where" becomes a deliberate act
   rather than noise on every field.
------------------------------------------------------------------------- */

export interface ExtractedField {
  label: string;
  value: string;
  /** The model's own confidence. Low-confidence fields are surfaced, never
   *  silently guessed — the whole product rests on not inventing facts. */
  confidence: "high" | "medium" | "low";
}

export interface IntakeResult {
  documentType: string;
  /** Registry key from lib/domain/forms.ts when the model recognises a known
   *  form. Never trusted blind — the caller validates it against FORMS. */
  formKey: string | null;
  fields: ExtractedField[];
  /** Days until re-verification, or null when the document does not go stale. */
  reviewDays: number | null;
  /** Anything a human should look at. Empty is a valid answer. */
  flags: string[];
  usageUsd: number;
}

const EXTRACT_TOOL: Anthropic.Tool = {
  name: "file_document",
  description:
    "Record what this document is and the fields extracted from it. Call this exactly once.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["documentType", "formKey", "fields", "reviewDays", "flags"],
    properties: {
      documentType: {
        type: "string",
        description: "The document's own official title, as printed on it where possible.",
      },
      formKey: {
        type: ["string", "null"],
        description:
          "One of: dd214, dd93, dd1300, sglv8286, dd2656, dd26567, sf180, va21p534ez, va21p530ez, va401330, va4010007, va272008, va400247, va2122. Null if this is not one of those forms.",
      },
      fields: {
        type: "array",
        description: "Only fields actually present. Do not infer values that are not written.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "value", "confidence"],
          properties: {
            label: { type: "string" },
            value: { type: "string" },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
          },
        },
      },
      reviewDays: {
        type: ["integer", "null"],
        description:
          "How often this document should be re-verified, in days. Null for documents that never go stale, such as a discharge certificate.",
      },
      flags: {
        type: "array",
        items: { type: "string" },
        description:
          "Anything a person should look at: unreadable fields, an old execution date, a designation that looks out of step with the rest of the record.",
      },
    },
  },
};

const SYSTEM = `You are filing a document into a family's records.

Rules, in order of importance:

1. Never invent a value. If a field is present but unreadable, record it with
   confidence "low" and say so in flags. An honest gap is useful; a confident
   guess is the thing that gets a family sent to the wrong office.
2. Extract only what the document actually says. Do not infer, complete, or
   normalise beyond obvious formatting.
3. Do not give advice. You are not interpreting the document, assessing
   eligibility, or suggesting what anyone should do about it.
4. If you do not recognise the document, say what it appears to be and set
   formKey to null. A wrong form number is worse than no form number.

Call the file_document tool exactly once with your result.`;

export async function extractDocument(opts: {
  /** base64, no newlines */
  data: string;
  mediaType: "application/pdf" | "image/jpeg" | "image/png" | "image/webp";
  hint?: string;
}): Promise<IntakeResult | { error: string }> {
  const client = getClient();
  if (!client) return { error: "not_configured" };

  const docBlock: Anthropic.ContentBlockParam =
    opts.mediaType === "application/pdf"
      ? {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: opts.data },
        }
      : {
          type: "image",
          source: { type: "base64", media_type: opts.mediaType, data: opts.data },
        };

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM,
      thinking: { type: "adaptive" },
      output_config: { effort: EFFORT.intake },
      tools: [EXTRACT_TOOL],
      // `auto` rather than forced: forced tool choice is rejected on some
      // newer models, and a single tool plus an explicit instruction gets the
      // call reliably without coupling us to one model's quirks.
      tool_choice: { type: "auto" },
      messages: [
        {
          role: "user",
          content: [
            docBlock,
            {
              type: "text",
              text: opts.hint
                ? `File this document. Context from the user: ${opts.hint}`
                : "File this document.",
            },
          ],
        },
      ],
    });

    const refused = refusalOf(msg);
    if (refused) return { error: `refused:${refused}` };

    const call = msg.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "file_document",
    );
    if (!call) return { error: "no_extraction" };

    // Always parse; never string-match a serialized tool input.
    const out = call.input as Omit<IntakeResult, "usageUsd">;
    return { ...out, usageUsd: record(msg.usage) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}

export interface Citation {
  quotedText: string;
  /** 1-indexed for PDFs. Null for images, which have no pages. */
  page: number | null;
}

/**
 * Pass 2 — "where did you read that?"
 *
 * Citations cannot run in the same call as structured outputs (400), so this
 * is a separate request with no tools. It returns the model's answer plus the
 * exact source text it is quoting, which is the single most convincing thing
 * this product can show: not "the beneficiary is Denise Ellison" but "page 3
 * says so, here is the line".
 */
export async function citeField(opts: {
  data: string;
  mediaType: "application/pdf" | "image/jpeg" | "image/png" | "image/webp";
  question: string;
}): Promise<{ answer: string; citations: Citation[]; usageUsd: number } | { error: string }> {
  const client = getClient();
  if (!client) return { error: "not_configured" };

  if (opts.mediaType !== "application/pdf") {
    return { error: "citations_require_pdf" };
  }

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      output_config: { effort: "low" },
      system:
        "Answer only from the document. Quote the source. If the document does not say, say that it does not say.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: opts.data },
              citations: { enabled: true },
            },
            { type: "text", text: opts.question },
          ],
        },
      ],
    });

    const refused = refusalOf(msg);
    if (refused) return { error: `refused:${refused}` };

    const answer: string[] = [];
    const citations: Citation[] = [];

    for (const block of msg.content) {
      if (block.type !== "text") continue;
      answer.push(block.text);
      for (const c of block.citations ?? []) {
        if (c.type === "page_location") {
          citations.push({ quotedText: c.cited_text, page: c.start_page_number });
        } else if (c.type === "char_location") {
          citations.push({ quotedText: c.cited_text, page: null });
        }
      }
    }

    return { answer: answer.join(""), citations, usageUsd: record(msg.usage) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}
