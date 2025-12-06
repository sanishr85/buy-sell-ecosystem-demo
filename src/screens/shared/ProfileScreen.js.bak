import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';

export default function ProfileScreen({ navigation, route }) {
  // TODO: Get actual user type from auth state/API
  // For now, detect from navigation route - if coming from SellTab, they're a seller
  const routeName = navigation.getState().routes[0]?.name || 'BuyTab';
  const isSeller = routeName === 'SellTab';
  
  const [userType] = useState(isSeller ? 'seller' : 'buyer');
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Different data for buyer vs seller
  const [userData] = useState(
    userType === 'seller' 
      ? {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          businessName: 'ABC Services',
          rating: 4.8,
          totalRatings: 24,
          categories: ['Electronics', 'Home Services'],
          serviceLocation: 'San Francisco, CA',
          serviceRadius: 25,
        }
      : {
          name: 'Sarah Smith',
          email: 'sarah@example.com',
          phone: '+1 (555) 987-6543',
          rating: 4.9,
          totalRatings: 15,
          activeNeeds: 2,
          completedPurchases: 8,
        }
  );

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userData.name[0]}</Text>
          </View>
          <Text style={styles.name}>{userData.name}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, userType === 'seller' ? styles.sellerBadge : styles.buyerBadge]}>
              <Text style={styles.badgeText}>{userType === 'seller' ? '💰 Seller' : '🛒 Buyer'}</Text>
            </View>
          </View>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {userData.rating}</Text>
            <Text style={styles.ratingCount}>({userData.totalRatings} ratings)</Text>
          </View>
        </View>

        {userType === 'seller' && (
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityHeader}>
              <View style={styles.availabilityLeft}>
                <Text style={styles.availabilityTitle}>Seller Availability</Text>
                <Text style={styles.availabilitySubtext}>
                  {isAvailable ? 'Receiving notifications' : 'Not receiving requests'}
                </Text>
              </View>
              <Switch 
                value={isAvailable} 
                onValueChange={setIsAvailable} 
                trackColor={{ false: colors.border, true: colors.success }} 
                thumbColor={colors.white} 
              />
            </View>
            {isAvailable && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>✅ You'll get notified within 15 minutes when buyers post needs in your area</Text>
              </View>
            )}
          </View>
        )}

        {userType === 'buyer' && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Activity</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData.activeNeeds}</Text>
                <Text style={styles.statLabel}>Active Needs</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userData.completedPurchases}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userData.phone}</Text>
            </View>
            {userType === 'seller' && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Business</Text>
                  <Text style={styles.infoValue}>{userData.businessName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Service Area</Text>
                  <Text style={styles.infoValue}>{userData.serviceLocation} ({userData.serviceRadius} mi)</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Categories</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>{userData.categories.join(', ')}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit Profile</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>
          {userType === 'seller' && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Edit Service Areas</Text>
              <Text style={styles.actionButtonArrow}>→</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Notification Settings</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Payment Methods</Text>
            <Text style={styles.actionButtonArrow}>→</Text>
          </TouchableOpacity>
          {userType === 'buyer' && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>My Purchases</Text>
              <Text style={styles.actionButtonArrow}>→</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button title="Log Out" onPress={handleLogout} variant="outline" style={styles.logoutButton} />
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  backButtonContainer: { marginBottom: 16 },
  backButton: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: colors.white },
  name: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  badgeContainer: { marginBottom: 8 },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  buyerBadge: { backgroundColor: colors.primary + '20' },
  sellerBadge: { backgroundColor: colors.success + '20' },
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 16, fontWeight: '600', color: colors.warning },
  ratingCount: { fontSize: 14, color: colors.textSecondary },
  statsCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  statsTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 16, textAlign: 'center' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: colors.primary, marginBottom: 4 },
  statLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },
  availabilityCard: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  availabilityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availabilityLeft: { flex: 1, marginRight: 12 },
  availabilityTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  availabilitySubtext: { fontSize: 14, color: colors.textSecondary },
  infoBox: { marginTop: 16, backgroundColor: colors.success + '10', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.success + '30' },
  infoText: { fontSize: 13, color: colors.success, lineHeight: 18 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  infoCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, color: colors.text, fontWeight: '600', flex: 1, textAlign: 'right', marginLeft: 8 },
  actionButton: { backgroundColor: colors.white, borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  actionButtonText: { fontSize: 16, color: colors.text, fontWeight: '500' },
  actionButtonArrow: { fontSize: 18, color: colors.textLight },
  logoutButton: { marginTop: 16, marginBottom: 24 },
  version: { textAlign: 'center', fontSize: 12, color: colors.textLight },
});
