import { router, Stack } from 'expo-router';
import React from 'react';

import { TurmaForm } from '@/components/TurmaForm';
import { useData } from '@/context/DataContext';

export default function NovaTurmaScreen() {
  const { addTurma } = useData();

  return (
    <>
      <Stack.Screen options={{ title: 'Nova turma' }} />
      <TurmaForm
        onSalvar={async (dados) => {
          await addTurma(dados);
          router.back();
        }}
      />
    </>
  );
}
