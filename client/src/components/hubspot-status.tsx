import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle2, XCircle, AlertTriangle, Info, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HubSpotStatusProps {
  className?: string;
}

export default function HubSpotStatus({ className = "" }: HubSpotStatusProps) {
  const [status, setStatus] = useState<{
    configured: boolean;
    portalId?: string;
    error?: boolean;
    message: string;
    availableProperties?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const [testingContact, setTestingContact] = useState(false);
  const { toast } = useToast();

  async function checkHubSpotStatus() {
    setLoading(true);
    try {
      const response = await apiRequest("GET", "/api/hubspot/status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        setStatus({
          configured: false,
          error: true,
          message: "Error checking HubSpot status"
        });
      }
    } catch (error) {
      console.error("Error checking HubSpot status:", error);
      setStatus({
        configured: false,
        error: true,
        message: "Error checking HubSpot status"
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function sendTestContact() {
    setTestingContact(true);
    try {
      const response = await apiRequest("POST", "/api/hubspot/test");
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          toast({
            title: "Test Successful",
            description: "Test contact was successfully sent to HubSpot!",
            variant: "default",
          });
        } else {
          toast({
            title: "Test Failed",
            description: data.message || "Failed to send test contact to HubSpot",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to send test contact to HubSpot",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending test contact:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while testing the integration",
        variant: "destructive",
      });
    } finally {
      setTestingContact(false);
    }
  }

  useEffect(() => {
    checkHubSpotStatus();
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center p-3 bg-muted/60 rounded-md text-sm ${className}`}>
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="h-4 w-4 bg-muted-foreground/30 rounded-full"></div>
          <div className="h-3 w-32 bg-muted-foreground/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className={cn("p-3 rounded-md text-sm", className, {
      "bg-green-500/10 text-green-700 dark:text-green-400": status.configured && !status.error,
      "bg-amber-500/10 text-amber-700 dark:text-amber-400": status.error,
      "bg-red-500/10 text-red-700 dark:text-red-400": !status.configured
    })}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status.configured && !status.error ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : status.error ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span className="font-medium">
            HubSpot Integration: {status.configured && !status.error 
              ? "Connected" 
              : status.error 
                ? "Configuration Error" 
                : "Not Configured"}
          </span>
        </div>
        
        <button 
          onClick={checkHubSpotStatus} 
          className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          disabled={loading}
        >
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          <span className="sr-only">Refresh</span>
        </button>
      </div>
      
      {status.portalId && (
        <div className="mt-1 ml-6 text-xs opacity-80">
          Portal ID: {status.portalId}
        </div>
      )}
      
      <div className="mt-1 ml-6">
        {status.message}
      </div>
      
      {status.configured && !status.error && (
        <div className="mt-3 ml-6 border-t border-border pt-2">
          <button 
            onClick={() => setShowProperties(!showProperties)}
            className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Info className="h-3 w-3 mr-1" />
            {showProperties ? 'Hide' : 'Show'} HubSpot property info
          </button>
          
          {showProperties && (
            <div className="mt-2 text-xs">
              <div className="font-medium mb-1">Important Custom Properties:</div>
              <ul className="list-disc pl-4 space-y-1">
                <li className="text-green-600 dark:text-green-400">
                  <span className="font-mono bg-muted px-1 rounded">discord_id</span> - Available & Connected
                </li>
                <li className="text-green-600 dark:text-green-400">
                  <span className="font-mono bg-muted px-1 rounded">twitterhandle</span> - Available & Connected
                </li>
              </ul>
              
              <div className="mt-3 text-xs text-muted-foreground">
                <p>Debugging tips:</p>
                <ol className="list-decimal pl-4 space-y-1 mt-1">
                  <li>In HubSpot, go to Settings &gt; Properties</li>
                  <li>Create custom contact properties if needed</li>
                  <li>Use the exact API name shown in the property settings</li>
                </ol>
              </div>
              
              <div className="mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs h-8 flex items-center justify-center"
                  onClick={sendTestContact}
                  disabled={testingContact}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {testingContact ? "Sending..." : "Send Test Contact"}
                </Button>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Creates a test contact in HubSpot to verify the integration
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}