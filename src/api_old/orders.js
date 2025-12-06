import API_URL from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const ordersAPI = {
  // Create order
  create: async (orderData) => {
    try {
      console.log('📤 Creating order:', orderData);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('✅ Create order response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Create order error:', error);
      return { success: false, message: error.message };
    }
  },

  // Get my orders
  getMyOrders: async (role = null, status = null) => {
    try {
      console.log('📥 Fetching my orders, role:', role, 'status:', status);
      
      const headers = await getAuthHeader();
      let url = `${API_URL}/orders/my-orders`;
      const params = [];
      if (role) params.push(`role=${role}`);
      if (status) params.push(`status=${status}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      console.log('✅ My orders response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Get my orders error:', error);
      return { success: false, message: error.message, orders: [], stats: {} };
    }
  },

  // Get order by ID
  getById: async (orderId) => {
    try {
      console.log('📥 Fetching order:', orderId);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      console.log('✅ Order details response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Get order error:', error);
      return { success: false, message: error.message };
    }
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    try {
      console.log('🔄 Updating order status:', orderId, status);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      console.log('✅ Update status response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Update status error:', error);
      return { success: false, message: error.message };
    }
  },

  // Update delivery (seller)
  updateDelivery: async (orderId, deliveryNotes, deliveryProofUrl = null) => {
    try {
      console.log('📦 Updating delivery:', orderId);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/orders/${orderId}/delivery`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ deliveryNotes, deliveryProofUrl })
      });

      const data = await response.json();
      console.log('✅ Update delivery response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Update delivery error:', error);
      return { success: false, message: error.message };
    }
  },

  // Complete order (buyer confirms)
  complete: async (orderId) => {
    try {
      console.log('✅ Completing order:', orderId);
      
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/orders/${orderId}/complete`, {
        method: 'PUT',
        headers
      });

      const data = await response.json();
      console.log('✅ Complete order response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Complete order error:', error);
      return { success: false, message: error.message };
    }
  }
};
