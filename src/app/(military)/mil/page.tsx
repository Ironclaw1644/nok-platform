import { ScrollProgress } from "@/components/motion/primitives";
import { MilFooter, MilNav } from "@/components/marketing/mil-chrome";
import { MilHero } from "@/components/marketing/mil-hero";
import { AtScale, MilCta, SecurityModel, TheGap, TheSystem } from "@/components/marketing/mil-sections";

export default function MilitaryLanding() {
  return (
    <>
      <ScrollProgress />
      <MilNav />
      <main>
        <MilHero />
        <TheGap />
        <TheSystem />
        <AtScale />
        <SecurityModel />
        <MilCta />
      </main>
      <MilFooter />
    </>
  );
}
