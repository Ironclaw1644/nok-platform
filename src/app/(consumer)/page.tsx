import { ScrollProgress } from "@/components/motion/primitives";
import { NokFooter, NokNav } from "@/components/marketing/nok-chrome";
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
      <NokNav />
      <main>
        <NokHero />
        <WhyInverted />
        <HowItWorks />
        <WhatsInside />
        <TheDay />
        <WhatWeDont />
        <NokCta />
      </main>
      <NokFooter />
    </>
  );
}
