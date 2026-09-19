import type { Metadata } from "next";
import { AskPanel } from "@/components/product/ask-panel";
import { ScreenIntro } from "@/components/product/console-shell";
import { FamilyShell } from "@/components/product/family-shell";
import { MembersPanel } from "@/components/product/members-panel";
import { DEMO_CONSUMER_RECORDS, DEMO_FAMILY } from "@/lib/domain/demo";

export const metadata: Metadata = { title: "Ask someone" };

export default function AskPage() {
  return (
    <FamilyShell>
      <ScreenIntro
        title="Turn a blank into a text message."
        line="Not a reminder to yourself. A specific question to a specific person about one specific thing — which is the only version of this that ever gets answered."
      />
      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0">
          <AskPanel records={DEMO_CONSUMER_RECORDS} members={DEMO_FAMILY} />
        </div>
        <div className="min-w-0">
          <MembersPanel members={DEMO_FAMILY} />
        </div>
      </div>
    </FamilyShell>
  );
}
