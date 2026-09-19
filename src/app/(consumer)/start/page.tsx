import type { Metadata } from "next";
import Link from "next/link";
import { NokMark } from "@/components/marketing/nok-chrome";
import { Onboarding } from "@/components/product/onboarding";
import { Badge, Dot } from "@/components/ui/kit";

export const metadata: Metadata = { title: "Set up your record" };

export default function StartPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/">
            <NokMark />
          </Link>
          <Badge tone="warn">
            <Dot tone="warn" pulse />
            Concept demo
          </Badge>
        </div>
      </header>
      <main className="px-5 py-12 sm:px-8 sm:py-16">
        <Onboarding />
      </main>
    </>
  );
}
