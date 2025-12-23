import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { formatINR } from '../utils/fees';
import { offersAPI } from '../api/offers2';

export default function OfferDetailsScreen({ route, navigation }) {
  const [offer, setOffer] = useState(route.params?.offer || null);
  const [counterOffer, setCounterOffer] = useState(null);
  const [loading, setLoading] = useState(!route.params?.offer);

  useEffect(() => {
    if (!offer && route.params?.offerId) {
      loadOffer();
    } else if (offer?.status === 'countered' && offer?.counterOfferId) {
      loadCounterOffer();
    }
  }, [offer]);

  const loadOffer = async () => {
    try {
      const response = await offersAPI.getById(route.params.offerId);
      if (response.success) {
        setOffer(response.offer);
        if (response.offer.status === 'countered' && response.offer.counterOfferId) {
          loadCounterOffer(response.offer.counterOfferId);
        }
      } else {
        Alert.alert('Error', 'Offer not found');
      }
    } catch (error) {
      console.error('Load offer error:', error);
      Alert.alert('Error', 'Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  const loadCounterOffer = async (counterId) => {
    try {
      const id = counterId || offer?.counterOfferId;
      if (!id) return;
      
      const response = await offersAPI.getById(id);
      if (response.success) {
        setCounterOffer(response.offer);
        console.log('📬 Counter offer loaded:', response.offer);
      }
    } catch (error) {
      console.error('Load counter offer error:', error);
    }
  };

  const handleAcceptCounterOffer = async () => {
    if (!counterOffer) return;
    
    Alert.alert(
      'Accept Counter Offer',
      `Accept buyer's counter offer of ${formatINR(counterOffer.price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const response = await offersAPI.accept(counterOffer.id);
              if (response.success) {
                Alert.alert('Success', 'Counter offer accepted! Buyer will be notified to proceed with payment.');
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to accept counter offer');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to accept counter offer');
            }
          }
        }
      ]
    );
  };

  const handleDeclineCounterOffer = async () => {
    if (!counterOffer) return;
    
    Alert.alert(
      'Decline Counter Offer',
      'Are you sure you want to decline this counter offer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await offersAPI.decline(counterOffer.id);
              if (response.success) {
                Alert.alert('Declined', 'Counter offer declined');
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to decline counter offer');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to decline counter offer');
            }
          }
        }
      ]
    );
  };

  const handleAcceptOffer = async () => {
    Alert.alert(
      'Accept Offer?',
      `Proceed with this order for ${formatINR(offer.price)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const response = await offersAPI.accept(offer.id);
              if (response.success) {
                Alert.alert('Success', 'Offer accepted! Buyer will proceed with payment.');
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to accept offer');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to accept offer');
            }
          }
        }
      ]
    );
  };

  const handleDeclineOffer = async () => {
    Alert.alert(
      'Decline Offer?',
      'The buyer will be notified that you declined.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await offersAPI.decline(offer.id);
              if (response.success) {
                Alert.alert('Declined', 'Offer declined');
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to decline offer');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to decline offer');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading offer details...</Text>
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Offer not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayOffer = counterOffer || offer;
  const hasCounterOffer = offer.status === 'countered' && counterOffer;

  const statusConfig = {
    pending: { color: '#f59e0b', bgColor: '#fef3c7', label: 'Pending', emoji: '⏳' },
    countered: { color: '#f59e0b', bgColor: '#fef3c7', label: 'Counter Offer Received', emoji: '↔️' },
    accepted: { color: '#10b981', bgColor: '#d1fae5', label: 'Accepted', emoji: '✅' },
  };

  const currentStatus = hasCounterOffer ? 'countered' : offer.status;
  const config = statusConfig[currentStatus] || statusConfig.pending;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {hasCounterOffer ? 'Counter Offer' : 'Offer Details'}
          </Text>
          <Text style={styles.headerSubtitle}>Track your offer status</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
            <Text style={styles.statusEmoji}>{config.emoji}</Text>
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {hasCounterOffer && (
          <View style={styles.counterNotice}>
            <Text style={styles.counterIcon}>💬</Text>
            <View style={styles.counterTextContainer}>
              <Text style={styles.counterTitle}>Buyer sent a counter offer</Text>
              <Text style={styles.counterSubtitle}>
                Your offer: {formatINR(offer.price)} → Buyer's counter: {formatINR(counterOffer.price)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.card}>
            <Text style={styles.offerTitle}>{displayOffer.needTitle}</Text>
            <Text style={styles.offerDescription}>
              {displayOffer.description || displayOffer.message || 'No description'}
            </Text>
            
            <View style={styles.divider} />
            
            {hasCounterOffer && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Your Original Offer</Text>
                  <Text style={[styles.detailValue, { textDecorationLine: 'line-through', color: colors.textSecondary }]}>
                    {formatINR(offer.price)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Buyer's Counter Offer</Text>
                  <Text style={[styles.detailValue, { color: colors.success, fontSize: 18, fontWeight: '700' }]}>
                    {formatINR(counterOffer.price)}
                  </Text>
                </View>
              </>
            )}
            {!hasCounterOffer && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Your Offer Amount</Text>
                <Text style={styles.detailValue}>{formatINR(displayOffer.price || displayOffer.amount)}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Time</Text>
              <Text style={styles.detailValue}>{displayOffer.deliveryTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Posted</Text>
              <Text style={styles.detailValue}>
                {new Date(displayOffer.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buyer Information</Text>
          <View style={styles.card}>
            <View style={styles.buyerHeader}>
              <View style={styles.buyerAvatar}>
                <Text style={styles.buyerAvatarText}>
                  {displayOffer.buyerName?.charAt(0) || 'B'}
                </Text>
              </View>
              <View style={styles.buyerInfo}>
                <Text style={styles.buyerName}>{displayOffer.buyerName}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          {hasCounterOffer && counterOffer?.status === "pending" && (
            <>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleAcceptCounterOffer}
              >
                <Text style={styles.primaryButtonText}>✓ Accept Counter Offer {formatINR(counterOffer.price)}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.declineButton}
                onPress={handleDeclineCounterOffer}
              >
                <Text style={styles.declineButtonText}>✕ Decline Counter Offer</Text>
              </TouchableOpacity>
            </>
          )}

          {!hasCounterOffer && offer?.status === "pending" && (
            <>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleAcceptOffer}
              >
                <Text style={styles.primaryButtonText}>✓ Accept Offer {formatINR(offer.price)}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.declineButton}
                onPress={handleDeclineOffer}
              >
                <Text style={styles.declineButtonText}>✕ Decline Offer</Text>
              </TouchableOpacity>
            </>
          )}

          {offer?.status === "accepted" && offer?.orderId && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SellerOrderTracking', { orderId: offer.orderId })}
            >
              <Text style={styles.primaryButtonText}>📦 View Order & Update Status</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.backToOffersButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backToOffersButtonText}>← Back to My Offers</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  errorText: { fontSize: 16, color: colors.error, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { marginRight: 12 },
  backButtonText: { fontSize: 24, color: colors.text },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  content: { flex: 1 },
  statusSection: { alignItems: 'center', paddingVertical: 24 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20 },
  statusEmoji: { fontSize: 20, marginRight: 8 },
  statusText: { fontSize: 16, fontWeight: '700' },
  counterNotice: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 16, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F59E0B' },
  counterIcon: { fontSize: 24, marginRight: 12 },
  counterTextContainer: { flex: 1 },
  counterTitle: { fontSize: 15, fontWeight: '700', color: '#92400E', marginBottom: 4 },
  counterSubtitle: { fontSize: 13, color: '#B45309', lineHeight: 18 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12, paddingHorizontal: 16 },
  card: { backgroundColor: colors.white, marginHorizontal: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  offerTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  offerDescription: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  buyerHeader: { flexDirection: 'row', alignItems: 'center' },
  buyerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  buyerAvatarText: { fontSize: 20, fontWeight: '700', color: colors.white },
  buyerInfo: { flex: 1 },
  buyerName: { fontSize: 16, fontWeight: '600', color: colors.text },
  actionSection: { paddingHorizontal: 16, marginTop: 8 },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
  declineButton: { borderWidth: 2, borderColor: colors.error, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  declineButtonText: { fontSize: 16, fontWeight: '700', color: colors.error },
  backToOffersButton: { paddingVertical: 16, alignItems: 'center' },
  backToOffersButtonText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
});
