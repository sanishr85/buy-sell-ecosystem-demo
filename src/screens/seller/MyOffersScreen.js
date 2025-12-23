import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { formatINR } from '../../utils/fees';

// Mock offers data
const MOCK_MY_OFFERS = [
  {
    id: '1',
    needId: 'n1',
    needTitle: 'iPhone 15 Pro Max 256GB',
    buyerName: 'Sarah Smith',
    buyerRating: 4.9,
    price: 1150,
    status: 'accepted',
    createdAt: '2 hours ago',
    acceptedAt: '30 minutes ago',
    estimatedDelivery: '2-3 business days',
  },
  {
    id: '2',
    needId: 'n2',
    needTitle: 'MacBook Pro 14" M3',
    buyerName: 'John Doe',
    buyerRating: 4.7,
    price: 1900,
    status: 'pending',
    createdAt: '5 hours ago',
    estimatedDelivery: '1-2 business days',
  },
  {
    id: '3',
    needId: 'n3',
    needTitle: 'Wedding Photography',
    buyerName: 'Mike Johnson',
    buyerRating: 5.0,
    price: 2800,
    status: 'in_delivery',
    createdAt: '2 days ago',
    acceptedAt: '1 day ago',
    deliveryStarted: '12 hours ago',
    estimatedDelivery: 'Today',
  },
  {
    id: '4',
    needId: 'n4',
    needTitle: 'Home Cleaning Service',
    buyerName: 'Emma Wilson',
    buyerRating: 4.5,
    price: 200,
    status: 'completed',
    createdAt: '5 days ago',
    completedAt: '2 days ago',
    estimatedDelivery: 'Same day',
  },
  {
    id: '5',
    needId: 'n5',
    needTitle: 'Gaming PC Setup',
    buyerName: 'David Lee',
    buyerRating: 4.8,
    price: 1500,
    status: 'rejected',
    createdAt: '1 day ago',
    rejectedAt: '6 hours ago',
    estimatedDelivery: '3-4 business days',
  },
];

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'pending':
        return { bg: colors.warning + '15', text: colors.warning, label: '⏳ Pending' };
      case 'accepted':
        return { bg: colors.success + '15', text: colors.success, label: '✅ Accepted' };
      case 'in_delivery':
        return { bg: colors.primary + '15', text: colors.primary, label: '🚚 In Delivery' };
      case 'completed':
        return { bg: colors.textSecondary + '15', text: colors.textSecondary, label: '🎉 Completed' };
      case 'rejected':
        return { bg: colors.danger + '15', text: colors.danger, label: '❌ Rejected' };
      default:
        return { bg: colors.border, text: colors.textSecondary, label: status };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
      <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
    </View>
  );
};

export default function MyOffersScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, in_delivery, completed

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Fetch offers from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getFilteredOffers = () => {
    if (filter === 'all') return MOCK_MY_OFFERS;
    return MOCK_MY_OFFERS.filter(o => o.status === filter);
  };

  const filteredOffers = getFilteredOffers();

  const getStats = () => {
    return {
      pending: MOCK_MY_OFFERS.filter(o => o.status === 'pending').length,
      accepted: MOCK_MY_OFFERS.filter(o => o.status === 'accepted').length,
      inDelivery: MOCK_MY_OFFERS.filter(o => o.status === 'in_delivery').length,
      completed: MOCK_MY_OFFERS.filter(o => o.status === 'completed').length,
    };
  };

  const stats = getStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Offers</Text>
          <Text style={styles.subtitle}>{MOCK_MY_OFFERS.length} total offers</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={styles.statsContent}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.accepted}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.inDelivery}</Text>
          <Text style={styles.statLabel}>In Delivery</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </ScrollView>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {['all', 'pending', 'accepted', 'in_delivery', 'completed'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
              {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : f === 'accepted' ? 'Accepted' : f === 'in_delivery' ? 'In Delivery' : 'Completed'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {filteredOffers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No offers found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        ) : (
          filteredOffers.map((offer) => (
            <TouchableOpacity key={offer.id} style={styles.offerCard} onPress={() => navigation.navigate('OfferDetails', { offer })}>
              <View style={styles.offerHeader}>
                <View style={styles.offerHeaderLeft}>
                  <Text style={styles.offerTitle}>{offer.needTitle}</Text>
                  <View style={styles.buyerRow}>
                    <Text style={styles.buyerName}>Buyer: {offer.buyerName}</Text>
                    <Text style={styles.buyerRating}>⭐ {offer.buyerRating}</Text>
                  </View>
                </View>
                <StatusBadge status={offer.status} />
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Your Offer</Text>
                <Text style={styles.priceValue}>{formatINR(offer.price)}</Text>
              </View>

              {offer.status === 'pending' && (
                <View style={styles.offerFooter}>
                  <Text style={styles.footerText}>⏳ Waiting for buyer's response</Text>
                  <Text style={styles.footerTime}>{offer.createdAt}</Text>
                </View>
              )}

              {offer.status === 'accepted' && (
                <View style={styles.acceptedFooter}>
                  <Text style={styles.acceptedText}>✅ Offer accepted! Prepare for delivery</Text>
                  <Text style={styles.footerTime}>Accepted {offer.acceptedAt}</Text>
                </View>
              )}

              {offer.status === 'in_delivery' && (
                <View style={styles.deliveryFooter}>
                  <Text style={styles.deliveryText}>🚚 In transit • Est. delivery: {offer.estimatedDelivery}</Text>
                  <Text style={styles.footerTime}>Started {offer.deliveryStarted}</Text>
                </View>
              )}

              {offer.status === 'completed' && (
                <View style={styles.completedFooter}>
                  <Text style={styles.completedText}>🎉 Completed • Funds released</Text>
                  <Text style={styles.footerTime}>{offer.completedAt}</Text>
                </View>
              )}

              {offer.status === 'rejected' && (
                <View style={styles.rejectedFooter}>
                  <Text style={styles.rejectedText}>❌ Buyer declined this offer</Text>
                  <Text style={styles.footerTime}>Rejected {offer.rejectedAt}</Text>
                </View>
              )}

              <View style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  settingsButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  settingsIcon: { fontSize: 22 },
  statsScroll: { maxHeight: 100, marginBottom: 16 },
  statsContent: { paddingHorizontal: 20, gap: 12 },
  statCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, minWidth: 100, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  filterScroll: { maxHeight: 50, marginBottom: 16 },
  filterContent: { paddingHorizontal: 20, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.backgroundSecondary, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  filterChipTextActive: { color: colors.white },
  content: { padding: 20, paddingTop: 0 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: colors.textSecondary },
  offerCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  offerHeaderLeft: { flex: 1, marginRight: 12 },
  offerTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 6 },
  buyerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buyerName: { fontSize: 13, color: colors.textSecondary },
  buyerRating: { fontSize: 13, fontWeight: '600', color: colors.warning },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.backgroundSecondary, padding: 12, borderRadius: 8, marginBottom: 12 },
  priceLabel: { fontSize: 13, color: colors.textSecondary },
  priceValue: { fontSize: 20, fontWeight: 'bold', color: colors.success },
  offerFooter: { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 8 },
  footerText: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  footerTime: { fontSize: 12, color: colors.textLight },
  acceptedFooter: { backgroundColor: colors.success + '10', padding: 12, borderRadius: 8, marginBottom: 8 },
  acceptedText: { fontSize: 13, fontWeight: '600', color: colors.success, marginBottom: 4 },
  deliveryFooter: { backgroundColor: colors.primary + '10', padding: 12, borderRadius: 8, marginBottom: 8 },
  deliveryText: { fontSize: 13, fontWeight: '600', color: colors.primary, marginBottom: 4 },
  completedFooter: { backgroundColor: colors.textSecondary + '10', padding: 12, borderRadius: 8, marginBottom: 8 },
  completedText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  rejectedFooter: { backgroundColor: colors.danger + '10', padding: 12, borderRadius: 8, marginBottom: 8 },
  rejectedText: { fontSize: 13, fontWeight: '600', color: colors.danger, marginBottom: 4 },
  viewDetailsButton: { alignItems: 'center', paddingTop: 8 },
  viewDetailsText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
