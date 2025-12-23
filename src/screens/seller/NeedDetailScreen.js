import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { formatINR } from '../../utils/fees';
import { needsAPI } from '../../api/needs';
import Button from '../../components/common/Button';

export default function NeedDetailScreen({ route, navigation }) {
  const { needId } = route.params;
  const [need, setNeed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNeed();
  }, []);

  const loadNeed = async () => {
    try {
      const response = await needsAPI.getById(needId);
      if (response.success) {
        setNeed(response.need);
      } else {
        Alert.alert('Error', 'Failed to load need details');
      }
    } catch (error) {
      console.error('Error loading need:', error);
      Alert.alert('Error', 'Failed to load need details');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !need) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Need Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>{need.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>📁 {need.category}</Text>
          </View>
        </View>

        {need.budget && (
          <View style={styles.budgetCard}>
            <Text style={styles.budgetLabel}>Buyer's Budget</Text>
            <Text style={styles.budgetAmount}>{formatINR(need.budget)}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{need.description}</Text>
        </View>

        {need.location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>📍 {need.location}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posted</Text>
          <Text style={styles.dateText}>
            {new Date(need.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Button
          title="Make an Offer"
          onPress={() => navigation.navigate('CreateOffer', { need })}
          style={styles.offerButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { fontSize: 28, color: colors.text },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 12 },
  categoryBadge: {
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  budgetCard: {
    backgroundColor: colors.success + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  budgetLabel: { fontSize: 13, color: colors.success, marginBottom: 4, fontWeight: '500' },
  budgetAmount: { fontSize: 28, fontWeight: '700', color: colors.success },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  locationText: { fontSize: 15, color: colors.text },
  dateText: { fontSize: 15, color: colors.textSecondary },
  offerButton: { marginTop: 16 },
});
