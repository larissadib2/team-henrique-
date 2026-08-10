import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Card, EmptyState, Fab, Loading, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { formatMoeda } from '@/lib/date';
import { Aluno } from '@/types/models';

export default function AlunosScreen() {
  const { alunos, turmas, loading } = useData();

  if (loading) return <Loading />;

  const ordenados = [...alunos].sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Alunos</Text>
        <Text style={styles.subtitle}>{alunos.length} cadastrado{alunos.length === 1 ? '' : 's'}</Text>
      </View>
      <FlatList
        data={ordenados}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState title="Nenhum aluno cadastrado" subtitle="Toque no + para adicionar o primeiro aluno." />
        }
        renderItem={({ item }) => (
          <AlunoItem
            aluno={item}
            nomesTurmas={turmas.filter((t) => item.turmaIds.includes(t.id)).map((t) => t.nome)}
          />
        )}
      />
      <Fab onPress={() => router.push('/aluno/novo')} />
    </Screen>
  );
}

function AlunoItem({ aluno, nomesTurmas }: { aluno: Aluno; nomesTurmas: string[] }) {
  return (
    <Pressable onPress={() => router.push(`/aluno/${aluno.id}`)}>
      <Card style={styles.card}>
        <View style={styles.cardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{aluno.nome}</Text>
            <Text style={styles.cardMeta}>
              {nomesTurmas.length > 0 ? nomesTurmas.join(', ') : 'Sem turma vinculada'}
            </Text>
            <Text style={styles.cardMeta}>{formatMoeda(aluno.valorMensalidade)}/mês</Text>
          </View>
          <Badge label={aluno.ativo ? 'Ativo' : 'Inativo'} tone={aluno.ativo ? 'success' : 'danger'} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 96,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
