import API_URL from './config';

export const offersAPI = {
  // Create an offer
  create: async (token, offerData) => {
    try {
      const response = await fetch(`${API_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(offerData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create offer error:', error);
      throw error;
    }
  },

  // Get offers for a need
  getByNeed: async (token, needId) => {
    try {
      const response = await fetch(`${API_URL}/offers/need/${needId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get offers by need error:', error);
      throw error;
    }
  },

  // Get my sent offers
  getMySent: async (token) => {
    try {
      const response = await fetch(`${API_URL}/offers/my/sent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get my sent offers error:', error);
      throw error;
    }
  },

  // Accept an offer
  accept: async (token, offerId) => {
    try {
      const response = await fetch(`${API_URL}/offers/${offerId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Accept offer error:', error);
      throw error;
    }
  },

  // Decline an offer
  decline: async (token, offerId) => {
    try {
      const response = await fetch(`${API_URL}/offers/${offerId}/decline`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Decline offer error:', error);
      throw error;
    }
  },

  // Get single offer
  getById: async (token, offerId) => {
    try {
      const response = await fetch(`${API_URL}/offers/${offerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get offer by ID error:', error);
      throw error;
    }
  },
};
