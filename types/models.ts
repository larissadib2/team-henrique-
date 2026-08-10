export type Turma = {
  id: string;
  nome: string;
  diasSemana: number[]; // 0 = domingo ... 6 = sábado
  horario: string; // "HH:mm"
  valorMensalidade: number;
  ativo: boolean;
  criadoEm: string; // ISO
};

export type Aluno = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  turmaIds: string[];
  valorMensalidade: number;
  ativo: boolean;
  criadoEm: string; // ISO
};

export type PresencaAluno = {
  alunoId: string;
  presente: boolean;
};

export type RegistroPresenca = {
  id: string;
  turmaId: string;
  data: string; // "YYYY-MM-DD"
  presencas: PresencaAluno[];
};

export type Pagamento = {
  id: string;
  alunoId: string;
  referencia: string; // "YYYY-MM"
  valor: number;
  pago: boolean;
  dataPagamento: string | null; // ISO
  criadoEm: string; // ISO
};
