import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function TestLauncherScreen({ navigation }) {
  const buttons = [
    { title: '🔔 Notifications', screen: 'Notifications', color: '#8b5cf6' },
    { title: '📊 Transaction History', screen: 'TransactionHistory', color: '#10b981' },
    { title: '💬 Chat List', screen: 'ChatList', color: '#f59e0b' },
    { title: '🛒 My Needs', screen: 'MyNeeds', color: '#6366f1' },
    { title: '⚙️ Profile', screen: 'Profile', color: '#64748b' },
    { title: '📝 Post Need', screen: 'PostNeed', color: '#ec4899' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Test Launcher</Text>
        <Text style={styles.headerSubtitle}>Quick access to all screens</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.buttonsContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: button.color }]}
              onPress={() => navigation.navigate(button.screen)}
            >
              <Text style={styles.buttonText}>{button.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: colors.textSecondary },
  content: { flex: 1 },
  buttonsContainer: { padding: 20, gap: 12 },
  button: { paddingVertical: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '700' },
});
