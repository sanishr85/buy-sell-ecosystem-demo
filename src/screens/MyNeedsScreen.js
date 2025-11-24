import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { needsAPI } from '../api/needs';

export default function MyNeedsScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load needs when screen mounts
  useEffect(() => {
    loadMyNeeds();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMyNeeds();
    });
    return unsubscribe;
  }, [navigation]);

  const loadMyNeeds = async () => {
    try {
      console.log('📋 Loading my needs...');
      
      // Get auth token
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to view your needs');
        navigation.navigate('Login');
        return;
      }

      // Call backend API
      const response = await needsAPI.getMyNeeds(token);
      
      console.log('✅ My needs response:', response);

      if (response.success) {
        setNeeds(response.needs || []);
      } else {
        Alert.alert('Error', response.message || 'Failed to load needs');
      }
    } catch (error) {
      console.error('❌ Load my needs error:', error);
      Alert.alert('Error', 'Unable to load your needs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMyNeeds();
  };

  // Filter needs by status
  const filteredNeeds = needs.filter(need => {
    if (selectedFilter === 'all') return true;
    return need.status === selectedFilter;
  });

  // Calculate counts for each filter
  const allCount = needs.length;
  const activeCount = needs.filter(n => n.status === 'active').length;
  const closedCount = needs.filter(n => n.status === 'closed').length;

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Needs</Text>
          <Text style={styles.headerSubtitle}>Track your posted needs</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.filterTabTextActive]}>
              All ({allCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'active' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('active')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'active' && styles.filterTabTextActive]}>
              Active ({activeCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'closed' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('closed')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'closed' && styles.filterTabTextActive]}>
              Closed ({closedCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading your needs...</Text>
          </View>
        ) : filteredNeeds.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'all' 
                ? "No needs posted yet" 
                : `No ${selectedFilter} needs`}
            </Text>
            <Text style={styles.emptyText}>
              {selectedFilter === 'all'
                ? "Post your first need and start receiving offers from sellers"
                : `You don't have any ${selectedFilter} needs at the moment`}
            </Text>
            {selectedFilter === 'all' && (
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => navigation.navigate('PostNeed')}
              >
                <Text style={styles.emptyButtonText}>Post Your First Need</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* Needs List */
          <View style={styles.needsContainer}>
            {filteredNeeds.map(need => (
              <TouchableOpacity 
                key={need.id} 
                style={styles.needCard}
                onPress={() => navigation.navigate('ViewOffers', { needId: need.id, need })}
              >
                <View style={styles.needHeader}>
                  <Text style={styles.needTitle}>{need.title}</Text>
                  <View style={[
                    styles.statusBadge,
                    need.status === 'active' ? styles.statusActive : styles.statusClosed
                  ]}>
                    <Text style={styles.statusText}>
                      {need.status === 'active' ? '🟢 Active' : '🔒 Closed'}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.needDescription} numberOfLines={2}>
                  {need.description}
                </Text>
                
                <Text style={styles.needCategory}>📁 {need.category}</Text>
                {need.budgetMin && need.budgetMax && (
                  <Text style={styles.needBudget}>
                    💰 ${need.budgetMin} - ${need.budgetMax}
                  </Text>
                )}
                {need.location?.address && (
                  <Text style={styles.needLocation}>
                    📍 {need.location.address}
                  </Text>
                )}
                
                <View style={styles.needFooter}>
                  <Text style={styles.needTime}>
                    🕐 {getTimeAgo(need.createdAt)}
                  </Text>
                  <TouchableOpacity 
                    style={[
                      styles.offersButton,
                      need.offersCount === 0 && styles.offersButtonEmpty
                    ]}
                    onPress={() => navigation.navigate('ViewOffers', { needId: need.id, need })}
                  >
                    <Text style={[
                      styles.offersButtonText,
                      need.offersCount === 0 && styles.offersButtonTextEmpty
                    ]}>
                      {need.offersCount} {need.offersCount === 1 ? 'Offer' : 'Offers'} →
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Post New Need Button */}
        {!loading && (
          <TouchableOpacity 
            style={styles.postNewButton}
            onPress={() => navigation.navigate('PostNeed')}
          >
            <Text style={styles.postNewButtonText}>+ Post New Need</Text>
          </TouchableOpacity>
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
  content: { flex: 1 },
  filterContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  filterTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.backgroundSecondary, marginRight: 8 },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  filterTabTextActive: { color: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  emptyButton: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  emptyButtonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  needsContainer: { paddingHorizontal: 20 },
  needCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  needHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  needTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text, marginRight: 12 },
  needDescription: { fontSize: 14, color: colors.textSecondary, marginBottom: 12, lineHeight: 20 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusActive: { backgroundColor: '#d1fae5' },
  statusClosed: { backgroundColor: '#fee2e2' },
  statusText: { fontSize: 12, fontWeight: '700' },
  needCategory: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  needBudget: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  needLocation: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  needFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  needTime: { fontSize: 13, color: colors.textSecondary },
  offersButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  offersButtonEmpty: { backgroundColor: colors.backgroundSecondary },
  offersButtonText: { fontSize: 13, fontWeight: '700', color: colors.white },
  offersButtonTextEmpty: { color: colors.textSecondary },
  postNewButton: { backgroundColor: colors.primary, marginHorizontal: 20, marginTop: 16, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  postNewButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
