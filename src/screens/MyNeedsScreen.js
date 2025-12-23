import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { formatINR } from '../utils/fees';
import { needsAPI } from '../api/needs2';
import { offersAPI } from '../api/offers2';

export default function MyNeedsScreen({ navigation }) {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadNeeds();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNeeds();
    });
    return unsubscribe;
  }, [navigation]);

  const loadNeeds = async () => {
    try {
      const response = await needsAPI.getMyNeeds();
      if (response.success) {
        // Load offer counts for each need
        const needsWithOffers = await Promise.all(
          (response.needs || []).map(async (need) => {
            const offersResponse = await offersAPI.getByNeedId(need.id);
            const offers = offersResponse.success ? offersResponse.offers : [];
            const pendingOffers = offers.filter(o => o.status === 'pending');
            
            return {
              ...need,
              offerCount: offers.length,
              pendingOfferCount: pendingOffers.length,
            };
          })
        );
        setNeeds(needsWithOffers);
      }
    } catch (error) {
      console.error('Load needs error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNeeds();
  };

  // ✅ FIXED: Proper status filtering
  const filteredNeeds = selectedFilter === 'all'
    ? needs
    : selectedFilter === 'active'
    ? needs.filter(n => ['open', 'in_progress', 'delivered'].includes(n.status))
    : needs.filter(n => ['completed', 'closed', 'cancelled'].includes(n.status));

  const allCount = needs.length;
  const activeCount = needs.filter(n => ['open', 'in_progress', 'delivered'].includes(n.status)).length;
  const closedCount = needs.filter(n => ['completed', 'closed', 'cancelled'].includes(n.status)).length;

  // ✅ FIXED: Smart status display based on context
  const getDisplayStatus = (need) => {
    // If need has pending offers and is still open -> Show "Review Offers"
    if (need.status === 'open' && need.pendingOfferCount > 0) {
      return {
        label: 'Review Offers',
        color: colors.warning,
        icon: '👀',
        bgColor: '#FFF4E6',
        actionable: true
      };
    }
    
    // If need is open but no offers yet -> "Awaiting Offers"
    if (need.status === 'open' && need.offerCount === 0) {
      return {
        label: 'Awaiting Offers',
        color: colors.primary,
        icon: '📢',
        bgColor: '#E3F2FD',
        actionable: false
      };
    }

    // If need has an accepted offer -> show accepted status
    if (need.status === 'accepted') {
      return {
        label: 'Offer Accepted',
        color: colors.success,
        icon: '✅',
        bgColor: '#E8F5E9',
        actionable: true
      };
    }

    // If need is open but all offers declined -> "Awaiting Offers"
    if (need.status === 'open' && need.offerCount > 0 && need.pendingOfferCount === 0) {
      return {
        label: 'Awaiting Offers',
        color: colors.primary,
        icon: '📢',
        bgColor: '#E3F2FD',
        actionable: false
      };
    }
    
    // Standard status configs
    const configs = {
      accepted: {
        label: 'Payment Pending',
        color: colors.error,
        icon: '💳',
        bgColor: '#FFEBEE',
        actionable: true
      },
      in_progress: {
        label: 'In Progress',
        color: colors.warning,
        icon: '⚙️',
        bgColor: '#FFF4E6',
        actionable: false
      },
      delivered: {
        label: 'Delivered',
        color: colors.success,
        icon: '✅',
        bgColor: '#E8F5E9',
        actionable: true
      },
      completed: {
        label: 'Completed',
        color: colors.success,
        icon: '🎉',
        bgColor: '#E8F5E9',
        actionable: false
      },
      closed: {
        label: 'Closed',
        color: colors.textSecondary,
        icon: '🔒',
        bgColor: '#F5F5F5',
        actionable: false
      },
      cancelled: {
        label: 'Cancelled',
        color: colors.error,
        icon: '❌',
        bgColor: '#FFEBEE',
        actionable: false
      },
    };
    
    return configs[need.status] || {
      label: need.status,
      color: colors.textSecondary,
      icon: '❓',
      bgColor: '#F5F5F5',
      actionable: false
    };
  };

  const renderNeed = ({ item }) => {
    const statusConfig = getDisplayStatus(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.needCard,
          statusConfig.actionable && styles.needCardActionable
        ]}
        onPress={() => {
          if (item.status === 'open' || item.status === 'accepted' || item.status === 'delivered') {
            navigation.navigate('ViewOffers', { needId: item.id });
          } else if (item.status === 'in_progress') {
            navigation.navigate('BuyerOrderTracking', { orderId: item.orderId });
          }
        }}
      >
        <View style={styles.needHeader}>
          <Text style={styles.needTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <Text style={styles.needDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.needFooter}>
          <View style={styles.needInfo}>
            <Text style={styles.needCategory}>📂 {item.category}</Text>
            <Text style={styles.needBudget}>
              💰 {item.budget ? formatINR(item.budget) : "₹ - ₹"}
            </Text>
          </View>
          <Text style={styles.needLocation}>📍 {item.location?.city || 'Not specified'}</Text>
        </View>

        {item.pendingOfferCount > 0 && (
          <View style={styles.pendingOfferBadge}>
            <Text style={styles.pendingOfferText}>
              {item.pendingOfferCount} pending {item.pendingOfferCount === 1 ? 'offer' : 'offers'} →
            </Text>
          </View>
        )}

        <Text style={styles.needDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Needs</Text>
          <Text style={styles.subtitle}>
            {needs.length} needs posted
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('PostNeed')}
        >
          <Text style={styles.addButtonText}>+ Post Need</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            All ({allCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'active' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('active')}
        >
          <Text style={[styles.filterText, selectedFilter === 'active' && styles.filterTextActive]}>
            Active ({activeCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'closed' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('closed')}
        >
          <Text style={[styles.filterText, selectedFilter === 'closed' && styles.filterTextActive]}>
            Closed ({closedCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredNeeds}
        renderItem={renderNeed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No needs found</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('PostNeed')}
            >
              <Text style={styles.emptyButtonText}>Post Your First Need</Text>
            </TouchableOpacity>
          </View>
        }
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
    paddingBottom: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  filterTextActive: { color: colors.white },
  listContent: { padding: 20, paddingTop: 0 },
  needCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  needCardActionable: {
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  needHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  needTitle: { fontSize: 18, fontWeight: '700', color: colors.text, flex: 1, marginRight: 8 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusIcon: { fontSize: 14 },
  statusText: { fontSize: 12, fontWeight: '600' },
  needDescription: { fontSize: 14, color: colors.textSecondary, marginBottom: 12, lineHeight: 20 },
  needFooter: { marginBottom: 8 },
  needInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  needCategory: { fontSize: 13, color: colors.textSecondary },
  needBudget: { fontSize: 13, color: colors.success, fontWeight: '600' },
  needLocation: { fontSize: 13, color: colors.textSecondary },
  pendingOfferBadge: {
    backgroundColor: colors.warning,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  pendingOfferText: { fontSize: 13, color: colors.white, fontWeight: '700' },
  needDate: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: colors.textSecondary, marginBottom: 20 },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: { color: colors.white, fontWeight: '600', fontSize: 16 },
});
