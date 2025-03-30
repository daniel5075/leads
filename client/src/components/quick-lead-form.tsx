import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  referredBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuickLeadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Extract referrer from URL when component mounts
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('r') || urlParams.get('ref'); // Support both 'r' and 'ref' parameters
      if (ref) {
        setReferrer(ref);
      }
    } catch (error) {
      console.error("Error parsing URL parameter:", error);
    }
  }, []);

  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      referredBy: "",
    },
  });
  
  // Update the form when referrer changes
  useEffect(() => {
    if (referrer) {
      form.setValue("referredBy", referrer);
    }
  }, [referrer, form]);

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Make API request to submit lead data
      const response = await apiRequest("POST", "/api/leads", {
        ...data,
        phone: "",
        twitterUrl: "",
        discordUsername: "",
      });
      
      if (response.ok) {
        const responseData = await response.json();
        
        // Show success toast
        toast({
          title: "Success!",
          description: responseData.message || "Your information has been submitted successfully.",
          variant: "default",
        });
        
        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Redirect to thank you page
        setLocation("/thank-you");
      } else {
        // Handle error response
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Show error toast
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <h3 className="text-xl font-bold mb-2">Get Instant Access</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Fill out this quick form to get our free Web3 Gaming PDF guide
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {referrer && (
            <input type="hidden" name="referredBy" value={referrer} />
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white font-bold transition-all flex items-center justify-center mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Get Instant Access
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground text-center mt-2">
            <p>
              By submitting, you agree to receive communications from AURA FORGE. 
              We respect your privacy.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}