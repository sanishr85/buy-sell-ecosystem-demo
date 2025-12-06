import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';

export default function PaymentScreen({ route, navigation }) {
  const { offer, need } = route.params;
  const [loading, setLoading] = useState(false);
  
  // Mock saved cards
  const [savedCards] = useState([
    { id: '1', last4: '4242', brand: 'Visa', expiry: '12/25' },
    { id: '2', last4: '5555', brand: 'Mastercard', expiry: '08/26' },
  ]);
  
  const [selectedCard, setSelectedCard] = useState(savedCards[0].id);
  const [useNewCard, setUseNewCard] = useState(false);
  
  // New card form
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  const totalAmount = (offer.price * 1.05).toFixed(2);
  const platformFee = (offer.price * 0.05).toFixed(2);

  const handlePayment = () => {
    if (useNewCard) {
      // Validate new card
      if (!cardNumber || !expiry || !cvv || !cardName) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    }

    Alert.alert(
      'Confirm Payment',
      `You're about to pay $${totalAmount} to ${offer.sellerName}. Your payment will be held in escrow until delivery is confirmed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay',
          onPress: () => {
            setLoading(true);
            // TODO: Stripe payment integration
            setTimeout(() => {
              setLoading(false);
              // Navigate to success screen
              navigation.navigate('PaymentSuccess', { offer, need, amount: totalAmount });
            }, 2000);
          },
        },
      ]
    );
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{need.title}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summarySubLabel}>Seller: {offer.sellerName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Price</Text>
            <Text style={styles.summaryValue}>${offer.price}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee (5%)</Text>
            <Text style={styles.summaryValue}>${platformFee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalAmount}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {/* Saved Cards */}
          {!useNewCard && savedCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardOption, selectedCard === card.id && styles.cardOptionSelected]}
              onPress={() => setSelectedCard(card.id)}
            >
              <View style={styles.cardLeft}>
                <View style={styles.radioButton}>
                  {selectedCard === card.id && <View style={styles.radioButtonInner} />}
                </View>
                <View style={styles.cardIcon}>
                  <Text style={styles.cardIconText}>{card.brand === 'Visa' ? '💳' : '💳'}</Text>
                </View>
                <View>
                  <Text style={styles.cardBrand}>{card.brand} •••• {card.last4}</Text>
                  <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Add New Card Button */}
          {!useNewCard && (
            <TouchableOpacity style={styles.addCardButton} onPress={() => setUseNewCard(true)}>
              <Text style={styles.addCardButtonText}>+ Add New Card</Text>
            </TouchableOpacity>
          )}

          {/* New Card Form */}
          {useNewCard && (
            <View style={styles.newCardForm}>
              <TouchableOpacity style={styles.useSavedButton} onPress={() => setUseNewCard(false)}>
                <Text style={styles.useSavedButtonText}>← Use Saved Card</Text>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, styles.inputGroupHalf]}>
                  <Text style={styles.inputLabel}>Expiry</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={expiry}
                    onChangeText={(text) => setExpiry(formatExpiry(text))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, styles.inputGroupHalf]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={cardName}
                  onChangeText={setCardName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}
        </View>

        {/* Escrow Protection Notice */}
        <View style={styles.escrowNotice}>
          <Text style={styles.escrowIcon}>🔒</Text>
          <View style={styles.escrowTextContainer}>
            <Text style={styles.escrowTitle}>Escrow Protection</Text>
            <Text style={styles.escrowText}>
              Your payment of ${totalAmount} will be held securely until you confirm delivery. The seller receives payment only after your approval.
            </Text>
          </View>
        </View>

        {/* Pay Button */}
        <Button
          title={`Pay $${totalAmount}`}
          onPress={handlePayment}
          loading={loading}
          style={styles.payButton}
        />

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Text style={styles.securityText}>🔐 Secured by Stripe • Your payment info is encrypted</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.white },
  backButton: { fontSize: 16, color: colors.primary, fontWeight: '600', marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  content: { padding: 20 },
  summaryCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  summaryItem: { marginBottom: 8 },
  summaryLabel: { fontSize: 15, color: colors.text, fontWeight: '500' },
  summarySubLabel: { fontSize: 13, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16, marginTop: 8, marginBottom: 0 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '700', color: colors.primary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  cardOption: { backgroundColor: colors.white, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: colors.border, flexDirection: 'row', alignItems: 'center' },
  cardOptionSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '05' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioButtonInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  cardIcon: { marginRight: 12 },
  cardIconText: { fontSize: 24 },
  cardBrand: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 2 },
  cardExpiry: { fontSize: 12, color: colors.textSecondary },
  addCardButton: { backgroundColor: colors.primary + '10', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '30' },
  addCardButtonText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  newCardForm: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  useSavedButton: { marginBottom: 16 },
  useSavedButtonText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  inputGroup: { marginBottom: 16 },
  inputGroupHalf: { flex: 1 },
  inputRow: { flexDirection: 'row', gap: 12 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: { backgroundColor: colors.backgroundSecondary, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: colors.text },
  escrowNotice: { backgroundColor: colors.success + '10', borderRadius: 12, padding: 16, flexDirection: 'row', marginBottom: 24, borderWidth: 1, borderColor: colors.success + '30' },
  escrowIcon: { fontSize: 32, marginRight: 12 },
  escrowTextContainer: { flex: 1 },
  escrowTitle: { fontSize: 15, fontWeight: '700', color: colors.success, marginBottom: 4 },
  escrowText: { fontSize: 13, color: colors.success, lineHeight: 18 },
  payButton: { marginBottom: 16 },
  securityBadge: { alignItems: 'center', paddingVertical: 12 },
  securityText: { fontSize: 12, color: colors.textLight },
});
