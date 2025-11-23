import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';

export default function BuyerOrderTrackingScreen({ route, navigation }) {
  const [order] = useState({
    id: 'ORD-12345',
    needTitle: 'Need a plumber for kitchen sink',
    sellerName: 'Mike Wilson',
    sellerRating: 4.9,
    amount: 150,
    status: 'in_delivery',
    paymentDate: '2 hours ago',
    startedDate: '1 hour ago',
    estimatedCompletion: '2-3 hours',
    deliveryMethod: 'In-Person Service',
    location: 'Brooklyn, NY',
    escrowAmount: 157.50,
  });

  const handleContactSeller = () => {
    Alert.alert('Contact Seller', `Message ${order.sellerName}. Chat feature coming soon!`);
  };

  const handleConfirmCompletion = () => {
    Alert.alert(
      'Confirm Completion',
      `Has ${order.sellerName} completed the service? Payment will be released from escrow.`,
      [
        { text: 'Not Yet', style: 'cancel' },
        { 
          text: 'Yes, Completed',
          onPress: () => {
            Alert.alert('Payment Released!', `$${order.amount} released to ${order.sellerName}. Please rate your experience.`, [
              { text: 'Rate Now', onPress: () => navigation.navigate('RateSeller', { order }) },
              { text: 'Later', style: 'cancel' }
            ]);
          }
        }
      ]
    );
  };

  const handleReportIssue = () => {
    Alert.alert('Report Issue', 'Our support team will contact you shortly.');
  };

  const getStatusInfo = () => {
    const statuses = {
      payment_confirmed: { emoji: '💳', label: 'Payment Confirmed', color: '#10b981' },
      seller_preparing: { emoji: '🔨', label: 'Seller Preparing', color: '#f59e0b' },
      in_delivery: { emoji: '🚀', label: 'In Delivery', color: '#6366f1' },
      awaiting_confirmation: { emoji: '⏳', label: 'Awaiting Confirmation', color: '#8b5cf6' },
      completed: { emoji: '🎉', label: 'Completed', color: '#059669' },
    };
    return statuses[order.status] || statuses.in_delivery;
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <Text style={styles.headerSubtitle}>Order #{order.id}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusEmoji}>{statusInfo.emoji}</Text>
          <Text style={styles.statusLabel}>{statusInfo.label}</Text>
          {order.status === 'in_delivery' && (
            <Text style={styles.statusDescription}>
              Estimated completion: {order.estimatedCompletion}
            </Text>
          )}
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{order.needTitle}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Method:</Text>
              <Text style={styles.detailValue}>{order.deliveryMethod}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{order.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>${order.amount}</Text>
            </View>
          </View>
        </View>

        {/* Seller Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.card}>
            <View style={styles.sellerHeader}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>{order.sellerName.charAt(0)}</Text>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{order.sellerName}</Text>
                <Text style={styles.sellerRating}>⭐ {order.sellerRating} (89 reviews)</Text>
              </View>
              <TouchableOpacity style={styles.contactButton} onPress={handleContactSeller}>
                <Text style={styles.contactButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          <View style={styles.card}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDotCompleted}>
                <Text style={styles.timelineCheck}>✓</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Payment Secured</Text>
                <Text style={styles.timelineTime}>{order.paymentDate}</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineDotCompleted}>
                <Text style={styles.timelineCheck}>✓</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Seller Started</Text>
                <Text style={styles.timelineTime}>{order.startedDate}</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineDotCurrent}>
                <View style={styles.timelinePulse} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, styles.timelineTitleCurrent]}>
                  Service in Progress
                </Text>
                <Text style={styles.timelineTime}>In progress</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Awaiting Confirmation</Text>
                <Text style={styles.timelineTime}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Status</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Escrow Amount:</Text>
              <Text style={styles.paymentValue}>${order.escrowAmount}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Status:</Text>
              <Text style={styles.paymentStatusText}>🔒 Secured</Text>
            </View>
            <Text style={styles.paymentNote}>
              Your payment is safely held until you confirm completion.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {order.status === 'awaiting_confirmation' && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmCompletion}>
              <Text style={styles.primaryButtonText}>✓ Confirm Completion</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleContactSeller}>
            <Text style={styles.secondaryButtonText}>💬 Contact Seller</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportButton} onPress={handleReportIssue}>
            <Text style={styles.reportButtonText}>⚠️ Report Issue</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statusEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sellerAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sellerRating: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contactButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    fontSize: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    marginTop: 2,
  },
  timelineDotCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#d1fae5',
    borderWidth: 2,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  timelineDotCurrent: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  timelineCheck: {
    fontSize: 12,
    color: '#10b981',
  },
  timelinePulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  timelineTitleCurrent: {
    color: colors.primary,
  },
  timelineTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  paymentCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#047857',
  },
  paymentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  paymentStatusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
  },
  paymentNote: {
    fontSize: 13,
    color: '#047857',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  reportButton: {
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
