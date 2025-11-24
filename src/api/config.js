import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get the correct API URL based on where the app is running
const getApiUrl = () => {
  // Check if running in Expo Go
  const { manifest } = Constants;
  
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'ios') {
      // iOS Simulator - use localhost
      return 'http://localhost:5001/api';
    } else if (Platform.OS === 'android') {
      // Android Emulator - use special IP
      return 'http://10.0.2.2:5001/api';
    } else {
      // Web browser
      return 'http://localhost:5001/api';
    }
  }
  
  // Production - you'll add your production URL later
  return 'https://your-production-api.com/api';
};

const API_URL = getApiUrl();

export default API_URL;
