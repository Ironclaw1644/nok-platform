import type { Metadata } from "next";
import { ConsoleShell } from "@/components/product/console-shell";
import { MembersPanel } from "@/components/product/members-panel";
import { ReadinessInstrument } from "@/components/product/readiness-instrument";
import { RecordTable } from "@/components/product/record-table";
import { ReleasePanel } from "@/components/product/release-panel";
import { DEMO_MEMBERS, DEMO_MILITARY_RECORDS } from "@/lib/domain/demo";

export const metadata: Metadata = { title: "Readiness console" };

export default function ConsolePage() {
  return (
    <ConsoleShell>
      {/* min-w-0 on grid children: grid items default to min-width:auto, so a
          long record row otherwise forces the column wider than the viewport
          and the whole page scrolls sideways on a phone. */}
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-start">
        <div className="min-w-0 space-y-5">
          <RecordTable records={DEMO_MILITARY_RECORDS} />
        </div>
        <div className="min-w-0 space-y-5">
          <ReadinessInstrument records={DEMO_MILITARY_RECORDS} />
          <ReleasePanel members={DEMO_MEMBERS} />
          <MembersPanel members={DEMO_MEMBERS} />
        </div>
      </div>
    </ConsoleShell>
  );
}
