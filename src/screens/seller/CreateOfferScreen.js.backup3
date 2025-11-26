import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../theme/colors';
import { offersAPI } from '../../api/offers';

export default function CreateOfferScreen({ route, navigation }) {
  const { need, needId } = route.params;
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const priceNum = parseFloat(price);
    
    // Validate price
    if (!price || isNaN(priceNum)) {
      newErrors.price = 'Please enter a valid price';
    } else if (priceNum <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (need?.budgetMin && need?.budgetMax) {
      if (priceNum < need.budgetMin || priceNum > need.budgetMax) {
        newErrors.price = `Price should be between $${need.budgetMin} and $${need.budgetMax}`;
      }
    }
    
    // Validate message
    if (!message || message.trim().length < 20) {
      newErrors.message = 'Please provide more details (min 20 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    setLoading(true);

    try {
      console.log('💼 Creating offer...');

      // Get auth token
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Please login to make an offer');
        navigation.navigate('Login');
        return;
      }

      // Prepare offer data
      const offerData = {
        needId: needId || need?.id,
        amount: parseFloat(price),
        description: message.trim(),
        deliveryTime: estimatedDelivery.trim() || null,
      };

      console.log('📤 Sending offer data:', offerData);

      // Call backend API
      const response = await offersAPI.create(token, offerData);
      
      console.log('✅ Offer created response:', response);

      if (response.success) {
        Alert.alert(
          'Success! 🎉',
          'Your offer has been submitted. The buyer will be notified and can accept or decline your offer.',
          [
            { 
              text: 'View My Offers', 
              onPress: () => navigation.navigate('MyOffers') 
            },
            { 
              text: 'Browse More Needs', 
              onPress: () => navigation.navigate('NeedsFeed'),
              style: 'cancel'
            }
          ]
        );
      } else {
        // Handle specific error messages from backend
        if (response.message?.includes('already made an offer')) {
          Alert.alert(
            'Already Submitted',
            'You have already made an offer on this need. You can only submit one offer per need.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        } else if (response.message?.includes('not active')) {
          Alert.alert(
            'Need Closed',
            'This need is no longer active. The buyer may have already accepted an offer.',
            [{ text: 'OK', onPress: () => navigation.navigate('NeedsFeed') }]
          );
        } else if (response.message?.includes('own need')) {
          Alert.alert(
            'Invalid Action',
            'You cannot make an offer on your own need.',
            [{ text: 'OK', onPress: () => navigation.navigate('NeedsFeed') }]
          );
        } else {
          Alert.alert('Error', response.message || 'Failed to create offer');
        }
      }
    } catch (error) {
      console.error('❌ Create offer error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to submit offer. Please check your connection and try again.\n\n' +
        'Error: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.header}>
            <Text style={styles.title}>Make an Offer</Text>
            <Text style={styles.subtitle}>Propose your best deal</Text>
          </View>
          
          {/* Need Summary */}
          <View style={styles.needSummary}>
            <Text style={styles.needTitle}>
              {need?.title || 'Loading need...'}
            </Text>
            {need?.budgetMin && need?.budgetMax && (
              <Text style={styles.budgetRange}>
                Buyer's budget: ${need.budgetMin} - ${need.budgetMax}
              </Text>
            )}
            {need?.description && (
              <Text style={styles.needDescription} numberOfLines={2}>
                {need.description}
              </Text>
            )}
          </View>
          
          <View style={styles.form}>
            <Input 
              label="Your Price (USD) *" 
              placeholder="Enter your offer amount" 
              value={price} 
              onChangeText={setPrice} 
              keyboardType="numeric" 
              error={errors.price}
              editable={!loading}
            />
            
            <Input 
              label="Message to Buyer *" 
              placeholder="Explain why you're the best choice, include relevant experience..." 
              value={message} 
              onChangeText={setMessage} 
              multiline 
              error={errors.message}
              editable={!loading}
            />
            
            <Input 
              label="Estimated Delivery Time (Optional)" 
              placeholder="e.g., 2-3 business days, Same day, Within 1 week" 
              value={estimatedDelivery} 
              onChangeText={setEstimatedDelivery}
              editable={!loading}
            />
            
            <Button 
              title="Submit Offer" 
              onPress={handleSubmit} 
              loading={loading} 
              style={styles.submitButton} 
            />
            
            <Text style={styles.infoText}>
              The buyer will be notified and can accept or decline your offer
            </Text>
          </View>

          {/* Offer Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips for a Great Offer</Text>
            <Text style={styles.tipItem}>✓ Be competitive with your pricing</Text>
            <Text style={styles.tipItem}>✓ Highlight your relevant experience</Text>
            <Text style={styles.tipItem}>✓ Be clear about what you'll deliver</Text>
            <Text style={styles.tipItem}>✓ Provide a realistic timeline</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  backButton: { fontSize: 16, color: colors.primary, marginBottom: 20, fontWeight: '600' },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  needSummary: { 
    backgroundColor: colors.backgroundSecondary, 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  needTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  budgetRange: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  needDescription: { 
    fontSize: 13, 
    color: colors.textSecondary, 
    fontStyle: 'italic',
    lineHeight: 18,
  },
  form: { width: '100%', marginBottom: 24 },
  submitButton: { marginBottom: 12, marginTop: 8 },
  infoText: { 
    textAlign: 'center', 
    fontSize: 13, 
    color: colors.textLight, 
    fontStyle: 'italic',
    lineHeight: 18,
  },
  tipsContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 13,
    color: '#1e3a8a',
    marginBottom: 6,
    lineHeight: 18,
  },
});
