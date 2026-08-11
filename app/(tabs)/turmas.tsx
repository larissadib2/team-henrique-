import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Card, EmptyState, Fab, Loading, PageHeader, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { DIAS_SEMANA, formatMoeda } from '@/lib/date';
import { Turma } from '@/types/models';

export default function TurmasScreen() {
  const { turmas, alunos, loading } = useData();

  if (loading) return <Loading />;

  const ordenadas = [...turmas].sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Screen>
      <PageHeader title="Turmas" subtitle={`${turmas.length} cadastrada${turmas.length === 1 ? '' : 's'}`} />
      <FlatList
        data={ordenadas}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState title="Nenhuma turma cadastrada" subtitle="Toque no + para criar a primeira turma." />
        }
        renderItem={({ item }) => (
          <TurmaItem turma={item} totalAlunos={alunos.filter((a) => a.turmaIds.includes(item.id)).length} />
        )}
      />
      <Fab onPress={() => router.push('/turma/novo')} />
    </Screen>
  );
}

function TurmaItem({ turma, totalAlunos }: { turma: Turma; totalAlunos: number }) {
  const diasLabel = turma.diasSemana
    .slice()
    .sort((a, b) => a - b)
    .map((d) => DIAS_SEMANA[d])
    .join(', ');

  return (
    <Pressable onPress={() => router.push(`/turma/${turma.id}`)}>
      <Card style={styles.card}>
        <View style={styles.cardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{turma.nome}</Text>
            <Text style={styles.cardMeta}>
              {diasLabel || 'Sem dia definido'} · {turma.horario}
            </Text>
            <Text style={styles.cardMeta}>
              {totalAlunos} aluno{totalAlunos === 1 ? '' : 's'} · {formatMoeda(turma.valorMensalidade)}/mês
            </Text>
          </View>
          <Badge label={turma.ativo ? 'Ativa' : 'Inativa'} tone={turma.ativo ? 'success' : 'danger'} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
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
