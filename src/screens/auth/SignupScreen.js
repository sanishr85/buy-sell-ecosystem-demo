import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../theme/colors';
import { authAPI } from '../../api/auth';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Name validation (at least 2 characters)
    if (name.trim().length < 2) {
      Alert.alert('Error', 'Please enter a valid name (at least 2 characters)');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation (at least 6 characters)
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Phone validation (optional, but if provided must be valid)
    if (phone && phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Attempting registration for:', email);
      
      // Call backend API
      const response = await authAPI.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone || null,
      });
      
      console.log('✅ Registration response:', response);

      if (response.success) {
        // Save authentication data
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        console.log('💾 Token and user data saved');
        
        // Show success message
        Alert.alert(
          'Success',
          `Welcome to the marketplace, ${response.user.name}!`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate based on user type selection
                if (userType === 'seller') {
                  // For sellers, go to onboarding first
                  navigation.navigate('OnboardingSeller');
                } else {
                  // For buyers, go directly to main app
                  navigation.replace('MainApp');
                }
              }
            }
          ]
        );
      } else {
        // Backend returned an error
        console.log('❌ Registration failed:', response.message);
        Alert.alert('Registration Failed', response.message || 'Unable to create account');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the marketplace</Text>
          </View>

          <View style={styles.typeSelector}>
            <Text style={styles.typeSelectorLabel}>I want to:</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity 
                style={[styles.typeButton, userType === 'buyer' && styles.typeButtonActive]} 
                onPress={() => setUserType('buyer')}
                disabled={loading}
              >
                <Text style={[styles.typeButtonText, userType === 'buyer' && styles.typeButtonTextActive]}>
                  🛒 Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeButton, userType === 'seller' && styles.typeButtonActive]} 
                onPress={() => setUserType('seller')}
                disabled={loading}
              >
                <Text style={[styles.typeButtonText, userType === 'seller' && styles.typeButtonTextActive]}>
                  💰 Sell
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <Input 
              label="Full Name *" 
              placeholder="John Doe" 
              value={name} 
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
            />
            <Input 
              label="Email *" 
              placeholder="your@email.com" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <Input 
              label="Phone (Optional)" 
              placeholder="+1234567890" 
              value={phone} 
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!loading}
            />
            <Input 
              label="Password *" 
              placeholder="Min 6 characters" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry
              editable={!loading}
            />
            
            <Text style={styles.passwordHint}>* Password must be at least 6 characters</Text>
            
            <Button 
              title="Sign Up" 
              onPress={handleSignup} 
              loading={loading} 
              style={styles.signupButton} 
            />
            <Button 
              title="Already have an account? Sign In" 
              onPress={() => navigation.goBack()} 
              variant="outline"
              disabled={loading}
            />
          </View>

          {/* Development Helper - Remove in production */}
          {__DEV__ && (
            <View style={styles.devHelper}>
              <Text style={styles.devHelperTitle}>🧪 Quick Fill (Dev Only):</Text>
              <Text 
                style={styles.devHelperText}
                onPress={() => {
                  setName('Test User');
                  setEmail(`testuser${Date.now()}@example.com`);
                  setPassword('Test123456');
                  setPhone('+1234567890');
                }}
              >
                👤 Fill with test data (unique email)
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
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  typeSelector: { marginBottom: 24 },
  typeSelectorLabel: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  typeButtons: { flexDirection: 'row', gap: 12 },
  typeButton: { 
    flex: 1, 
    paddingVertical: 16, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: colors.border, 
    alignItems: 'center', 
    backgroundColor: colors.white 
  },
  typeButtonActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  typeButtonText: { fontSize: 16, fontWeight: '600', color: colors.text },
  typeButtonTextActive: { color: colors.primary },
  form: { width: '100%' },
  passwordHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -8,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  signupButton: { marginBottom: 12 },
  devHelper: {
    marginTop: 24,
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
