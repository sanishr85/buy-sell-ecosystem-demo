import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export default function SignUpChoiceScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Join Zonzy</Text>
        <Text style={styles.subtitle}>How would you like to get started?</Text>

        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.optionCard, styles.buyerCard]}
            onPress={() => navigation.navigate('BuyerSignUp')}
          >
            <Text style={styles.optionEmoji}>🛒</Text>
            <Text style={styles.optionTitle}>Sign Up as Buyer</Text>
            <Text style={styles.optionDescription}>
              Post needs and hire local service providers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, styles.sellerCard]}
            onPress={() => navigation.navigate('SellerSignUp')}
          >
            <Text style={styles.optionEmoji}>💼</Text>
            <Text style={styles.optionTitle}>Sign Up as Seller</Text>
            <Text style={styles.optionDescription}>
              Offer your services and find customers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, styles.bothCard]}
            onPress={() => navigation.navigate('BuyerSignUp', { enableBoth: true })}
          >
            <Text style={styles.optionEmoji}>👥</Text>
            <Text style={styles.optionTitle}>Sign Up as Both</Text>
            <Text style={styles.optionDescription}>
              Access both buyer and seller features
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signInPrompt}>
          <Text style={styles.signInPromptText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { padding: 4 },
  backText: { fontSize: 18, color: colors.primary, fontWeight: '600' },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 40 },
  options: { gap: 16, marginBottom: 32 },
  optionCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    alignItems: 'center',
  },
  buyerCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  sellerCard: {
    backgroundColor: '#F3E5F5',
    borderColor: '#9C27B0',
  },
  bothCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  optionEmoji: { fontSize: 48, marginBottom: 12 },
  optionTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  optionDescription: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  signInPrompt: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signInPromptText: { fontSize: 15, color: colors.textSecondary },
  signInLink: { fontSize: 15, fontWeight: '700', color: colors.primary },
});
