import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function TopBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.topBar}>
      {/* Left spacer to push icons right */}
      <View style={{ flex: 1 }} />

      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Text style={styles.icon}>🔔</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('ChatList')}
      >
        <Text style={styles.icon}>💬</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => navigation.navigate('TransactionHistory')}
      >
        <Text style={styles.icon}>📊</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.profileIcon}>👤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8, // Reduced spacing
  },
  iconButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E4F3', // Lighter purple/gray
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 20,
    color: colors.primary,
  },
});
