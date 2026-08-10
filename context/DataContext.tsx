import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { currentReferencia } from '@/lib/date';
import { generateId, loadList, saveList } from '@/lib/storage';
import { Aluno, Pagamento, PresencaAluno, RegistroPresenca, Turma } from '@/types/models';

type DataContextValue = {
  loading: boolean;

  turmas: Turma[];
  addTurma: (input: Omit<Turma, 'id' | 'criadoEm'>) => Promise<Turma>;
  updateTurma: (id: string, input: Partial<Omit<Turma, 'id' | 'criadoEm'>>) => Promise<void>;
  deleteTurma: (id: string) => Promise<void>;

  alunos: Aluno[];
  addAluno: (input: Omit<Aluno, 'id' | 'criadoEm'>) => Promise<Aluno>;
  updateAluno: (id: string, input: Partial<Omit<Aluno, 'id' | 'criadoEm'>>) => Promise<void>;
  deleteAluno: (id: string) => Promise<void>;

  registrosPresenca: RegistroPresenca[];
  getRegistroPresenca: (turmaId: string, data: string) => RegistroPresenca | undefined;
  salvarPresenca: (turmaId: string, data: string, presencas: PresencaAluno[]) => Promise<void>;

  pagamentos: Pagamento[];
  addPagamento: (input: Omit<Pagamento, 'id' | 'criadoEm'>) => Promise<Pagamento>;
  updatePagamento: (id: string, input: Partial<Omit<Pagamento, 'id' | 'criadoEm'>>) => Promise<void>;
  deletePagamento: (id: string) => Promise<void>;
  marcarPagamento: (id: string, pago: boolean) => Promise<void>;
  gerarMensalidadesDoMes: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [registrosPresenca, setRegistrosPresenca] = useState<RegistroPresenca[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  useEffect(() => {
    (async () => {
      const [t, a, r, p] = await Promise.all([
        loadList<Turma>('turmas'),
        loadList<Aluno>('alunos'),
        loadList<RegistroPresenca>('presencas'),
        loadList<Pagamento>('pagamentos'),
      ]);
      setTurmas(t);
      setAlunos(a);
      setRegistrosPresenca(r);
      setPagamentos(p);
      setLoading(false);
    })();
  }, []);

  const addTurma = useCallback(async (input: Omit<Turma, 'id' | 'criadoEm'>) => {
    const turma: Turma = { ...input, id: generateId(), criadoEm: new Date().toISOString() };
    setTurmas((prev) => {
      const next = [...prev, turma];
      saveList('turmas', next);
      return next;
    });
    return turma;
  }, []);

  const updateTurma = useCallback(async (id: string, input: Partial<Omit<Turma, 'id' | 'criadoEm'>>) => {
    setTurmas((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...input } : t));
      saveList('turmas', next);
      return next;
    });
  }, []);

  const deleteTurma = useCallback(async (id: string) => {
    setTurmas((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveList('turmas', next);
      return next;
    });
    setAlunos((prev) => {
      const next = prev.map((a) => ({ ...a, turmaIds: a.turmaIds.filter((tid) => tid !== id) }));
      saveList('alunos', next);
      return next;
    });
  }, []);

  const addAluno = useCallback(async (input: Omit<Aluno, 'id' | 'criadoEm'>) => {
    const aluno: Aluno = { ...input, id: generateId(), criadoEm: new Date().toISOString() };
    setAlunos((prev) => {
      const next = [...prev, aluno];
      saveList('alunos', next);
      return next;
    });
    return aluno;
  }, []);

  const updateAluno = useCallback(async (id: string, input: Partial<Omit<Aluno, 'id' | 'criadoEm'>>) => {
    setAlunos((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...input } : a));
      saveList('alunos', next);
      return next;
    });
  }, []);

  const deleteAluno = useCallback(async (id: string) => {
    setAlunos((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveList('alunos', next);
      return next;
    });
    setPagamentos((prev) => {
      const next = prev.filter((p) => p.alunoId !== id);
      saveList('pagamentos', next);
      return next;
    });
  }, []);

  const getRegistroPresenca = useCallback(
    (turmaId: string, data: string) => registrosPresenca.find((r) => r.turmaId === turmaId && r.data === data),
    [registrosPresenca]
  );

  const salvarPresenca = useCallback(async (turmaId: string, data: string, presencas: PresencaAluno[]) => {
    setRegistrosPresenca((prev) => {
      const existente = prev.find((r) => r.turmaId === turmaId && r.data === data);
      let next: RegistroPresenca[];
      if (existente) {
        next = prev.map((r) => (r.id === existente.id ? { ...r, presencas } : r));
      } else {
        next = [...prev, { id: generateId(), turmaId, data, presencas }];
      }
      saveList('presencas', next);
      return next;
    });
  }, []);

  const addPagamento = useCallback(async (input: Omit<Pagamento, 'id' | 'criadoEm'>) => {
    const pagamento: Pagamento = { ...input, id: generateId(), criadoEm: new Date().toISOString() };
    setPagamentos((prev) => {
      const next = [...prev, pagamento];
      saveList('pagamentos', next);
      return next;
    });
    return pagamento;
  }, []);

  const updatePagamento = useCallback(async (id: string, input: Partial<Omit<Pagamento, 'id' | 'criadoEm'>>) => {
    setPagamentos((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...input } : p));
      saveList('pagamentos', next);
      return next;
    });
  }, []);

  const deletePagamento = useCallback(async (id: string) => {
    setPagamentos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveList('pagamentos', next);
      return next;
    });
  }, []);

  const marcarPagamento = useCallback(async (id: string, pago: boolean) => {
    setPagamentos((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, pago, dataPagamento: pago ? new Date().toISOString() : null } : p
      );
      saveList('pagamentos', next);
      return next;
    });
  }, []);

  const gerarMensalidadesDoMes = useCallback(async () => {
    const referencia = currentReferencia();
    setPagamentos((prev) => {
      const existentes = new Set(prev.filter((p) => p.referencia === referencia).map((p) => p.alunoId));
      const novos: Pagamento[] = alunos
        .filter((a) => a.ativo && !existentes.has(a.id))
        .map((a) => ({
          id: generateId(),
          alunoId: a.id,
          referencia,
          valor: a.valorMensalidade,
          pago: false,
          dataPagamento: null,
          criadoEm: new Date().toISOString(),
        }));
      if (novos.length === 0) return prev;
      const next = [...prev, ...novos];
      saveList('pagamentos', next);
      return next;
    });
  }, [alunos]);

  const value = useMemo<DataContextValue>(
    () => ({
      loading,
      turmas,
      addTurma,
      updateTurma,
      deleteTurma,
      alunos,
      addAluno,
      updateAluno,
      deleteAluno,
      registrosPresenca,
      getRegistroPresenca,
      salvarPresenca,
      pagamentos,
      addPagamento,
      updatePagamento,
      deletePagamento,
      marcarPagamento,
      gerarMensalidadesDoMes,
    }),
    [
      loading,
      turmas,
      addTurma,
      updateTurma,
      deleteTurma,
      alunos,
      addAluno,
      updateAluno,
      deleteAluno,
      registrosPresenca,
      getRegistroPresenca,
      salvarPresenca,
      pagamentos,
      addPagamento,
      updatePagamento,
      deletePagamento,
      marcarPagamento,
      gerarMensalidadesDoMes,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData deve ser usado dentro de um DataProvider');
  return ctx;
}
