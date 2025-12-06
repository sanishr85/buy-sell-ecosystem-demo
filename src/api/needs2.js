import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../config/app';
import { mockNeeds } from '../data/mock';

const API_URL = AppConfig.API_URL;

// In-memory storage for demo mode
export let demoNeeds = [...mockNeeds];

export const needsAPI = {
  getAll: async (params = {}) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Getting all needs (for seller feed)');
      console.log('📋 Params received:', params);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('📋 Total needs in system:', demoNeeds.length);
      console.log('📋 Need IDs:', demoNeeds.map(n => n.id));
      console.log('📋 Need titles:', demoNeeds.map(n => n.title));
      
      return {
        success: true,
        needs: demoNeeds,
        count: demoNeeds.length,
        page: 1,
        total: demoNeeds.length,
        totalPages: 1
      };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_URL}/needs${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get all needs error:', error);
      return { success: false, message: error.message };
    }
  },

  getMyNeeds: async () => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Getting my needs');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : { id: 'buyer-1' };
      
      const myNeeds = demoNeeds.filter(n => n.buyerId === user.id);
      
      console.log('📋 My needs count:', myNeeds.length);
      
      return {
        success: true,
        needs: myNeeds
      };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/needs/my/posted`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.status === 401) {
        return { success: false, message: 'Session expired', shouldLogout: true };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get my needs error:', error);
      return { success: false, message: error.message };
    }
  },

  create: async (needData) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Creating need', needData);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : { 
        id: 'buyer-1', 
        name: 'Demo Buyer',
        email: 'demo-buyer@example.com' 
      };
      
      const newNeed = {
        id: `need-${Date.now()}`,
        ...needData,
        status: 'open',
        createdAt: new Date().toISOString(),
        buyerId: user.id,
        buyerName: user.name,
        buyerEmail: user.email,
        hasOffers: false,
        offerCount: 0
      };
      
      demoNeeds.unshift(newNeed);
      
      console.log('✅ Need created:', newNeed.id);
      console.log('📋 Total needs now:', demoNeeds.length);
      
      return {
        success: true,
        need: newNeed,
        message: 'Need posted successfully!'
      };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/needs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(needData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create need error:', error);
      return { success: false, message: error.message };
    }
  },

  getById: async (needId) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Getting need by ID', needId);
      await new Promise(resolve => setTimeout(resolve, 500));
      const need = demoNeeds.find(n => n.id === needId);
      return {
        success: !!need,
        need: need || null,
        message: need ? '' : 'Need not found'
      };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/needs/${needId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get need by ID error:', error);
      return { success: false, message: error.message };
    }
  },

  update: async (needId, needData) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Updating need', needId, needData);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const needIndex = demoNeeds.findIndex(n => n.id === needId);
      if (needIndex !== -1) {
        demoNeeds[needIndex] = { ...demoNeeds[needIndex], ...needData };
      }
      
      return {
        success: true,
        message: 'Need updated successfully'
      };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/needs/${needId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(needData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update need error:', error);
      return { success: false, message: error.message };
    }
  },

  delete: async (needId) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Deleting need', needId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      demoNeeds = demoNeeds.filter(n => n.id !== needId);
      
      return {
        success: true,
        message: 'Need deleted successfully'
      };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/needs/${needId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete need error:', error);
      return { success: false, message: error.message };
    }
  },
};
