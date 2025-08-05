// Exemplo inicial de configuração de workflows do ChatbotACS
// Pode ser expandido e editado pela tela de administração

export type WorkflowStep = {
  key: string;
  pergunta: string;
  obrigatorio?: boolean;
  validacao?: string;
};

export type Workflow = {
  id: string;
  nome: string;
  descricao?: string;
  etapas: WorkflowStep[];
};

export const workflows: Workflow[] = [
  {
    id: 'cadastroCidadao',
    nome: 'Cadastro de Cidadão',
    descricao: 'Fluxo para cadastrar um novo cidadão',
    etapas: [
      { key: 'nome', pergunta: 'Qual o nome completo?', obrigatorio: true, validacao: 'min:3' },
      { key: 'cpf', pergunta: 'Qual o CPF?', obrigatorio: true, validacao: 'cpf' },
      { key: 'dataNascimento', pergunta: 'Qual a data de nascimento?', obrigatorio: true, validacao: 'data' }
    ]
  },
  {
    id: 'visitaCidadao',
    nome: 'Visita a Cidadão',
    descricao: 'Registrar visita a um cidadão',
    etapas: [
      { key: 'cidadao', pergunta: 'Nome do cidadão visitado?', obrigatorio: true },
      { key: 'visitaRealizada', pergunta: 'Visita realizada? (Sim/Não)', obrigatorio: true },
      { key: 'motivo', pergunta: 'Motivo da visita?', obrigatorio: true }
    ]
  }
];
