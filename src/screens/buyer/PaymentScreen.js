import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { formatINR } from '../../utils/fees';
import { ordersAPI } from '../../api/orders2';

export default function PaymentScreen({ route, navigation }) {
  const { offer, need } = route.params;
  const [loading, setLoading] = useState(false);
  
  const [savedCards] = useState([
    { id: '1', last4: '4242', brand: 'Visa', expiry: '12/25' },
    { id: '2', last4: '8888', brand: 'Mastercard', expiry: '03/26' },
  ]);
  
  const [selectedCard, setSelectedCard] = useState(savedCards[0].id);
  const [useNewCard, setUseNewCard] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  const totalAmount = offer.price; // Buyer pays exact amount, no platform fee

  const handlePayment = async () => {
    if (useNewCard) {
      if (!cardNumber || !expiry || !cvv || !cardName) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    }

    Alert.alert(
      'Confirm Payment',
      `You're about to pay ${formatINR(totalAmount)} to ${offer.sellerName}. Your payment will be held in escrow until delivery is confirmed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay',
          onPress: async () => {
            setLoading(true);
            try {
              // Create order
              console.log('💳 Creating order for offer:', offer.id);
              const orderResponse = await ordersAPI.create({
                offerId: offer.id,
                paymentMethod: useNewCard ? 'new_card' : selectedCard
              });

              if (orderResponse.success) {
                console.log('✅ Order created:', orderResponse.order.id);
                navigation.navigate('PaymentSuccess', { 
                  offer, 
                  need, 
                  amount: totalAmount,
                  order: orderResponse.order 
                });
              } else {
                Alert.alert('Error', 'Failed to create order');
              }
            } catch (error) {
              console.error('Payment error:', error);
              Alert.alert('Error', 'Payment failed');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
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
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Amount:</Text>
            <Text style={styles.summaryValue}>{formatINR(offer.price)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>{formatINR(totalAmount)}</Text>
          </View>
          
          <View style={styles.escrowInfo}>
            <Text style={styles.escrowIcon}>🔒</Text>
            <Text style={styles.escrowText}>
              Funds held securely in escrow until service completion
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {savedCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.cardOption, selectedCard === card.id && !useNewCard && styles.cardOptionSelected]}
              onPress={() => {
                setSelectedCard(card.id);
                setUseNewCard(false);
              }}
            >
              <View style={styles.cardInfo}>
                <Text style={styles.cardIcon}>💳</Text>
                <View>
                  <Text style={styles.cardBrand}>{card.brand} •••• {card.last4}</Text>
                  <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
                </View>
              </View>
              <View style={[styles.radio, selectedCard === card.id && !useNewCard && styles.radioSelected]} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addCardButton}
            onPress={() => setUseNewCard(!useNewCard)}
          >
            <Text style={styles.addCardText}>+ Add New Card</Text>
          </TouchableOpacity>

          {useNewCard && (
            <View style={styles.newCardForm}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="number-pad"
                maxLength={19}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={(text) => setExpiry(formatExpiry(text))}
                  keyboardType="number-pad"
                  maxLength={5}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={cardName}
                onChangeText={setCardName}
              />
            </View>
          )}
        </View>

        <Button
          title={`Pay ${formatINR(totalAmount)}`}
          onPress={handlePayment}
          loading={loading}
          style={styles.payButton}
        />

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { fontSize: 24, color: colors.text, marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  content: { padding: 20 },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 15, color: colors.textSecondary },
  summaryValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '700', color: colors.success },
  escrowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  escrowIcon: { fontSize: 18, marginRight: 8 },
  escrowText: { flex: 1, fontSize: 13, color: '#1976D2', lineHeight: 18 },
  section: { marginBottom: 24 },
  cardOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardOptionSelected: { borderColor: colors.primary },
  cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardIcon: { fontSize: 24, marginRight: 12 },
  cardBrand: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 2 },
  cardExpiry: { fontSize: 13, color: colors.textSecondary },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  addCardButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addCardText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  newCardForm: { marginTop: 8 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  payButton: { marginBottom: 16 },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  securityIcon: { fontSize: 16, marginRight: 8 },
  securityText: { fontSize: 13, color: colors.textSecondary },
});
