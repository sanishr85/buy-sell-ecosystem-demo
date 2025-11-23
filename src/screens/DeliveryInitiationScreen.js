import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors } from '../theme/colors';

export default function DeliveryInitiationScreen({ route, navigation }) {
  const { offer } = route.params;
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [trackingInfo, setTrackingInfo] = useState('');

  const deliveryMethods = [
    { id: 'in_person', label: 'In-Person Service', icon: '🤝', description: 'Service at buyer location' },
    { id: 'pickup', label: 'Buyer Pickup', icon: '🚗', description: 'Buyer picks up from your location' },
    { id: 'delivery', label: 'You Deliver', icon: '🚚', description: 'You deliver to buyer' },
    { id: 'shipping', label: 'Ship/Courier', icon: '📦', description: 'Ship via postal/courier service' },
    { id: 'digital', label: 'Digital Delivery', icon: '💻', description: 'Email or online transfer' },
  ];

  const handleStartDelivery = () => {
    if (!deliveryMethod) {
      Alert.alert('Error', 'Please select a delivery method');
      return;
    }
    if (!estimatedTime) {
      Alert.alert('Error', 'Please provide estimated completion time');
      return;
    }

    Alert.alert(
      'Start Delivery?',
      'This will notify the buyer and update the offer status to "In Progress".',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: API call to update offer status
            Alert.alert('Success!', 'Delivery started. Buyer has been notified.', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
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
          <Text style={styles.headerTitle}>Start Delivery</Text>
          <Text style={styles.headerSubtitle}>Provide delivery details</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Offer Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offer Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{offer.needTitle}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Buyer:</Text>
              <Text style={styles.summaryValue}>{offer.buyerName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={[styles.summaryValue, styles.summaryAmount]}>${offer.amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>{offer.location}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Method *</Text>
          <Text style={styles.sectionDescription}>How will you fulfill this service/product?</Text>
          <View style={styles.methodsContainer}>
            {deliveryMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  deliveryMethod === method.id && styles.methodCardActive
                ]}
                onPress={() => setDeliveryMethod(method.id)}
              >
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <View style={styles.methodContent}>
                  <Text style={[
                    styles.methodLabel,
                    deliveryMethod === method.id && styles.methodLabelActive
                  ]}>{method.label}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
                <View style={[
                  styles.methodRadio,
                  deliveryMethod === method.id && styles.methodRadioActive
                ]}>
                  {deliveryMethod === method.id && <View style={styles.methodRadioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estimated Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimated Completion Time *</Text>
          <Text style={styles.sectionDescription}>When will you complete this?</Text>
          <View style={styles.timeOptions}>
            {['1 hour', '3 hours', '1 day', '3 days', '1 week'].map(time => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  estimatedTime === time && styles.timeOptionActive
                ]}
                onPress={() => setEstimatedTime(time)}
              >
                <Text style={[
                  styles.timeOptionText,
                  estimatedTime === time && styles.timeOptionTextActive
                ]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Or enter custom timeframe..."
            value={estimatedTime && !['1 hour', '3 hours', '1 day', '3 days', '1 week'].includes(estimatedTime) ? estimatedTime : ''}
            onChangeText={setEstimatedTime}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Tracking Information (Optional) */}
        {deliveryMethod === 'shipping' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tracking Information</Text>
            <Text style={styles.sectionDescription}>Add tracking number if available</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1Z999AA10123456784"
              value={trackingInfo}
              onChangeText={setTrackingInfo}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        )}

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <Text style={styles.sectionDescription}>Any special instructions for the buyer?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., Please have materials ready, I'll call when I arrive, etc."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Payment Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💰</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Payment Secured in Escrow</Text>
            <Text style={styles.infoText}>
              ${offer.amount} is being held securely. You'll receive payment after the buyer confirms completion.
            </Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartDelivery}>
          <Text style={styles.startButtonText}>🚀 Start Delivery</Text>
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
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary },
  content: { flex: 1 },
  
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 6 },
  sectionDescription: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  
  summaryCard: { backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  summaryAmount: { color: colors.success, fontSize: 16 },
  
  methodsContainer: { gap: 12 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: 16, borderWidth: 2, borderColor: colors.border },
  methodCardActive: { borderColor: colors.primary, backgroundColor: '#f5f3ff' },
  methodIcon: { fontSize: 32, marginRight: 12 },
  methodContent: { flex: 1 },
  methodLabel: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 2 },
  methodLabelActive: { color: colors.primary },
  methodDescription: { fontSize: 13, color: colors.textSecondary },
  methodRadio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  methodRadioActive: { borderColor: colors.primary },
  methodRadioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  
  timeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  timeOption: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  timeOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeOptionText: { fontSize: 14, fontWeight: '600', color: colors.text },
  timeOptionTextActive: { color: colors.white },
  
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 16, fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.border },
  textArea: { height: 120, paddingTop: 16 },
  
  infoCard: { flexDirection: 'row', backgroundColor: '#ecfdf5', marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#d1fae5' },
  infoIcon: { fontSize: 24, marginRight: 12 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#059669', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#047857' },
  
  startButton: { backgroundColor: colors.primary, marginHorizontal: 20, marginTop: 24, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  startButtonText: { color: colors.white, fontSize: 18, fontWeight: '700' },
});
