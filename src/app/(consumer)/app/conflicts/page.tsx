import type { Metadata } from "next";
import { ConflictScan } from "@/components/product/conflict-scan";
import { ScreenIntro } from "@/components/product/console-shell";
import { FamilyShell } from "@/components/product/family-shell";
import { DEMO_CONSUMER_RECORDS, DEMO_FAMILY } from "@/lib/domain/demo";

export const metadata: Metadata = { title: "What disagrees" };

export default function FamilyConflictsPage() {
  return (
    <FamilyShell>
      <ScreenIntro
        title="Where two documents contradict each other."
        line="A policy pays whoever it names, whatever the will says. That kind of mismatch is invisible until the worst possible moment — unless something reads them side by side."
      />
      <div className="mx-auto max-w-3xl">
        <ConflictScan dataset="family" records={DEMO_CONSUMER_RECORDS} members={DEMO_FAMILY} />
      </div>
    </FamilyShell>
  );
}
