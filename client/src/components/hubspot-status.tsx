import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

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

  useEffect(() => {
    async function checkHubSpotStatus() {
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
    <div className={`p-3 rounded-md text-sm ${className} ${
      status.configured && !status.error
        ? "bg-green-500/10 text-green-700 dark:text-green-400"
        : status.error
          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
          : "bg-red-500/10 text-red-700 dark:text-red-400"
    }`}>
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
                  <span className="font-mono bg-muted px-1 rounded">discord_id</span> - Available
                </li>
                <li className="text-amber-600 dark:text-amber-400">
                  <span className="font-mono bg-muted px-1 rounded">twitter</span> - Could not be found
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}