import LeadForm from "@/components/lead-form";
import { Button } from "@/components/ui/button";
import { GamepadIcon, Check } from "lucide-react";

interface CTASectionProps {
  showForm?: boolean;
}

export default function CTASection({ showForm = true }: CTASectionProps) {
  if (!showForm) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary/10 to-blue-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">Ready to Level Up Your Player Retention?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get our free PDF guide and learn how to implement milestone-based onboarding in your Web3 game today.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white font-bold transition-all"
              onClick={() => {
                document.getElementById('opt-in')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get the Free PDF Now
            </Button>
            <p className="mt-4 text-muted-foreground">Join hundreds of successful Web3 game studios using our framework</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="opt-in" className="py-16 bg-card/50 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <LeadForm />
          </div>
          
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4 mt-1 shrink-0">
                  <GamepadIcon className="text-emerald-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">What is Milestone-Based Onboarding?</h3>
                  <p className="text-muted-foreground">
                    It's a mini-quest system built into your onboarding that delivers instant rewards, visible progress, and daily reasons to come back. 
                    Think of it like a dopamine engine for your early player journey.
                  </p>
                </div>
              </div>
              
              {/* Progress Bars */}
              <div className="mt-6 mb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-500 font-bold">1</span>
                  </div>
                  <span className="text-sm font-medium">Complete first mission</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-primary to-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="mt-4 mb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-500 font-bold">2</span>
                  </div>
                  <span className="text-sm font-medium">Level up character</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="mt-4 mb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-500 font-bold">3</span>
                  </div>
                  <span className="text-sm font-medium">Join community Discord</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full w-2/5 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Milestone achievement visualization" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Proven Psychological Triggers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <Check className="text-emerald-500 mt-1 mr-2 h-5 w-5 shrink-0" />
                  <span>Commitment Bias - Once a player starts a journey, they're wired to want to complete it</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-emerald-500 mt-1 mr-2 h-5 w-5 shrink-0" />
                  <span>Dopamine from Progress - Filling a bar, unlocking a skin, or seeing "+10 XP" activates reward centers</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-emerald-500 mt-1 mr-2 h-5 w-5 shrink-0" />
                  <span>Identity Attachment - Players who feel like they are a "Founding Ally" stay longer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
