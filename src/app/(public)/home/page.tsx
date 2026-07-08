import LandingHero from "@/components/public/landing/LandingHero";
import LandingSelfHostedAdvantage from "@/components/public/landing/LandingSelfHostedAdvantage";
import LandingCoreFeatures from "@/components/public/landing/LandingCoreFeatures";
import LandingTechnicalExcellence from "@/components/public/landing/LandingTechnicalExcellence";
import LandingSocialProof from "@/components/public/landing/LandingSocialProof";
import LandingFinalCTA from "@/components/public/landing/LandingFinalCTA";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <LandingHero />
      <LandingSelfHostedAdvantage />
      <LandingCoreFeatures />
      <LandingTechnicalExcellence />
      <LandingSocialProof />
      <LandingFinalCTA />
    </div>
  );
}
