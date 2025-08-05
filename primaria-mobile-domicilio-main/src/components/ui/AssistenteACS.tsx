import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { Badge } from './badge';
import { Separator } from './separator';
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
  Activity
} from 'lucide-react';

type AssistenteACSProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

interface MensagemIA {
  id: string;
  tipo: 'user' | 'assistant';
  conteudo: string;
  timestamp: Date;
  categoria?: 'consulta' | 'protocolo' | 'alerta' | 'orientacao';
  prioridade?: 'baixa' | 'media' | 'alta' | 'critica';
}

interface ContextoACS {
  visitaAtual?: any;
  pacienteAtual?: any;
  localAtual?: string;
  horario?: string;
  condicoesPrevias?: string[];
  medicamentosAtivos?: string[];
  alertasAtivos?: string[];
  cadastrosPacientes?: any[];
  visitasRealizadas?: any[];
  ruasTerritorioAbrangencia?: any[];
}

// Função para carregar dados mockados
function carregarDadosMockados(): {
  pacientes: any[];
  visitas: any[];
  ruas: any[];
} {
  try {
    const pacientes = JSON.parse(localStorage.getItem('cadastrosCidadao') || '[]');
    const visitas = JSON.parse(localStorage.getItem('visitas') || '[]');
    const ruas = JSON.parse(localStorage.getItem('cadastrosRua') || '[]');
    
    return { pacientes, visitas, ruas };
  } catch {
    return { pacientes: [], visitas: [], ruas: [] };
  }
}

// Função para analisar dados do território
function analisarDadosTerritorioLocal() {
  const { pacientes, visitas, ruas } = carregarDadosMockados();
  
  const estatisticas = {
    totalPacientes: pacientes.length,
    visitasHoje: visitas.filter(v => {
      const hoje = new Date().toDateString();
      const dataVisita = new Date(v.data || v.timestamp).toDateString();
      return dataVisita === hoje;
    }).length,
    ruasCadastradas: ruas.length,
    condicoesFrequentes: {} as Record<string, number>,
    pacientesRisco: [] as any[],
    medicamentosComuns: {} as Record<string, number>
  };
  
  // Análise de condições de saúde
  pacientes.forEach(paciente => {
    if (paciente.condicoes) {
      paciente.condicoes.split(',').forEach((condicao: string) => {
        const c = condicao.trim().toLowerCase();
        estatisticas.condicoesFrequentes[c] = (estatisticas.condicoesFrequentes[c] || 0) + 1;
      });
    }
    
    if (paciente.medicamentos) {
      paciente.medicamentos.split(',').forEach((med: string) => {
        const m = med.trim();
        estatisticas.medicamentosComuns[m] = (estatisticas.medicamentosComuns[m] || 0) + 1;
      });
    }
    
    // Identificar pacientes de risco
    if (paciente.idade > 65 || paciente.condicoes?.includes('diabetes') || 
        paciente.condicoes?.includes('hipertensao') || paciente.gestante) {
      estatisticas.pacientesRisco.push(paciente);
    }
  });
  
  return estatisticas;
}

// Base de conhecimento especializada para ACS
const baseConhecimentoACS = {
  protocolos: {
    hipertensao: {
      orientacoes: [
        "Verificar adesão à medicação anti-hipertensiva",
        "Orientar sobre redução do consumo de sal",
        "Incentivar atividade física regular",
        "Aferir pressão arterial conforme protocolo",
        "Encaminhar para consulta médica se PA > 140x90 mmHg"
      ],
      alertas: ["Verificar sinais de cefaleia, tontura ou mal-estar"],
      materiais: ["Esfigmomanômetro", "Estetoscópio", "Cartão de acompanhamento"]
    },
    diabetes: {
      orientacoes: [
        "Verificar adesão ao tratamento medicamentoso",
        "Orientar sobre alimentação adequada",
        "Observar cuidados com os pés",
        "Verificar glicemia capilar se necessário",
        "Encaminhar para nutricionista se disponível"
      ],
      alertas: ["Atenção para sinais de hipoglicemia ou hiperglicemia"],
      materiais: ["Glicosímetro", "Fitas para glicemia", "Material educativo"]
    },
    gestante: {
      orientacoes: [
        "Verificar cartão pré-natal atualizado",
        "Orientar sobre sinais de alerta na gravidez",
        "Incentivar acompanhamento nutricional",
        "Verificar vacinação em dia",
        "Orientar sobre aleitamento materno"
      ],
      alertas: ["Observar sinais de pré-eclâmpsia", "Verificar movimentação fetal"],
      materiais: ["Fita métrica", "Balança", "Material educativo gestação"]
    },
    idoso: {
      orientacoes: [
        "Avaliar risco de quedas no domicílio",
        "Verificar adesão aos medicamentos",
        "Observar sinais de depressão ou isolamento",
        "Incentivar atividades sociais",
        "Orientar sobre vacinação específica"
      ],
      alertas: ["Atenção para sinais de maus-tratos", "Verificar alimentação adequada"],
      materiais: ["Escala de depressão geriátrica", "Lista de medicamentos"]
    }
  },
  
  situacoesComuns: {
    "paciente ausente": {
      acoes: [
        "Deixar bilhete informativo",
        "Reagendar visita",
        "Contatar por telefone se disponível",
        "Informar vizinhos sobre retorno"
      ]
    },
    "recusa de atendimento": {
      acoes: [
        "Respeitar a decisão do paciente",
        "Explicar benefícios do acompanhamento",
        "Deixar material informativo",
        "Registrar a recusa no sistema"
      ]
    },
    "emergência identificada": {
      acoes: [
        "Acionar SAMU se necessário (192)",
        "Contactar equipe médica",
        "Permanecer com o paciente",
        "Registrar detalhadamente a ocorrência"
      ]
    }
  },

  medicamentosComuns: {
    "Losartana": "Anti-hipertensivo. Orientar sobre horário regular e não suspender sem orientação médica.",
    "Metformina": "Antidiabético. Tomar com alimentação para evitar desconforto gástrico.",
    "AAS": "Antiagregante plaquetário. Observar sinais de sangramento.",
    "Enalapril": "Anti-hipertensivo. Pode causar tosse seca em alguns pacientes.",
    "Glibenclamida": "Antidiabético. Risco de hipoglicemia - orientar sobre sinais."
  },

  sinaisAlerta: {
    cardiovascular: ["Dor no peito", "Falta de ar", "Inchaço nas pernas", "Tontura"],
    diabetes: ["Sede excessiva", "Visão turva", "Feridas que não cicatrizam"],
    pressao: ["Dor de cabeça intensa", "Visão embaçada", "Zumbido no ouvido"],
    geral: ["Febre alta", "Vômitos persistentes", "Dor abdominal intensa"]
  }
};

export default function AssistenteACS(props: AssistenteACSProps = {}) {
  const isControlled = typeof props.open === 'boolean' && typeof props.onOpenChange === 'function';
  const [open, setOpen] = useState(isControlled ? !!props.open : false);
  const [fullScreen, setFullScreen] = useState(false);
  const [mensagens, setMensagens] = useState<MensagemIA[]>([]);
  const [inputMensagem, setInputMensagem] = useState('');
  const [contextoAtual, setContextoAtual] = useState<ContextoACS>({});
  const [carregando, setCarregando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isControlled) setOpen(!!props.open);
  }, [props.open, isControlled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  // Inicialização do assistente com dados reais
  useEffect(() => {
    if (open && mensagens.length === 0) {
      const dadosTerritorioCompletos = analisarDadosTerritorioLocal();
      
      const mensagemInicial: MensagemIA = {
        id: 'inicial',
        tipo: 'assistant',
        conteudo: `🏥 **Assistente ACS Inteligente - Dados do Território**

Olá! Sou seu assistente especializado integrado com os dados reais do seu território.

**📊 SITUAÇÃO ATUAL DO TERRITÓRIO:**
• 👥 **${dadosTerritorioCompletos.totalPacientes} pacientes** cadastrados
• 🏠 **${dadosTerritorioCompletos.visitasHoje} visitas** realizadas hoje
• �️ **${dadosTerritorioCompletos.ruasCadastradas} ruas** no território
• ⚠️ **${dadosTerritorioCompletos.pacientesRisco.length} pacientes** de risco identificados

**💊 CONDIÇÕES MAIS FREQUENTES:**
${Object.entries(dadosTerritorioCompletos.condicoesFrequentes)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 3)
  .map(([condicao, qtd]) => `• ${condicao}: ${qtd} casos`)
  .join('\n') || '• Nenhuma condição registrada ainda'}

**Como posso ajudar:**
• � **"Relatório do território"** - Análise completa dos dados
• � **"Buscar paciente [nome]"** - Informações específicas
• 🚨 **"Pacientes prioritários"** - Lista de casos urgentes
• 💊 **"Medicamentos mais usados"** - Análise farmacológica
• 📋 **Protocolos e orientações** especializadas

**Exemplos:**
- "Relatório completo do território"
- "Buscar paciente Maria Silva"
- "Pacientes diabéticos na rua X"
- "Protocolo para hipertensão"

Digite sua consulta!`,
        timestamp: new Date(),
        categoria: 'orientacao'
      };
      setMensagens([mensagemInicial]);
      
      // Atualizar contexto
      const { pacientes, visitas, ruas } = carregarDadosMockados();
      setContextoAtual({
        ...contextoAtual,
        cadastrosPacientes: pacientes,
        visitasRealizadas: visitas,
        ruasTerritorioAbrangencia: ruas
      });
    }
  }, [open, mensagens.length]);

  function handleOpenChange(isOpen: boolean) {
    if (isControlled) {
      props.onOpenChange?.(isOpen);
    } else {
      setOpen(isOpen);
    }
  }

  // IA especializada para processar perguntas do ACS
  function processarPerguntaACS(pergunta: string): MensagemIA {
    const q = pergunta.toLowerCase();
    const { pacientes, visitas, ruas } = carregarDadosMockados();
    let resposta = '';
    let categoria: MensagemIA['categoria'] = 'consulta';
    let prioridade: MensagemIA['prioridade'] = 'media';

    // Consultas sobre dados do território
    if (q.includes('relatorio') || q.includes('relatório') || q.includes('dados do territorio')) {
      categoria = 'orientacao';
      const stats = analisarDadosTerritorioLocal();
      resposta = `📊 **RELATÓRIO COMPLETO DO TERRITÓRIO**

**📈 ESTATÍSTICAS GERAIS:**
• 👥 Total de pacientes: **${stats.totalPacientes}**
• 🏠 Visitas hoje: **${stats.visitasHoje}**
• 🛣️ Ruas cadastradas: **${stats.ruasCadastradas}**
• ⚠️ Pacientes de risco: **${stats.pacientesRisco.length}**

**💊 TOP 5 CONDIÇÕES MAIS FREQUENTES:**
${Object.entries(stats.condicoesFrequentes)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([condicao, qtd], idx) => `${idx + 1}. **${condicao}**: ${qtd} casos`)
  .join('\n') || 'Nenhuma condição registrada'}

**💊 MEDICAMENTOS MAIS PRESCRITOS:**
${Object.entries(stats.medicamentosComuns)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([med, qtd], idx) => `${idx + 1}. **${med}**: ${qtd} pacientes`)
  .join('\n') || 'Nenhum medicamento registrado'}

**🎯 PRÓXIMAS AÇÕES RECOMENDADAS:**
• Focar em pacientes com hipertensão e diabetes
• Reforçar orientações sobre adesão medicamentosa
• Intensificar visitas aos pacientes de risco identificados`;
    }

    // Busca por paciente específico
    else if (q.includes('buscar paciente') || q.includes('paciente ')) {
      categoria = 'consulta';
      const nomeSearch = q.replace(/buscar paciente|paciente/, '').trim();
      const pacienteEncontrado = pacientes.find(p => 
        p.nome?.toLowerCase().includes(nomeSearch) ||
        p.nomeCompleto?.toLowerCase().includes(nomeSearch)
      );

      if (pacienteEncontrado && nomeSearch.length > 2) {
        prioridade = 'alta';
        resposta = `👤 **INFORMAÇÕES DO PACIENTE ENCONTRADO**

**📋 DADOS PESSOAIS:**
• **Nome**: ${pacienteEncontrado.nome || pacienteEncontrado.nomeCompleto || 'Não informado'}
• **Idade**: ${pacienteEncontrado.idade || 'Não informada'}
• **Endereço**: ${pacienteEncontrado.endereco || 'Não informado'}
• **Telefone**: ${pacienteEncontrado.telefone || 'Não informado'}

**🏥 CONDIÇÕES DE SAÚDE:**
${pacienteEncontrado.condicoes ? `• ${pacienteEncontrado.condicoes}` : '• Nenhuma condição registrada'}

**💊 MEDICAMENTOS EM USO:**
${pacienteEncontrado.medicamentos ? `• ${pacienteEncontrado.medicamentos}` : '• Nenhum medicamento registrado'}

**📅 ÚLTIMA VISITA:**
${pacienteEncontrado.ultimaVisita || 'Não registrada'}

**🚨 ALERTAS:**
${pacienteEncontrado.idade > 65 ? '• Paciente idoso - atenção especial' : ''}
${pacienteEncontrado.condicoes?.includes('diabetes') ? '• Diabético - verificar glicemia' : ''}
${pacienteEncontrado.condicoes?.includes('hipertensao') ? '• Hipertenso - aferir pressão' : ''}`;
      } else {
        resposta = `🔍 **BUSCA DE PACIENTE**

Não encontrei paciente com esse nome. 

**Pacientes cadastrados disponíveis:**
${pacientes.slice(0, 10).map(p => `• ${p.nome || p.nomeCompleto || 'Nome não informado'}`).join('\n')}

${pacientes.length > 10 ? `\n... e mais ${pacientes.length - 10} pacientes.` : ''}

💡 **Dica**: Digite "buscar paciente [nome completo]" para uma busca mais precisa.`;
      }
    }

    // Pacientes prioritários/de risco
    else if (q.includes('prioritarios') || q.includes('prioritários') || q.includes('risco') || q.includes('urgente')) {
      categoria = 'alerta';
      prioridade = 'alta';
      const stats = analisarDadosTerritorioLocal();
      resposta = `🚨 **PACIENTES PRIORITÁRIOS - ATENÇÃO ESPECIAL**

**📊 RESUMO:**
• **${stats.pacientesRisco.length} pacientes** identificados como prioritários

**👥 LISTA DE PACIENTES DE RISCO:**
${stats.pacientesRisco.slice(0, 10).map((p, idx) => {
  let motivos = [];
  if (p.idade > 65) motivos.push('Idoso');
  if (p.condicoes?.includes('diabetes')) motivos.push('Diabético');
  if (p.condicoes?.includes('hipertensao')) motivos.push('Hipertenso');
  if (p.gestante) motivos.push('Gestante');
  
  return `${idx + 1}. **${p.nome || 'Nome não informado'}** (${p.idade || '?'} anos)
   📍 ${p.endereco || 'Endereço não informado'}
   ⚠️ Motivos: ${motivos.join(', ') || 'Avaliação necessária'}`;
}).join('\n\n')}

${stats.pacientesRisco.length > 10 ? `\n... e mais ${stats.pacientesRisco.length - 10} pacientes prioritários.` : ''}

**📋 AÇÕES RECOMENDADAS:**
• Priorizar visitas domiciliares
• Verificar adesão ao tratamento
• Aferir sinais vitais
• Avaliar necessidade de encaminhamento médico`;
    }

    // Medicamentos mais usados
    else if (q.includes('medicamentos') && (q.includes('mais') || q.includes('comuns') || q.includes('usados'))) {
      categoria = 'orientacao';
      const stats = analisarDadosTerritorioLocal();
      resposta = `💊 **ANÁLISE FARMACOLÓGICA DO TERRITÓRIO**

**📈 MEDICAMENTOS MAIS PRESCRITOS:**
${Object.entries(stats.medicamentosComuns)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 8)
  .map(([med, qtd], idx) => {
    const orientacao = baseConhecimentoACS.medicamentosComuns[med] || 'Verificar orientações médicas específicas.';
    return `${idx + 1}. **${med}** (${qtd} pacientes)
   💡 ${orientacao}`;
  }).join('\n\n') || 'Nenhum medicamento registrado no sistema'}

**⚠️ PONTOS DE ATENÇÃO:**
• Verificar adesão ao tratamento em todas as visitas
• Observar possíveis efeitos adversos
• Orientar sobre horários e forma de administração
• Nunca recomendar suspensão sem orientação médica

**📋 PRÓXIMAS AÇÕES:**
• Revisar medicamentos dos pacientes prioritários
• Verificar armazenamento adequado nos domicílios
• Orientar sobre importância da continuidade do tratamento`;
    }

    // Detecção de emergências
    if (q.includes('emergencia') || q.includes('urgente') || q.includes('samu') || 
        q.includes('desmaio') || q.includes('convulsao') || q.includes('infarto')) {
      prioridade = 'critica';
      categoria = 'alerta';
      resposta = `🚨 **SITUAÇÃO DE EMERGÊNCIA DETECTADA**

**AÇÕES IMEDIATAS:**
1. 🆘 **Ligue 192 (SAMU)** se há risco de vida
2. 🏥 **Contacte a equipe médica** da unidade
3. 👥 **Permaneça com o paciente** até chegada do socorro
4. 📝 **Registre todos os detalhes** da ocorrência

**NÃO deixe o paciente sozinho em situações graves!**

Se precisar de orientações específicas, descreva os sintomas observados.`;
    }
    
    // Protocolos específicos por condição
    else if (q.includes('hipertens') || q.includes('pressão alta') || q.includes('pressao alta')) {
      categoria = 'protocolo';
      const protocolo = baseConhecimentoACS.protocolos.hipertensao;
      resposta = `🩺 **PROTOCOLO: HIPERTENSÃO ARTERIAL**

**ORIENTAÇÕES PRINCIPAIS:**
${protocolo.orientacoes.map(o => `• ${o}`).join('\n')}

**⚠️ SINAIS DE ALERTA:**
${protocolo.alertas.map(a => `• ${a}`).join('\n')}

**📋 MATERIAIS NECESSÁRIOS:**
${protocolo.materiais.map(m => `• ${m}`).join('\n')}

**VALORES DE REFERÊNCIA:**
• Normal: < 120x80 mmHg
• Limítrofe: 121-139 x 81-89 mmHg  
• Hipertensão: ≥ 140x90 mmHg

💡 **Dica:** Sempre aferir a PA em ambiente calmo, após 5 min de repouso.`;
    }

    else if (q.includes('diabetes') || q.includes('diabetic') || q.includes('glicemia')) {
      categoria = 'protocolo';
      const protocolo = baseConhecimentoACS.protocolos.diabetes;
      resposta = `💉 **PROTOCOLO: DIABETES MELLITUS**

**ORIENTAÇÕES PRINCIPAIS:**
${protocolo.orientacoes.map(o => `• ${o}`).join('\n')}

**⚠️ SINAIS DE ALERTA:**
${protocolo.alertas.map(a => `• ${a}`).join('\n')}

**📋 MATERIAIS NECESSÁRIOS:**
${protocolo.materiais.map(m => `• ${m}`).join('\n')}

**VALORES DE REFERÊNCIA:**
• Jejum: 70-99 mg/dL (normal)
• Pós-prandial: < 140 mg/dL (normal)
• HbA1c: < 7% (meta para diabéticos)

🍎 **Dica:** Orientar sobre "prato do diabético" - 1/2 verduras, 1/4 proteína, 1/4 carboidrato.`;
    }

    else if (q.includes('gestante') || q.includes('gravida') || q.includes('pre-natal')) {
      categoria = 'protocolo';
      const protocolo = baseConhecimentoACS.protocolos.gestante;
      prioridade = 'alta';
      resposta = `🤱 **PROTOCOLO: GESTANTE**

**ORIENTAÇÕES PRINCIPAIS:**
${protocolo.orientacoes.map(o => `• ${o}`).join('\n')}

**🚨 SINAIS DE ALERTA:**
${protocolo.alertas.map(a => `• ${a}`).join('\n')}

**📋 MATERIAIS NECESSÁRIOS:**
${protocolo.materiais.map(m => `• ${m}`).join('\n')}

**CONSULTAS PRÉ-NATAL:**
• Mínimo 6 consultas
• 1ª consulta: até 12 semanas
• Exames: conforme protocolo

⚠️ **ALERTA:** Qualquer sangramento, dor abdominal intensa ou ausência de movimentos fetais requer avaliação médica IMEDIATA.`;
    }

    else if (q.includes('idoso') || q.includes('terceira idade') || q.includes('quedas')) {
      categoria = 'protocolo';
      const protocolo = baseConhecimentoACS.protocolos.idoso;
      resposta = `👴 **PROTOCOLO: PESSOA IDOSA**

**ORIENTAÇÕES PRINCIPAIS:**
${protocolo.orientacoes.map(o => `• ${o}`).join('\n')}

**⚠️ SINAIS DE ALERTA:**
${protocolo.alertas.map(a => `• ${a}`).join('\n')}

**📋 MATERIAIS NECESSÁRIOS:**
${protocolo.materiais.map(m => `• ${m}`).join('\n')}

**PREVENÇÃO DE QUEDAS:**
• Retirar tapetes soltos
• Instalar barras de apoio
• Melhorar iluminação
• Revisar medicamentos

🏠 **Dica:** Fazer "tour" pela casa identificando riscos de queda durante a visita.`;
    }

    // Medicamentos
    else if (q.includes('medicamento') || q.includes('remedio') || q.includes('losartana') || 
             q.includes('metformina') || q.includes('enalapril')) {
      categoria = 'orientacao';
      resposta = `💊 **ORIENTAÇÕES SOBRE MEDICAMENTOS**

**MEDICAMENTOS MAIS COMUNS NO TERRITÓRIO:**\n\n`;
      
      Object.entries(baseConhecimentoACS.medicamentosComuns).forEach(([med, desc]) => {
        if (q.includes(med.toLowerCase())) {
          resposta += `🔹 **${med}**: ${desc}\n\n`;
        }
      });

      if (resposta.length < 100) {
        resposta += Object.entries(baseConhecimentoACS.medicamentosComuns)
          .map(([med, desc]) => `🔹 **${med}**: ${desc}`)
          .join('\n\n');
      }

      resposta += `\n\n**⚠️ ORIENTAÇÕES GERAIS:**
• Nunca suspender medicação sem orientação médica
• Observar horários regulares de administração  
• Verificar adesão ao tratamento
• Identificar efeitos adversos
• Orientar sobre armazenamento adequado

💡 **Dica:** Sempre perguntar se o paciente entende para que serve cada medicamento.`;
    }

    // Situações práticas
    else if (q.includes('ausente') || q.includes('nao encontrei') || q.includes('não encontrei')) {
      categoria = 'orientacao';
      const situacao = baseConhecimentoACS.situacoesComuns["paciente ausente"];
      resposta = `🏠 **PACIENTE AUSENTE - O QUE FAZER?**

**AÇÕES RECOMENDADAS:**
${situacao.acoes.map(a => `• ${a}`).join('\n')}

**MODELO DE BILHETE:**
"Olá! Sou [seu nome], ACS da equipe [X]. Passei hoje [data/hora] para visitá-lo(a). Retornarei em [data]. Qualquer necessidade, procure a UBS [nome] ou ligue [telefone]."

📝 **IMPORTANTE:** Sempre registrar a tentativa de visita no sistema, mesmo quando o paciente não está presente.`;
    }

    else if (q.includes('recusa') || q.includes('não quer') || q.includes('nao quer')) {
      categoria = 'orientacao';
      const situacao = baseConhecimentoACS.situacoesComuns["recusa de atendimento"];
      resposta = `❌ **RECUSA DE ATENDIMENTO**

**AÇÕES RECOMENDADAS:**
${situacao.acoes.map(a => `• ${a}`).join('\n')}

**ABORDAGEM SUGERIDA:**
"Entendo sua decisão. Estou aqui para ajudar quando precisar. Vou deixar este material com informações importantes. A equipe de saúde está sempre disponível na UBS."

⚖️ **LEMBRE-SE:** O paciente tem direito de recusar o atendimento. Respeite essa decisão, mas mantenha a porta aberta para futuras abordagens.`;
    }

    // Sinais de alerta
    else if (q.includes('sinais de alerta') || q.includes('sintomas') || q.includes('quando encaminhar')) {
      categoria = 'alerta';
      prioridade = 'alta';
      resposta = `🚨 **PRINCIPAIS SINAIS DE ALERTA**

**CARDIOVASCULAR:**
${baseConhecimentoACS.sinaisAlerta.cardiovascular.map(s => `🔸 ${s}`).join('\n')}

**DIABETES:**
${baseConhecimentoACS.sinaisAlerta.diabetes.map(s => `🔸 ${s}`).join('\n')}

**PRESSÃO ARTERIAL:**
${baseConhecimentoACS.sinaisAlerta.pressao.map(s => `🔸 ${s}`).join('\n')}

**SINTOMAS GERAIS:**
${baseConhecimentoACS.sinaisAlerta.geral.map(s => `🔸 ${s}`).join('\n')}

⚡ **REGRA DE OURO:** Na dúvida, sempre encaminhe para avaliação médica. É melhor uma consulta desnecessária do que perder um caso grave.`;
    }

    // Resposta padrão para perguntas não específicas
    else {
      resposta = `🤔 **Preciso de mais informações para ajudar melhor!**

**Você pode ser mais específico sobre:**
• 🏥 Qual condição de saúde? (hipertensão, diabetes, etc.)
• 👤 Que tipo de paciente? (gestante, idoso, criança)
• 🎯 Qual situação encontrou? (recusa, ausente, emergência)
• 💊 Que medicamento especificamente?

**Ou tente estas perguntas:**
• "Como proceder com diabético descompensado?"
• "Sinais de alerta em hipertensão"
• "O que fazer se gestante com sangramento?"
• "Protocolo para visita domiciliar"

Estou aqui para dar orientações específicas para sua situação!`;
    }

    return {
      id: Date.now().toString(),
      tipo: 'assistant',
      conteudo: resposta,
      timestamp: new Date(),
      categoria,
      prioridade
    };
  }

  function enviarMensagem() {
    if (!inputMensagem.trim()) return;

    // Adicionar mensagem do usuário
    const mensagemUser: MensagemIA = {
      id: Date.now().toString(),
      tipo: 'user',
      conteudo: inputMensagem,
      timestamp: new Date()
    };

    setMensagens(prev => [...prev, mensagemUser]);
    setCarregando(true);

    // Simular processamento da IA
    setTimeout(() => {
      const respostaIA = processarPerguntaACS(inputMensagem);
      setMensagens(prev => [...prev, respostaIA]);
      setCarregando(false);
    }, 800);

    setInputMensagem('');
  }

  function getPrioridadeCor(prioridade?: string) {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 border-red-500 text-red-800';
      case 'alta': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'media': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'baixa': return 'bg-gray-100 border-gray-500 text-gray-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  }

  function getCategoriaIcon(categoria?: string) {
    switch (categoria) {
      case 'protocolo': return <Stethoscope className="w-4 h-4" />;
      case 'alerta': return <AlertTriangle className="w-4 h-4" />;
      case 'orientacao': return <Lightbulb className="w-4 h-4" />;
      case 'consulta': return <Brain className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={
          fullScreen
            ? 'z-50 p-0 bg-white flex flex-col rounded-none shadow-none'
            : 'max-w-4xl w-full mx-auto p-0 rounded-lg shadow-2xl bg-white flex flex-col'
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
                marginTop: '32px',
                marginBottom: '32px',
                marginLeft: 'auto',
                marginRight: 'auto',
                height: '90vh'
              }
        }
        aria-describedby="assistente-dialog-description"
      >
        <DialogTitle asChild>
          <span style={{position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0}}>
            Assistente ACS Inteligente
          </span>
        </DialogTitle>
        <DialogDescription asChild id="assistente-dialog-description">
          <span style={{position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0}}>
            Assistente especializado para Agentes Comunitários de Saúde com protocolos, orientações e suporte inteligente.
          </span>
        </DialogDescription>

        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Assistente ACS</h2>
              <p className="text-sm opacity-90">Especializado para Agentes Comunitários</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Status/Contexto atual */}
        {contextoAtual.visitaAtual && (
          <div className="px-4 py-2 bg-blue-50 border-b">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Contexto atual:</span>
              <span>{contextoAtual.localAtual}</span>
              {contextoAtual.pacienteAtual && (
                <>
                  <User className="w-4 h-4 text-blue-600 ml-2" />
                  <span>{contextoAtual.pacienteAtual}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 240px)' }}>
          {mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`flex ${mensagem.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  mensagem.tipo === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 border-l-4'
                } ${mensagem.prioridade ? getPrioridadeCor(mensagem.prioridade) : ''}`}
              >
                {mensagem.tipo === 'assistant' && mensagem.categoria && (
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoriaIcon(mensagem.categoria)}
                    <Badge variant="outline" className="text-xs">
                      {mensagem.categoria?.toUpperCase()}
                    </Badge>
                    {mensagem.prioridade && mensagem.prioridade !== 'media' && (
                      <Badge variant={mensagem.prioridade === 'critica' ? 'destructive' : 'default'} className="text-xs">
                        {mensagem.prioridade?.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</div>
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span className="text-sm text-gray-600">Processando...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <Separator />

        {/* Sugestões rápidas */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {[
              "Relatório do território",
              "Pacientes prioritários", 
              "Medicamentos mais usados",
              "Protocolo hipertensão",
              "Buscar paciente Maria",
              "Sinais alerta diabetes"
            ].map((sugestao) => (
              <Button
                key={sugestao}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => setInputMensagem(sugestao)}
              >
                {sugestao}
              </Button>
            ))}
          </div>
        </div>

        {/* Input de mensagem */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputMensagem}
              onChange={(e) => setInputMensagem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
              placeholder="Digite sua dúvida ou situação encontrada no território..."
              disabled={carregando}
            />
            <Button 
              onClick={enviarMensagem}
              disabled={!inputMensagem.trim() || carregando}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Seja específico sobre a situação para receber orientações mais precisas
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
