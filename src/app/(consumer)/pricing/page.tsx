import type { Metadata } from "next";
import { NokFooter, NokNav } from "@/components/marketing/nok-chrome";
import { Pricing } from "@/components/marketing/pricing";
import { ScrollProgress } from "@/components/motion/primitives";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Proposed pricing for Next of Kin and NOKM, anchored to published competitor rates.",
};

export default function PricingPage() {
  return (
    <>
      <ScrollProgress />
      <NokNav />
      <main>
        <Pricing />
      </main>
      <NokFooter />
    </>
  );
}
