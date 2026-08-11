import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/components/AuthScreen';
import { Button, Field } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function CadastroScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function criarConta() {
    if (!emailValido(email)) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'A confirmação de senha não é igual à senha.');
      return;
    }
    setSalvando(true);
    try {
      await register(email, senha);
      router.replace('/(tabs)');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AuthScreen>
      <Text style={styles.title}>Criar conta</Text>
      <Field
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="professor@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field label="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry />
      <Field
        label="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        placeholder="Repita a senha"
        secureTextEntry
      />
      <Button title={salvando ? 'Criando...' : 'Criar conta'} onPress={criarConta} disabled={salvando} />
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
