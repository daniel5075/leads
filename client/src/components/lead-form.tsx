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
  FormDescription,
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
  phone: z.string().optional(),
  twitterUrl: z.string().optional(),
  discordUsername: z.string().optional(),
  referredBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Extract referrer from URL when component mounts
  useEffect(() => {
    try {
      // Check for the empty parameter with value format ?=NAME
      const searchParams = window.location.search;
      if (searchParams.startsWith('?=')) {
        // Extract everything after the ?=
        const referrerName = decodeURIComponent(searchParams.substring(2));
        if (referrerName) {
          setReferrer(referrerName);
        }
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
      phone: "",
      twitterUrl: "",
      discordUsername: "",
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
      const response = await apiRequest("POST", "/api/leads", data);
      
      if (response.ok) {
        const responseData = await response.json();
        
        // Show success toast
        toast({
          title: "Success!",
          description: responseData.message || "Your information has been submitted successfully.",
          variant: "default",
        });
        
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
    <div className="bg-card border border-border/50 p-8 rounded-xl shadow-lg relative">
      {/* Background gradients */}
      <div className="absolute -top-5 -left-5 w-24 h-24 bg-primary/30 rounded-full blur-xl -z-10"></div>
      <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-secondary/30 rounded-full blur-xl -z-10"></div>
      
      {/* Referrer information banner */}
      {referrer && (
        <div className="bg-gradient-to-r from-primary/15 to-blue-500/10 border border-primary/30 rounded-lg px-5 py-4 mb-6 flex items-center shadow-sm">
          <div className="mr-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-foreground">Referred by <span className="font-bold text-primary">{referrer}</span></p>
            <p className="text-xs text-muted-foreground mt-1">Your referrer will be notified when you sign up</p>
          </div>
        </div>
      )}
      
      <h2 className="text-3xl font-bold mb-6 font-display">Get the Free PDF Now</h2>
      <p className="text-muted-foreground mb-6">
        Discover how to onboard, engage, and retain your players — without spending a cent on ads
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitterUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X/Twitter URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://twitter.com/yourusername" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discordUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discord Username (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="username#1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Hidden form field for React Hook Form to capture the referrer */}
          {referrer && (
            <FormField
              control={form.control}
              name="referredBy"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white font-bold py-3 transition-all flex items-center justify-center mt-6"
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
          
          <div className="text-xs text-muted-foreground text-center mt-4 space-y-2">
            <p>
              By submitting this form, you agree to receive communications from AURA FORGE. 
              We respect your privacy and will never share your information.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
