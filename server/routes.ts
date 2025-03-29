import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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
      
      // Return success response
      res.status(201).json({
        success: true,
        message: "Lead information submitted successfully",
        data: createdLead
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
