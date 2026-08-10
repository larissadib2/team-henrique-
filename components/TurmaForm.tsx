import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button, Field, Screen } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { DIAS_SEMANA } from '@/lib/date';
import { Turma } from '@/types/models';

type Props = {
  turmaInicial?: Turma;
  onSalvar: (dados: Omit<Turma, 'id' | 'criadoEm'>) => Promise<void>;
  onExcluir?: () => Promise<void>;
};

export function TurmaForm({ turmaInicial, onSalvar, onExcluir }: Props) {
  const [nome, setNome] = useState(turmaInicial?.nome ?? '');
  const [horario, setHorario] = useState(turmaInicial?.horario ?? '');
  const [valorMensalidade, setValorMensalidade] = useState(
    turmaInicial ? String(turmaInicial.valorMensalidade) : ''
  );
  const [diasSemana, setDiasSemana] = useState<number[]>(turmaInicial?.diasSemana ?? []);
  const [ativo, setAtivo] = useState(turmaInicial?.ativo ?? true);
  const [salvando, setSalvando] = useState(false);

  function alternarDia(dia: number) {
    setDiasSemana((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia].sort()));
  }

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome da turma.');
      return;
    }
    const valor = Number(valorMensalidade.replace(',', '.'));
    setSalvando(true);
    try {
      await onSalvar({
        nome: nome.trim(),
        horario: horario.trim() || '00:00',
        diasSemana,
        valorMensalidade: Number.isFinite(valor) ? valor : 0,
        ativo,
      });
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao() {
    if (!onExcluir) return;
    Alert.alert('Excluir turma', `Tem certeza que deseja excluir ${nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: onExcluir },
    ]);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Field label="Nome da turma" value={nome} onChangeText={setNome} placeholder="Ex: Ballet infantil" />
        <Field
          label="Horário"
          value={horario}
          onChangeText={setHorario}
          placeholder="Ex: 18:00"
        />
        <Field
          label="Valor da mensalidade"
          value={valorMensalidade}
          onChangeText={setValorMensalidade}
          placeholder="0,00"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Dias da semana</Text>
        <View style={styles.chips}>
          {DIAS_SEMANA.map((label, index) => {
            const selecionado = diasSemana.includes(index);
            return (
              <Pressable
                key={index}
                onPress={() => alternarDia(index)}
                style={[styles.chip, selecionado && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selecionado && styles.chipTextSelected]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Ativa</Text>
          <Switch value={ativo} onValueChange={setAtivo} />
        </View>

        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          <Button title={salvando ? 'Salvando...' : 'Salvar'} onPress={salvar} disabled={salvando} />
          {onExcluir ? <Button title="Excluir turma" variant="danger" onPress={confirmarExclusao} /> : null}
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
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
