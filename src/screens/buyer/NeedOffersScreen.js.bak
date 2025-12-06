import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

// Mock offers data
const MOCK_OFFERS = [
  {
    id: '1',
    sellerId: 's1',
    sellerName: 'Tech Solutions Pro',
    sellerRating: 4.9,
    sellerTotalRatings: 127,
    price: 1150,
    message: 'Brand new iPhone 15 Pro Max 256GB in Natural Titanium. Unlocked, sealed in box with full warranty. Can deliver within 2 days.',
    estimatedDelivery: '2-3 business days',
    createdAt: '30 minutes ago',
    status: 'pending',
  },
  {
    id: '2',
    sellerId: 's2',
    sellerName: 'Mobile World',
    sellerRating: 4.7,
    sellerTotalRatings: 89,
    price: 1100,
    message: 'iPhone 15 Pro Max 256GB Natural Titanium. Factory unlocked, never opened. I can meet locally or ship with tracking.',
    estimatedDelivery: '1-2 business days',
    createdAt: '1 hour ago',
    status: 'pending',
  },
  {
    id: '3',
    sellerId: 's3',
    sellerName: 'John\'s Electronics',
    sellerRating: 4.5,
    sellerTotalRatings: 45,
    price: 1050,
    message: 'Lightly used iPhone 15 Pro Max 256GB (2 months old) in excellent condition. Includes original box and accessories.',
    estimatedDelivery: '3-4 business days',
    createdAt: '2 hours ago',
    status: 'pending',
  },
  {
    id: '4',
    sellerId: 's4',
    sellerName: 'Premium Tech Store',
    sellerRating: 4.8,
    sellerTotalRatings: 203,
    price: 1200,
    message: 'Brand new sealed iPhone 15 Pro Max 256GB. Official Apple warranty. Free screen protector included. Same-day delivery available.',
    estimatedDelivery: 'Same day',
    createdAt: '3 hours ago',
    status: 'pending',
  },
  {
    id: '5',
    sellerId: 's5',
    sellerName: 'Budget Phones',
    sellerRating: 4.2,
    sellerTotalRatings: 28,
    price: 950,
    message: 'Refurbished iPhone 15 Pro Max 256GB. Fully tested and working. 30-day warranty included.',
    estimatedDelivery: '5-7 business days',
    createdAt: '5 hours ago',
    status: 'pending',
  },
];

export default function NeedOffersScreen({ route, navigation }) {
  const { need } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('price_low'); // price_low, price_high, rating, recent

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Fetch offers from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getSortedOffers = () => {
    const offers = [...MOCK_OFFERS];
    switch (sortBy) {
      case 'price_low':
        return offers.sort((a, b) => a.price - b.price);
      case 'price_high':
        return offers.sort((a, b) => b.price - a.price);
      case 'rating':
        return offers.sort((a, b) => b.sellerRating - a.sellerRating);
      case 'recent':
        return offers; // Already sorted by recent
      default:
        return offers;
    }
  };

  const sortedOffers = getSortedOffers();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.needSummary}>
        <Text style={styles.needTitle}>{need.title}</Text>
        <Text style={styles.needBudget}>Your budget: ${need.budgetMin} - ${need.budgetMax}</Text>
        <Text style={styles.offersCount}>💬 {MOCK_OFFERS.length} offers received</Text>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
          {[
            { key: 'price_low', label: '💲 Price (Low)' },
            { key: 'price_high', label: '💲 Price (High)' },
            { key: 'rating', label: '⭐ Rating' },
            { key: 'recent', label: '🕐 Recent' },
          ].map((option) => (
            <TouchableOpacity key={option.key} style={[styles.sortChip, sortBy === option.key && styles.sortChipActive]} onPress={() => setSortBy(option.key)}>
              <Text style={[styles.sortChipText, sortBy === option.key && styles.sortChipTextActive]}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {sortedOffers.map((offer, index) => (
          <TouchableOpacity key={offer.id} style={styles.offerCard} onPress={() => navigation.navigate('OfferDetail', { offer, need })}>
            <View style={styles.offerHeader}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>{offer.sellerName[0]}</Text>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{offer.sellerName}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.rating}>⭐ {offer.sellerRating}</Text>
                  <Text style={styles.ratingCount}>({offer.sellerTotalRatings})</Text>
                </View>
              </View>
              {index === 0 && sortBy === 'price_low' && (
                <View style={styles.bestDealBadge}>
                  <Text style={styles.bestDealText}>🏆 Best Price</Text>
                </View>
              )}
              {index === 0 && sortBy === 'rating' && (
                <View style={styles.bestDealBadge}>
                  <Text style={styles.bestDealText}>⭐ Top Rated</Text>
                </View>
              )}
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Offer Price</Text>
              <Text style={styles.price}>${offer.price}</Text>
              {offer.price <= need.budgetMax && offer.price >= need.budgetMin ? (
                <Text style={styles.inBudget}>✅ Within your budget</Text>
              ) : offer.price < need.budgetMin ? (
                <Text style={styles.belowBudget}>💰 Below your budget</Text>
              ) : (
                <Text style={styles.aboveBudget}>⚠️ Above your budget</Text>
              )}
            </View>

            <Text style={styles.offerMessage} numberOfLines={3}>{offer.message}</Text>

            <View style={styles.offerFooter}>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryIcon}>🚚</Text>
                <Text style={styles.deliveryText}>{offer.estimatedDelivery}</Text>
              </View>
              <Text style={styles.offerTime}>{offer.createdAt}</Text>
            </View>

            <View style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Full Offer →</Text>
            </View>
          </TouchableOpacity>
        ))}

        {sortedOffers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No offers yet</Text>
            <Text style={styles.emptySubtext}>Check back soon for seller responses</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 12 },
  backButton: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  needSummary: { backgroundColor: colors.white, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  needTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  needBudget: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  offersCount: { fontSize: 14, fontWeight: '600', color: colors.primary },
  sortContainer: { backgroundColor: colors.white, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  sortLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  sortScroll: { flexDirection: 'row' },
  sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: colors.backgroundSecondary, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  sortChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sortChipText: { fontSize: 13, color: colors.text, fontWeight: '500' },
  sortChipTextActive: { color: colors.white },
  content: { padding: 20 },
  offerCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  offerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sellerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  sellerAvatarText: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 14, fontWeight: '600', color: colors.warning },
  ratingCount: { fontSize: 12, color: colors.textSecondary },
  bestDealBadge: { backgroundColor: colors.success + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  bestDealText: { fontSize: 11, fontWeight: '700', color: colors.success },
  priceSection: { backgroundColor: colors.backgroundSecondary, padding: 12, borderRadius: 12, marginBottom: 12 },
  priceLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  price: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  inBudget: { fontSize: 12, color: colors.success, fontWeight: '600' },
  belowBudget: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  aboveBudget: { fontSize: 12, color: colors.warning, fontWeight: '600' },
  offerMessage: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  offerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 8 },
  deliveryInfo: { flexDirection: 'row', alignItems: 'center' },
  deliveryIcon: { fontSize: 16, marginRight: 6 },
  deliveryText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  offerTime: { fontSize: 12, color: colors.textLight },
  viewDetailsButton: { alignItems: 'center', paddingTop: 8 },
  viewDetailsText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: colors.textSecondary },
});
