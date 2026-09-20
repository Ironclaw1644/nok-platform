import { ScrollProgress } from "@/components/motion/primitives";
import { NokFooter, NokNav } from "@/components/marketing/nok-chrome";
import { VersionBar } from "@/components/marketing/version-bar";
import { WhatTheAiDoes } from "@/components/marketing/ai-section";
import { NokHero } from "@/components/marketing/nok-hero";
import {
  HowItWorks,
  NokCta,
  TheDay,
  WhatWeDont,
  WhatsInside,
  WhyInverted,
} from "@/components/marketing/nok-sections";

export default function ConsumerLanding() {
  return (
    <>
      <ScrollProgress />
      <VersionBar current="/" />
      <NokNav />
      <main>
        <NokHero />
        <WhyInverted />
        <HowItWorks />
        <WhatsInside />
        <WhatTheAiDoes ctaHref="/app/conflicts" />
        <TheDay />
        <WhatWeDont />
        <NokCta />
      </main>
      <NokFooter />
    </>
  );
}
