import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button, Field } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);

  async function entrar() {
    setEntrando(true);
    try {
      const sucesso = await login(email, senha);
      if (sucesso) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Não foi possível entrar', 'E-mail ou senha incorretos.');
      }
    } finally {
      setEntrando(false);
    }
  }

  return (
    <AuthScreen>
      <Text style={styles.title}>Entrar</Text>
      <Field
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="professor@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field label="Senha" value={senha} onChangeText={setSenha} placeholder="Sua senha" secureTextEntry />
      <Button title={entrando ? 'Entrando...' : 'Entrar'} onPress={entrar} disabled={entrando} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
