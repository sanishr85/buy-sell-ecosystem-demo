import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { formatINR } from '../../utils/fees';
import { needsAPI } from '../../api/needs';

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'active':
      case 'open':
        return { bg: colors.success + '15', text: colors.success, label: '📢 Active' };
      case 'in_progress':
        return { bg: colors.warning + '15', text: colors.warning, label: '⚙️ In Progress' };
      case 'delivered':
        return { bg: colors.primary + '15', text: colors.primary, label: '✅ Delivered' };
      case 'completed':
        return { bg: colors.success + '15', text: colors.success, label: '🎉 Completed' };
      case 'closed':
        return { bg: colors.textSecondary + '15', text: colors.textSecondary, label: 'Closed' };
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
  const [needs, setNeeds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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
        setNeeds(response.needs || []);
      }
    } catch (error) {
      console.error('Error loading needs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNeeds();
  };

  const getFilteredNeeds = () => {
    if (filter === 'all') return needs;
    if (filter === 'active') return needs.filter(n => n.status === 'active' || n.status === 'open');
    if (filter === 'closed') return needs.filter(n => n.status === 'closed' || n.status === 'completed');
    return needs;
  };

  const filteredNeeds = getFilteredNeeds();
  const activeCount = needs.filter(n => n.status === 'active' || n.status === 'open').length;
  const closedCount = needs.filter(n => n.status === 'closed' || n.status === 'completed').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Needs</Text>
          <Text style={styles.subtitle}>{needs.length} needs posted</Text>
        </View>
        <TouchableOpacity 
          style={styles.postButton}
          onPress={() => navigation.navigate('PostNeed')}
        >
          <Text style={styles.postButtonText}>+ Post Need</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filterScroll} 
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]} 
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
            All ({needs.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'active' && styles.filterChipActive]} 
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterChipText, filter === 'active' && styles.filterChipTextActive]}>
            Active ({activeCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterChip, filter === 'closed' && styles.filterChipActive]} 
          onPress={() => setFilter('closed')}
        >
          <Text style={[styles.filterChipText, filter === 'closed' && styles.filterChipTextActive]}>
            Closed ({closedCount})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView 
        contentContainerStyle={styles.content} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredNeeds.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No needs found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'all' ? 'Post your first need!' : 'Try adjusting your filters'}
            </Text>
            {filter === 'all' && (
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => navigation.navigate('PostNeed')}
              >
                <Text style={styles.emptyButtonText}>+ Post a Need</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredNeeds.map((need) => (
            <TouchableOpacity 
              key={need.id} 
              style={styles.needCard} 
              onPress={() => navigation.navigate('ViewOffers', { needId: need.id })}
            >
              <View style={styles.needHeader}>
                <View style={styles.needHeaderLeft}>
                  <Text style={styles.needTitle}>{need.title}</Text>
                  <Text style={styles.needCategory}>📁 {need.category}</Text>
                </View>
                <StatusBadge status={need.status} />
              </View>

              <Text style={styles.needDescription} numberOfLines={2}>
                {need.description}
              </Text>

              <View style={styles.needMeta}>
                {need.budget ? (
                  <View style={styles.budgetBadge}>
                    <Text style={styles.budgetIcon}>💰</Text>
                    <Text style={styles.budgetText}>{formatINR(need.budget)}</Text>
                  </View>
                ) : (
                  <Text style={styles.noBudgetText}>₹ - ₹</Text>
                )}
                {need.location && (
                  <>
                    <Text style={styles.needDot}>•</Text>
                    <Text style={styles.needLocation}>📍 {need.location}</Text>
                  </>
                )}
              </View>

              <View style={styles.needFooter}>
                <Text style={styles.needTime}>
                  {new Date(need.createdAt).toLocaleDateString()}
                </Text>
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
  header: { 
    padding: 20, 
    paddingBottom: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  postButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  postButtonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  filterScroll: { maxHeight: 50, marginBottom: 16, backgroundColor: colors.background },
  filterContent: { paddingHorizontal: 20, gap: 8 },
  filterChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: colors.white,
    borderWidth: 2, 
    borderColor: colors.border 
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 14, color: colors.text, fontWeight: '600' },
  filterChipTextActive: { color: colors.white },
  content: { padding: 20, paddingTop: 0 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: colors.textSecondary, marginBottom: 24 },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  needCard: { 
    backgroundColor: colors.white, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1, 
    borderColor: colors.border 
  },
  needHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 12 
  },
  needHeaderLeft: { flex: 1, marginRight: 12 },
  needTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  needCategory: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700' },
  needDescription: { 
    fontSize: 14, 
    color: colors.textSecondary, 
    marginBottom: 12, 
    lineHeight: 20 
  },
  needMeta: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  budgetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  budgetIcon: { fontSize: 14, marginRight: 4 },
  budgetText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  noBudgetText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  needDot: { fontSize: 14, color: colors.textLight, marginHorizontal: 8 },
  needLocation: { fontSize: 13, color: colors.textSecondary },
  needFooter: { 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: colors.border,
    marginTop: 4,
  },
  needTime: { fontSize: 12, color: colors.textLight },
});
