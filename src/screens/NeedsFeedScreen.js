import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../theme/colors';

const mockNeeds = [
  {
    id: '1',
    title: 'Need a plumber for kitchen sink repair',
    description: 'My kitchen sink is leaking and needs urgent repair.',
    buyerName: 'John Smith',
    buyerRating: 4.8,
    category: 'Home Services',
    budget: { min: 100, max: 200 },
    location: 'Brooklyn, NY',
    postedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Looking for graphic designer for logo',
    description: 'Need a professional logo for my new startup. Should be modern and clean.',
    buyerName: 'Sarah Johnson',
    buyerRating: 4.9,
    category: 'Design & Creative',
    budget: { min: 300, max: 500 },
    location: 'Manhattan, NY',
    postedAt: '5 hours ago',
  },
];

export default function NeedsFeedScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* Header with Profile Icon */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Available Needs</Text>
          <Text style={styles.headerSubtitle}>Find opportunities</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search needs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.needsContainer}>
          {mockNeeds.map(need => (
            <TouchableOpacity
              key={need.id}
              style={styles.needCard}
              onPress={() => navigation.navigate('NeedDetail', { need })}
            >
              <Text style={styles.needTitle}>{need.title}</Text>
              <Text style={styles.needDescription} numberOfLines={2}>{need.description}</Text>
              <View style={styles.needFooter}>
                <Text style={styles.buyerName}>{need.buyerName} ⭐ {need.buyerRating}</Text>
                <Text style={styles.budgetValue}>${need.budget.min}-${need.budget.max}</Text>
              </View>
              <TouchableOpacity 
                style={styles.makeOfferButton}
                onPress={() => navigation.navigate('CreateOffer', { need })}
              >
                <Text style={styles.makeOfferButtonText}>Make an Offer</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.myOffersButton}
          onPress={() => navigation.navigate('MyOffers')}
        >
          <Text style={styles.myOffersButtonText}>📋 My Offers</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary },
  profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  profileIcon: { fontSize: 22 },
  content: { flex: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 20, marginTop: 20, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: colors.text },
  needsContainer: { paddingHorizontal: 20 },
  needCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  needTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  needDescription: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  needFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  buyerName: { fontSize: 13, color: colors.textSecondary },
  budgetValue: { fontSize: 16, fontWeight: '700', color: colors.success },
  makeOfferButton: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  makeOfferButtonText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  myOffersButton: { backgroundColor: colors.success, marginHorizontal: 20, marginTop: 8, marginBottom: 40, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  myOffersButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
