import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Conta } from '@/types/auth';

const CONTA_KEY = '@team-henrique/conta-professor';
const SESSAO_KEY = '@team-henrique/sessao-ativa';

async function hashSenha(senha: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, senha);
}

type AuthContextValue = {
  loading: boolean;
  hasAccount: boolean;
  isAuthenticated: boolean;
  email: string | null;
  register: (email: string, senha: string) => Promise<void>;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [conta, setConta] = useState<Conta | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const [contaRaw, sessaoRaw] = await Promise.all([
        AsyncStorage.getItem(CONTA_KEY),
        AsyncStorage.getItem(SESSAO_KEY),
      ]);
      setConta(contaRaw ? (JSON.parse(contaRaw) as Conta) : null);
      setIsAuthenticated(sessaoRaw === 'true' && !!contaRaw);
      setLoading(false);
    })();
  }, []);

  const register = useCallback(async (email: string, senha: string) => {
    const novaConta: Conta = { email: email.trim().toLowerCase(), senhaHash: await hashSenha(senha) };
    await AsyncStorage.setItem(CONTA_KEY, JSON.stringify(novaConta));
    await AsyncStorage.setItem(SESSAO_KEY, 'true');
    setConta(novaConta);
    setIsAuthenticated(true);
  }, []);

  const login = useCallback(
    async (email: string, senha: string) => {
      if (!conta) return false;
      const senhaHash = await hashSenha(senha);
      const sucesso = conta.email === email.trim().toLowerCase() && conta.senhaHash === senhaHash;
      if (sucesso) {
        await AsyncStorage.setItem(SESSAO_KEY, 'true');
        setIsAuthenticated(true);
      }
      return sucesso;
    },
    [conta]
  );

  const logout = useCallback(async () => {
    await AsyncStorage.setItem(SESSAO_KEY, 'false');
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      hasAccount: !!conta,
      isAuthenticated,
      email: conta?.email ?? null,
      register,
      login,
      logout,
    }),
    [loading, conta, isAuthenticated, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return ctx;
}
