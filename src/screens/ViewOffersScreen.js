import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { offersAPI } from '../api/offers2';
import { needsAPI } from '../api/needs2';
import CounterOfferModal from './CounterOfferModal';

export default function ViewOffersScreen({ route, navigation }) {
  const { needId, need: initialNeed } = route.params;
  const [need, setNeed] = useState(initialNeed);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      // Load both need and offers
      const [needResponse, offersResponse] = await Promise.all([
        needsAPI.getById(needId),
        offersAPI.getByNeed(needId)
      ]);

      if (needResponse.success) {
        setNeed(needResponse.need);
      }

      if (offersResponse.success) {
        setOffers(offersResponse.offers || []);
      }
    } catch (error) {
      console.error('❌ Load data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAcceptOffer = async (offerId) => {
    Alert.alert(
      'Accept Offer',
      'Are you sure you want to accept this offer? This will decline all other offers.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const response = await offersAPI.accept(offerId);
              
              if (response.success) {
                Alert.alert('Success', 'Offer accepted! Proceeding to payment...', [
                  {
                    text: 'OK',
                    onPress: () => {
                      loadData();
                      navigation.navigate('PaymentMethod', { offerId });
                    }
                  }
                ]);
              } else {
                Alert.alert('Error', response.message || 'Failed to accept offer');
              }
            } catch (error) {
              console.error('❌ Accept offer error:', error);
              Alert.alert('Error', 'Failed to accept offer');
            }
          }
        }
      ]
    );
  };

  const handleDeclineOffer = async (offerId) => {
    Alert.alert(
      'Decline Offer',
      'Are you sure you want to decline this offer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await offersAPI.decline(offerId);
              
              if (response.success) {
                Alert.alert('Success', 'Offer declined');
                loadData();
              } else {
                Alert.alert('Error', response.message || 'Failed to decline offer');
              }
            } catch (error) {
              console.error('❌ Decline offer error:', error);
              Alert.alert('Error', 'Failed to decline offer');
            }
          }
        }
      ]
    );
  };

  const handleCounterOffer = (offer) => {
    setSelectedOffer(offer);
    setShowCounterModal(true);
  };

  const handleSubmitCounterOffer = async ({ amount, message }) => {
    try {
      const response = await offersAPI.counter(selectedOffer.id, amount, message);
      
      if (response.success) {
        Alert.alert('Success', 'Counter offer sent to seller!');
        loadData();
      } else {
        Alert.alert('Error', response.message || 'Failed to send counter offer');
      }
    } catch (error) {
      console.error('Submit counter offer error:', error);
      Alert.alert('Error', 'Failed to send counter offer');
    }
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

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

  const getNeedStatusDisplay = () => {
    const statusMap = {
      'open': { label: 'Active', color: colors.success },
      'in_progress': { label: 'In Progress', color: colors.warning },
      'delivered': { label: 'Delivered', color: colors.primary },
      'completed': { label: 'Completed', color: colors.success },
      'cancelled': { label: 'Cancelled', color: colors.error },
    };
    return statusMap[need?.status] || { label: 'Active', color: colors.success };
  };

  const statusConfig = {
    pending: { label: 'Pending', color: '#f59e0b', bgColor: '#fef3c7', emoji: '⏳' },
    accepted: { label: 'Accepted', color: '#10b981', bgColor: '#d1fae5', emoji: '✅' },
    declined: { label: 'Declined', color: '#ef4444', bgColor: '#fee2e2', emoji: '❌' },
  };

  const pendingCount = offers.filter(o => o.status === 'pending').length;
  const needStatus = getNeedStatusDisplay();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Offers Received</Text>
          <Text style={styles.subtitle}>{pendingCount} pending offers</Text>
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={() => Alert.alert('Coming Soon', 'Chat feature coming soon!')}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.needSummary}>
        <Text style={styles.needTitle}>Your Need</Text>
        {need?.budgetMin && need?.budgetMax && (
          <Text style={styles.needBudget}>Your Budget: ${need.budgetMin} - ${need.budgetMax}</Text>
        )}
        <Text style={styles.needStatus}>
          Status: <Text style={{ color: needStatus.color }}>● {needStatus.label}</Text>
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading offers...</Text>
        </View>
      ) : offers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No offers yet</Text>
          <Text style={styles.emptyText}>
            Sellers will submit offers soon. Check back later!
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.offersList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {offers.map((offer) => {
            const config = statusConfig[offer.status] || statusConfig.pending;
            const isPending = offer.status === 'pending';
            
            return (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.sellerSection}>
                  <View style={styles.sellerAvatar}>
                    <Text style={styles.sellerAvatarText}>
                      {offer.sellerName?.substring(0, 2).toUpperCase() || 'SE'}
                    </Text>
                  </View>
                  <View style={styles.sellerInfo}>
                    <Text style={styles.sellerName}>{offer.sellerName || 'Seller'}</Text>
                    {offer.sellerRating && (
                      <Text style={styles.sellerRating}>
                        ⭐ {offer.sellerRating.average?.toFixed(1) || '0.0'} ({offer.sellerRating.total || 0} reviews)
                      </Text>
                    )}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
                    <Text style={[styles.statusText, { color: config.color }]}>
                      {config.emoji} {config.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.offerDetails}>
                  <View style={styles.offerDetailRow}>
                    <Text style={styles.offerDetailLabel}>Offer Amount:</Text>
                    <Text style={styles.offerAmount}>{formatCurrency(offer.amount || offer.price)}</Text>
                  </View>
                  <View style={styles.offerDetailRow}>
                    <Text style={styles.offerDetailLabel}>Delivery Time:</Text>
                    <Text style={styles.offerDetailValue}>
                      {offer.deliveryTime || offer.estimatedDeliveryDays || 'Not specified'}
                    </Text>
                  </View>
                </View>

                {offer.description && (
                  <View style={styles.messageSection}>
                    <Text style={styles.messageLabel}>Message:</Text>
                    <Text style={styles.messageText}>{offer.description}</Text>
                  </View>
                )}

                <Text style={styles.offerTime}>{getTimeAgo(offer.createdAt)}</Text>

                {isPending && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => handleAcceptOffer(offer.id)}
                    >
                      <Text style={styles.acceptButtonText}>✓ Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.counterButton]}
                      onPress={() => handleCounterOffer(offer)}
                    >
                      <Text style={styles.counterButtonText}>↔️ Counter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.declineButton]}
                      onPress={() => handleDeclineOffer(offer.id)}
                    >
                      <Text style={styles.declineButtonText}>✕ Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Payment button for accepted counter offers */}
                {offer.status === 'accepted' && offer.isCounterOffer && !['delivered', 'completed'].includes(need?.status) && (
                  <TouchableOpacity
                    style={styles.proceedPaymentButton}
                    onPress={() => navigation.navigate('PaymentMethod', { offer, need })}
                  >
                    <Text style={styles.proceedPaymentText}>💳 Proceed to Payment</Text>
                  </TouchableOpacity>
                )}

                {/* Delivered order actions */}
                {need?.status === 'delivered' && (
                  <View style={styles.deliveredActions}>
                    <Text style={styles.deliveredTitle}>✅ Service Delivered</Text>
                    <View style={styles.disputeNotice}>
                      <Text style={styles.disputeNoticeText}>⏰ Raise dispute within 48 hours</Text>
                      <Text style={styles.disputeNoticeSubtext}>💰 Payment will be automatically released to seller after dispute window closes</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.rateSellerButton}
                      onPress={() => Alert.alert('Rate Seller', 'Rating feature coming soon!')}
                    >
                      <Text style={styles.rateSellerText}>⭐ Rate Seller</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.raiseDisputeButton}
                      onPress={() => Alert.alert('Raise Dispute', 'Dispute feature coming soon!')}
                    >
                      <Text style={styles.raiseDisputeText}>⚠️ Raise Dispute</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      <CounterOfferModal
        visible={showCounterModal}
        onClose={() => setShowCounterModal(false)}
        originalOffer={selectedOffer}
        onSubmit={handleSubmitCounterOffer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 24, color: colors.text },
  headerContent: { flex: 1, marginLeft: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  chatButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  chatIcon: { fontSize: 20 },
  needSummary: { backgroundColor: colors.white, padding: 16, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  needTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  needBudget: { fontSize: 14, color: colors.success, fontWeight: '600', marginBottom: 4 },
  needStatus: { fontSize: 14, color: colors.textSecondary },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  offersList: { flex: 1 },
  offerCard: { backgroundColor: colors.white, margin: 16, marginBottom: 8, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  sellerSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sellerAvatarText: { fontSize: 16, fontWeight: 'bold', color: colors.white },
  sellerInfo: { flex: 1, marginLeft: 12 },
  sellerName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  sellerRating: { fontSize: 13, color: colors.textSecondary },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  offerDetails: { marginBottom: 16 },
  offerDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  offerDetailLabel: { fontSize: 14, color: colors.textSecondary },
  offerAmount: { fontSize: 18, fontWeight: '700', color: colors.success },
  offerDetailValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  messageSection: { marginBottom: 16 },
  messageLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  messageText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  offerTime: { fontSize: 12, color: colors.textLight, marginBottom: 16 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  acceptButton: { backgroundColor: colors.success },
  acceptButtonText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  counterButton: { backgroundColor: colors.primary },
  counterButtonText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  declineButton: { backgroundColor: colors.backgroundSecondary, borderWidth: 1, borderColor: colors.border },
  declineButtonText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  proceedPaymentButton: { backgroundColor: colors.success, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  proceedPaymentText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  deliveredActions: { marginTop: 20, padding: 16, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  deliveredTitle: { fontSize: 18, fontWeight: '700', color: colors.success, marginBottom: 16, textAlign: 'center' },
  disputeNotice: { backgroundColor: '#FFF4E6', padding: 12, borderRadius: 8, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  disputeNoticeText: { fontSize: 14, fontWeight: '600', color: '#92400E', marginBottom: 4 },
  disputeNoticeSubtext: { fontSize: 13, color: '#78350F' },
  rateSellerButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  rateSellerText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  raiseDisputeButton: { backgroundColor: colors.white, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.error },
  raiseDisputeText: { color: colors.error, fontSize: 16, fontWeight: '700' },
});
