import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { offersAPI } from '../../api/offers2';

export default function CreateOfferScreen({ route, navigation }) {
  const { need, existingOffer } = route.params;
  
  const [price, setPrice] = useState(existingOffer?.price?.toString() || '');
  const [deliveryTime, setDeliveryTime] = useState(existingOffer?.deliveryTime || '');
  const [message, setMessage] = useState(existingOffer?.message || existingOffer?.description || '');
  const [submitting, setSubmitting] = useState(false);

  const isRevising = !!existingOffer;

  const handleSubmit = async () => {
    const priceNum = parseFloat(price);
    
    if (!priceNum || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (!deliveryTime.trim()) {
      Alert.alert('Error', 'Please enter estimated delivery time');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please describe your offer');
      return;
    }

    setSubmitting(true);

    try {
      const offerData = {
        needId: need.id,
        price: priceNum,
        deliveryTime: deliveryTime,
        message: message,
        description: message,
      };

      const response = await offersAPI.create(offerData);

      if (response.success) {
        Alert.alert(
          'Success!',
          isRevising ? 'Your offer has been revised' : 'Your offer has been submitted',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to submit offer');
      }
    } catch (error) {
      console.error('Submit offer error:', error);
      Alert.alert('Error', 'Failed to submit offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isRevising ? '✏️ Revise Your Offer' : '💼 Make an Offer'}
          </Text>
          <Text style={styles.subtitle}>For: {need.title}</Text>
        </View>

        {need.budgetMin && need.budgetMax && (
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetLabel}>Buyer's Budget</Text>
            <Text style={styles.budgetText}>
              ${need.budgetMin} - ${need.budgetMax}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Your Price *</Text>
          <View style={styles.priceInput}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Estimated Delivery Time *</Text>
          <TextInput
            style={styles.textInput}
            value={deliveryTime}
            onChangeText={setDeliveryTime}
            placeholder="e.g., 2 days, 1 week, 3 hours"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Your Proposal *</Text>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Describe what you'll do, your experience, and why you're the best choice..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            {isRevising 
              ? 'Your previous offer will be replaced with this new one.'
              : 'Once submitted, you can revise your offer until the buyer accepts it.'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : isRevising ? 'Update Offer' : 'Submit Offer'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  budgetInfo: { backgroundColor: colors.success + '20', padding: 16, borderRadius: 12, marginBottom: 24, alignItems: 'center' },
  budgetLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  budgetText: { fontSize: 24, fontWeight: '700', color: colors.success },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  priceInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16 },
  dollarSign: { fontSize: 24, fontWeight: '700', color: colors.text, marginRight: 8 },
  input: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.text, paddingVertical: 16 },
  textInput: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text },
  messageInput: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text, minHeight: 120, textAlignVertical: 'top' },
  infoBox: { flexDirection: 'row', padding: 16, backgroundColor: '#E3F2FD', borderRadius: 12, alignItems: 'center' },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoText: { flex: 1, fontSize: 13, color: '#1976D2', lineHeight: 18 },
  footer: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  cancelButton: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: colors.text },
  submitButton: { flex: 2, padding: 16, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
