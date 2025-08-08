import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
import { Switch } from './switch';
import { Label } from './label';
import { Textarea } from './textarea';
import { Input } from './input';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Stethoscope, 
  User, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Heart, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lightbulb,
  Target,
  Send,
  Maximize2,
  Minimize2,
  X,
  BookOpen,
  Activity,
  Home,
  FileText,
  Users,
  Plus,
  Save,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Weight,
  Thermometer,
  Baby,
  Shield,
  Package,
  Search,
  UserCheck,
  Play,
  ClipboardList
} from 'lucide-react';
import { mockPessoas } from '@/data/mockData';

type AssistenteAvancadoProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

interface MensagemIA {
  id: string;
  tipo: 'user' | 'assistant';
  conteudo: string;
  timestamp: Date;
  categoria?: 'conversa' | 'visita' | 'formulario' | 'relatorio' | 'protocolo';
  dados?: any;
  botoes?: BotaoRapido[];
  opcoes?: OpcaoNumerada[];
}

interface BotaoRapido {
  label: string;
  valor: string;
  acao?: () => void;
}

interface OpcaoNumerada {
  numero: number;
  texto: string;
  valor: string;
}

interface DadosVisita {
  // Dados básicos da visita
  visitaFoiRealizada: boolean;
  motivosVisita: string[];
  
  // Busca Ativa (expandível)
  buscaAtivaExpandida: boolean;
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
  
  // Acompanhamento (expandível)  
  acompanhamentoExpandido: boolean;
  acompanhamento: {
    gestante: boolean;
    puerpera: boolean;
    recemNascido: boolean;
    crianca: boolean;
    pessoaComDeficiencia: boolean;
    hipertensao: boolean;
    diabetes: boolean;
    asma: boolean;
    dpoc: boolean;
    cancer: boolean;
    outrasCondicoes: boolean;
    problemaMental: boolean;
    dependenciaQuimica: boolean;
    reabilitacao: boolean;
    tuberculose: boolean;
    hanseniase: boolean;
  };
  
  // Antropometria (expandível)
  antropometriaExpandida: boolean;
  antropometria: {
    peso: string;
    altura: string;
  };
  
  // Sinais Vitais
  sinaisVitais: {
    pressaoArterial: string;
    frequenciaCardiaca: string;
    temperatura: string;
    saturacaoOxigenio: string;
  };
  
  // Profissional e observações
  visitaAcompanhada: boolean;
  profissionalAcompanhante: string;
  observacoes: string;
  
  // Controle de workflow
  pacienteSelecionado?: any;
  visitaSelecionada?: any;
  etapaAtual: 'selecao' | 'roteiro' | 'atendimento' | 'finalizacao';
}

interface FormularioVisita {
  paciente: string;
  endereco: string;
  tipoVisita: 'domiciliar' | 'pre-natal' | 'puericultura' | 'seguimento';
  data: string;
  hora: string;
  observacoes: string;
  condicoes: {
    diabetes: boolean;
    hipertensao: boolean;
    gestacao: boolean;
    idoso: boolean;
    crianca: boolean;
    deficiencia: boolean;
  };
  procedimentos: {
    aferirPA: boolean;
    verificarGlicemia: boolean;
    pesoAltura: boolean;
    vacinacao: boolean;
    orientacaoNutricional: boolean;
    avaliacaoFeridas: boolean;
  };
  medicamentos: {
    verificarAdesao: boolean;
    orientarHorarios: boolean;
    verificarEstoque: boolean;
    relatarEfeitosAdversos: boolean;
  };
}

// Base de conhecimento expandida para IA conversacional
const baseConhecimentoExpandida = {
  saudacoes: [
    "Olá! Como posso ajudar você hoje?",
    "Oi! Estou aqui para auxiliar no seu trabalho como ACS.",
    "Bem-vindo(a)! O que precisa saber ou fazer hoje?"
  ],
  
  respostasContext: {
    clima: "Como ACS, é importante considerar o clima para as visitas. Em dias de chuva, priorize visitas internas e leve materiais protegidos.",
    
    transporte: "Para otimizar o deslocamento, sugiro agrupar visitas por proximidade geográfica e considerar os horários de maior disponibilidade dos pacientes.",
    
    documentacao: "Sempre mantenha os registros atualizados. Isso ajuda no acompanhamento longitudinal e na continuidade do cuidado.",
    
    emergencias: "Em situações de emergência, priorize a segurança do paciente, acione o SAMU (192) se necessário e mantenha a calma.",
    
    familias: "O trabalho com famílias requer escuta ativa, respeito às diversidades culturais e abordagem integral da saúde."
  },

  protocolosCompletos: {
    iniciarVisita: `
PROTOCOLO PARA INICIAR VISITA DOMICILIAR

1. PREPARAÇÃO:
• Revisar prontuário do paciente/família
• Verificar materiais necessários
• Confirmar endereço e melhor horário
• Planejar rota otimizada

2. CHEGADA:
• Apresentar-se e identificar-se
• Explicar objetivo da visita
• Solicitar permissão para entrar
• Observar ambiente domiciliar

3. AVALIAÇÃO:
• Verificar estado geral do paciente
• Aferir sinais vitais se necessário
• Revisar medicamentos em uso
• Identificar riscos ambientais

4. ORIENTAÇÕES:
• Fornecer educação em saúde
• Esclarecer dúvidas
• Agendar próximas ações
• Deixar material educativo

5. REGISTRO:
• Documentar achados importantes
• Atualizar cadastro se necessário
• Registrar orientações fornecidas
• Planejar seguimento
    `
  }
};

export default function AssistenteAvancado(props: AssistenteAvancadoProps = {}) {
  const navigate = useNavigate();
  const isControlled = typeof props.open === 'boolean' && typeof props.onOpenChange === 'function';
  const [open, setOpen] = useState(isControlled ? !!props.open : false);
  const [fullScreen, setFullScreen] = useState(false);
  const [mensagens, setMensagens] = useState<MensagemIA[]>([]);
  const [inputMensagem, setInputMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modoFormulario, setModoFormulario] = useState(false);
  const [formMode, setFormMode] = useState<'chat' | 'atendimento'>('chat');
  
  // Novos estados para controlar o fluxo completo
  const [etapaAtual, setEtapaAtual] = useState<'inicial' | 'roteiro' | 'dados-atendimento' | 'decisao-atendimento' | 'preparacao-inteligente' | 'checklist-pre' | 'formulario-atendimento'>('inicial');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [checklistPre, setChecklistPre] = useState({
    materiais: false,
    protocolos: false,
    medicamentos: false,
    alertas: false,
    ambiente: false
  });
  const [buscaAtivaExpandida, setBuscaAtivaExpandida] = useState(false);
  const [acompanhamentoExpandido, setAcompanhamentoExpandido] = useState(false);
  const [formularioVisita, setFormularioVisita] = useState<FormularioVisita>({
    paciente: '',
    endereco: '',
    tipoVisita: 'domiciliar',
    data: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    observacoes: '',
    condicoes: {
      diabetes: false,
      hipertensao: false,
      gestacao: false,
      idoso: false,
      crianca: false,
      deficiencia: false,
    },
    procedimentos: {
      aferirPA: false,
      verificarGlicemia: false,
      pesoAltura: false,
      vacinacao: false,
      orientacaoNutricional: false,
      avaliacaoFeridas: false,
    },
    medicamentos: {
      verificarAdesao: false,
      orientarHorarios: false,
      verificarEstoque: false,
      relatarEfeitosAdversos: false,
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isControlled) setOpen(!!props.open);
  }, [props.open, isControlled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Inicialização do assistente avançado
  useEffect(() => {
    if (open && mensagens.length === 0) {
      const mensagemInicial: MensagemIA = {
        id: 'inicial',
        tipo: 'assistant',
        conteudo: `I.A30 - WORKFLOW COMPLETO DE VISITAS

Olá! Agora sou seu assistente com INTEGRAÇÃO TOTAL ao sistema de visitas!

WORKFLOW INTEGRADO:
Visitas → Executar Roteiro → Próxima Visita → Iniciar Atendimento → Preparação Inteligente → Completar Checklist → Campos v5

FUNCIONALIDADES AVANÇADAS:
• Conversação livre - Faça qualquer pergunta
• "Iniciar visita" - Formulário completo AtendimentoVisita  
• Switches interativos em todas as seções
• 7 etapas estruturadas conforme sistema oficial
• Validações inteligentes antes de finalizar
• Integração com /visitas e navegação direta

SEÇÕES DO FORMULÁRIO (v5):
1. Dados Básicos - Paciente, data, motivos da visita
2. Busca Ativa - Consultas, exames, procedimentos
3. Acompanhamento - Condições por patologia  
4. Antropometria - Peso, altura com validações
5. Sinais Vitais - PA, FC, temperatura, saturação
6. Profissional - Visita acompanhada por equipe
7. Observações - Registro detalhado do atendimento

COMANDOS ESPECIAIS:
• "Iniciar visita" - Abre workflow completo
• "Como está o tempo?" - Orientações climáticas
• "Melhor rota hoje" - Otimização de trajeto
• "Protocolo emergência" - Guias de urgência

Digite "iniciar visita" para começar o workflow completo!`,
        timestamp: new Date(),
        categoria: 'conversa'
      };
      setMensagens([mensagemInicial]);
    }
  }, [open, mensagens.length]);

  function handleOpenChange(isOpen: boolean) {
    if (isControlled) {
      props.onOpenChange?.(isOpen);
    } else {
      setOpen(isOpen);
    }
  }

  // Processa entradas numéricas baseadas nas opções da última mensagem da IA
  function processarEntradaNumerica(entrada: string): string | null {
    const numero = parseInt(entrada.trim());
    if (isNaN(numero)) return null;

    // Buscar a última mensagem da IA que tenha opções numeradas
    const ultimaMensagemIA = [...mensagens].reverse().find(m => 
      m.tipo === 'assistant' && m.dados?.opcoes
    );

    if (!ultimaMensagemIA?.dados?.opcoes) return null;

    const opcaoSelecionada = ultimaMensagemIA.dados.opcoes.find(
      (opcao: OpcaoNumerada) => opcao.numero === numero
    );

    return opcaoSelecionada?.valor || null;
  }

  // IA Avançada com processamento de linguagem natural
  function processarPerguntaIA(pergunta: string): MensagemIA {
    const q = pergunta.toLowerCase();
    let resposta = '';
    let categoria: MensagemIA['categoria'] = 'conversa';
    let dados: any = null;

    // Comando para iniciar atendimento (após executar roteiro)
    if (q.includes('iniciar atendimento') || q.includes('começar atendimento')) {
      setModoFormulario(true);
      categoria = 'visita';
      resposta = `INICIANDO ATENDIMENTO - CARLOS MENDONÇA

PACIENTE SELECIONADO:
• Nome: Carlos Mendonça (45 anos)
• Endereço: Conjunto Vila União, 123
• Prioridade: CRÍTICA
• Condição: Hipertensão grave + AVC recente

PREPARAÇÃO INTELIGENTE CONCLUÍDA:
✅ Materiais necessários: Esfigmomanômetro, Termômetro, Lanterna
✅ Protocolos ativados: Hipertensão + pós-AVC
✅ Alertas configurados: PA > 140/90, sinais neurológicos
✅ Medicamentos para conferir: Losartana, AAS, Clopidogrel

FORMULÁRIO COMPLETO ATIVADO:
Use os switches interativos abaixo para registrar todos os dados da visita conforme o sistema oficial AtendimentoVisita.

PRIORIDADES PARA ESTA VISITA:
• Aferir pressão arterial IMEDIATAMENTE
• Verificar sinais neurológicos (fala, movimento, coordenação)
• Conferir adesão aos medicamentos
• Orientar sobre sinais de alerta de novo AVC
• Avaliar necessidade de encaminhamento urgente

O formulário está pronto para preenchimento! ↓`;
    }

    // Comando para iniciar roteiro - ETAPA 1: EXECUTAR ROTEIRO
    else if (q.includes('iniciar roteiro') || q.includes('novo roteiro') || q.includes('começar roteiro') || q.includes('iniciar visita') || q.includes('nova visita') || q.includes('começar visita')) {
      categoria = 'visita';
      setEtapaAtual('roteiro');
      resposta = `EXECUTAR ROTEIRO - JONATHAN SILVA COSTA

ROTEIRO ATIVO:
ACS: Jonathan Silva Costa  
Microárea: MA-003 - Esperança
Data: ${new Date().toLocaleDateString('pt-BR')}
Status: Em execução
Visitas restantes: 5 de 9 pendentes

PRÓXIMA VISITA PRIORITÁRIA:

Carlos Mendonça (45 anos)
Endereço: Conjunto Vila União, 123
Prioridade: CRÍTICA
Condição: Hipertensão grave + AVC recente
Tempo estimado: 50 minutos
Contato: (85) 99999-1234
Responsável: Maria Mendonça (esposa)

PREPARAÇÃO INTELIGENTE:
• Aferir pressão arterial (prioritário)
• Verificar sinais neurológicos pós-AVC
• Conferir adesão: Losartana, AAS, Clopidogrel
• Orientar sobre sinais de alerta
• Avaliar necessidade de encaminhamento

Escolha uma opção:`;

      dados = {
        botoes: [
          { label: 'Ver Dados do Atendimento', valor: 'dados atendimento' },
          { label: 'Próxima Visita', valor: 'próxima visita' },
          { label: 'Ver Roteiro Completo', valor: 'ver roteiro completo' }
        ]
      };
    }

    // ETAPA 2: DADOS DO ATENDIMENTO
    else if (q.includes('dados atendimento') || q.includes('dados do atendimento')) {
      categoria = 'visita';
      setEtapaAtual('dados-atendimento');
      setPacienteSelecionado({
        nome: 'Carlos Mendonça da Silva',
        idade: 45,
        endereco: 'Conjunto Vila União, 123',
        condicoes: ['Hipertensão', 'AVC recente'],
        prioridade: 'CRÍTICA'
      });
      
      resposta = `DADOS DO ATENDIMENTO - CARLOS MENDONÇA

INFORMAÇÕES DO PACIENTE:
Nome Completo: Carlos Mendonça da Silva
Idade: 45 anos
CPF: 123.456.789-01
Cartão SUS: 123 4567 8901 2345
Endereço: Conjunto Vila União, 123 - Bairro Esperança
Telefone: (85) 99999-1234
Responsável: Maria Mendonça (esposa)

CONDIÇÕES DE SAÚDE:
Hipertensão Arterial Sistêmica (desde 2020)
AVC isquêmico (há 3 meses - Janeiro 2025)
Sequelas: Leve hemiparesia à direita

MEDICAMENTOS EM USO:
Losartana 50mg - 1x/dia (manhã)
AAS 100mg - 1x/dia (manhã)
Clopidogrel 75mg - 1x/dia (manhã)

HISTÓRICO RECENTE:
Última consulta: 15/07/2025 (Cardiologista)
Última visita ACS: 20/07/2025
PA última aferição: 150/95 mmHg

Escolha a ação:`;

      dados = {
        botoes: [
          { label: 'Iniciar Atendimento', valor: 'iniciar atendimento' },
          { label: 'Paciente Ausente', valor: 'paciente ausente' },
          { label: 'Reagendar (Mais Tarde)', valor: 'reagendar mais tarde' }
        ]
      };
    }

    // ETAPA 3: DECISÃO DO ATENDIMENTO
    else if (q.includes('paciente ausente')) {
      categoria = 'visita';
      resposta = `PACIENTE AUSENTE - CARLOS MENDONÇA

REGISTRO DA TENTATIVA:
• Data/Hora: ${new Date().toLocaleString('pt-BR')}
• Motivo: Paciente não encontrado no domicílio
• Tentativas: 1ª tentativa

PESSOAS CONTATADAS:
• Vizinhos informaram que saiu cedo
• Deixada mensagem com a esposa (telefone)

PRÓXIMAS AÇÕES:
• Reagendado para amanhã no mesmo horário
• Orientada esposa sobre importância do acompanhamento
• Prioridade mantida como CRÍTICA

REGISTRADO NO SISTEMA E PASSANDO PARA PRÓXIMA VISITA...`;

      dados = {
        botoes: [
          { label: 'Próxima Visita', valor: 'próxima visita' },
          { label: '� Tentar Contato', valor: 'tentar contato' }
        ]
      };
    }

    else if (q.includes('reagendar mais tarde') || q.includes('mais tarde')) {
      categoria = 'visita';
      resposta = `REAGENDAMENTO - CARLOS MENDONÇA

NOVA DATA SUGERIDA:
• **Data:** ${new Date(Date.now() + 86400000).toLocaleDateString('pt-BR')}
• **Horário:** 14:00 (conforme disponibilidade informada)
• **Prioridade:** CRÍTICA (mantida)

**📝 MOTIVO DO REAGENDAMENTO:**
• Paciente solicitou outro horário
• Conflito com consulta médica
• Preferência por período vespertino

**✅ REAGENDAMENTO CONFIRMADO**
• Sistema atualizado
• Próxima visita mantém prioridade crítica
• Lembrete ativado para amanhã

**🔄 PASSANDO PARA PRÓXIMA VISITA...**`;

      dados = {
        botoes: [
          { label: 'Próxima Visita', valor: 'próxima visita' }
        ]
      };
    }

    // ETAPA 4: PREPARAÇÃO INTELIGENTE
    else if (q.includes('iniciar atendimento') || q.includes('começar atendimento')) {
      categoria = 'visita';
      setEtapaAtual('preparacao-inteligente');
      resposta = `PREPARAÇÃO INTELIGENTE ATIVADA

ANÁLISE IA PARA CARLOS MENDONÇA:

ALERTAS CRÍTICOS IDENTIFICADOS:
• PA > 140/90 nas últimas 3 aferições
• Risco de novo AVC elevado
• Medicação pode estar subdosada
• Sinais neurológicos para monitorar

MATERIAIS NECESSÁRIOS PRÉ-SELECIONADOS:
• Esfigmomanômetro (OBRIGATÓRIO)
• Termômetro
• Glicosímetro (verificar se diabético)
• Lanterna (exame neurológico)
• Fita métrica

PROTOCOLOS ATIVADOS:
• Protocolo Hipertensão Grave
• Protocolo Pós-AVC
• Avaliação Neurológica Básica
• Verificação de Adesão Medicamentosa

MEDICAMENTOS PARA CONFERIR:
• Losartana 50mg - quantidade e validade
• AAS 100mg - uso correto
• Clopidogrel 75mg - efeitos adversos

Pronto para checklist pré-atendimento`;

      dados = {
        botoes: [
          { label: 'Prosseguir para Checklist', valor: 'checklist pre atendimento' }
        ]
      };
    }

    // ETAPA 5: CHECKLIST PRÉ-ATENDIMENTO
    else if (q.includes('checklist pre atendimento') || q.includes('checklist pré')) {
      categoria = 'visita';
      setEtapaAtual('checklist-pre');
      resposta = `CHECKLIST PRÉ-ATENDIMENTO

VERIFICAÇÃO ANTES DO ATENDIMENTO:

Use os botões abaixo para confirmar cada item:

MATERIAIS NECESSÁRIOS ${checklistPre.materiais ? '✅' : '❌'}
• Esfigmomanômetro
• Termômetro  
• Glicosímetro
• Lanterna para exame neurológico

PROTOCOLOS CARREGADOS ${checklistPre.protocolos ? '✅' : '❌'}
• Protocolo Hipertensão
• Protocolo Pós-AVC
• Avaliação Neurológica

MEDICAMENTOS REVISADOS ${checklistPre.medicamentos ? '✅' : '❌'}
• Lista de medicamentos do paciente
• Dosagens e horários
• Possíveis interações

ALERTAS CONFIGURADOS ${checklistPre.alertas ? '✅' : '❌'}
• PA crítica > 180/110
• Sinais neurológicos
• Emergência cardiológica

AMBIENTE PREPARADO ${checklistPre.ambiente ? '✅' : '❌'}
• Local adequado para aferição
• Privacidade para conversa
• Iluminação suficiente

${Object.values(checklistPre).every(item => item) ? 'TODOS OS ITENS VERIFICADOS - PRONTO PARA INICIAR!' : 'Complete todos os itens para prosseguir'}`;

      dados = {
        botoes: [
          { label: `Materiais ${checklistPre.materiais ? '✅' : '❌'}`, valor: 'toggle materiais' },
          { label: `Protocolos ${checklistPre.protocolos ? '✅' : '❌'}`, valor: 'toggle protocolos' },
          { label: `Medicamentos ${checklistPre.medicamentos ? '✅' : '❌'}`, valor: 'toggle medicamentos' },
          { label: `Alertas ${checklistPre.alertas ? '✅' : '❌'}`, valor: 'toggle alertas' },
          { label: `Ambiente ${checklistPre.ambiente ? '✅' : '❌'}`, valor: 'toggle ambiente' },
          ...(Object.values(checklistPre).every(item => item) ? [{ label: 'INICIAR ATENDIMENTO', valor: 'formulario atendimento' }] : [])
        ]
      };
    }

    // TOGGLES DO CHECKLIST
    else if (q.includes('toggle materiais')) {
      setChecklistPre(prev => ({ ...prev, materiais: !prev.materiais }));
      return processarPerguntaIA('checklist pre atendimento');
    }
    else if (q.includes('toggle protocolos')) {
      setChecklistPre(prev => ({ ...prev, protocolos: !prev.protocolos }));
      return processarPerguntaIA('checklist pre atendimento');
    }
    else if (q.includes('toggle medicamentos')) {
      setChecklistPre(prev => ({ ...prev, medicamentos: !prev.medicamentos }));
      return processarPerguntaIA('checklist pre atendimento');
    }
    else if (q.includes('toggle alertas')) {
      setChecklistPre(prev => ({ ...prev, alertas: !prev.alertas }));
      return processarPerguntaIA('checklist pre atendimento');
    }
    else if (q.includes('toggle ambiente')) {
      setChecklistPre(prev => ({ ...prev, ambiente: !prev.ambiente }));
      return processarPerguntaIA('checklist pre atendimento');
    }

    // ETAPA 6: FORMULÁRIO DE ATENDIMENTO
    else if (q.includes('formulario atendimento') || q.includes('formulário atendimento')) {
      categoria = 'formulario';
      setEtapaAtual('formulario-atendimento');
      setModoFormulario(true);
      setFormMode('atendimento');
      
      // Pré-carregar dados do paciente
      setFormularioVisita(prev => ({
        ...prev,
        paciente: 'Carlos Mendonça da Silva',
        endereco: 'Conjunto Vila União, 123',
        condicoes: {
          ...prev.condicoes,
          hipertensao: true,
          idoso: false
        }
      }));

      resposta = `FORMULÁRIO DE ATENDIMENTO ATIVADO

DADOS PRÉ-CARREGADOS:
• Paciente: Carlos Mendonça da Silva
• Endereço: Conjunto Vila União, 123
• Condições: Hipertensão, Pós-AVC
• Prioridade: CRÍTICA

FORMULÁRIO OFICIAL DO e-SUS:
O formulário completo foi ativado abaixo com todos os campos do sistema AtendimentoVisita.

SEÇÕES PRINCIPAIS:
1. Busca Ativa (expansível)
2. Acompanhamento por Condições (expansível)  
3. Antropometria (peso/altura)
4. Sinais Vitais (PA, FC, Temp, SatO2)
5. Procedimentos Realizados
6. Observações da Visita

PRIORIDADES PARA ESTE PACIENTE:
• Aferir PA IMEDIATAMENTE
• Verificar sinais neurológicos
• Conferir medicamentos
• Registrar todas as orientações

USE O FORMULÁRIO INTERATIVO ABAIXO`;

      dados = {
        botoes: [
          { label: 'Focar em Sinais Vitais', valor: 'focar sinais vitais' },
          { label: 'Revisar Medicamentos', valor: 'revisar medicamentos' },
          { label: 'Avaliação Neurológica', valor: 'avaliacao neurologica' }
        ]
      };
    }

    // PRÓXIMA VISITA
    else if (q.includes('próxima visita') || q.includes('proxima visita')) {
      categoria = 'visita';
      setEtapaAtual('dados-atendimento');
      resposta = `PRÓXIMA VISITA - DONA ROSA MARIA

SEGUNDA PRIORIDADE NO ROTEIRO:
• Nome: Rosa Maria Santos (85 anos)
• Endereço: Rua das Flores, 456 - Bairro Esperança
• Prioridade: ALTA
• Condições: Diabetes Mellitus tipo 2, Hipertensão, Acamada
• Cuidador: Filha Maria (mora junto)

SITUAÇÃO CLÍNICA:
• Glicemia descontrolada (última: 280 mg/dl)
• Úlcera de pressão em calcâneo direito
• Dependente para atividades diárias
• Risco de internação alto

MEDICAMENTOS:
• Metformina 850mg - 2x/dia
• Insulina NPH - 20UI manhã
• Losartana 50mg - 1x/dia
• Omeprazol 20mg - 1x/dia

PRIORIDADES DESTA VISITA:
• Verificar glicemia capilar
• Avaliar úlcera de pressão
• Orientar cuidadora sobre posicionamento
• Verificar adesão medicamentosa
• Avaliar necessidade de encaminhamento

ESCOLHA A AÇÃO:`;

      dados = {
        botoes: [
          { label: 'Iniciar Atendimento', valor: 'dados atendimento' },
          { label: 'Paciente Ausente', valor: 'paciente ausente' },
          { label: 'Reagendar (Mais Tarde)', valor: 'reagendar mais tarde' }
        ]
      };
    }

    // Comando para iniciar atendimento - Executar ação de PrepararAtendimento
    else if (q.includes('iniciar atendimento') || q.includes('começar atendimento') || q.includes('preparar atendimento')) {
      categoria = 'visita';
      setFormMode('atendimento');
      resposta = `PREPARAÇÃO INTELIGENTE ATIVADA - CARLOS MENDONÇA

DADOS PRÉ-CARREGADOS:
• Nome: Carlos Mendonça (45 anos)
• CPF: 123.456.789-01
• Endereço: Conjunto Vila União, 123
• Telefone: (85) 99999-1234
• Responsável: Maria Mendonça (esposa)

CONDIÇÕES CRÍTICAS IDENTIFICADAS:
• Hipertensão arterial sistêmica grave
• AVC recente (há 3 meses)
• Medicação: Losartana 50mg, AAS 100mg, Clopidogrel 75mg

PREPARAÇÃO IA ESPECÍFICA:
• Aferir PA obrigatório (>140/90 = crítico)
• Avaliar mobilidade pós-AVC
• Verificar sinais neurológicos focais
• Conferir aderência medicamentosa
• Orientar sobre prevenção secundária

FORMULÁRIO DE ATENDIMENTO ATIVADO:
O sistema preencheu automaticamente os dados de Carlos Mendonça no formulário abaixo. Revise as informações e complete os campos de atendimento.

CHECKLIST PRÉ-ATENDIMENTO:
• Material de PA disponível ✓
• Protocolo AVC carregado ✓
• Contato emergência confirmado ✓
• Formulário pré-preenchido ✓

O formulário está pronto para o atendimento domiciliar! ↓`;
    }

    // Comando para próxima visita
    else if (q.includes('próxima visita') || q.includes('proxima visita') || q.includes('pular visita')) {
      categoria = 'visita';
      resposta = `PRÓXIMA VISITA NO ROTEIRO

Dona Rosa Oliveira (85 anos)
• Endereço: Rua das Flores, 456
• Prioridade: ALTA
• Condição: Acamada, diabetes, HAS
• Tempo estimado: 40 minutos
• Contato: (85) 99999-5678
• Responsável: João Oliveira (filho)

PREPARAÇÃO INTELIGENTE:
• Verificar glicemia (jejum/pós-prandial)
• Avaliar lesões por pressão
• Conferir insulinoterapia
• Orientar cuidador sobre posicionamento
• Verificar sinais de infecção

AÇÕES DISPONÍVEIS:
• **"iniciar atendimento"** - Preparação IA + formulário para Dona Rosa
• **"voltar carlos"** - Retornar para Carlos Mendonça
• **"ver roteiro completo"** - Todas as 9 visitas do dia

**Digite "iniciar atendimento" para começar com Dona Rosa!**`;
    }

    // Comando para ver roteiro completo
    else if (q.includes('ver roteiro completo') || q.includes('roteiro completo') || q.includes('todas visitas')) {
      categoria = 'visita';
      resposta = `📋 **ROTEIRO COMPLETO - JONATHAN SILVA COSTA**

**📅 Data:** ${new Date().toLocaleDateString('pt-BR')} | **Microárea:** MA-003 - Esperança

**✅ VISITAS REALIZADAS (4):**
1. ✓ Maria Santos - 08:00 (Pré-natal)
2. ✓ João Pereira - 09:15 (Hipertensão)
3. ✓ Ana Lima - 10:30 (Puericultura)
4. ✓ Pedro Silva - 11:45 (Diabetes)

**⏳ VISITAS PENDENTES (5):**
5. 🚨 **Carlos Mendonça** - 13:00 (CRÍTICA - AVC/HAS)
6. 🔶 **Dona Rosa** - 14:00 (ALTA - Acamada/DM)
7. 🔸 Antônio Costa - 15:00 (MÉDIA - Rotina)
8. 🔹 Lúcia Fernandes - 16:00 (BAIXA - Preventivo)
9. 🔹 Francisco Rocha - 17:00 (BAIXA - Acompanhamento)

**📊 ESTATÍSTICAS:**
• **Tempo médio:** 45 min/visita
• **Prioridade crítica:** 1 paciente
• **Estimativa conclusão:** 18:00

**⚡ COMANDOS RÁPIDOS:**
• **"carlos mendonça"** - Ir para visita crítica
• **"dona rosa"** - Ir para próxima prioridade
• **"iniciar atendimento"** - Começar com paciente atual

**Digite o nome do paciente ou "iniciar atendimento"!**`;
    }

    // Perguntas sobre workflow/processo
    else if (q.includes('workflow') || q.includes('processo') || q.includes('etapas') || q.includes('passo a passo')) {
      categoria = 'visita';
      resposta = `🎯 **WORKFLOW DE VISITA DOMICILIAR INICIADO**

**📋 ETAPAS DO PROCESSO:**

**1. 🎯 EXECUTAR ROTEIRO**
   • Revisar lista de visitas pendentes
   • Verificar prioridades (crítica, alta, média, baixa)
   • Confirmar endereços e contatos

**2. ▶️ PRÓXIMA VISITA**  
   • Selecionar paciente da lista
   • Verificar histórico médico
   • Revisar condições especiais

**3. 🚀 INICIAR ATENDIMENTO**
   • Preparação inteligente baseada no perfil
   • Materiais necessários sugeridos
   • Protocolos específicos ativados

**4. ✅ COMPLETAR CHECKLIST**
   • Busca Ativa (expandível)
   • Acompanhamento por condições
   • Antropometria (peso/altura)
   • Sinais vitais completos
   • Observações detalhadas

**5. 💾 FINALIZAR**
   • Salvar dados da visita
   • Gerar relatório automático
   • Agendar próximo retorno

O formulário completo com todos os campos do sistema está disponível abaixo! 👇`;
    }

    // Perguntas sobre clima/tempo
    else if (q.includes('tempo') || q.includes('clima') || q.includes('chuva') || q.includes('sol')) {
      resposta = `🌤️ **ORIENTAÇÕES SOBRE CLIMA E VISITAS**

${baseConhecimentoExpandida.respostasContext.clima}

**☀️ EM DIAS ENSOLARADOS:**
• Prefira visitas matinais (7h-10h) ou tardinha (16h-18h)
• Leve protetor solar e boné
• Mantenha hidratação adequada
• Cuidado com medicamentos que ficam no calor

**🌧️ EM DIAS CHUVOSOS:**
• Priorize visitas em locais cobertos
• Leve materiais em sacola impermeável
• Confirme disponibilidade antes de sair
• Reagende se necessário por segurança

**🌡️ TEMPERATURAS EXTREMAS:**
• Cuidado especial com idosos e crianças
• Verificar conservação de medicamentos
• Orientar sobre hidratação e vestuário`;
    }

    // Perguntas sobre rota/deslocamento
    else if (q.includes('rota') || q.includes('trajeto') || q.includes('caminho') || q.includes('deslocamento')) {
      resposta = `🗺️ **OTIMIZAÇÃO DE ROTAS E TRAJETOS**

${baseConhecimentoExpandida.respostasContext.transporte}

**📍 PLANEJAMENTO EFICIENTE:**
• Agrupe visitas por bairro/região
• Comece pelas mais distantes da UBS
• Termine perto da unidade para retorno
• Considere horários de maior disponibilidade

**⏰ MELHORES HORÁRIOS:**
• **7h-9h**: Pacientes idosos (acordam cedo)
• **9h-11h**: Famílias com crianças
• **14h-17h**: Gestantes e adultos
• **Evitar**: 12h-14h (almoço) e após 18h

**🚶‍♂️ DICAS DE SEGURANÇA:**
• Informe à equipe sobre seu trajeto
• Leve telefone carregado
• Evite locais isolados após escurecer
• Use identificação visível da UBS`;
    }

    // Perguntas sobre documentação
    else if (q.includes('registro') || q.includes('documentar') || q.includes('prontuario') || q.includes('relatório')) {
      resposta = `📝 **DOCUMENTAÇÃO E REGISTROS**

${baseConhecimentoExpandida.respostasContext.documentacao}

**📋 DADOS ESSENCIAIS:**
• Data, hora e local da visita
• Pessoas presentes no domicílio
• Observações do ambiente
• Condições de saúde identificadas
• Orientações fornecidas
• Encaminhamentos realizados

**💻 SISTEMAS DE REGISTRO:**
• e-SUS Atenção Básica
• Prontuário eletrônico local
• Fichas de acompanhamento
• Relatórios mensais

**📊 INDICADORES IMPORTANTES:**
• Frequência de visitas por família
• Adesão a tratamentos
• Mudanças no quadro de saúde
• Satisfação com atendimento`;
    }

    // Perguntas sobre emergências
    else if (q.includes('emergencia') || q.includes('urgente') || q.includes('samu') || q.includes('socorro')) {
      resposta = `🚨 **PROTOCOLO DE EMERGÊNCIAS**

${baseConhecimentoExpandida.respostasContext.emergencias}

**📞 CONTATOS DE EMERGÊNCIA:**
• **SAMU**: 192
• **Bombeiros**: 193
• **Polícia**: 190
• **UBS**: [seu número local]

**🏥 SITUAÇÕES DE EMERGÊNCIA:**
• Parada cardiorrespiratória
• Convulsões
• Sangramento intenso
• Dificuldade respiratória grave
• Dor torácica intensa
• Perda de consciência

**👨‍⚕️ PRIMEIROS SOCORROS:**
• Mantenha a calma
• Avalie responsividade
• Verifique respiração e pulso
• Posicione adequadamente
• Não mova vítima com trauma
• Aguarde socorro especializado`;
    }

    // Perguntas sobre abordagem familiar
    else if (q.includes('família') || q.includes('abordagem') || q.includes('resistente') || q.includes('recusa')) {
      resposta = `👨‍👩‍👧‍👦 **ABORDAGEM FAMILIAR E COMUNICAÇÃO**

${baseConhecimentoExpandida.respostasContext.familias}

**🤝 ESTRATÉGIAS DE APROXIMAÇÃO:**
• Apresente-se sempre com cordialidade
• Explique o objetivo da visita
• Respeite crenças e valores familiares
• Use linguagem acessível
• Demonstre interesse genuíno

**💬 SUPERANDO RESISTÊNCIAS:**
• Escute sem julgar
• Valide preocupações legítimas
• Apresente benefícios concretos
• Ofereça alternativas
• Respeite o tempo da família

**🎯 TÉCNICAS DE COMUNICAÇÃO:**
• Perguntas abertas
• Escuta ativa
• Linguagem corporal acolhedora
• Evitar termos técnicos
• Confirmar entendimento`;
    }

    // Comandos especiais com IA
    else if (q.includes('relatório do dia') || q.includes('resumo do dia')) {
      categoria = 'relatorio';
      const hoje = new Date().toLocaleDateString('pt-BR');
      resposta = `📊 **RELATÓRIO INTELIGENTE DO DIA - ${hoje}**

**✅ VISITAS PLANEJADAS:** 8
**✅ VISITAS REALIZADAS:** 6
**⏳ PENDENTES:** 2

**🎯 DESTAQUES DO DIA:**
• 3 pacientes com pressão controlada
• 1 gestante encaminhada para consulta
• 2 famílias orientadas sobre dengue
• 1 idoso com nova medicação

**📈 INDICADORES:**
• Taxa de cobertura: 95%
• Adesão a tratamentos: 87%
• Famílias satisfeitas: 100%

**📋 PRÓXIMAS AÇÕES:**
• Reagendar 2 visitas pendentes
• Acompanhar encaminhamento gestante
• Retornar ao Sr. José (nova medicação)`;
    }

    // Respostas para opções numeradas específicas
    else if (q.includes('protocolos saúde') || q.includes('protocolo saude')) {
      categoria = 'protocolo';
      resposta = `📋 **PROTOCOLOS DE SAÚDE - ACS**

**🏥 PROTOCOLOS PRINCIPAIS:**

**1. 🩺 VISITA DOMICILIAR**
• Identificação e apresentação
• Avaliação do ambiente domiciliar
• Verificação de sinais vitais
• Orientações de saúde

**2. 🤰 PRÉ-NATAL**
• Acompanhamento mensal
• Verificação do cartão de gestante
• Orientações nutricionais
• Sinais de alerta

**3. 👶 PUERICULTURA**
• Acompanhamento do crescimento
• Verificação da caderneta de vacinação
• Orientações sobre aleitamento
• Desenvolvimento infantil

**4. 🏥 HIPERTENSÃO/DIABETES**
• Aferição de PA e glicemia
• Verificação de medicamentos
• Orientações dietéticas
• Acompanhamento especializado`;

      dados = {
        botoes: [
          { label: '📋 Ver Protocolo Completo', valor: 'protocolo completo' },
          { label: '🎯 Iniciar Roteiro', valor: 'iniciar roteiro' },
          { label: '📞 Procedimentos Emergência', valor: 'emergência' }
        ]
      };
    }

    else if (q.includes('dicas situações') || q.includes('dicas situacoes')) {
      categoria = 'conversa';
      resposta = `💡 **DICAS PARA SITUAÇÕES ESPECÍFICAS**

**🚪 RESISTÊNCIA À VISITA:**
• Apresente-se educadamente
• Explique os benefícios da visita
• Respeite a decisão da família
• Ofereça horário alternativo

**💊 MEDICAMENTOS:**
• Verifique cartela/caixa
• Pergunte sobre efeitos colaterais
• Oriente sobre horários
• Identifique dificuldades

**👶 RECÉM-NASCIDO:**
• Observe ambiente seguro
• Verifique aleitamento
• Acompanhe vacinação
• Oriente cuidados básicos

**👴 IDOSOS:**
• Fale devagar e claramente
• Verifique quedas recentes
• Confira medicamentos
• Avalie rede de apoio`;

      dados = {
        botoes: [
          { label: '🏠 Mais Dicas Domiciliares', valor: 'dicas domiciliares' },
          { label: '📞 Situações de Emergência', valor: 'emergência' },
          { label: '🔄 Voltar ao Menu', valor: 'menu principal' }
        ]
      };
    }

    else if (q.includes('clima rotas') || q.includes('tempo rotas')) {
      categoria = 'visita';
      resposta = `🌤️ **INFORMAÇÕES CLIMA E ROTAS**

**☀️ CONDIÇÕES HOJE:**
• **Temperatura:** 28°C - Calor moderado
• **Céu:** Parcialmente nublado
• **Chuva:** Probabilidade 20%
• **Vento:** Fraco (10 km/h)

**🗺️ MELHOR ROTA SUGERIDA:**
1. **Carlos Mendonça** - Vila União (Crítica)
2. **Dona Rosa** - Bairro Esperança (Alta)
3. **Antônio Costa** - Centro (Média)
4. **Lúcia** e **Francisco** - Mesmo bairro

**⚠️ RECOMENDAÇÕES:**
• Leve protetor solar e água
• Evite horário 12h-14h (muito sol)
• Aproveite manhã para visitas externas
• Tenha guarda-chuva de reserva`;

      dados = {
        botoes: [
          { label: '🗺️ Ver Rota Detalhada', valor: 'rota detalhada' },
          { label: '🚗 Otimizar Percurso', valor: 'otimizar percurso' }
        ]
      };
    }

    // Resposta padrão conversacional
    else {
      const saudacoes = baseConhecimentoExpandida.saudacoes;
      const saudacaoAleatoria = saudacoes[Math.floor(Math.random() * saudacoes.length)];
      
      resposta = `IA30 - ASSISTENTE INTELIGENTE PARA ACS

${saudacaoAleatoria}

Sou seu assistente com INTEGRAÇÃO TOTAL ao sistema de visitas domiciliares!

WORKFLOW INTEGRADO:
Visitas → Executar Roteiro → Próxima Visita → Iniciar Atendimento → Preparação Inteligente → Completar Checklist → Formulário v5

FUNCIONALIDADES PRINCIPAIS:
• Conversação livre - Faça qualquer pergunta
• Workflow completo de visitas domiciliares  
• Formulário AtendimentoVisita v5 integrado
• 7 seções estruturadas do sistema oficial
• Validações inteligentes automáticas
• Navegação direta para sistema de visitas

SEÇÕES DO FORMULÁRIO v5:
1. Dados Básicos - Paciente, data, motivos da visita
2. Busca Ativa - Consultas, exames, procedimentos
3. Acompanhamento - Condições por patologia  
4. Antropometria - Peso, altura com validações
5. Sinais Vitais - PA, FC, temperatura, saturação
6. Profissional - Visita acompanhada por equipe
7. Observações - Registro detalhado do atendimento

Escolha uma opção abaixo para começar:`;

      dados = {
        botoes: [
          { label: 'Iniciar Roteiro Domiciliar', valor: 'iniciar roteiro' },
          { label: 'Ver Roteiro Completo', valor: 'ver roteiro completo' },
          { label: 'Orientações de Protocolos', valor: 'protocolos saúde' },
          { label: 'Dicas para Situações', valor: 'dicas situações' },
          { label: 'Relatórios e Estatísticas', valor: 'relatórios' },
          { label: 'Clima e Rotas', valor: 'clima rotas' },
          { label: 'Documentação', valor: 'documentação' },
          { label: 'Procedimentos Emergência', valor: 'emergência' }
        ]
      };
    }

    return {
      id: Date.now().toString(),
      tipo: 'assistant',
      conteudo: resposta,
      timestamp: new Date(),
      categoria,
      dados
    };
  }

  function enviarMensagem() {
    if (!inputMensagem.trim()) return;

    enviarMensagemDireta(inputMensagem);
    setInputMensagem('');
  }

  function enviarMensagemDireta(texto: string) {
    // Verificar se é uma entrada numérica para opções
    const comandoNumerico = processarEntradaNumerica(texto);
    const mensagemParaProcessar = comandoNumerico || texto;

    const mensagemUser: MensagemIA = {
      id: Date.now().toString(),
      tipo: 'user',
      conteudo: comandoNumerico ? `${texto} - ${comandoNumerico}` : texto,
      timestamp: new Date()
    };

    setMensagens(prev => [...prev, mensagemUser]);
    setCarregando(true);

    setTimeout(() => {
      const respostaIA = processarPerguntaIA(mensagemParaProcessar);
      setMensagens(prev => [...prev, respostaIA]);
      setCarregando(false);
    }, 1000);
  }

  function salvarVisita() {
    // Validações obrigatórias - verificar se tem paciente selecionado ou pré-selecionado
    if (!formularioVisita.paciente && !pacienteSelecionado) {
      const mensagemErro: MensagemIA = {
        id: Date.now().toString(),
        tipo: 'assistant',
        conteudo: '⚠️ **ERRO**: Por favor, selecione um paciente antes de finalizar o atendimento.',
        timestamp: new Date(),
        categoria: 'formulario'
      };
      setMensagens(prev => [...prev, mensagemErro]);
      return;
    }

    // Verificar se pelo menos um motivo foi selecionado
    const motivosSelecionados = Object.values(formularioVisita.condicoes).some(value => value);
    if (!motivosSelecionados) {
      const mensagemErro: MensagemIA = {
        id: Date.now().toString(),
        tipo: 'assistant',
        conteudo: '⚠️ **ERRO**: Selecione pelo menos um motivo da visita antes de finalizar.',
        timestamp: new Date(),
        categoria: 'formulario'
      };
      setMensagens(prev => [...prev, mensagemErro]);
      return;
    }

    // Salvar dados da visita
    const visitas = JSON.parse(localStorage.getItem('visitas') || '[]');
    const pacienteNome = pacienteSelecionado ? pacienteSelecionado.nome : formularioVisita.paciente;
    const novaVisita = {
      id: Date.now().toString(),
      ...formularioVisita,
      paciente: pacienteNome, // Usar o nome correto do paciente
      timestamp: new Date().toISOString(),
      status: 'concluida',
      etapa: 'atendimento_finalizado',
      workflow: {
        roteiro: 'executado',
        proximaVisita: 'iniciada',
        atendimento: 'em_andamento',
        preparacaoInteligente: 'concluida',
        checklist: 'completo',
        finalizacao: 'concluida'
      }
    };
    
    visitas.push(novaVisita);
    localStorage.setItem('visitas', JSON.stringify(visitas));
    
    setModoFormulario(false);
    
    // Contar procedimentos realizados
    const procedimentosAtivos = Object.entries(formularioVisita.procedimentos)
      .filter(([_, ativo]) => ativo).length;
    const condicoesAcompanhadas = Object.entries(formularioVisita.condicoes)
      .filter(([_, ativo]) => ativo).length;
    
    const mensagemSucesso: MensagemIA = {
      id: Date.now().toString(),
      tipo: 'assistant',
      conteudo: `🎉 **ATENDIMENTO FINALIZADO COM SUCESSO!**

**� PACIENTE:** ${pacienteNome}
**📅 DATA:** ${new Date(formularioVisita.data).toLocaleDateString('pt-BR')}  
**⏰ HORA:** ${formularioVisita.hora}

**✅ WORKFLOW COMPLETO:**
• ✅ Roteiro executado
• ✅ Próxima visita iniciada  
• ✅ Atendimento preparado
• ✅ Preparação inteligente
• ✅ Checklist completado
• ✅ Campos v5 preenchidos

**📊 RESUMO DO ATENDIMENTO:**
• **${condicoesAcompanhadas}** condições identificadas
• **${procedimentosAtivos}** procedimentos realizados
• **Antropometria:** ${formularioVisita.procedimentos.pesoAltura ? 'Realizada' : 'Não aplicável'}
• **Sinais vitais:** Coletados
• **Observações:** ${formularioVisita.observacoes ? 'Registradas' : 'Não informadas'}

**🎯 PRÓXIMOS PASSOS:**
• Visita salva no sistema local
• Dados prontos para sincronização
• Disponível em /visitas para consulta
• Relatório gerado automaticamente

**🏥 INTEGRAÇÃO:**
Esta visita seguiu exatamente o mesmo fluxo de:
📋 /visitas → 🎯 executar roteiro → ▶️ próxima visita → 🏥 iniciar atendimento → 🧠 preparação inteligente → ✅ completar checklist → 💾 campos do /visita/atendimento/v5

Deseja iniciar uma nova visita ou consultar o sistema completo?`,
      timestamp: new Date(),
      categoria: 'visita'
    };
    
    setMensagens(prev => [...prev, mensagemSucesso]);
    
    // Reset completo do formulário
    setFormularioVisita({
      paciente: '',
      endereco: '',
      tipoVisita: 'domiciliar',
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      observacoes: '',
      condicoes: {
        diabetes: false,
        hipertensao: false,
        gestacao: false,
        idoso: false,
        crianca: false,
        deficiencia: false,
      },
      procedimentos: {
        aferirPA: false,
        verificarGlicemia: false,
        pesoAltura: false,
        vacinacao: false,
        orientacaoNutricional: false,
        avaliacaoFeridas: false,
      },
      medicamentos: {
        verificarAdesao: false,
        orientarHorarios: false,
        verificarEstoque: false,
        relatarEfeitosAdversos: false,
      }
    });
  }

  function getCategoriaIcon(categoria?: string) {
    switch (categoria) {
      case 'visita': return <Home className="w-4 h-4" />;
      case 'formulario': return <FileText className="w-4 h-4" />;
      case 'relatorio': return <Activity className="w-4 h-4" />;
      case 'protocolo': return <Stethoscope className="w-4 h-4" />;
      case 'conversa': return <MessageSquare className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  }

  function getEtapaDisplay() {
    switch (etapaAtual) {
      case 'inicial': return { nome: 'Chat Livre', cor: 'bg-white/20' };
      case 'roteiro': return { nome: 'Executar Roteiro', cor: 'bg-yellow-500/80' };
      case 'dados-atendimento': return { nome: 'Dados do Atendimento', cor: 'bg-blue-500/80' };
      case 'decisao-atendimento': return { nome: 'Decisão Atendimento', cor: 'bg-orange-500/80' };
      case 'preparacao-inteligente': return { nome: 'Preparação IA', cor: 'bg-purple-500/80' };
      case 'checklist-pre': return { nome: 'Checklist Pré', cor: 'bg-indigo-500/80' };
      case 'formulario-atendimento': return { nome: 'Formulário Atendimento', cor: 'bg-green-500/80' };
      default: return { nome: 'IA Ativa', cor: 'bg-white/20' };
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={
          fullScreen
            ? 'z-50 p-0 bg-white flex flex-col rounded-none shadow-none'
            : 'max-w-6xl w-full mx-auto p-0 rounded-lg shadow-2xl bg-white flex flex-col'
        }
        style={
          fullScreen
            ? {
                width: '100vw',
                height: '100vh',
                maxWidth: 'none',
                maxHeight: 'none',
                borderRadius: 0,
                margin: 0,
                boxShadow: 'none',
                zIndex: 50,
              }
            : {
                marginTop: '16px',
                marginBottom: '16px',
                marginLeft: 'auto',
                marginRight: 'auto',
                height: '95vh'
              }
        }
        aria-describedby="assistente-dialog-description"
      >
        <DialogTitle asChild>
          <span style={{position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0}}>
            I.A30 Assistente Avançado
          </span>
        </DialogTitle>
        <DialogDescription asChild id="assistente-dialog-description">
          <span style={{position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0}}>
            Assistente inteligente avançado com capacidades de conversação e automação para ACS.
          </span>
        </DialogDescription>

        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">I.A30 Avançado</h2>
              <p className="text-sm opacity-90">Assistente Inteligente com IA Conversacional</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${getEtapaDisplay().cor} text-white border-white/30`}>
              {getEtapaDisplay().nome}
            </Badge>
            {pacienteSelecionado && (
              <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                {pacienteSelecionado.nome}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFullScreen(!fullScreen)}
              className="text-white hover:bg-white/20"
            >
              {fullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat principal */}
          <div className="flex-1 flex flex-col">
            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mensagens.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`flex ${mensagem.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      mensagem.tipo === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800 border-l-4 border-purple-500'
                    }`}
                  >
                    {mensagem.tipo === 'assistant' && mensagem.categoria && (
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoriaIcon(mensagem.categoria)}
                        <Badge variant="outline" className="text-xs">
                          {mensagem.categoria?.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</div>
                    
                    {/* Botões dinâmicos (quando há até 5 opções) */}
                    {mensagem.dados?.botoes && (
                      <div className="mt-3 space-y-2">
                        {mensagem.dados.botoes.map((botao: BotaoRapido, index: number) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left text-xs h-8 bg-white hover:bg-purple-50"
                            onClick={() => {
                              enviarMensagemDireta(botao.valor);
                            }}
                          >
                            {botao.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Opções numeradas (quando há mais de 5 opções) */}
                    {mensagem.dados?.opcoes && (
                      <div className="mt-3 space-y-1">
                        <div className="text-xs text-gray-600 mb-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                          💡 <strong>Digite o número da opção desejada</strong> (ex: digite "1" para a primeira opção)
                        </div>
                        {mensagem.dados.opcoes.map((opcao: OpcaoNumerada) => (
                          <div key={opcao.numero} className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs min-w-6 h-6 flex items-center justify-center">
                              {opcao.numero}
                            </Badge>
                            <span className="text-xs text-gray-700">{opcao.texto}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2">
                      {mensagem.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {carregando && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span className="text-sm text-gray-600">I.A processando...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <Separator />

            {/* Sugestões rápidas - só mostrar quando não há mensagens */}
            {mensagens.length === 0 && (
              <div className="px-4 py-2 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Iniciar roteiro",
                    "Como está o tempo?", 
                    "Melhor rota hoje",
                    "Protocolo emergência",
                    "Relatório do dia",
                    "Abordagem familiar"
                  ].map((sugestao) => (
                    <Button
                      key={sugestao}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => enviarMensagemDireta(sugestao)}
                    >
                      {sugestao}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input de mensagem */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={inputMensagem}
                  onChange={(e) => setInputMensagem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                  placeholder="Faça qualquer pergunta ou digite um comando..."
                  disabled={carregando}
                />
                <Button 
                  onClick={enviarMensagem}
                  disabled={!inputMensagem.trim() || carregando}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 IA Avançada: Converse livremente ou use comandos como "iniciar visita"
              </p>
            </div>
          </div>

          {/* Formulário de visita completo (lateral) */}
          {modoFormulario && (
            <div className="w-96 border-l bg-gray-50 p-4 overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-green-600" />
                    Workflow de Visita Completo
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">
                    Campos v5 - AtendimentoVisita
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* 1. Dados Básicos */}
                  <Card className="border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center text-blue-800">
                        <User className="w-4 h-4 mr-2" />
                        1. Dados Básicos da Visita
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="paciente">Paciente</Label>
                        {pacienteSelecionado ? (
                          <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-800">{pacienteSelecionado.nome}</span>
                              <Badge variant="outline" className="text-xs">Pré-selecionado</Badge>
                            </div>
                          </div>
                        ) : (
                          <Select
                            value={formularioVisita.paciente}
                            onValueChange={(value) => setFormularioVisita(prev => ({ ...prev, paciente: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o paciente" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPessoas.map((pessoa) => (
                                <SelectItem key={pessoa.id} value={pessoa.nome}>
                                  {pessoa.nome} - {pessoa.idade} anos
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="data">Data</Label>
                          <Input
                            id="data"
                            type="date"
                            value={formularioVisita.data}
                            onChange={(e) => setFormularioVisita(prev => ({ ...prev, data: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hora">Hora</Label>
                          <Input
                            id="hora"
                            type="time"
                            value={formularioVisita.hora}
                            onChange={(e) => setFormularioVisita(prev => ({ ...prev, hora: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Motivos da Visita (múltipla escolha)</Label>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {[
                            'Consulta Médica', 'Consulta Odontológica', 'Vacinação',
                            'Acompanhamento', 'Orientação em Saúde', 'Busca Ativa',
                            'Controle de Medicamentos', 'Outros'
                          ].map((motivo) => (
                            <div key={motivo} className="flex items-center justify-between">
                              <Label className="text-sm">{motivo}</Label>
                              <Switch
                                checked={formularioVisita.condicoes[motivo as keyof typeof formularioVisita.condicoes] || false}
                                onCheckedChange={(checked) => 
                                  setFormularioVisita(prev => ({
                                    ...prev,
                                    condicoes: { ...prev.condicoes, [motivo]: checked }
                                  }))
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. Busca Ativa */}
                  <Card className="border-orange-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between text-orange-800">
                        <div className="flex items-center">
                          <Search className="w-4 h-4 mr-2" />
                          2. Busca Ativa (Expandível)
                        </div>
                        <Switch
                          checked={buscaAtivaExpandida}
                          onCheckedChange={setBuscaAtivaExpandida}
                        />
                      </CardTitle>
                    </CardHeader>
                    {buscaAtivaExpandida && (
                      <CardContent className="space-y-2">
                        {[
                          { key: 'consultaMedica', label: 'Consulta Médica' },
                          { key: 'consultaOdontologica', label: 'Consulta Odontológica' },
                          { key: 'vacinacao', label: 'Vacinação' },
                          { key: 'examePreventivo', label: 'Exame Preventivo' },
                          { key: 'exameMama', label: 'Exame de Mama' },
                          { key: 'planejamentoFamiliar', label: 'Planejamento Familiar' },
                          { key: 'preNatal', label: 'Pré-Natal' },
                          { key: 'puericultura', label: 'Puericultura' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between">
                            <Label className="text-sm">{label}</Label>
                            <Switch
                              checked={formularioVisita.procedimentos[key as keyof typeof formularioVisita.procedimentos] || false}
                              onCheckedChange={(checked) => 
                                setFormularioVisita(prev => ({
                                  ...prev,
                                  procedimentos: { ...prev.procedimentos, [key]: checked }
                                }))
                              }
                            />
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>

                  {/* 3. Acompanhamento por Condições */}
                  <Card className="border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between text-green-800">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-2" />
                          3. Acompanhamento (Expandível)
                        </div>
                        <Switch
                          checked={acompanhamentoExpandido}
                          onCheckedChange={setAcompanhamentoExpandido}
                        />
                      </CardTitle>
                    </CardHeader>
                    {acompanhamentoExpandido && (
                      <CardContent className="space-y-2">
                        {[
                          { key: 'gestante', label: 'Gestante' },
                          { key: 'puerpera', label: 'Puérpera' },
                          { key: 'recemNascido', label: 'Recém-Nascido' },
                          { key: 'crianca', label: 'Criança' },
                          { key: 'pessoaComDeficiencia', label: 'Pessoa com Deficiência' },
                          { key: 'hipertensao', label: 'Hipertensão' },
                          { key: 'diabetes', label: 'Diabetes' },
                          { key: 'asma', label: 'Asma' },
                          { key: 'dpoc', label: 'DPOC' },
                          { key: 'cancer', label: 'Câncer' },
                          { key: 'tuberculose', label: 'Tuberculose' },
                          { key: 'hanseniase', label: 'Hanseníase' }
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between">
                            <Label className="text-sm">{label}</Label>
                            <Switch
                              checked={formularioVisita.condicoes[key as keyof typeof formularioVisita.condicoes] || false}
                              onCheckedChange={(checked) => 
                                setFormularioVisita(prev => ({
                                  ...prev,
                                  condicoes: { ...prev.condicoes, [key]: checked }
                                }))
                              }
                            />
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>

                  {/* 4. Antropometria */}
                  <Card className="border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between text-purple-800">
                        <div className="flex items-center">
                          <Weight className="w-4 h-4 mr-2" />
                          4. Antropometria (Expandível)
                        </div>
                        <Switch
                          checked={formularioVisita.procedimentos.pesoAltura}
                          onCheckedChange={(checked) => 
                            setFormularioVisita(prev => ({
                              ...prev,
                              procedimentos: { ...prev.procedimentos, pesoAltura: checked }
                            }))
                          }
                        />
                      </CardTitle>
                    </CardHeader>
                    {formularioVisita.procedimentos.pesoAltura && (
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="peso">Peso (kg)</Label>
                            <Input
                              id="peso"
                              type="number"
                              placeholder="70.5"
                              step="0.1"
                              min="0.5"
                              max="300"
                            />
                            <p className="text-xs text-gray-500 mt-1">Faixa: 0,5 a 300 kg</p>
                          </div>
                          <div>
                            <Label htmlFor="altura">Altura (cm)</Label>
                            <Input
                              id="altura"
                              type="number"
                              placeholder="170"
                              step="0.1"
                              min="30"
                              max="250"
                            />
                            <p className="text-xs text-gray-500 mt-1">Faixa: 30 a 250 cm</p>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* 5. Sinais Vitais */}
                  <Card className="border-indigo-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center text-indigo-800">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        5. Sinais Vitais
                        <Badge variant="outline" className="ml-2 text-xs bg-indigo-50">
                          IA Ativa
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="pressao">Pressão Arterial</Label>
                          <Input
                            id="pressao"
                            placeholder="120/80"
                          />
                          <p className="text-xs text-gray-500 mt-1">Formato: sistólica/diastólica</p>
                        </div>
                        <div>
                          <Label htmlFor="freq">Freq. Cardíaca</Label>
                          <Input
                            id="freq"
                            type="number"
                            placeholder="72"
                          />
                          <p className="text-xs text-gray-500 mt-1">bpm</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="temp">Temperatura</Label>
                          <Input
                            id="temp"
                            type="number"
                            placeholder="36.5"
                            step="0.1"
                          />
                          <p className="text-xs text-gray-500 mt-1">°C</p>
                        </div>
                        <div>
                          <Label htmlFor="sat">Saturação O2</Label>
                          <Input
                            id="sat"
                            type="number"
                            placeholder="98"
                          />
                          <p className="text-xs text-gray-500 mt-1">%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 6. Profissional Acompanhante */}
                  <Card className="border-yellow-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between text-yellow-800">
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-2" />
                          6. Visita Acompanhada
                        </div>
                        <Switch
                          checked={formularioVisita.condicoes.deficiencia}
                          onCheckedChange={(checked) => 
                            setFormularioVisita(prev => ({
                              ...prev,
                              condicoes: { ...prev.condicoes, deficiencia: checked }
                            }))
                          }
                        />
                      </CardTitle>
                    </CardHeader>
                    {formularioVisita.condicoes.deficiencia && (
                      <CardContent>
                        <div>
                          <Label>Profissional Acompanhante</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o profissional" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dr-carlos">Dr. Carlos - Médico</SelectItem>
                              <SelectItem value="dra-ana">Dra. Ana - Enfermeira</SelectItem>
                              <SelectItem value="maria">Maria - Técnica de Enfermagem</SelectItem>
                              <SelectItem value="joao">João - Dentista</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* 7. Observações Finais */}
                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center text-gray-800">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        7. Observações da Visita
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={formularioVisita.observacoes}
                        onChange={(e) => setFormularioVisita(prev => ({ ...prev, observacoes: e.target.value }))}
                        placeholder="Registre detalhes importantes da visita, condições encontradas, orientações dadas, encaminhamentos realizados..."
                        rows={4}
                      />
                    </CardContent>
                  </Card>

                  {/* Ações */}
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={salvarVisita} 
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Finalizar Atendimento
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/visitas')}
                      className="w-full"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Ir para Sistema de Visitas
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setModoFormulario(false)}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Fechar Formulário
                    </Button>
                  </div>

                  {/* Tempo de Atendimento */}
                  <div className="text-center pt-4 border-t">
                    <div className="flex items-center justify-center text-gray-500 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Atendimento iniciado às {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
