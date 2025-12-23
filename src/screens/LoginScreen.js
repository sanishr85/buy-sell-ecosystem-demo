import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/common/Button';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const demoUsers = {
    buyer: {
      id: 'buyer-1',
      name: 'Demo Buyer',
      email: 'demo-buyer@example.com',
      isBuyer: true,
      isSeller: false,
    },
    seller: {
      id: 'seller-1',
      name: 'Demo Seller',
      email: 'demo-seller@example.com',
      isBuyer: false,
      isSeller: true,
    },
    both: {
      id: 'user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      isBuyer: true,
      isSeller: true,
    }
  };

  const handleDemoLogin = async (type) => {
    setLoading(true);

    try {
      await AsyncStorage.setItem('userToken', 'demo-token-' + Date.now());
      await AsyncStorage.setItem('userData', JSON.stringify(demoUsers[type]));
      
      console.log('✅ Demo login as:', type);
      
      setTimeout(() => {
        navigation.replace('MainApp');
      }, 500);
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🎭</Text>
          <Text style={styles.title}>Demo Mode</Text>
          <Text style={styles.subtitle}>
            Explore the full app with simulated data.{'\n'}
            Choose your role to get started:
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.roleCard, { backgroundColor: '#E3F2FD' }]}
            onPress={() => handleDemoLogin('buyer')}
            disabled={loading}
          >
            <Text style={styles.roleEmoji}>🛒</Text>
            <Text style={styles.roleTitle}>Login as Buyer</Text>
            <Text style={styles.roleDesc}>Post needs and hire sellers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.roleCard, { backgroundColor: '#F3E5F5' }]}
            onPress={() => handleDemoLogin('seller')}
            disabled={loading}
          >
            <Text style={styles.roleEmoji}>💼</Text>
            <Text style={styles.roleTitle}>Login as Seller</Text>
            <Text style={styles.roleDesc}>Browse needs and make offers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.roleCard, { backgroundColor: '#E8F5E9' }]}
            onPress={() => handleDemoLogin('both')}
            disabled={loading}
          >
            <Text style={styles.roleEmoji}>👥</Text>
            <Text style={styles.roleTitle}>Login as Both</Text>
            <Text style={styles.roleDesc}>Experience buyer & seller features</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            All data is simulated. No real transactions, payments, or backend connections.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  buttonContainer: { gap: 16, marginBottom: 30 },
  roleCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleEmoji: { fontSize: 40, marginBottom: 8 },
  roleTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  roleDesc: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    alignItems: 'center',
  },
  infoIcon: { fontSize: 24, marginRight: 12 },
  infoText: { flex: 1, fontSize: 13, color: '#E65100', lineHeight: 18 },
});
