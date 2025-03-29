import { useState } from "react";
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
});

type FormValues = z.infer<typeof formSchema>;

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      twitterUrl: "",
      discordUsername: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Make API request to submit lead data
      const response = await apiRequest("POST", "/api/leads", data);
      
      if (response.ok) {
        const responseData = await response.json();
        
        // Check if HubSpot integration was successful
        const hubspotSuccess = responseData.hubspot?.success;
        
        // Show success toast - include info about HubSpot if available
        toast({
          title: "Success!",
          description: responseData.message || "Your information has been submitted successfully.",
          variant: "default",
        });
        
        // If HubSpot integration was attempted but failed, show a note about it
        // but don't block the user's flow
        if (responseData.hubspot && !hubspotSuccess) {
          console.warn("HubSpot integration failed:", responseData.hubspot.error);
          // Optional: Show a warning toast about HubSpot sync issue
          // Uncomment if you want to show users this info
          /*
          toast({
            title: "Note",
            description: "We've saved your information but there was an issue syncing with our CRM. Our team has been notified.",
            variant: "default",
          });
          */
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
    <div className="bg-card border border-border/50 p-8 rounded-xl shadow-lg relative">
      {/* Background gradients */}
      <div className="absolute -top-5 -left-5 w-24 h-24 bg-primary/30 rounded-full blur-xl -z-10"></div>
      <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-secondary/30 rounded-full blur-xl -z-10"></div>
      
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
            <p className="flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-3 w-3 text-orange-500">
                <path fill="currentColor" d="M489.9 172c-17.9-11.8-41.7-8.9-55.9 7.7l-54.2 63.3c-11.9 13.9-12.4 34.5-1.2 48.3 8.5 10.5 9.3 25.6 2 37.3-7.1 11.4-20.6 17.4-34.5 15.3l-43.3-7c-3.3-.6-6 1.3-6.8 2.5-.9 1.2-2 3.8-1 7l22.8 69.2c3.7 11.3 14.1 19.1 25.9 19.1 16 0 28.9-13 28.9-28.9v-17.3c0-13.2 8.5-25 20.9-29.2l56.1-18.5c38.7-12.7 65.8-48.5 65.8-88.5 0-28.4-14.7-54.6-38.8-70.2zM279.2 42.5v18c-25.8 4.9-51.1 14.4-73.1 28.9-18.3 12-35.8 27.3-51.3 45.3-9.7 11.2-9 28 1.7 38.1 7.7 7.3 19.1 9.1 28.7 4.6 14.4-6.7 30.4-9.9 46.7-9.9 62.2 0 112.8 50.6 112.8 112.8 0 62.2-50.6 112.8-112.8 112.8-62.2 0-112.8-50.6-112.8-112.8 0-12.6 2.1-25 6.1-36.9 4.5-13-1.1-27.2-13.2-33.5-8.9-4.6-19.5-4-28-1-8.4 3-14.9 9.3-18.1 17.7-6.1 15.5-9.2 31.7-9.2 53.7 0 75.5 56.3 138.1 129.2 148v18c0 11.9 9.6 21.5 21.5 21.5 11.9 0 21.5-9.6 21.5-21.5v-18c98.7-12 169.1-100.4 169.1-201.8 0-110.6-89.8-199.3-199.8-201.5zM273 291.5c0-7.4-6-13.5-13.4-13.5h-28.3c-7.4 0-13.5 6.1-13.5 13.5v28.3c0 7.4 6.1 13.5 13.5 13.5h28.3c7.4 0 13.4-6.1 13.4-13.5v-28.3z" />
              </svg>
              <span>Powered by HubSpot</span>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
