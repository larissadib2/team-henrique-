import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { Loading } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <Loading />;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
