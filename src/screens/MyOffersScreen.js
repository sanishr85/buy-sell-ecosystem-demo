import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors } from '../theme/colors';

const mockOffers = [
  {
    id: '1',
    needTitle: 'Need a plumber for kitchen sink repair',
    buyerName: 'John Smith',
    buyerRating: 4.8,
    amount: 150,
    status: 'pending',
    createdAt: '2 hours ago',
    location: 'Brooklyn, NY',
    description: 'I can fix your kitchen sink. I have 10 years experience in plumbing.',
  },
  {
    id: '2',
    needTitle: 'Looking for graphic designer for logo',
    buyerName: 'Sarah Johnson',
    buyerRating: 4.9,
    amount: 500,
    status: 'accepted',
    createdAt: '1 day ago',
    location: 'Manhattan, NY',
    description: 'I will create 3 logo concepts for you to choose from.',
    acceptedAt: '5 hours ago',
  },
  {
    id: '3',
    needTitle: 'Dog walking service needed',
    buyerName: 'Mike Brown',
    buyerRating: 5.0,
    amount: 30,
    status: 'in_delivery',
    createdAt: '3 days ago',
    location: 'Queens, NY',
    description: 'Daily dog walking service for 1 hour.',
    deliveryStartedAt: '2 hours ago',
  },
  {
    id: '4',
    needTitle: 'House cleaning service',
    buyerName: 'Emily Davis',
    buyerRating: 4.7,
    amount: 120,
    status: 'completed',
    createdAt: '5 days ago',
    location: 'Bronx, NY',
    description: 'Deep cleaning of 2 bedroom apartment.',
    completedAt: '2 days ago',
    rated: false,
  },
  {
    id: '5',
    needTitle: 'Photography for wedding',
    buyerName: 'David Wilson',
    buyerRating: 4.6,
    amount: 1200,
    status: 'completed',
    createdAt: '2 weeks ago',
    location: 'Staten Island, NY',
    description: '8 hour wedding photography with edited photos.',
    completedAt: '1 week ago',
    rated: true,
    myRating: 5,
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: '#f59e0b', bgColor: '#fef3c7', emoji: '⏳' },
  accepted: { label: 'Accepted', color: '#10b981', bgColor: '#d1fae5', emoji: '✅' },
  in_delivery: { label: 'In Progress', color: '#6366f1', bgColor: '#e0e7ff', emoji: '🚀' },
  completed: { label: 'Completed', color: '#8b5cf6', bgColor: '#ede9fe', emoji: '🎉' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bgColor: '#fee2e2', emoji: '❌' },
};

export default function MyOffersScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    pending: mockOffers.filter(o => o.status === 'pending').length,
    accepted: mockOffers.filter(o => o.status === 'accepted').length,
    in_delivery: mockOffers.filter(o => o.status === 'in_delivery').length,
    completed: mockOffers.filter(o => o.status === 'completed').length,
  };

  const filteredOffers = mockOffers.filter(offer => {
    const matchesFilter = selectedFilter === 'all' || offer.status === selectedFilter;
    const matchesSearch = offer.needTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStartDelivery = (offer) => {
    navigation.navigate('DeliveryInitiation', { offer });
  };

  const handleRateBuyer = (offer) => {
    navigation.navigate('RateBuyer', { offer });
  };

  const handleViewDetails = (offer) => {
    navigation.navigate('OfferDetails', { offer });
  };

  const handleMarkComplete = (offer) => {
    Alert.alert(
      'Mark as Complete?',
      'Confirm that you have fulfilled this service/delivery. The buyer will be asked to confirm.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', 'Completion request sent to buyer for confirmation.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Offers</Text>
        <Text style={styles.headerSubtitle}>Manage your offers and deliveries</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
          <View style={[styles.statCard, { borderLeftColor: statusConfig.pending.color }]}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: statusConfig.accepted.color }]}>
            <Text style={styles.statNumber}>{stats.accepted}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: statusConfig.in_delivery.color }]}>
            <Text style={styles.statNumber}>{stats.in_delivery}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: statusConfig.completed.color }]}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
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
              All ({mockOffers.length})
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
            style={[styles.filterTab, selectedFilter === 'in_delivery' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('in_delivery')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'in_delivery' && styles.filterTabTextActive]}>
              In Progress ({stats.in_delivery})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'completed' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'completed' && styles.filterTabTextActive]}>
              Completed ({stats.completed})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Offers List */}
        <View style={styles.offersContainer}>
          {filteredOffers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📭</Text>
              <Text style={styles.emptyStateTitle}>No offers found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try a different search term' : 'Your offers will appear here'}
              </Text>
            </View>
          ) : (
            filteredOffers.map(offer => (
              <View key={offer.id} style={styles.offerCard}>
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: statusConfig[offer.status].bgColor }]}>
                  <Text style={styles.statusEmoji}>{statusConfig[offer.status].emoji}</Text>
                  <Text style={[styles.statusText, { color: statusConfig[offer.status].color }]}>
                    {statusConfig[offer.status].label}
                  </Text>
                </View>

                {/* Offer Header */}
                <View style={styles.offerHeader}>
                  <View style={styles.offerHeaderLeft}>
                    <Text style={styles.offerTitle} numberOfLines={2}>{offer.needTitle}</Text>
                    <View style={styles.buyerInfo}>
                      <Text style={styles.buyerName}>{offer.buyerName}</Text>
                      <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>⭐ {offer.buyerRating}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.offerAmount}>
                    <Text style={styles.amountLabel}>Your Offer</Text>
                    <Text style={styles.amountValue}>${offer.amount}</Text>
                  </View>
                </View>

                {/* Offer Details */}
                <View style={styles.offerDetails}>
                  <Text style={styles.offerLocation}>📍 {offer.location}</Text>
                  <Text style={styles.offerTime}>🕐 {offer.createdAt}</Text>
                </View>

                {/* Action Buttons Based on Status */}
                <View style={styles.actionButtons}>
                  {offer.status === 'pending' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonSecondary]}
                        onPress={() => handleViewDetails(offer)}
                      >
                        <Text style={styles.actionButtonSecondaryText}>View Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonDanger]}
                        onPress={() => Alert.alert('Withdraw Offer', 'Are you sure you want to withdraw this offer?')}
                      >
                        <Text style={styles.actionButtonDangerText}>Withdraw</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {offer.status === 'accepted' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonSecondary]}
                        onPress={() => handleViewDetails(offer)}
                      >
                        <Text style={styles.actionButtonSecondaryText}>View Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonPrimary]}
                        onPress={() => handleStartDelivery(offer)}
                      >
                        <Text style={styles.actionButtonPrimaryText}>🚀 Start Delivery</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {offer.status === 'in_delivery' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonSecondary]}
                        onPress={() => handleViewDetails(offer)}
                      >
                        <Text style={styles.actionButtonSecondaryText}>Track Progress</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonSuccess]}
                        onPress={() => handleMarkComplete(offer)}
                      >
                        <Text style={styles.actionButtonSuccessText}>✓ Mark Complete</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {offer.status === 'completed' && (
                    <>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.actionButtonSecondary]}
                        onPress={() => handleViewDetails(offer)}
                      >
                        <Text style={styles.actionButtonSecondaryText}>View Receipt</Text>
                      </TouchableOpacity>
                      {!offer.rated ? (
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.actionButtonPrimary]}
                          onPress={() => handleRateBuyer(offer)}
                        >
                          <Text style={styles.actionButtonPrimaryText}>⭐ Rate Buyer</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.ratedBadge}>
                          <Text style={styles.ratedText}>✓ Rated {offer.myRating}⭐</Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary },
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
  buyerName: { fontSize: 14, color: colors.textSecondary, marginRight: 8 },
  ratingBadge: { backgroundColor: colors.backgroundSecondary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingText: { fontSize: 12, fontWeight: '600', color: colors.text },
  
  offerAmount: { alignItems: 'flex-end' },
  amountLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  amountValue: { fontSize: 22, fontWeight: '700', color: colors.success },
  
  offerDetails: { flexDirection: 'row', marginBottom: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  offerLocation: { fontSize: 14, color: colors.textSecondary, marginRight: 16, flex: 1 },
  offerTime: { fontSize: 14, color: colors.textSecondary },
  
  // Actions
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionButtonPrimary: { backgroundColor: colors.primary },
  actionButtonPrimaryText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  actionButtonSecondary: { backgroundColor: colors.backgroundSecondary },
  actionButtonSecondaryText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  actionButtonSuccess: { backgroundColor: colors.success },
  actionButtonSuccessText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  actionButtonDanger: { backgroundColor: '#fee2e2' },
  actionButtonDangerText: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
  
  ratedBadge: { flex: 1, backgroundColor: '#ede9fe', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  ratedText: { color: '#8b5cf6', fontSize: 14, fontWeight: '700' },
  
  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyStateEmoji: { fontSize: 64, marginBottom: 16 },
  emptyStateTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
});
