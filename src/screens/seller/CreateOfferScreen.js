import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../theme/colors';

export default function CreateOfferScreen({ route, navigation }) {
  const { need } = route.params;
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum)) {
      newErrors.price = 'Please enter a valid price';
    } else if (priceNum < need.budgetMin || priceNum > need.budgetMax) {
      newErrors.price = `Price should be between $${need.budgetMin} and $${need.budgetMax}`;
    }
    if (!message || message.length < 20) {
      newErrors.message = 'Please provide more details (min 20 characters)';
    }
    if (need.deliveryNeeded && !estimatedDelivery) {
      newErrors.estimatedDelivery = 'Please provide estimated delivery time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const offerData = { needId: need.id, price: parseFloat(price), message, estimatedDelivery };
    console.log('Creating offer:', offerData);
    setTimeout(() => { setLoading(false); navigation.navigate('NeedsFeed'); }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>Make an Offer</Text>
            <Text style={styles.subtitle}>Propose your best deal</Text>
          </View>
          <View style={styles.needSummary}>
            <Text style={styles.needTitle}>{need.title}</Text>
            <Text style={styles.budgetRange}>Buyer's budget: ${need.budgetMin} - ${need.budgetMax}</Text>
          </View>
          <View style={styles.form}>
            <Input label="Your Price (USD) *" placeholder="Enter your offer amount" value={price} onChangeText={setPrice} keyboardType="numeric" error={errors.price} />
            <Input label="Message to Buyer *" placeholder="Explain why you're the best choice, include relevant experience..." value={message} onChangeText={setMessage} multiline error={errors.message} />
            {need.deliveryNeeded && <Input label="Estimated Delivery Time *" placeholder="e.g., 2-3 business days" value={estimatedDelivery} onChangeText={setEstimatedDelivery} error={errors.estimatedDelivery} />}
            <Button title="Submit Offer" onPress={handleSubmit} loading={loading} style={styles.submitButton} />
            <Text style={styles.infoText}>The buyer will be notified and can accept or decline your offer</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 20 },
  backButton: { fontSize: 16, color: colors.primary, marginBottom: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  needSummary: { backgroundColor: colors.backgroundSecondary, padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  needTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  budgetRange: { fontSize: 14, color: colors.textSecondary },
  form: { width: '100%' },
  submitButton: { marginBottom: 12 },
  infoText: { textAlign: 'center', fontSize: 13, color: colors.textLight, fontStyle: 'italic' },
});
