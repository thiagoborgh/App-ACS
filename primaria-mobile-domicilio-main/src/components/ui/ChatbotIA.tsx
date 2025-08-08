// --- DEBUG: Forçar permissão de visitas ativa para teste ---
try {
  const permissoes = JSON.parse(localStorage.getItem('permissoesUsuario') || '{}');
  if (!permissoes.visitas) {
    permissoes.visitas = true;
    localStorage.setItem('permissoesUsuario', JSON.stringify(permissoes));
  }
} catch {}
  // Processa mensagem fora do fluxo guiado, simulando o envio e resposta do bot
  function processarMensagem(msg: string) {
  console.log('[DEBUG] processarMensagem chamada com:', msg);
  setConversations((convs) => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      // Se for a primeira mensagem do usuário, define o título com as duas primeiras palavras
      if (!Array.isArray(conv.messages)) conv.messages = [];
      if (!conv.messages.some(m => m.from === 'user')) {
        const palavras = msg.trim().split(/\s+/).slice(0, 2);
        const titulo = palavras.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        conv.title = titulo;
      }
      conv.messages = [...conv.messages, { from: 'user', text: msg }];
      convsCopy[activeIdx] = conv;
      persistConversations(convsCopy);
      return convsCopy;
    });
    const resposta = handleBotResponse(msg);
    setTimeout(() => {
      setConversations((convs) => {
        const convsCopy = [...convs];
        const conv = { ...convsCopy[activeIdx] };
        if (!Array.isArray(conv.messages)) conv.messages = [];
        conv.messages = [...conv.messages, { from: 'bot', text: resposta }];
        convsCopy[activeIdx] = conv;
        persistConversations(convsCopy);
        return convsCopy;
      });
    }, 800);
  }
  // Função para gerar relatório anônimo
  function gerarRelatorioAnonimo() {
    const cadastros = JSON.parse(localStorage.getItem('cadastrosCidadao') || '[]');
    const ruas = JSON.parse(localStorage.getItem('cadastrosRua') || '[]');
    // Remove dados sensíveis
    const cadastrosAnon = cadastros.map((c: any) => ({
      sexo: c.sexo,
      dataNascimento: c.dataNascimento,
      endereco: c.endereco,
      data: c.data
    }));
    const ruasAnon = ruas.map((r: any) => ({
      nomeRua: r.nomeRua,
      bairro: r.bairro,
      tipoLogradouro: r.tipoLogradouro,
      data: r.data
    }));
    return {
      totalCidadaos: cadastros.length,
      totalRuas: ruas.length,
      cidadaos: cadastrosAnon,
      ruas: ruasAnon
    };
  }
import { useState } from 'react';
import Fuse from 'fuse.js';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import AssistenteACS from './AssistenteACS';

// Utilitário para gerar IDs únicos
function uuid() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
// Função mock para simular envio seguro via API (TLS 1.3)
async function enviarBufferSincronizacao(buffer) {
  // Aqui seria feita uma chamada real via fetch/axios com HTTPS
  // Exemplo: await fetch('https://api.seguranca.com/sync', { method: 'POST', body: JSON.stringify(buffer), headers: { Authorization: 'Bearer ...' } })
  return new Promise(resolve => setTimeout(() => resolve('ok'), 1000));
}

// Intents e fuzzy instance devem ser declarados fora do componente para garantir inicialização
const intents = [
  { intent: 'nome', keywords: ['nome', 'nom', 'nome completo', 'responsavel', 'responsável', 'nom do responsavel', 'kual é o nom', 'nome do responsável familiar'] },
  { intent: 'cpf', keywords: ['cpf', 'cp', 'documento', 'cpf do paciente', 'cp do paciente'] },
  { intent: 'cns', keywords: ['cns', 'cartao sus', 'cartão sus', 'cns do paciente'] },
  { intent: 'data_nascimento', keywords: ['data nascimento', 'nascimento', 'dn', 'data de nascimento', 'data nasc', 'nasc'] },
  { intent: 'gestante', keywords: ['gestante', 'gravidez', 'grávida', 'gravid', 'gestacao', 'gesta'] },
  { intent: 'hipertensao', keywords: ['hipertensão', 'hipertensao', 'hpertensão', 'hpertensao', 'pressão alta', 'pressao alta'] },
  { intent: 'diabetes', keywords: ['diabetes', 'diabete', 'diabetico', 'diabético', 'diabete paciente'] },
  { intent: 'rua', keywords: ['situação de rua', 'tempo rua', 'morador de rua', 'tempo em situação de rua', 'rua', 'tempo rua'] },
  { intent: 'familia', keywords: ['família', 'familia', 'responsável', 'responsavel', 'responsavel familiar'] },
  { intent: 'condicoes', keywords: ['condição', 'condições', 'saúde', 'saude', 'condição de saúde', 'condições de saúde'] },
  { intent: 'recusa', keywords: ['recusa', 'recusou', 'recusado', 'recusa de cadastro'] },
  { intent: 'alerta', keywords: ['alerta', 'alertas', 'inconsistência', 'inconsistencia'] },
  { intent: 'membro', keywords: ['membro', 'membros', 'membros da familia', 'membro da familia'] },
  { intent: 'atualizacao', keywords: ['atualização', 'atualizacao', 'última visita', 'ultima visita', 'atualiza', 'atualizacoes'] },
  // Intenções abertas
  { intent: 'ajuda', keywords: ['ajuda', 'precisa de ajuda', 'quem precisa de ajuda', 'ajuda urgente', 'quem está em risco', 'quem esta em risco', 'risco', 'em risco'] },
  { intent: 'doente', keywords: ['doente', 'doentes', 'me diga sobre os doentes', 'problemas de saúde', 'problemas de saude', 'problema de saúde', 'problema de saude', 'doença', 'doencas', 'doenças'] },
];
const fuseInstance = new Fuse(intents, { keys: ['keywords'], threshold: 0.35 });

// Estrutura de dados local (mock global)
// Usuário logado
const usuario = { id: '001', tipo: 'MEDICO', nome: 'Dr. João' }; // ou 'ENFERMEIRO', 'ACS', 'ADMIN'
const userProfile = usuario.tipo;
const userId = usuario.id;

// Atendimentos locais (persistem na sessão)
let atendimentos = [
  {
    id: 'a1',
    paciente: 'João Silva',
    data: '01/07/2025',
    condicoes: ['Hipertensão'],
    profissionalTipo: 'MEDICO',
    profissionalId: '001',
    profissionalNome: 'Dr. João',
    alerta: 'Data inconsistente',
  },
  {
    id: 'a2',
    paciente: 'Maria Souza',
    data: '02/07/2025',
    condicoes: ['Diabetes'],
    profissionalTipo: 'ENFERMEIRO',
    profissionalId: '002',
    profissionalNome: 'Enf. Ana',
    alerta: '',
  },
  {
    id: 'a3',
    paciente: 'Pedro Lima',
    data: '28/07/2025',
    condicoes: ['Gestante'],
    profissionalTipo: 'MEDICO',
    profissionalId: '001',
    profissionalNome: 'Dr. João',
    alerta: '',
  },
];

// Tarefas locais (persistem na sessão)
let tarefas = [
  // { paciente: 'João Silva', data: '29/07/2025', profissionalId: '001', concluido: false }
];

// Buffer de sincronização local (persistente)
let bufferSincronizacao = JSON.parse(localStorage.getItem('bufferSincronizacao') || 'null') || {
  relatorios: [],
  tendencias: [],
  alertas: [],
  ultimaSincronizacao: null,
};
import React from 'react';

type ChatbotIAProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ChatbotIA(props: ChatbotIAProps = {}) {
  // Permite controle externo do modal
  const isControlled = typeof props.open === 'boolean' && typeof props.onOpenChange === 'function';
  const [open, setOpen] = React.useState(isControlled ? !!props.open : true);
  React.useEffect(() => {
    if (isControlled) setOpen(!!props.open);
  }, [props.open, isControlled]);

  function handleOpenChange(isOpen: boolean) {
    if (isControlled) {
      props.onOpenChange?.(isOpen);
    } else {
      setOpen(isOpen);
    }
    if (!isOpen) {
      if (fluxo && fluxo.conversaId && conversations[activeIdx]?.id === fluxo.conversaId) {
        adicionarMensagemBot('Cadastro cancelado.');
  // Auditoria de qualidade após visita
  auditarVisita(novaResposta, 'cidadao');
  setFluxo(null);
        setInput('');
      }
    }
  }
  // Envia mensagem com valor específico, ignorando o input atual
  function sendMessageWithValue(value: string) {
  console.log('[DEBUG] sendMessageWithValue chamada com:', value, 'fluxo:', fluxo);
  if (!value.trim()) return;
  // Se estiver em fluxo guiado de cadastro, só bloquear o fluxo guiado na conversa onde foi iniciado
  if (fluxo && activeIdx === 0) {
    if (/^(cancela|cancel|cancelar|anula|anular|limpa|limpar|sai|sair)$/i.test(value.trim())) {
      adicionarMensagemUser(value);
      adicionarMensagemBot(saudacao);
      setFluxo(null);
      setInput('');
      return;
    }
    if (fluxo.tipo === 'cidadao' || !fluxo.tipo) {
      const etapaAtual = etapasCidadao[fluxo.etapa];
      let erro = '';
      const val = value.trim();
      // Validações específicas por campo
      if (etapaAtual.key === 'nome') {
        if (!val || val.length < 3 || /\d/.test(val)) erro = 'Nome deve ter pelo menos 3 letras e não pode conter números.';
      }
      if (etapaAtual.key === 'cpf' && val) {
        // Validação de CPF
        function validarCPF(cpf: string) {
          cpf = cpf.replace(/\D/g, '');
          if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
          let soma = 0, resto;
          for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
          resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.substring(9, 10))) return false;
          soma = 0;
          for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
          resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.substring(10, 11))) return false;
          return true;
        }
        if (!validarCPF(val)) erro = 'CPF inválido.';
      }
      if (etapaAtual.key === 'dataNascimento') {
        // Aceita dd/mm/aaaa ou aaaa-mm-dd
        function validarData(dt: string) {
          let d, m, a;
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(dt)) {
            [d, m, a] = dt.split('/').map(Number);
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(dt)) {
            [a, m, d] = dt.split('-').map(Number);
          } else return false;
          const data = new Date(a, m-1, d);
          if (data.getFullYear() !== a || data.getMonth() !== m-1 || data.getDate() !== d) return false;
          if (data > new Date()) return false;
          return true;
        }
        if (!val || !validarData(val)) erro = 'Data de nascimento inválida ou futura. Use dd/mm/aaaa.';
      }
      if (etapaAtual.key === 'sexo') {
        if (!['masculino','feminino','outro','m','f','o'].includes(val.toLowerCase())) erro = 'Sexo deve ser Masculino, Feminino ou Outro.';
      }
      if (etapaAtual.key === 'nomeMae') {
        if (!val || val.length < 3) erro = 'Nome da mãe deve ter pelo menos 3 letras.';
      }
      if (etapaAtual.key === 'cns' && val) {
        // Validação CNS (15 dígitos e regra)
        function validarCNS(cns: string) {
          if (!/^[1-2]\d{10}00[0-1]\d{2}$/.test(cns) && !/^[7-9]\d{14}$/.test(cns)) return false;
          let soma = 0;
          for (let i = 0; i < 15; i++) soma += parseInt(cns[i]) * (15 - i);
          return soma % 11 === 0;
        }
        if (!validarCNS(val)) erro = 'CNS inválido.';
      }
      if (etapaAtual.key === 'endereco') {
        if (!val || val.length < 5) erro = 'Endereço deve ter pelo menos 5 caracteres.';
      }
      if (etapaAtual.obrigatorio && !val) erro = 'Este campo é obrigatório. ' + etapaAtual.pergunta;
      if (erro) {
        adicionarMensagemBot(erro);
        setInput('');
        return;
      }
      const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: val };
      if (fluxo.etapa < etapasCidadao.length - 1) {
        setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'cidadao' });
        adicionarMensagemUser(value);
        setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasCidadao.length}: ${etapasCidadao[fluxo.etapa + 1].pergunta}`), 400);
      } else {
        adicionarMensagemUser(value);
        adicionarMensagemBot('Cadastro de cidadão concluído! Dados salvos localmente.');
        salvarCadastroLocal(novaResposta);
  // Auditoria de qualidade após visita
  auditarVisita(novaResposta, 'familia');
  setFluxo(null);
      }
      setInput('');
      return;
    }
    if (fluxo.tipo === 'rua') {
      const etapaAtual = etapasRua[fluxo.etapa];
      let erro = '';
      const val = value.trim();
      // Validações específicas por campo
      if (etapaAtual.key === 'nomeRua') {
        if (!val || val.length < 3) erro = 'Nome da rua deve ter pelo menos 3 caracteres.';
      }
      if (etapaAtual.key === 'bairro') {
        if (!val || val.length < 3) erro = 'Bairro deve ter pelo menos 3 caracteres.';
      }
      if (etapaAtual.key === 'cep' && val) {
        if (!/^\d{5}-?\d{3}$/.test(val)) erro = 'CEP deve ter 8 dígitos (ex: 12345-678).';
      }
      if (etapaAtual.key === 'tipoLogradouro') {
        if (!val || val.length < 3) erro = 'Tipo de logradouro deve ter pelo menos 3 caracteres.';
      }
      if (etapaAtual.obrigatorio && !val) erro = 'Este campo é obrigatório. ' + etapaAtual.pergunta;
      if (erro) {
        adicionarMensagemBot(erro);
        setInput('');
        return;
      }
      const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: val };
      if (fluxo.etapa < etapasRua.length - 1) {
        setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'rua' });
        adicionarMensagemUser(value);
        setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasRua.length}: ${etapasRua[fluxo.etapa + 1].pergunta}`), 400);
      } else {
        adicionarMensagemUser(value);
        adicionarMensagemBot('Cadastro de rua concluído! Dados salvos localmente.');
        salvarRuaLocal(novaResposta);
  // Auditoria de qualidade após visita
  auditarVisita(novaResposta, 'imovel');
  setFluxo(null);
// Módulo de auditoria para monitoramento de qualidade
function auditarVisita(respostas: Record<string, string>, tipo: 'cidadao' | 'familia' | 'imovel') {
  let alertas: string[] = [];
  if (tipo === 'cidadao') {
    if (!respostas.motivo || respostas.motivo.length < 3) {
      alertas.push('Atenção: Visita concluída sem registro de motivo. Revisar preenchimento.');
    }
    if (!respostas.condicoesSaude || respostas.condicoesSaude.length < 3) {
      alertas.push('Atenção: Condições de saúde não registradas.');
    }
    if (respostas.gestante && respostas.gestante.toLowerCase() === 'sim' && (!respostas.acompanhamento || respostas.acompanhamento.length < 3)) {
      alertas.push('Atenção: Gestante sem acompanhamento registrado.');
    }
  }
  if (tipo === 'familia') {
    if (!respostas.motivo || respostas.motivo.length < 3) {
      alertas.push('Atenção: Visita à família sem motivo registrado.');
    }
    if (respostas.gestante && respostas.gestante.toLowerCase() === 'sim' && (!respostas.acompProfissional || respostas.acompProfissional.length < 3)) {
      alertas.push('Atenção: Gestante na família sem acompanhamento profissional registrado.');
    }
  }
  if (tipo === 'imovel') {
    if (!respostas.motivo || respostas.motivo.length < 3) {
      alertas.push('Atenção: Visita ao imóvel sem motivo registrado.');
    }
  }
  if (alertas.length > 0) {
    alertas.forEach(msg => adicionarMensagemBot(msg));
  }
}
      }
      setInput('');
      return;
    }
    // Checagem de permissão para visitas
    function permissoesAtivas() {
      try {
        return JSON.parse(localStorage.getItem('permissoesUsuario') || '{}');
      } catch { return {}; }
    }

    // Fluxo visita cidadão
    if (fluxo.tipo === 'visitaCidadao') {
      const permissoes = permissoesAtivas();
      if (!permissoes.visitas) {
        adicionarMensagemBot('Você não tem permissão para registrar visitas. Ative a permissão em seu perfil.');
        setFluxo(null);
        setInput('');
        return;
      }
      const etapaAtual = etapasVisitaCidadao[fluxo.etapa];
      let erro = '';
      const val = value.trim();
      if (etapaAtual.key === 'cidadao') {
        if (!val || val.length < 3) erro = 'Selecione ou informe o nome do cidadão corretamente.';
      }
      if (etapaAtual.key === 'visitaRealizada') {
        if (!['sim','não','nao','s','n'].includes(val.toLowerCase())) erro = 'Responda "Sim" ou "Não".';
      }
      if (etapaAtual.key === 'motivo') {
        if (!val || val.length < 3) erro = 'Informe o motivo da visita.';
      }
      if (etapaAtual.key === 'concluir') {
        if (!['sim','s'].includes(val.toLowerCase())) erro = 'Digite "Sim" para concluir a visita.';
      }
      if (etapaAtual.obrigatorio && !val) erro = 'Este campo é obrigatório. ' + etapaAtual.pergunta;
      if (erro) {
        adicionarMensagemBot(erro);
        setInput('');
        return;
      }
      const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: val };
      if (fluxo.etapa < etapasVisitaCidadao.length - 1) {
        setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'visitaCidadao' });
        adicionarMensagemUser(value);
        setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasVisitaCidadao.length}: ${etapasVisitaCidadao[fluxo.etapa + 1].pergunta}`), 400);
      } else {
        adicionarMensagemUser(value);
  adicionarMensagemBot('Visita ao cidadão concluída! Dados salvos localmente.');
  salvarVisitaLocal(novaResposta, 'cidadao');
  // Geração de resumo clínico conciso
  const resumo = gerarResumoClinico(novaResposta, 'cidadao');
  adicionarMensagemBot(resumo);
  const sugestao = gerarSugestoesTerapia(novaResposta);
  if (sugestao) {
    adicionarMensagemBot(sugestao);
    exibirFeedback('sugestao', sugestao);
  }

// Sugestão de planos terapêuticos, exames e medicamentos baseada em condições de saúde
function gerarSugestoesTerapia(respostas: Record<string, string>) {
  const condicoes = (respostas.condicoesSaude || '').toLowerCase();
  let sugestoes = [];
  if (condicoes.includes('diabetes')) {
    sugestoes.push('Condição: Diabetes detectada. Sugestão: monitoramento glicêmico, orientação alimentar, encaminhamento ao enfermeiro. Avaliar solicitação de exame de glicemia.');
  }
  if (condicoes.includes('hipertens')) {
    sugestoes.push('Condição: Hipertensão detectada. Sugestão: aferição regular da pressão arterial, orientação sobre uso de medicação, encaminhamento ao enfermeiro.');
  }
  // Outras condições podem ser adicionadas aqui
  if (sugestoes.length > 0) {
    return sugestoes.join('\n');
  }
  return '';
}

// Função utilitária para gerar resumo clínico conciso após visita/cadastro
function gerarResumoClinico(respostas: Record<string, string>, tipo: 'cidadao' | 'familia' | 'imovel') {
  if (tipo === 'cidadao') {
    return `Resumo: Visita a ${respostas.cidadao || 'cidadão'}, motivo: ${respostas.motivo || 'não informado'}, condições de saúde: ${respostas.condicoesSaude || 'não registradas'}, antropometria: ${respostas.antropometria || 'não registrada'}.`;
  }
  if (tipo === 'familia') {
    return `Resumo: Visita à família ${respostas.familia || ''}, motivo: ${respostas.motivo || 'não informado'}, controle ambiental: ${respostas.controleAmbiental || 'não registrado'}.`;
  }
  if (tipo === 'imovel') {
    return `Resumo: Visita ao imóvel ${respostas.imovel || ''}, motivo: ${respostas.motivo || 'não informado'}, controle ambiental: ${respostas.controleAmbiental || 'não registrado'}.`;
  }
  return 'Resumo não disponível.';
}
  if (novaResposta.exames && novaResposta.exames.toLowerCase() !== 'não' && novaResposta.exames.length > 2) {
    registrarSolicitacaoExame(novaResposta);
    adicionarMensagemBot('Solicitação de exame registrada e será sincronizada quando online.');
  }
  setFluxo(null);
      }
      setInput('');
      return;
    }
    // Fluxo visita família
    if (fluxo.tipo === 'visitaFamilia') {
      const permissoes = permissoesAtivas();
      if (!permissoes.visitas) {
        adicionarMensagemBot('Você não tem permissão para registrar visitas. Ative a permissão em seu perfil.');
        setFluxo(null);
        setInput('');
        return;
      }
      const etapaAtual = etapasVisitaFamilia[fluxo.etapa];
      let erro = '';
      const val = value.trim();
      if (etapaAtual.key === 'familia') {
        if (!val || val.length < 3) erro = 'Selecione ou informe a família corretamente.';
      }
      if (etapaAtual.key === 'visitaRealizada') {
        if (!['sim','não','nao','s','n'].includes(val.toLowerCase())) erro = 'Responda "Sim" ou "Não".';
      }
      if (etapaAtual.key === 'motivo') {
        if (!val || val.length < 3) erro = 'Informe o motivo da visita.';
      }
      if (etapaAtual.key === 'concluir') {
        if (!['sim','s'].includes(val.toLowerCase())) erro = 'Digite "Sim" para concluir a visita.';
      }
      if (etapaAtual.obrigatorio && !val) erro = 'Este campo é obrigatório. ' + etapaAtual.pergunta;
      if (erro) {
        adicionarMensagemBot(erro);
        setInput('');
        return;
      }
      const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: val };
      if (fluxo.etapa < etapasVisitaFamilia.length - 1) {
        setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'visitaFamilia' });
        adicionarMensagemUser(value);
        setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasVisitaFamilia.length}: ${etapasVisitaFamilia[fluxo.etapa + 1].pergunta}`), 400);
      } else {
        adicionarMensagemUser(value);
  adicionarMensagemBot('Visita à família concluída! Dados salvos localmente.');
  salvarVisitaLocal(novaResposta, 'familia');
  // Geração de resumo clínico conciso
  const resumo = gerarResumoClinico(novaResposta, 'familia');
  adicionarMensagemBot(resumo);
  const sugestao = gerarSugestoesTerapia(novaResposta);
  if (sugestao) {
    adicionarMensagemBot(sugestao);
    exibirFeedback('sugestao', sugestao);
  }
// Mecanismo simples de feedback para aprendizado
function exibirFeedback(tipo: string, conteudo: string) {
  setTimeout(() => {
    adicionarMensagemBot('A sugestão foi útil? [Sim] [Não]');
    // Registrar resposta do usuário
    const handler = (msg: string) => {
      if (msg.trim().toLowerCase() === 'sim' || msg.trim().toLowerCase() === 'não' || msg.trim().toLowerCase() === 'nao') {
        registrarFeedback(tipo, conteudo, msg.trim().toLowerCase());
        removerListener();
        adicionarMensagemBot('Obrigado pelo feedback!');
      }
    };
    function removerListener() {
      window.removeEventListener('feedbackMsg', listenerWrapper);
    }
    function listenerWrapper(e: any) {
      handler(e.detail);
    }
    window.addEventListener('feedbackMsg', listenerWrapper);
  }, 500);
}

function registrarFeedback(tipo: string, conteudo: string, resposta: string) {
  const feedbacks = JSON.parse(localStorage.getItem('feedbackIA30') || '[]');
  feedbacks.push({ tipo, conteudo, resposta, data: new Date().toISOString() });
  localStorage.setItem('feedbackIA30', JSON.stringify(feedbacks));
}
  if (novaResposta.exames && novaResposta.exames.toLowerCase() !== 'não' && novaResposta.exames.length > 2) {
    registrarSolicitacaoExame(novaResposta);
    adicionarMensagemBot('Solicitação de exame registrada e será sincronizada quando online.');
  }
  setFluxo(null);
// Função para registrar solicitação de exame offline
function registrarSolicitacaoExame(respostas: Record<string, string>) {
  const exames = JSON.parse(localStorage.getItem('solicitacoesExames') || '[]');
  const novaSolicitacao = {
    solicitante: respostas.cidadao || respostas.familia || 'Desconhecido',
    exame: respostas.exames,
    data: new Date().toISOString(),
  };
  exames.push(novaSolicitacao);
  localStorage.setItem('solicitacoesExames', JSON.stringify(exames));
}
      }
      setInput('');
      return;
    }
    // Fluxo visita imóvel
    if (fluxo.tipo === 'visitaImovel') {
      const permissoes = permissoesAtivas();
      if (!permissoes.visitas) {
        adicionarMensagemBot('Você não tem permissão para registrar visitas. Ative a permissão em seu perfil.');
        setFluxo(null);
        setInput('');
        return;
      }
      const etapaAtual = etapasVisitaImovel[fluxo.etapa];
      let erro = '';
      const val = value.trim();
      if (etapaAtual.key === 'imovel') {
        if (!val || val.length < 3) erro = 'Selecione ou informe o imóvel corretamente.';
      }
      if (etapaAtual.key === 'visitaRealizada') {
        if (!['sim','não','nao','s','n'].includes(val.toLowerCase())) erro = 'Responda "Sim" ou "Não".';
      }
      if (etapaAtual.key === 'motivo') {
        if (!val || val.length < 3) erro = 'Informe o motivo da visita.';
      }
      if (etapaAtual.key === 'concluir') {
        if (!['sim','s'].includes(val.toLowerCase())) erro = 'Digite "Sim" para concluir a visita.';
      }
      if (etapaAtual.obrigatorio && !val) erro = 'Este campo é obrigatório. ' + etapaAtual.pergunta;
      if (erro) {
        adicionarMensagemBot(erro);
        setInput('');
        return;
      }
      const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: val };
      if (fluxo.etapa < etapasVisitaImovel.length - 1) {
        setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'visitaImovel' });
        adicionarMensagemUser(value);
        setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasVisitaImovel.length}: ${etapasVisitaImovel[fluxo.etapa + 1].pergunta}`), 400);
      } else {
        adicionarMensagemUser(value);
  adicionarMensagemBot('Visita ao imóvel concluída! Dados salvos localmente.');
  salvarVisitaLocal(novaResposta, 'imovel');
  // Geração de resumo clínico conciso
  const resumo = gerarResumoClinico(novaResposta, 'imovel');
  adicionarMensagemBot(resumo);
  const sugestao = gerarSugestoesTerapia(novaResposta);
  if (sugestao) adicionarMensagemBot(sugestao);
// Sugestão de planos terapêuticos, exames e medicamentos baseada em condições de saúde
function gerarSugestoesTerapia(respostas: Record<string, string>) {
  const condicoes = (respostas.condicoesSaude || '').toLowerCase();
  let sugestoes = [];
  if (condicoes.includes('diabetes')) {
    sugestoes.push('Condição: Diabetes detectada. Sugestão: monitoramento glicêmico, orientação alimentar, encaminhamento ao enfermeiro. Avaliar solicitação de exame de glicemia.');
  }
  if (condicoes.includes('hipertens')) {
    sugestoes.push('Condição: Hipertensão detectada. Sugestão: aferição regular da pressão arterial, orientação sobre uso de medicação, encaminhamento ao enfermeiro.');
  }
  // Outras condições podem ser adicionadas aqui
  if (sugestoes.length > 0) {
    return sugestoes.join('\n');
  }
  return '';
}
  setFluxo(null);
// Função utilitária para gerar resumo clínico conciso após visita/cadastro
function gerarResumoClinico(respostas: Record<string, string>, tipo: 'cidadao' | 'familia' | 'imovel') {
  if (tipo === 'cidadao') {
    return `Resumo: Visita a ${respostas.cidadao || 'cidadão'}, motivo: ${respostas.motivo || 'não informado'}, condições de saúde: ${respostas.condicoesSaude || 'não registradas'}, antropometria: ${respostas.antropometria || 'não registrada'}.`;
  }
  if (tipo === 'familia') {
    return `Resumo: Visita à família ${respostas.familia || ''}, motivo: ${respostas.motivo || 'não informado'}, controle ambiental: ${respostas.controleAmbiental || 'não registrado'}.`;
  }
  if (tipo === 'imovel') {
    return `Resumo: Visita ao imóvel ${respostas.imovel || ''}, motivo: ${respostas.motivo || 'não informado'}, controle ambiental: ${respostas.controleAmbiental || 'não registrado'}.`;
  }
  return 'Resumo não disponível.';
}
      }
      setInput('');
      return;
    }
  // (Removido bloco duplicado do fluxo visitaCidadao)
    // Fluxo visita família
    if (fluxo.tipo === 'visitaFamilia') {
      const etapaAtual = etapasVisitaFamilia[fluxo.etapa];
      const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: value.trim() };
      if (etapaAtual.obrigatorio && !value.trim()) {
        adicionarMensagemBot('Este campo é obrigatório. ' + etapaAtual.pergunta);
        setInput('');
        return;
      }
      if (fluxo.etapa < etapasVisitaFamilia.length - 1) {
        setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'visitaFamilia' });
        adicionarMensagemUser(value);
        setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasVisitaFamilia.length}: ${etapasVisitaFamilia[fluxo.etapa + 1].pergunta}`), 400);
      } else {
        adicionarMensagemUser(value);
        adicionarMensagemBot('Visita à família concluída! Dados salvos localmente.');
        salvarVisitaLocal(novaResposta, 'familia');
        setFluxo(null);
      }
      setInput('');
      return;
    }
    // Fluxo visita imóvel
    if (fluxo.tipo === 'visitaImovel') {
      const etapaAtual = etapasVisitaImovel[fluxo.etapa];
      const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: value.trim() };
      if (etapaAtual.obrigatorio && !value.trim()) {
        adicionarMensagemBot('Este campo é obrigatório. ' + etapaAtual.pergunta);
        setInput('');
        return;
      }
      if (fluxo.etapa < etapasVisitaImovel.length - 1) {
        setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'visitaImovel' });
        adicionarMensagemUser(value);
        setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasVisitaImovel.length}: ${etapasVisitaImovel[fluxo.etapa + 1].pergunta}`), 400);
      } else {
        adicionarMensagemUser(value);
        adicionarMensagemBot('Visita ao imóvel concluída! Dados salvos localmente.');
        salvarVisitaLocal(novaResposta, 'imovel');
        setFluxo(null);
      }
      setInput('');
      return;
    }
  // Salvar visita localmente e no buffer de sincronização
  function salvarVisitaLocal(respostas: Record<string, string>, tipo: 'cidadao' | 'familia' | 'imovel') {
    const visitas = JSON.parse(localStorage.getItem('visitas') || '[]');
    const novaVisita = { ...respostas, tipo, data: new Date().toISOString() };
    visitas.push(novaVisita);
    localStorage.setItem('visitas', JSON.stringify(visitas));
    bufferSincronizacao.relatorios.push(novaVisita);
    persistirBuffer();
  }
  } else if (fluxo && activeIdx !== 0) {
    // Se estiver em outra conversa, apenas processa mensagem normalmente, sem afetar o fluxo guiado
    processarMensagem(value);
    setInput('');
    return;
  }
    // Fora de fluxo guiado
    processarMensagem(value);
    setInput('');
  }
  const [fullScreen, setFullScreen] = useState(false);
  const [assistenteACSOpen, setAssistenteACSOpen] = useState(false);
  const saudacao = `Olá, ${usuario.nome}! (${userProfile})`;
  const [showHistory, setShowHistory] = useState(false);
  // Conversas: cada conversa é um array de mensagens
    const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('chatbotConversations');
    let initial;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Garante que sempre haja pelo menos uma mensagem do bot
        if (Array.isArray(parsed) && parsed.length > 0 && (!parsed[0].messages || parsed[0].messages.length === 0)) {
          parsed[0].messages = [{ from: 'bot', text: saudacao }];
        }
        initial = parsed;
      } catch {
        initial = [{
          id: uuid(),
          title: 'Nova conversa',
          messages: [{ from: 'bot', text: saudacao }],
          createdAt: Date.now(),
        }];
      }
    } else {
      initial = [{
        id: uuid(),
        title: 'Nova conversa',
        messages: [{ from: 'bot', text: saudacao }],
        createdAt: Date.now(),
      }];
    }
    localStorage.setItem('chatbotConversations', JSON.stringify(initial));
    return initial;
  });
  // Índice da conversa ativa
  const [activeIdx, setActiveIdx] = useState(0);
  // Sugestões dinâmicas (pode ser adaptado por perfil)
  const sugestoesPadrao = [
    'Meus atendimentos',
    'Agendar visita para João amanhã',
    'Resumo de hoje',
    'Ajuda',
    'Ver auditoria',
  ];
  const [sugestoes, setSugestoes] = useState(sugestoesPadrao);
  // Consentimento e privacidade
  const [consentido, setConsentido] = useState(false);
  const [input, setInput] = useState('');
  // Mensagens da conversa ativa
  const messages = Array.isArray(conversations[activeIdx]?.messages) ? conversations[activeIdx].messages : [];

  // --- FLUXOS GUIADOS DE CADASTRO E VISITA ---
  // Estrutura das etapas do cadastro de cidadão
  const etapasCidadao = [
    { key: 'nome', pergunta: 'Qual o nome completo do cidadão?', obrigatorio: true },
    { key: 'dataNascimento', pergunta: 'Qual a data de nascimento?', obrigatorio: true },
    { key: 'sexo', pergunta: 'Qual o sexo?', obrigatorio: true },
    { key: 'nomeMae', pergunta: 'Qual o nome da mãe?', obrigatorio: true },
    { key: 'cpf', pergunta: 'Qual o CPF?', obrigatorio: false },
    { key: 'cns', pergunta: 'Qual o CNS?', obrigatorio: false },
    { key: 'endereco', pergunta: 'Qual o endereço?', obrigatorio: true },
  ];
  // Estrutura das etapas do cadastro de rua
  const etapasRua = [
    { key: 'nomeRua', pergunta: 'Qual o nome da rua?', obrigatorio: true },
    { key: 'bairro', pergunta: 'Qual o bairro?', obrigatorio: true },
    { key: 'cep', pergunta: 'Qual o CEP?', obrigatorio: false },
    { key: 'referencia', pergunta: 'Ponto de referência (opcional)?', obrigatorio: false },
    { key: 'tipoLogradouro', pergunta: 'Tipo de logradouro (Rua, Avenida, Travessa, etc)?', obrigatorio: true },
  ];

  // Etapas do fluxo de visita ao cidadão
  const etapasVisitaCidadao = [
    { key: 'cidadao', pergunta: 'Selecione o cidadão visitado:', obrigatorio: true },
    { key: 'visitaRealizada', pergunta: 'A visita foi realizada?', obrigatorio: true },
    { key: 'motivo', pergunta: 'Qual o motivo da visita?', obrigatorio: true },
    { key: 'condicoesSaude', pergunta: 'Visualizar condições de saúde. Deseja registrar alguma observação?', obrigatorio: false },
    // Protocolos clínicos específicos
    { key: 'gestante', pergunta: 'Gestante? (Sim/Não)', obrigatorio: false, protocolo: 'saudeMulher' },
    { key: 'vacinas', pergunta: 'Criança com vacinação em dia? (Sim/Não/Não se aplica)', obrigatorio: false, protocolo: 'saudeCrianca' },
    { key: 'puericultura', pergunta: 'Necessita acompanhamento de puericultura? (Sim/Não/Não se aplica)', obrigatorio: false, protocolo: 'saudeCrianca' },
    { key: 'buscaAtiva', pergunta: 'Expandir busca ativa? (se aplicável)', obrigatorio: false },
    { key: 'acompanhamento', pergunta: 'Expandir acompanhamento? (se aplicável)', obrigatorio: false },
    { key: 'antropometria', pergunta: 'Registrar antropometria? (se necessário)', obrigatorio: false },
    { key: 'acompProfissional', pergunta: 'Informar acompanhamento profissional?', obrigatorio: false },
    { key: 'concluir', pergunta: 'Concluir visita?', obrigatorio: true },
  ];
  // Etapas do fluxo de visita à família
  const etapasVisitaFamilia = [
    { key: 'familia', pergunta: 'Selecione a família visitada:', obrigatorio: true },
    { key: 'visitaRealizada', pergunta: 'A visita foi realizada?', obrigatorio: true },
    { key: 'motivo', pergunta: 'Qual o motivo da visita?', obrigatorio: true },
    // Protocolos clínicos específicos
    { key: 'gestante', pergunta: 'Gestante na família? (Sim/Não/Não se aplica)', obrigatorio: false, protocolo: 'saudeMulher' },
    { key: 'vacinas', pergunta: 'Criança na família com vacinação em dia? (Sim/Não/Não se aplica)', obrigatorio: false, protocolo: 'saudeCrianca' },
    { key: 'puericultura', pergunta: 'Necessita acompanhamento de puericultura? (Sim/Não/Não se aplica)', obrigatorio: false, protocolo: 'saudeCrianca' },
    { key: 'controleAmbiental', pergunta: 'Expandir controle ambiental/vetorial?', obrigatorio: false },
    { key: 'acompProfissional', pergunta: 'Informar acompanhamento profissional?', obrigatorio: false },
    { key: 'concluir', pergunta: 'Concluir visita?', obrigatorio: true },
  ];
  // Etapas do fluxo de visita ao imóvel
  const etapasVisitaImovel = [
    { key: 'imovel', pergunta: 'Selecione o imóvel visitado:', obrigatorio: true },
    { key: 'visitaRealizada', pergunta: 'A visita foi realizada?', obrigatorio: true },
    { key: 'motivo', pergunta: 'Qual o motivo da visita?', obrigatorio: true },
    { key: 'controleAmbiental', pergunta: 'Expandir controle ambiental/vetorial?', obrigatorio: false },
    { key: 'acompProfissional', pergunta: 'Informar acompanhamento profissional?', obrigatorio: false },
    { key: 'concluir', pergunta: 'Concluir visita?', obrigatorio: true },
  ];

  // Estado do fluxo guiado
  const [fluxo, setFluxo] = useState<
    { etapa: number, respostas: Record<string, string>, tipo?: 'cidadao' | 'rua' | 'visitaCidadao' | 'visitaFamilia' | 'visitaImovel', conversaId?: string }
    | null
  >(null);

  // Processa mensagem fora do fluxo guiado, simulando o envio e resposta do bot
  function processarMensagem(msg: string) {
    console.log('[DEBUG] processarMensagem chamada com:', msg);
    setConversations((convs) => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      // Se for a primeira mensagem do usuário, define o título com as duas primeiras palavras
      if (!Array.isArray(conv.messages)) conv.messages = [];
      if (!conv.messages.some(m => m.from === 'user')) {
        const palavras = msg.trim().split(/\s+/).slice(0, 2);
        const titulo = palavras.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        conv.title = titulo;
      }
      conv.messages = [...conv.messages, { from: 'user', text: msg }];
      convsCopy[activeIdx] = conv;
      persistConversations(convsCopy);
      return convsCopy;
    });
    const resposta = handleBotResponse(msg);
    setTimeout(() => {
      setConversations((convs) => {
        const convsCopy = [...convs];
        const conv = { ...convsCopy[activeIdx] };
        if (!Array.isArray(conv.messages)) conv.messages = [];
        conv.messages = [...conv.messages, { from: 'bot', text: resposta }];
        convsCopy[activeIdx] = conv;
        persistConversations(convsCopy);
        return convsCopy;
      });
    }, 800);
  }

  // Helper: verifica se a conversa ativa já foi iniciada (tem mensagem do usuário)
  const conversaIniciada = messages.some(m => m.from === 'user');

  // Log de auditoria local (persistente)
  let logAuditoria: { acao: string, data: string, detalhes?: string }[] = JSON.parse(localStorage.getItem('logAuditoria') || '[]');

  // Salva conversas no localStorage
  function persistConversations(next: any) {
    localStorage.setItem('chatbotConversations', JSON.stringify(next));
  }
  function registrarAuditoria(acao: string, detalhes?: string) {
    logAuditoria.push({ acao, data: new Date().toLocaleString(), detalhes });
    localStorage.setItem('logAuditoria', JSON.stringify(logAuditoria));
  }
  function persistirBuffer() {
    localStorage.setItem('bufferSincronizacao', JSON.stringify(bufferSincronizacao));
  }

  // Roles dinâmicos para interface (exemplo de uso)
  const roles = {
    ACS: ['agendamentos', 'tarefas'],
    ENFERMEIRO: ['agendamentos', 'tarefas', 'resumo'],
    MEDICO: ['agendamentos', 'tarefas', 'resumo', 'alertas'],
    ADMIN: ['dashboard', 'relatorios', 'usuarios'],
    GESTOR: ['dashboard', 'relatorios', 'tendencias'],
  };
  const opcoesMenu = roles[userProfile] || [];

  // Simulação de integração com ACS-221 (validação de IA)
  function validarIA(resposta: string, pergunta: string) {
    if (pergunta.toLowerCase().includes('hipertens')) {
      return resposta + '\n⚠️ Dados de hipertensão inconsistentes. Sugerimos verificar registros.';
    }
    return resposta;
  }

  // Simulação de validação de permissão
  function temPermissao(campo: string) {
    if (userProfile === 'ACS' && campo === 'cpf') return false;
    return true;
  }

  const handleBotResponse = (question: string): string => {
    const q = question.toLowerCase();
    // Limpar dados locais
    if (q.match(/limpar dados|resetar local|apagar local|apagar tudo/)) {
      localStorage.removeItem('logAuditoria');
      localStorage.removeItem('bufferSincronizacao');
      localStorage.removeItem('chatbotMessages');
      logAuditoria = [];
      bufferSincronizacao = {
        relatorios: [],
        tendencias: [],
        alertas: [],
        ultimaSincronizacao: null,
      };
      return 'Todos os dados locais e o histórico de conversa foram apagados.';
    }
    // Consentimento obrigatório para comandos sensíveis
    if (!consentido && q.match(/sincronizar|relat[óo]rio|atualizar modelo|federated learning|enviar dados|auditoria|log de a[cç][aã]o/)) {
      return 'Por favor, confirme o consentimento para uso de dados antes de executar esta ação.';
    }
    // Consentimento explícito (palavras positivas e negativas)
    // Palavras positivas para aceitar consentimento
    const palavrasPositivas = [
      'aceito', 'concordo', 'consentimento', 'li e aceito', 'autorizo', 'permito', 'permitir', 'dou permissão', 'dou consentimento', 'estou de acordo', 'pode usar', 'pode utilizar', 'pode coletar', 'pode registrar', 'pode compartilhar', 'pode prosseguir', 'pode continuar', 'pode seguir', 'sim', 'ok', 'de acordo', 'autorização', 'autorizada', 'autorizado', 'autorizada', 'autorizado', 'confirmo', 'confirmada', 'confirmado', 'confirmada', 'confirmado', 'aprovado', 'aprovada', 'aprovo', 'consinto', 'consinto sim', 'consinto com o uso', 'pode sim', 'pode coletar meus dados', 'pode registrar meus dados', 'pode prosseguir com meus dados', 'pode usar meus dados', 'pode utilizar meus dados', 'pode compartilhar meus dados', 'pode continuar com meus dados', 'pode seguir com meus dados'
    ];
    // Palavras negativas para negar consentimento
    const palavrasNegativas = [
      'não aceito','não' , 'nao' , 'nao aceito', 'não concordo', 'nao concordo', 'não autorizo', 'nao autorizo', 'não permito', 'nao permito', 'não dou permissão', 'nao dou permissão', 'não dou consentimento', 'nao dou consentimento', 'não estou de acordo', 'nao estou de acordo', 'não pode usar', 'nao pode usar', 'não pode utilizar', 'nao pode utilizar', 'não pode coletar', 'nao pode coletar', 'não pode registrar', 'nao pode registrar', 'não pode compartilhar', 'nao pode compartilhar', 'não pode prosseguir', 'nao pode prosseguir', 'não pode continuar', 'nao pode continuar', 'não pode seguir', 'nao pode seguir', 'não', 'negado', 'negada', 'nego', 'recuso', 'recusado', 'recusada', 'não consinto', 'nao consinto', 'não consinto com o uso', 'nao consinto com o uso', 'não pode sim', 'nao pode sim', 'não pode coletar meus dados', 'nao pode coletar meus dados', 'não pode registrar meus dados', 'nao pode registrar meus dados', 'não pode prosseguir com meus dados', 'nao pode prosseguir com meus dados', 'não pode usar meus dados', 'nao pode usar meus dados', 'não pode utilizar meus dados', 'nao pode utilizar meus dados', 'não pode compartilhar meus dados', 'nao pode compartilhar meus dados', 'não pode continuar com meus dados', 'nao pode continuar com meus dados', 'não pode seguir com meus dados', 'nao pode seguir com meus dados'
    ];
    if (palavrasPositivas.some(p => q.includes(p))) {
      setConsentido(true);
      registrarAuditoria('Consentimento fornecido');
      return 'Consentimento registrado. Agora você pode executar ações sensíveis.';
    }
    if (palavrasNegativas.some(p => q.includes(p))) {
      setConsentido(false);
      registrarAuditoria('Consentimento negado');
      return 'Consentimento negado. Não será possível executar ações sensíveis.';
    }
    // Visualizar log de auditoria
    if (q.match(/auditoria|log de a[cç][aã]o|ver auditoria/)) {
      if (logAuditoria.length === 0) {
        return '🕵️‍♂️ Auditoria de ações sensíveis\n\nNenhuma ação sensível foi registrada até o momento.\n\nA auditoria serve para registrar operações importantes, como consentimento, sincronização, agendamentos e alterações de dados.';
      }
      return (
        '🕵️‍♂️ Auditoria de ações sensíveis\n\n' +
        logAuditoria.map(l => `• ${l.data}: ${l.acao}${l.detalhes ? ' - ' + l.detalhes : ''}`).join('\n') +
        '\n\nA auditoria serve para registrar operações importantes, como consentimento, sincronização, agendamentos e alterações de dados.'
      );
    }
    // Gerar relatório anônimo
    if (q.match(/relat[óo]rio|gerar relat[óo]rio|report|resumo de dados/)) {
      const rel = gerarRelatorioAnonimo();
      if (rel.totalCidadaos === 0 && rel.totalRuas === 0) {
        return '📄 Relatório Anônimo\n\nNenhum cidadão ou rua cadastrados até o momento.\n\nO relatório apresenta apenas estatísticas e dados anonimizados, sem informações pessoais.';
      }
      let msg = '📄 Relatório Anônimo\n\n';
      msg += `Total de cidadãos cadastrados: ${rel.totalCidadaos}\n`;
      msg += `Total de ruas cadastradas: ${rel.totalRuas}\n`;
      if (rel.totalCidadaos > 0) {
        msg += '\nExemplo de cidadãos (dados anonimizados):\n';
        rel.cidadaos.slice(0, 3).forEach((c: any, i: number) => {
          msg += `  ${i + 1}. Sexo: ${c.sexo || '-'}, Nascimento: ${c.dataNascimento || '-'}, Endereço: ${c.endereco || '-'}, Data cadastro: ${c.data || '-'}\n`;
        });
      }
      if (rel.totalRuas > 0) {
        msg += '\nExemplo de ruas:\n';
        rel.ruas.slice(0, 3).forEach((r: any, i: number) => {
          msg += `  ${i + 1}. ${r.tipoLogradouro || 'Rua'} ${r.nomeRua || '-'}, Bairro: ${r.bairro || '-'}, Data cadastro: ${r.data || '-'}\n`;
        });
      }
      msg += '\nO relatório apresenta apenas estatísticas e dados anonimizados, sem informações pessoais.';
      return msg;
    }
    const fuzzy = fuseInstance.search(q);
    const intent = fuzzy.length > 0 ? fuzzy[0].item.intent : null;

    // Permissões por campo (exemplo: ACS não vê CPF)
    const permissoes = {
      nome: true,
      cpf: userProfile !== 'ACS',
      cns: true,
      data_nascimento: true,
      gestante: true,
      hipertensao: true,
      diabetes: true,
      rua: true,
      familia: true,
      condicoes: true,
      recusa: true,
      alerta: true,
      membro: true,
      atualizacao: true,
    };

    // Permissão de acesso a atendimentos: médicos e enfermeiros só veem os próprios
    function filtrarAtendimentosPorPermissao() {
      if (userProfile === 'MEDICO' || userProfile === 'ENFERMEIRO') {
        return atendimentos.filter(a => a.profissionalTipo === userProfile && a.profissionalId === userId);
      }
      // ACS e ADMIN veem todos
      return atendimentos;
    }

    // Detecta tentativa de acesso cruzado (ex: "atendimentos do médico 002" por médico 001)
    if ((userProfile === 'MEDICO' || userProfile === 'ENFERMEIRO') && q.match(/(medic[oa]|enfermeir[oa]|profissional)\s*\d{3,}/)) {
      const idMatch = q.match(/\d{3,}/);
      if (idMatch && idMatch[0] !== userId) {
        return 'Acesso não autorizado. (Tentativa de acesso a atendimentos de outro profissional)';
      }
    }

    // 1. Saudação personalizada
    if (q.match(/^(oi|ol[áa]|bom dia|boa tarde|boa noite)$/)) {
      return saudacao;
    }
    // 0. Tutorial adaptativo por comando "ajuda"
    if (q.match(/ajuda|tutorial|como usar|o que posso fazer/)) {
      return 'Você pode perguntar sobre atendimentos, agendar visitas, ver pendências, gerar relatórios e sincronizar dados.';
    }

    // 2. Agendar visita (mock)
    if (q.match(/agend(ar|ar visita|ar uma visita)/) && q.match(/para/)) {
      const pacienteMatch = q.match(/para ([a-zãõáéíóúç ]+)/);
      let paciente = pacienteMatch ? pacienteMatch[1].split(' ')[0] : 'Paciente';
      let data = '';
      if (q.includes('amanhã')) {
        data = '29/07/2025';
      } else {
        data = 'Data a definir';
      }
      tarefas.push({ paciente, data, profissionalId: userId, concluido: false });
      registrarAuditoria('Agendamento de visita', `Paciente: ${paciente}, Data: ${data}`);
      return `Visita agendada para ${paciente} em ${data}, ${usuario.nome}.`;
    }

    // 3. Concluir atendimento (mock)
    if (q.match(/concluir|marcar atendimento como feito|finalizar atendimento/)) {
      const pacienteMatch = q.match(/de ([a-zãõáéíóúç ]+)/);
      let paciente = pacienteMatch ? pacienteMatch[1].split(' ')[0] : '';
      let tarefa = tarefas.find(t => t.paciente.toLowerCase().includes(paciente) && t.profissionalId === userId && !t.concluido);
      if (tarefa) {
        tarefa.concluido = true;
        registrarAuditoria('Conclusão de atendimento', `Paciente: ${tarefa.paciente}`);
        return `Atendimento de ${tarefa.paciente} marcado como concluído.`;
      } else {
        return `Nenhum atendimento pendente encontrado para ${paciente}.`;
      }
    }

    // 4. Resumo diário de atendimentos
    if (q.match(/resumo de hoje|me dá o resumo de hoje|resumo diário|resumo do dia/)) {
      const meus = filtrarAtendimentosPorPermissao().filter(a => a.data === '28/07/2025');
      if (meus.length === 0) return 'Nenhum atendimento realizado hoje.';
      let lista = meus.map(a => `${a.paciente} (${a.condicoes.join(', ')})`).join(' e ');
      let alertas = meus.filter(a => a.alerta).map(a => `Verifique dados de ${a.paciente}.`).join(' ');
      return `Hoje, você atendeu ${meus.length} paciente(s): ${lista}. ${alertas}`;
    }

    // 5. Sugestões proativas (mock): pendências e alertas
    if (q.match(/pendente|pendências|alerta|alertas/)) {
      const pendentes = tarefas.filter(t => t.profissionalId === userId && !t.concluido);
      if (pendentes.length === 0) return 'Nenhuma pendência encontrada.';
      return pendentes.map(t => `${usuario.nome}, você tem um atendimento pendente com ${t.paciente} em ${t.data}.`).join('\n');
    }

    // 6. Alertas preditivos locais (ML leve/federated learning mock)
    if (q.match(/alerta preditivo|previs[aã]o|pr[óo]xim[oa] visita|risco preditivo/)) {
      // Simula um modelo local prevendo risco para o próximo atendimento
      const proximo = tarefas.find(t => t.profissionalId === userId && !t.concluido);
      if (proximo) {
        bufferSincronizacao.alertas.push({ paciente: proximo.paciente, alerta: 'Risco de falta na próxima visita' });
        persistirBuffer();
        registrarAuditoria('Alerta preditivo', `Paciente: ${proximo.paciente}`);
        return `Alerta preditivo: ${proximo.paciente} tem risco de falta na próxima visita. (Gerado localmente)`;
      } else {
        return 'Nenhum atendimento pendente para previsão.';
      }
    }

    // 7. Simular atualização federada do modelo (após sincronização)
    if (q.match(/atualizar modelo|federated learning|refinar modelo/)) {
      registrarAuditoria('Atualização de modelo federado');
      return 'Modelo local atualizado com parâmetros globais (federated learning simulado, sem envio de dados crus).';
    }

    // Exemplo de perguntas abertas: "Quem atendi?", "Meus atendimentos"
    if (intent === 'ajuda' || q.match(/meus atendimentos|quem atendi|meus pacientes|quem tenho que visitar|quem tenho que atender/)) {
      const meus = filtrarAtendimentosPorPermissao();
      if (meus.length === 0) return 'Nenhum atendimento encontrado para você.';
      return meus.map(a => `Você atendeu ${a.paciente} (${a.condicoes.join(', ')}) em ${a.data}.`).join('\n');
    }

    // Mensagem de acesso negado por campo
    if (intent && !permissoes[intent]) {
      return 'Acesso não autorizado.';
    }

    // Exemplos de respostas para perguntas sobre atendimentos
    if (intent === 'nome' || intent === 'cpf' || intent === 'cns' || intent === 'data_nascimento' || intent === 'gestante' || intent === 'hipertensao' || intent === 'diabetes') {
      const meus = filtrarAtendimentosPorPermissao();
      if (meus.length === 0) return 'Nenhum atendimento encontrado para você.';
      return meus.map(a => `${a.paciente}: ${a.condicoes.join(', ')} (Data: ${a.data})`).join('\n');
    }

    // Alertas de inconsistência (ACS-221)
    if (intent && intent !== 'ajuda') {
      const meus = filtrarAtendimentosPorPermissao();
      const alertas = meus.filter(a => a.alerta).map(a => `${a.paciente}: ${a.alerta}`);
      if (alertas.length) return alertas.join('\n');
    }

    // Se não reconhecido, sugerir exemplo e mostrar opções do menu do perfil
    return `Pergunta não reconhecida. Exemplos: "Meus atendimentos", "Agendar visita para João amanhã", "Resumo de hoje".\nOpções para seu perfil: ${opcoesMenu.join(', ')}`;
  };

  // Suporte a respostas assíncronas (sincronização)
  const sendMessage = () => {
    if (!input.trim()) return;
    // Se estiver em fluxo guiado de cadastro
    if (fluxo) {
      // Cancelar fluxo se digitar cancelar, anular, limpar, sair
      if (/^(cancela|cancel|cancelar|anula|anular|limpa|limpar|sai|sair)$/i.test(input.trim())) {
        adicionarMensagemUser(input);
        adicionarMensagemBot(saudacao);
        setFluxo(null);
        setInput('');
        return;
      }
      // Fluxo cidadão
      if (fluxo.tipo === 'cidadao' || !fluxo.tipo) {
        const etapaAtual = etapasCidadao[fluxo.etapa];
        const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: input.trim() };
        if (etapaAtual.obrigatorio && !input.trim()) {
          adicionarMensagemBot('Este campo é obrigatório. ' + etapaAtual.pergunta);
          setInput('');
          return;
        }
        if (fluxo.etapa < etapasCidadao.length - 1) {
          setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'cidadao' });
          adicionarMensagemUser(input);
          setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasCidadao.length}: ${etapasCidadao[fluxo.etapa + 1].pergunta}`), 400);
        } else {
          adicionarMensagemUser(input);
          adicionarMensagemBot('Cadastro de cidadão concluído! Dados salvos localmente.');
          salvarCadastroLocal(novaResposta);
          setFluxo(null);
        }
        setInput('');
        return;
      }
      // Fluxo rua
      if (fluxo.tipo === 'rua') {
        const etapaAtual = etapasRua[fluxo.etapa];
        const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: input.trim() };
        if (etapaAtual.obrigatorio && !input.trim()) {
          adicionarMensagemBot('Este campo é obrigatório. ' + etapaAtual.pergunta);
          setInput('');
          return;
        }
        if (fluxo.etapa < etapasRua.length - 1) {
          setFluxo({ etapa: fluxo.etapa + 1, respostas: novaResposta, tipo: 'rua' });
          adicionarMensagemUser(input);
          setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasRua.length}: ${etapasRua[fluxo.etapa + 1].pergunta}`), 400);
        } else {
          adicionarMensagemUser(input);
          adicionarMensagemBot('Cadastro de rua concluído! Dados salvos localmente.');
          salvarRuaLocal(novaResposta);
          setFluxo(null);
        }
        setInput('');
        return;
      }
    }
  // Salvar rua localmente e no buffer de sincronização
  function salvarRuaLocal(respostas: Record<string, string>) {
    const ruas = JSON.parse(localStorage.getItem('cadastrosRua') || '[]');
    const novaRua = { ...respostas, data: new Date().toISOString() };
    ruas.push(novaRua);
    localStorage.setItem('cadastrosRua', JSON.stringify(ruas));
    bufferSincronizacao.relatorios.push(novaRua);
    persistirBuffer();
  }

    // Comando para iniciar fluxo guiado cidadão
    if (/^novo cidadão/i.test(input.trim())) {
      setFluxo({ etapa: 0, respostas: {}, tipo: 'cidadao' });
      adicionarMensagemUser(input);
      setTimeout(() => adicionarMensagemBot(`Etapa 1 de ${etapasCidadao.length}: ${etapasCidadao[0].pergunta}`), 400);
      setInput('');
      return;
    }
    // Comando para iniciar fluxo guiado rua
    if (/^nova rua/i.test(input.trim())) {
      setFluxo({ etapa: 0, respostas: {}, tipo: 'rua' });
      adicionarMensagemUser(input);
      setTimeout(() => adicionarMensagemBot(`Etapa 1 de ${etapasRua.length}: ${etapasRua[0].pergunta}`), 400);
      setInput('');
      return;
    }
    // Comando para iniciar fluxo guiado visita cidadão
    if (/^nova visita cidadão|^nova visita cidadao/i.test(input.trim())) {
      let permissoes = {};
      try {
        permissoes = JSON.parse(localStorage.getItem('permissoesUsuario') || '{}');
      } catch {}
      if (!permissoes.visitas) {
        adicionarMensagemUser(input);
        adicionarMensagemBot('Você não tem permissão para registrar visitas. Ative a permissão em seu perfil.');
        setInput('');
        return;
      }
      setFluxo({ etapa: 0, respostas: {}, tipo: 'visitaCidadao', conversaId: conversations[activeIdx]?.id });
      adicionarMensagemUser(input);
      adicionarMensagemBot('Iniciando registro de visita ao cidadão. ' + etapasVisitaCidadao[0].pergunta);
      setInput('');
      return;
    }
    // Comando para iniciar fluxo guiado visita família
    if (/^nova visita família|^nova visita familia/i.test(input.trim())) {
      let permissoes = {};
      try {
        permissoes = JSON.parse(localStorage.getItem('permissoesUsuario') || '{}');
      } catch {}
      if (!permissoes.visitas) {
        adicionarMensagemUser(input);
        adicionarMensagemBot('Você não tem permissão para registrar visitas. Ative a permissão em seu perfil.');
        setInput('');
        return;
      }
      setFluxo({ etapa: 0, respostas: {}, tipo: 'visitaFamilia', conversaId: conversations[activeIdx]?.id });
      adicionarMensagemUser(input);
      adicionarMensagemBot('Iniciando registro de visita à família. ' + etapasVisitaFamilia[0].pergunta);
      setInput('');
      return;
    }
    // Comando para iniciar fluxo guiado visita imóvel
    if (/^nova visita imóvel|^nova visita imovel/i.test(input.trim())) {
      let permissoes = {};
      try {
        permissoes = JSON.parse(localStorage.getItem('permissoesUsuario') || '{}');
      } catch {}
      if (!permissoes.visitas) {
        adicionarMensagemUser(input);
        adicionarMensagemBot('Você não tem permissão para registrar visitas. Ative a permissão em seu perfil.');
        setInput('');
        return;
      }
      setFluxo({ etapa: 0, respostas: {}, tipo: 'visitaImovel', conversaId: conversations[activeIdx]?.id });
      adicionarMensagemUser(input);
      adicionarMensagemBot('Iniciando registro de visita ao imóvel. ' + etapasVisitaImovel[0].pergunta);
      setInput('');
      return;
    }

    // Comando para sincronizar dados
    if (/^sincronizar dados$/i.test(input.trim())) {
      adicionarMensagemUser(input);
      if (!consentido) {
        setTimeout(() => adicionarMensagemBot('Por favor, confirme o consentimento para sincronizar os dados.'), 400);
        setInput('');
        return;
      }
      if (bufferSincronizacao.relatorios.length === 0) {
        setTimeout(() => adicionarMensagemBot('Nenhum dado novo para sincronizar.'), 400);
        setInput('');
        return;
      }
      adicionarMensagemBot('Sincronizando dados com o servidor...');
      enviarBufferSincronizacao(bufferSincronizacao.relatorios).then(() => {
        bufferSincronizacao.ultimaSincronizacao = new Date().toLocaleString();
        bufferSincronizacao.relatorios = [];
        persistirBuffer();
        setTimeout(() => adicionarMensagemBot('Sincronização concluída com sucesso!'), 800);
      });
      setInput('');
      return;
    }

    // Fluxo normal (não guiado)
    setConversations((convs) => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      // Se for a primeira mensagem do usuário, define o título com as duas primeiras palavras
      if (!Array.isArray(conv.messages)) conv.messages = [];
      if (!conv.messages.some(m => m.from === 'user')) {
        const palavras = input.trim().split(/\s+/).slice(0, 2);
        const titulo = palavras.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        conv.title = titulo;
      }
      conv.messages = [...conv.messages, { from: 'user', text: input }];
      convsCopy[activeIdx] = conv;
      persistConversations(convsCopy);
      return convsCopy;
    });
    const resposta = handleBotResponse(input);
    setTimeout(() => {
      setConversations((convs) => {
        const convsCopy = [...convs];
        const conv = { ...convsCopy[activeIdx] };
        if (!Array.isArray(conv.messages)) conv.messages = [];
        conv.messages = [...conv.messages, { from: 'bot', text: resposta }];
        convsCopy[activeIdx] = conv;
        persistConversations(convsCopy);
        return convsCopy;
      });
    }, 800);
    setInput('');
  };

  // Helpers para adicionar mensagens no fluxo guiado
  function adicionarMensagemUser(text: string) {
    setConversations((convs) => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      if (!Array.isArray(conv.messages)) conv.messages = [];
      conv.messages = [...conv.messages, { from: 'user', text }];
      convsCopy[activeIdx] = conv;
      persistConversations(convsCopy);
      return convsCopy;
    });
  }
  function adicionarMensagemBot(text: string) {
    setConversations((convs) => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      if (!Array.isArray(conv.messages)) conv.messages = [];
      conv.messages = [...conv.messages, { from: 'bot', text }];
      convsCopy[activeIdx] = conv;
      persistConversations(convsCopy);
      return convsCopy;
    });
  }
  function salvarCadastroLocal(respostas: Record<string, string>) {
    const cadastros = JSON.parse(localStorage.getItem('cadastrosCidadao') || '[]');
    const novoCadastro = { ...respostas, data: new Date().toISOString() };
    cadastros.push(novoCadastro);
    localStorage.setItem('cadastrosCidadao', JSON.stringify(cadastros));
    // Adiciona ao buffer de sincronização
    bufferSincronizacao.relatorios.push(novoCadastro);
    persistirBuffer();
  }

  // Ao fechar o modal, cancela o fluxo de cadastro

  // --- FIM DA LÓGICA, INÍCIO DO JSX ---
  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={
            fullScreen
              ? 'z-50 p-0 bg-white flex flex-col rounded-none shadow-none'
              : 'max-w-2xl w-full mx-auto p-0 rounded-lg shadow-2xl bg-white flex flex-col'
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
                  marginTop: '64px',
                  marginBottom: '64px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }
          }
          aria-describedby="chatbot-dialog-description"
        >
          {/* Acessibilidade: título oculto para screen readers */}
          <DialogTitle asChild>
          <span style={{position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0}}>Chatbot Inteligente</span>
        </DialogTitle>
        <DialogDescription asChild id="chatbot-dialog-description">
          <span style={{position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0}}>Converse com o assistente virtual para obter informações, registrar dados e tirar dúvidas.</span>
        </DialogDescription>
  {/* Linha do cabeçalho ocupando toda a largura, com gradiente */}
  <div className="flex items-center justify-between w-full" style={{background: 'linear-gradient(90deg, #8f36ff 0%, #2563eb 100%)', borderTopLeftRadius: fullScreen ? 0 : '0.5rem', borderTopRightRadius: fullScreen ? 0 : '0.5rem'}}>
          {/* Sidebar de conversas (botão e título) */}
          <div className={`flex items-center transition-all duration-300 ${showHistory ? 'w-64 min-w-[16rem]' : 'w-8 min-w-[2rem]'} h-full`}>
            <button
              className="m-2 p-1 rounded text-white hover:bg-white/10 focus:bg-white/20"
              title={showHistory ? 'Recolher conversas' : 'Expandir conversas'}
              onClick={() => setShowHistory(v => !v)}
              style={{ transition: 'background 0.2s' }}
              aria-label={showHistory ? 'Recolher conversas' : 'Expandir conversas'}
            >
              {showHistory ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 15L8 10L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            {showHistory && (
              <span className="font-bold text-xs text-white ml-2">Conversas</span>
            )}
          </div>
          {/* Cabeçalho principal e botão expandir */}
          <div className="flex items-center gap-2 px-6 py-4 flex-1">
            {/* Botão para expandir para tela cheia, à esquerda do ícone */}
            <button
              className="mr-2 p-1 rounded text-white hover:bg-white/10 focus:bg-white/20"
              title={fullScreen ? 'Voltar para modal' : 'Expandir para tela cheia'}
              onClick={() => setFullScreen(v => !v)}
              style={{ transition: 'background 0.2s' }}
            >
              {fullScreen ? (
                // Ícone de minimizar
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M5 7L7 7L7 5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M15 7L13 7L13 5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5 13L7 13L7 15" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M15 13L13 13L13 15" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              ) : (
                // Ícone de expandir
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M7 7L7 5L5 5L5 7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M13 7L13 5L15 5L15 7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 13L7 15L5 15L5 13" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M13 13L13 15L15 15L15 13" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </button>
            
            {/* Botão para Assistente ACS */}
            {/* Botão para Assistente ACS */}
            <button
              className="mr-2 p-1 rounded text-white hover:bg-white/10 focus:bg-white/20 flex items-center gap-1"
              title="Assistente ACS Especializado"
              onClick={() => setAssistenteACSOpen(true)}
              style={{ transition: 'background 0.2s' }}
            >
              <span className="text-xs hidden sm:inline">ACS</span>
            </button>
            
            {/* Ícone de robô para IA */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <g>
                <rect x="4" y="8" width="16" height="10" rx="4" fill="#fff"/>
                <rect x="7" y="4" width="10" height="6" rx="3" fill="#fff"/>
                <circle cx="8.5" cy="13" r="1.2" fill="#8f36ff"/>
                <circle cx="15.5" cy="13" r="1.2" fill="#2563eb"/>
                <rect x="10" y="16" width="4" height="1.2" rx="0.6" fill="#8f36ff"/>
                <rect x="2.5" y="11" width="2" height="1" rx="0.5" fill="#8f36ff"/>
                <rect x="19.5" y="11" width="2" height="1" rx="0.5" fill="#2563eb"/>
                <rect x="11.25" y="2" width="1.5" height="3" rx="0.75" fill="#fff"/>
              </g>
            </svg>
            <span className="text-lg font-bold text-white tracking-wide" style={{letterSpacing: '0.04em'}}>I.A 30</span>
          </div>

        </div>
        <div className="flex flex-1 w-full">
          {/* Sidebar de conversas */}
          <div
            className={`transition-all duration-300 bg-gray-50 border-r border-gray-200 h-full flex flex-col ${showHistory ? 'w-64 min-w-[16rem]' : 'w-8 min-w-[2rem]'} overflow-y-auto`}
          >
            {showHistory && (
              <div className="flex-1 px-2 py-2">
                <div className="flex flex-col gap-1">
                  {Array.isArray(conversations) && conversations.map((conv, idx) => (
                    <div key={conv.id} className="relative group flex items-center">
                      <Button
                        variant={idx === activeIdx ? 'default' : 'outline'}
                        className={`w-full justify-start text-xs py-1 px-2 mb-1 rounded pr-7 ${idx === activeIdx ? 'bg-blue-100' : ''}`}
                        onClick={() => setActiveIdx(idx)}
                      >
                        {conv.title || `Conversa ${idx + 1}`}
                      </Button>
                      {/* Permitir excluir qualquer conversa, inclusive a primeira */}
                      <button
                        className="absolute right-2 top-1 text-xs text-gray-400 hover:text-red-600 font-bold bg-transparent border-none p-0 m-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Excluir conversa"
                        onClick={e => {
                          e.stopPropagation();
                          setConversations((convs) => {
                            const next = convs.filter((_, i) => i !== idx);
                            persistConversations(next);
                            // Ajusta o índice ativo
                            if (activeIdx === idx) {
                              setActiveIdx(Math.max(0, idx - 1));
                            } else if (activeIdx > idx) {
                              setActiveIdx(activeIdx - 1);
                            }
                            return next;
                          });
                        }}
                      >×</button>
                    </div>
                  ))}
                  <Button
                    className="w-full justify-start text-xs py-1 px-2 mt-2 rounded border-dashed border-2 border-blue-300 text-blue-700 bg-white hover:bg-blue-50"
                    disabled={!conversaIniciada}
                    title={!conversaIniciada ? 'Inicie a conversa atual antes de criar uma nova.' : ''}
                    onClick={() => {
                      setConversations((convsRaw) => {
                        const convs = Array.isArray(convsRaw) ? convsRaw : [];
                        const nova = {
                          id: uuid(),
                          title: 'Nova conversa',
                          messages: [{ from: 'bot', text: saudacao }],
                          createdAt: Date.now(),
                        };
                        // Garante que todas as conversas tenham um array messages
                        const next = [...convs].map(c => ({ ...c, messages: Array.isArray(c.messages) ? c.messages : [] }));
                        next.push(nova);
                        persistConversations(next);
                        setActiveIdx(next.length - 1);
                        return next;
                      });
                    }}
                  >+ Nova conversa</Button>
                </div>
              </div>
            )}
          </div>
          {/* Conteúdo principal do chat */}
          <div className="flex-1 flex flex-col bg-white rounded-r-lg shadow-inner">
            <div
              className="flex-1 flex flex-col p-4 overflow-y-auto min-h-[120px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{ maxHeight: fullScreen ? 'calc(100vh - 220px)' : '40vh' }}
            >
              {Array.isArray(messages) && messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div key={i} className={`mb-2 flex ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`rounded-lg px-3 py-2 text-sm ${msg.from === 'bot' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center text-lg font-semibold mb-4">Digite iniciar nova conversa</div>
              )}
            </div>
            {/* Sugestões e ações em um acordeon */}
            <Accordion type="single" collapsible className="px-6 pt-2">
              <AccordionItem value="sugestoes">
                <AccordionTrigger className="text-xs font-semibold">Sugestão</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {sugestoes.map((s, i) => (
                      <Button
                        key={i}
                        type="button"
                        className="px-1 py-0.5 text-[10px] h-6 min-h-0 rounded-full border border-blue-400 text-blue-700 bg-white hover:bg-blue-50 transition-all"
                        onClick={() => {
                          sendMessageWithValue(s);
                        }}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      className="px-1 py-0.5 text-[10px] h-6 min-h-0 rounded-full border border-blue-400 text-blue-700 bg-white hover:bg-blue-50 transition-all"
                      onClick={() => {
                        if (fluxo) {
                          adicionarMensagemBot('Já existe um cadastro em andamento. Finalize ou cancele antes de iniciar outro.');
                          return;
                        }
                        setFluxo({ etapa: 0, respostas: {}, tipo: 'cidadao', conversaId: conversations[activeIdx]?.id });
                        adicionarMensagemUser('Novo cidadão');
                        adicionarMensagemBot('Iniciando cadastro de cidadão. ' + etapasCidadao[0].pergunta);
                      }}
                      disabled={!!fluxo}
                      title={fluxo ? 'Finalize o cadastro atual antes de iniciar outro.' : ''}
                    >
                      + Novo Cidadão
                    </Button>
                    <Button
                      type="button"
                      className="px-1 py-0.5 text-[10px] h-6 min-h-0 rounded-full border border-pink-400 text-pink-700 bg-white hover:bg-pink-50 transition-all"
                      onClick={() => { sendMessageWithValue('Nova visita cidadão'); }}
                      disabled={!!fluxo}
                      title={fluxo ? 'Finalize o cadastro atual antes de iniciar outro.' : ''}
                    >
                      + Visita Cidadão
                    </Button>
                    <Button
                      type="button"
                      className="px-1 py-0.5 text-[10px] h-6 min-h-0 rounded-full border border-yellow-400 text-yellow-700 bg-white hover:bg-yellow-50 transition-all"
                      onClick={() => { sendMessageWithValue('Nova visita família'); }}
                      disabled={!!fluxo}
                      title={fluxo ? 'Finalize o cadastro atual antes de iniciar outro.' : ''}
                    >
                      + Visita Família
                    </Button>
                    <Button
                      type="button"
                      className="px-1 py-0.5 text-[10px] h-6 min-h-0 rounded-full border border-gray-400 text-gray-700 bg-white hover:bg-gray-50 transition-all"
                      onClick={() => { sendMessageWithValue('Nova visita imóvel'); }}
                      disabled={!!fluxo}
                      title={fluxo ? 'Finalize o cadastro atual antes de iniciar outro.' : ''}
                    >
                      + Visita Imóvel
                    </Button>
                    <Button
                      type="button"
                      className="px-1 py-0.5 text-[10px] h-6 min-h-0 rounded-full border border-purple-400 text-purple-700 bg-white hover:bg-purple-50 transition-all"
                      onClick={() => { sendMessageWithValue('Nova rua'); }}
                      disabled={!!fluxo}
                      title={fluxo ? 'Finalize o cadastro atual antes de iniciar outro.' : ''}
                    >
                      + Nova Rua
                    </Button>
                    <Button
                      type="button"
                      className="px-1 py-0.5 text-[10px] h-6 min-h-0 rounded-full border border-green-400 text-green-700 bg-white hover:bg-green-50 transition-all"
                      onClick={() => { sendMessageWithValue('Sincronizar dados'); }}
                      disabled={bufferSincronizacao.relatorios.length === 0 || !!fluxo}
                      title={bufferSincronizacao.relatorios.length === 0 ? 'Nenhum dado novo para sincronizar.' : ''}
                    >
                      ⟳ Sincronizar dados
                    </Button>
                    <Button
                      type="button"
                      className="px-1 py-0.5 text-[10px] h-6 min-h-0 rounded-full border border-orange-400 text-orange-700 bg-white hover:bg-orange-50 transition-all"
                      onClick={() => { sendMessageWithValue('Gerar relatório'); }}
                      disabled={!!fluxo}
                      title={fluxo ? 'Finalize o cadastro atual antes de gerar relatório.' : ''}
                    >
                      📄 Gerar relatório
                    </Button>
                    {bufferSincronizacao.ultimaSincronizacao && (
                      <span className="ml-2 text-[10px] text-gray-500">Última sync: {bufferSincronizacao.ultimaSincronizacao}</span>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* Caixa de digitação */}
            <div className="flex gap-2 px-6 pt-2 pb-1 items-end">
              <input
                className="flex-1 border rounded px-2 py-1"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Digite sua mensagem..."
              />
              <Button onClick={sendMessage} type="button">Enviar</Button>
            </div>
            {/* Aviso de privacidade estilizado */}
            <div className="px-6 pb-3 pt-1">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-2 rounded text-xs">
                Aviso de Privacidade: Seus dados são processados localmente e sincronizados apenas com consentimento. Ao continuar, você concorda com o uso responsável e auditável das informações.
              </div>
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>
      
      {/* Assistente ACS Especializado */}
      <AssistenteACS 
        open={assistenteACSOpen} 
        onOpenChange={setAssistenteACSOpen} 
      />
    </>
  );
}
