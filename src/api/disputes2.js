import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../config/app';

const API_URL = AppConfig.API_URL;

// In-memory storage for demo
let demoDisputes = [];

export const disputesAPI = {
  create: async (disputeData) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Creating dispute', disputeData);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : {};
      
      const newDispute = {
        id: `dispute-${Date.now()}`,
        ...disputeData,
        buyerId: user.id,
        buyerName: user.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
        resolvedAt: null,
        resolution: null
      };
      
      demoDisputes.push(newDispute);
      
      // Update order status to dispute_pending
      const { ordersAPI } = require('./orders2');
      await ordersAPI.updateStatus(disputeData.orderId, 'dispute_pending', 'Dispute raised by buyer');
      
      console.log('✅ Dispute created:', newDispute.id);
      return { success: true, dispute: newDispute, message: 'Dispute submitted successfully' };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/disputes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(disputeData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create dispute error:', error);
      return { success: false, message: error.message };
    }
  },

  getByOrderId: async (orderId) => {
    if (AppConfig.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const disputes = demoDisputes.filter(d => d.orderId === orderId);
      return { success: true, disputes };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/disputes/order/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};
