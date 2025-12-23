import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CounterOfferModal from './CounterOfferModal';
import { colors } from '../theme/colors';
import { formatINR } from '../utils/fees';
import { offersAPI } from '../api/offers2';
import { needsAPI } from '../api/needs2';

export default function ViewOffersScreen({ route, navigation }) {
  const { needId } = route.params;
  const [need, setNeed] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    loadData();
  }, [needId]);

  const loadData = async () => {
    try {
      const needResponse = await needsAPI.getById(needId);
      if (needResponse.success) {
        setNeed(needResponse.need);
      }

      const offersResponse = await offersAPI.getByNeedId(needId);
      if (offersResponse.success) {
        // Sort: accepted first, then pending seller offers, then counter offers
        const sorted = (offersResponse.offers || []).sort((a, b) => {
          // Accepted offers first
          if (a.status === 'accepted' && b.status !== 'accepted') return -1;
          if (a.status !== 'accepted' && b.status === 'accepted') return 1;
          
          // Then original seller offers
          if (!a.isCounterOffer && b.isCounterOffer) return -1;
          if (a.isCounterOffer && !b.isCounterOffer) return 1;
          
          // Then by date
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setOffers(sorted);
      }
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAcceptOffer = async (offer) => {
    Alert.alert(
      'Accept Offer?',
      `Accept ${offer.sellerName}'s offer for ${formatINR(offer.price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            await offersAPI.accept(offer.id);
            navigation.navigate('Payment', { offer, need });
          }
        }
      ]
    );
  };

  const handleDeclineOffer = async (offer) => {
    Alert.alert(
      'Decline Offer?',
      'The seller will be notified.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            await offersAPI.decline(offer.id);
            loadData();
          }
        }
      ]
    );
  };

  const handleCounterOffer = (offer) => {
    setSelectedOffer(offer);
    setShowCounterModal(true);
  };

  const handleSubmitCounter = async ({ amount, message }) => {
    await offersAPI.counter(selectedOffer.id, amount, message);
    Alert.alert('Success', 'Counter offer sent to seller');
    setShowCounterModal(false);
    loadData();
  };

  const handlePayNow = (offer) => {
    navigation.navigate('Payment', { offer, need });
  };

  const handleRateSeller = () => {
    Alert.alert('Coming Soon', 'Rating feature will be available soon!');
  };

  const handleRaiseDispute = () => {
    Alert.alert('Coming Soon', 'Dispute resolution will be available soon!');
  };

  const getOfferStatusInfo = (offer) => {
    // Don't show Pay Now if need is already delivered or in_progress
    const needIsActive = need?.status !== 'delivered' && need?.status !== 'in_progress';
    const notPaidYet = !offer.orderId;
    
    // Buyer's counter offer that was ACCEPTED by seller - needs payment
    if (offer.isCounterOffer && offer.status === 'accepted' && needIsActive && notPaidYet) {
      return {
        badge: '✓ Accepted',
        badgeColor: colors.success,
        showActions: false,
        showCounterSent: false,
        showPayNow: true,
        isAccepted: true
      };
    }

    // Counter offer accepted but already paid (has orderId or need in progress)
    if (offer.isCounterOffer && offer.status === 'accepted' && (!needIsActive || offer.orderId)) {
      return {
        badge: '✓ Paid',
        badgeColor: colors.primary,
        showActions: false,
        showCounterSent: false,
        showPayNow: false,
        isAccepted: true
      };
    }

    // Buyer's counter offer waiting for seller response
    if (offer.isCounterOffer && offer.status === 'pending') {
      return {
        badge: '🔄 Counter Sent',
        badgeColor: colors.warning,
        showActions: false,
        showCounterSent: true,
        showPayNow: false
      };
    }
    
    // Original offer that was countered
    if (offer.status === 'countered') {
      return {
        badge: '🔄 Countered',
        badgeColor: colors.textSecondary,
        showActions: false,
        showCounterSent: false,
        showPayNow: false
      };
    }
    
    // Regular accepted seller offer (already has orderId or in progress)
    if ((offer.status === 'accepted' || need?.acceptedOfferId === offer.id) && (!needIsActive || offer.orderId)) {
      return {
        badge: '✓ Paid',
        badgeColor: colors.primary,
        showActions: false,
        showCounterSent: false,
        showPayNow: false,
        isAccepted: true
      };
    }
    
    // Regular accepted seller offer (not yet paid)
    if ((offer.status === 'accepted' || need?.acceptedOfferId === offer.id) && needIsActive && notPaidYet) {
      return {
        badge: '✓ Accepted',
        badgeColor: colors.success,
        showActions: false,
        showCounterSent: false,
        showPayNow: false,
        isAccepted: true
      };
    }
    
    // Regular pending seller offer
    return {
      badge: '⏳ Pending',
      badgeColor: colors.warning,
      showActions: true,
      showCounterSent: false,
      showPayNow: false
    };
  };

  const isDelivered = need?.status === 'delivered';
  const acceptedOffer = offers.find(o => o.status === 'accepted' || need?.acceptedOfferId === o.id);
  const pendingCount = offers.filter(o => o.status === 'pending' && !o.isCounterOffer).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers Received</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {need && (
        <View style={styles.needSummary}>
          <Text style={styles.needLabel}>Your Need</Text>
          <Text style={styles.needStatus}>
            Status: <Text style={[styles.statusText, 
              isDelivered ? styles.statusDelivered : styles.statusActive
            ]}>● {isDelivered ? 'Delivered' : 'Active'}</Text>
          </Text>
          <Text style={styles.offerCount}>{pendingCount} pending {pendingCount === 1 ? 'offer' : 'offers'}</Text>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {offers.map((offer) => {
          const statusInfo = getOfferStatusInfo(offer);
          const isThisAcceptedOffer = statusInfo.isAccepted;
          const showDeliveryActions = isDelivered && isThisAcceptedOffer;
          
          return (
            <View 
              key={offer.id} 
              style={[styles.offerCard, isThisAcceptedOffer && styles.offerCardAccepted]}
            >
              <View style={styles.offerHeader}>
                <View style={styles.sellerAvatar}>
                  <Text style={styles.sellerAvatarText}>
                    {offer.sellerName?.[0] || 'D'}
                  </Text>
                </View>
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{offer.sellerName || 'Demo Seller'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.badgeColor + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: statusInfo.badgeColor }]}>
                    {statusInfo.badge}
                  </Text>
                </View>
              </View>

              <View style={styles.offerDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Offer Amount:</Text>
                  <Text style={styles.detailValue}>{formatINR(offer.price)}</Text>
                </View>
                {offer.estimatedDelivery && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Delivery Time:</Text>
                    <Text style={styles.detailValue}>{offer.estimatedDelivery}</Text>
                  </View>
                )}
              </View>

              {offer.message && (
                <View style={styles.messageSection}>
                  <Text style={styles.messageLabel}>Message:</Text>
                  <Text style={styles.messageText} numberOfLines={2}>{offer.message}</Text>
                </View>
              )}

              <Text style={styles.timestamp}>
                {offer.createdAt || 'Just now'}
              </Text>

              {/* Accept/Counter/Decline for pending seller offers */}
              {statusInfo.showActions && (
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => handleAcceptOffer(offer)}
                  >
                    <Text style={styles.acceptButtonText}>✓ Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.counterButton}
                    onPress={() => handleCounterOffer(offer)}
                  >
                    <Text style={styles.counterButtonText}>🔄 Counter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.declineButton}
                    onPress={() => handleDeclineOffer(offer)}
                  >
                    <Text style={styles.declineButtonText}>✕ Decline</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Counter sent waiting message */}
              {statusInfo.showCounterSent && (
                <View style={styles.counterSentBox}>
                  <Text style={styles.counterSentText}>
                    ⏳ Waiting for seller's response to your counter offer
                  </Text>
                </View>
              )}

              {/* Pay Now for accepted counter offers */}
              {statusInfo.showPayNow && (
                <View style={styles.payNowContainer}>
                  <View style={styles.acceptedNotice}>
                    <Text style={styles.acceptedNoticeIcon}>🎉</Text>
                    <Text style={styles.acceptedNoticeText}>
                      Seller accepted your counter offer!
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.payNowButton}
                    onPress={() => handlePayNow(offer)}
                  >
                    <Text style={styles.payNowButtonText}>
                      💳 Pay Now - {formatINR(offer.price)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Delivery actions - ONLY for accepted AND delivered */}
              {showDeliveryActions && (
                <>
                  <View style={styles.deliveredBanner}>
                    <Text style={styles.deliveredIcon}>✅</Text>
                    <Text style={styles.deliveredText}>Service Delivered</Text>
                  </View>

                  <View style={styles.disputeInfo}>
                    <Text style={styles.disputeIcon}>⏰</Text>
                    <View style={styles.disputeTextContainer}>
                      <Text style={styles.disputeTitle}>Raise dispute within 48 hours</Text>
                      <Text style={styles.disputeSubtext}>
                        💰 Payment will be automatically released to seller after dispute window closes
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity 
                      style={styles.rateButton}
                      onPress={handleRateSeller}
                    >
                      <Text style={styles.rateButtonText}>⭐ Rate Seller</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.disputeButton}
                      onPress={handleRaiseDispute}
                    >
                      <Text style={styles.disputeButtonText}>⚠️ Raise Dispute</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          );
        })}

        {offers.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No offers yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Counter Offer Modal */}
      {selectedOffer && (
        <CounterOfferModal
          visible={showCounterModal}
          onClose={() => {
            setShowCounterModal(false);
            setSelectedOffer(null);
          }}
          originalOffer={selectedOffer}
          onSubmit={handleSubmitCounter}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { fontSize: 24, color: colors.text },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  chatIcon: { fontSize: 24 },
  needSummary: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  needLabel: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 },
  needStatus: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  statusText: { fontWeight: '600' },
  statusActive: { color: colors.success },
  statusDelivered: { color: colors.primary },
  offerCount: { fontSize: 14, color: colors.textSecondary },
  content: { padding: 20 },
  offerCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offerCardAccepted: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  offerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sellerAvatarText: { fontSize: 20, fontWeight: '700', color: colors.white },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '600', color: colors.text },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
  offerDetails: { marginBottom: 12 },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8 
  },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 16, fontWeight: '600', color: colors.success },
  messageSection: { marginBottom: 12 },
  messageLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  messageText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  timestamp: { fontSize: 12, color: colors.textLight, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: { fontSize: 14, fontWeight: '600', color: colors.white },
  counterButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  counterButtonText: { fontSize: 14, fontWeight: '600', color: colors.white },
  declineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: { fontSize: 14, fontWeight: '600', color: colors.text },
  rateButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  rateButtonText: { fontSize: 14, fontWeight: '600', color: colors.white },
  disputeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.error,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  disputeButtonText: { fontSize: 14, fontWeight: '700', color: colors.error },
  counterSentBox: {
    backgroundColor: colors.warning + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  counterSentText: { fontSize: 13, color: colors.warning, fontWeight: '500', textAlign: 'center' },
  payNowContainer: { marginTop: 12 },
  acceptedNotice: {
    backgroundColor: colors.success + '15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  acceptedNoticeIcon: { fontSize: 20, marginRight: 8 },
  acceptedNoticeText: { fontSize: 14, fontWeight: '600', color: colors.success },
  payNowButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payNowButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
  deliveredBanner: {
    backgroundColor: colors.success + '15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  deliveredIcon: { fontSize: 20, marginRight: 6 },
  deliveredText: { fontSize: 14, fontWeight: '700', color: colors.success },
  disputeInfo: {
    backgroundColor: '#FFF4E5',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFB74D'
  },
  disputeIcon: { fontSize: 20, marginRight: 8 },
  disputeTextContainer: { flex: 1 },
  disputeTitle: { fontSize: 13, fontWeight: '700', color: '#E65100', marginBottom: 2 },
  disputeSubtext: { fontSize: 12, color: '#EF6C00', lineHeight: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 16, color: colors.textSecondary },
});
