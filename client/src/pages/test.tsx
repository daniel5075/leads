import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define a type for our API response
interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id?: string;
    [key: string]: any;
  };
}

export default function TestPage() {
  const { toast } = useToast();
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [referredBy, setReferredBy] = useState('TestReferrer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | Error | null>(null);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiRequest(
        'POST',
        '/api/leads',
        {
          name,
          email,
          phone: '',
          twitterUrl: 'https://twitter.com/testuser',
          discordUsername: 'testuser#1234',
          referredBy
        }
      );
      
      const responseData: ApiResponse = await response.json();
      setResult(responseData);
      toast({
        title: 'Test lead submitted',
        description: responseData.success 
          ? `Success! Lead ${responseData.data?.id || 'created'}`
          : `Error: ${responseData.error || 'Unknown error'}`,
      });
    } catch (error: any) {
      setResult(error);
      toast({
        title: 'Test failed',
        description: `Error: ${error.message || 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <CardTitle className="text-3xl font-bold">Close.com Integration Test</CardTitle>
        <Button variant="outline" onClick={() => window.location.href = "/admin"}>
          Go to Admin Dashboard
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Lead Submission</CardTitle>
          <CardDescription>
            Submit a test lead to verify Close.com integration with referral tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referredBy">Referred By</Label>
              <Input 
                id="referredBy" 
                value={referredBy} 
                onChange={(e) => setReferredBy(e.target.value)} 
              />
              <p className="text-sm text-gray-500">This is what will be saved as the "ReferredBy" field in Close.com</p>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Test Lead'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
                  toast({ title: "Refreshed leads cache" });
                }}
              >
                Refresh Leads Cache
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <div className="w-full">
            <h3 className="text-lg font-medium">Result:</h3>
            <pre className="mt-2 w-full bg-slate-950 p-4 rounded-md overflow-auto text-sm">
              {result ? JSON.stringify(result, null, 2) : 'No results yet'}
            </pre>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}