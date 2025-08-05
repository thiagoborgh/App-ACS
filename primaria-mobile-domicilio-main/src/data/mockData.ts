// Dados mocados para o protótipo da aplicação ACS

export interface Logradouro {
  id: string;
  nome: string;
  tipo: string; // Rua, Avenida, etc.
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  quantidadeDomicilios: number;
  status: 'ativo' | 'inativo';
  dataCadastro: string;
  dataUltimaVisita?: string;
}

export interface Domicilio {
  id: string;
  logradouroId: string;
  numero: string;
  complemento?: string;
  referencia?: string;
  tipo: 'casa' | 'apartamento' | 'comercio' | 'outros';
  situacao: 'ocupado' | 'desocupado' | 'recusou' | 'ausente';
  quantidadeFamilias: number;
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
  dataCadastro: string;
  dataUltimaVisita?: string;
}

export interface Familia {
  id: string;
  domicilioId: string;
  responsavel: string;
  cpfResponsavel: string;
  telefone?: string;
  rendaFamiliar?: number;
  quantidadeMembers: number;
  possuiPlanSaude: boolean;
  beneficioGoverno: string[];
  dataCadastro: string;
  dataUltimaVisita?: string;
  status: 'ativo' | 'inativo' | 'mudou';
}

export interface Pessoa {
  id: string;
  familiaId: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  idade: number;
  sexo: 'masculino' | 'feminino';
  corRaca: string;
  escolaridade: string;
  ocupacao?: string;
  responsavelFamilia: boolean;
  possuiDeficiencia: boolean;
  tipoDeficiencia?: string[];
  condicoesSaude: {
    hipertensao: boolean;
    diabetes: boolean;
    doencaCardiaca: boolean;
    doencaRenal: boolean;
    outras: string[];
  };
  dataCadastro: string;
  // Novos campos para conformidade e-SUS
  condicoesSaudeDetalhadas?: CondicoesSaudeDetalhadas;
  gestante?: {
    eh: boolean;
    semanas?: number;
    risco?: 'habitual' | 'alto_risco';
    ultimaConsulta?: string;
  };
}

// Novas interfaces para conformidade e-SUS
export interface CondicoesSaudeDetalhadas {
  // Doenças crônicas com detalhamento
  hipertensao: { 
    possui: boolean; 
    controlada?: boolean; 
    medicacao?: string[];
    ultimaAferidao?: string;
    valorPA?: string;
  };
  diabetes: { 
    possui: boolean; 
    tipo?: 'tipo1' | 'tipo2' | 'gestacional'; 
    controlada?: boolean;
    ultimaGlicemia?: string;
    valorGlicemia?: number;
  };
  doencaCardiaca: { possui: boolean; tipo?: string };
  doencaRenal: { possui: boolean; estagio?: '1' | '2' | '3' | '4' | '5' };
  
  // Saúde mental
  depressao: { possui: boolean; tratamento?: boolean };
  ansiedade: { possui: boolean; tratamento?: boolean };
  
  // Outras condições
  deficiencia: { possui: boolean; tipos?: string[] };
  tabagismo: { possui: boolean; cigarrosPorDia?: number };
  alcoolismo: { possui: boolean; frequencia?: string };
}

export interface CondicoesMoradiaDetalhadas {
  tipoImovel: 'domicilio' | 'abrigo' | 'instituicao_longa_permanencia' | 'unidade_prisional';
  situacaoMoradia: 'propria' | 'alugada' | 'cedida' | 'ocupacao' | 'situacao_rua';
  materialParedes: 'alvenaria' | 'madeira' | 'misto' | 'lona' | 'sem_parede';
  abastecimentoAgua: 'rede_publica' | 'poco_artesiano' | 'cisterna' | 'rio';
  tratamentoAgua: 'filtrada' | 'fervida' | 'clorada' | 'sem_tratamento';
  destinacaoLixo: 'coleta_publica' | 'queimado' | 'enterrado' | 'ceu_aberto';
  energiaEletrica: boolean;
  tipoEnergia?: 'concessionaria' | 'gerador' | 'solar';
}

export interface Visita {
  id: string;
  tipo: 'cidadao' | 'familia' | 'imovel';
  data: string;
  hora: string;
  agenteSaude: string;
  local: {
    logradouro: string;
    numero: string;
    bairro: string;
  };
  objetivos: string[];
  observacoes: string;
  proximaVisita?: string;
  status: 'realizada' | 'agendada' | 'cancelada';
  familiaId?: string;
  pessoaId?: string;
  domicilioId?: string;
  // Novos campos detalhados conforme e-SUS
  visitaDetalhada?: VisitaDetalhada;
}

// Interface para visitas detalhadas conforme e-SUS (RN01-RN60)
export interface VisitaDetalhada {
  // RN01 - Obrigatório
  visitaFoiRealizada: boolean;
  
  // RN02 - Motivos (múltipla escolha)
  motivosVisita: string[];
  
  // RN03 - Busca Ativa (expandível)
  buscaAtiva: {
    consultaMedica: boolean;
    consultaOdontologica: boolean;
    vacinacao: boolean;
    examePreventivo: boolean;
    exameMama: boolean;
    planejamentoFamiliar: boolean;
    preNatal: boolean;
    puericultura: boolean;
  };
  
  // RN04 - Acompanhamento (expandível)
  acompanhamento: {
    gestante: boolean;
    puerpera: boolean;
    recemNascido: boolean;
    crianca: boolean;
    pessoaComDeficiencia: boolean;
    hipertensao: boolean;
    diabetes: boolean;
    tuberculose: boolean;
    hanseniase: boolean;
    saudeMental: boolean;
    dependenciaQuimica: boolean;
    reabilitacao: boolean;
    domiciliar: boolean;
    condicoesCronicas: boolean;
  };
  
  // RN05 - Antropometria
  antropometria?: {
    peso: string; // 0.5-300kg
    altura: string; // 30-250cm
    imc?: number; // calculado automaticamente
    circunferenciaAbdominal?: string;
  };
  
  // RN06/RN07 - Acompanhamento profissional
  visitaAcompanhada: boolean;
  profissionalAcompanhante?: string;
  
  // Dados clínicos adicionais
  sinaisVitais?: {
    pressaoArterial?: string;
    frequenciaCardiaca?: number;
    temperatura?: number;
    saturacaoOxigenio?: number;
  };
  
  // Orientações e encaminhamentos
  orientacoesDadas: string[];
  encaminhamentos: string[];
  
  // Coordenadas e dados técnicos
  coordenadas?: { lat: number; lng: number };
  duracaoVisita?: number; // em minutos
}

export interface RelatorioSintese {
  periodo: string;
  totalFamiliasCadastradas: number;
  totalPessoasCadastradas: number;
  totalDomiciliosVisitados: number;
  totalVisitasRealizadas: number;
  coberturaPercentual: number;
  metaAlcancada: boolean;
}

// Dados mocados
export const mockLogradouros: Logradouro[] = [
  {
    id: '1',
    nome: 'Rua das Flores',
    tipo: 'Rua',
    bairro: 'Centro',
    cep: '12345-678',
    cidade: 'São Paulo',
    uf: 'SP',
    quantidadeDomicilios: 45,
    status: 'ativo',
    dataCadastro: '2024-01-15',
    dataUltimaVisita: '2024-08-01'
  },
  {
    id: '2',
    nome: 'Avenida Brasil',
    tipo: 'Avenida',
    bairro: 'Vila Nova',
    cep: '12345-679',
    cidade: 'São Paulo',
    uf: 'SP',
    quantidadeDomicilios: 78,
    status: 'ativo',
    dataCadastro: '2024-01-20',
    dataUltimaVisita: '2024-07-28'
  },
  {
    id: '3',
    nome: 'Rua da Esperança',
    tipo: 'Rua',
    bairro: 'Jardim América',
    cep: '12345-680',
    cidade: 'São Paulo',
    uf: 'SP',
    quantidadeDomicilios: 32,
    status: 'ativo',
    dataCadastro: '2024-02-10',
    dataUltimaVisita: '2024-07-25'
  }
];

export const mockDomicilios: Domicilio[] = [
  {
    id: '1',
    logradouroId: '1',
    numero: '123',
    complemento: 'Casa A',
    referencia: 'Próximo ao mercado',
    tipo: 'casa',
    situacao: 'ocupado',
    quantidadeFamilias: 1,
    coordenadas: {
      latitude: -23.5505,
      longitude: -46.6333
    },
    dataCadastro: '2024-01-16',
    dataUltimaVisita: '2024-08-01'
  },
  {
    id: '2',
    logradouroId: '1',
    numero: '125',
    tipo: 'casa',
    situacao: 'ocupado',
    quantidadeFamilias: 2,
    coordenadas: {
      latitude: -23.5506,
      longitude: -46.6334
    },
    dataCadastro: '2024-01-18',
    dataUltimaVisita: '2024-07-30'
  },
  {
    id: '3',
    logradouroId: '2',
    numero: '456',
    complemento: 'Apto 201',
    tipo: 'apartamento',
    situacao: 'ocupado',
    quantidadeFamilias: 1,
    coordenadas: {
      latitude: -23.5507,
      longitude: -46.6335
    },
    dataCadastro: '2024-01-22',
    dataUltimaVisita: '2024-07-28'
  }
];

export const mockFamilias: Familia[] = [
  {
    id: '1',
    domicilioId: '1',
    responsavel: 'Maria Silva Santos',
    cpfResponsavel: '123.456.789-01',
    telefone: '(11) 99999-1234',
    rendaFamiliar: 2500,
    quantidadeMembers: 4,
    possuiPlanSaude: false,
    beneficioGoverno: ['Bolsa Família', 'Auxílio Brasil'],
    dataCadastro: '2024-01-16',
    dataUltimaVisita: '2024-08-01',
    status: 'ativo'
  },
  {
    id: '2',
    domicilioId: '2',
    responsavel: 'João Oliveira Lima',
    cpfResponsavel: '234.567.890-12',
    telefone: '(11) 99999-5678',
    rendaFamiliar: 1800,
    quantidadeMembers: 3,
    possuiPlanSaude: true,
    beneficioGoverno: ['BPC'],
    dataCadastro: '2024-01-18',
    dataUltimaVisita: '2024-07-30',
    status: 'ativo'
  },
  {
    id: '3',
    domicilioId: '2',
    responsavel: 'Ana Paula Costa',
    cpfResponsavel: '345.678.901-23',
    telefone: '(11) 99999-9012',
    rendaFamiliar: 3200,
    quantidadeMembers: 2,
    possuiPlanSaude: true,
    beneficioGoverno: [],
    dataCadastro: '2024-01-19',
    dataUltimaVisita: '2024-07-29',
    status: 'ativo'
  }
];

export const mockPessoas: Pessoa[] = [
  {
    id: '1',
    familiaId: '1',
    nome: 'Maria Silva Santos',
    cpf: '123.456.789-01',
    dataNascimento: '1985-03-15',
    idade: 39,
    sexo: 'feminino',
    corRaca: 'Parda',
    escolaridade: 'Ensino Médio Completo',
    ocupacao: 'Diarista',
    responsavelFamilia: true,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: true,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-01-16'
  },
  {
    id: '2',
    familiaId: '1',
    nome: 'Carlos Silva Santos',
    cpf: '456.789.012-34',
    dataNascimento: '1980-07-22',
    idade: 44,
    sexo: 'masculino',
    corRaca: 'Pardo',
    escolaridade: 'Ensino Fundamental Completo',
    ocupacao: 'Pedreiro',
    responsavelFamilia: false,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-01-16'
  },
  {
    id: '3',
    familiaId: '1',
    nome: 'Pedro Silva Santos',
    cpf: '567.890.123-45',
    dataNascimento: '2010-11-08',
    idade: 13,
    sexo: 'masculino',
    corRaca: 'Pardo',
    escolaridade: 'Ensino Fundamental Incompleto',
    responsavelFamilia: false,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-01-16'
  },
  {
    id: '4',
    familiaId: '1',
    nome: 'Ana Silva Santos',
    cpf: '678.901.234-56',
    dataNascimento: '2015-05-12',
    idade: 9,
    sexo: 'feminino',
    corRaca: 'Parda',
    escolaridade: 'Ensino Fundamental Incompleto',
    responsavelFamilia: false,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-01-16'
  },
  {
    id: '5',
    familiaId: '2',
    nome: 'João Oliveira Lima',
    cpf: '234.567.890-12',
    dataNascimento: '1975-12-03',
    idade: 48,
    sexo: 'masculino',
    corRaca: 'Branco',
    escolaridade: 'Ensino Superior Completo',
    ocupacao: 'Professor',
    responsavelFamilia: true,
    possuiDeficiencia: true,
    tipoDeficiencia: ['Deficiência Física'],
    condicoesSaude: {
      hipertensao: true,
      diabetes: true,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: ['Artrite']
    },
    dataCadastro: '2024-01-18'
  },
  // Pessoas do roteiro do Jonathan
  {
    id: 'p_carlos_mendonca',
    familiaId: 'f_mendonca',
    nome: 'Carlos Mendonça',
    cpf: '123.456.789-00',
    dataNascimento: '1979-02-15',
    idade: 45,
    sexo: 'masculino',
    corRaca: 'Pardo',
    escolaridade: 'Ensino Médio Completo',
    ocupacao: 'Mecânico',
    responsavelFamilia: true,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: true,
      diabetes: false,
      doencaCardiaca: true,
      doencaRenal: false,
      outras: ['AVC recente']
    },
    dataCadastro: '2024-11-15'
  },
  {
    id: 'p_rosa_silva',
    familiaId: 'f_silva_rosa',
    nome: 'Rosa Silva',
    cpf: '987.654.321-00',
    dataNascimento: '1939-06-10',
    idade: 85,
    sexo: 'feminino',
    corRaca: 'Branca',
    escolaridade: 'Ensino Fundamental Incompleto',
    ocupacao: 'Aposentada',
    responsavelFamilia: true,
    possuiDeficiencia: true,
    tipoDeficiencia: ['Deficiência Física - Acamada'],
    condicoesSaude: {
      hipertensao: true,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: ['Úlcera de pressão']
    },
    dataCadastro: '2024-08-20'
  },
  {
    id: 'p_ana_costa',
    familiaId: 'f_costa',
    nome: 'Ana Costa',
    cpf: '456.789.123-11',
    dataNascimento: '1992-09-25',
    idade: 32,
    sexo: 'feminino',
    corRaca: 'Parda',
    escolaridade: 'Ensino Superior Incompleto',
    ocupacao: 'Do lar',
    responsavelFamilia: true,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-10-05'
  },
  {
    id: 'p_pedro_costa',
    familiaId: 'f_costa',
    nome: 'Pedro Costa',
    cpf: '',
    dataNascimento: '2024-07-15',
    idade: 0,
    sexo: 'masculino',
    corRaca: 'Parda',
    escolaridade: 'Não se aplica',
    ocupacao: 'Não se aplica',
    responsavelFamilia: false,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-10-05'
  },
  {
    id: 'p_joaquim_santos',
    familiaId: 'f_santos_joaquim',
    nome: 'Joaquim Santos',
    cpf: '456.789.123-00',
    dataNascimento: '1972-04-18',
    idade: 52,
    sexo: 'masculino',
    corRaca: 'Negro',
    escolaridade: 'Ensino Fundamental Completo',
    ocupacao: 'Comerciante',
    responsavelFamilia: true,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: true,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-09-12'
  },
  {
    id: 'p_maria_fernandes',
    familiaId: 'f_fernandes',
    nome: 'Maria Fernandes',
    cpf: '789.123.456-00',
    dataNascimento: '1986-01-22',
    idade: 38,
    sexo: 'feminino',
    corRaca: 'Parda',
    escolaridade: 'Ensino Médio Completo',
    ocupacao: 'Auxiliar de enfermagem',
    responsavelFamilia: true,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: ['Gestante 32 semanas']
    },
    dataCadastro: '2024-06-30'
  },
  {
    id: 'p_antonio_lima',
    familiaId: 'f_lima',
    nome: 'Antônio Lima',
    cpf: '321.654.987-00',
    dataNascimento: '1957-11-08',
    idade: 67,
    sexo: 'masculino',
    corRaca: 'Pardo',
    escolaridade: 'Ensino Fundamental Incompleto',
    ocupacao: 'Aposentado',
    responsavelFamilia: true,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: true,
      diabetes: false,
      doencaCardiaca: true,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-07-14'
  },
  {
    id: 'p_sandra_oliveira',
    familiaId: 'f_oliveira',
    nome: 'Sandra Oliveira',
    cpf: '654.321.987-00',
    dataNascimento: '1988-03-12',
    idade: 36,
    sexo: 'feminino',
    corRaca: 'Branca',
    escolaridade: 'Ensino Superior Completo',
    ocupacao: 'Enfermeira',
    responsavelFamilia: true,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    dataCadastro: '2024-05-20'
  },
  {
    id: 'p_lucas_oliveira',
    familiaId: 'f_oliveira',
    nome: 'Lucas Oliveira',
    cpf: '',
    dataNascimento: '2016-08-05',
    idade: 8,
    sexo: 'masculino',
    corRaca: 'Branca',
    escolaridade: 'Ensino Fundamental Incompleto',
    ocupacao: 'Estudante',
    responsavelFamilia: false,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: ['Asma']
    },
    dataCadastro: '2024-05-20'
  },
  {
    id: 'p_sebastiao_rocha',
    familiaId: 'f_rocha',
    nome: 'Sebastião Rocha',
    cpf: '654.987.321-00',
    dataNascimento: '1953-12-03',
    idade: 71,
    sexo: 'masculino',
    corRaca: 'Pardo',
    escolaridade: 'Ensino Fundamental Incompleto',
    ocupacao: 'Aposentado',
    responsavelFamilia: true,
    possuiDeficiencia: true,
    tipoDeficiencia: ['Deficiência Respiratória'],
    condicoesSaude: {
      hipertensao: true,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: ['DPOC', 'Oxigenoterapia domiciliar']
    },
    dataCadastro: '2024-04-15'
  },
  {
    id: 'p_joana_pereira',
    familiaId: 'f_pereira',
    nome: 'Joana Pereira',
    cpf: '147.258.369-00',
    dataNascimento: '1995-05-18',
    idade: 29,
    sexo: 'feminino',
    corRaca: 'Negra',
    escolaridade: 'Ensino Médio Completo',
    ocupacao: 'Vendedora',
    responsavelFamilia: true,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: ['Puérpera', 'Depressão pós-parto']
    },
    dataCadastro: '2024-11-01'
  }
];

export const mockVisitas: Visita[] = [
  {
    id: '1',
    tipo: 'familia',
    data: '2024-08-01',
    hora: '09:00',
    agenteSaude: 'ACS Maria Santos',
    local: {
      logradouro: 'Rua das Flores, 123',
      numero: '123',
      bairro: 'Centro'
    },
    objetivos: ['Acompanhamento de rotina', 'Verificação de hipertensão'],
    observacoes: 'Família bem. Sra. Maria apresentou pressão controlada. Orientado sobre medicação.',
    proximaVisita: '2024-09-01',
    status: 'realizada',
    familiaId: '1',
    domicilioId: '1'
  },
  {
    id: '2',
    tipo: 'cidadao',
    data: '2024-07-30',
    hora: '14:30',
    agenteSaude: 'ACS João Costa',
    local: {
      logradouro: 'Rua das Flores, 125',
      numero: '125',
      bairro: 'Centro'
    },
    objetivos: ['Acompanhamento diabetes', 'Orientação nutricional'],
    observacoes: 'Sr. João relatou seguir dieta. Glicemia em 120mg/dl. Orientado sobre exercícios.',
    proximaVisita: '2024-08-30',
    status: 'realizada',
    pessoaId: '5',
    familiaId: '2',
    domicilioId: '2'
  },
  {
    id: '3',
    tipo: 'imovel',
    data: '2024-08-05',
    hora: '08:00',
    agenteSaude: 'ACS Ana Silva',
    local: {
      logradouro: 'Avenida Brasil, 456',
      numero: '456',
      bairro: 'Vila Nova'
    },
    objetivos: ['Cadastro nova família', 'Inspeção sanitária'],
    observacoes: 'Imóvel em boas condições. Família recém mudou. Cadastro realizado.',
    status: 'agendada',
    domicilioId: '3'
  },
  {
    id: '4',
    tipo: 'cidadao',
    data: '2024-08-10',
    hora: '10:00',
    agenteSaude: 'ACS Maria Santos',
    local: {
      logradouro: 'Rua das Flores, 123',
      numero: '123',
      bairro: 'Centro'
    },
    objetivos: ['Acompanhamento de hipertensão', 'Verificação de medicação'],
    observacoes: 'Visita de acompanhamento para Sr. Carlos Silva Santos. Verificar adesão ao tratamento.',
    proximaVisita: '2024-09-10',
    status: 'agendada',
    pessoaId: '2', // Carlos Silva Santos (masculino)
    familiaId: '1',
    domicilioId: '1'
  }
];

export const mockRelatorios: RelatorioSintese = {
  periodo: 'Agosto/2024',
  totalFamiliasCadastradas: 173,
  totalPessoasCadastradas: 589,
  totalDomiciliosVisitados: 102,
  totalVisitasRealizadas: 267,
  coberturaPercentual: 91.2,
  metaAlcancada: true
};

// Dados para algoritmo de roteiro inteligente
export interface CondicaoSensivel {
  id: string;
  nome: string;
  nivelPrioridade: 'critica' | 'alta' | 'media' | 'baixa';
  pontuacao: number;
  descricao: string;
}

export interface Microarea {
  id: string;
  codigo: string;
  nome: string;
  acsResponsavel: string;
  cpfAcs?: string;
  descricao: string;
  logradouros: string[];
  familiasCadastradas: number;
  populacaoEstimada: number;
  area: {
    coordenadas: { lat: number; lng: number }[];
    perimetro: number; // em metros
  };
  metas: {
    visitasMensais: number;
    coberturaFamilias: number; // percentual
    acompanhamentoCronicos: number;
  };
  status: 'ativa' | 'inativa' | 'reorganizacao';
  dataCriacao: string;
  observacoes?: string;
}

export interface ConfiguracaoTerritorio {
  unidadeSaude: string;
  municipio: string;
  microareas: Microarea[];
  totalAcs: number;
  metaCobertura: number;
  ultimaAtualizacao: string;
}

export interface PacientePrioritario {
  id: string;
  nome: string;
  endereco: string;
  microareaId: string; // Adicionar referência à microárea
  coordenadas: { lat: number; lng: number };
  condicoesSaude: string[];
  prioridadeClinica: 'critica' | 'alta' | 'media' | 'baixa';
  diasSemUltimaVisita: number;
  dataUltimoDiagnostico?: string;
  observacoes?: string;
  tempoEstimadoVisita: number;
  familiaId?: string;
}

export const condicoesSensiveis: CondicaoSensivel[] = [
  {
    id: '1',
    nome: 'Diabetes Mellitus recém-diagnosticada',
    nivelPrioridade: 'critica',
    pontuacao: 95,
    descricao: 'Pacientes com diagnóstico de diabetes nos últimos 30 dias necessitam acompanhamento intensivo'
  },
  {
    id: '2',
    nome: 'Hipertensão Arterial descontrolada',
    nivelPrioridade: 'critica',
    pontuacao: 90,
    descricao: 'Pressão arterial acima de 180/110 mmHg requer intervenção urgente'
  },
  {
    id: '3',
    nome: 'Tuberculose em tratamento',
    nivelPrioridade: 'alta',
    pontuacao: 85,
    descricao: 'Acompanhamento para garantir adesão ao tratamento e controle de contatos'
  },
  {
    id: '4',
    nome: 'Gestação de alto risco',
    nivelPrioridade: 'critica',
    pontuacao: 100,
    descricao: 'Gestantes com complicações necessitam monitoramento frequente'
  },
  {
    id: '5',
    nome: 'Depressão severa com ideação suicida',
    nivelPrioridade: 'critica',
    pontuacao: 98,
    descricao: 'Risco de autolesão requer acompanhamento psicossocial imediato'
  },
  {
    id: '6',
    nome: 'Desnutrição infantil',
    nivelPrioridade: 'alta',
    pontuacao: 80,
    descricao: 'Crianças com déficit nutricional precisam acompanhamento regular'
  },
  {
    id: '7',
    nome: 'Idoso com demência',
    nivelPrioridade: 'media',
    pontuacao: 70,
    descricao: 'Acompanhamento do cuidador e orientações familiares'
  },
  {
    id: '8',
    nome: 'Controle de focos de Aedes aegypti',
    nivelPrioridade: 'media',
    pontuacao: 60,
    descricao: 'Prevenção de arboviroses através do controle vetorial'
  }
];

export const pacientesPrioritarios: PacientePrioritario[] = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    endereco: 'Rua das Flores, 123',
    microareaId: 'micro-01',
    coordenadas: { lat: -23.5505, lng: -46.6333 },
    condicoesSaude: ['Diabetes Mellitus recém-diagnosticada', 'Hipertensão Arterial'],
    prioridadeClinica: 'critica',
    diasSemUltimaVisita: 45,
    dataUltimoDiagnostico: '2024-07-20',
    observacoes: 'Diagnóstico de diabetes há 15 dias. Glicemia em jejum 280mg/dl. Paciente relata não estar seguindo dieta. Necessita orientação nutricional urgente e acompanhamento da medicação.',
    tempoEstimadoVisita: 40,
    familiaId: '1'
  },
  {
    id: '2',
    nome: 'José Carlos Oliveira',
    endereco: 'Rua das Flores, 145',
    microareaId: 'micro-01',
    coordenadas: { lat: -23.5506, lng: -46.6334 },
    condicoesSaude: ['Hipertensão Arterial descontrolada'],
    prioridadeClinica: 'critica',
    diasSemUltimaVisita: 32,
    dataUltimoDiagnostico: '2024-07-10',
    observacoes: 'PA: 190/120 mmHg na última consulta. Paciente abandonou medicação por efeitos colaterais. Necessita reavaliação médica urgente.',
    tempoEstimadoVisita: 30
  },
  {
    id: '3',
    nome: 'Ana Paula Rodrigues',
    endereco: 'Avenida Brasil, 456',
    microareaId: 'micro-02',
    coordenadas: { lat: -23.5510, lng: -46.6340 },
    condicoesSaude: ['Depressão severa com ideação suicida'],
    prioridadeClinica: 'critica',
    diasSemUltimaVisita: 21,
    dataUltimoDiagnostico: '2024-07-30',
    observacoes: 'Episódio de tentativa de autolesão há 1 semana. Em acompanhamento psiquiátrico. Família necessita orientação sobre sinais de alerta.',
    tempoEstimadoVisita: 45
  },
  {
    id: '4',
    nome: 'Carla Fernanda Lima (Gestante)',
    endereco: 'Rua da Esperança, 789',
    microareaId: 'micro-03',
    coordenadas: { lat: -23.5515, lng: -46.6350 },
    condicoesSaude: ['Gestação de alto risco', 'Pré-eclâmpsia'],
    prioridadeClinica: 'critica',
    diasSemUltimaVisita: 12,
    dataUltimoDiagnostico: '2024-08-01',
    observacoes: '28 semanas de gestação. Desenvolve pré-eclâmpsia. PA: 160/100. Proteína na urina. Necessita monitoramento semanal.',
    tempoEstimadoVisita: 35,
    familiaId: '8'
  },
  {
    id: '5',
    nome: 'Pedro Henrique Silva',
    endereco: 'Avenida Brasil, 478',
    microareaId: 'micro-02',
    coordenadas: { lat: -23.5511, lng: -46.6341 },
    condicoesSaude: ['Tuberculose pulmonar em tratamento'],
    prioridadeClinica: 'alta',
    diasSemUltimaVisita: 25,
    dataUltimoDiagnostico: '2024-07-15',
    observacoes: 'Diagnóstico confirmado por BK+. Iniciou esquema básico há 20 dias. Necessita verificar adesão medicamentosa e investigar contatos.',
    tempoEstimadoVisita: 30
  },
  {
    id: '6',
    nome: 'Família Santos - Criança João (3 anos)',
    endereco: 'Rua das Flores, 167',
    microareaId: 'micro-01',
    coordenadas: { lat: -23.5507, lng: -46.6335 },
    condicoesSaude: ['Desnutrição infantil moderada'],
    prioridadeClinica: 'alta',
    diasSemUltimaVisita: 28,
    dataUltimoDiagnostico: '2024-07-25',
    observacoes: 'Criança com peso/idade abaixo do percentil 3. Família em situação de vulnerabilidade social. Inserida no programa Bolsa Família.',
    tempoEstimadoVisita: 40,
    familiaId: '5'
  },
  {
    id: '7',
    nome: 'Sebastião Antônio (83 anos)',
    endereco: 'Travessa São João, 234',
    microareaId: 'micro-03',
    coordenadas: { lat: -23.5520, lng: -46.6355 },
    condicoesSaude: ['Demência moderada', 'Hipertensão controlada'],
    prioridadeClinica: 'media',
    diasSemUltimaVisita: 18,
    observacoes: 'Mora com filha cuidadora. Apresenta episódios de confusão mental. Necessita orientação sobre cuidados e suporte familiar.',
    tempoEstimadoVisita: 35
  },
  {
    id: '8',
    nome: 'Controle Vetorial - Quadra 15',
    endereco: 'Rua da Esperança, 801-850',
    microareaId: 'micro-03',
    coordenadas: { lat: -23.5516, lng: -46.6351 },
    condicoesSaude: ['Controle de focos Aedes aegypti'],
    prioridadeClinica: 'media',
    diasSemUltimaVisita: 14,
    observacoes: 'Quadra com histórico de casos de dengue. Necessária inspeção de imóveis para eliminação de criadouros.',
    tempoEstimadoVisita: 25
  },
  {
    id: '9',
    nome: 'Roberto Machado',
    endereco: 'Avenida Brasil, 523',
    microareaId: 'micro-02',
    coordenadas: { lat: -23.5512, lng: -46.6342 },
    condicoesSaude: ['Diabetes Mellitus tipo 2', 'Retinopatia diabética'],
    prioridadeClinica: 'alta',
    diasSemUltimaVisita: 35,
    dataUltimoDiagnostico: '2024-06-15',
    observacoes: 'Diabético há 8 anos com complicações. HbA1c: 11%. Desenvolveu retinopatia. Necessita referenciamento oftalmológico urgente.',
    tempoEstimadoVisita: 30
  },
  {
    id: '10',
    nome: 'Luciana Costa (Puérpera)',
    endereco: 'Rua das Flores, 201',
    microareaId: 'micro-01',
    coordenadas: { lat: -23.5508, lng: -46.6336 },
    condicoesSaude: ['Puerpério de risco', 'Depressão pós-parto'],
    prioridadeClinica: 'alta',
    diasSemUltimaVisita: 8,
    dataUltimoDiagnostico: '2024-07-28',
    observacoes: 'Parto há 1 semana. Apresenta sinais de depressão pós-parto. Dificuldades na amamentação. Necessita suporte emocional.',
    tempoEstimadoVisita: 40
  }
];

// Dados mock das microáreas
export const microareas: Microarea[] = [
  {
    id: 'micro-01',
    codigo: 'MA-001',
    nome: 'Microárea Centro - Rua das Flores',
    acsResponsavel: 'Maria Santos Silva',
    cpfAcs: '123.456.789-00',
    descricao: 'Microárea que abrange o centro histórico, com foco na Rua das Flores e adjacências.',
    logradouros: [
      'Rua das Flores (números 1-200)',
      'Travessa Central (completa)',
      'Rua da Paz (números pares)'
    ],
    familiasCadastradas: 87,
    populacaoEstimada: 312,
    area: {
      coordenadas: [
        { lat: -23.5500, lng: -46.6330 },
        { lat: -23.5510, lng: -46.6330 },
        { lat: -23.5510, lng: -46.6340 },
        { lat: -23.5500, lng: -46.6340 }
      ],
      perimetro: 1200
    },
    metas: {
      visitasMensais: 150,
      coberturaFamilias: 95,
      acompanhamentoCronicos: 85
    },
    status: 'ativa',
    dataCriacao: '2024-01-15',
    observacoes: 'Área com alta concentração de idosos e pacientes crônicos. Priorizar visitas a diabéticos e hipertensos.'
  },
  {
    id: 'micro-02',
    codigo: 'MA-002',
    nome: 'Microárea Brasil - Avenida Principal',
    acsResponsavel: 'João Costa Oliveira',
    cpfAcs: '234.567.890-11',
    descricao: 'Microárea urbanizada da Avenida Brasil, com comércios e residências mistas.',
    logradouros: [
      'Avenida Brasil (números 400-600)',
      'Rua dos Comerciantes (completa)',
      'Vila Nova (quadras A, B, C)'
    ],
    familiasCadastradas: 102,
    populacaoEstimada: 385,
    area: {
      coordenadas: [
        { lat: -23.5505, lng: -46.6335 },
        { lat: -23.5515, lng: -46.6335 },
        { lat: -23.5515, lng: -46.6345 },
        { lat: -23.5505, lng: -46.6345 }
      ],
      perimetro: 1400
    },
    metas: {
      visitasMensais: 180,
      coberturaFamilias: 92,
      acompanhamentoCronicos: 88
    },
    status: 'ativa',
    dataCriacao: '2024-01-20',
    observacoes: 'Área com casos de tuberculose em acompanhamento. Atenção especial para controle de contatos e adesão ao tratamento.'
  },
  {
    id: 'micro-03',
    codigo: 'MA-003',
    nome: 'Microárea Esperança - Periferia',
    acsResponsavel: 'Ana Paula Rodrigues',
    cpfAcs: '345.678.901-22',
    descricao: 'Microárea periférica com alta vulnerabilidade social, incluindo a Rua da Esperança.',
    logradouros: [
      'Rua da Esperança (completa)',
      'Travessa São João (completa)',
      'Conjunto Habitacional Vila União'
    ],
    familiasCadastradas: 124,
    populacaoEstimada: 456,
    area: {
      coordenadas: [
        { lat: -23.5510, lng: -46.6345 },
        { lat: -23.5525, lng: -46.6345 },
        { lat: -23.5525, lng: -46.6360 },
        { lat: -23.5510, lng: -46.6360 }
      ],
      perimetro: 1800
    },
    metas: {
      visitasMensais: 220,
      coberturaFamilias: 90,
      acompanhamentoCronicos: 80
    },
    status: 'ativa',
    dataCriacao: '2024-02-10',
    observacoes: 'Área com alta incidência de gestantes de risco e desnutrição infantil. Necessário acompanhamento intensivo de programas sociais.'
  },
  {
    id: 'micro-04',
    codigo: 'MA-004',
    nome: 'Microárea Rural - Sítios e Chácaras',
    acsResponsavel: 'Carlos Alberto Santos',
    cpfAcs: '456.789.012-33',
    descricao: 'Microárea rural com propriedades dispersas, sítios e chácaras.',
    logradouros: [
      'Estrada Municipal (Km 5-8)',
      'Sítio das Palmeiras',
      'Chácara Boa Vista',
      'Vila Rural Santa Rita'
    ],
    familiasCadastradas: 45,
    populacaoEstimada: 167,
    area: {
      coordenadas: [
        { lat: -23.5480, lng: -46.6300 },
        { lat: -23.5520, lng: -46.6300 },
        { lat: -23.5520, lng: -46.6380 },
        { lat: -23.5480, lng: -46.6380 }
      ],
      perimetro: 3200
    },
    metas: {
      visitasMensais: 90,
      coberturaFamilias: 98,
      acompanhamentoCronicos: 95
    },
    status: 'ativa',
    dataCriacao: '2024-02-15',
    observacoes: 'Área rural com desafios de acesso. Programar visitas considerando distâncias e meio de transporte.'
  },
  {
    id: 'micro-05',
    codigo: 'MA-005',
    nome: 'Microárea Industrial - Distrito Fabril',
    acsResponsavel: 'Fernanda Lima Costa',
    cpfAcs: '567.890.123-44',
    descricao: 'Microárea próxima ao distrito industrial, com residências de trabalhadores.',
    logradouros: [
      'Rua dos Metalúrgicos (completa)',
      'Vila Operária (todas as quadras)',
      'Conjunto Residencial Industrial'
    ],
    familiasCadastradas: 89,
    populacaoEstimada: 298,
    area: {
      coordenadas: [
        { lat: -23.5525, lng: -46.6300 },
        { lat: -23.5540, lng: -46.6300 },
        { lat: -23.5540, lng: -46.6320 },
        { lat: -23.5525, lng: -46.6320 }
      ],
      perimetro: 1600
    },
    metas: {
      visitasMensais: 140,
      coberturaFamilias: 93,
      acompanhamentoCronicos: 87
    },
    status: 'reorganizacao',
    dataCriacao: '2024-03-01',
    observacoes: 'Microárea em processo de reorganização devido ao crescimento populacional. Necessário reavaliação dos limites territoriais.'
  }
];

export const configuracaoTerritorio: ConfiguracaoTerritorio = {
  unidadeSaude: 'UBS Mirante da Mata',
  municipio: 'Cotia/SP',
  microareas: microareas,
  totalAcs: 5,
  metaCobertura: 95,
  ultimaAtualizacao: '2024-08-05'
};

// Funções auxiliares para simular API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Logradouros
  getLogradouros: async (): Promise<Logradouro[]> => {
    await delay(500);
    return mockLogradouros;
  },
  
  getLogradouro: async (id: string): Promise<Logradouro | null> => {
    await delay(300);
    return mockLogradouros.find(l => l.id === id) || null;
  },

  // Domicílios
  getDomicilios: async (logradouroId?: string): Promise<Domicilio[]> => {
    await delay(500);
    return logradouroId 
      ? mockDomicilios.filter(d => d.logradouroId === logradouroId)
      : mockDomicilios;
  },

  getDomicilio: async (id: string): Promise<Domicilio | null> => {
    await delay(300);
    return mockDomicilios.find(d => d.id === id) || null;
  },

  // Famílias
  getFamilias: async (domicilioId?: string): Promise<Familia[]> => {
    await delay(500);
    return domicilioId 
      ? mockFamilias.filter(f => f.domicilioId === domicilioId)
      : mockFamilias;
  },

  getFamilia: async (id: string): Promise<Familia | null> => {
    await delay(300);
    return mockFamilias.find(f => f.id === id) || null;
  },

  // Pessoas
  getPessoas: async (familiaId?: string): Promise<Pessoa[]> => {
    await delay(500);
    return familiaId 
      ? mockPessoas.filter(p => p.familiaId === familiaId)
      : mockPessoas;
  },

  getPessoa: async (id: string): Promise<Pessoa | null> => {
    await delay(300);
    return mockPessoas.find(p => p.id === id) || null;
  },

  // Visitas
  getVisitas: async (): Promise<Visita[]> => {
    await delay(500);
    return mockVisitas;
  },

  getVisita: async (id: string): Promise<Visita | null> => {
    await delay(300);
    return mockVisitas.find(v => v.id === id) || null;
  },

  // Relatórios
  getRelatorioSintese: async (): Promise<RelatorioSintese> => {
    await delay(800);
    return mockRelatorios;
  },

  // Roteiro Inteligente
  getPacientesPrioritarios: async (): Promise<PacientePrioritario[]> => {
    await delay(600);
    return pacientesPrioritarios;
  },

  getCondicoesSensiveis: async (): Promise<CondicaoSensivel[]> => {
    await delay(400);
    return condicoesSensiveis;
  },

  // Microáreas e Território
  getMicroareas: async (): Promise<Microarea[]> => {
    await delay(500);
    return microareas;
  },

  getMicroarea: async (id: string): Promise<Microarea | null> => {
    await delay(300);
    return microareas.find(m => m.id === id) || null;
  },

  getConfiguracaoTerritorio: async (): Promise<ConfiguracaoTerritorio> => {
    await delay(600);
    return configuracaoTerritorio;
  },

  getPacientesPorMicroarea: async (microareaId: string): Promise<PacientePrioritario[]> => {
    await delay(400);
    return pacientesPrioritarios.filter(p => p.microareaId === microareaId);
  },

  // Simulação de operações de criação/edição
  createItem: async <T>(item: T): Promise<T> => {
    await delay(1000);
    return { ...item, id: Math.random().toString(36).substr(2, 9) };
  },

  updateItem: async <T>(id: string, item: Partial<T>): Promise<T> => {
    await delay(800);
    return item as T;
  },

  deleteItem: async (id: string): Promise<boolean> => {
    await delay(600);
    return true;
  }
};

// ===============================
// SISTEMA DE VALIDAÇÃO INTELIGENTE
// ===============================

export interface AlertaValidacao {
  tipo: 'ERRO' | 'ATENCAO' | 'INFO';
  campo: string;
  mensagem: string;
  codigo?: string;
}

export interface SugestaoPreenchimento {
  campo: string;
  valor: any;
  justificativa: string;
  confianca: number; // 0-100
}

export interface AlertaClinico {
  tipo: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAIXO';
  titulo: string;
  mensagem: string;
  acao: string;
  urgencia: boolean;
}

// Validador Inteligente
export const validadorInteligente = {
  // Valida dados de pessoa
  validarPessoa: (pessoa: Partial<Pessoa>): AlertaValidacao[] => {
    const alertas: AlertaValidacao[] = [];

    // Validação básica de consistência
    if (pessoa.sexo === 'masculino' && pessoa.gestante?.eh) {
      alertas.push({
        tipo: 'ERRO',
        campo: 'gestante',
        mensagem: 'Inconsistência: Pessoa do sexo masculino não pode estar gestante.',
        codigo: 'SEXO_GESTANTE_INCOMPATIVEL'
      });
    }

    // Validação de idade vs condições
    if (pessoa.idade && pessoa.idade < 18) {
      if (pessoa.condicoesSaudeDetalhadas?.hipertensao?.possui) {
        alertas.push({
          tipo: 'ATENCAO',
          campo: 'hipertensao',
          mensagem: 'Hipertensão em menor de 18 anos é rara. Verifique os dados.',
          codigo: 'HIPERTENSAO_CRIANCA'
        });
      }
      
      if (pessoa.condicoesSaudeDetalhadas?.diabetes?.possui) {
        alertas.push({
          tipo: 'ATENCAO',
          campo: 'diabetes',
          mensagem: 'Diabetes em criança/adolescente. Confirmar tipo (geralmente Tipo 1).',
          codigo: 'DIABETES_CRIANCA'
        });
      }
    }

    // Validação de gestação
    if (pessoa.gestante?.eh && pessoa.gestante.semanas && pessoa.gestante.semanas > 42) {
      alertas.push({
        tipo: 'ATENCAO',
        campo: 'semanas_gestacao',
        mensagem: 'Gestação acima de 42 semanas. Verificar se dados estão corretos.',
        codigo: 'GESTACAO_PROLONGADA'
      });
    }

    return alertas;
  },

  // Sugere preenchimento automático baseado em contexto
  sugerirDados: (contexto: any): SugestaoPreenchimento[] => {
    const sugestoes: SugestaoPreenchimento[] = [];

    // Sugestões baseadas em localização
    if (contexto.endereco?.includes('Rural') || contexto.bairro?.includes('Rural')) {
      sugestoes.push({
        campo: 'abastecimentoAgua',
        valor: 'poco_artesiano',
        justificativa: 'Área rural tipicamente usa poço artesiano',
        confianca: 75
      });

      sugestoes.push({
        campo: 'destinacaoLixo',
        valor: 'queimado',
        justificativa: 'Comum em áreas rurais queimar o lixo',
        confianca: 60
      });
    }

    // Sugestões baseadas em idade
    if (contexto.idade >= 60) {
      sugestoes.push({
        campo: 'examePreventivoEmDia',
        valor: false,
        justificativa: 'Idosos frequentemente atrasam exames preventivos',
        confianca: 50
      });
    }

    return sugestoes;
  },

  // Valida formulário de visita
  validarVisita: (visita: Partial<VisitaDetalhada>): AlertaValidacao[] => {
    const alertas: AlertaValidacao[] = [];

    // Validação de antropometria
    if (visita.antropometria) {
      const peso = parseFloat(visita.antropometria.peso);
      const altura = parseFloat(visita.antropometria.altura);

      if (peso < 0.5 || peso > 300) {
        alertas.push({
          tipo: 'ERRO',
          campo: 'peso',
          mensagem: 'Peso deve estar entre 0.5kg e 300kg',
          codigo: 'PESO_INVALIDO'
        });
      }

      if (altura < 30 || altura > 250) {
        alertas.push({
          tipo: 'ERRO',
          campo: 'altura',
          mensagem: 'Altura deve estar entre 30cm e 250cm',
          codigo: 'ALTURA_INVALIDA'
        });
      }

      // Calcular e validar IMC se peso e altura válidos
      if (peso >= 0.5 && peso <= 300 && altura >= 30 && altura <= 250) {
        const alturaM = altura / 100;
        const imc = peso / (alturaM * alturaM);
        
        if (imc < 12 || imc > 60) {
          alertas.push({
            tipo: 'ATENCAO',
            campo: 'imc',
            mensagem: `IMC calculado: ${imc.toFixed(1)} está fora do range normal. Verifique peso e altura.`,
            codigo: 'IMC_ANORMAL'
          });
        }
      }
    }

    return alertas;
  }
};

// Detector de Alertas Clínicos
export const detectorAlertas = {
  analisarVisita: (visita: VisitaDetalhada, pessoa?: Pessoa): AlertaClinico[] => {
    const alertas: AlertaClinico[] = [];

    // Alertas de sinais vitais críticos
    if (visita.sinaisVitais?.pressaoArterial) {
      const [sistolica, diastolica] = visita.sinaisVitais.pressaoArterial
        .split('/')
        .map(v => parseInt(v.trim()));

      if (sistolica >= 180 || diastolica >= 110) {
        alertas.push({
          tipo: 'CRITICO',
          titulo: 'Pressão Arterial Crítica',
          mensagem: `PA ${visita.sinaisVitais.pressaoArterial} - Risco de emergência hipertensiva`,
          acao: 'Encaminhar para UBS/Pronto Socorro IMEDIATAMENTE',
          urgencia: true
        });
      } else if (sistolica >= 160 || diastolica >= 100) {
        alertas.push({
          tipo: 'ALTO',
          titulo: 'Pressão Arterial Elevada',
          mensagem: `PA ${visita.sinaisVitais.pressaoArterial} - Hipertensão estágio 2`,
          acao: 'Agendar consulta médica em até 7 dias',
          urgencia: false
        });
      }
    }

    // Alertas de glicemia crítica
    if (visita.sinaisVitais && 'glicemia' in visita.sinaisVitais) {
      const glicemia = (visita.sinaisVitais as any).glicemia;
      if (glicemia >= 400) {
        alertas.push({
          tipo: 'CRITICO',
          titulo: 'Glicemia Crítica',
          mensagem: `Glicemia ${glicemia} mg/dL - Risco de cetoacidose`,
          acao: 'Encaminhar para emergência IMEDIATAMENTE',
          urgencia: true
        });
      }
    }

    // Alertas antropométricos em crianças
    if (pessoa && pessoa.idade < 5 && visita.antropometria) {
      const peso = parseFloat(visita.antropometria.peso);
      const altura = parseFloat(visita.antropometria.altura);
      
      if (peso && altura) {
        const alturaM = altura / 100;
        const imc = peso / (alturaM * alturaM);
        
        // Verifica desnutrição (valores aproximados)
        if (imc < 14) {
          alertas.push({
            tipo: 'ALTO',
            titulo: 'Possível Desnutrição Infantil',
            mensagem: `IMC ${imc.toFixed(1)} muito baixo para criança de ${pessoa.idade} anos`,
            acao: 'Encaminhar para avaliação nutricional urgente',
            urgencia: true
          });
        }
      }
    }

    // Alertas de saúde mental
    if (visita.acompanhamento.saudeMental && pessoa) {
      if (pessoa.condicoesSaudeDetalhadas?.depressao?.possui && 
          !pessoa.condicoesSaudeDetalhadas?.depressao?.tratamento) {
        alertas.push({
          tipo: 'MEDIO',
          titulo: 'Depressão sem Tratamento',
          mensagem: 'Pessoa com diagnóstico de depressão não está em tratamento',
          acao: 'Orientar sobre importância do tratamento e oferecer apoio',
          urgencia: false
        });
      }
    }

    return alertas;
  },

  // Identifica candidatos para busca ativa
  identificarBuscaAtiva: (populacao: Pessoa[]): Array<{
    pessoa: Pessoa;
    motivo: string;
    urgencia: 'ALTA' | 'MEDIA' | 'BAIXA';
    acao: string;
  }> => {
    const candidatos = [];

    for (const pessoa of populacao) {
      // Gestantes faltosas
      if (pessoa.gestante?.eh && pessoa.gestante.ultimaConsulta) {
        const diasSemConsulta = Math.floor(
          (new Date().getTime() - new Date(pessoa.gestante.ultimaConsulta).getTime()) 
          / (1000 * 60 * 60 * 24)
        );
        
        if (diasSemConsulta > 30) {
          candidatos.push({
            pessoa,
            motivo: 'GESTANTE_FALTOSA_PRE_NATAL',
            urgencia: 'ALTA' as const,
            acao: 'Agendar consulta pré-natal urgente'
          });
        }
      }

      // Diabéticos sem controle
      if (pessoa.condicoesSaudeDetalhadas?.diabetes?.possui && 
          !pessoa.condicoesSaudeDetalhadas?.diabetes?.controlada) {
        candidatos.push({
          pessoa,
          motivo: 'DIABETES_DESCONTROLADO',
          urgencia: 'MEDIA' as const,
          acao: 'Verificar adesão ao tratamento e orientar'
        });
      }

      // Hipertensos sem acompanhamento
      if (pessoa.condicoesSaudeDetalhadas?.hipertensao?.possui && 
          pessoa.condicoesSaudeDetalhadas?.hipertensao?.ultimaAferidao &&
          new Date(pessoa.condicoesSaudeDetalhadas.hipertensao.ultimaAferidao) < 
          new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)) { // 60 dias
        candidatos.push({
          pessoa,
          motivo: 'HIPERTENSAO_SEM_ACOMPANHAMENTO',
          urgencia: 'MEDIA' as const,
          acao: 'Aferir PA e verificar medicação'
        });
      }
    }

    return candidatos;
  }
};
