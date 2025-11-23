import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const mockNeeds = [
  {
    id: '1',
    title: 'Need a plumber for kitchen sink',
    category: 'Home Services',
    budget: '100-200',
    location: 'Brooklyn, NY',
    status: 'active',
    offersCount: 5,
    postedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Logo design for startup',
    category: 'Design & Creative',
    budget: '300-500',
    location: 'Manhattan, NY',
    status: 'active',
    offersCount: 12,
    postedAt: '1 day ago',
  },
  {
    id: '3',
    title: 'Dog walking service',
    category: 'Other',
    budget: '20-40',
    location: 'Queens, NY',
    status: 'completed',
    offersCount: 8,
    postedAt: '1 week ago',
  },
];

export default function MyNeedsScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredNeeds = mockNeeds.filter(need => 
    selectedFilter === 'all' || need.status === selectedFilter
  );

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.filterTabTextActive]}>
              All ({mockNeeds.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'active' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('active')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'active' && styles.filterTabTextActive]}>
              Active ({mockNeeds.filter(n => n.status === 'active').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, selectedFilter === 'completed' && styles.filterTabActive]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'completed' && styles.filterTabTextActive]}>
              Completed ({mockNeeds.filter(n => n.status === 'completed').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Needs List */}
        <View style={styles.needsContainer}>
          {filteredNeeds.map(need => (
            <TouchableOpacity 
              key={need.id} 
              style={styles.needCard}
              onPress={() => navigation.navigate('ViewOffers', { need })}
            >
              <View style={styles.needHeader}>
                <Text style={styles.needTitle}>{need.title}</Text>
                <View style={[
                  styles.statusBadge,
                  need.status === 'active' ? styles.statusActive : styles.statusCompleted
                ]}>
                  <Text style={styles.statusText}>
                    {need.status === 'active' ? '🟢 Active' : '✓ Completed'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.needCategory}>📁 {need.category}</Text>
              <Text style={styles.needBudget}>💰 ${need.budget}</Text>
              <Text style={styles.needLocation}>📍 {need.location}</Text>
              
              <View style={styles.needFooter}>
                <Text style={styles.needTime}>🕐 {need.postedAt}</Text>
                <TouchableOpacity 
                  style={styles.offersButton}
                  onPress={() => navigation.navigate('ViewOffers', { need })}
                >
                  <Text style={styles.offersButtonText}>
                    {need.offersCount} Offers →
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Post New Need Button */}
        <TouchableOpacity 
          style={styles.postNewButton}
          onPress={() => navigation.navigate('PostNeed')}
        >
          <Text style={styles.postNewButtonText}>+ Post New Need</Text>
        </TouchableOpacity>

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
  needsContainer: { paddingHorizontal: 20 },
  needCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  needHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  needTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text, marginRight: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusActive: { backgroundColor: '#d1fae5' },
  statusCompleted: { backgroundColor: '#ede9fe' },
  statusText: { fontSize: 12, fontWeight: '700' },
  needCategory: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  needBudget: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  needLocation: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  needFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  needTime: { fontSize: 13, color: colors.textSecondary },
  offersButton: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  offersButtonText: { fontSize: 13, fontWeight: '700', color: colors.white },
  postNewButton: { backgroundColor: colors.primary, marginHorizontal: 20, marginTop: 16, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  postNewButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
