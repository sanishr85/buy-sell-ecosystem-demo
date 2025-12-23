import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

const SERVICE_CATEGORIES = [
  { id: 'home', name: 'Home Services', icon: '🏠', examples: 'Plumbing, Electrical, Cleaning' },
  { id: 'food', name: 'Food & Culinary', icon: '🍳', examples: 'Cooking, Catering, Baking' },
  { id: 'education', name: 'Education & Tutoring', icon: '📚', examples: 'Tutoring, Music, Languages' },
  { id: 'tech', name: 'Tech Support', icon: '💻', examples: 'Repairs, IT Support, Setup' },
  { id: 'beauty', name: 'Beauty & Wellness', icon: '💆', examples: 'Salon, Spa, Fitness' },
  { id: 'transport', name: 'Transport & Delivery', icon: '🚗', examples: 'Moving, Delivery, Driving' },
  { id: 'events', name: 'Events & Entertainment', icon: '🎉', examples: 'Photography, DJ, Catering' },
  { id: 'other', name: 'Other Services', icon: '🛠️', examples: 'Custom services' },
];

export default function SellerSignUpScreen({ route, navigation }) {
  const { buyerData, completingBoth } = route.params || {};
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    businessName: '',
    aadharNumber: '',
    gstNumber: '',
    licenseNumber: '',
    experience: '',
    description: '',
  });
  
  const [documents, setDocuments] = useState({
    aadharCopy: null,
    licenseCopy: null,
  });
  
  const [hasLicense, setHasLicense] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const pickDocument = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        setDocuments(prev => ({ ...prev, [type]: result }));
        Alert.alert('Success', 'Document uploaded successfully');
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  };

  const validateForm = () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one service category');
      return false;
    }

    if (!formData.aadharNumber) {
      Alert.alert('Error', 'Aadhar number is required for verification');
      return false;
    }

    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(formData.aadharNumber.replace(/\s/g, ''))) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhar number');
      return false;
    }

    if (!documents.aadharCopy) {
      Alert.alert('Error', 'Please upload Aadhar copy');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // TODO: Replace with actual API call
    setTimeout(async () => {
      const roles = completingBoth ? ['buyer', 'seller'] : ['seller'];
      
      const userData = {
        id: 'user-' + Date.now(),
        name: buyerData?.name || 'Seller User',
        email: buyerData?.email || '',
        mobile: buyerData?.mobile || '',
        isBuyer: completingBoth,
        isSeller: true,
        seller: {
          categories: selectedCategories,
          businessName: formData.businessName,
          aadharNumber: formData.aadharNumber,
          gstNumber: formData.gstNumber,
          licenseNumber: formData.licenseNumber,
          experience: formData.experience,
          description: formData.description,
          documents: documents,
          verified: false,
        }
      };

      await AsyncStorage.setItem('userToken', 'token-' + Date.now());
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setLoading(false);
      Alert.alert(
        'Success', 
        'Account created successfully! Your seller profile will be verified within 24-48 hours.',
        [{ text: 'OK', onPress: () => navigation.replace('MainApp') }]
      );
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
        <Text style={styles.title}>Create Seller Account</Text>
        <Text style={styles.subtitle}>
          {completingBoth ? 'Step 2 of 2: Seller Information' : 'Join as a service provider'}
        </Text>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service Categories *</Text>
          <Text style={styles.sectionSubtitle}>Choose one or more categories you offer</Text>
          
          <View style={styles.categoriesGrid}>
            {SERVICE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategories.includes(category.id) && styles.categoryCardSelected
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryExamples}>{category.examples}</Text>
                {selectedCategories.includes(category.id) && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Business/Professional Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter business or your professional name"
              value={formData.businessName}
              onChangeText={(val) => handleChange('businessName', val)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Briefly describe your services and experience"
              value={formData.description}
              onChangeText={(val) => handleChange('description', val)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., 5 years"
              value={formData.experience}
              onChangeText={(val) => handleChange('experience', val)}
            />
          </View>
        </View>

        {/* Verification Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Documents</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Aadhar Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="12-digit Aadhar number"
              value={formData.aadharNumber}
              onChangeText={(val) => handleChange('aadharNumber', val)}
              keyboardType="number-pad"
              maxLength={12}
            />
            <Text style={styles.helperText}>Required for identity verification</Text>
          </View>

          <View style={styles.docContainer}>
            <Text style={styles.label}>Aadhar Copy *</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickDocument('aadharCopy')}
            >
              <Text style={styles.uploadIcon}>📄</Text>
              <Text style={styles.uploadText}>
                {documents.aadharCopy ? documents.aadharCopy.name : 'Upload Aadhar Copy'}
              </Text>
            </TouchableOpacity>
            {documents.aadharCopy && (
              <Text style={styles.uploadedText}>✓ {documents.aadharCopy.name}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>GST Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="15-digit GST number"
              value={formData.gstNumber}
              onChangeText={(val) => handleChange('gstNumber', val)}
              autoCapitalize="characters"
              maxLength={15}
            />
          </View>

          <View style={styles.licenseSection}>
            <Text style={styles.label}>Professional License/Certificate</Text>
            
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setHasLicense(true)}
              >
                <View style={[styles.radio, hasLicense && styles.radioSelected]} />
                <Text style={styles.radioLabel}>I have a license/certificate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setHasLicense(false)}
              >
                <View style={[styles.radio, !hasLicense && styles.radioSelected]} />
                <Text style={styles.radioLabel}>I don't have a license yet</Text>
              </TouchableOpacity>
            </View>

            {hasLicense ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter license/certificate number"
                  value={formData.licenseNumber}
                  onChangeText={(val) => handleChange('licenseNumber', val)}
                />
                
                <View style={styles.docContainer}>
                  <Text style={styles.label}>License Copy</Text>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => pickDocument('licenseCopy')}
                  >
                    <Text style={styles.uploadIcon}>📄</Text>
                    <Text style={styles.uploadText}>
                      {documents.licenseCopy ? documents.licenseCopy.name : 'Upload License Copy'}
                    </Text>
                  </TouchableOpacity>
                  {documents.licenseCopy && (
                    <Text style={styles.uploadedText}>✓ {documents.licenseCopy.name}</Text>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.noLicenseInfo}>
                <Text style={styles.noLicenseIcon}>ℹ️</Text>
                <View style={styles.noLicenseTextContainer}>
                  <Text style={styles.noLicenseTitle}>No problem!</Text>
                  <Text style={styles.noLicenseText}>
                    You can still offer services. Many categories don't require licenses.
                  </Text>
                  <TouchableOpacity onPress={() => Linking.openURL('https://www.india.gov.in/business-license')}>
                    <Text style={styles.applyLink}>
                      📄 Learn how to apply for professional license →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.verificationNotice}>
          <Text style={styles.verificationIcon}>🔍</Text>
          <Text style={styles.verificationText}>
            Your documents will be verified within 24-48 hours. You'll receive a notification once approved.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.signUpButtonText}>Complete Registration</Text>
          )}
        </TouchableOpacity>

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
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  categoriesGrid: { gap: 12 },
  categoryCard: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  categoryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  categoryIcon: { fontSize: 32, marginBottom: 8 },
  categoryName: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  categoryExamples: { fontSize: 13, color: colors.textSecondary },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: { color: colors.white, fontSize: 14, fontWeight: '700' },
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
  textArea: { height: 100, textAlignVertical: 'top' },
  helperText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
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
  licenseSection: { marginTop: 8 },
  radioGroup: { marginBottom: 16 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
  },
  radioSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  radioLabel: { fontSize: 15, color: colors.text },
  noLicenseInfo: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  noLicenseIcon: { fontSize: 24, marginRight: 12 },
  noLicenseTextContainer: { flex: 1 },
  noLicenseTitle: { fontSize: 15, fontWeight: '700', color: '#E65100', marginBottom: 4 },
  noLicenseText: { fontSize: 14, color: '#EF6C00', marginBottom: 8, lineHeight: 20 },
  applyLink: { fontSize: 14, fontWeight: '600', color: '#F57C00' },
  verificationNotice: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  verificationIcon: { fontSize: 24, marginRight: 12 },
  verificationText: { flex: 1, fontSize: 14, color: '#1976D2', lineHeight: 20 },
  signUpButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: { fontSize: 18, fontWeight: '700', color: colors.white },
  spacer: { height: 40 },
});
