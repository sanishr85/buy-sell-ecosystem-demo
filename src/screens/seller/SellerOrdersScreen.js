import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { ordersAPI } from '../../api/orders2';
import { getStatusInfo } from '../../config/workflows';

export default function SellerOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadOrders();
    });
    return unsubscribe;
  }, [navigation]);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders('seller');
      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (error) {
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const filteredOrders = filter === 'active'
    ? orders.filter(o => !['completed', 'cancelled'].includes(o.status))
    : orders.filter(o => ['completed', 'cancelled'].includes(o.status));

  const activeCount = orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
  const completedCount = orders.filter(o => ['completed', 'cancelled'].includes(o.status)).length;

  const renderOrder = ({ item }) => {
    const statusInfo = getStatusInfo(item.status, item.workflowType || 'service');

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('SellerOrderTracking', { orderId: item.id })}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>{item.needTitle}</Text>
          {statusInfo && (
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
              <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.orderNumber}>Order #{item.id.slice(-8)}</Text>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>You'll Receive:</Text>
            <Text style={styles.amountText}>
              ${((item.amount || 0) - (item.platformFee || 0)).toFixed(2)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>👤 {item.buyerName}</Text>
            <Text style={styles.detailDate}>
              📅 {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to manage order →</Text>
        </View>
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
          <Text style={styles.title}>My Orders</Text>
          <Text style={styles.subtitle}>{orders.length} orders</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            Active ({activeCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            Completed ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              Orders will appear here when buyers accept your offers
            </Text>
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
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderTitle: { fontSize: 18, fontWeight: '700', color: colors.text, flex: 1, marginRight: 8 },
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
  orderNumber: { fontSize: 13, color: colors.textSecondary, marginBottom: 12 },
  orderDetails: { marginBottom: 12 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  amountText: { fontSize: 18, fontWeight: '700', color: colors.success },
  detailDate: { fontSize: 13, color: colors.textSecondary },
  tapHint: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tapHintText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 },
});
