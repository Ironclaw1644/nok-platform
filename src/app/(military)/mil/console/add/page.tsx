import type { Metadata } from "next";
import { AiIntake } from "@/components/product/ai-intake";
import { ConsoleShell, ScreenIntro } from "@/components/product/console-shell";

export const metadata: Metadata = { title: "Add a document" };

export default function AddPage() {
  return (
    <ConsoleShell>
      <ScreenIntro
        title="Put a document in."
        line="Photograph it or drop the file. It gets identified, the fields read out, filed, and put on a re-check schedule — nobody types anything."
      />
      <div className="mx-auto max-w-2xl">
        <AiIntake />
      </div>
    </ConsoleShell>
  );
}
