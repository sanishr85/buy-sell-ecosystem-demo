import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

// Buy Tab Screens
import PostNeedScreen from '../screens/PostNeedScreen';
import MyNeedsScreen from '../screens/MyNeedsScreen';
import ViewOffersScreen from '../screens/ViewOffersScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import BuyerOrderTrackingScreen from '../screens/BuyerOrderTrackingScreen';
import RateSellerScreen from '../screens/RateSellerScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Sell Tab Screens
import NeedsFeedScreen from '../screens/NeedsFeedScreen';
import NeedDetailScreen from '../screens/NeedDetailScreen';
import CreateOfferScreen from '../screens/CreateOfferScreen';
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
      <Tab.Screen 
        name="SellTab" 
        component={SellStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabButton focused={focused} icon="💰" label="Sell" color="#10b981" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: { height: 90, paddingTop: 10, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 24, borderRadius: 16, minWidth: 140 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 2, borderColor: 'transparent' },
  icon: { fontSize: 28 },
  tabLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
});
