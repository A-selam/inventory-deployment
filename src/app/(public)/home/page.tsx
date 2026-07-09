import LandingHero from "@/components/public/landing/LandingHero";
import LandingSocialProof from "@/components/public/landing/LandingSocialProof";
// import LandingSelfHostedAdvantage from "@/components/public/landing/LandingSelfHostedAdvantage";
import LandingCoreFeatures from "@/components/public/landing/LandingCoreFeatures";
import LandingTechnicalExcellence from "@/components/public/landing/LandingTechnicalExcellence";
import LandingLicensing from "@/components/public/landing/LandingLicensing";
import LandingFAQ from "@/components/public/landing/LandingFAQ";
import HomeTestimonials from "@/components/public/home/HomeTestimonials";
import LandingFinalCTA from "@/components/public/landing/LandingFinalCTA";
import ScrollRevealSection from "@/components/public/shared/ScrollRevealSection";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <ScrollRevealSection>
        <LandingHero />
      </ScrollRevealSection>
      <ScrollRevealSection delay={50}>
        <LandingSocialProof />
      </ScrollRevealSection>
      {/* <LandingSelfHostedAdvantage /> */}
      <ScrollRevealSection delay={100}>
        <LandingCoreFeatures />
      </ScrollRevealSection>
      <ScrollRevealSection delay={150}>
        <LandingTechnicalExcellence />
      </ScrollRevealSection>
      <ScrollRevealSection delay={200}>
        <LandingLicensing />
      </ScrollRevealSection>
      <ScrollRevealSection delay={250}>
        <LandingFAQ />
      </ScrollRevealSection>
      <ScrollRevealSection delay={300}>
        <HomeTestimonials />
      </ScrollRevealSection>
      <ScrollRevealSection delay={350}>
        <LandingFinalCTA />
      </ScrollRevealSection>
    </div>
  );
}
