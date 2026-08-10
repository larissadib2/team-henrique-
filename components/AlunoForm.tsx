import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button, Field, Screen } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { Aluno } from '@/types/models';

type Props = {
  alunoInicial?: Aluno;
  onSalvar: (dados: Omit<Aluno, 'id' | 'criadoEm'>) => Promise<void>;
  onExcluir?: () => Promise<void>;
};

export function AlunoForm({ alunoInicial, onSalvar, onExcluir }: Props) {
  const { turmas } = useData();
  const [nome, setNome] = useState(alunoInicial?.nome ?? '');
  const [telefone, setTelefone] = useState(alunoInicial?.telefone ?? '');
  const [email, setEmail] = useState(alunoInicial?.email ?? '');
  const [valorMensalidade, setValorMensalidade] = useState(
    alunoInicial ? String(alunoInicial.valorMensalidade) : ''
  );
  const [turmaIds, setTurmaIds] = useState<string[]>(alunoInicial?.turmaIds ?? []);
  const [ativo, setAtivo] = useState(alunoInicial?.ativo ?? true);
  const [salvando, setSalvando] = useState(false);

  function alternarTurma(id: string) {
    setTurmaIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome do aluno.');
      return;
    }
    const valor = Number(valorMensalidade.replace(',', '.'));
    setSalvando(true);
    try {
      await onSalvar({
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        turmaIds,
        valorMensalidade: Number.isFinite(valor) ? valor : 0,
        ativo,
      });
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao() {
    if (!onExcluir) return;
    Alert.alert('Excluir aluno', `Tem certeza que deseja excluir ${nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: onExcluir },
    ]);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Nome do aluno" />
        <Field
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
        />
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Valor da mensalidade"
          value={valorMensalidade}
          onChangeText={setValorMensalidade}
          placeholder="0,00"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Turmas</Text>
        {turmas.length === 0 ? (
          <Text style={styles.hint}>Nenhuma turma cadastrada ainda.</Text>
        ) : (
          <View style={styles.chips}>
            {turmas.map((t) => {
              const selecionada = turmaIds.includes(t.id);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => alternarTurma(t.id)}
                  style={[styles.chip, selecionada && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selecionada && styles.chipTextSelected]}>{t.nome}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.label}>Ativo</Text>
          <Switch value={ativo} onValueChange={setAtivo} />
        </View>

        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          <Button title={salvando ? 'Salvando...' : 'Salvar'} onPress={salvar} disabled={salvando} />
          {onExcluir ? <Button title="Excluir aluno" variant="danger" onPress={confirmarExclusao} /> : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
});
