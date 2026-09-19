import type { Metadata } from "next";
import { ScreenIntro } from "@/components/product/console-shell";
import { DemoSetupPrompt } from "@/components/product/demo-session";
import { FamilyShell } from "@/components/product/family-shell";
import { ReadinessInstrument } from "@/components/product/readiness-instrument";
import { RecordTable } from "@/components/product/record-table";
import { DEMO_CONSUMER_RECORDS } from "@/lib/domain/demo";

export const metadata: Metadata = { title: "The record" };

export default function FamilyRecordPage() {
  return (
    <FamilyShell>
      <DemoSetupPrompt />
      <ScreenIntro
        title="What exists, and what doesn't."
        line="The blanks are the point — they are the things worth asking about. One missing item that everything else depends on holds the whole thing back."
      />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="min-w-0">
          <RecordTable records={DEMO_CONSUMER_RECORDS} />
        </div>
        <div className="min-w-0">
          <ReadinessInstrument
            records={DEMO_CONSUMER_RECORDS}
            label="How complete this is"
            register="family"
          />
        </div>
      </div>
    </FamilyShell>
  );
}
