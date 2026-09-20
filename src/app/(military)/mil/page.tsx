import { ScrollProgress } from "@/components/motion/primitives";
import { MilFooter, MilNav } from "@/components/marketing/mil-chrome";
import { VersionBar } from "@/components/marketing/version-bar";
import { WhatTheAiDoes } from "@/components/marketing/ai-section";
import { MilHero } from "@/components/marketing/mil-hero";
import { AtScale, MilCta, SecurityModel, TheGap, TheSystem } from "@/components/marketing/mil-sections";

export default function MilitaryLanding() {
  return (
    <>
      <ScrollProgress />
      <VersionBar current="/mil" />
      <MilNav />
      <main>
        <MilHero />
        <TheGap />
        <TheSystem />
        <WhatTheAiDoes ctaHref="/mil/console/conflicts" />
        <AtScale />
        <SecurityModel />
        <MilCta />
      </main>
      <MilFooter />
    </>
  );
}
