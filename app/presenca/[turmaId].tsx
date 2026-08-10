import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, EmptyState, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { formatDateBR, todayISO, toISODate } from '@/lib/date';
import { Aluno } from '@/types/models';

export default function PresencaScreen() {
  const { turmaId } = useLocalSearchParams<{ turmaId: string }>();
  const { turmas, alunos, getRegistroPresenca, salvarPresenca } = useData();

  const turma = turmas.find((t) => t.id === turmaId);
  const alunosDaTurma = useMemo(
    () => alunos.filter((a) => a.turmaIds.includes(turmaId) && a.ativo).sort((a, b) => a.nome.localeCompare(b.nome)),
    [alunos, turmaId]
  );

  const [dataSelecionada, setDataSelecionada] = useState(() => new Date());
  const dataISO = toISODate(dataSelecionada);
  const registro = getRegistroPresenca(turmaId, dataISO);

  const [presencas, setPresencas] = useState<Record<string, boolean>>(() => {
    const inicial: Record<string, boolean> = {};
    for (const p of registro?.presencas ?? []) inicial[p.alunoId] = p.presente;
    return inicial;
  });

  function mudarDia(delta: number) {
    const nova = new Date(dataSelecionada);
    nova.setDate(nova.getDate() + delta);
    setDataSelecionada(nova);
    const novoRegistro = getRegistroPresenca(turmaId, toISODate(nova));
    const proximo: Record<string, boolean> = {};
    for (const p of novoRegistro?.presencas ?? []) proximo[p.alunoId] = p.presente;
    setPresencas(proximo);
  }

  function alternarPresenca(alunoId: string) {
    setPresencas((prev) => ({ ...prev, [alunoId]: !prev[alunoId] }));
  }

  async function salvar() {
    const lista = alunosDaTurma.map((a) => ({ alunoId: a.id, presente: !!presencas[a.id] }));
    await salvarPresenca(turmaId, dataISO, lista);
    Alert.alert('Presença salva', `Chamada de ${formatDateBR(dataISO)} registrada.`);
  }

  if (!turma) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Presença' }} />
        <Text style={{ padding: 16 }}>Turma não encontrada.</Text>
      </Screen>
    );
  }

  const totalPresentes = alunosDaTurma.filter((a) => presencas[a.id]).length;

  return (
    <Screen>
      <Stack.Screen options={{ title: turma.nome }} />
      <View style={styles.dateBar}>
        <Pressable onPress={() => mudarDia(-1)} style={styles.dateArrow}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.dateLabel}>
          {formatDateBR(dataISO)}
          {dataISO === todayISO() ? ' (hoje)' : ''}
        </Text>
        <Pressable onPress={() => mudarDia(1)} style={styles.dateArrow}>
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={alunosDaTurma}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          alunosDaTurma.length > 0 ? (
            <Text style={styles.resumo}>
              {totalPresentes} de {alunosDaTurma.length} presente{totalPresentes === 1 ? '' : 's'}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState title="Nenhum aluno nesta turma" subtitle="Vincule alunos a esta turma para fazer a chamada." />
        }
        renderItem={({ item }) => (
          <PresencaItem aluno={item} presente={!!presencas[item.id]} onToggle={() => alternarPresenca(item.id)} />
        )}
      />

      {alunosDaTurma.length > 0 ? (
        <View style={styles.footer}>
          <Button title="Salvar presença" onPress={salvar} />
        </View>
      ) : null}
    </Screen>
  );
}

function PresencaItem({ aluno, presente, onToggle }: { aluno: Aluno; presente: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle}>
      <Card style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardTitle}>{aluno.nome}</Text>
          <Badge label={presente ? 'Presente' : 'Faltou'} tone={presente ? 'success' : 'danger'} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  dateArrow: {
    padding: spacing.xs,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 160,
    textAlign: 'center',
  },
  resumo: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
});
