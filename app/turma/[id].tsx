import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { Screen } from '@/components/ui';
import { TurmaForm } from '@/components/TurmaForm';
import { useData } from '@/context/DataContext';

export default function EditarTurmaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { turmas, updateTurma, deleteTurma } = useData();
  const turma = turmas.find((t) => t.id === id);

  if (!turma) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Turma' }} />
        <Text style={{ padding: 16 }}>Turma não encontrada.</Text>
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: turma.nome }} />
      <TurmaForm
        turmaInicial={turma}
        onSalvar={async (dados) => {
          await updateTurma(turma.id, dados);
          router.back();
        }}
        onExcluir={async () => {
          await deleteTurma(turma.id);
          router.back();
        }}
      />
    </>
  );
}
