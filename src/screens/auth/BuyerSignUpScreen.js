import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

export default function BuyerSignUpScreen({ route, navigation }) {
  const { enableBoth } = route.params || {};
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    pincode: '',
  });
  
  const [documents, setDocuments] = useState({
    aadhar: null,
    drivingLicense: null,
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickDocument = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        setDocuments(prev => ({ ...prev, [type]: result }));
        Alert.alert('Success', `${type === 'aadhar' ? 'Aadhar' : 'Driving License'} uploaded successfully`);
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  };

  const validateForm = () => {
    const { name, email, mobile, password, confirmPassword } = formData;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!documents.aadhar) {
      Alert.alert('Error', 'Please upload Aadhar for verification');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    if (enableBoth) {
      // Save buyer data and navigate to seller signup
      await AsyncStorage.setItem('tempBuyerData', JSON.stringify({ ...formData, documents }));
      navigation.navigate('SellerSignUp', { 
        buyerData: formData,
        completingBoth: true 
      });
      return;
    }

    setLoading(true);

    // TODO: Replace with actual API call
    setTimeout(async () => {
      const userData = {
        id: 'user-' + Date.now(),
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        isBuyer: true,
        isSeller: false,
        documents: documents,
      };

      await AsyncStorage.setItem('userToken', 'token-' + Date.now());
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setLoading(false);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.replace('MainApp') }
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Buyer Account</Text>
        <Text style={styles.subtitle}>
          {enableBoth ? 'Step 1 of 2: Buyer Information' : 'Join as a buyer'}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(val) => handleChange('name', val)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={formData.email}
              onChangeText={(val) => handleChange('email', val)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChangeText={(val) => handleChange('mobile', val)}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address"
              value={formData.address}
              onChangeText={(val) => handleChange('address', val)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(val) => handleChange('city', val)}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                placeholder="6-digit"
                value={formData.pincode}
                onChangeText={(val) => handleChange('pincode', val)}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChangeText={(val) => handleChange('password', val)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChangeText={(val) => handleChange('confirmPassword', val)}
              secureTextEntry
            />
          </View>

          {/* Document Upload Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification Documents</Text>
            
            <View style={styles.docContainer}>
              <Text style={styles.label}>Aadhar Card *</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickDocument('aadhar')}
              >
                <Text style={styles.uploadIcon}>📄</Text>
                <Text style={styles.uploadText}>
                  {documents.aadhar ? documents.aadhar.name : 'Upload Aadhar'}
                </Text>
              </TouchableOpacity>
              {documents.aadhar && (
                <Text style={styles.uploadedText}>✓ {documents.aadhar.name}</Text>
              )}
            </View>

            <View style={styles.docContainer}>
              <Text style={styles.label}>Driving License (Optional)</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickDocument('drivingLicense')}
              >
                <Text style={styles.uploadIcon}>📄</Text>
                <Text style={styles.uploadText}>
                  {documents.drivingLicense ? documents.drivingLicense.name : 'Upload DL'}
                </Text>
              </TouchableOpacity>
              {documents.drivingLicense && (
                <Text style={styles.uploadedText}>✓ {documents.drivingLicense.name}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.signUpButtonText}>
                {enableBoth ? 'Next: Seller Details' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { fontSize: 28, color: colors.text },
  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 32 },
  form: {},
  section: { marginTop: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  row: { flexDirection: 'row', gap: 12 },
  halfWidth: { flex: 1 },
  docContainer: { marginBottom: 20 },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
  },
  uploadIcon: { fontSize: 24, marginRight: 12 },
  uploadText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  uploadedText: { fontSize: 13, color: colors.success, marginTop: 8 },
  signUpButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonText: { fontSize: 18, fontWeight: '700', color: colors.white },
  spacer: { height: 40 },
});
