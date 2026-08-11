import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button, Card, PageHeader, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function PerfilScreen() {
  const { email, logout } = useAuth();

  function confirmarSaida() {
    Alert.alert('Sair', 'Tem certeza que deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  return (
    <Screen>
      <PageHeader title="Perfil" subtitle="Professor" />
      <View style={styles.content}>
        <Card>
          <Text style={styles.label}>Conta</Text>
          <Text style={styles.email}>{email}</Text>
        </Card>
        <View style={{ marginTop: spacing.lg }}>
          <Button title="Sair" variant="danger" onPress={confirmarSaida} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
