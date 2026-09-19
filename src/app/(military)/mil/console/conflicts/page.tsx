import type { Metadata } from "next";
import { ConflictScan } from "@/components/product/conflict-scan";
import { ConsoleShell, ScreenIntro } from "@/components/product/console-shell";
import { DEMO_MEMBERS, DEMO_MILITARY_RECORDS } from "@/lib/domain/demo";

export const metadata: Metadata = { title: "Conflicts" };

export default function ConflictsPage() {
  return (
    <ConsoleShell>
      <ScreenIntro
        title="What disagrees with what?"
        line="Nobody reads fourteen documents side by side. This does — and reports only where two of them contradict each other. It will not tell you which one is right."
      />
      <div className="mx-auto max-w-3xl">
        <ConflictScan
          dataset="military"
          records={DEMO_MILITARY_RECORDS}
          members={DEMO_MEMBERS}
        />
      </div>
    </ConsoleShell>
  );
}
