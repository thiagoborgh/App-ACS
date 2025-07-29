// Utilitário para processar perguntas do Chatbot ACS
import { Cidadao } from './ChatbotACS';

export type ProcessarPerguntaParams = {
  pergunta: string;
  dadosCidadaos: Cidadao[];
  permissoes: { condicoes: boolean; dadosGestao: boolean };
  logAcessoNegado: (tipo: string, campo: string) => void;
};

export function processarPerguntaACS({ pergunta, dadosCidadaos, permissoes, logAcessoNegado }: ProcessarPerguntaParams): string {
  // Suporte a múltiplas condições (ex: hipertensão e diabetes)
  const condicoesPergunta = [];
  if (/hipertens[aã]o/i.test(pergunta)) condicoesPergunta.push('hipertensão');
  if (/diabetes/i.test(pergunta)) condicoesPergunta.push('diabetes');
  // Adicione mais condições conforme necessário
  if (condicoesPergunta.length > 1) {
    if (!permissoes.condicoes) {
      logAcessoNegado('condicoes', condicoesPergunta.join(' e '));
      return 'Acesso não autorizado';
    }
    const encontrados = dadosCidadaos.filter(c => condicoesPergunta.every(cond => c.condicoes?.includes(cond)));
    if (encontrados.length === 0) return `Nenhum cidadão encontrado com ${condicoesPergunta.join(' e ')}.`;
    return encontrados.map(c => `${c.nome || 'Não informado'} (CPF: ${c.cpf || 'Não informado'})`).join(', ');
  }
  // Condição única
  if (condicoesPergunta.length === 1) {
    if (!permissoes.condicoes) {
      logAcessoNegado('condicoes', condicoesPergunta[0]);
      return 'Acesso não autorizado';
    }
    const encontrados = dadosCidadaos.filter(c => c.condicoes?.includes(condicoesPergunta[0]));
    if (encontrados.length === 0) return `Nenhum cidadão encontrado com ${condicoesPergunta[0]}.`;
    return encontrados.map(c => `${c.nome || 'Não informado'} (CPF: ${c.cpf || 'Não informado'})`).join(', ');
  }
  // Nome do responsável familiar
  if (/respons[aá]vel fam/i.test(pergunta)) {
    if (!permissoes.dadosGestao) {
      logAcessoNegado('dadosGestao', 'responsável familiar');
      return 'Acesso não autorizado';
    }
    // Supondo campo 'responsavel' no cadastro
    const nomes = dadosCidadaos.map(c => c.responsavel || 'Não informado');
    return 'Responsáveis familiares: ' + nomes.join(', ');
  }
  // Consulta por CPF
  if (/cpf\s*[:=]?\s*(\d{3,})/i.test(pergunta)) {
    const match = pergunta.match(/cpf\s*[:=]?\s*(\d{3,})/i);
    if (match) {
      const cid = dadosCidadaos.find(c => c.cpf === match[1]);
      if (!cid) return 'Cidadão não encontrado.';
      return `Nome: ${cid.nome || 'Não informado'}, CPF: ${cid.cpf}, Condições: ${(cid.condicoes||[]).join(', ') || 'Não informado'}`;
    }
  }
  // Consulta por CNS
  if (/cns\s*[:=]?\s*(\d{3,})/i.test(pergunta)) {
    const match = pergunta.match(/cns\s*[:=]?\s*(\d{3,})/i);
    if (match) {
      const cid = dadosCidadaos.find(c => c.cns === match[1]);
      if (!cid) return 'Cidadão não encontrado.';
      return `Nome: ${cid.nome || 'Não informado'}, CNS: ${cid.cns}, Condições: ${(cid.condicoes||[]).join(', ') || 'Não informado'}`;
    }
  }
  // Recusa de cadastro
  if (/recusa/i.test(pergunta)) {
    const recusas = dadosCidadaos.filter(c => c.recusa);
    if (recusas.length === 0) return 'Nenhuma recusa registrada.';
    return recusas.map(c => `Nome: ${c.nome || 'Não informado'}, Motivo: ${c.motivoRecusa || 'Não informado'}`).join(', ');
  }
  // Situação de rua com filtro de tempo (ex: mais de 1 ano)
  const matchTempoRua = pergunta.match(/situa[cç][aã]o de rua.*(mais de|acima de|há)\s*(\d+)\s*(ano|anos|mes|meses)/i);
  if (matchTempoRua) {
    const qtd = parseInt(matchTempoRua[2]);
    const unidade = matchTempoRua[3].startsWith('ano') ? 'ano' : 'mes';
    const rua = dadosCidadaos.filter(c => {
      if (!c.situacaoRua || !c.tempoRua) return false;
      const match = c.tempoRua.match(/(\d+)\s*(ano|anos|mes|meses)/i);
      if (!match) return false;
      const tempo = parseInt(match[1]);
      const un = match[2].startsWith('ano') ? 'ano' : 'mes';
      return un === unidade && tempo >= qtd;
    });
    if (rua.length === 0) return `Nenhum cidadão em situação de rua há mais de ${qtd} ${unidade}${qtd>1?'s':''}.`;
    return rua.map(c => `Nome: ${c.nome || 'Não informado'}, Tempo na rua: ${c.tempoRua || 'Não informado'}`).join(', ');
  }
  // Situação de rua simples
  if (/situa[cç][aã]o de rua|em situa[cç][aã]o de rua/i.test(pergunta)) {
    const rua = dadosCidadaos.filter(c => c.situacaoRua);
    if (rua.length === 0) return 'Nenhum cidadão em situação de rua.';
    return rua.map(c => `Nome: ${c.nome || 'Não informado'}, Tempo na rua: ${c.tempoRua || 'Não informado'}`).join(', ');
  }
  return 'Pergunta não reconhecida ou fora do escopo.';
}
