import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProgressBar from "@/components/progress-bar";
import { ArrowLeft, Calendar, CheckCircle, Download } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-start mb-6">
              <Link href="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft size={16} />
                  Back to Home
                </Button>
              </Link>
            </div>
            
            <Card className="border border-primary/20 bg-card/80 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center border-b border-border/20 pb-6">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2 font-display">Thank You!</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Your PDF is on its way to your inbox
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Your Milestone-Based Onboarding Guide</h3>
                      <p className="text-muted-foreground mb-4">
                        Check your email in the next few minutes. If you don't see it, please check your spam folder.
                      </p>
                      
                      <Button className="w-full mb-4 gap-2">
                        <Download size={16} />
                        Download PDF Directly
                      </Button>
                      
                      <div className="mt-8">
                        <h4 className="font-semibold mb-2">Your Onboarding Journey</h4>
                        <ProgressBar steps={["PDF Claimed", "Strategy Call", "Implementation", "Growth"]} currentStep={1} />
                      </div>
                    </div>
                    
                    <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                      <h4 className="font-semibold mb-2">What's Inside Your Guide:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>Milestone-based onboarding framework</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>5 psychological triggers that drive retention</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>Web3 adaptation of proven Web2 strategies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>Case studies and implementation guides</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border border-border/50 rounded-lg p-6 bg-card/50">
                    <div className="mb-6 flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Book Your Free Strategy Call</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      Take the next step and schedule a free 30-minute call with our Web3 player acquisition experts.
                    </p>
                    
                    {/* Calendly inline widget */}
                    <div className="rounded-md overflow-hidden border border-border/50 h-[400px] bg-card">
                      <div className="w-full h-full flex items-center justify-center p-6 text-center">
                        <div>
                          <h4 className="font-semibold mb-2">Calendly Integration</h4>
                          <p className="text-muted-foreground mb-4">Schedule your free strategy call</p>
                          <Button variant="default" className="gap-2">
                            <Calendar size={16} />
                            Open Calendar
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      No pressure, no sales tactics - just valuable insights you can implement right away.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
