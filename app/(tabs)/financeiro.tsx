import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, EmptyState, Loading, PageHeader, Screen } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { currentReferencia, formatMoeda, formatReferencia } from '@/lib/date';
import { Aluno, Pagamento } from '@/types/models';

export default function FinanceiroScreen() {
  const { alunos, pagamentos, loading, marcarPagamento, gerarMensalidadesDoMes } = useData();
  const [referencia, setReferencia] = useState(currentReferencia());

  const pagamentosDoMes = useMemo(
    () => pagamentos.filter((p) => p.referencia === referencia),
    [pagamentos, referencia]
  );

  const totalPrevisto = pagamentosDoMes.reduce((soma, p) => soma + p.valor, 0);
  const totalRecebido = pagamentosDoMes.filter((p) => p.pago).reduce((soma, p) => soma + p.valor, 0);
  const totalPendente = totalPrevisto - totalRecebido;

  function mudarMes(delta: number) {
    const [ano, mes] = referencia.split('-').map(Number);
    const data = new Date(ano, mes - 1 + delta, 1);
    setReferencia(`${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`);
  }

  if (loading) return <Loading />;

  return (
    <Screen>
      <PageHeader title="Financeiro" />

      <View style={styles.monthBar}>
        <Pressable onPress={() => mudarMes(-1)} style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.monthLabel}>{formatReferencia(referencia)}</Text>
        <Pressable onPress={() => mudarMes(1)} style={styles.monthArrow}>
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard label="Previsto" valor={totalPrevisto} tone="primary" />
        <SummaryCard label="Recebido" valor={totalRecebido} tone="success" />
        <SummaryCard label="Pendente" valor={totalPendente} tone="danger" />
      </View>

      {referencia === currentReferencia() ? (
        <View style={styles.gerarBox}>
          <Button title="Gerar mensalidades do mês" variant="secondary" onPress={gerarMensalidadesDoMes} />
        </View>
      ) : null}

      <FlatList
        data={pagamentosDoMes.sort((a, b) => {
          const nomeA = alunos.find((al) => al.id === a.alunoId)?.nome ?? '';
          const nomeB = alunos.find((al) => al.id === b.alunoId)?.nome ?? '';
          return nomeA.localeCompare(nomeB);
        })}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma mensalidade neste mês"
            subtitle="Toque em 'Gerar mensalidades do mês' para criar as cobranças dos alunos ativos."
          />
        }
        renderItem={({ item }) => (
          <PagamentoItem
            pagamento={item}
            aluno={alunos.find((a) => a.id === item.alunoId)}
            onTogglePago={() => marcarPagamento(item.id, !item.pago)}
          />
        )}
      />
    </Screen>
  );
}

function SummaryCard({
  label,
  valor,
  tone,
}: {
  label: string;
  valor: number;
  tone: 'primary' | 'success' | 'danger';
}) {
  const toneColor = { primary: colors.primary, success: colors.success, danger: colors.warning }[tone];
  return (
    <Card style={styles.summaryCard}>
      <View style={[styles.summaryAccent, { backgroundColor: toneColor }]} />
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, { color: toneColor }]}>{formatMoeda(valor)}</Text>
    </Card>
  );
}

function PagamentoItem({
  pagamento,
  aluno,
  onTogglePago,
}: {
  pagamento: Pagamento;
  aluno?: Aluno;
  onTogglePago: () => void;
}) {
  return (
    <Pressable onPress={onTogglePago}>
      <Card style={styles.card}>
        <View style={styles.cardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{aluno?.nome ?? 'Aluno removido'}</Text>
            <Text style={styles.cardMeta}>{formatMoeda(pagamento.valor)}</Text>
          </View>
          <Badge label={pagamento.pago ? 'Pago' : 'Pendente'} tone={pagamento.pago ? 'success' : 'warning'} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  monthArrow: {
    padding: spacing.xs,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 180,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  summaryAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  gerarBox: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
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
