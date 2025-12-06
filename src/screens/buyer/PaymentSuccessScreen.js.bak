import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';

export default function PaymentSuccessScreen({ route, navigation }) {
  const { offer, need, amount } = route.params;

  const handleViewTransaction = () => {
    // TODO: Navigate to transaction detail screen
    navigation.navigate('Home');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.checkmark}>✅</Text>
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your payment has been securely processed</Text>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount Paid</Text>
          <Text style={styles.amount}>${amount}</Text>
          <Text style={styles.amountSubtext}>Held in escrow until delivery</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Need</Text>
            <Text style={styles.detailValue}>{need.title}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seller</Text>
            <Text style={styles.detailValue}>{offer.sellerName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Delivery</Text>
            <Text style={styles.detailValue}>{offer.estimatedDelivery}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>TXN-{Date.now().toString().slice(-8)}</Text>
          </View>
        </View>

        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What Happens Next?</Text>
          
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Seller Prepares Order</Text>
              <Text style={styles.stepText}>The seller will prepare and ship your item</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Track Delivery</Text>
              <Text style={styles.stepText}>You'll receive tracking information once shipped</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Confirm Receipt</Text>
              <Text style={styles.stepText}>After receiving, confirm delivery to release payment</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="View Transaction"
            onPress={handleViewTransaction}
            style={styles.primaryButton}
          />
          <Button
            title="Go to Home"
            onPress={handleGoHome}
            variant="outline"
          />
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportText}>
            Need help? Contact support at support@marketplace.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, alignItems: 'center' },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.success + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  checkmark: { fontSize: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 32, textAlign: 'center' },
  amountCard: { backgroundColor: colors.primary + '10', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: colors.primary + '30' },
  amountLabel: { fontSize: 14, color: colors.primary, marginBottom: 8 },
  amount: { fontSize: 40, fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
  amountSubtext: { fontSize: 13, color: colors.primary },
  detailsCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20, width: '100%', marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  detailsTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right', marginLeft: 12 },
  nextStepsCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20, width: '100%', marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  nextStepsTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  stepItem: { flexDirection: 'row', marginBottom: 16 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, color: colors.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center', lineHeight: 32, marginRight: 12 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  stepText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  actions: { width: '100%', marginBottom: 24 },
  primaryButton: { marginBottom: 12 },
  supportCard: { backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 16, width: '100%' },
  supportText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});
