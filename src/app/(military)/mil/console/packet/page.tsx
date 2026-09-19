import type { Metadata } from "next";
import { ConsoleShell } from "@/components/product/console-shell";
import { SurvivorPacket } from "@/components/product/survivor-packet";

export const metadata: Metadata = { title: "Survivor packet" };

export default function PacketPage() {
  return (
    <ConsoleShell>
      <div className="mx-auto max-w-3xl">
        <SurvivorPacket />
      </div>
    </ConsoleShell>
  );
}
