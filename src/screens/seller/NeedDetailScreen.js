import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';

export default function NeedDetailScreen({ route, navigation }) {
  const { need } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back to Needs</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{need.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{need.category}</Text>
          </View>
        </View>

        <View style={styles.budgetSection}>
          <Text style={styles.sectionLabel}>Budget Range</Text>
          <Text style={styles.budgetAmount}>${need.budgetMin} - ${need.budgetMax}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{need.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.locationText}>📍 {need.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Delivery</Text>
          <Text style={styles.deliveryText}>{need.deliveryNeeded ? '✅ Delivery or shipping required' : '❌ No delivery needed (pickup/local)'}</Text>
        </View>

        <View style={styles.buyerCard}>
          <Text style={styles.sectionLabel}>Buyer Information</Text>
          <View style={styles.buyerRow}>
            <View style={styles.buyerAvatar}>
              <Text style={styles.buyerAvatarText}>{need.buyerName[0]}</Text>
            </View>
            <View style={styles.buyerInfo}>
              <Text style={styles.buyerName}>{need.buyerName}</Text>
              <Text style={styles.buyerRating}>⭐ {need.buyerRating} rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>Posted {need.timeAgo}</Text>
        </View>

        <Button title="Make an Offer" onPress={() => navigation.navigate('CreateOffer', { need })} style={styles.offerButton} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  backButton: { fontSize: 16, color: colors.primary, marginBottom: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  categoryBadge: { backgroundColor: colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start' },
  categoryText: { fontSize: 12, fontWeight: '700', color: colors.primary, textTransform: 'uppercase' },
  budgetSection: { backgroundColor: colors.success + '10', padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: colors.success + '30' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 8 },
  budgetAmount: { fontSize: 28, fontWeight: 'bold', color: colors.success },
  section: { marginBottom: 24 },
  description: { fontSize: 16, color: colors.text, lineHeight: 24 },
  locationText: { fontSize: 16, color: colors.text },
  deliveryText: { fontSize: 16, color: colors.text },
  buyerCard: { backgroundColor: colors.backgroundSecondary, padding: 16, borderRadius: 12, marginBottom: 24 },
  buyerRow: { flexDirection: 'row', alignItems: 'center' },
  buyerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  buyerAvatarText: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  buyerInfo: { flex: 1 },
  buyerName: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 2 },
  buyerRating: { fontSize: 14, color: colors.warning, fontWeight: '500' },
  timeInfo: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 24 },
  timeText: { fontSize: 13, color: colors.textLight, textAlign: 'center' },
  offerButton: { marginBottom: 20 },
});
