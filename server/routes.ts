import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { closeService } from "./close";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Create a new lead from opt-in form
  app.post("/api/leads", async (req, res) => {
    try {
      // Validate the incoming data
      const validatedData = insertLeadSchema.parse(req.body);

      // Store the lead in memory storage
      const createdLead = await storage.createLead(validatedData);
      
      // Track integration results
      let closeIntegration = null;
      
      // Submit to Close.com if credentials are available
      if (process.env.CLOSE_API_KEY) {
        try {
          closeIntegration = await closeService.createOrUpdateLead(validatedData);
          console.log('[Close] Integration result:', closeIntegration.success ? 'Success' : 'Failed');
        } catch (closeError) {
          console.error('[Close] Error during integration:', closeError);
          // We don't fail the overall request if Close integration fails
          closeIntegration = { 
            success: false, 
            error: closeError instanceof Error ? closeError.message : 'Unknown Close.com error' 
          };
        }
      } else {
        console.log('[Close] Skipping integration - API key not configured');
      }

      // Return success response
      res.status(201).json({
        success: true,
        message: "Success! Your gift is on the way to your email inbox and should arrive within the next 2-3 minutes.",
        data: createdLead,
        integration: closeIntegration
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationError.message
        });
        return;
      }

      // Handle any other errors
      res.status(500).json({ 
        success: false, 
        message: "Something went wrong while processing your request" 
      });
    }
  });
  
  // Test Close.com integration by sending a test lead
  app.post("/api/close/test", async (req, res) => {
    if (!process.env.CLOSE_API_KEY) {
      return res.status(400).json({ 
        success: false, 
        message: "Close.com integration is not configured. Missing API key." 
      });
    }
    
    try {
      // Create a test lead to verify the connection
      // Make sure the timestamp is unique to avoid conflicts
      const timestamp = Date.now();
      const testLead = {
        name: "Test Lead " + new Date().toISOString().split('T')[0],
        email: `test-${timestamp}@example.com`,
        phone: "+15555555555",
        twitterUrl: "https://twitter.com/testuser",
        discordUsername: "testuser#1234"
      };
      
      // Log the test attempt
      console.log('[Close] Sending test lead:', testLead);
      
      const result = await closeService.createOrUpdateLead(testLead);
      
      if (!result.success) {
        console.error('[Close] Test lead creation failed:', result.error);
      } else {
        console.log('[Close] Test lead creation succeeded:', result.data?.id || 'no ID returned');
      }
      
      return res.status(200).json({
        success: result.success,
        message: result.success 
          ? "Successfully sent test lead to Close.com!"
          : `Failed to send test lead to Close.com: ${result.error || 'Unknown error'}`,
        data: result
      });
    } catch (error) {
      console.error('[Close] Test lead creation failed:', error);
      
      // Error during test
      return res.status(500).json({ 
        success: false, 
        message: "Failed to create test lead in Close.com."
      });
    }
  });
  
  // Route to check Close.com connection status
  app.get("/api/close/status", async (_req, res) => {
    if (!process.env.CLOSE_API_KEY) {
      return res.status(200).json({ 
        configured: false, 
        message: "Close.com integration is not configured. Missing API key." 
      });
    }
    
    try {
      // Test connection to Close.com by making a real API call
      const status = await closeService.checkConnection();
      
      // If no error was thrown, connection is good
      res.status(200).json({ 
        configured: true, 
        message: "Close.com integration is configured and working correctly.",
        user: status.data?.user,
        organization: status.data?.organization,
        organizationId: status.data?.organizationId,
        leadsUrl: status.data?.leadsUrl,
        stats: {
          leads: status.data?.leadCount || 0,
          contacts: status.data?.contactCount || 0
        }
      });
    } catch (error) {
      console.error('[Close] Connection test failed:', error);
      
      // Connection test failed
      res.status(200).json({ 
        configured: true, 
        error: true,
        message: "Close.com credentials are configured but there was an error connecting. Please check your API key and permissions."
      });
    }
  });
  
  // Get all leads (for admin purposes)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.status(200).json({
        success: true,
        count: leads.length,
        data: leads
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve leads" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}