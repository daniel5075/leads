import { useRef } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import ProofSection from "@/components/proof-section";
import TestimonialsSection from "@/components/testimonials-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection onGetPdfClick={scrollToForm} />
        <FeaturesSection />
        <ProofSection />
        <div ref={formRef}>
          <CTASection />
        </div>
        <TestimonialsSection />
        <CTASection showForm={false} />
      </main>
      
      <Footer />
    </div>
  );
}
