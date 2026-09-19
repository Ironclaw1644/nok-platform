import type { Metadata } from "next";
import { ConsoleShell, ScreenIntro } from "@/components/product/console-shell";
import { MembersPanel } from "@/components/product/members-panel";
import { ReleasePanel } from "@/components/product/release-panel";
import { DEMO_MEMBERS } from "@/lib/domain/demo";

export const metadata: Metadata = { title: "Release" };

export default function ReleasePage() {
  return (
    <ConsoleShell>
      <ScreenIntro
        title="Who can open this, and when?"
        line="Two named key-holders have to agree, then a seven-day window runs in which it can be called off. Try it — tick two people and request a release."
      />
      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0">
          <ReleasePanel members={DEMO_MEMBERS} />
        </div>
        <div className="min-w-0">
          <MembersPanel members={DEMO_MEMBERS} />
        </div>
      </div>
    </ConsoleShell>
  );
}
