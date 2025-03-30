import { useEffect, useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RefreshCw } from "lucide-react";
import CloseStatus from "@/components/close-status";

export default function Admin() {
  const [leadCount, setLeadCount] = useState(0);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true);
        const response = await apiRequest("GET", "/api/leads");
        if (response.ok) {
          const data = await response.json();
          setLeads(data.data || []);
          setLeadCount(data.count || 0);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeads();
    
    // Set up refresh interval
    const intervalId = setInterval(fetchLeads, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = "/test"} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Test Integration
          </button>
          <button 
            onClick={() => window.location.href = "/"} 
            className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            View Lead Form
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Lead Capture Statistics</h2>
          <div className="bg-card p-6 rounded-lg border">
            <div className="text-4xl font-bold mb-2">{loading ? "..." : leadCount}</div>
            <div className="text-muted-foreground">Total Leads Captured</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
          <div className="space-y-4">
            <CloseStatus />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Leads</h2>
          <button 
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
              setLoading(true);
            }} 
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading leads...</div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">Error loading leads</div>
        ) : leads && leads.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Phone</th>
                  <th className="text-left p-3 font-medium">Twitter</th>
                  <th className="text-left p-3 font-medium">Discord</th>
                  <th className="text-left p-3 font-medium">Referred By</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((lead: any) => (
                  <tr key={lead.id} className="border-t">
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.email}</td>
                    <td className="p-3">{lead.phone || "-"}</td>
                    <td className="p-3">{lead.twitterUrl || "-"}</td>
                    <td className="p-3">{lead.discordUsername || "-"}</td>
                    <td className="p-3">
                      {lead.referredBy ? 
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {lead.referredBy}
                        </span> : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No leads captured yet</div>
        )}
      </div>
    </div>
  );
}