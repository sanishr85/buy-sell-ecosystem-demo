import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { formatINR } from '../utils/fees';
import { ordersAPI } from '../api/orders2';

export default function BuyerOrderTrackingScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadOrder();
    });
    return unsubscribe;
  }, [navigation]);

  const loadOrder = async () => {
    try {
      console.log('📦 Loading order:', orderId);
      
      const response = await ordersAPI.getById(orderId);
      
      console.log('✅ Order loaded:', response);

      if (response.success) {
        setOrder(response.order);
      } else {
        Alert.alert('Error', response.message || 'Failed to load order');
      }
    } catch (error) {
      console.error('❌ Load order error:', error);
      Alert.alert('Error', 'Failed to load order details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrder();
  };

  const handleCompleteOrder = () => {
    Alert.alert(
      'Mark as Complete',
      'Are you sure the service has been delivered satisfactorily? This will release payment to the seller.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const response = await ordersAPI.complete(orderId);
              
              if (response.success) {
                Alert.alert(
                  'Order Completed! 🎉',
                  'Payment has been released to the seller. Please rate your experience.',
                  [
                    {
                      text: 'Rate Seller',
                      onPress: () => navigation.navigate('RateSeller', { orderId, sellerId: order.sellerId })
                    }
                  ]
                );
                loadOrder();
              } else {
                Alert.alert('Error', response.message || 'Failed to complete order');
              }
            } catch (error) {
              console.error('❌ Complete order error:', error);
              Alert.alert('Error', 'Failed to complete order');
            }
          }
        }
      ]
    );
  };

  const getStatusConfig = (status) => {
    const configs = {
      payment_held: {
        label: 'Payment Held',
        color: colors.warning,
        bgColor: '#fef3c7',
        icon: '💰',
        description: 'Payment is securely held in escrow'
      },
      in_progress: {
        label: 'In Progress',
        color: colors.primary,
        bgColor: '#dbeafe',
        icon: '⚙️',
        description: 'Seller is working on your request'
      },
      delivered: {
        label: 'Delivered',
        color: colors.success,
        bgColor: '#d1fae5',
        icon: '✅',
        description: 'Service has been delivered. Please confirm completion.'
      },
      completed: {
        label: 'Completed',
        color: colors.success,
        bgColor: '#d1fae5',
        icon: '🎉',
        description: 'Order completed successfully'
      },
      cancelled: {
        label: 'Cancelled',
        color: colors.error,
        bgColor: '#fee2e2',
        icon: '❌',
        description: 'Order was cancelled'
      }
    };
    return configs[status] || configs.payment_held;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading order...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📦</Text>
          <Text style={styles.errorTitle}>Order Not Found</Text>
          <Text style={styles.errorText}>Unable to load order details</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const showCompleteButton = order.status === 'delivered';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Order Tracking</Text>
            <Text style={styles.subtitle}>Order #{order.id.substring(0, 8)}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
          <Text style={[styles.statusLabel, { color: statusConfig.color }]}>{statusConfig.label}</Text>
          <Text style={styles.statusDescription}>{statusConfig.description}</Text>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service:</Text>
            <Text style={styles.detailValue}>{order.needTitle || 'Service'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>{formatINR(order.amount?.toFixed(2) || '0.00')}</Text>
          </View>

          <View style={[styles.detailRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Paid:</Text>
            <Text style={styles.totalValue}>{formatINR(order.amount || 0)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{order.paymentMethod || 'Card'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {order.sellerName?.substring(0, 2).toUpperCase() || 'SE'}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{order.sellerName || 'Seller'}</Text>
              <Text style={styles.sellerEmail}>{order.sellerEmail || 'seller@example.com'}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => Alert.alert('Coming Soon', 'Messaging feature coming soon!')}
          >
            <Text style={styles.messageButtonText}>💬 Message Seller</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Notes */}
        {order.deliveryNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Notes</Text>
            <Text style={styles.deliveryNotes}>{order.deliveryNotes}</Text>
          </View>
        )}

        {/* Complete Button */}
        {showCompleteButton && (
          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteOrder}>
            <Text style={styles.completeButtonText}>✓ Confirm Delivery & Release Payment</Text>
          </TouchableOpacity>
        )}

        {/* Escrow Notice */}
        {order.status !== 'completed' && (
          <View style={styles.escrowNotice}>
            <Text style={styles.escrowIcon}>🔒</Text>
            <Text style={styles.escrowText}>
              Your payment is held securely in escrow until service completion
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorIcon: { fontSize: 64, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  errorText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 24, color: colors.text },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerContent: { flex: 1, marginLeft: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  statusCard: { margin: 20, padding: 24, borderRadius: 16, alignItems: 'center' },
  statusIcon: { fontSize: 48, marginBottom: 12 },
  statusLabel: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  statusDescription: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  section: { backgroundColor: colors.white, marginHorizontal: 20, marginBottom: 16, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'right', flex: 1, marginLeft: 16 },
  totalRow: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.success },
  sellerCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sellerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  sellerAvatarText: { fontSize: 18, fontWeight: 'bold', color: colors.white },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  sellerEmail: { fontSize: 14, color: colors.textSecondary },
  messageButton: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  messageButtonText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  deliveryNotes: { fontSize: 14, color: colors.text, lineHeight: 20 },
  completeButton: { backgroundColor: colors.success, marginHorizontal: 20, marginTop: 8, marginBottom: 16, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  completeButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  escrowNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success + '10', marginHorizontal: 20, padding: 16, borderRadius: 12 },
  escrowIcon: { fontSize: 24, marginRight: 12 },
  escrowText: { flex: 1, fontSize: 13, color: colors.success, lineHeight: 18 },
});
