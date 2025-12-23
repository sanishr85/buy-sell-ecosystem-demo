import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { formatINR } from '../utils/fees';

export default function CounterOfferModal({ visible, onClose, originalOffer, onSubmit }) {
  const [counterAmount, setCounterAmount] = useState(originalOffer?.price?.toString() || '');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const amount = parseFloat(counterAmount);
    
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (amount >= originalOffer.price) {
      Alert.alert('Error', 'Counter offer must be less than original offer');
      return;
    }
    
    setSubmitting(true);
    await onSubmit({ amount, message });
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Counter Offer</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.originalOffer}>
              <Text style={styles.label}>Original Offer</Text>
              <Text style={styles.originalAmount}>{formatINR(originalOffer?.price)}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Counter Offer *</Text>
              <View style={styles.amountInput}>
                <Text style={styles.dollarSign}>₹</Text>
                <TextInput
                  style={styles.input}
                  value={counterAmount}
                  onChangeText={setCounterAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message to Seller (Optional)</Text>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Explain your counter offer..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                You can only send one counter offer. The seller can accept or decline.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Sending...' : 'Send Counter Offer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  closeButton: { fontSize: 24, color: colors.textSecondary },
  content: { padding: 20 },
  originalOffer: { backgroundColor: colors.background, padding: 16, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  originalAmount: { fontSize: 32, fontWeight: '700', color: colors.text },
  inputGroup: { marginBottom: 20 },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16 },
  dollarSign: { fontSize: 24, fontWeight: '700', color: colors.text, marginRight: 8 },
  input: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.text, paddingVertical: 16 },
  messageInput: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, fontSize: 14, color: colors.text, minHeight: 80, textAlignVertical: 'top' },
  infoBox: { flexDirection: 'row', padding: 12, backgroundColor: '#E3F2FD', borderRadius: 12, alignItems: 'center' },
  infoIcon: { fontSize: 20, marginRight: 8 },
  infoText: { flex: 1, fontSize: 13, color: '#1976D2', lineHeight: 18 },
  footer: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: colors.border },
  cancelButton: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: colors.text },
  submitButton: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
