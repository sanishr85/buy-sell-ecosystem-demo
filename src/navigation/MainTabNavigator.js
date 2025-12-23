import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

// Buy Tab Screens
import PostNeedScreen from '../screens/PostNeedScreen';
import MyNeedsScreen from '../screens/MyNeedsScreen';
import ViewOffersScreen from '../screens/ViewOffersScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import PaymentScreen from '../screens/buyer/PaymentScreen';
import PaymentSuccessScreen from '../screens/buyer/PaymentSuccessScreen';
import BuyerOrderTrackingScreen from '../screens/BuyerOrderTrackingScreen';
import RateSellerScreen from '../screens/RateSellerScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Sell Tab Screens
import NeedsFeedScreen from '../screens/seller/NeedsFeedScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';
import SellerOrderTrackingScreen from '../screens/seller/SellerOrderTrackingScreen';
import NeedDetailScreen from '../screens/NeedDetailScreen';
import CreateOfferScreen from '../screens/seller/CreateOfferScreen';
import MyOffersScreen from '../screens/MyOffersScreen';
import DeliveryInitiationScreen from '../screens/DeliveryInitiationScreen';
import OfferDetailsScreen from '../screens/OfferDetailsScreen';
import RateBuyerScreen from '../screens/RateBuyerScreen';

// Shared Screens
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';

const Tab = createBottomTabNavigator();
const BuyStack = createNativeStackNavigator();
const SellStack = createNativeStackNavigator();

function BuyStackNavigator() {
  return (
    <BuyStack.Navigator screenOptions={{ headerShown: false }}>
      <BuyStack.Screen name="PostNeed" component={PostNeedScreen} />
      <BuyStack.Screen name="MyNeeds" component={MyNeedsScreen} />
      <BuyStack.Screen name="ViewOffers" component={ViewOffersScreen} />
      <BuyStack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <BuyStack.Screen name="Payment" component={PaymentScreen} />
      <BuyStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <BuyStack.Screen name="BuyerOrderTracking" component={BuyerOrderTrackingScreen} />
      <BuyStack.Screen name="RateSeller" component={RateSellerScreen} />
      <BuyStack.Screen name="ChatList" component={ChatListScreen} />
      <BuyStack.Screen name="Chat" component={ChatScreen} />
      <BuyStack.Screen name="Notifications" component={NotificationsScreen} />
      <BuyStack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <BuyStack.Screen name="Profile" component={ProfileScreen} />
    </BuyStack.Navigator>
  );
}

function SellStackNavigator() {
  return (
    <SellStack.Navigator screenOptions={{ headerShown: false }}>
      <SellStack.Screen name="NeedsFeed" component={NeedsFeedScreen} />
      <SellStack.Screen name="SellerOrderTracking" component={SellerOrderTrackingScreen} options={{ title: 'Order Details' }} />
      <SellStack.Screen name="SellerOrders" component={SellerOrdersScreen} />
      <SellStack.Screen name="NeedDetail" component={NeedDetailScreen} />
      <SellStack.Screen name="CreateOffer" component={CreateOfferScreen} />
      <SellStack.Screen name="MyOffers" component={MyOffersScreen} />
      <SellStack.Screen name="OfferDetails" component={OfferDetailsScreen} />
      <SellStack.Screen name="DeliveryInitiation" component={DeliveryInitiationScreen} />
      <SellStack.Screen name="RateBuyer" component={RateBuyerScreen} />
      <SellStack.Screen name="ChatList" component={ChatListScreen} />
      <SellStack.Screen name="Chat" component={ChatScreen} />
      <SellStack.Screen name="Notifications" component={NotificationsScreen} />
      <SellStack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <SellStack.Screen name="Profile" component={ProfileScreen} />
    </SellStack.Navigator>
  );
}

const CustomTabButton = ({ focused, icon, label, color }) => (
  <View style={[styles.tabButton, focused && { backgroundColor: color + '15' }]}>
    <View style={[styles.iconCircle, focused && { backgroundColor: color, borderColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <Text style={[styles.tabLabel, { color: focused ? color : colors.textSecondary }]}>{label}</Text>
  </View>
);

export default function MainTabNavigator() {
  const navigation = useNavigation();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserType();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 MainTabNavigator focused, reloading user type...');
      loadUserType();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserType = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        console.log('👤 User data loaded in MainTabNavigator:', {
          email: userData.email,
          name: userData.name,
          isBuyer: userData.isBuyer,
          isSeller: userData.isSeller
        });
        setUserType({
          isBuyer: userData.isBuyer || false,
          isSeller: userData.isSeller || false,
        });
      }
    } catch (error) {
      console.error('❌ Error loading user type:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const showBuyTab = userType?.isBuyer === true;
  const showSellTab = userType?.isSeller === true;

  console.log('🔍 Tab visibility check:', { showBuyTab, showSellTab, userType });

  if (!showBuyTab && !showSellTab) {
    console.warn('⚠️ User has no buyer or seller flag set, defaulting to buyer');
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen 
          name="BuyTab" 
          component={BuyStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabButton focused={focused} icon="🛒" label="Buy" color="#6366f1" />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {showBuyTab && (
        <Tab.Screen 
          name="BuyTab" 
          component={BuyStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabButton focused={focused} icon="🛒" label="Buy" color="#6366f1" />
            ),
          }}
        />
      )}
      
      {showSellTab && (
        <Tab.Screen 
          name="SellTab" 
          component={SellStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabButton focused={focused} icon="💰" label="Sell" color="#10b981" />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  tabBar: { height: 90, paddingTop: 10, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 24, borderRadius: 16, minWidth: 140 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 2, borderColor: 'transparent' },
  icon: { fontSize: 28 },
  tabLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
});
