import type { Metadata } from "next";
import Link from "next/link";
import { NokMark } from "@/components/marketing/nok-chrome";
import { AskPanel } from "@/components/product/ask-panel";
import { MembersPanel } from "@/components/product/members-panel";
import { ReadinessInstrument } from "@/components/product/readiness-instrument";
import { RecordTable } from "@/components/product/record-table";
import { Badge, Dot } from "@/components/ui/kit";
import { DEMO_CONSUMER_RECORDS, DEMO_FAMILY } from "@/lib/domain/demo";

export const metadata: Metadata = { title: "The Vance family record" };

export default function FamilyRecordPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/">
            <NokMark />
          </Link>
          <Badge tone="warn">
            <Dot tone="warn" pulse />
            Demo data
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-9 max-w-2xl">
          <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.02] text-ink">
            The Vance family record
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Started by <span className="text-ink">Alicia</span> — the daughter, not the
            parents. Four people can see it. Two of them have added something in the last
            month.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="space-y-5">
            <RecordTable records={DEMO_CONSUMER_RECORDS} />
          </div>
          <div className="space-y-5">
            <ReadinessInstrument
              records={DEMO_CONSUMER_RECORDS}
              label="How complete this is"
              register="family"
            />
            <AskPanel records={DEMO_CONSUMER_RECORDS} members={DEMO_FAMILY} />
            <MembersPanel members={DEMO_FAMILY} />
          </div>
        </div>
      </div>
    </div>
  );
}
