/**
 * App Configuration - DEMO VERSION
 * This version ALWAYS uses mock data
 */

export const AppConfig = {
  USE_MOCK_DATA: true,  // ✅ DEMO: Always use mock data
  
  API_URL: 'https://demo.example.com/api',
  
  FEATURES: {
    REAL_TIME_CHAT: false,
    PUSH_NOTIFICATIONS: false,
    STRIPE_PAYMENTS: false,
    IMAGE_UPLOADS: false,
  },
  
  VERSION: '1.0.0-DEMO',
  IS_DEV: __DEV__,
  IS_DEMO: true,
};

export const useMockData = () => true;
export const getApiUrl = () => AppConfig.API_URL;
