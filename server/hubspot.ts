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
      
      // Format the data for HubSpot's contacts API using standard HubSpot property names
      const properties = {
        email: leadData.email,
        firstname: leadData.name.split(' ')[0],
        lastname: leadData.name.split(' ').slice(1).join(' ') || '',
        phone: leadData.phone || '',
        // Use notes for additional fields that might not exist in HubSpot by default
        notes: `Twitter: ${leadData.twitterUrl || 'N/A'}, Discord: ${leadData.discordUsername || 'N/A'}`,
      };

      // Search for existing contact by email first
      try {
        // Using a simpler approach - get all contacts with matching email
        // Note: This avoids issues with the enum types for filter operators
        const searchResponse = await hubspotClient.crm.contacts.basicApi.getPage(
          undefined, // default count
          undefined, // default after
          ['email', 'firstname', 'lastname'], // properties to return
          undefined, // properties with history
          `email=${encodeURIComponent(leadData.email)}` // simple string filter
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