import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { AlunoForm } from '@/components/AlunoForm';
import { Screen } from '@/components/ui';
import { useData } from '@/context/DataContext';

export default function EditarAlunoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { alunos, updateAluno, deleteAluno } = useData();
  const aluno = alunos.find((a) => a.id === id);

  if (!aluno) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Aluno' }} />
        <Text style={{ padding: 16 }}>Aluno não encontrado.</Text>
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: aluno.nome }} />
      <AlunoForm
        alunoInicial={aluno}
        onSalvar={async (dados) => {
          await updateAluno(aluno.id, dados);
          router.back();
        }}
        onExcluir={async () => {
          await deleteAluno(aluno.id);
          router.back();
        }}
      />
    </>
  );
}
