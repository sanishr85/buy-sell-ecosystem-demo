import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { ordersAPI } from '../../api/orders2';
import UpdateOrderStatusModal from '../UpdateOrderStatusModal';
import { getStatusInfo } from '../../config/workflows';

export default function SellerOrderTrackingScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const response = await ordersAPI.getById(orderId);
      if (response.success) {
        setOrder(response.order);
      } else {
        Alert.alert('Error', 'Order not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Load order error:', error);
      Alert.alert('Error', 'Failed to load order');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrder();
  };

  const handleUpdateStatus = async (newStatus, note) => {
    try {
      const response = await ordersAPI.updateStatus(orderId, newStatus, note);
      
      if (response.success) {
        Alert.alert('Success', 'Order status updated!');
        await loadOrder();
      } else {
        Alert.alert('Error', response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  if (loading || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading order...</Text>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(order.status, order.workflowType || 'service');
  const canUpdateStatus = order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'dispute_pending';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{order.needTitle}</Text>
          <Text style={styles.orderNumber}>Order #{order.id.slice(-8)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CURRENT STATUS</Text>
          {statusInfo && (
            <View style={[styles.statusCard, { borderColor: statusInfo.color }]}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
                <View style={styles.statusInfo}>
                  <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
                    {statusInfo.label}
                  </Text>
                  <Text style={styles.statusDescription}>{statusInfo.description}</Text>
                </View>
              </View>
            </View>
          )}
          
          {canUpdateStatus && (
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={styles.updateButtonText}>📝 Update Status</Text>
            </TouchableOpacity>
          )}

          {order.status === 'dispute_pending' && (
            <View style={styles.disputeWarning}>
              <Text style={styles.disputeIcon}>⚠️</Text>
              <Text style={styles.disputeText}>
                Buyer has raised a dispute. Payment is frozen. Please contact the buyer to resolve.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT DETAILS</Text>
          <View style={styles.card}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Service Amount</Text>
              <Text style={styles.paymentValue}>${order.amount?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Platform Fee (5%)</Text>
              <Text style={styles.paymentValue}>-${order.platformFee?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Your Earnings</Text>
              <Text style={styles.totalValue}>
                ${order.sellerEarnings?.toFixed(2) || (order.amount - (order.platformFee || 0)).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BUYER INFORMATION</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👤 Name</Text>
              <Text style={styles.infoValue}>{order.buyerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📧 Email</Text>
              <Text style={styles.infoValue}>{order.buyerEmail}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Order Date</Text>
              <Text style={styles.infoValue}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <UpdateOrderStatusModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={order.status}
        workflowType={order.workflowType || 'service'}
        onUpdateStatus={handleUpdateStatus}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  loadingText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: colors.textSecondary },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  orderNumber: { fontSize: 14, color: colors.textSecondary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, letterSpacing: 1 },
  card: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  statusCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 2, marginBottom: 12 },
  statusHeader: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { fontSize: 32, marginRight: 12 },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  statusDescription: { fontSize: 14, color: colors.textSecondary },
  updateButton: { backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: 'center' },
  updateButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
  disputeWarning: { flexDirection: 'row', backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FFB74D', marginTop: 12 },
  disputeIcon: { fontSize: 24, marginRight: 12 },
  disputeText: { flex: 1, fontSize: 14, color: '#E65100', lineHeight: 20 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  paymentLabel: { fontSize: 14, color: colors.textSecondary },
  paymentValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 16, fontWeight: '700', color: colors.success },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoLabel: { fontSize: 14, color: colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.text },
});
