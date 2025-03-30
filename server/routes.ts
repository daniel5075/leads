import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { hubspotService, hubspotClient } from "./hubspot";
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
      const integrations: {
        hubspot: any;
        close: any;
      } = {
        hubspot: null,
        close: null
      };
      
      // Submit to HubSpot if credentials are available
      if (process.env.HUBSPOT_API_KEY && process.env.HUBSPOT_PORTAL_ID) {
        try {
          integrations.hubspot = await hubspotService.createOrUpdateContact(validatedData);
          console.log('[HubSpot] Integration result:', integrations.hubspot.success ? 'Success' : 'Failed');
        } catch (hubspotError) {
          console.error('[HubSpot] Error during integration:', hubspotError);
          // We don't fail the overall request if HubSpot integration fails
          integrations.hubspot = { 
            success: false, 
            error: hubspotError instanceof Error ? hubspotError.message : 'Unknown HubSpot error' 
          };
        }
      } else {
        console.log('[HubSpot] Skipping integration - API key or Portal ID not configured');
      }
      
      // Submit to Close.com if credentials are available
      if (process.env.CLOSE_API_KEY) {
        try {
          integrations.close = await closeService.createOrUpdateLead(validatedData);
          console.log('[Close] Integration result:', integrations.close.success ? 'Success' : 'Failed');
        } catch (closeError) {
          console.error('[Close] Error during integration:', closeError);
          // We don't fail the overall request if Close integration fails
          integrations.close = { 
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
        integrations
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
  
  // Route to check HubSpot connection status
  app.get("/api/hubspot/status", async (_req, res) => {
    if (!process.env.HUBSPOT_API_KEY || !process.env.HUBSPOT_PORTAL_ID) {
      return res.status(200).json({ 
        configured: false, 
        message: "HubSpot integration is not configured. Missing API key or Portal ID." 
      });
    }
    
    try {
      // Test connection to HubSpot by making a real API call
      // hubspotClient is already imported at the top
      
      // Try to get available properties to show what fields are available
      let availableProperties: string[] = [];
      try {
        // Get all properties for contacts
        const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll('contacts');
        availableProperties = propertiesResponse.results.map((p: any) => p.name);
        
        // Log social media related fields to help find Twitter
        const socialFields = availableProperties.filter((p: string) => 
          p.includes('twitter') || 
          p.includes('social') || 
          p.includes('handle') ||
          p.includes('tweet') ||
          p.includes('tw_')
        );
        
        console.log('[HubSpot] Social media related fields:', socialFields);
        
        console.log('[HubSpot] Available custom properties:', 
          availableProperties.filter((p: string) => !['email', 'firstname', 'lastname', 'phone'].includes(p)));
      } catch (propError) {
        console.error('[HubSpot] Error fetching properties:', propError);
      }
      
      // Try to get a page of contacts to test the connection
      await hubspotClient.crm.contacts.basicApi.getPage(1);
      
      // If no error was thrown, connection is good
      res.status(200).json({ 
        configured: true, 
        portalId: process.env.HUBSPOT_PORTAL_ID,
        message: "HubSpot integration is configured and working correctly.",
        availableProperties: availableProperties || []
      });
    } catch (error) {
      console.error('[HubSpot] Connection test failed:', error);
      
      // Connection test failed
      res.status(200).json({ 
        configured: true, 
        error: true,
        portalId: process.env.HUBSPOT_PORTAL_ID,
        message: "HubSpot credentials are configured but there was an error connecting. Please check your API key and permissions."
      });
    }
  });

  // Get detailed property information from HubSpot
  app.get("/api/hubspot/properties/details", async (_req, res) => {
    if (!process.env.HUBSPOT_API_KEY || !process.env.HUBSPOT_PORTAL_ID) {
      return res.status(200).json({ 
        success: false, 
        message: "HubSpot integration is not configured. Missing API key or Portal ID." 
      });
    }
    
    try {
      const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll('contacts');
      const properties = propertiesResponse.results;
      
      // Map display names to internal names
      const propertiesMap = properties.map((p: any) => ({
        name: p.name,
        label: p.label,
        description: p.description,
        type: p.type,
        fieldType: p.fieldType,
        groupName: p.groupName
      }));
      
      // Look for Twitter and Discord specifically
      const twitterProps = properties.filter((p: any) => 
        p.label.toLowerCase().includes('twitter') || 
        p.name.toLowerCase().includes('twitter')
      );
      
      const discordProps = properties.filter((p: any) => 
        p.label.toLowerCase().includes('discord') || 
        p.name.toLowerCase().includes('discord')
      );
      
      res.status(200).json({
        success: true,
        count: properties.length,
        properties: propertiesMap,
        twitterProperties: twitterProps,
        discordProperties: discordProps
      });
    } catch (error) {
      console.error('[HubSpot] Error fetching property details:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve property details" 
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