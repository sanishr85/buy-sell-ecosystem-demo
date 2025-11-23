import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';

export default function OfferDetailScreen({ route, navigation }) {
  const { offer, need } = route.params;
  const [loading, setLoading] = useState(false);

  const handleAcceptOffer = () => {
    Alert.alert(
      'Accept This Offer?',
      `You're about to accept ${offer.sellerName}'s offer for $${offer.price}. This will proceed to payment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Pay',
          style: 'default',
          onPress: () => {
            setLoading(true);
            // TODO: API call to accept offer
            setTimeout(() => {
              setLoading(false);
              // Navigate to payment screen
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
            // TODO: API call to reject offer
            setTimeout(() => {
              setLoading(false);
              navigation.goBack();
            }, 1000);
          },
        },
      ]
    );
  };

  const handleMessageSeller = () => {
    Alert.alert('Coming Soon', 'Messaging feature will be available soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back to Offers</Text>
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
          </View>
          <TouchableOpacity style={styles.messageButton} onPress={handleMessageSeller}>
            <Text style={styles.messageButtonText}>💬 Message Seller</Text>
          </TouchableOpacity>
        </View>

        {/* Your Need Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Need</Text>
          <View style={styles.needSummaryCard}>
            <Text style={styles.needTitle}>{need.title}</Text>
            <Text style={styles.needBudget}>Your budget: ${need.budgetMin} - ${need.budgetMax}</Text>
          </View>
        </View>

        {/* Offer Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer Price</Text>
          <View style={styles.priceCard}>
            <Text style={styles.priceAmount}>${offer.price}</Text>
            {offer.price <= need.budgetMax && offer.price >= need.budgetMin ? (
              <View style={styles.budgetBadge}>
                <Text style={styles.budgetBadgeText}>✅ Within your budget</Text>
              </View>
            ) : offer.price < need.budgetMin ? (
              <View style={[styles.budgetBadge, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.budgetBadgeText, { color: colors.primary }]}>💰 Below your budget</Text>
              </View>
            ) : (
              <View style={[styles.budgetBadge, { backgroundColor: colors.warning + '15' }]}>
                <Text style={[styles.budgetBadgeText, { color: colors.warning }]}>⚠️ Above your budget</Text>
              </View>
            )}
            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Item/Service</Text>
                <Text style={styles.priceValue}>${offer.price}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Platform Fee (5%)</Text>
                <Text style={styles.priceValue}>${(offer.price * 0.05).toFixed(2)}</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${(offer.price * 1.05).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Seller's Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller's Message</Text>
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{offer.message}</Text>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>🚚</Text>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                <Text style={styles.deliveryValue}>{offer.estimatedDelivery}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Offer Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer Timeline</Text>
          <View style={styles.timelineCard}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineText}>Offer received</Text>
                <Text style={styles.timelineTime}>{offer.createdAt}</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotInactive]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineText, styles.timelineTextInactive]}>Waiting for your decision</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title={`Accept & Pay $${(offer.price * 1.05).toFixed(2)}`}
            onPress={handleAcceptOffer}
            loading={loading}
            style={styles.acceptButton}
          />
          <Button
            title="Decline Offer"
            onPress={handleRejectOffer}
            variant="outline"
            style={styles.rejectButton}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Your payment will be held in escrow until you confirm delivery. The seller will be paid only after you approve.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 12 },
  backButton: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  content: { padding: 20, paddingTop: 8 },
  sellerCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  sellerHeader: { flexDirection: 'row', marginBottom: 16 },
  sellerAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  sellerAvatarText: { fontSize: 24, fontWeight: 'bold', color: colors.white },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  rating: { fontSize: 15, fontWeight: '600', color: colors.warning },
  ratingCount: { fontSize: 13, color: colors.textSecondary },
  memberSince: { fontSize: 12, color: colors.textLight },
  messageButton: { backgroundColor: colors.primary + '15', padding: 12, borderRadius: 12, alignItems: 'center' },
  messageButtonText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  needSummaryCard: { backgroundColor: colors.backgroundSecondary, padding: 16, borderRadius: 12 },
  needTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  needBudget: { fontSize: 14, color: colors.textSecondary },
  priceCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  priceAmount: { fontSize: 40, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  budgetBadge: { backgroundColor: colors.success + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 16 },
  budgetBadgeText: { fontSize: 13, fontWeight: '700', color: colors.success },
  priceBreakdown: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginTop: 4, marginBottom: 0 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  messageCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  messageText: { fontSize: 15, color: colors.text, lineHeight: 22 },
  deliveryCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  deliveryRow: { flexDirection: 'row', alignItems: 'center' },
  deliveryIcon: { fontSize: 32, marginRight: 12 },
  deliveryInfo: { flex: 1 },
  deliveryLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  deliveryValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  timelineCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, marginRight: 12, marginTop: 4 },
  timelineDotInactive: { backgroundColor: colors.border },
  timelineContent: { flex: 1 },
  timelineText: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 },
  timelineTextInactive: { color: colors.textSecondary },
  timelineTime: { fontSize: 12, color: colors.textSecondary },
  actionsContainer: { marginBottom: 16 },
  acceptButton: { marginBottom: 12 },
  rejectButton: {},
  infoBox: { backgroundColor: colors.primary + '10', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.primary + '30' },
  infoText: { fontSize: 13, color: colors.primary, lineHeight: 20 },
});
