import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
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
        <h2 className="text-xl font-semibold mb-4">Recent Leads</h2>
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