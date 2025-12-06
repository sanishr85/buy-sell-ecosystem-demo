import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { offersAPI } from '../api/offers2';
import { ordersAPI } from '../api/orders2';

export default function PaymentMethodScreen({ route, navigation }) {
  const { offerId, offer: offerParam } = route.params || {};
  const [offer, setOffer] = useState(offerParam);
  const [loading, setLoading] = useState(!offerParam);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [addingNewCard, setAddingNewCard] = useState(false);

  useEffect(() => {
    if (!offerParam && offerId) {
      loadOffer();
    }
  }, []);

  const loadOffer = async () => {
    try {
      console.log('📥 Loading offer:', offerId);
      const response = await offersAPI.getById(offerId);
      
      if (response.success) {
        setOffer(response.offer);
      } else {
        Alert.alert('Error', 'Failed to load offer details');
      }
    } catch (error) {
      console.error('❌ Load offer error:', error);
      Alert.alert('Error', 'Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'card1', type: 'Visa', last4: '4242', expiry: '12/25' },
    { id: 'card2', type: 'Mastercard', last4: '8888', expiry: '03/26' },
  ];

  const handleProceedToPayment = () => {
    if (!selectedMethod && !addingNewCard) {
      Alert.alert('Select Payment Method', 'Please select a payment method or add a new card');
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Pay $${(((offer?.price || offer?.amount) || 0) * 1.05).toFixed(2)} (including 5% platform fee)?\n\nFunds will be held in escrow until service is delivered and confirmed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Payment',
          onPress: processPayment
        }
      ]
    );
  };

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      console.log('💳 Processing payment for offer:', offer.id);
      
      // Create order (in real app, this would process payment first)
      const orderResponse = await ordersAPI.create({
        offerId: offer.id,
        paymentMethod: selectedMethod || 'new_card'
      });

      if (orderResponse.success) {
        Alert.alert(
          'Payment Successful! 🎉',
          'Funds are held in escrow. The seller has been notified to begin work.',
          [
            {
              text: 'View Order',
              onPress: () => {
                // Navigate to order tracking
                navigation.navigate('BuyerOrderTracking', { 
                  orderId: orderResponse.order.id 
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', orderResponse.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!offer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Offer not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const platformFee = ((offer.price || offer.amount) || 0) * 0.05;
  const totalAmount = ((offer.price || offer.amount) || 0) + platformFee;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Amount:</Text>
            <Text style={styles.summaryValue}>${(offer.price || offer.amount)?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee (5%):</Text>
            <Text style={styles.summaryValue}>${platformFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Total Amount:</Text>
            <Text style={styles.summaryTotalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.escrowNotice}>
            <Text style={styles.escrowIcon}>🔒</Text>
            <Text style={styles.escrowText}>
              Funds held securely in escrow until service completion
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected
              ]}
              onPress={() => setSelectedMethod(method.id)}
              disabled={processing}
            >
              <View style={styles.methodLeft}>
                <View style={styles.methodIcon}>
                  <Text style={styles.methodIconText}>💳</Text>
                </View>
                <View>
                  <Text style={styles.methodType}>{method.type} •••• {method.last4}</Text>
                  <Text style={styles.methodExpiry}>Expires {method.expiry}</Text>
                </View>
              </View>
              <View style={[
                styles.radio,
                selectedMethod === method.id && styles.radioSelected
              ]} />
            </TouchableOpacity>
          ))}

          {/* Add New Card */}
          <TouchableOpacity
            style={styles.addCardButton}
            onPress={() => setAddingNewCard(!addingNewCard)}
            disabled={processing}
          >
            <Text style={styles.addCardIcon}>+ </Text>
            <Text style={styles.addCardText}>Add New Card</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          style={[styles.payButton, processing && styles.payButtonDisabled]}
          onPress={handleProceedToPayment}
          disabled={processing}
        >
          <Text style={styles.payButtonText}>
            {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
          </Text>
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityIcon}>🛡️</Text>
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: colors.textSecondary },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorText: { fontSize: 18, color: colors.error, marginBottom: 20 },
  backButton: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  backButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backIcon: { fontSize: 28, color: colors.text },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  summaryCard: { backgroundColor: colors.white, padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: colors.textSecondary },
  summaryValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  summaryTotal: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  summaryTotalLabel: { fontSize: 17, fontWeight: '700', color: colors.text },
  summaryTotalValue: { fontSize: 20, fontWeight: '700', color: colors.success },
  escrowNotice: { marginTop: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success + '10', padding: 12, borderRadius: 8 },
  escrowIcon: { fontSize: 20, marginRight: 8 },
  escrowText: { flex: 1, fontSize: 13, color: colors.success, lineHeight: 18 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 16 },
  methodCard: { backgroundColor: colors.white, padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  methodCardSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  methodLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  methodIcon: { width: 48, height: 36, borderRadius: 8, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  methodIconText: { fontSize: 24 },
  methodType: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 2 },
  methodExpiry: { fontSize: 13, color: colors.textSecondary },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border },
  radioSelected: { borderColor: colors.primary, backgroundColor: colors.primary, borderWidth: 6 },
  addCardButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  addCardIcon: { fontSize: 20, color: colors.primary, fontWeight: 'bold' },
  addCardText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  payButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  payButtonDisabled: { backgroundColor: colors.textSecondary, opacity: 0.6 },
  payButtonText: { color: colors.white, fontSize: 18, fontWeight: '700' },
  securityNotice: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12 },
  securityIcon: { fontSize: 20, marginRight: 8 },
  securityText: { fontSize: 13, color: colors.textSecondary },
});
