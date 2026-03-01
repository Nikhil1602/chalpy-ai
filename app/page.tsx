import { Navbar, HeroSection, ProblemSection, SolutionSection, FeaturesSection } from "@/components/landing";
import { ModelSecuritySection, CustomizationSection, HowItWorksSection, UseCasesSection } from "@/components/landing";
import { FinalCTASection, Footer } from "@/components/landing";

export default function Home() {

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <ModelSecuritySection />
      <CustomizationSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FinalCTASection />
      <Footer />
    </div>
  );

}
