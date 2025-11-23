import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';

const mockOffers = [
  {
    id: '1',
    sellerName: 'Mike Wilson',
    sellerRating: 4.9,
    amount: 150,
    description: 'I can fix your kitchen sink professionally. I have 10 years of plumbing experience and all necessary certifications.',
    deliveryTime: '2-3 hours',
    postedAt: '30 minutes ago',
    status: 'pending',
  },
  {
    id: '2',
    sellerName: 'Sarah Chen',
    sellerRating: 4.7,
    amount: 180,
    description: 'Licensed plumber with 8 years experience. I can come today and fix your sink with a 1-year warranty on parts.',
    deliveryTime: '4-6 hours',
    postedAt: '1 hour ago',
    status: 'pending',
  },
  {
    id: '3',
    sellerName: 'James Brown',
    sellerRating: 5.0,
    amount: 120,
    description: 'Quick and reliable plumbing service. Same day service available. Free inspection included.',
    deliveryTime: '1-2 hours',
    postedAt: '2 hours ago',
    status: 'pending',
  },
];

export default function ViewOffersScreen({ route, navigation }) {
  const { need } = route.params;
  const [offers, setOffers] = useState(mockOffers);

  const handleAcceptOffer = (offer) => {
    Alert.alert(
      'Accept Offer?',
      `Accept ${offer.sellerName}'s offer for $${offer.amount}? Payment will be held in escrow until completion.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Pay',
          onPress: () => navigation.navigate('PaymentMethod', { offer, need })
        }
      ]
    );
  };

  const handleDeclineOffer = (offer) => {
    Alert.alert(
      'Decline Offer?',
      `Are you sure you want to decline ${offer.sellerName}'s offer? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setOffers(offers.filter(o => o.id !== offer.id));
            Alert.alert('Offer Declined', `${offer.sellerName}'s offer has been declined.`);
          }
        }
      ]
    );
  };

  const handleMessageSeller = (offer) => {
    const chat = {
      id: offer.id,
      otherUser: {
        name: offer.sellerName,
        avatar: offer.sellerName.charAt(0),
        role: 'seller',
      },
      lastMessage: {
        text: offer.description,
        time: offer.postedAt,
        unread: false,
      },
      orderId: 'ORD-' + offer.id,
      orderTitle: need.title,
    };
    navigation.navigate('Chat', { chat });
  };

  const handleViewSellerProfile = (offer) => {
    Alert.alert('Seller Profile', `View ${offer.sellerName}'s full profile and reviews.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Offers Received</Text>
          <Text style={styles.headerSubtitle}>{offers.length} offers</Text>
        </View>
        <TouchableOpacity 
          style={styles.chatListButton}
          onPress={() => navigation.navigate('ChatList')}
        >
          <Text style={styles.chatListIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.needSummary}>
          <Text style={styles.needTitle}>{need.title}</Text>
          <Text style={styles.needBudget}>Your Budget: ${need.budget}</Text>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortButtonText}>💰 Lowest Price</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortButtonText}>⭐ Highest Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortButtonText}>⚡ Fastest</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.offersContainer}>
          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.sellerHeader}>
                <View style={styles.sellerAvatar}>
                  <Text style={styles.sellerAvatarText}>{offer.sellerName.charAt(0)}</Text>
                </View>
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{offer.sellerName}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>⭐ {offer.sellerRating}</Text>
                    <Text style={styles.ratingCount}>(89 reviews)</Text>
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
                <View style={styles.deliveryTime}>
                  <Text style={styles.deliveryLabel}>⏱️ Completion Time</Text>
                  <Text style={styles.deliveryValue}>{offer.deliveryTime}</Text>
                </View>
              </View>

              <Text style={styles.offerDescription}>{offer.description}</Text>

              <View style={styles.offerFooter}>
                <Text style={styles.postedTime}>Posted {offer.postedAt}</Text>
                <TouchableOpacity 
                  style={styles.messageButton}
                  onPress={() => handleMessageSeller(offer)}
                >
                  <Text style={styles.messageButtonText}>💬 Message</Text>
                </TouchableOpacity>
              </View>

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
            </View>
          ))}
        </View>

        {offers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No offers available</Text>
            <Text style={styles.emptyText}>All offers have been reviewed. Sellers will start making new offers soon.</Text>
          </View>
        )}

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
  chatListButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  chatListIcon: { fontSize: 20 },
  content: { flex: 1 },
  needSummary: { backgroundColor: colors.white, padding: 20, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  needTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  needBudget: { fontSize: 14, color: colors.textSecondary },
  sortContainer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.white, marginBottom: 16 },
  sortLabel: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 12 },
  sortButton: { backgroundColor: colors.backgroundSecondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  sortButtonText: { fontSize: 13, fontWeight: '600', color: colors.text },
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
