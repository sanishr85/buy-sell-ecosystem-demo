import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

// Mock data - will come from API later
const MOCK_MY_NEEDS = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Looking for a brand new iPhone 15 Pro Max in Natural Titanium color.',
    category: 'Electronics',
    budgetMin: 1000,
    budgetMax: 1200,
    status: 'open',
    offersCount: 5,
    createdAt: '2 hours ago',
    expiresIn: '5 days',
  },
  {
    id: '2',
    title: 'Wedding Photography Service',
    description: 'Need professional photographer for wedding on Dec 20th.',
    category: 'Services',
    budgetMin: 2000,
    budgetMax: 3500,
    status: 'accepted',
    offersCount: 8,
    acceptedOffer: {
      sellerName: 'Mike\'s Photography',
      price: 2800,
    },
    createdAt: '1 day ago',
    expiresIn: '2 days',
  },
  {
    id: '3',
    title: 'MacBook Air M2',
    description: 'Looking for MacBook Air with M2 chip, 16GB RAM.',
    category: 'Electronics',
    budgetMin: 900,
    budgetMax: 1100,
    status: 'completed',
    offersCount: 3,
    createdAt: '5 days ago',
    completedAt: '2 days ago',
  },
];

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'open':
        return { bg: colors.primary + '15', text: colors.primary, label: '📢 Open' };
      case 'accepted':
        return { bg: colors.success + '15', text: colors.success, label: '✅ In Progress' };
      case 'completed':
        return { bg: colors.textSecondary + '15', text: colors.textSecondary, label: '🎉 Completed' };
      case 'expired':
        return { bg: colors.danger + '15', text: colors.danger, label: '⏰ Expired' };
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

export default function MyNeedsScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, open, in_progress, completed

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Fetch needs from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getFilteredNeeds = () => {
    if (filter === 'all') return MOCK_MY_NEEDS;
    if (filter === 'open') return MOCK_MY_NEEDS.filter(n => n.status === 'open');
    if (filter === 'in_progress') return MOCK_MY_NEEDS.filter(n => n.status === 'accepted');
    if (filter === 'completed') return MOCK_MY_NEEDS.filter(n => n.status === 'completed');
    return MOCK_MY_NEEDS;
  };

  const filteredNeeds = getFilteredNeeds();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Needs</Text>
          <Text style={styles.subtitle}>{MOCK_MY_NEEDS.length} total needs</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {['all', 'open', 'in_progress', 'completed'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
              {f === 'all' ? 'All' : f === 'open' ? 'Open' : f === 'in_progress' ? 'In Progress' : 'Completed'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {filteredNeeds.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No needs found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        ) : (
          filteredNeeds.map((need) => (
            <TouchableOpacity key={need.id} style={styles.needCard} onPress={() => navigation.navigate('NeedOffers', { need })}>
              <View style={styles.needHeader}>
                <View style={styles.needHeaderLeft}>
                  <Text style={styles.needTitle}>{need.title}</Text>
                  <Text style={styles.needCategory}>{need.category}</Text>
                </View>
                <StatusBadge status={need.status} />
              </View>

              <Text style={styles.needDescription} numberOfLines={2}>{need.description}</Text>

              <View style={styles.needMeta}>
                <Text style={styles.needBudget}>${need.budgetMin} - ${need.budgetMax}</Text>
                <Text style={styles.needDot}>•</Text>
                <Text style={styles.needTime}>{need.createdAt}</Text>
              </View>

              {need.status === 'open' && (
                <View style={styles.needFooter}>
                  <View style={styles.offersCount}>
                    <Text style={styles.offersCountText}>💬 {need.offersCount} offers received</Text>
                  </View>
                  <Text style={styles.expiresText}>Expires in {need.expiresIn}</Text>
                </View>
              )}

              {need.status === 'accepted' && need.acceptedOffer && (
                <View style={styles.acceptedCard}>
                  <Text style={styles.acceptedLabel}>Accepted Offer:</Text>
                  <Text style={styles.acceptedSeller}>{need.acceptedOffer.sellerName}</Text>
                  <Text style={styles.acceptedPrice}>${need.acceptedOffer.price}</Text>
                </View>
              )}

              {need.status === 'completed' && (
                <View style={styles.completedFooter}>
                  <Text style={styles.completedText}>✅ Completed {need.completedAt}</Text>
                </View>
              )}

              <View style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PostNeed')}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
  needCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  needHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  needHeaderLeft: { flex: 1, marginRight: 12 },
  needTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  needCategory: { fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', fontWeight: '600' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  needDescription: { fontSize: 15, color: colors.textSecondary, marginBottom: 12, lineHeight: 20 },
  needMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  needBudget: { fontSize: 16, fontWeight: '700', color: colors.success },
  needDot: { fontSize: 14, color: colors.textLight, marginHorizontal: 8 },
  needTime: { fontSize: 13, color: colors.textSecondary },
  needFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 8 },
  offersCount: { backgroundColor: colors.primary + '10', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  offersCountText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  expiresText: { fontSize: 12, color: colors.textLight },
  acceptedCard: { backgroundColor: colors.success + '10', padding: 12, borderRadius: 8, marginBottom: 8 },
  acceptedLabel: { fontSize: 12, color: colors.success, marginBottom: 4 },
  acceptedSeller: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 },
  acceptedPrice: { fontSize: 16, fontWeight: '700', color: colors.success },
  completedFooter: { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 8 },
  completedText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  viewDetailsButton: { alignItems: 'center', paddingTop: 8 },
  viewDetailsText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  fabIcon: { fontSize: 32, color: colors.white, fontWeight: '300' },
});
