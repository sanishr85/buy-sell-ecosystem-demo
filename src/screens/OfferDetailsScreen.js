import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';

const statusTimeline = {
  pending: [
    { label: 'Offer Submitted', status: 'completed', time: '2 hours ago' },
    { label: 'Awaiting Buyer Response', status: 'current', time: 'In progress' },
    { label: 'Delivery', status: 'upcoming', time: 'Pending' },
    { label: 'Payment Release', status: 'upcoming', time: 'Pending' },
  ],
  accepted: [
    { label: 'Offer Submitted', status: 'completed', time: '1 day ago' },
    { label: 'Buyer Accepted', status: 'completed', time: '5 hours ago' },
    { label: 'Ready to Start', status: 'current', time: 'In progress' },
    { label: 'Payment Release', status: 'upcoming', time: 'Pending' },
  ],
  in_delivery: [
    { label: 'Offer Submitted', status: 'completed', time: '3 days ago' },
    { label: 'Buyer Accepted', status: 'completed', time: '1 day ago' },
    { label: 'Delivery in Progress', status: 'current', time: '2 hours ago' },
    { label: 'Payment Release', status: 'upcoming', time: 'Pending' },
  ],
  completed: [
    { label: 'Offer Submitted', status: 'completed', time: '5 days ago' },
    { label: 'Buyer Accepted', status: 'completed', time: '3 days ago' },
    { label: 'Delivery Completed', status: 'completed', time: '2 days ago' },
    { label: 'Payment Released', status: 'completed', time: '2 days ago' },
  ],
};

export default function OfferDetailsScreen({ route, navigation }) {
  // Check if route params exist
  if (!route.params || !route.params.offer) {
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

  const { offer } = route.params;
  const timeline = statusTimeline[offer.status] || statusTimeline.pending;

  const statusConfig = {
    pending: { color: '#f59e0b', bgColor: '#fef3c7', label: 'Pending', emoji: '⏳' },
    accepted: { color: '#10b981', bgColor: '#d1fae5', label: 'Accepted', emoji: '✅' },
    in_delivery: { color: '#6366f1', bgColor: '#e0e7ff', label: 'In Progress', emoji: '🚀' },
    completed: { color: '#8b5cf6', bgColor: '#ede9fe', label: 'Completed', emoji: '🎉' },
  };

  const handleContactBuyer = () => {
    Alert.alert('Contact Buyer', 'Chat feature coming soon!');
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Mark as Complete?',
      'Confirm that you have fulfilled this service/delivery. The buyer will be asked to confirm.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => {
          Alert.alert('Success', 'Completion request sent to buyer for confirmation.');
          navigation.goBack();
        }}
      ]
    );
  };

  const handleReportIssue = () => {
    Alert.alert('Report Issue', 'Issue reporting feature coming soon!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Offer Details</Text>
          <Text style={styles.headerSubtitle}>Track your offer status</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig[offer.status].bgColor }]}>
            <Text style={styles.statusEmoji}>{statusConfig[offer.status].emoji}</Text>
            <Text style={[styles.statusText, { color: statusConfig[offer.status].color }]}>
              {statusConfig[offer.status].label}
            </Text>
          </View>
        </View>

        {/* Offer Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.card}>
            <Text style={styles.offerTitle}>{offer.needTitle}</Text>
            <Text style={styles.offerDescription}>{offer.description}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Your Offer Amount</Text>
              <Text style={styles.detailValue}>${offer.amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{offer.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Posted</Text>
              <Text style={styles.detailValue}>{offer.createdAt}</Text>
            </View>
          </View>
        </View>

        {/* Buyer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buyer Information</Text>
          <View style={styles.card}>
            <View style={styles.buyerHeader}>
              <View style={styles.buyerAvatar}>
                <Text style={styles.buyerAvatarText}>{offer.buyerName.charAt(0)}</Text>
              </View>
              <View style={styles.buyerInfo}>
                <Text style={styles.buyerName}>{offer.buyerName}</Text>
                <View style={styles.buyerRating}>
                  <Text style={styles.ratingText}>⭐ {offer.buyerRating}</Text>
                  <Text style={styles.ratingCount}>(127 ratings)</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.contactButton} onPress={handleContactBuyer}>
                <Text style={styles.contactButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.buyerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>156</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>98%</Text>
                <Text style={styles.statLabel}>Response</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>2 yrs</Text>
                <Text style={styles.statLabel}>Member</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.card}>
            {timeline.map((step, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    step.status === 'completed' && styles.timelineDotCompleted,
                    step.status === 'current' && styles.timelineDotCurrent,
                  ]}>
                    {step.status === 'completed' && <Text style={styles.timelineCheck}>✓</Text>}
                    {step.status === 'current' && <View style={styles.timelinePulse} />}
                  </View>
                  {index < timeline.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      step.status === 'completed' && styles.timelineLineCompleted
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineLabel,
                    step.status === 'current' && styles.timelineLabelCurrent
                  ]}>{step.label}</Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {offer.status === 'accepted' && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('DeliveryInitiation', { offer })}
            >
              <Text style={styles.primaryButtonText}>🚀 Start Delivery</Text>
            </TouchableOpacity>
          )}

          {offer.status === 'in_delivery' && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleMarkComplete}>
              <Text style={styles.primaryButtonText}>✓ Mark as Complete</Text>
            </TouchableOpacity>
          )}

          {offer.status === 'completed' && !offer.rated && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('RateBuyer', { offer })}
            >
              <Text style={styles.primaryButtonText}>⭐ Rate Buyer</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={handleContactBuyer}>
            <Text style={styles.secondaryButtonText}>💬 Contact Buyer</Text>
          </TouchableOpacity>

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
  
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  
  offerTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  offerDescription: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: 16 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  
  buyerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  buyerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  buyerAvatarText: { fontSize: 24, fontWeight: '700', color: colors.white },
  buyerInfo: { flex: 1 },
  buyerName: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  buyerRating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, fontWeight: '600', color: colors.text, marginRight: 6 },
  ratingCount: { fontSize: 13, color: colors.textSecondary },
  contactButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  contactButtonText: { fontSize: 20 },
  
  buyerStats: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  statDivider: { width: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineLeft: { alignItems: 'center', marginRight: 16 },
  timelineDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.backgroundSecondary, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  timelineDotCompleted: { backgroundColor: '#d1fae5', borderColor: '#10b981' },
  timelineDotCurrent: { backgroundColor: '#e0e7ff', borderColor: colors.primary },
  timelineCheck: { fontSize: 16, color: '#10b981' },
  timelinePulse: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 },
  timelineLineCompleted: { backgroundColor: '#10b981' },
  timelineContent: { flex: 1, paddingTop: 4 },
  timelineLabel: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  timelineLabelCurrent: { color: colors.primary },
  timelineTime: { fontSize: 13, color: colors.textSecondary },
  
  actionSection: { paddingHorizontal: 20, gap: 12 },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  secondaryButton: { backgroundColor: colors.white, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.primary },
  secondaryButtonText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  backToOffersButton: { backgroundColor: colors.backgroundSecondary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  backToOffersButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
