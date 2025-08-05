import React, { useState, useEffect } from 'react';
import { workflows as workflowsOrig, Workflow } from '../chatbot/workflows';

export default function ChatbotConfig() {
  const [fluxos, setFluxos] = useState<Workflow[]>(workflowsOrig);
  const [selected, setSelected] = useState<number | null>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [dirty, setDirty] = useState(false);

  const salvarRascunho = () => setDirty(true);
  const publicar = () => setDirty(false);

  useEffect(() => {
    const saved = localStorage.getItem('chatbot_api_url');
    if (saved) setApiUrl(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatbot_api_url', apiUrl);
  }, [apiUrl]);

  return (
    <div className="flex flex-row max-w-6xl mx-auto p-6 gap-8">
      {/* Painel principal */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-4">
          Configuração de Workflows do Chatbot
          {dirty && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Alterações não publicadas</span>}
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Endpoint da API dos Workflows:
            <span className="ml-1 text-gray-400 cursor-pointer" title="Exemplo: https://api.seusistema.com/api/chatbot_workflows">ⓘ</span>
          </label>
          <input
            className="w-full border rounded px-2 py-1 text-sm mb-2"
            type="text"
            placeholder="https://api.seusistema.com/api/chatbot_workflows"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
          />
          <span className="text-xs text-gray-500">Configure aqui o endereço da API que será consumido pelo ChatbotACS.</span>
        </div>
        <div className="mb-6 flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setFluxos([...fluxos, { id: `novo${Date.now()}`, nome: 'Novo Fluxo', etapas: [] }])}>
            + Novo Workflow
          </button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={salvarRascunho}>
            Salvar Rascunho
          </button>
          <button className="bg-green-700 text-white px-4 py-2 rounded" onClick={publicar} disabled={!dirty}>
            Publicar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fluxos.map((fluxo, idx) => (
            <div key={fluxo.id} className={`border rounded p-4 ${selected === idx ? 'border-blue-500' : 'border-gray-200'}`}
              onClick={() => setSelected(idx)}>
              <h2 className="font-semibold text-lg mb-2">{fluxo.nome}</h2>
              <p className="text-xs text-gray-500 mb-2">{fluxo.descricao}</p>
              <ul className="text-sm">
                {fluxo.etapas.map((etapa, i) => (
                  <li key={i} className="mb-1">{i + 1}. {etapa.pergunta} {etapa.obrigatorio && <span className="text-red-500">*</span>}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {selected !== null && fluxos[selected] && (
          <div className="mt-8 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Editar Workflow: <input className="font-semibold text-lg border-b bg-transparent outline-none" value={fluxos[selected].nome} onChange={e => {
              const n = e.target.value;
              setFluxos(f => f.map((w, i) => i === selected ? { ...w, nome: n } : w));
            }} /></h3>
            <input className="w-full border-b mb-2 bg-transparent outline-none text-sm" placeholder="Descrição" value={fluxos[selected].descricao || ''} onChange={e => {
              const d = e.target.value;
              setFluxos(f => f.map((w, i) => i === selected ? { ...w, descricao: d } : w));
            }} />
            <h4 className="font-semibold mt-4 mb-2">Etapas</h4>
            {/* Cabeçalho das colunas */}
            <div className="flex items-center gap-2 mb-1 font-semibold text-xs text-gray-700">
              <span className="w-32">Key</span>
              <span className="flex-1">Pergunta</span>
              <span className="w-20">Obrigatório</span>
              <span className="w-24">Validação</span>
              <span className="w-20">Ações</span>
            </div>
            <ul className="mb-2">
              {fluxos[selected].etapas.map((etapa, i) => (
                <li key={i} className="flex items-center gap-2 mb-1">
                  <input className="border rounded px-1 text-xs w-32" value={etapa.key} placeholder="key" title="Identificador único da etapa. Ex: nome, cpf, endereco" onChange={e => {
                    const v = e.target.value;
                    setFluxos(f => f.map((w, wi) => wi === selected ? { ...w, etapas: w.etapas.map((et, ei) => ei === i ? { ...et, key: v } : et) } : w));
                  }} />
                  <input className="border rounded px-1 text-xs flex-1" value={etapa.pergunta} placeholder="Pergunta" title="Pergunta exibida ao usuário. Ex: Qual o nome completo?" onChange={e => {
                    const v = e.target.value;
                    setFluxos(f => f.map((w, wi) => wi === selected ? { ...w, etapas: w.etapas.map((et, ei) => ei === i ? { ...et, pergunta: v } : et) } : w));
                  }} />
                  <label className="text-xs flex items-center gap-1 w-20"><input type="checkbox" checked={!!etapa.obrigatorio} onChange={e => {
                    const v = e.target.checked;
                    setFluxos(f => f.map((w, wi) => wi === selected ? { ...w, etapas: w.etapas.map((et, ei) => ei === i ? { ...et, obrigatorio: v } : et) } : w));
                  }} />Obrigatório</label>
                  <input className="border rounded px-1 text-xs w-24" value={etapa.validacao || ''} placeholder="Validação" title="Exemplo: min:3, cpf, data, regex, etc." onChange={e => {
                    const v = e.target.value;
                    setFluxos(f => f.map((w, wi) => wi === selected ? { ...w, etapas: w.etapas.map((et, ei) => ei === i ? { ...et, validacao: v } : et) } : w));
                  }} />
                  <button className="text-xs text-red-600 px-2 w-20" onClick={() => {
                    setFluxos(f => f.map((w, wi) => wi === selected ? { ...w, etapas: w.etapas.filter((_, ei) => ei !== i) } : w));
                  }}>Remover</button>
                </li>
              ))}
            </ul>
            <button className="bg-green-600 text-white px-2 py-1 rounded text-xs" onClick={() => {
              setFluxos(f => f.map((w, wi) => wi === selected ? { ...w, etapas: [...w.etapas, { key: '', pergunta: '', obrigatorio: false }] } : w));
            }}>+ Adicionar Etapa</button>
          </div>
        )}
      </div>
      {/* Painel lateral de referência */}
      <div className="w-80 min-w-[18rem] max-w-xs bg-gray-50 border-l border-gray-200 rounded p-4 flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2 text-blue-700">Referências & Exemplos</h2>
        <div className="text-xs text-gray-700 mb-2">
          <b>Exemplo de endpoint:</b><br />
          <code>https://api.seusistema.com/api/chatbot_workflows</code>
        </div>
        <div className="text-xs text-gray-700 mb-2">
          <b>Exemplo de workflow:</b>
          <pre className="bg-white border rounded p-2 mt-1 overflow-x-auto text-[11px]">{`{
  id: 'cadastroCidadao',
  nome: 'Cadastro de Cidadão',
  descricao: 'Fluxo para cadastrar um novo cidadão',
  etapas: [
    { key: 'nome', pergunta: 'Qual o nome completo?', obrigatorio: true, validacao: 'min:3' },
    { key: 'cpf', pergunta: 'Qual o CPF?', obrigatorio: true, validacao: 'cpf' },
    { key: 'dataNascimento', pergunta: 'Qual a data de nascimento?', obrigatorio: true, validacao: 'data' }
  ]
}`}</pre>
        </div>
        <div className="text-xs text-gray-700 mb-2">
          <b>Dicas rápidas:</b>
          <ul className="list-disc ml-4 mt-1">
            <li>Use <b>key</b> como identificador único da etapa.</li>
            <li>O campo <b>validação</b> pode ser: <code>min:3</code>, <code>cpf</code>, <code>data</code>, <code>regex</code>, etc.</li>
            <li>Você pode importar fluxos prontos ou clonar exemplos.</li>
            <li>Campos obrigatórios são marcados com <span className="text-red-500">*</span>.</li>
          </ul>
        </div>
        <div className="text-xs text-gray-700">
          <b>Inspiração visual:</b>
          <div className="flex gap-2 mt-2">
            <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Workflow</span>
            <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Etapa</span>
            <span className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">Validação</span>
          </div>
          <div className="mt-2 text-gray-500">Visualize cada etapa como um "card" (como no n8n) para facilitar a organização.</div>
        </div>
      </div>
    </div>
  );
}