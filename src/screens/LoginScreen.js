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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>🎭</Text>
        <Text style={styles.title}>Demo Mode</Text>
        <Text style={styles.subtitle}>
          Explore the full app with simulated data.{'\n'}
          Choose your role to get started:
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="🛒 Login as Buyer"
            onPress={() => handleDemoLogin('buyer')}
            loading={loading}
            style={styles.button}
          />
          <Button
            title="💼 Login as Seller"
            onPress={() => handleDemoLogin('seller')}
            loading={loading}
            style={styles.button}
          />
          <Button
            title="👥 Login as Both"
            onPress={() => handleDemoLogin('both')}
            loading={loading}
            style={styles.button}
          />
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeIcon}>ℹ️</Text>
          <Text style={styles.noticeText}>
            All data is simulated. No real transactions, payments, or backend connections.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  button: {
    width: '100%',
  },
  notice: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
    alignItems: 'center',
  },
  noticeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 20,
  },
});
