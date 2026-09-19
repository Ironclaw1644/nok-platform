import type { Metadata } from "next";
import { ConsoleShell, ScreenIntro } from "@/components/product/console-shell";
import { DemoSetupPrompt } from "@/components/product/demo-session";
import { ReadinessInstrument } from "@/components/product/readiness-instrument";
import { RecordTable } from "@/components/product/record-table";
import { DEMO_MILITARY_RECORDS } from "@/lib/domain/demo";

export const metadata: Metadata = { title: "Readiness" };

export default function ConsolePage() {
  return (
    <ConsoleShell>
      <DemoSetupPrompt />
      <ScreenIntro
        title="How ready is this family?"
        line="One score, and the records behind it. A missing document that everything else depends on caps the score — however much else is filed."
      />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="min-w-0">
          <RecordTable records={DEMO_MILITARY_RECORDS} />
        </div>
        <div className="min-w-0">
          <ReadinessInstrument records={DEMO_MILITARY_RECORDS} />
        </div>
      </div>
    </ConsoleShell>
  );
}
