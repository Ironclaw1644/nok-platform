import { ScrollProgress } from "@/components/motion/primitives";
import {
  PlanAccess,
  PlanChannels,
  PlanCta,
  PlanFooter,
  PlanHero,
  PlanModules,
  PlanNav,
  PlanPipeline,
  PlanRollout,
} from "@/components/marketing/plan-surface";
import { VersionBar } from "@/components/marketing/version-bar";

export default function PlanLanding() {
  return (
    <>
      <ScrollProgress />
      <VersionBar current="/plan" />
      <PlanNav />
      <main>
        <PlanHero />
        <PlanModules />
        <PlanAccess />
        <PlanChannels />
        <PlanRollout />
        <PlanPipeline />
        <PlanCta />
      </main>
      <PlanFooter />
    </>
  );
}
