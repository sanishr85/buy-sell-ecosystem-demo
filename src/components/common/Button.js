import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const buttonStyle = [styles.button, variant === 'primary' && styles.primary, variant === 'secondary' && styles.secondary, variant === 'outline' && styles.outline, disabled && styles.disabled, style];
  const textStyle = [styles.text, variant === 'outline' && styles.outlineText];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} /> : <Text style={textStyle}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 56 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary },
  disabled: { opacity: 0.5 },
  text: { color: colors.white, fontSize: 16, fontWeight: '600' },
  outlineText: { color: colors.primary },
});
