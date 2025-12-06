import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { needsAPI } from '../api/needs2';
import { offersAPI } from '../api/offers2';

export default function NeedDetailScreen({ route, navigation }) {
  const { need } = route.params;
  const [currentUser, setCurrentUser] = useState(null);
  const [myOffer, setMyOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserAndOffer();
  }, []);

  const loadUserAndOffer = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;
      setCurrentUser(user);

      if (user?.isSeller) {
        // Check if seller already has an offer on this need
        const offersResponse = await offersAPI.getMyOffers();
        if (offersResponse.success) {
          const existingOffer = offersResponse.offers.find(o => o.needId === need.id);
          setMyOffer(existingOffer);
        }
      }
    } catch (error) {
      console.error('Load user/offer error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = () => {
    if (myOffer && myOffer.status === 'accepted') {
      Alert.alert('Already Accepted', 'This offer has been accepted by the buyer');
      return;
    }

    navigation.navigate('CreateOffer', { 
      need: need,
      existingOffer: myOffer // Pass existing offer if revising
    });
  };

  const getButtonText = () => {
    if (!myOffer) return '💼 Make an Offer';
    if (myOffer.status === 'accepted') return '✅ Offer Accepted';
    if (myOffer.status === 'declined') return '🔄 Make New Offer';
    return '✏️ Revise Offer';
  };

  const shouldShowButton = () => {
    if (!currentUser?.isSeller) return false;
    if (need.buyerId === currentUser?.id) return false; // Can't offer on own need
    if (myOffer?.status === 'accepted') return false; // Already accepted
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{need.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>📂 {need.category}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{need.description}</Text>
        </View>

        {(need.budgetMin || need.budgetMax) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget</Text>
            <View style={styles.budgetBadge}>
              <Text style={styles.budgetText}>
                💰 ${need.budgetMin || 0} - ${need.budgetMax || 0}
              </Text>
            </View>
          </View>
        )}

        {need.location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>
              📍 {need.location.city || need.location.address || 'Location not specified'}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posted By</Text>
          <View style={styles.posterCard}>
            <Text style={styles.posterName}>👤 {need.buyerName}</Text>
            <Text style={styles.posterDate}>
              📅 {new Date(need.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {myOffer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Offer</Text>
            <View style={[
              styles.offerCard,
              myOffer.status === 'accepted' && styles.offerCardAccepted,
              myOffer.status === 'declined' && styles.offerCardDeclined
            ]}>
              <View style={styles.offerHeader}>
                <Text style={styles.offerAmount}>${myOffer.price}</Text>
                <View style={[
                  styles.offerStatusBadge,
                  myOffer.status === 'accepted' && styles.statusAccepted,
                  myOffer.status === 'declined' && styles.statusDeclined,
                  myOffer.status === 'pending' && styles.statusPending
                ]}>
                  <Text style={styles.offerStatusText}>
                    {myOffer.status === 'accepted' ? '✅ Accepted' :
                     myOffer.status === 'declined' ? '❌ Declined' :
                     '⏳ Pending'}
                  </Text>
                </View>
              </View>
              {myOffer.message && (
                <Text style={styles.offerMessage}>{myOffer.message}</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {shouldShowButton() && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.offerButton}
            onPress={handleMakeOffer}
          >
            <Text style={styles.offerButtonText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 12 },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: colors.primary + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  categoryText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  description: { fontSize: 16, color: colors.text, lineHeight: 24 },
  budgetBadge: { backgroundColor: colors.success + '20', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, alignSelf: 'flex-start' },
  budgetText: { fontSize: 18, fontWeight: '700', color: colors.success },
  locationText: { fontSize: 16, color: colors.text },
  posterCard: { backgroundColor: colors.white, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  posterName: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
  posterDate: { fontSize: 14, color: colors.textSecondary },
  offerCard: { backgroundColor: colors.white, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: colors.border },
  offerCardAccepted: { borderColor: colors.success, backgroundColor: colors.success + '10' },
  offerCardDeclined: { borderColor: colors.error, backgroundColor: colors.error + '10' },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  offerAmount: { fontSize: 24, fontWeight: '700', color: colors.text },
  offerStatusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusAccepted: { backgroundColor: colors.success },
  statusDeclined: { backgroundColor: colors.error },
  statusPending: { backgroundColor: colors.warning },
  offerStatusText: { fontSize: 12, fontWeight: '700', color: colors.white },
  offerMessage: { fontSize: 14, color: colors.textSecondary, marginTop: 8, fontStyle: 'italic' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.white },
  offerButton: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  offerButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
