import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export default function SignUpScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Coming Soon - Real registration</Text>
        <Text style={styles.note}>For now, use Demo Mode to test the app</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  back: { padding: 20 },
  backText: { fontSize: 18, color: colors.primary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 16 },
  subtitle: { fontSize: 18, color: colors.textSecondary, marginBottom: 8 },
  note: { fontSize: 14, color: colors.textSecondary, fontStyle: 'italic' },
});
