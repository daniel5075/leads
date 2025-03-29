import { Client } from '@hubspot/api-client';
import { InsertLead } from '../shared/schema';

// Initialize the HubSpot client with API key from environment variables
const hubspotClient = new Client({
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
      
      // Format the data for HubSpot's contacts API
      const properties = {
        email: leadData.email,
        firstname: leadData.name.split(' ')[0],
        lastname: leadData.name.split(' ').slice(1).join(' ') || '',
        phone: leadData.phone || '',
        twitter_username: leadData.twitterUrl || '',
        discord_username: leadData.discordUsername || '',
      };

      // Search for existing contact by email first
      try {
        // Attempt to find the contact by email
        const existingContact = await hubspotClient.crm.contacts.basicApi.getById(
          leadData.email,
          undefined,
          undefined,
          undefined,
          false
        );

        if (existingContact) {
          // Contact exists, update their properties
          console.log('[HubSpot] Contact exists, updating properties');
          const updateResponse = await hubspotClient.crm.contacts.basicApi.update(
            existingContact.id,
            { properties }
          );
          return { success: true, data: updateResponse, isNew: false };
        }
      } catch (error) {
        // Contact does not exist - this is expected
        console.log('[HubSpot] Contact does not exist, will create new one');
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