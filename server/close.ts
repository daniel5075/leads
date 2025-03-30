import axios from 'axios';
import { InsertLead } from '../shared/schema';

// Create an Axios instance for Close.com API
const closeApi = axios.create({
  baseURL: 'https://api.close.com/api/v1',
  headers: {
    'Authorization': `Basic ${Buffer.from(`${process.env.CLOSE_API_KEY}:`).toString('base64')}`,
    'Content-Type': 'application/json',
  },
});

export const closeService = {
  /**
   * Creates or updates a lead in Close.com based on form submission
   * @param leadData The lead data from the form
   * @returns Success status and data or error message
   */
  async createOrUpdateLead(leadData: InsertLead) {
    try {
      console.log('[Close] Creating/updating lead:', leadData.email);
      
      // We don't need to parse the name since we'll use it as is
      // But we'll keep this code for future reference if needed
      let contactName = leadData.name;
      
      // Search for existing lead by email first
      try {
        const searchResponse = await closeApi.get('/lead/', {
          params: {
            query: `email:${leadData.email}`
          }
        });
        
        // If we found a lead with this email
        if (searchResponse.data.data && searchResponse.data.data.length > 0) {
          const existingLead = searchResponse.data.data[0];
          console.log('[Close] Lead exists, updating information');
          
          // Update the existing lead's contacts
          const updateResponse = await closeApi.put(`/lead/${existingLead.id}`, {
            name: leadData.name,
            status: 'Qualified', // Set appropriate status
            contacts: [
              {
                name: leadData.name,
                emails: [{ email: leadData.email, type: 'office' }],
                phones: leadData.phone ? [{ phone: leadData.phone, type: 'office' }] : [],
              }
            ]
          });
          
          // Add custom fields if they exist
          if (leadData.twitterUrl || leadData.discordUsername) {
            // Create custom fields activity
            await closeApi.post('/activity/note/', {
              lead_id: existingLead.id,
              note: `
                Social Profiles:
                ${leadData.twitterUrl ? `Twitter: ${leadData.twitterUrl}` : ''}
                ${leadData.discordUsername ? `Discord: ${leadData.discordUsername}` : ''}
              `.trim()
            });
          }
          
          console.log('[Close] Integration result: Success (Updated)');
          return { success: true, data: updateResponse.data, isNew: false };
        } else {
          console.log('[Close] Lead does not exist, will create new one');
        }
      } catch (error) {
        // Error during search - log but continue to create new lead
        console.log('[Close] Error searching for lead, will attempt to create new one:', error);
      }

      // Create a new lead
      const createResponse = await closeApi.post('/lead/', {
        name: leadData.name,
        status: 'New', // Initial status for new leads
        contacts: [
          {
            name: leadData.name,
            emails: [{ email: leadData.email, type: 'office' }],
            phones: leadData.phone ? [{ phone: leadData.phone, type: 'office' }] : [],
          }
        ]
      });
      
      // The new lead's ID
      const newLeadId = createResponse.data.id;
      
      // Add custom fields if they exist
      if (leadData.twitterUrl || leadData.discordUsername) {
        // Create custom fields activity
        await closeApi.post('/activity/note/', {
          lead_id: newLeadId,
          note: `
            Social Profiles:
            ${leadData.twitterUrl ? `Twitter: ${leadData.twitterUrl}` : ''}
            ${leadData.discordUsername ? `Discord: ${leadData.discordUsername}` : ''}
          `.trim()
        });
      }
      
      console.log('[Close] Integration result: Success (Created)');
      return { success: true, data: createResponse.data, isNew: true };
    } catch (error) {
      console.error('[Close] Error creating/updating lead:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error with Close.com API'
      };
    }
  },
  
  /**
   * Check connection to Close.com API
   * @returns Success status and data or error message
   */
  async checkConnection() {
    try {
      // Attempt to get a lead to test the connection
      const response = await closeApi.get('/me/');
      return { 
        success: true, 
        data: {
          user: response.data.first_name + ' ' + response.data.last_name,
          organization: response.data.organizations[0]?.name || 'Unknown',
        }
      };
    } catch (error) {
      console.error('[Close] Connection test failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error with Close.com API' 
      };
    }
  }
};