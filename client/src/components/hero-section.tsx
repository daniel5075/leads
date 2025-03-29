import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progress-bar";

interface HeroSectionProps {
  onGetPdfClick: () => void;
}

export default function HeroSection({ onGetPdfClick }: HeroSectionProps) {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-primary/20 border border-primary/40">
              <span className="text-sm font-semibold tracking-wide text-primary">FREE PDF DOWNLOAD</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-display">
              Unlock <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Explosive Player Retention</span> with Milestone-Based Onboarding
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
              Learn the exact onboarding framework used by Duolingo, LinkedIn & Canva — now adapted for Web3 games and communities
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={onGetPdfClick}
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all flex items-center gap-2"
              >
                Get the Free PDF
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button 
                variant="outline" 
                size="lg"
                className="border-border hover:bg-card/90 text-foreground font-semibold transition-all flex items-center gap-2"
              >
                Learn More
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-card p-4 rounded-lg border border-border/50 max-w-md">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5,9c0.2,0,0.3,0,0.5,0c2.1-0.2,3.7-2,3.9-4.1c0.2-2.1-1.1-4.1-3.1-4.8C16.4-0.8,13.7,0.1,12,2
                    c-1.7-1.9-4.4-2.8-6.9-1.9c-1.9,0.7-3.3,2.7-3.1,4.8c0.2,2.1,1.9,3.9,3.9,4.1c0.2,0,0.3,0,0.5,0c-3.2,1.5-5.5,4.8-5.5,8.6
                    c0,0.6,0.4,1,1,1H22c0.6,0,1-0.4,1-1C23,13.8,20.7,10.5,17.5,9z" fill="currentColor" />
                  </svg>
                </div>
                <span className="font-display font-semibold">Your Onboarding Journey</span>
              </div>

              <ProgressBar 
                steps={["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"]} 
                currentStep={3} 
              />
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border/50 h-[480px]">
            <img 
              src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="Web3 gaming concept art" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="bg-card/80 backdrop-blur-md p-4 rounded-lg border border-border/50">
                <div className="flex items-center mb-2">
                  <img 
                    src="/attached_assets/481246401_10170896131120094_5831025867835225148_n.jpg" 
                    alt="John Paragon" 
                    className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold">John Paragon</p>
                    <p className="text-xs text-muted-foreground">Founder, Aura Forge</p>
                  </div>
                </div>
                <p className="text-sm italic">"Our Milestone-Based Onboarding system has helped Web3 game studios increase player retention by up to 73% in the crucial first week."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-[100px] -z-10"></div>
    </section>
  );
}