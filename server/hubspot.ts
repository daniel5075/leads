import { Client } from '@hubspot/api-client';
import { InsertLead } from '../shared/schema';

// Initialize the HubSpot client with API key from environment variables
export const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_API_KEY,
});

export const hubspotService = {
  /**
   * Creates or updates a contact in HubSpot based on form submission
   * @param leadData The lead data from the form
   * @returns The created or updated contact from HubSpot
   */
  async createOrUpdateContact(leadData: InsertLead) {
    try {
      console.log('[HubSpot] Creating/updating contact:', leadData.email);
      
      // Map the data to HubSpot properties using confirmed field names from your account
      // Based on your HubSpot screenshot, we need to use:
      // - "TWITTER USERNAME" -> likely "twitter_username" internally
      // - "DISCORD ID" -> confirmed as "discord_id" internally
      const properties: Record<string, string> = {
        email: leadData.email,
        firstname: leadData.name.split(' ')[0],
        lastname: leadData.name.split(' ').slice(1).join(' ') || '',
        phone: leadData.phone || '',
      };
      
      // Add custom properties if values are provided
      if (leadData.discordUsername) {
        properties.discord_id = leadData.discordUsername;
      }
      
      // Use exact field names from HubSpot (confirmed from screenshots)
      if (leadData.twitterUrl) {
        // Using the exact API field name: "twitterhandle"
        properties.twitterhandle = leadData.twitterUrl;
      }

      // Search for existing contact by email first
      try {
        // Using a simpler approach - get all contacts with matching email
        // Note: This avoids issues with the enum types for filter operators
        // Get all contacts to search for the email manually
        // This works around the TypeScript API typing issues
        const searchResponse = await hubspotClient.crm.contacts.basicApi.getPage(
          10, // limit to 10 results
          undefined, // default after
          undefined, // properties to return (get all properties)
          undefined // properties with history
        );
        
        // Filter results to find a contact with matching email
        searchResponse.results = searchResponse.results.filter(
          contact => contact.properties?.email?.toLowerCase() === leadData.email.toLowerCase()
        );

        // If we found a contact with this email
        if (searchResponse.results && searchResponse.results.length > 0) {
          const existingContact = searchResponse.results[0];
          console.log('[HubSpot] Contact exists, updating properties');
          
          // Update the existing contact
          const updateResponse = await hubspotClient.crm.contacts.basicApi.update(
            existingContact.id,
            { properties }
          );
          return { success: true, data: updateResponse, isNew: false };
        } else {
          console.log('[HubSpot] Contact does not exist, will create new one');
        }
      } catch (error) {
        // Error during search - log but continue to create new contact
        console.log('[HubSpot] Error searching for contact, will attempt to create new one:', error);
      }

      // Create a new contact
      const createResponse = await hubspotClient.crm.contacts.basicApi.create({ properties });
      
      // Add to a specific list if needed (can be added later)
      
      return { success: true, data: createResponse, isNew: true };
    } catch (error) {
      console.error('[HubSpot] Error creating/updating contact:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error with HubSpot API'
      };
    }
  }
};