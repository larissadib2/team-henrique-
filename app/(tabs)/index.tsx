import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Card, EmptyState, Loading, PageHeader, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { DIAS_SEMANA_LONGO, todayISO } from '@/lib/date';
import { Turma } from '@/types/models';

export default function AgendaScreen() {
  const { turmas, alunos, loading } = useData();

  const hoje = new Date();
  const diaSemanaHoje = hoje.getDay();
  const dataHojeISO = todayISO();

  const turmasHoje = useMemo(
    () =>
      turmas
        .filter((t) => t.ativo && t.diasSemana.includes(diaSemanaHoje))
        .sort((a, b) => a.horario.localeCompare(b.horario)),
    [turmas, diaSemanaHoje]
  );

  if (loading) return <Loading />;

  return (
    <Screen>
      <PageHeader title="Agenda" subtitle={DIAS_SEMANA_LONGO[diaSemanaHoje]} />
      <FlatList
        data={turmasHoje}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma aula hoje"
            subtitle="As turmas com aula programada para hoje aparecem aqui."
          />
        }
        renderItem={({ item }) => (
          <TurmaHojeItem
            turma={item}
            totalAlunos={alunos.filter((a) => a.turmaIds.includes(item.id)).length}
            data={dataHojeISO}
          />
        )}
      />
    </Screen>
  );
}

function TurmaHojeItem({ turma, totalAlunos, data }: { turma: Turma; totalAlunos: number; data: string }) {
  return (
    <Pressable onPress={() => router.push(`/presenca/${turma.id}`)}>
      <Card style={styles.card}>
        <View style={styles.cardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{turma.nome}</Text>
            <Text style={styles.cardMeta}>
              {turma.horario} · {totalAlunos} aluno{totalAlunos === 1 ? '' : 's'}
            </Text>
          </View>
          <Badge label="Fazer presença" tone="accent" />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
