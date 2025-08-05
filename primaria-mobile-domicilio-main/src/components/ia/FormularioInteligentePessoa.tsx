import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Brain,
  Loader2,
  X,
  Check
} from 'lucide-react';
import { 
  validadorInteligente, 
  AlertaValidacao, 
  SugestaoPreenchimento, 
  Pessoa,
  CondicoesSaudeDetalhadas 
} from '@/data/mockData';

interface FormularioInteligentePessoaProps {
  pessoaInicial?: Partial<Pessoa>;
  onSalvar: (pessoa: Pessoa) => void;
  onCancelar: () => void;
}

const FormularioInteligentePessoa: React.FC<FormularioInteligentePessoaProps> = ({
  pessoaInicial = {},
  onSalvar,
  onCancelar
}) => {
  // Estados do formulário
  const [pessoa, setPessoa] = useState<Partial<Pessoa>>({
    nome: '',
    cpf: '',
    dataNascimento: '',
    idade: 0,
    sexo: 'feminino',
    corRaca: '',
    escolaridade: '',
    ocupacao: '',
    responsavelFamilia: false,
    possuiDeficiencia: false,
    condicoesSaude: {
      hipertensao: false,
      diabetes: false,
      doencaCardiaca: false,
      doencaRenal: false,
      outras: []
    },
    condicoesSaudeDetalhadas: {
      hipertensao: { possui: false },
      diabetes: { possui: false },
      doencaCardiaca: { possui: false },
      doencaRenal: { possui: false },
      depressao: { possui: false },
      ansiedade: { possui: false },
      deficiencia: { possui: false },
      tabagismo: { possui: false },
      alcoolismo: { possui: false }
    },
    gestante: { eh: false },
    ...pessoaInicial
  });

  // Estados da IA
  const [alertas, setAlertas] = useState<AlertaValidacao[]>([]);
  const [sugestoes, setSugestoes] = useState<SugestaoPreenchimento[]>([]);
  const [validandoIA, setValidandoIA] = useState(false);
  const [sugestoesAceitas, setSugestoesAceitas] = useState<Set<string>>(new Set());

  // Validação em tempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValidandoIA(true);
      
      // Simular delay da IA
      setTimeout(() => {
        const novosAlertas = validadorInteligente.validarPessoa(pessoa);
        const novasSugestoes = validadorInteligente.sugerirDados({
          endereco: 'Área Urbana', // Mock
          bairro: 'Centro',
          idade: pessoa.idade
        });
        
        setAlertas(novosAlertas);
        setSugestoes(novasSugestoes);
        setValidandoIA(false);
      }, 800);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [pessoa]);

  // Handlers
  const handleInputChange = (campo: string, valor: any) => {
    setPessoa(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleCondicaoSaudeChange = (condicao: string, valor: boolean) => {
    setPessoa(prev => ({
      ...prev,
      condicoesSaude: {
        ...prev.condicoesSaude!,
        [condicao]: valor
      },
      condicoesSaudeDetalhadas: {
        ...prev.condicoesSaudeDetalhadas!,
        [condicao]: { possui: valor }
      }
    }));
  };

  const handleGestanteChange = (campo: string, valor: any) => {
    setPessoa(prev => ({
      ...prev,
      gestante: {
        ...prev.gestante!,
        [campo]: valor
      }
    }));
  };

  const aceitarSugestao = (sugestao: SugestaoPreenchimento) => {
    handleInputChange(sugestao.campo, sugestao.valor);
    setSugestoesAceitas(prev => new Set([...prev, sugestao.campo]));
  };

  const rejeitarSugestao = (campo: string) => {
    setSugestoesAceitas(prev => new Set([...prev, campo]));
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'ERRO': return <X className="h-4 w-4 text-red-500" />;
      case 'ATENCAO': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'INFO': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (tipo: string) => {
    switch (tipo) {
      case 'ERRO': return 'border-red-500 bg-red-50';
      case 'ATENCAO': return 'border-yellow-500 bg-yellow-50';
      case 'INFO': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação final
    const alertasFinais = validadorInteligente.validarPessoa(pessoa);
    const temErros = alertasFinais.some(a => a.tipo === 'ERRO');
    
    if (temErros) {
      alert('Existem erros no formulário que precisam ser corrigidos antes de salvar.');
      return;
    }

    onSalvar(pessoa as Pessoa);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cadastro Inteligente de Pessoa</h2>
          <p className="text-gray-600">Formulário com validação e sugestões automáticas por IA</p>
        </div>
        <div className="flex items-center gap-2">
          {validandoIA && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Brain className="w-4 h-4 mr-1" />
            IA Ativa
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados Básicos */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Básicos</CardTitle>
                <CardDescription>Informações de identificação da pessoa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={pessoa.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={pessoa.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={pessoa.dataNascimento}
                      onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      type="number"
                      value={pessoa.idade}
                      onChange={(e) => handleInputChange('idade', parseInt(e.target.value) || 0)}
                      min="0"
                      max="120"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select value={pessoa.sexo} onValueChange={(value) => handleInputChange('sexo', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="corRaca">Cor/Raça</Label>
                    <Select value={pessoa.corRaca} onValueChange={(value) => handleInputChange('corRaca', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="branca">Branca</SelectItem>
                        <SelectItem value="preta">Preta</SelectItem>
                        <SelectItem value="parda">Parda</SelectItem>
                        <SelectItem value="amarela">Amarela</SelectItem>
                        <SelectItem value="indigena">Indígena</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Condições de Saúde */}
            <Card>
              <CardHeader>
                <CardTitle>Condições de Saúde</CardTitle>
                <CardDescription>Informações sobre o estado de saúde da pessoa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'hipertensao', label: 'Hipertensão' },
                    { key: 'diabetes', label: 'Diabetes' },
                    { key: 'doencaCardiaca', label: 'Doença Cardíaca' },
                    { key: 'doencaRenal', label: 'Doença Renal' }
                  ].map(condicao => (
                    <div key={condicao.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={condicao.key}
                        checked={Boolean(pessoa.condicoesSaude?.[condicao.key as keyof typeof pessoa.condicoesSaude])}
                        onCheckedChange={(checked) => handleCondicaoSaudeChange(condicao.key, checked as boolean)}
                      />
                      <Label htmlFor={condicao.key}>{condicao.label}</Label>
                    </div>
                  ))}
                </div>

                {/* Gestação (só para mulheres) */}
                {pessoa.sexo === 'feminino' && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="gestante"
                        checked={pessoa.gestante?.eh || false}
                        onCheckedChange={(checked) => handleGestanteChange('eh', checked)}
                      />
                      <Label htmlFor="gestante">Gestante</Label>
                    </div>
                    
                    {pessoa.gestante?.eh && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label htmlFor="semanas">Semanas de Gestação</Label>
                          <Input
                            id="semanas"
                            type="number"
                            value={pessoa.gestante?.semanas || ''}
                            onChange={(e) => handleGestanteChange('semanas', parseInt(e.target.value) || 0)}
                            min="1"
                            max="42"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="risco">Risco</Label>
                          <Select 
                            value={pessoa.gestante?.risco || 'habitual'} 
                            onValueChange={(value) => handleGestanteChange('risco', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="habitual">Habitual</SelectItem>
                              <SelectItem value="alto_risco">Alto Risco</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Painel de IA */}
          <div className="space-y-4">
            {/* Alertas */}
            {alertas.length > 0 && (
              <Card className="border-yellow-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Alertas de Validação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {alertas.map((alerta, index) => (
                    <Alert key={index} className={getAlertColor(alerta.tipo)}>
                      <div className="flex items-start gap-2">
                        {getAlertIcon(alerta.tipo)}
                        <div>
                          <AlertDescription className="text-xs">
                            <strong>{alerta.campo}:</strong> {alerta.mensagem}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Sugestões */}
            {sugestoes.length > 0 && (
              <Card className="border-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    Sugestões da IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sugestoes.map((sugestao, index) => {
                    const jaAceita = sugestoesAceitas.has(sugestao.campo);
                    
                    return (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-xs font-medium text-blue-900 mb-1">
                          {sugestao.campo.toUpperCase()}
                        </div>
                        <div className="text-xs text-blue-700 mb-2">
                          {sugestao.justificativa}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {sugestao.confianca}% confiança
                          </Badge>
                          {!jaAceita && (
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={() => aceitarSugestao(sugestao)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={() => rejeitarSugestao(sugestao.campo)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Status IA */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="text-center">
                  <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-900">
                    IA Monitorando
                  </div>
                  <div className="text-xs text-blue-700">
                    {validandoIA ? 'Analisando...' : 'Sistema ativo'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={alertas.some(a => a.tipo === 'ERRO')}
            className="min-w-[120px]"
          >
            {alertas.some(a => a.tipo === 'ERRO') ? 'Corrigir Erros' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormularioInteligentePessoa;
