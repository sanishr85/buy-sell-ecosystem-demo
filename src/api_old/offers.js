import API_URL from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const offersAPI = {
  // Create a new offer
  create: async (offerData) => {
    try {
      console.log('📤 Creating offer:', offerData);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/offers`, {
        method: 'POST',
        headers,
        body: JSON.stringify(offerData)
      });

      const data = await response.json();
      console.log('✅ Create offer response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Create offer error:', error);
      return { success: false, message: error.message };
    }
  },

  // Get all offers for a specific need (buyer viewing)
  getByNeed: async (needId) => {
    try {
      console.log('📥 Fetching offers for need:', needId);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/offers/need/${needId}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      console.log('✅ Offers by need response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Get offers by need error:', error);
      return { success: false, message: error.message, offers: [] };
    }
  },

  // Get my offers (seller viewing their submitted offers)
  getMyOffers: async (status = null) => {
    try {
      console.log('📥 Fetching my offers, status:', status);
      
      const headers = await getAuthHeader();
      const url = status 
        ? `${API_URL}/offers/my-offers?status=${status}`
        : `${API_URL}/offers/my-offers`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      console.log('✅ My offers response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Get my offers error:', error);
      return { success: false, message: error.message, offers: [], stats: {} };
    }
  },

  // Get specific offer details
  getById: async (offerId) => {
    try {
      console.log('📥 Fetching offer:', offerId);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/offers/${offerId}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      console.log('✅ Offer details response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Get offer error:', error);
      return { success: false, message: error.message };
    }
  },

  // Accept an offer (buyer action)
  accept: async (offerId) => {
    try {
      console.log('✅ Accepting offer:', offerId);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/offers/${offerId}/accept`, {
        method: 'PUT',
        headers
      });

      const data = await response.json();
      console.log('✅ Accept offer response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Accept offer error:', error);
      return { success: false, message: error.message };
    }
  },

  // Decline an offer (buyer action)
  decline: async (offerId) => {
    try {
      console.log('❌ Declining offer:', offerId);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/offers/${offerId}/decline`, {
        method: 'PUT',
        headers
      });

      const data = await response.json();
      console.log('✅ Decline offer response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Decline offer error:', error);
      return { success: false, message: error.message };
    }
  },

  // Withdraw an offer (seller action)
  withdraw: async (offerId) => {
    try {
      console.log('🔙 Withdrawing offer:', offerId);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/offers/${offerId}/withdraw`, {
        method: 'PUT',
        headers
      });

      const data = await response.json();
      console.log('✅ Withdraw offer response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Withdraw offer error:', error);
      return { success: false, message: error.message };
    }
  }
};
