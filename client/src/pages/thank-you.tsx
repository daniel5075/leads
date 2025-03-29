import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ProgressBar from "@/components/progress-bar";
import { ArrowLeft, Calendar, CheckCircle, Download } from "lucide-react";
import { InlineWidget, PopupButton } from "react-calendly";
import { useState, useEffect } from "react";

export default function ThankYou() {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    setRootElement(document.getElementById('root'));
  }, []);
  
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
              <CardHeader className="text-center border-b border-border/20 pb-4">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-1 font-display">Thank You!</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Your PDF is on its way to your inbox
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* PDF Info Section - Compact version */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row gap-6 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">Your Milestone-Based Onboarding Guide</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Check your email for your PDF. If you don't see it, please check your spam folder.
                      </p>
                      
                      <Button className="w-full gap-2 py-1 h-auto text-sm">
                        <Download size={14} />
                        Download PDF Directly
                      </Button>
                    </div>
                    
                    <div className="flex-1 bg-card/40 p-3 rounded-lg border border-border/30">
                      <h4 className="text-sm font-semibold mb-1">What's Inside Your Guide:</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>Milestone-based onboarding framework</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>5 psychological triggers for retention</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>Web3 adaptation of Web2 strategies</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>Case studies and implementation guides</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                
                  <div className="border-t border-border/30 pt-4 mt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-bold">Book Your Free Strategy Call</h3>
                    </div>
                    
                    <div className="text-center mb-4">
                      <p className="text-muted-foreground">
                        Schedule a free 30-minute call with our Web3 player acquisition experts.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        No pressure, no sales tactics - just valuable insights you can implement right away.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Calendly inline widget - full width and height */}
                <InlineWidget 
                  url="https://calendly.com/johnparagon/chat" 
                  styles={{
                    height: '700px',
                    width: '100%',
                  }}
                />
                
                {/* Popup button for mobile */}
                <div className="mt-4 md:hidden text-center">
                  {rootElement && (
                    <PopupButton 
                      url="https://calendly.com/johnparagon/chat"
                      rootElement={rootElement}
                      text="Schedule Call on Mobile"
                      className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white font-medium py-2 px-4 rounded-md"
                    />
                  )}
                  {!rootElement && (
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white font-medium gap-2"
                      onClick={() => window.open("https://calendly.com/johnparagon/chat", "_blank")}
                    >
                      <Calendar size={16} />
                      Schedule Call on Mobile
                    </Button>
                  )}
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
