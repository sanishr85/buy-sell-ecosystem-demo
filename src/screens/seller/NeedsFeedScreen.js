import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

const MOCK_NEEDS = [
  { id: '1', title: 'iPhone 15 Pro Max 256GB', description: 'Looking for a brand new iPhone 15 Pro Max in Natural Titanium color. Must be unlocked.', category: 'Electronics', budgetMin: 1000, budgetMax: 1200, location: 'San Francisco, CA', deliveryNeeded: true, timeAgo: '2 hours ago', buyerName: 'John D.', buyerRating: 4.8 },
  { id: '2', title: 'Home Cleaning Service', description: 'Need a deep cleaning service for a 3-bedroom apartment. Include kitchen and bathrooms.', category: 'Home Services', budgetMin: 150, budgetMax: 250, location: 'Oakland, CA', deliveryNeeded: false, timeAgo: '5 hours ago', buyerName: 'Sarah M.', buyerRating: 5.0 },
  { id: '3', title: 'MacBook Pro 14" M3', description: 'Looking for MacBook Pro 14-inch with M3 chip, 16GB RAM, 512GB SSD. Silver or Space Gray.', category: 'Electronics', budgetMin: 1800, budgetMax: 2000, location: 'Berkeley, CA', deliveryNeeded: true, timeAgo: '1 day ago', buyerName: 'Mike R.', buyerRating: 4.5 },
];

export default function NeedsFeedScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Home Services', 'Food & Dining', 'Transportation'];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredNeeds = selectedCategory === 'All' ? MOCK_NEEDS : MOCK_NEEDS.filter(need => need.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Available Needs</Text>
          <Text style={styles.subtitle}>Find opportunities to help buyers</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.myOffersButton} onPress={() => navigation.navigate('MyOffers')}>
        <View style={styles.myOffersLeft}>
          <Text style={styles.myOffersIcon}>📋</Text>
          <View>
            <Text style={styles.myOffersTitle}>My Offers</Text>
            <Text style={styles.myOffersSubtext}>Track your submitted offers</Text>
          </View>
        </View>
        <Text style={styles.myOffersArrow}>→</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]} onPress={() => setSelectedCategory(cat)}>
            <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {filteredNeeds.map((need) => (
          <TouchableOpacity key={need.id} style={styles.needCard} onPress={() => navigation.navigate('NeedDetail', { need })}>
            <View style={styles.needHeader}>
              <View style={styles.needHeaderLeft}>
                <Text style={styles.needTitle}>{need.title}</Text>
                <Text style={styles.needCategory}>{need.category}</Text>
              </View>
              <View style={styles.budgetBadge}>
                <Text style={styles.budgetText}>${need.budgetMin}-${need.budgetMax}</Text>
              </View>
            </View>
            <Text style={styles.needDescription} numberOfLines={2}>{need.description}</Text>
            <View style={styles.needFooter}>
              <View style={styles.needFooterLeft}>
                <Text style={styles.needLocation}>📍 {need.location}</Text>
                {need.deliveryNeeded && <Text style={styles.deliveryTag}>🚚 Delivery needed</Text>}
              </View>
              <Text style={styles.timeAgo}>{need.timeAgo}</Text>
            </View>
            <View style={styles.buyerInfo}>
              <Text style={styles.buyerName}>Posted by {need.buyerName}</Text>
              <Text style={styles.buyerRating}>⭐ {need.buyerRating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  deliveryTag: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  timeAgo: { fontSize: 12, color: colors.textLight },
  buyerInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  buyerName: { fontSize: 13, color: colors.textSecondary },
  buyerRating: { fontSize: 13, color: colors.warning, fontWeight: '600' },
});
