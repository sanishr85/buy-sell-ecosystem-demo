import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { offersAPI } from '../api/offers';

export default function ViewOffersScreen({ route, navigation }) {
  const { need, needId } = route.params;
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load offers when screen mounts
  useEffect(() => {
    loadOffers();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadOffers();
    });
    return unsubscribe;
  }, [navigation]);

  const loadOffers = async () => {
    try {
      console.log('📋 Loading offers for need:', needId || need?.id);
      
      // Get auth token
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to view offers');
        navigation.navigate('Login');
        return;
      }

      // Call backend API
      const response = await offersAPI.getByNeed(token, needId || need?.id);
      
      console.log('✅ Offers loaded:', response);

      if (response.success) {
        setOffers(response.offers || []);
      } else {
        Alert.alert('Error', response.message || 'Failed to load offers');
      }
    } catch (error) {
      console.error('❌ Load offers error:', error);
      Alert.alert('Error', 'Unable to load offers. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOffers();
  };

  const handleAcceptOffer = (offer) => {
    Alert.alert(
      'Accept Offer?',
      `Accept ${offer.seller.name}'s offer for $${offer.amount}?\n\nPayment will be held in escrow until service completion.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Pay',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              
              // Call accept API
              const response = await offersAPI.accept(token, offer.id);
              
              if (response.success) {
                Alert.alert(
                  'Offer Accepted! 🎉',
                  `${offer.seller.name}'s offer has been accepted. The need is now closed and other offers have been declined.`,
                  [
                    {
                      text: 'Continue to Payment',
                      onPress: () => navigation.navigate('PaymentMethod', { offer, need })
                    }
                  ]
                );
                // Reload offers to show updated status
                loadOffers();
              } else {
                Alert.alert('Error', response.message || 'Failed to accept offer');
              }
            } catch (error) {
              Alert.alert('Error', 'Unable to accept offer. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeclineOffer = (offer) => {
    Alert.alert(
      'Decline Offer?',
      `Are you sure you want to decline ${offer.seller.name}'s offer for $${offer.amount}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              
              // Call decline API
              const response = await offersAPI.decline(token, offer.id);
              
              if (response.success) {
                Alert.alert('Offer Declined', `${offer.seller.name}'s offer has been declined.`);
                // Reload offers to show updated list
                loadOffers();
              } else {
                Alert.alert('Error', response.message || 'Failed to decline offer');
              }
            } catch (error) {
              Alert.alert('Error', 'Unable to decline offer. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleMessageSeller = (offer) => {
    const chat = {
      id: offer.id,
      otherUser: {
        name: offer.seller.name,
        avatar: offer.seller.avatar || offer.seller.name.charAt(0),
        role: 'seller',
      },
      lastMessage: {
        text: offer.description,
        time: offer.createdAt,
        unread: false,
      },
      orderId: offer.id,
      orderTitle: need?.title || 'Order',
    };
    navigation.navigate('Chat', { chat });
  };

  const handleViewSellerProfile = (offer) => {
    Alert.alert(
      'Seller Profile',
      `${offer.seller.name}\n\nRating: ${offer.seller.rating.average} ⭐ (${offer.seller.rating.total} reviews)\n\nThis feature will show full seller profile in a future update.`
    );
  };

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  // Filter only pending offers
  const pendingOffers = offers.filter(o => o.status === 'pending');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Offers Received</Text>
          <Text style={styles.headerSubtitle}>
            {loading ? 'Loading...' : `${pendingOffers.length} pending offers`}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.chatListButton}
          onPress={() => navigation.navigate('ChatList')}
        >
          <Text style={styles.chatListIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading offers...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.needSummary}>
            <Text style={styles.needTitle}>{need?.title || 'Your Need'}</Text>
            {need?.budgetMin && need?.budgetMax && (
              <Text style={styles.needBudget}>
                Your Budget: ${need.budgetMin} - ${need.budgetMax}
              </Text>
            )}
            {need?.status && (
              <Text style={styles.needStatus}>
                Status: {need.status === 'active' ? '🟢 Active' : '🔒 Closed'}
              </Text>
            )}
          </View>

          {pendingOffers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyTitle}>No pending offers</Text>
              <Text style={styles.emptyText}>
                {offers.length > 0 
                  ? 'All offers have been accepted or declined.' 
                  : 'Sellers will start making offers soon. Check back later!'}
              </Text>
            </View>
          ) : (
            <View style={styles.offersContainer}>
              {pendingOffers.map((offer) => (
                <View key={offer.id} style={styles.offerCard}>
                  <View style={styles.sellerHeader}>
                    <View style={styles.sellerAvatar}>
                      <Text style={styles.sellerAvatarText}>
                        {offer.seller.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.sellerInfo}>
                      <Text style={styles.sellerName}>{offer.seller.name}</Text>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>
                          ⭐ {offer.seller.rating.average || 0}
                        </Text>
                        <Text style={styles.ratingCount}>
                          ({offer.seller.rating.total || 0} reviews)
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.viewProfileButton}
                      onPress={() => handleViewSellerProfile(offer)}
                    >
                      <Text style={styles.viewProfileText}>View</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.offerDetails}>
                    <View style={styles.offerAmount}>
                      <Text style={styles.amountLabel}>Offer Amount</Text>
                      <Text style={styles.amountValue}>${offer.amount}</Text>
                    </View>
                    {offer.deliveryTime && (
                      <View style={styles.deliveryTime}>
                        <Text style={styles.deliveryLabel}>⏱️ Completion Time</Text>
                        <Text style={styles.deliveryValue}>{offer.deliveryTime}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.offerDescription}>{offer.description}</Text>

                  <View style={styles.offerFooter}>
                    <Text style={styles.postedTime}>
                      Posted {getTimeAgo(offer.createdAt)}
                    </Text>
                    <TouchableOpacity 
                      style={styles.messageButton}
                      onPress={() => handleMessageSeller(offer)}
                    >
                      <Text style={styles.messageButtonText}>💬 Message</Text>
                    </TouchableOpacity>
                  </View>

                  {offer.canAccept && offer.canDecline && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.declineButton}
                        onPress={() => handleDeclineOffer(offer)}
                      >
                        <Text style={styles.declineButtonText}>✕ Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.acceptButton}
                        onPress={() => handleAcceptOffer(offer)}
                      >
                        <Text style={styles.acceptButtonText}>✓ Accept Offer</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { marginRight: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 24, color: colors.text },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary },
  chatListButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  chatListIcon: { fontSize: 20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  content: { flex: 1 },
  needSummary: { backgroundColor: colors.white, padding: 20, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  needTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  needBudget: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  needStatus: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  offersContainer: { paddingHorizontal: 20 },
  offerCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  sellerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sellerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  sellerAvatarText: { fontSize: 20, fontWeight: '700', color: colors.white },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, fontWeight: '600', color: colors.text, marginRight: 6 },
  ratingCount: { fontSize: 13, color: colors.textSecondary },
  viewProfileButton: { backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  viewProfileText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  offerDetails: { flexDirection: 'row', backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 12, marginBottom: 16 },
  offerAmount: { flex: 1, paddingRight: 12, borderRightWidth: 1, borderRightColor: colors.border },
  amountLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  amountValue: { fontSize: 22, fontWeight: '700', color: colors.success },
  deliveryTime: { flex: 1, paddingLeft: 12 },
  deliveryLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  deliveryValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  offerDescription: { fontSize: 15, color: colors.text, lineHeight: 22, marginBottom: 16 },
  offerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 16 },
  postedTime: { fontSize: 13, color: colors.textSecondary },
  messageButton: { backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  messageButtonText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  actionButtons: { flexDirection: 'row', gap: 12 },
  declineButton: { flex: 1, backgroundColor: '#fee2e2', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' },
  declineButtonText: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
  acceptButton: { flex: 1, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  acceptButtonText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
