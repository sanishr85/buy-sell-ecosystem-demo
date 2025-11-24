import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../theme/colors';
import { authAPI } from '../../api/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Attempting login for:', email);
      
      // Call real backend API
      const response = await authAPI.login(email, password);
      
      console.log('✅ Login response:', response);

      if (response.success) {
        // Save authentication data to AsyncStorage
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        console.log('💾 Token saved successfully');
        
        // Show success message
        Alert.alert(
          'Success',
          `Welcome back, ${response.user.name}!`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to main app
                navigation.replace('MainApp');
              }
            }
          ]
        );
      } else {
        // Backend returned an error
        console.log('❌ Login failed:', response.message);
        Alert.alert('Login Failed', response.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Network or connection error
      Alert.alert(
        'Connection Error',
        'Unable to connect to server. Please check:\n\n' +
        '• Backend is running (npm run dev)\n' +
        '• You are connected to the network\n' +
        '• API URL is correct in config\n\n' +
        'Technical error: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>
          <View style={styles.form}>
            <Input 
              label="Email" 
              placeholder="your@email.com" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <Input 
              label="Password" 
              placeholder="Enter your password" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry
              editable={!loading}
            />
            <Button 
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading} 
              style={styles.loginButton} 
            />
            <Button 
              title="Create Account" 
              onPress={() => navigation.navigate('Signup')} 
              variant="outline"
              disabled={loading}
            />
          </View>

          {/* Development Helper - Remove in production */}
          {__DEV__ && (
            <View style={styles.devHelper}>
              <Text style={styles.devHelperTitle}>🧪 Test Accounts (Dev Only):</Text>
              <Text 
                style={styles.devHelperText}
                onPress={() => {
                  setEmail('sandeep@example.com');
                  setPassword('SecurePass123');
                }}
              >
                👤 Buyer: sandeep@example.com / SecurePass123
              </Text>
              <Text 
                style={styles.devHelperText}
                onPress={() => {
                  setEmail('seller@example.com');
                  setPassword('SellerPass123');
                }}
              >
                💼 Seller: seller@example.com / SellerPass123
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  form: { width: '100%' },
  loginButton: { marginBottom: 12 },
  devHelper: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  devHelperTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  devHelperText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
});
