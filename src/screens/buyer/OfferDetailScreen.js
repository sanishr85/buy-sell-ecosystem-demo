import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import CounterOfferModal from '../CounterOfferModal';
import { colors } from '../../theme/colors';
import { formatINR } from '../../utils/fees';

export default function OfferDetailScreen({ route, navigation }) {
  const { offer, need } = route.params;
  const [loading, setLoading] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);

  // Determine offer status (this would come from API in real app)
  const offerStatus = offer.status || 'pending'; // pending, counter_sent, accepted, delivered

  const handleAcceptOffer = () => {
    Alert.alert(
      'Accept This Offer?',
      `You're about to accept ${offer.sellerName}'s offer for ${formatINR(offer.price)}. This will proceed to payment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Pay',
          style: 'default',
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigation.navigate('Payment', { offer, need });
            }, 1000);
          },
        },
      ]
    );
  };

  const handleRejectOffer = () => {
    Alert.alert(
      'Reject This Offer?',
      'The seller will be notified that you declined their offer.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigation.goBack();
            }, 1000);
          },
        },
      ]
    );
  };

  const handleCounterOffer = async ({ amount, message }) => {
    console.log('Counter offer:', amount, message);
    // TODO: API call to send counter offer
    Alert.alert('Counter Offer Sent', 'The seller will be notified of your counter offer.');
  };

  const handleMessageSeller = () => {
    Alert.alert('Coming Soon', 'Messaging feature will be available soon!');
  };

  const handleRateSeller = () => {
    Alert.alert('Coming Soon', 'Rating feature will be available soon!');
  };

  const handleRaiseDispute = () => {
    Alert.alert('Coming Soon', 'Dispute resolution will be available soon!');
  };

  const totalAmount = offer.price * 1.05;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back to Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMessageSeller}>
          <Text style={styles.chatIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Seller Profile */}
        <View style={styles.sellerCard}>
          <View style={styles.sellerHeader}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>{offer.sellerName[0]}</Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{offer.sellerName}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.rating}>⭐ {offer.sellerRating}</Text>
                <Text style={styles.ratingCount}>({offer.sellerTotalRatings} ratings)</Text>
              </View>
              <Text style={styles.memberSince}>Member since 2023</Text>
            </View>
            {offerStatus === 'pending' && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>⏳ Pending</Text>
              </View>
            )}
            {offerStatus === 'counter_sent' && (
              <View style={[styles.statusBadge, { backgroundColor: colors.warning + '15' }]}>
                <Text style={[styles.statusText, { color: colors.warning }]}>🔄 Counter Sent</Text>
              </View>
            )}
          </View>
        </View>

        {/* Your Need Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Need</Text>
          <View style={styles.needSummaryCard}>
            <Text style={styles.needTitle}>{need.title}</Text>
            <Text style={styles.needBudget}>Status: <Text style={styles.statusActive}>{offerStatus === 'delivered' ? '● Delivered' : '● Active'}</Text></Text>
          </View>
        </View>

        {/* Offer Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer Price</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <Text style={styles.priceAmount}>{formatINR(offer.price)}</Text>
            </View>
            
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service Amount:</Text>
                <Text style={styles.priceValue}>{formatINR(offer.price)}</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>{formatINR(totalAmount)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Seller's Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message:</Text>
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{offer.message || 'I can fix it'}</Text>
          </View>
          <Text style={styles.timestamp}>{offer.createdAt || 'Just now'}</Text>
        </View>

        {/* Delivery Info */}
        {offer.estimatedDelivery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Time:</Text>
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryValue}>{offer.estimatedDelivery}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons based on status */}
        {offerStatus === 'pending' && (
          <View style={styles.actionsContainer}>
            <Button
              title="✓ Accept"
              onPress={handleAcceptOffer}
              loading={loading}
              style={styles.acceptButton}
            />
            <View style={styles.buttonRow}>
              <Button
                title="🔄 Counter"
                onPress={() => setShowCounterModal(true)}
                variant="outline"
                style={styles.counterButton}
              />
              <Button
                title="✕ Decline"
                onPress={handleRejectOffer}
                variant="outline"
                style={styles.declineButton}
              />
            </View>
          </View>
        )}

        {offerStatus === 'counter_sent' && (
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>⏳</Text>
            <Text style={styles.infoText}>
              Counter offer sent. Waiting for seller's response.
            </Text>
          </View>
        )}

        {offerStatus === 'delivered' && (
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

            <View style={styles.actionsContainer}>
              <Button
                title="⭐ Rate Seller"
                onPress={handleRateSeller}
                style={styles.rateButton}
              />
              <Button
                title="⚠️ Raise Dispute"
                onPress={handleRaiseDispute}
                variant="outline"
                style={styles.disputeButton}
              />
            </View>
          </>
        )}

        {/* Escrow info for pending/counter_sent */}
        {(offerStatus === 'pending' || offerStatus === 'counter_sent') && (
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🔒</Text>
            <Text style={styles.infoText}>
              Funds held securely in escrow until service completion
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Counter Offer Modal */}
      <CounterOfferModal
        visible={showCounterModal}
        onClose={() => setShowCounterModal(false)}
        originalOffer={offer}
        onSubmit={handleCounterOffer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 20, 
    paddingBottom: 12 
  },
  backButton: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  chatIcon: { fontSize: 24 },
  content: { padding: 20, paddingTop: 8 },
  sellerCard: { 
    backgroundColor: colors.white, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  sellerHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  sellerAvatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  sellerAvatarText: { fontSize: 24, fontWeight: 'bold', color: colors.white },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  rating: { fontSize: 15, fontWeight: '600', color: colors.warning },
  ratingCount: { fontSize: 13, color: colors.textSecondary },
  memberSince: { fontSize: 12, color: colors.textLight },
  statusBadge: { 
    backgroundColor: colors.warning + '15', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  statusText: { fontSize: 12, fontWeight: '700', color: colors.warning },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  needSummaryCard: { backgroundColor: colors.backgroundSecondary, padding: 16, borderRadius: 12 },
  needTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  needBudget: { fontSize: 14, color: colors.textSecondary },
  statusActive: { color: colors.success, fontWeight: '600' },
  priceCard: { 
    backgroundColor: colors.white, 
    borderRadius: 16, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  priceHeader: { marginBottom: 16 },
  priceAmount: { fontSize: 32, fontWeight: 'bold', color: colors.text },
  priceBreakdown: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  totalRow: { 
    borderTopWidth: 1, 
    borderTopColor: colors.border, 
    paddingTop: 12, 
    marginTop: 4, 
    marginBottom: 0 
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.success },
  messageCard: { 
    backgroundColor: colors.white, 
    borderRadius: 12, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: colors.border,
    marginBottom: 8
  },
  messageText: { fontSize: 15, color: colors.text, lineHeight: 22 },
  timestamp: { fontSize: 12, color: colors.textLight },
  deliveryCard: { 
    backgroundColor: colors.white, 
    borderRadius: 12, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  deliveryValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  actionsContainer: { marginBottom: 16 },
  acceptButton: { marginBottom: 12, backgroundColor: colors.success },
  buttonRow: { flexDirection: 'row', gap: 12 },
  counterButton: { flex: 1 },
  declineButton: { flex: 1 },
  rateButton: { marginBottom: 12, backgroundColor: colors.primary },
  disputeButton: { borderColor: colors.error },
  infoBox: { 
    flexDirection: 'row',
    backgroundColor: '#E3F2FD', 
    padding: 16, 
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoText: { flex: 1, fontSize: 13, color: '#1976D2', lineHeight: 20 },
  deliveredBanner: {
    backgroundColor: colors.success + '15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  deliveredIcon: { fontSize: 24, marginRight: 8 },
  deliveredText: { fontSize: 16, fontWeight: '700', color: colors.success },
  disputeInfo: {
    backgroundColor: '#FFF4E5',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFB74D'
  },
  disputeIcon: { fontSize: 24, marginRight: 12 },
  disputeTextContainer: { flex: 1 },
  disputeTitle: { fontSize: 14, fontWeight: '700', color: '#E65100', marginBottom: 4 },
  disputeSubtext: { fontSize: 13, color: '#EF6C00', lineHeight: 18 }
});
