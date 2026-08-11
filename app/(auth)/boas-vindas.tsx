import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

export default function BoasVindasScreen() {
  return (
    <AuthScreen>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.message}>
        Você precisa criar uma conta de professor para usar o Team Henrique.
      </Text>
      <Button title="Criar conta" onPress={() => router.push('/(auth)/cadastro')} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 21,
  },
});
