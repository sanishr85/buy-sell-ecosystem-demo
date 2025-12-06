import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors } from '../theme/colors';

export default function CreateOfferScreen({ route, navigation }) {
  const { need } = route.params;
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const handleSubmitOffer = () => {
    if (!amount || !description || !deliveryTime) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Offer Submitted!',
      'Your offer has been sent to the buyer. They will review and respond soon.',
      [{ text: 'OK', onPress: () => navigation.navigate('MyOffers') }]
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
          <Text style={styles.headerTitle}>Make an Offer</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Need Summary */}
        <View style={styles.needSummary}>
          <Text style={styles.needTitle}>{need.title}</Text>
          <Text style={styles.needBudget}>Budget: ${need.budget.min}-${need.budget.max}</Text>
        </View>

        {/* Your Offer Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Your Offer Amount *</Text>
          <View style={styles.amountInput}>
            <Text style={styles.amountPrefix}>$</Text>
            <TextInput
              style={styles.amountField}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <Text style={styles.hint}>Buyer's budget: ${need.budget.min}-${need.budget.max}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Describe Your Offer *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Explain what you'll deliver and why you're the right choice..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Estimated Delivery Time *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2-3 days, 1 week, etc."
            value={deliveryTime}
            onChangeText={setDeliveryTime}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOffer}>
          <Text style={styles.submitButtonText}>📤 Submit Offer</Text>
        </TouchableOpacity>

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
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  content: { flex: 1 },
  needSummary: { backgroundColor: colors.white, padding: 20, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  needTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  needBudget: { fontSize: 14, color: colors.textSecondary },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  label: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border },
  amountPrefix: { fontSize: 24, fontWeight: '700', color: colors.text, marginRight: 8 },
  amountField: { flex: 1, fontSize: 20, color: colors.text, paddingVertical: 16 },
  hint: { fontSize: 13, color: colors.textSecondary, marginTop: 8 },
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.border },
  textArea: { height: 140, paddingTop: 16 },
  submitButton: { backgroundColor: colors.primary, marginHorizontal: 20, marginTop: 32, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: colors.white, fontSize: 18, fontWeight: '700' },
});
