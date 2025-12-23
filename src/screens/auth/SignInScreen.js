import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    // TODO: Replace with actual API call
    setTimeout(async () => {
      // Mock sign in - in production, verify credentials with backend
      const userData = {
        id: 'user-' + Date.now(),
        email,
        name: 'John Doe',
        mobile: '+919876543210',
        isBuyer: true,
        isSeller: false,
      };

      await AsyncStorage.setItem('userToken', 'token-' + Date.now());
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setLoading(false);
      navigation.replace('MainApp');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.demoButtonText}>🎭 Continue in Demo Mode</Text>
            </TouchableOpacity>

            <View style={styles.signUpPrompt}>
              <Text style={styles.signUpPromptText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUpChoice')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  keyboardView: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { fontSize: 28, color: colors.text },
  content: { flex: 1, paddingHorizontal: 24 },
  titleSection: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  form: { flex: 1 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  signInButtonText: { fontSize: 18, fontWeight: '700', color: colors.white },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  demoButton: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  demoButtonText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  signUpPrompt: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  signUpPromptText: { fontSize: 15, color: colors.textSecondary },
  signUpLink: { fontSize: 15, fontWeight: '700', color: colors.primary },
});
