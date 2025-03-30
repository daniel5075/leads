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
          
          // Step 1: Update the lead first - only update the name
          const updateLeadResponse = await closeApi.put(`/lead/${existingLead.id}`, {
            name: leadData.name,
            // Don't update status, keep whatever status the lead already has
          });
          
          // Step 2: Check if this lead has contacts
          const contactsResponse = await closeApi.get('/contact/', {
            params: {
              lead_id: existingLead.id
            }
          });
          
          let contactId;
          let updateResponse;
          
          // If lead has contacts, update the first one
          if (contactsResponse.data.data && contactsResponse.data.data.length > 0) {
            contactId = contactsResponse.data.data[0].id;
            console.log('[Close] Updating existing contact:', contactId);
            
            const updateContactResponse = await closeApi.put(`/contact/${contactId}`, {
              name: leadData.name,
              emails: [{ email: leadData.email, type: 'office' }],
              phones: leadData.phone ? [{ phone: leadData.phone, type: 'office' }] : []
            });
            
            updateResponse = {
              data: {
                ...updateLeadResponse.data,
                contact: updateContactResponse.data
              }
            };
          } else {
            // Create a new contact for this lead
            console.log('[Close] Creating new contact for existing lead');
            const createContactResponse = await closeApi.post('/contact/', {
              lead_id: existingLead.id,
              name: leadData.name,
              emails: [{ email: leadData.email, type: 'office' }],
              phones: leadData.phone ? [{ phone: leadData.phone, type: 'office' }] : []
            });
            
            updateResponse = {
              data: {
                ...updateLeadResponse.data,
                contact: createContactResponse.data
              }
            };
          }
          
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

      // Step 1: Create a new lead first
      // Don't specify a status - Close.com will assign the default status
      const createLeadResponse = await closeApi.post('/lead/', {
        name: leadData.name,
      });
      
      // Get the new lead's ID
      const newLeadId = createLeadResponse.data.id;
      
      // Step 2: Create a contact and associate it with the lead
      const createContactResponse = await closeApi.post('/contact/', {
        lead_id: newLeadId,
        name: leadData.name,
        emails: [{ email: leadData.email, type: 'office' }],
        phones: leadData.phone ? [{ phone: leadData.phone, type: 'office' }] : []
      });
      
      console.log('[Close] Created contact:', createContactResponse.data.id);
      
      // Return combined data
      const createResponse = {
        data: {
          ...createLeadResponse.data,
          contact: createContactResponse.data
        }
      };
      
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
    } catch (error: any) {
      console.error('[Close] Error creating/updating lead:', error);
      
      // Extract more detailed error information from Axios errors
      let errorMessage = 'Unknown error with Close.com API';
      let errorData = null;
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('[Close] Error response data:', error.response.data);
        console.error('[Close] Error response status:', error.response.status);
        
        if (error.response.data) {
          if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
            errorMessage = `API Error: ${error.response.data.errors.join(', ')}`;
          } else if (error.response.data['field-errors']) {
            const fieldErrors = Object.entries(error.response.data['field-errors'] || {})
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : String(errors)}`)
              .join('; ');
            errorMessage = `Validation Error: ${fieldErrors}`;
          }
          errorData = error.response.data;
        } else {
          errorMessage = `HTTP Error ${error.response.status}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from Close.com API';
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = typeof error.message === 'string' ? error.message : 'Unknown error';
      }
      
      return { 
        success: false, 
        error: errorMessage,
        errorData
      };
    }
  },
  
  /**
   * Check connection to Close.com API
   * @returns Success status and data or error message
   */
  async checkConnection() {
    try {
      // Step 1: Check user authentication
      const userResponse = await closeApi.get('/me/');
      const userName = userResponse.data.first_name + ' ' + userResponse.data.last_name;
      const orgData = userResponse.data.organizations[0] || {};
      const organization = orgData.name || 'Unknown';
      const orgId = orgData.id;
      
      // Step 2: Check if we can get leads
      let leadStats = { count: 0 };
      try {
        const leadsResponse = await closeApi.get('/lead/', { params: { _limit: 5 } });
        leadStats.count = leadsResponse.data.total_results || 0;
        console.log('[Close] Found leads:', leadStats.count);
      } catch (leadsError) {
        console.error('[Close] Error fetching leads:', leadsError);
      }
      
      // Step 3: Check if we can get contacts
      let contactStats = { count: 0 };
      try {
        const contactsResponse = await closeApi.get('/contact/', { params: { _limit: 5 } });
        contactStats.count = contactsResponse.data.total_results || 0;
        console.log('[Close] Found contacts:', contactStats.count);
      } catch (contactsError) {
        console.error('[Close] Error fetching contacts:', contactsError);
      }
      
      // Success if we can at least authenticate
      // Generate Close.com app URLs
      const leadsUrl = orgId ? `https://app.close.com/organizations/${orgId}/leads/` : null;
      
      return { 
        success: true, 
        data: {
          user: userName,
          organization: organization,
          organizationId: orgId,
          leadCount: leadStats.count,
          contactCount: contactStats.count,
          leadsUrl: leadsUrl
        }
      };
    } catch (error: any) {
      console.error('[Close] Connection test failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 
               (error?.response?.data?.message || error?.message || 'Unknown error with Close.com API')
      };
    }
  }
};