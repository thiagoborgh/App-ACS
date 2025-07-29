import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import React, { useState, useRef, useEffect } from 'react';
import { processarPerguntaACS } from './processarPerguntaACS';

export default function ChatbotACS() {
  // --- FLUXOS GUIADOS ADICIONAIS ---
  const etapasVisitaCidadao = [
    { key: 'cidadao', pergunta: 'Nome do cidadão visitado?', obrigatorio: true },
    { key: 'visitaRealizada', pergunta: 'Visita realizada? (Sim/Não)', obrigatorio: true },
    { key: 'motivo', pergunta: 'Motivo da visita?', obrigatorio: true },
    { key: 'concluir', pergunta: 'Digite "Sim" para concluir a visita.', obrigatorio: true },
  ];
  const etapasVisitaFamilia = [
    { key: 'familia', pergunta: 'Nome da família visitada?', obrigatorio: true },
    { key: 'visitaRealizada', pergunta: 'Visita realizada? (Sim/Não)', obrigatorio: true },
    { key: 'motivo', pergunta: 'Motivo da visita?', obrigatorio: true },
    { key: 'concluir', pergunta: 'Digite "Sim" para concluir a visita.', obrigatorio: true },
  ];
  const etapasVisitaImovel = [
    { key: 'imovel', pergunta: 'Identificação do imóvel?', obrigatorio: true },
    { key: 'visitaRealizada', pergunta: 'Visita realizada? (Sim/Não)', obrigatorio: true },
    { key: 'motivo', pergunta: 'Motivo da visita?', obrigatorio: true },
    { key: 'concluir', pergunta: 'Digite "Sim" para concluir a visita.', obrigatorio: true },
  ];
  const etapasRua = [
    { key: 'nomeRua', pergunta: 'Nome da rua?', obrigatorio: true },
    { key: 'bairro', pergunta: 'Bairro?', obrigatorio: true },
    { key: 'cep', pergunta: 'CEP?', obrigatorio: false },
    { key: 'tipoLogradouro', pergunta: 'Tipo de logradouro?', obrigatorio: true },
    { key: 'concluir', pergunta: 'Digite "Sim" para concluir o cadastro.', obrigatorio: true },
  ];

  function iniciarFluxo(tipo: string) {
    let etapa = 0;
    let etapas;
    if (tipo === 'visitaCidadao') etapas = etapasVisitaCidadao;
    else if (tipo === 'visitaFamilia') etapas = etapasVisitaFamilia;
    else if (tipo === 'visitaImovel') etapas = etapasVisitaImovel;
    else if (tipo === 'rua') etapas = etapasRua;
    else return;
    setFluxo({ etapa, respostas: {}, tipo, conversaId: conversations[activeIdx]?.id });
    setConversations(convs => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      conv.messages = [...conv.messages, { from: 'bot', text: `Iniciando fluxo de ${tipo.replace('visita','visita ').replace('Cidadao','Cidadão').replace('Familia','Família').replace('Imovel','Imóvel')}. ${etapas[0].pergunta}` }];
      convsCopy[activeIdx] = conv;
      return convsCopy;
    });
    setInput('');
  }

  function validarEtapaFluxo(tipo: string, key: string, val: string) {
    if (key === 'cidadao' || key === 'familia' || key === 'imovel' || key === 'nomeRua' || key === 'bairro' || key === 'tipoLogradouro') return val && val.length >= 3;
    if (key === 'visitaRealizada') return ['sim','não','nao','s','n'].includes(val.toLowerCase());
    if (key === 'motivo') return val && val.length >= 3;
    if (key === 'cep') return !val || /^\d{5}-?\d{3}$/.test(val);
    if (key === 'concluir') return ['sim','s'].includes(val.toLowerCase());
    return true;
  }

  function processarFluxoGenerico(inputValue: string) {
    if (!fluxo) return;
    let etapas;
    if (fluxo.tipo === 'visitaCidadao') etapas = etapasVisitaCidadao;
    else if (fluxo.tipo === 'visitaFamilia') etapas = etapasVisitaFamilia;
    else if (fluxo.tipo === 'visitaImovel') etapas = etapasVisitaImovel;
    else if (fluxo.tipo === 'rua') etapas = etapasRua;
    else return;
    const etapaAtual = etapas[fluxo.etapa];
    const val = inputValue.trim();
    if (etapaAtual.obrigatorio && !val) {
      adicionarMensagemBot('Este campo é obrigatório. ' + etapaAtual.pergunta);
      setInput('');
      return;
    }
    if (!validarEtapaFluxo(fluxo.tipo, etapaAtual.key, val)) {
      adicionarMensagemBot('Valor inválido para ' + etapaAtual.key + '. ' + etapaAtual.pergunta);
      setInput('');
      return;
    }
    const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: val };
    if (fluxo.etapa < etapas.length - 1) {
      setFluxo({ ...fluxo, etapa: fluxo.etapa + 1, respostas: novaResposta });
      adicionarMensagemUser(inputValue);
      setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapas.length}: ${etapas[fluxo.etapa + 1].pergunta}`), 400);
    } else {
      adicionarMensagemUser(inputValue);
      adicionarMensagemBot('Fluxo concluído! Dados salvos localmente.');
      setFluxo(null);
    }
    setInput('');
  }
  // --- FLUXO GUIADO DE CADASTRO DE CIDADÃO ---
  const etapasCidadao = [
    { key: 'nome', pergunta: 'Qual o nome completo do cidadão?', obrigatorio: true },
    { key: 'cpf', pergunta: 'Qual o CPF?', obrigatorio: true },
    { key: 'dataNascimento', pergunta: 'Qual a data de nascimento? (dd/mm/aaaa)', obrigatorio: true },
    { key: 'sexo', pergunta: 'Sexo (Masculino, Feminino, Outro)?', obrigatorio: true },
    { key: 'nomeMae', pergunta: 'Nome da mãe?', obrigatorio: false },
    { key: 'cns', pergunta: 'CNS (Cartão SUS)?', obrigatorio: false },
    { key: 'endereco', pergunta: 'Endereço completo?', obrigatorio: true },
  ];
  const [fluxo, setFluxo] = useState<{ etapa: number; respostas: any; tipo: string; conversaId?: string } | null>(null);

  // Validação simples por etapa
  function validarEtapaCidadao(key: string, val: string) {
    if (key === 'nome') return val && val.length >= 3 && !/\d/.test(val);
    if (key === 'cpf') return /^\d{11}$/.test(val.replace(/\D/g, ''));
    if (key === 'dataNascimento') {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return false;
      const [d, m, a] = val.split('/').map(Number);
      const data = new Date(a, m-1, d);
      return data.getFullYear() === a && data.getMonth() === m-1 && data.getDate() === d && data <= new Date();
    }
    if (key === 'sexo') return ['masculino','feminino','outro','m','f','o'].includes(val.toLowerCase());
    if (key === 'nomeMae') return !val || val.length >= 3;
    if (key === 'cns') return !val || /^\d{15}$/.test(val);
    if (key === 'endereco') return val && val.length >= 5;
    return true;
  }

  // Função para iniciar o fluxo guiado
  function iniciarCadastroCidadao() {
    setFluxo({ etapa: 0, respostas: {}, tipo: 'cidadao', conversaId: conversations[activeIdx]?.id });
    setConversations(convs => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      conv.messages = [...conv.messages, { from: 'bot', text: 'Iniciando cadastro de cidadão. ' + etapasCidadao[0].pergunta }];
      convsCopy[activeIdx] = conv;
      return convsCopy;
    });
    setInput('');
  }

  // Função para processar resposta do fluxo guiado
  function processarFluxoCidadao(inputValue: string) {
    if (!fluxo) return;
    const etapaAtual = etapasCidadao[fluxo.etapa];
    const val = inputValue.trim();
    if (etapaAtual.obrigatorio && !val) {
      adicionarMensagemBot('Este campo é obrigatório. ' + etapaAtual.pergunta);
      setInput('');
      return;
    }
    if (!validarEtapaCidadao(etapaAtual.key, val)) {
      adicionarMensagemBot('Valor inválido para ' + etapaAtual.key + '. ' + etapaAtual.pergunta);
      setInput('');
      return;
    }
    const novaResposta = { ...fluxo.respostas, [etapaAtual.key]: val };
    if (fluxo.etapa < etapasCidadao.length - 1) {
      setFluxo({ ...fluxo, etapa: fluxo.etapa + 1, respostas: novaResposta });
      adicionarMensagemUser(inputValue);
      setTimeout(() => adicionarMensagemBot(`Etapa ${fluxo.etapa + 2} de ${etapasCidadao.length}: ${etapasCidadao[fluxo.etapa + 1].pergunta}`), 400);
    } else {
      adicionarMensagemUser(inputValue);
      adicionarMensagemBot('Cadastro de cidadão concluído! Dados salvos localmente.');
      // Aqui pode salvar no localStorage ou outro local
      setFluxo(null);
    }
    setInput('');
  }

  // Funções auxiliares para adicionar mensagens
  function adicionarMensagemBot(text: string) {
    setConversations(convs => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      conv.messages = [...conv.messages, { from: 'bot', text }];
      convsCopy[activeIdx] = conv;
      return convsCopy;
    });
  }
  function adicionarMensagemUser(text: string) {
    setConversations(convs => {
      const convsCopy = [...convs];
      const conv = { ...convsCopy[activeIdx] };
      conv.messages = [...conv.messages, { from: 'user', text }];
      convsCopy[activeIdx] = conv;
      return convsCopy;
    });
  }

  // --- HOOKS E REFS ---
  const [input, setInput] = useState('');
  type Message = { from: 'bot' | 'user' | 'alerta', text: string };
  type Conversation = { id: string; title: string; messages: Message[] };
  // --- DADOS MOCKADOS E PERMISSÕES ---
  let dadosCidadaos: any[] = [];
  try {
    const local = localStorage.getItem('cadastrosCidadao');
    if (local) {
      dadosCidadaos = JSON.parse(local);
    } else {
      dadosCidadaos = [
        {
          nome: 'João Silva',
          cpf: '123',
          cns: '11122233344',
          condicoes: ['hipertensão'],
          responsavel: 'Maria Souza',
          recusa: false,
          situacaoRua: false
        },
        {
          nome: 'Maria Souza',
          cpf: '456',
          cns: '55566677788',
          condicoes: ['diabetes'],
          responsavel: 'João Silva',
          recusa: true,
          situacaoRua: false
        }
      ];
    }
  } catch {}

  let permissoes: { condicoes: boolean; dadosGestao: boolean } = { condicoes: true, dadosGestao: false };
  try {
    const local = localStorage.getItem('permissoesUsuario');
    if (local) {
      permissoes = JSON.parse(local);
    }
  } catch {}

  const [conversations, setConversations] = useState<Conversation[]>([{
    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    title: 'Nova conversa',
    messages: [{ from: 'bot', text: 'Olá! Eu sou o Assistente ACS. Como posso ajudar você hoje?' }]
  }]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- FUNÇÕES AUXILIARES ---
  function logAcessoNegado(tipo: string, campo: string) {
    setConversations(convs => {
                const convsCopy = [...convs];
                const conv = { ...convsCopy[activeIdx] };
                conv.messages = [...conv.messages, { from: 'alerta', text: `ALERTA: Tentativa de acesso não autorizado ao campo "${campo}" [${tipo}]` }];
                convsCopy[activeIdx] = conv;
                return convsCopy;
              });
            }

            function handleSend() {
              if (!input.trim()) return;
              // Se estiver em fluxo guiado de cidadão, processa o fluxo
              if (fluxo) {
                // Comando de cancelar fluxo
                if (/^(cancela|cancelar|anula|anular|sair)$/i.test(input.trim())) {
                  adicionarMensagemUser(input);
                  adicionarMensagemBot('Fluxo cancelado.');
                  setFluxo(null);
                  setInput('');
                  return;
                }
                if (fluxo.tipo === 'cidadao') {
                  processarFluxoCidadao(input);
                  return;
                } else {
                  processarFluxoGenerico(input);
                  return;
                }
              }
              // Comandos customizados
              const cmd = input.trim().toLowerCase();
              let respostaCmd = '';
              if (cmd === 'meus atendimentos') {
                respostaCmd = 'Você possui 2 atendimentos hoje: João Silva (09:00), Maria Souza (14:00).';
              } else if (/^agendar visita para (.+) amanh[aã]$/i.test(input.trim())) {
                const nome = input.trim().match(/^agendar visita para (.+) amanh[aã]$/i)?.[1] || 'Paciente';
                respostaCmd = `Visita para ${nome} agendada para amanhã às 10:00.`;
              } else if (cmd === 'resumo de hoje') {
                respostaCmd = 'Resumo de hoje: 2 atendimentos realizados, 1 visita agendada, 0 pendências.';
              } else if (cmd === 'ajuda') {
                respostaCmd = 'Comandos disponíveis: Meus atendimentos, Agendar visita para [nome] amanhã, Resumo de hoje, Ver auditoria, + Novo Cidadão, + Visita Cidadão, + Visita Família, + Visita Imóvel, + Nova Rua, ⟳ Sincronizar dados, 📄 Gerar relatório.';
              } else if (cmd === 'ver auditoria') {
                respostaCmd = 'Últimas ações: Cadastro de João Silva, Visita a Maria Souza, Sincronização realizada.';
              } else if (cmd === '+ novo cidadão') {
                iniciarCadastroCidadao();
                setInput('');
                return;
              } else if (cmd === '+ visita cidadão') {
                iniciarFluxo('visitaCidadao');
                setInput('');
                return;
              } else if (cmd === '+ visita família' || cmd === '+ visita familia') {
                iniciarFluxo('visitaFamilia');
                setInput('');
                return;
              } else if (cmd === '+ visita imóvel' || cmd === '+ visita imovel') {
                iniciarFluxo('visitaImovel');
                setInput('');
                return;
              } else if (cmd === '+ nova rua') {
                iniciarFluxo('rua');
                setInput('');
                return;
              } else if (cmd === '⟳ sincronizar dados' || cmd === 'sincronizar dados') {
                respostaCmd = 'Sincronização iniciada. Todos os dados locais serão enviados ao servidor.';
              } else if (cmd === '📄 gerar relatório' || cmd === 'gerar relatório' || cmd === 'gerar relatorio') {
                respostaCmd = 'Relatório gerado com sucesso. Você pode baixá-lo em PDF.';
              }
              if (respostaCmd) {
                setConversations(convs => {
                  const convsCopy = [...convs];
                  const conv = { ...convsCopy[activeIdx] };
                  if (!conv.messages.some(m => m.from === 'user')) {
                    const palavras = input.trim().split(/\s+/).slice(0, 2);
                    const titulo = palavras.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
                    conv.title = titulo || 'Nova conversa';
                  }
                  conv.messages = [...conv.messages, { from: 'user', text: input }, { from: 'bot', text: respostaCmd }];
                  convsCopy[activeIdx] = conv;
                  return convsCopy;
                });
                setInput('');
                setTimeout(() => { inputRef.current?.focus(); }, 100);
                return;
              }
              // Caso contrário, segue lógica normal
              setConversations(convs => {
                const convsCopy = [...convs];
                const conv = { ...convsCopy[activeIdx] };
                if (!conv.messages.some(m => m.from === 'user')) {
                  const palavras = input.trim().split(/\s+/).slice(0, 2);
                  const titulo = palavras.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
                  conv.title = titulo || 'Nova conversa';
                }
                conv.messages = [...conv.messages, { from: 'user', text: input }];
                convsCopy[activeIdx] = conv;
                return convsCopy;
              });
              setLoading(true);
              setTimeout(() => {
                const resposta = processarPerguntaACS({
                  pergunta: input,
                  dadosCidadaos,
                  permissoes,
                  logAcessoNegado
                });
                setConversations(convs => {
                  const convsCopy = [...convs];
                  const conv = { ...convsCopy[activeIdx] };
                  if (resposta.startsWith('ALERTA:')) {
                    conv.messages = [...conv.messages, { from: 'alerta', text: resposta }];
                  } else {
                    conv.messages = [...conv.messages, { from: 'bot', text: resposta }];
                  }
                  convsCopy[activeIdx] = conv;
                  return convsCopy;
                });
                setLoading(false);
              }, 700);
              setInput('');
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }

            useEffect(() => {
              localStorage.setItem('chatbotACS_convs', JSON.stringify(conversations));
            }, [conversations]);

            useEffect(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, [conversations, activeIdx, loading]);

            useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // --- RENDER ---
  const [fullScreen, setFullScreen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const messages = conversations[activeIdx]?.messages || [];

  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-50 bg-white flex flex-col'
          : 'w-full h-full flex flex-col bg-white'
      }
      style={
        fullScreen
          ? { width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none', borderRadius: 0, margin: 0, boxShadow: 'none', zIndex: 50 }
          : { width: '100%', height: '100%', minHeight: 0, minWidth: 0, borderRadius: 0, boxShadow: 'none', margin: 0, padding: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
      }
    >
      {/* Barra superior do chat logo abaixo do AppHeader */}
      <div className="sticky top-[56px] z-40 w-full flex items-center justify-between" style={{background: 'linear-gradient(90deg, #8f36ff 0%, #2563eb 100%)', minHeight: 48}}>
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
        <div className="flex items-center gap-2 px-6 py-4 flex-1">
          <button
            className="mr-2 p-1 rounded text-white hover:bg-white/10 focus:bg-white/20"
            title={fullScreen ? 'Voltar para modal' : 'Expandir para tela cheia'}
            onClick={() => setFullScreen(v => !v)}
            style={{ transition: 'background 0.2s' }}
          >
            {fullScreen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M5 7L7 7L7 5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15 7L13 7L13 5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 13L7 13L7 15" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15 13L13 13L13 15" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M7 7L7 5L5 5L5 7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13 7L13 5L15 5L15 7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 13L7 15L5 15L5 13" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13 13L13 15L15 15L15 13" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
          </button>
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
          <span className="text-lg font-bold text-white tracking-wide" style={{letterSpacing: '0.04em'}}>Assistente ACS</span>
        </div>
      </div>
  <div className="flex flex-1 w-full min-h-0" style={{flexDirection: 'row', height: '100%'}}>
        {/* Sidebar de conversas */}
        <div
          className={`transition-all duration-300 bg-gray-50 border-r border-gray-200 h-full flex flex-col ${showHistory ? 'w-48 min-w-[10rem] md:w-64 md:min-w-[16rem]' : 'w-8 min-w-[2rem]'} overflow-y-auto`}
          style={{maxWidth: showHistory ? 260 : 32, height: '100%', paddingTop: 48}}
        >
          {showHistory && (
            <div className="flex-1 px-2 py-2">
              <div className="flex flex-col gap-1">
                {Array.isArray(conversations) && conversations.map((conv, idx) => (
                  <div key={conv.id} className="relative group flex items-center">
                    <button
                      className={`w-full justify-start text-xs py-1 px-2 mb-1 rounded pr-7 ${idx === activeIdx ? 'bg-blue-100' : 'bg-white border border-gray-200'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveIdx(idx)}
                    >
                      {conv.title || `Conversa ${idx + 1}`}
                    </button>
                    {/* Permitir excluir qualquer conversa, inclusive a primeira */}
                    <button
                      className="absolute right-2 top-1 text-xs text-gray-400 hover:text-red-600 font-bold bg-transparent border-none p-0 m-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Excluir conversa"
                      onClick={e => {
                        e.stopPropagation();
                        setConversations((convs) => {
                          const next = convs.filter((_, i) => i !== idx);
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
                <button
                  className="w-full justify-start text-xs py-1 px-2 mt-2 rounded border-dashed border-2 border-blue-300 text-blue-700 bg-white hover:bg-blue-50"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setConversations((convsRaw) => {
                      const convs = Array.isArray(convsRaw) ? convsRaw : [];
                      const nova = {
                        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2),
                        title: 'Nova conversa',
                        messages: [{ from: 'bot' as 'bot', text: 'Olá! Eu sou o Assistente ACS. Como posso ajudar você hoje?' }],
                      };
                      const next = [...convs].map(c => ({ ...c, messages: Array.isArray(c.messages) ? c.messages : [] }));
                      next.push(nova);
                      setActiveIdx(next.length - 1);
                      return next;
                    });
                  }}
                >+ Nova conversa</button>
              </div>
            </div>
          )}
        </div>
    {/* Conteúdo principal do chat */}
  <div className="flex-1 flex flex-col bg-white min-w-0" style={{minHeight: 0, height: '100%', position: 'relative', paddingTop: 48}}>
          <div
            className="flex-1 flex flex-col p-2 md:p-4 overflow-y-auto min-h-0"
            style={{ maxHeight: '100%', minWidth: 0, overflowY: 'auto', marginBottom: 70 }}
          >
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((m, i) => {
                let style: React.CSSProperties = { padding: 8, borderRadius: 8, maxWidth: '85%', wordBreak: 'break-word', fontSize: 15 };
                if (m.from === 'bot') style = { ...style, background: '#e3f0ff', color: '#1a237e', alignSelf: 'flex-start', boxShadow: '0 1px 4px #90caf940' };
                if (m.from === 'user') style = { ...style, background: '#e0f7fa', color: '#006064', alignSelf: 'flex-end', textAlign: 'right', boxShadow: '0 1px 4px #00bcd440' };
                if (m.from === 'alerta') style = { ...style, background: '#fffde7', color: '#b26a00', border: '1px solid #ffe082', fontWeight: 600, alignSelf: 'center', textAlign: 'center' };
                return <div key={i} style={style}>{m.text}</div>;
              })
            ) : (
              <div className="text-gray-400 text-center text-lg font-semibold mb-4">Digite iniciar nova conversa</div>
            )}
            {loading && (
              <div style={{ background: '#e3f0ff', color: '#1a237e', alignSelf: 'flex-start', padding: 8, borderRadius: 8, fontStyle: 'italic' }}>
                Digitando...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
          {/* Caixa de digitação */}
          {/* Todos os comandos dentro do Accordion de sugestão, sem repetição */}
          {!fluxo && (
            <div className="px-2 md:px-6 pb-1 pt-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="sugestoes">
                  <AccordionTrigger className="text-xs font-semibold">Sugestão</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button type="button" className="px-2 py-1 text-xs rounded border border-blue-400 text-blue-700 bg-white hover:bg-blue-50 transition" onClick={iniciarCadastroCidadao}>+ Novo Cidadão</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-pink-400 text-pink-700 bg-white hover:bg-pink-50 transition" onClick={() => iniciarFluxo('visitaCidadao')}>+ Visita Cidadão</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-yellow-400 text-yellow-700 bg-white hover:bg-yellow-50 transition" onClick={() => iniciarFluxo('visitaFamilia')}>+ Visita Família</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-gray-400 text-gray-700 bg-white hover:bg-gray-50 transition" onClick={() => iniciarFluxo('visitaImovel')}>+ Visita Imóvel</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-purple-400 text-purple-700 bg-white hover:bg-purple-50 transition" onClick={() => iniciarFluxo('rua')}>+ Nova Rua</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition" onClick={() => { setInput('Meus atendimentos'); setTimeout(() => handleSend(), 100); }}>Meus atendimentos</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition" onClick={() => { setInput('Agendar visita para João amanhã'); setTimeout(() => handleSend(), 100); }}>Agendar visita para João amanhã</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition" onClick={() => { setInput('Resumo de hoje'); setTimeout(() => handleSend(), 100); }}>Resumo de hoje</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition" onClick={() => { setInput('Ajuda'); setTimeout(() => handleSend(), 100); }}>Ajuda</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition" onClick={() => { setInput('Ver auditoria'); setTimeout(() => handleSend(), 100); }}>Ver auditoria</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition" onClick={() => { setInput('⟳ Sincronizar dados'); setTimeout(() => handleSend(), 100); }}>⟳ Sincronizar dados</button>
                      <button type="button" className="px-2 py-1 text-xs rounded border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 transition" onClick={() => { setInput('📄 Gerar relatório'); setTimeout(() => handleSend(), 100); }}>📄 Gerar relatório</button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
          <form
            className="flex gap-2 px-2 md:px-6 pt-0 pb-1 items-end"
            style={{width: '100%', position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 10, borderTop: '1px solid #eee'}}
            onSubmit={e => { e.preventDefault(); handleSend(); }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua dúvida sobre cidadãos, condições, rua, etc."
              className="flex-1 border rounded px-2 py-2 text-base md:text-sm"
              style={{minWidth: 0}}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 md:py-1 font-semibold shadow hover:bg-blue-700 transition text-base md:text-sm"
              style={{minWidth: 80}}
            >Enviar</button>
          </form>
          {/* Aviso de privacidade */}
          <div className="px-2 md:px-6 pb-3 pt-1">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-2 rounded text-xs md:text-xs text-[11px]">
              Aviso de Privacidade: Seus dados são processados localmente e sincronizados apenas com consentimento. Ao continuar, você concorda com o uso responsável e auditável das informações.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
