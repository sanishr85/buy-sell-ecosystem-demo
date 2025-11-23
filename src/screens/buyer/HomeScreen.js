import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.subtitle}>What do you need today?</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.postNeedButton} onPress={() => navigation.navigate('PostNeed')}>
          <Text style={styles.postNeedText}>+ Post a Need</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.myNeedsButton} onPress={() => navigation.navigate('MyNeeds')}>
          <View style={styles.myNeedsLeft}>
            <Text style={styles.myNeedsIcon}>📋</Text>
            <View>
              <Text style={styles.myNeedsTitle}>My Needs</Text>
              <Text style={styles.myNeedsSubtext}>View all your posted needs</Text>
            </View>
          </View>
          <Text style={styles.myNeedsArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate('MyNeeds')}>
              <Text style={styles.quickActionIcon}>📢</Text>
              <Text style={styles.quickActionLabel}>Active Needs</Text>
              <Text style={styles.quickActionCount}>2</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>💬</Text>
              <Text style={styles.quickActionLabel}>New Offers</Text>
              <Text style={styles.quickActionCount}>5</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>🚚</Text>
              <Text style={styles.quickActionLabel}>In Transit</Text>
              <Text style={styles.quickActionCount}>1</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>✅</Text>
              <Text style={styles.quickActionLabel}>Completed</Text>
              <Text style={styles.quickActionCount}>3</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  settingsButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  settingsIcon: { fontSize: 22 },
  postNeedButton: { backgroundColor: colors.primary, padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  postNeedText: { color: colors.white, fontSize: 18, fontWeight: '700' },
  myNeedsButton: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  myNeedsLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  myNeedsIcon: { fontSize: 32, marginRight: 16 },
  myNeedsTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  myNeedsSubtext: { fontSize: 13, color: colors.textSecondary },
  myNeedsArrow: { fontSize: 20, color: colors.textLight },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 16 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickActionCard: { width: '48%', backgroundColor: colors.white, borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  quickActionIcon: { fontSize: 32, marginBottom: 8 },
  quickActionLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: 4, textAlign: 'center' },
  quickActionCount: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
});
