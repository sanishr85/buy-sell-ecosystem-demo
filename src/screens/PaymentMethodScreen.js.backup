import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { colors } from '../theme/colors';

const savedPaymentMethods = [
  { id: '1', type: 'card', last4: '4242', brand: 'Visa', exp: '12/25' },
  { id: '2', type: 'card', last4: '5555', brand: 'Mastercard', exp: '08/26' },
];

export default function PaymentMethodScreen({ route, navigation }) {
  const { offer, need } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(savedPaymentMethods[0].id);
  const [addingNewCard, setAddingNewCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const platformFee = offer.amount * 0.05;
  const totalAmount = offer.amount + platformFee;

  const handleProceedToPayment = () => {
    Alert.alert(
      'Confirm Payment',
      `Pay $${totalAmount.toFixed(2)} (including $${platformFee.toFixed(2)} service fee)?\n\nFunds will be held in escrow until ${offer.sellerName} completes the service.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Payment',
          onPress: () => {
            // Create order object to pass to tracking screen
            const order = {
              id: 'ORD-' + Math.floor(Math.random() * 10000),
              needTitle: need.title,
              sellerName: offer.sellerName,
              sellerRating: offer.sellerRating,
              amount: offer.amount,
              status: 'in_delivery',
              paymentDate: 'Just now',
              startedDate: '5 minutes ago',
              estimatedCompletion: offer.deliveryTime,
              deliveryMethod: 'In-Person Service',
              location: need.location,
              escrowAmount: totalAmount,
            };

            Alert.alert(
              'Payment Successful!',
              `$${totalAmount.toFixed(2)} has been secured in escrow. ${offer.sellerName} has been notified.`,
              [{ 
                text: 'Track Order', 
                onPress: () => navigation.navigate('BuyerOrderTracking', { order })
              }]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSubtitle}>Secure escrow payment</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{need.title}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Seller:</Text>
              <Text style={styles.summaryValue}>{offer.sellerName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Amount:</Text>
              <Text style={styles.summaryValue}>${offer.amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Platform Fee (5%):</Text>
              <Text style={styles.summaryValue}>${platformFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {!addingNewCard ? (
            <>
              {savedPaymentMethods.map(method => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    selectedMethod === method.id && styles.paymentMethodCardActive
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <View style={styles.cardIcon}>
                    <Text style={styles.cardIconText}>💳</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardBrand}>{method.brand}</Text>
                    <Text style={styles.cardNumber}>•••• {method.last4}</Text>
                    <Text style={styles.cardExpiry}>Exp: {method.exp}</Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedMethod === method.id && styles.radioButtonActive
                  ]}>
                    {selectedMethod === method.id && <View style={styles.radioButtonInner} />}
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity 
                style={styles.addCardButton}
                onPress={() => setAddingNewCard(true)}
              >
                <Text style={styles.addCardButtonText}>+ Add New Card</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.newCardForm}>
              <Text style={styles.formLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
                placeholderTextColor={colors.textSecondary}
              />

              <View style={styles.cardDetailsRow}>
                <View style={styles.halfInput}>
                  <Text style={styles.formLabel}>Expiry</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={expiry}
                    onChangeText={setExpiry}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.formLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setAddingNewCard(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Escrow Info */}
        <View style={styles.escrowCard}>
          <Text style={styles.escrowIcon}>🔒</Text>
          <View style={styles.escrowContent}>
            <Text style={styles.escrowTitle}>Secure Escrow Payment</Text>
            <Text style={styles.escrowText}>
              Your payment is held safely until the seller completes the service. You'll have the opportunity to review and approve before funds are released.
            </Text>
          </View>
        </View>

        {/* Proceed Button */}
        {!addingNewCard && (
          <TouchableOpacity 
            style={styles.proceedButton}
            onPress={handleProceedToPayment}
          >
            <Text style={styles.proceedButtonText}>🔐 Proceed to Payment</Text>
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
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  summaryCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, marginBottom: 16 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  totalRow: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '700', color: colors.success },
  paymentMethodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: colors.border },
  paymentMethodCardActive: { borderColor: colors.primary, backgroundColor: '#f5f3ff' },
  cardIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardIconText: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardBrand: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  cardNumber: { fontSize: 14, color: colors.textSecondary, marginBottom: 2 },
  cardExpiry: { fontSize: 12, color: colors.textSecondary },
  radioButton: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioButtonActive: { borderColor: colors.primary },
  radioButtonInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  addCardButton: { backgroundColor: colors.backgroundSecondary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  addCardButtonText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  newCardForm: { backgroundColor: colors.white, borderRadius: 12, padding: 16 },
  formLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: { backgroundColor: colors.backgroundSecondary, borderRadius: 8, padding: 12, fontSize: 16, color: colors.text, marginBottom: 16 },
  cardDetailsRow: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  formButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, backgroundColor: colors.backgroundSecondary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  saveButton: { flex: 1, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  escrowCard: { flexDirection: 'row', backgroundColor: '#ecfdf5', marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#d1fae5' },
  escrowIcon: { fontSize: 32, marginRight: 12 },
  escrowContent: { flex: 1 },
  escrowTitle: { fontSize: 15, fontWeight: '700', color: '#059669', marginBottom: 6 },
  escrowText: { fontSize: 14, color: '#047857', lineHeight: 20 },
  proceedButton: { backgroundColor: colors.primary, marginHorizontal: 20, marginTop: 24, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  proceedButtonText: { color: colors.white, fontSize: 18, fontWeight: '700' },
});
