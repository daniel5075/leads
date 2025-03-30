import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface CloseStatusProps {
  className?: string;
}

export default function CloseStatus({ className = "" }: CloseStatusProps) {
  const [status, setStatus] = useState<{
    configured: boolean;
    user?: string;
    organization?: string;
    error?: boolean;
    message?: string;
    stats?: {
      leads: number;
      contacts: number;
    }
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProperties, setShowProperties] = useState(false);

  async function checkCloseStatus() {
    setLoading(true);
    try {
      const response = await apiRequest("GET", "/api/close/status");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        setStatus({
          configured: false,
          error: true,
          message: "Error checking Close.com status"
        });
      }
    } catch (error) {
      console.error("Error checking Close.com status:", error);
      setStatus({
        configured: false,
        error: true,
        message: "Error checking Close.com status"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkCloseStatus();
  }, []);

  if (loading) {
    return (
      <div className={cn("p-3 bg-muted/60 rounded-md text-sm", className)}>
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
            <CheckCircle className="h-4 w-4" />
          ) : status.error ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span className="font-medium">
            Close.com Integration: {status.configured && !status.error 
              ? "Connected" 
              : status.error 
                ? "Configuration Error" 
                : "Not Configured"}
          </span>
        </div>

        <button 
          onClick={checkCloseStatus} 
          className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          disabled={loading}
        >
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          <span className="sr-only">Refresh</span>
        </button>
      </div>
      
      {status.user && (
        <div className="mt-1 ml-6 text-xs opacity-80">
          User: {status.user}
        </div>
      )}
      
      {status.message && (
        <div className="mt-1 ml-6 text-sm">
          {status.message}
        </div>
      )}
      
      {status.configured && !status.error && (
        <div className="mt-3 ml-6 border-t border-border pt-2">
          <button 
            onClick={() => setShowProperties(!showProperties)}
            className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {showProperties ? 'Hide' : 'Show'} Close.com details
          </button>
          
          {showProperties && (
            <div className="mt-2 text-xs">
              <div className="font-medium mb-1">Close.com Integration:</div>
              <ul className="list-disc pl-4 space-y-1">
                <li className="text-green-600 dark:text-green-400">
                  <span className="font-mono bg-muted px-1 rounded">API</span> - Connected
                </li>
                {status.user && (
                  <li className="text-green-600 dark:text-green-400">
                    <span className="font-mono bg-muted px-1 rounded">User</span> - {status.user}
                  </li>
                )}
                {status.organization && (
                  <li className="text-green-600 dark:text-green-400">
                    <span className="font-mono bg-muted px-1 rounded">Organization</span> - {status.organization}
                  </li>
                )}
                {status.stats && (
                  <>
                    <li className={status.stats.leads > 0 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                      <span className="font-mono bg-muted px-1 rounded">Leads</span> - {status.stats.leads} found
                    </li>
                    <li className={status.stats.contacts > 0 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                      <span className="font-mono bg-muted px-1 rounded">Contacts</span> - {status.stats.contacts} found
                    </li>
                  </>
                )}
              </ul>
              
              <div className="mt-3 text-xs text-muted-foreground">
                <p>Submission notes:</p>
                <ol className="list-decimal pl-4 space-y-1 mt-1">
                  <li>Twitter and Discord are saved as notes on leads</li>
                  <li>Each lead can be viewed in your Close.com dashboard</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}