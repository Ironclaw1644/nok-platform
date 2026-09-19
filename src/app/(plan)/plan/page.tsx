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

export default function PlanLanding() {
  return (
    <>
      <ScrollProgress />
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
