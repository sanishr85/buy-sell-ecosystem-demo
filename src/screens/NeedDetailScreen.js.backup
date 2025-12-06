import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function NeedDetailScreen({ route, navigation }) {
  const { need } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Need Details</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{need.title}</Text>
          <View style={styles.budgetBadge}>
            <Text style={styles.budgetText}>${need.budget.min}-${need.budget.max}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posted by</Text>
          <View style={styles.buyerCard}>
            <View style={styles.buyerAvatar}>
              <Text style={styles.buyerAvatarText}>{need.buyerName.charAt(0)}</Text>
            </View>
            <View style={styles.buyerInfo}>
              <Text style={styles.buyerName}>{need.buyerName}</Text>
              <Text style={styles.buyerRating}>⭐ {need.buyerRating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{need.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.makeOfferButton}
          onPress={() => navigation.navigate('CreateOffer', { need })}
        >
          <Text style={styles.makeOfferButtonText}>💼 Make an Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { marginRight: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 24, color: colors.text },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  content: { flex: 1 },
  titleSection: { backgroundColor: colors.white, padding: 20, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 12 },
  budgetBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start' },
  budgetText: { fontSize: 18, fontWeight: '700', color: '#059669' },
  section: { backgroundColor: colors.white, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  buyerCard: { flexDirection: 'row', alignItems: 'center' },
  buyerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  buyerAvatarText: { fontSize: 24, fontWeight: '700', color: colors.white },
  buyerInfo: { flex: 1 },
  buyerName: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  buyerRating: { fontSize: 14, color: colors.textSecondary },
  description: { fontSize: 16, color: colors.text, lineHeight: 24 },
  bottomBar: { backgroundColor: colors.white, padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  makeOfferButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  makeOfferButtonText: { color: colors.white, fontSize: 18, fontWeight: '700' },
});
