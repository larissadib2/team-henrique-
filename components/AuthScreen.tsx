import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

export function AuthScreen({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <View style={styles.brandAccent} />
          <Text style={styles.brandTitle}>Team Henrique</Text>
          <Text style={styles.brandSubtitle}>Beach Tennis</Text>
        </View>
        <View style={styles.card}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandAccent: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginBottom: spacing.sm,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
