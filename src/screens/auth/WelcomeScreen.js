import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>🌟</Text>
          <Text style={styles.title}>Zonzy</Text>
          <Text style={styles.subtitle}>Grow. Share. Support.</Text>
        </View>

        <View style={styles.illustration}>
          <Text style={styles.illustrationEmoji}>🤝</Text>
          <Text style={styles.illustrationText}>
            Connect with local service providers and customers
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('SignUpChoice')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.demoButtonText}>🎭 Continue in Demo Mode</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginTop: 40 },
  logo: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 48, fontWeight: '800', color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 18, color: colors.textSecondary, textAlign: 'center', fontWeight: '500' },
  illustration: { alignItems: 'center', paddingVertical: 40 },
  illustrationEmoji: { fontSize: 120, marginBottom: 24 },
  illustrationText: { fontSize: 18, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32, lineHeight: 26 },
  actions: { gap: 12 },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: { fontSize: 18, fontWeight: '700', color: colors.white },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: { fontSize: 18, fontWeight: '700', color: colors.primary },
  demoButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  demoButtonText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  footer: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 16 },
});
