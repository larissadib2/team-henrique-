import { router, Stack } from 'expo-router';
import React from 'react';

import { AlunoForm } from '@/components/AlunoForm';
import { useData } from '@/context/DataContext';

export default function NovoAlunoScreen() {
  const { addAluno } = useData();

  return (
    <>
      <Stack.Screen options={{ title: 'Novo aluno' }} />
      <AlunoForm
        onSalvar={async (dados) => {
          await addAluno(dados);
          router.back();
        }}
      />
    </>
  );
}
