import type { Metadata } from "next";
import Link from "next/link";
import { PlanMark } from "@/components/marketing/plan-surface";
import { PlanApp } from "@/components/product/plan-app";

export const metadata: Metadata = { title: "The Vance family" };

export default function PlanAppPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/plan">
            <PlanMark />
          </Link>
          <Link
            href="/plan"
            className="text-[13px] text-faint transition-colors hover:text-muted"
          >
            ← Back to overview
          </Link>
        </div>
      </header>
      <main>
        <PlanApp />
      </main>
    </>
  );
}
