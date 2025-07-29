import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Dados hardcoded para microregião 01 UBS MIRANTE DA MATA-Cotia
const visitasPendentes = [
  { id: 1, tipo: 'Cidadão', nome: 'Maria Silva', prioridade: 'Alta', endereco: 'Rua das Flores, 123', status: 'Pendente', microregiao: '01', bairro: 'Mirante da Mata' },
  { id: 2, tipo: 'Família', nome: 'Família Souza', prioridade: 'Média', endereco: 'Rua do Sol, 45', status: 'Pendente', microregiao: '01', bairro: 'Mirante da Mata' },
  { id: 3, tipo: 'Imóvel', nome: 'Imóvel 101', prioridade: 'Baixa', endereco: 'Rua da Esperança, 10', status: 'Pendente', microregiao: '01', bairro: 'Mirante da Mata' },
  { id: 4, tipo: 'Cidadão', nome: 'João Oliveira', prioridade: 'Alta', endereco: 'Rua das Flores, 150', status: 'Pendente', microregiao: '01', bairro: 'Mirante da Mata' },
  { id: 5, tipo: 'Família', nome: 'Família Lima', prioridade: 'Média', endereco: 'Rua do Sol, 60', status: 'Pendente', microregiao: '01', bairro: 'Mirante da Mata' },
  { id: 6, tipo: 'Imóvel', nome: 'Imóvel 202', prioridade: 'Baixa', endereco: 'Rua da Esperança, 20', status: 'Pendente', microregiao: '01', bairro: 'Mirante da Mata' },
];

// Regras de sugestão IA 30 (exemplo):
// 1. Prioridade Alta primeiro, depois Média, depois Baixa
// 2. Agrupar por proximidade de endereço (mesma rua)
// 3. Ordem otimizada para menor deslocamento (simulado)
function gerarRotaSugerida(visitas) {
  // Agrupa por rua
  const ruas = ['Rua das Flores', 'Rua do Sol', 'Rua da Esperança'];
  let rota = [];
  for (const rua of ruas) {
    const grupoRua = visitas.filter(v => v.endereco.startsWith(rua));
    // Ordena por prioridade dentro da rua
    const grupoOrdenado = [...grupoRua].sort((a, b) => {
      const prioridade = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
      return prioridade[a.prioridade] - prioridade[b.prioridade];
    });
    rota = rota.concat(grupoOrdenado);
  }
  return rota;
}

export default function PlanejamentoRoteiro() {
  const [roteiro, setRoteiro] = useState(visitasPendentes);
  const rotaSugerida = gerarRotaSugerida(visitasPendentes);

  // Placeholder: função para salvar roteiro
  function salvarRoteiro() {
    alert('Roteiro salvo localmente! (Funcionalidade MVP)');
  }

  // Função para inserir sugestão na lista de planejamento
  function inserirSugestaoRota() {
    setRoteiro(rotaSugerida);
  }
  // Placeholder: função para exportar roteiro
  function exportarRoteiro() {
    alert('Exportação de roteiro (PDF/relatório) será implementada.');
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planejamento de Roteiro de Visitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <strong>Visitas Pendentes (Microregião 01 - UBS MIRANTE DA MATA)</strong>
            <ul className="mt-2 space-y-2">
              {roteiro.map((v) => (
                <li key={v.id} className="flex flex-col md:flex-row md:items-center md:gap-4 p-2 border rounded bg-muted">
                  <span className="font-semibold">{v.tipo}:</span> <span>{v.nome}</span>
                  <span className="text-xs text-muted-foreground ml-2">{v.endereco}</span>
                  <span className="ml-auto text-xs">Prioridade: {v.prioridade}</span>
                  <span className="ml-4 text-xs">Status: {v.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="mt-4 flex flex-col md:flex-row gap-2">
            <Button onClick={salvarRoteiro}>Salvar Roteiro</Button>
            <Button variant="outline" onClick={exportarRoteiro}>Exportar</Button>
            <Button variant="secondary" disabled>Ajustar Manualmente (em breve)</Button>
          </div>
        </CardContent>
      </Card>
  {/* Apenas uma seção de Rota Sugerida (IA 30) deve existir. */}
      <Card>
        <CardHeader>
          <CardTitle>Rota Sugerida (IA 30)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-muted-foreground text-xs">Sugestão baseada em prioridade, agrupamento por rua e menor deslocamento (simulado).</div>
          <ol className="list-decimal ml-6 space-y-2">
            {rotaSugerida.map((v, idx) => (
              <li key={v.id} className="flex flex-col md:flex-row md:items-center md:gap-4 p-2 border rounded bg-blue-50">
                <span className="font-semibold">{v.tipo}:</span> <span>{v.nome}</span>
                <span className="text-xs text-muted-foreground ml-2">{v.endereco}</span>
                <span className="ml-auto text-xs">Prioridade: {v.prioridade}</span>
                <span className="ml-4 text-xs">Status: {v.status}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
