import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
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
        // If offer is countered, load the counter offer
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
      }
    } catch (error) {
      console.error('Load counter offer error:', error);
    }
  };

  const handleAcceptCounterOffer = async () => {
    if (!counterOffer) return;
    
    Alert.alert(
      'Accept Counter Offer',
      `Accept buyer's counter offer of $${counterOffer.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              const response = await offersAPI.accept(counterOffer.id);
              if (response.success) {
                Alert.alert('Success', 'Counter offer accepted! Buyer will be notified to proceed with payment.');
                // Navigate to MyOffers and trigger refresh
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading offer...</Text>
        </View>
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Error</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No offer data found</Text>
        </View>
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
      {/* Header */}
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
        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
            <Text style={styles.statusEmoji}>{config.emoji}</Text>
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
        </View>

        {/* Counter Offer Notice */}
        {hasCounterOffer && (
          <View style={styles.counterNotice}>
            <Text style={styles.counterIcon}>💬</Text>
            <View style={styles.counterTextContainer}>
              <Text style={styles.counterTitle}>Buyer sent a counter offer</Text>
              <Text style={styles.counterSubtitle}>
                Your offer: ${offer.price} → Buyer's counter: ${counterOffer.price}
              </Text>
            </View>
          </View>
        )}

        {/* Offer Summary */}
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
                    ${offer.price}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Buyer's Counter Offer</Text>
                  <Text style={[styles.detailValue, { color: colors.success, fontSize: 18, fontWeight: '700' }]}>
                    ${counterOffer.price}
                  </Text>
                </View>
              </>
            )}
            {!hasCounterOffer && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Your Offer Amount</Text>
                <Text style={styles.detailValue}>${displayOffer.price || displayOffer.amount}</Text>
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

        {/* Buyer Information */}
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

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {hasCounterOffer && counterOffer.status === "pending" && (
            <>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleAcceptCounterOffer}
              >
                <Text style={styles.primaryButtonText}>✓ Accept Counter Offer ${counterOffer.price}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.declineButton}
                onPress={handleDeclineCounterOffer}
              >
                <Text style={styles.declineButtonText}>✕ Decline Counter Offer</Text>
              </TouchableOpacity>
            </>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { marginRight: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 24, color: colors.text },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary },
  content: { flex: 1 },
  
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: colors.textSecondary },
  
  statusSection: { alignItems: 'center', paddingVertical: 24 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  statusEmoji: { fontSize: 20, marginRight: 8 },
  statusText: { fontSize: 16, fontWeight: '700' },
  
  counterNotice: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, padding: 16, backgroundColor: '#FFF4E6', borderRadius: 12, borderWidth: 1, borderColor: '#FFB74D' },
  counterIcon: { fontSize: 24, marginRight: 12 },
  counterTextContainer: { flex: 1 },
  counterTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  counterSubtitle: { fontSize: 14, color: colors.textSecondary },
  
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  
  offerTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  offerDescription: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: 16 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  
  buyerHeader: { flexDirection: 'row', alignItems: 'center' },
  buyerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  buyerAvatarText: { fontSize: 24, fontWeight: '700', color: colors.white },
  buyerInfo: { flex: 1 },
  buyerName: { fontSize: 18, fontWeight: '700', color: colors.text },
  
  actionSection: { paddingHorizontal: 20, gap: 12 },
  primaryButton: { backgroundColor: colors.success, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  declineButton: { backgroundColor: colors.white, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.error },
  declineButtonText: { color: colors.error, fontSize: 16, fontWeight: '700' },
  backToOffersButton: { backgroundColor: colors.backgroundSecondary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  backToOffersButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
