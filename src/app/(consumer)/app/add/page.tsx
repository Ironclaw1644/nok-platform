import type { Metadata } from "next";
import { AiIntake } from "@/components/product/ai-intake";
import { ScreenIntro } from "@/components/product/console-shell";
import { FamilyShell } from "@/components/product/family-shell";

export const metadata: Metadata = { title: "Add a document" };

export default function FamilyAddPage() {
  return (
    <FamilyShell>
      <ScreenIntro
        title="Put a document in."
        line="Photograph it or drop the file. It gets identified, the important dates read out, and put on a schedule so it tells you when it has gone out of date."
      />
      <div className="mx-auto max-w-2xl">
        <AiIntake />
      </div>
    </FamilyShell>
  );
}
