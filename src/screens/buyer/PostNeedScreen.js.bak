import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../theme/colors';

const CATEGORIES = ['Electronics', 'Home Services', 'Food & Dining', 'Transportation', 'Health & Wellness', 'Education', 'Fashion & Apparel', 'Other'];

export default function PostNeedScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryNeeded, setDeliveryNeeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title || title.length < 10) newErrors.title = 'Title must be at least 10 characters';
    if (!description || description.length < 20) newErrors.description = 'Please provide more details (min 20 characters)';
    if (!category) newErrors.category = 'Please select a category';
    if (!budgetMin || !budgetMax) {
      newErrors.budget = 'Please enter budget range';
    } else if (parseFloat(budgetMax) < parseFloat(budgetMin)) {
      newErrors.budget = 'Maximum budget must be greater than minimum';
    }
    if (!location) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const needData = { title, description, category, budgetMin: parseFloat(budgetMin), budgetMax: parseFloat(budgetMax), location, deliveryNeeded };
    console.log('Creating need:', needData);
    setTimeout(() => { setLoading(false); navigation.goBack(); }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Post a Need</Text>
            <Text style={styles.subtitle}>Tell sellers what you're looking for</Text>
          </View>
          <View style={styles.form}>
            <View>
              <Input label="What do you need? *" placeholder="e.g., iPhone 15 Pro Max 256GB" value={title} onChangeText={setTitle} error={errors.title} />
              <Text style={styles.fieldNote}>Be specific to help sellers find you (minimum 10 characters)</Text>
            </View>
            <Input label="Description *" placeholder="Provide details about what you're looking for..." value={description} onChangeText={setDescription} multiline error={errors.description} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity style={[styles.categoryButton, errors.category && styles.inputError]} onPress={() => setShowCategories(!showCategories)}>
                <Text style={category ? styles.categoryText : styles.placeholderText}>{category || 'Select a category'}</Text>
                <Text style={styles.arrow}>{showCategories ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
              {showCategories && (
                <View style={styles.categoriesDropdown}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity key={cat} style={styles.categoryOption} onPress={() => { setCategory(cat); setShowCategories(false); setErrors({ ...errors, category: null }); }}>
                      <Text style={styles.categoryOptionText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.budgetContainer}>
              <Text style={styles.label}>Budget Range (USD) *</Text>
              <View style={styles.budgetRow}>
                <View style={styles.budgetInput}><Input placeholder="Min" value={budgetMin} onChangeText={setBudgetMin} keyboardType="numeric" /></View>
                <Text style={styles.budgetSeparator}>to</Text>
                <View style={styles.budgetInput}><Input placeholder="Max" value={budgetMax} onChangeText={setBudgetMax} keyboardType="numeric" /></View>
              </View>
              {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
            </View>
            <Input label="Location *" placeholder="City or Area" value={location} onChangeText={setLocation} error={errors.location} />
            <View style={styles.switchContainer}>
              <View style={styles.switchLeft}>
                <Text style={styles.switchLabel}>Delivery Needed?</Text>
                <Text style={styles.switchSubtext}>Seller will ship or deliver</Text>
              </View>
              <Switch value={deliveryNeeded} onValueChange={setDeliveryNeeded} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} />
            </View>
            <Button title="Post Need" onPress={handleSubmit} loading={loading} style={styles.submitButton} />
            <Text style={styles.infoText}>Your need will be visible to sellers in your area for 7 days</Text>
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
  header: { marginBottom: 24 },
  backButton: { fontSize: 16, color: colors.primary, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  form: { width: '100%' },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  fieldNote: { fontSize: 12, color: colors.textLight, marginTop: -12, marginBottom: 16, fontStyle: 'italic' },
  categoryButton: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputError: { borderColor: colors.danger },
  categoryText: { fontSize: 16, color: colors.text },
  placeholderText: { fontSize: 16, color: colors.textLight },
  arrow: { fontSize: 12, color: colors.textSecondary },
  categoriesDropdown: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginTop: 8, overflow: 'hidden' },
  categoryOption: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  categoryOptionText: { fontSize: 16, color: colors.text },
  budgetContainer: { marginBottom: 16 },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  budgetInput: { flex: 1 },
  budgetSeparator: { fontSize: 16, color: colors.textSecondary, marginTop: -16 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.backgroundSecondary, padding: 16, borderRadius: 12, marginBottom: 24 },
  switchLeft: { flex: 1 },
  switchLabel: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 2 },
  switchSubtext: { fontSize: 13, color: colors.textSecondary },
  submitButton: { marginBottom: 12 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: 4 },
  infoText: { textAlign: 'center', fontSize: 13, color: colors.textLight, fontStyle: 'italic' },
});
