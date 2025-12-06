import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../config/app';
import { getWorkflowForCategory } from '../config/workflows';

const API_URL = AppConfig.API_URL;

// In-memory storage for demo mode
let demoOrders = [];

export const ordersAPI = {
  create: async (orderData) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Creating order', orderData);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : { 
        id: 'buyer-1',
        name: 'Demo Buyer',
        email: 'demo-buyer@example.com'
      };
      
      // Import offers and needs APIs to get full data
      const { offersAPI } = require('./offers2');
      const { needsAPI } = require('./needs2');
      
      // Get the offer details
      const offerResponse = await offersAPI.getById(orderData.offerId);
      const offer = offerResponse.offer;
      
      if (!offer) {
        return { success: false, message: 'Offer not found' };
      }
      
      // Get the need details
      const needResponse = await needsAPI.getById(offer.needId);
      const need = needResponse.need;
      
      // ✅ Get workflow type from need category
      const workflowType = getWorkflowForCategory(need?.category || 'Other');
      
      // ✅ Ensure we have a valid amount
      const orderAmount = offer.price || 0;
      const platformFeeAmount = orderAmount * 0.05;
      
      const newOrder = {
        id: `order-${Date.now()}`,
        ...orderData,
        // ✅ Store complete order info
        needId: offer.needId,
        needTitle: need?.title || 'Unknown Need',
        needCategory: need?.category || 'Other',
        offerId: offer.id,
        amount: orderAmount,
        sellerId: offer.sellerId,
        sellerName: offer.sellerName,
        sellerEmail: offer.sellerEmail,
        buyerId: user.id,
        buyerName: user.name,
        buyerEmail: user.email,
        status: 'payment_held',
        workflowType: workflowType,
        platformFee: platformFeeAmount,
        sellerEarnings: orderAmount - platformFeeAmount,
        createdAt: new Date().toISOString(),
        deliveredAt: null,
        statusHistory: [
          {
            status: 'payment_held',
            timestamp: new Date().toISOString(),
            note: 'Payment received and held in escrow'
          }
        ]
      };
      
      demoOrders.push(newOrder);
      
      // ✅ Update the need status to 'in_progress' and link the order
      await needsAPI.update(offer.needId, { 
        status: 'in_progress',
        orderId: newOrder.id 
      });

      // ✅ Update the offer with orderId so seller can navigate to order tracking
      const { demoOffers } = require('./offers2');
      const offerIndex = demoOffers.findIndex(o => o.id === orderData.offerId);
      if (offerIndex !== -1) {
        demoOffers[offerIndex].orderId = newOrder.id;
        
        // If this is a counter offer, also update the original offer
        const acceptedOffer = demoOffers[offerIndex];
        if (acceptedOffer.originalOfferId) {
          const originalIndex = demoOffers.findIndex(o => o.id === acceptedOffer.originalOfferId);
          if (originalIndex !== -1) {
            demoOffers[originalIndex].orderId = newOrder.id;
          }
        }
        
        console.log('✅ Offer updated with orderId:', newOrder.id);
      }
      
      console.log('✅ Order created with workflow:', workflowType);
      console.log('✅ Amount:', orderAmount, 'Platform Fee:', platformFeeAmount);
      console.log('✅ Need status updated to in_progress');
      
      return { 
        success: true, 
        order: newOrder, 
        message: 'Order created successfully!' 
      };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      return { success: false, message: error.message };
    }
  },

  getById: async (orderId) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Getting order', orderId);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const order = demoOrders.find(o => o.id === orderId);
      return {
        success: !!order,
        order: order || null,
        message: order ? '' : 'Order not found'
      };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error('Get order error:', error);
      return { success: false, message: error.message };
    }
  },

  getMyOrders: async (userType = 'buyer') => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Getting my orders as', userType);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : {};
      
      const orders = userType === 'buyer'
        ? demoOrders.filter(o => o.buyerId === user.id)
        : demoOrders.filter(o => o.sellerId === user.id);
      
      console.log(`📦 Found ${orders.length} orders for ${userType}`);
      
      return { success: true, orders: orders };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const endpoint = userType === 'buyer' ? '/orders/my/buyer' : '/orders/my/seller';
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error('Get my orders error:', error);
      return { success: false, message: error.message };
    }
  },

  updateStatus: async (orderId, newStatus, note = '') => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Updating order status', { orderId, newStatus, note });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const orderIndex = demoOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        const order = demoOrders[orderIndex];
        
        // Update order status
        demoOrders[orderIndex].status = newStatus;
        demoOrders[orderIndex].statusHistory = [
          ...(demoOrders[orderIndex].statusHistory || []),
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note
          }
        ];
        
        // ✅ If status is delivered, record the timestamp
        if (newStatus === 'delivered') {
          demoOrders[orderIndex].deliveredAt = new Date().toISOString();
        }
        
        // ✅ Also update the need status
        const { needsAPI } = require('./needs2');
        const needStatus = newStatus === 'delivered' ? 'delivered' : 
                          newStatus === 'dispute_pending' ? 'dispute_pending' :
                          'in_progress';
        
        await needsAPI.update(order.needId, { status: needStatus });
        
        console.log('✅ Order status updated to:', newStatus);
        console.log('✅ Need status synced to:', needStatus);
        
        return { success: true, message: 'Status updated successfully!' };
      }
      
      return { success: false, message: 'Order not found' };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, note }),
      });
      return await response.json();
    } catch (error) {
      console.error('Update order status error:', error);
      return { success: false, message: error.message };
    }
  },

  confirmDelivery: async (orderId) => {
    if (AppConfig.USE_MOCK_DATA) {
      console.log('🎭 MOCK: Confirming delivery', orderId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const orderIndex = demoOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        const order = demoOrders[orderIndex];
        
        demoOrders[orderIndex].status = 'completed';
        demoOrders[orderIndex].completedAt = new Date().toISOString();
        
        // Update need to completed
        const { needsAPI } = require('./needs2');
        await needsAPI.update(order.needId, { status: 'completed' });
        
        console.log('✅ Delivery confirmed, order completed');
        return { success: true, message: 'Order completed!' };
      }
      
      return { success: false, message: 'Order not found' };
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error('Confirm delivery error:', error);
      return { success: false, message: error.message };
    }
  },
};
