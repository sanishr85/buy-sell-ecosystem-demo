import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../theme/colors';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (userType === 'seller') {
        navigation.navigate('OnboardingSeller');
      } else {
        navigation.replace('MainApp');
      }
    }, 1500);
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
              <TouchableOpacity style={[styles.typeButton, userType === 'buyer' && styles.typeButtonActive]} onPress={() => setUserType('buyer')}>
                <Text style={[styles.typeButtonText, userType === 'buyer' && styles.typeButtonTextActive]}>🛒 Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeButton, userType === 'seller' && styles.typeButtonActive]} onPress={() => setUserType('seller')}>
                <Text style={[styles.typeButtonText, userType === 'seller' && styles.typeButtonTextActive]}>💰 Sell</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <Input label="Full Name" placeholder="John Doe" value={name} onChangeText={setName} />
            <Input label="Email" placeholder="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Input label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Sign Up" onPress={handleSignup} loading={loading} style={styles.signupButton} />
            <Button title="Already have an account? Sign In" onPress={() => navigation.goBack()} variant="outline" />
          </View>
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
  typeButton: { flex: 1, paddingVertical: 16, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.white },
  typeButtonActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  typeButtonText: { fontSize: 16, fontWeight: '600', color: colors.text },
  typeButtonTextActive: { color: colors.primary },
  form: { width: '100%' },
  signupButton: { marginBottom: 12 },
});
