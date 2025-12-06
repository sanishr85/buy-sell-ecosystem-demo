import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../theme/colors';

const SERVICE_CATEGORIES = ['Electronics', 'Home Services', 'Food & Dining', 'Transportation', 'Health & Wellness', 'Education', 'Fashion & Apparel', 'Other'];

export default function OnboardingSellerScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [serviceLocation, setServiceLocation] = useState('');
  const [serviceRadius, setServiceRadius] = useState('25');
  const [availableNow, setAvailableNow] = useState(true);
  const [errors, setErrors] = useState({});

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !businessType) newErrors.businessType = 'Please select business type';
    if (step === 2) {
      if (!businessName || businessName.length < 3) newErrors.businessName = 'Business name must be at least 3 characters';
      if (!businessDescription || businessDescription.length < 20) newErrors.businessDescription = 'Please provide more details (min 20 characters)';
      if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }
    if (step === 3 && selectedCategories.length === 0) newErrors.categories = 'Select at least one service category';
    if (step === 4) {
      if (!serviceLocation) newErrors.serviceLocation = 'Service location is required';
      if (!serviceRadius || parseInt(serviceRadius) < 1) newErrors.serviceRadius = 'Service radius must be at least 1 mile';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 5) {
      setStep(step + 1);
      setErrors({});
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const sellerData = { businessType, businessName, businessDescription, phoneNumber, categories: selectedCategories, serviceLocation, serviceRadiusMiles: parseInt(serviceRadius), available: availableNow };
    console.log('Creating seller profile:', sellerData);
    setTimeout(() => { setLoading(false); navigation.replace('MainApp'); }, 1500);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4, 5].map((s) => (
        <View key={s} style={[styles.progressDot, s <= step && styles.progressDotActive, s < step && styles.progressDotComplete]} />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What type of seller are you?</Text>
      <Text style={styles.stepSubtitle}>Choose the option that best describes you</Text>
      <TouchableOpacity style={[styles.businessTypeCard, businessType === 'individual' && styles.businessTypeCardActive]} onPress={() => setBusinessType('individual')}>
        <Text style={styles.businessTypeIcon}>👤</Text>
        <Text style={styles.businessTypeTitle}>Individual / Freelancer</Text>
        <Text style={styles.businessTypeDescription}>I work independently and provide services myself</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.businessTypeCard, businessType === 'company' && styles.businessTypeCardActive]} onPress={() => setBusinessType('company')}>
        <Text style={styles.businessTypeIcon}>🏢</Text>
        <Text style={styles.businessTypeTitle}>Company / Business</Text>
        <Text style={styles.businessTypeDescription}>I represent a registered business or company</Text>
      </TouchableOpacity>
      {errors.businessType && <Text style={styles.errorText}>{errors.businessType}</Text>}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about your business</Text>
      <Text style={styles.stepSubtitle}>This helps buyers trust and find you</Text>
      <Input label={businessType === 'individual' ? 'Your Name / Professional Name *' : 'Business Name *'} placeholder={businessType === 'individual' ? 'John Doe' : 'ABC Services Inc.'} value={businessName} onChangeText={setBusinessName} error={errors.businessName} />
      <Input label="Description *" placeholder="Describe your services, experience, and what makes you unique..." value={businessDescription} onChangeText={setBusinessDescription} multiline error={errors.businessDescription} />
      <Input label="Phone Number *" placeholder="+1 (555) 123-4567" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" error={errors.phoneNumber} />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What services do you offer?</Text>
      <Text style={styles.stepSubtitle}>Select all that apply</Text>
      <View style={styles.categoriesGrid}>
        {SERVICE_CATEGORIES.map((category) => (
          <TouchableOpacity key={category} style={[styles.categoryCard, selectedCategories.includes(category) && styles.categoryCardActive]} onPress={() => toggleCategory(category)}>
            <Text style={[styles.categoryCardText, selectedCategories.includes(category) && styles.categoryCardTextActive]}>{category}</Text>
            {selectedCategories.includes(category) && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
      {errors.categories && <Text style={styles.errorText}>{errors.categories}</Text>}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Where do you serve?</Text>
      <Text style={styles.stepSubtitle}>Define your service area</Text>
      <Input label="Primary Service Location *" placeholder="City, State (e.g., San Francisco, CA)" value={serviceLocation} onChangeText={setServiceLocation} error={errors.serviceLocation} />
      <View style={styles.radiusContainer}>
        <Text style={styles.label}>Service Radius (miles) *</Text>
        <View style={styles.radiusOptions}>
          {['10', '25', '50', '100'].map((radius) => (
            <TouchableOpacity key={radius} style={[styles.radiusButton, serviceRadius === radius && styles.radiusButtonActive]} onPress={() => setServiceRadius(radius)}>
              <Text style={[styles.radiusButtonText, serviceRadius === radius && styles.radiusButtonTextActive]}>{radius} mi</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>💡 You'll receive notifications for buyer needs within {serviceRadius} miles of {serviceLocation || 'your location'}</Text>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Almost done! 🎉</Text>
      <Text style={styles.stepSubtitle}>Set your availability</Text>
      <View style={styles.switchContainer}>
        <View style={styles.switchLeft}>
          <Text style={styles.switchLabel}>Available to Accept Requests</Text>
          <Text style={styles.switchSubtext}>You can change this anytime in settings</Text>
        </View>
        <Switch value={availableNow} onValueChange={setAvailableNow} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} />
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Profile Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Business:</Text>
          <Text style={styles.summaryValue}>{businessName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Type:</Text>
          <Text style={styles.summaryValue}>{businessType === 'individual' ? 'Individual' : 'Company'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Categories:</Text>
          <Text style={styles.summaryValue}>{selectedCategories.length} selected</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service Area:</Text>
          <Text style={styles.summaryValue}>{serviceLocation} ({serviceRadius} mi)</Text>
        </View>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>⏱️ You'll get notifications within 15 minutes when buyers post needs in your area</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          {renderProgressBar()}
          <Text style={styles.stepCounter}>Step {step} of 5</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </ScrollView>
        <View style={styles.footer}>
          {step > 1 && <Button title="Back" onPress={handleBack} variant="outline" style={styles.backButton} />}
          <Button title={step === 5 ? 'Complete Setup' : 'Next'} onPress={handleNext} loading={loading} style={styles.nextButton} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 },
  progressDot: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 },
  progressDotActive: { backgroundColor: colors.primary },
  progressDotComplete: { backgroundColor: colors.success },
  stepCounter: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  scrollContent: { padding: 20, paddingTop: 0 },
  stepContainer: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  stepSubtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 24 },
  businessTypeCard: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.border, borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' },
  businessTypeCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  businessTypeIcon: { fontSize: 48, marginBottom: 12 },
  businessTypeTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  businessTypeDescription: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: '47%', backgroundColor: colors.white, borderWidth: 2, borderColor: colors.border, borderRadius: 12, padding: 16, alignItems: 'center', position: 'relative' },
  categoryCardActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  categoryCardText: { fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'center' },
  categoryCardTextActive: { color: colors.primary },
  checkmark: { position: 'absolute', top: 8, right: 8, fontSize: 18, color: colors.primary },
  radiusContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 12 },
  radiusOptions: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  radiusButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.white },
  radiusButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  radiusButtonText: { fontSize: 14, fontWeight: '600', color: colors.text },
  radiusButtonTextActive: { color: colors.white },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.backgroundSecondary, padding: 16, borderRadius: 12, marginBottom: 24 },
  switchLeft: { flex: 1 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 2 },
  switchSubtext: { fontSize: 13, color: colors.textSecondary },
  summaryCard: { backgroundColor: colors.backgroundSecondary, padding: 16, borderRadius: 12, marginBottom: 16 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  infoBox: { backgroundColor: colors.primary + '10', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.primary + '30' },
  infoText: { fontSize: 14, color: colors.primary, lineHeight: 20 },
  footer: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: colors.border },
  backButton: { flex: 1 },
  nextButton: { flex: 2 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 8 },
});
