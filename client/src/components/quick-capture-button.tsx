import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import QuickLeadForm from "./quick-lead-form";

export default function QuickCaptureButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSuccess = () => {
    // Close the dialog after successful submission
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating button with pulsating effect */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-6 group"
        >
          <span className="mr-2">Quick Sign-up</span>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </Button>
      </div>

      {/* Dialog for quick lead form */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Quick Access Form
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="px-2 py-4">
            <QuickLeadForm onSuccess={handleFormSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}