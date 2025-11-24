import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { needsAPI } from '../../api/needs';

export default function NeedsFeedScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [needs, setNeeds] = useState([]);
  const [categories, setCategories] = useState(['All']);

  // Load needs when screen mounts
  useEffect(() => {
    loadNeeds();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadNeeds();
    });
    return unsubscribe;
  }, [navigation]);

  const loadNeeds = async () => {
    try {
      console.log('📋 Loading all needs...');
      
      // Call backend API (public endpoint, no auth needed)
      const response = await needsAPI.getAll({ status: 'active' });
      
      console.log('✅ Needs loaded:', response);

      if (response.success) {
        setNeeds(response.needs || []);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(
          (response.needs || []).map(need => need.category)
        )];
        setCategories(uniqueCategories);
      } else {
        Alert.alert('Error', response.message || 'Failed to load needs');
      }
    } catch (error) {
      console.error('❌ Load needs error:', error);
      Alert.alert('Error', 'Unable to load needs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNeeds();
  };

  // Filter needs by category
  const filteredNeeds = selectedCategory === 'All' 
    ? needs 
    : needs.filter(need => need.category === selectedCategory);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Available Needs</Text>
          <Text style={styles.subtitle}>
            {loading ? 'Loading...' : `${filteredNeeds.length} opportunities`}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.myOffersButton} 
        onPress={() => navigation.navigate('MyOffers')}
      >
        <View style={styles.myOffersLeft}>
          <Text style={styles.myOffersIcon}>📋</Text>
          <View>
            <Text style={styles.myOffersTitle}>My Offers</Text>
            <Text style={styles.myOffersSubtext}>Track your submitted offers</Text>
          </View>
        </View>
        <Text style={styles.myOffersArrow}>→</Text>
      </TouchableOpacity>

      {/* Categories Filter */}
      {!loading && categories.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll} 
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[
                styles.categoryChip, 
                selectedCategory === cat && styles.categoryChipActive
              ]} 
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryChipText, 
                selectedCategory === cat && styles.categoryChipTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading needs...</Text>
        </View>
      ) : filteredNeeds.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>
            {selectedCategory === 'All' 
              ? 'No active needs yet' 
              : `No needs in ${selectedCategory}`}
          </Text>
          <Text style={styles.emptyText}>
            {selectedCategory === 'All'
              ? 'Check back soon for new opportunities'
              : 'Try selecting a different category'}
          </Text>
          {selectedCategory !== 'All' && (
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setSelectedCategory('All')}
            >
              <Text style={styles.emptyButtonText}>View All Categories</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        /* Needs List */
        <ScrollView 
          contentContainerStyle={styles.content} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredNeeds.map((need) => (
            <TouchableOpacity 
              key={need.id} 
              style={styles.needCard} 
              onPress={() => navigation.navigate('NeedDetail', { needId: need.id, need })}
            >
              <View style={styles.needHeader}>
                <View style={styles.needHeaderLeft}>
                  <Text style={styles.needTitle}>{need.title}</Text>
                  <Text style={styles.needCategory}>{need.category}</Text>
                </View>
                {need.budgetMin && need.budgetMax && (
                  <View style={styles.budgetBadge}>
                    <Text style={styles.budgetText}>
                      ${need.budgetMin}-${need.budgetMax}
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.needDescription} numberOfLines={2}>
                {need.description}
              </Text>
              
              <View style={styles.needFooter}>
                <View style={styles.needFooterLeft}>
                  {need.location?.address && (
                    <Text style={styles.needLocation}>
                      📍 {need.location.address}
                    </Text>
                  )}
                </View>
                <Text style={styles.timeAgo}>
                  {getTimeAgo(need.createdAt)}
                </Text>
              </View>
              
              <View style={styles.buyerInfo}>
                <Text style={styles.buyerName}>
                  Posted by {need.buyerName || 'Buyer'}
                </Text>
                {need.buyerRating && (
                  <Text style={styles.buyerRating}>
                    ⭐ {need.buyerRating.average || 0}
                  </Text>
                )}
              </View>

              {/* Make Offer Button */}
              <TouchableOpacity 
                style={styles.makeOfferButton}
                onPress={() => navigation.navigate('CreateOffer', { needId: need.id, need })}
              >
                <Text style={styles.makeOfferButtonText}>💼 Make an Offer</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  settingsButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  settingsIcon: { fontSize: 22 },
  myOffersButton: { marginHorizontal: 20, marginBottom: 16, backgroundColor: colors.white, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  myOffersLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  myOffersIcon: { fontSize: 32, marginRight: 16 },
  myOffersTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  myOffersSubtext: { fontSize: 13, color: colors.textSecondary },
  myOffersArrow: { fontSize: 20, color: colors.textLight },
  categoriesScroll: { maxHeight: 50, marginBottom: 16 },
  categoriesContent: { paddingHorizontal: 20, gap: 8 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.backgroundSecondary, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryChipText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  categoryChipTextActive: { color: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  emptyButton: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  emptyButtonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  content: { padding: 20, paddingTop: 0 },
  needCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  needHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  needHeaderLeft: { flex: 1 },
  needTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  needCategory: { fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', fontWeight: '600' },
  budgetBadge: { backgroundColor: colors.success + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  budgetText: { fontSize: 14, fontWeight: '700', color: colors.success },
  needDescription: { fontSize: 15, color: colors.textSecondary, marginBottom: 12, lineHeight: 20 },
  needFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  needFooterLeft: { flex: 1 },
  needLocation: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  timeAgo: { fontSize: 12, color: colors.textLight },
  buyerInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 12 },
  buyerName: { fontSize: 13, color: colors.textSecondary },
  buyerRating: { fontSize: 13, color: colors.warning, fontWeight: '600' },
  makeOfferButton: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  makeOfferButtonText: { color: colors.white, fontSize: 15, fontWeight: '700' },
});
