
export interface CidadaoData {
  // Etapa 1 - Identificação Parte 1
  cpf: string;
  cns: string;
  nomeCompleto: string;
  nomeSocial: string;
  dataNascimento: string;
  sexo: string;
  responsavelFamiliar: boolean;
  
  // Etapa 2 - Identificação Parte 2
  nomeMae: string;
  nomePai: string;
  nacionalidade: string;
  municipioNascimento: string;
  telefoneCelular: string;
  email: string;
  
  // Etapa 3 - Sociodemográficas Parte 1
  racaCor: string;
  etniaIndigena: string;
  relacaoParentesco: string;
  ocupacao: string;
  situacaoMercado: string;
  
  // Etapa 4 - Sociodemográficas Parte 2
  frequentaEscola: string;
  escolaridade: string;
  situacaoConjugal: string;
  orientacaoSexual: string;
  identidadeGenero: string;
  
  // Etapa 5 - Condições de Saúde
  gestante: boolean;
  puerpera: boolean;
  amamentando: boolean;
  planejamentoFamiliar: boolean;
  hipertensao: boolean;
  diabetes: boolean;
  avcDerrame: boolean;
  infarto: boolean;
  
  // Etapa 6 - Condições Gerais
  problemaRenalCronico: boolean;
  problemaMental: boolean;
  alcoolismo: boolean;
  outrasDrogas: boolean;
  tabagismo: boolean;
  acamado: boolean;
  domiciliado: boolean;
  problemaMobilidade: boolean;
  
  // Etapa 7 - Situação de Rua
  situacaoRua: boolean;
  tempoSituacaoRua: string;
  recebeBeneficio: boolean;
  referenciaFamiliar: boolean;
  acompanhamentoCras: boolean;
  visitaParentes: string;
  
  // Controle
  recusaCadastro: boolean;
}

export interface StepProps {
  formData: CidadaoData;
  updateFormData: (field: keyof CidadaoData, value: string | boolean) => void;
  onRecusaCadastro?: () => void;
}
