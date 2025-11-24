import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { offersAPI } from '../api/offers';

const statusConfig = {
  pending: { label: 'Pending', color: '#f59e0b', bgColor: '#fef3c7', emoji: '⏳' },
  accepted: { label: 'Accepted', color: '#10b981', bgColor: '#d1fae5', emoji: '✅' },
  declined: { label: 'Declined', color: '#ef4444', bgColor: '#fee2e2', emoji: '❌' },
};

export default function MyOffersScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load offers when screen mounts
  useEffect(() => {
    loadMyOffers();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMyOffers();
    });
    return unsubscribe;
  }, [navigation]);

  const loadMyOffers = async () => {
    try {
      console.log('📋 Loading my sent offers...');
      
      // Get auth token
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to view your offers');
        navigation.navigate('Login');
        return;
      }

      // Call backend API
      const response = await offersAPI.getMySent(token);
      
      console.log('✅ My offers loaded:', response);

      if (response.success) {
        setOffers(response.offers || []);
      } else {
        Alert.alert('Error', response.message || 'Failed to load offers');
      }
    } catch (error) {
      console.error('❌ Load my offers error:', error);
      Alert.alert('Error', 'Unable to load your offers. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMyOffers();
  };

  // Calculate stats
  const stats = {
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    declined: offers.filter(o => o.status === 'declined').length,
  };

  // Filter offers
  const filteredOffers = offers.filter(offer => {
    const matchesFilter = selectedFilter === 'all' || offer.status === selectedFilter;
    const matchesSearch = 
      offer.need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.buyer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  const handleViewDetails = (offer) => {
    navigation.navigate('OfferDetails', { offerId: offer.id, offer });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Offers</Text>
        <Text style={styles.headerSubtitle}>
          {loading ? 'Loading...' : `${offers.length} total offers`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your offers...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Stats Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
            <View style={[styles.statCard, { borderLeftColor: '#6366f1' }]}>
              <Text style={styles.statNumber}>{offers.length}</Text>
              <Text style={styles.statLabel}>Total Offers</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: statusConfig.pending.color }]}>
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: statusConfig.accepted.color }]}>
              <Text style={styles.statNumber}>{stats.accepted}</Text>
              <Text style={styles.statLabel}>Accepted</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: statusConfig.declined.color }]}>
              <Text style={styles.statNumber}>{stats.declined}</Text>
              <Text style={styles.statLabel}>Declined</Text>
            </View>
          </ScrollView>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search offers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.filterTabTextActive]}>
                All ({offers.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedFilter === 'pending' && styles.filterTabActive]}
              onPress={() => setSelectedFilter('pending')}
            >
              <Text style={[styles.filterTabText, selectedFilter === 'pending' && styles.filterTabTextActive]}>
                Pending ({stats.pending})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedFilter === 'accepted' && styles.filterTabActive]}
              onPress={() => setSelectedFilter('accepted')}
            >
              <Text style={[styles.filterTabText, selectedFilter === 'accepted' && styles.filterTabTextActive]}>
                Accepted ({stats.accepted})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedFilter === 'declined' && styles.filterTabActive]}
              onPress={() => setSelectedFilter('declined')}
            >
              <Text style={[styles.filterTabText, selectedFilter === 'declined' && styles.filterTabTextActive]}>
                Declined ({stats.declined})
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Offers List */}
          <View style={styles.offersContainer}>
            {filteredOffers.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>📭</Text>
                <Text style={styles.emptyStateTitle}>
                  {searchQuery ? 'No matching offers' : 
                   selectedFilter === 'all' ? 'No offers yet' : `No ${selectedFilter} offers`}
                </Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery ? 'Try a different search term' : 
                   selectedFilter === 'all' ? 'Start making offers on needs to see them here' :
                   'You don\'t have any offers with this status'}
                </Text>
                {selectedFilter === 'all' && !searchQuery && (
                  <TouchableOpacity 
                    style={styles.emptyButton}
                    onPress={() => navigation.navigate('NeedsFeed')}
                  >
                    <Text style={styles.emptyButtonText}>Browse Needs</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              filteredOffers.map(offer => (
                <View key={offer.id} style={styles.offerCard}>
                  {/* Status Badge */}
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig[offer.status]?.bgColor || '#f3f4f6' }]}>
                    <Text style={styles.statusEmoji}>{statusConfig[offer.status]?.emoji || '📄'}</Text>
                    <Text style={[styles.statusText, { color: statusConfig[offer.status]?.color || '#6b7280' }]}>
                      {statusConfig[offer.status]?.label || offer.status}
                    </Text>
                  </View>

                  {/* Offer Header */}
                  <View style={styles.offerHeader}>
                    <View style={styles.offerHeaderLeft}>
                      <Text style={styles.offerTitle} numberOfLines={2}>
                        {offer.need.title}
                      </Text>
                      <View style={styles.buyerInfo}>
                        <Text style={styles.buyerName}>Buyer: {offer.buyer.name}</Text>
                      </View>
                    </View>
                    <View style={styles.offerAmount}>
                      <Text style={styles.amountLabel}>Your Offer</Text>
                      <Text style={styles.amountValue}>${offer.amount}</Text>
                    </View>
                  </View>

                  {/* Offer Description */}
                  <Text style={styles.offerDescription} numberOfLines={2}>
                    {offer.description}
                  </Text>

                  {/* Offer Details */}
                  <View style={styles.offerDetails}>
                    {offer.need.location?.address && (
                      <Text style={styles.offerLocation}>
                        📍 {offer.need.location.address}
                      </Text>
                    )}
                    <Text style={styles.offerTime}>
                      🕐 {getTimeAgo(offer.createdAt)}
                    </Text>
                  </View>

                  {offer.deliveryTime && (
                    <Text style={styles.deliveryTime}>
                      ⏱️ Delivery: {offer.deliveryTime}
                    </Text>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.actionButtonSecondary]}
                      onPress={() => handleViewDetails(offer)}
                    >
                      <Text style={styles.actionButtonSecondaryText}>View Details</Text>
                    </TouchableOpacity>

                    {offer.status === 'accepted' && (
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonPrimary]}
                        onPress={() => Alert.alert('Start Work', 'This feature will be available soon. You\'ll be able to track your delivery progress here.')}
                      >
                        <Text style={styles.actionButtonPrimaryText}>🚀 Start Work</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  content: { flex: 1 },
  
  // Stats
  statsContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  statCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, marginRight: 12, minWidth: 100, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statNumber: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  
  // Search
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 20, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: colors.text },
  
  // Filters
  filterContainer: { paddingHorizontal: 20, marginBottom: 20 },
  filterTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.backgroundSecondary, marginRight: 8 },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  filterTabTextActive: { color: colors.white },
  
  // Offers
  offersContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  offerCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  statusEmoji: { fontSize: 14, marginRight: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  offerHeaderLeft: { flex: 1, marginRight: 12 },
  offerTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  buyerInfo: { flexDirection: 'row', alignItems: 'center' },
  buyerName: { fontSize: 14, color: colors.textSecondary },
  
  offerAmount: { alignItems: 'flex-end' },
  amountLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  amountValue: { fontSize: 22, fontWeight: '700', color: colors.success },

  offerDescription: { fontSize: 14, color: colors.textSecondary, marginBottom: 12, lineHeight: 20 },
  
  offerDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  offerLocation: { fontSize: 13, color: colors.textSecondary, flex: 1, marginRight: 8 },
  offerTime: { fontSize: 13, color: colors.textSecondary },

  deliveryTime: { fontSize: 13, color: colors.text, marginBottom: 12, fontWeight: '500' },
  
  // Actions
  actionButtons: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionButtonPrimary: { backgroundColor: colors.primary },
  actionButtonPrimaryText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  actionButtonSecondary: { backgroundColor: colors.backgroundSecondary },
  actionButtonSecondaryText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  
  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyStateEmoji: { fontSize: 64, marginBottom: 16 },
  emptyStateTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' },
  emptyStateText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyButton: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  emptyButtonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
});
