import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';
import CategorySelector from '../../components/CategorySelector';
import { needsAPI } from '../../api/needs';

export default function PostNeedScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryAtLocation, setDeliveryAtLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePostNeed = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your need');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe what you need');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setLoading(true);

    try {
      const needData = {
        title: title.trim(),
        description: description.trim(),
        category,
        budget: budget ? parseFloat(budget) : null,
        location: location.trim() || null,
        deliveryAtLocation,
      };

      console.log('📤 Posting need:', needData);

      const response = await needsAPI.create(needData);

      console.log('✅ Need posted:', response);

      if (response.success) {
        Alert.alert(
          'Success! 🎉',
          'Your need has been posted. Sellers will start sending offers soon.',
          [
            {
              text: 'View My Needs',
              onPress: () => navigation.navigate('MyNeeds')
            }
          ]
        );

        // Reset form
        setTitle('');
        setDescription('');
        setCategory('');
        setBudget('');
        setLocation('');
        setDeliveryAtLocation(false);
      } else {
        Alert.alert('Error', response.message || 'Failed to post need');
      }
    } catch (error) {
      console.error('❌ Post need error:', error);
      Alert.alert('Error', 'Failed to post your need. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with My Needs button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Post a Need</Text>
          <Text style={styles.headerSubtitle}>Tell sellers what you need</Text>
        </View>
        <TouchableOpacity 
          style={styles.myNeedsButton}
          onPress={() => navigation.navigate('MyNeeds')}
        >
          <Text style={styles.myNeedsButtonText}>My Needs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>What do you need? *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Plumber for kitchen sink"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Describe your need *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide details about what you need..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <CategorySelector
            selectedCategory={category}
            onSelectCategory={setCategory}
          />
        </View>

        {/* Budget */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget (Optional)</Text>
          <Text style={styles.hint}>💡 Leave blank to see all offers, or set your maximum budget</Text>
          <View style={styles.budgetInput}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.budgetField}
              placeholder="e.g., 5000"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.hint}>Optional - helps sellers find you</Text>
          <TextInput
            style={styles.input}
            placeholder="City, State (e.g., San Francisco, CA)"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Delivery at location toggle */}
        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={() => setDeliveryAtLocation(!deliveryAtLocation)}
        >
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleTitle}>Delivery/Service at my location</Text>
            <Text style={styles.toggleSubtitle}>Seller comes to you</Text>
          </View>
          <View style={[styles.toggle, deliveryAtLocation && styles.toggleActive]}>
            <View style={[styles.toggleThumb, deliveryAtLocation && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        {/* Post Button */}
        <Button
          title="📢 Post Need"
          onPress={handlePostNeed}
          loading={loading}
          style={styles.postButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  myNeedsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  myNeedsButtonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  content: { padding: 20 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  hint: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, fontStyle: 'italic' },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  textArea: { height: 100, paddingTop: 12 },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  currencySymbol: { fontSize: 18, fontWeight: '600', color: colors.text, marginRight: 8 },
  budgetField: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  toggleLeft: { flex: 1 },
  toggleTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  toggleSubtitle: { fontSize: 13, color: colors.textSecondary },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: colors.primary },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  toggleThumbActive: { alignSelf: 'flex-end' },
  postButton: { marginTop: 8 },
});
