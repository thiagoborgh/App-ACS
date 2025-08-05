import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Save,
  User,
  Heart,
  Thermometer,
  Activity,
  Stethoscope,
  ClipboardList,
  Clock,
  Search,
  Baby,
  Shield,
  Target,
  Weight,
  Brain,
  AlertTriangle,
  Lightbulb,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { detectorAlertas, validadorInteligente, AlertaClinico, mockPessoas } from '@/data/mockData';

const AtendimentoVisita = () => {
  const { visitaId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { visita, roteiro, contextoIA } = location.state || {};
  
  // Verificar se a visita existe
  if (!visita) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">
              Dados da visita não encontrados. Por favor, acesse a partir do roteiro.
            </p>
            <Button 
              onClick={() => navigate('/roteiros')}
              className="w-full"
            >
              Voltar aos Roteiros
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Garantir que contextoIA tenha uma estrutura válida
  const contextoSeguro = contextoIA || {
    prioridades: [],
    materiaisNecessarios: [],
    protocolos: []
  };

  // Buscar dados da pessoa se for visita de cidadão
  const dadosPessoa = visita?.pessoaId ? mockPessoas.find(p => p.id === visita.pessoaId) : null;
  
  // Função para filtrar opções de acompanhamento baseado no sexo
  const getOpcoesAcompanhamentoFiltradas = () => {
    const todasOpcoes = [
      'gestante', 'puerpera', 'recemNascido', 'crianca', 'pessoaComDeficiencia',
      'hipertensao', 'diabetes', 'asma', 'dpoc', 'cancer', 'doencaRenal',
      'doencaCardiaca', 'tuberculose', 'hanseniase'
    ];

    if (!dadosPessoa) return todasOpcoes;

    // Filtrar opções específicas por sexo
    if (dadosPessoa.sexo === 'masculino') {
      return todasOpcoes.filter(opcao => 
        !['gestante', 'puerpera'].includes(opcao)
      );
    }

    return todasOpcoes;
  };

  const opcoesAcompanhamento = getOpcoesAcompanhamentoFiltradas();
  
  const [atendimento, setAtendimento] = useState({
    // Confirmação obrigatória
    visitaFoiRealizada: true, // já que iniciou atendimento
    
    // Motivos da visita (múltipla escolha)
    motivosVisita: [] as string[],
    
    // Busca Ativa (expandível)
    buscaAtivaExpandida: false,
    buscaAtiva: {
      consultaMedica: false,
      consultaOdontologica: false,
      vacinacao: false,
      examePreventivo: false,
      exameMama: false,
      planejamentoFamiliar: false,
      preNatal: false,
      puericultura: false
    },
    
    // Acompanhamento (expandível)
    acompanhamentoExpandido: false,
    acompanhamento: {
      gestante: false,
      puerpera: false,
      recemNascido: false,
      crianca: false,
      pessoaComDeficiencia: false,
      hipertensao: false,
      diabetes: false,
      asma: false,
      dpoc: false,
      cancer: false,
      outrasCondicoes: false,
      problemaMental: false,
      dependenciaQuimica: false,
      reabilitacao: false,
      tuberculose: false,
      hanseniase: false
    },
    
    // Antropometria (expandível)
    antropometriaExpandida: false,
    antropometria: {
      peso: '',
      altura: ''
    },
    
    // Sinais Vitais (novo)
    sinaisVitais: {
      pressaoArterial: '',
      frequenciaCardiaca: '',
      temperatura: '',
      saturacaoOxigenio: ''
    },
    
    // Acompanhamento profissional
    visitaAcompanhada: false,
    profissionalAcompanhante: '',
    
    // Observações gerais
    observacoes: ''
  });

  // Estados para IA
  const [alertasIA, setAlertasIA] = useState<AlertaClinico[]>([]);
  const [validandoIA, setValidandoIA] = useState(false);

  const motivosDisponiveis = [
    'Visita Periódica',
    'Busca Ativa',
    'Acompanhamento',
    'Controle Ambiental',
    'Cadastramento',
    'Atualização',
    'Outros'
  ];

  const profissionaisDisponiveis = [
    'Enfermeiro',
    'Médico',
    'Dentista',
    'Técnico de Enfermagem',
    'Agente de Endemias',
    'Nutricionista',
    'Psicólogo',
    'Assistente Social'
  ];

  const toggleMotivo = (motivo: string) => {
    setAtendimento(prev => ({
      ...prev,
      motivosVisita: prev.motivosVisita.includes(motivo)
        ? prev.motivosVisita.filter(m => m !== motivo)
        : [...prev.motivosVisita, motivo]
    }));
  };

  const toggleBuscaAtiva = (campo: keyof typeof atendimento.buscaAtiva) => {
    setAtendimento(prev => ({
      ...prev,
      buscaAtiva: {
        ...prev.buscaAtiva,
        [campo]: !prev.buscaAtiva[campo]
      }
    }));
  };

  const toggleAcompanhamento = (campo: keyof typeof atendimento.acompanhamento) => {
    // Validação inteligente baseada no sexo
    if (dadosPessoa?.sexo === 'masculino' && ['gestante', 'puerpera'].includes(campo)) {
      toast({
        title: "Opção não disponível",
        description: `A opção "${campo === 'gestante' ? 'Gestante' : 'Puérpera'}" não é aplicável para pessoas do sexo masculino.`,
        variant: "destructive"
      });
      return;
    }

    setAtendimento(prev => ({
      ...prev,
      acompanhamento: {
        ...prev.acompanhamento,
        [campo]: !prev.acompanhamento[campo]
      }
    }));
  };

  const validarPeso = (valor: string) => {
    const peso = parseFloat(valor);
    return peso >= 0.5 && peso <= 300;
  };

  const validarAltura = (valor: string) => {
    const altura = parseFloat(valor);
    return altura >= 30 && altura <= 250;
  };

  // Validação IA em tempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValidandoIA(true);
      
      // Simular delay da IA
      setTimeout(() => {
        // Preparar dados para análise IA (temporariamente desabilitado)
        try {
          // const visitaDetalhada = {
          //   visitaFoiRealizada: atendimento.visitaFoiRealizada,
          //   motivosVisita: atendimento.motivosVisita,
          //   buscaAtiva: atendimento.buscaAtiva,
          //   acompanhamento: {
          //     ...atendimento.acompanhamento,
          //     saudeMental: false,
          //     domiciliar: false,
          //     condicoesCronicas: false
          //   },
          //   antropometria: atendimento.antropometria,
          //   sinaisVitais: atendimento.sinaisVitais,
          //   visitaAcompanhada: atendimento.visitaAcompanhada,
          //   profissionalAcompanhante: atendimento.profissionalAcompanhante,
          //   orientacoesDadas: [],
          //   encaminhamentos: [],
          // };

          // // Analisar com IA
          // const novosAlertas = detectorAlertas.analisarVisita(visitaDetalhada, visita);
          
          // Por enquanto, usar alertas mock
          const novosAlertas: AlertaClinico[] = [];
          
          setAlertasIA(novosAlertas);
        } catch (error) {
          console.log('Erro na validação IA:', error);
          setAlertasIA([]);
        }
        
        setValidandoIA(false);
      }, 800);
    }, 1000); // Debounce de 1 segundo

    return () => clearTimeout(timeoutId);
  }, [atendimento, visita]);

  const getAlertaColor = (tipo: string) => {
    switch (tipo) {
      case 'CRITICO': return 'border-red-500 bg-red-50';
      case 'ALTO': return 'border-orange-500 bg-orange-50';
      case 'MEDIO': return 'border-yellow-500 bg-yellow-50';
      case 'BAIXO': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getAlertaIcon = (tipo: string) => {
    switch (tipo) {
      case 'CRITICO': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'ALTO': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'MEDIO': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'BAIXO': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleFinalizarAtendimento = () => {
    // Simular salvamento do atendimento
    toast({
      title: "Atendimento finalizado!",
      description: `Visita a ${visita.nome} registrada com sucesso.`
    });
    
    // Retornar para execução do roteiro
    navigate(`/roteiro/${roteiro.id}/executar`);
  };

  if (!visita) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Informações da visita não encontradas.</p>
          <Button 
            onClick={() => navigate('/visitas')} 
            className="mt-4"
          >
            Voltar às Visitas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/roteiro/${roteiro.id}/executar`)}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Atendimento</h1>
              <p className="text-sm text-gray-600">Registrar visita domiciliar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Informações do Paciente */}
        <Card className="mb-6 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-blue-800">
                {visita.nome}
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-800">
                Em Atendimento
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Endereço:</strong> {visita.endereco}</p>
              <p><strong>Condição:</strong> {visita.condicao}</p>
              <p><strong>Tempo estimado:</strong> {visita.tempoEstimado} minutos</p>
              {visita.detalhes.telefone && (
                <p><strong>Telefone:</strong> {visita.detalhes.telefone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações da Pessoa (Sistema Inteligente) */}
        {dadosPessoa && (
          <Card className="mb-6 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações da Pessoa
                <Badge className="bg-green-100 text-green-800 text-xs">Sistema Inteligente</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Nome:</strong> {dadosPessoa.nome}</p>
                <p><strong>Sexo:</strong> <span className="capitalize font-medium">{dadosPessoa.sexo}</span></p>
                <p><strong>Idade:</strong> {dadosPessoa.idade} anos</p>
                <p><strong>CPF:</strong> {dadosPessoa.cpf}</p>
                {dadosPessoa.sexo === 'masculino' && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Brain className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        IA ativa: Opções de acompanhamento filtradas automaticamente para pessoa do sexo masculino
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contexto Pré-Atendimento */}
        {contextoIA && typeof contextoIA === 'object' && (
          <Card className="mb-6 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-amber-700 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Análise Pré-Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.isArray(contextoIA.prioridades) && contextoIA.prioridades.length > 0 && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Prioridades Identificadas:</h4>
                  <ul className="space-y-1">
                    {contextoIA.prioridades.map((prioridade: any, index: number) => (
                      <li key={index} className="text-sm text-amber-700 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          prioridade?.nivel === 'crítica' ? 'bg-red-500' :
                          prioridade?.nivel === 'alta' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`} />
                        {prioridade?.descricao || 'Prioridade não especificada'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(contextoIA.materiaisNecessarios) && contextoIA.materiaisNecessarios.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Materiais Necessários:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {contextoIA.materiaisNecessarios.map((material: any, index: number) => (
                      <div key={index} className="text-sm text-blue-700 flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        {material?.nome || 'Material não especificado'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(contextoIA.protocolos) && contextoIA.protocolos.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Protocolos a Seguir:</h4>
                  <ul className="space-y-1">
                    {contextoIA.protocolos.map((protocolo: any, index: number) => (
                      <li key={index} className="text-sm text-green-700">
                        • {protocolo?.nome || 'Protocolo não especificado'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Painel de Alertas IA */}
        {alertasIA && alertasIA.length > 0 && (
          <Card className="mb-6 border-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Alertas da IA
                {validandoIA && <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertasIA && alertasIA.map((alerta, index) => (
                  <Alert key={index} className={getAlertaColor(alerta.tipo)}>
                    <div className="flex items-start gap-3">
                      {getAlertaIcon(alerta.tipo)}
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{alerta.titulo}</div>
                        <div className="text-xs text-gray-600 mb-2">{alerta.mensagem}</div>
                        <div className="text-xs text-blue-700 font-medium">
                          💡 {alerta.acao}
                        </div>
                        {alerta.urgencia && (
                          <Badge variant="destructive" className="text-xs mt-2">
                            URGENTE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* RN01 - Visita foi Realizada (Obrigatório) */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Confirmação da Visita *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={atendimento.visitaFoiRealizada}
                onChange={(e) => setAtendimento(prev => ({ ...prev, visitaFoiRealizada: e.target.checked }))}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Confirmo que a visita foi realizada</span>
            </div>
          </CardContent>
        </Card>

        {/* RN02 - Motivo da Visita (Obrigatório - Múltipla Escolha) */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Motivo da Visita *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {motivosDisponiveis.map((motivo) => (
                <label key={motivo} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={atendimento.motivosVisita.includes(motivo)}
                    onChange={() => toggleMotivo(motivo)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{motivo}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* RN03 - Busca Ativa (Expandível) */}
        {atendimento.motivosVisita.includes('Busca Ativa') && (
          <Card className="mb-6 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center text-green-800">
                <Search className="w-5 h-5 mr-2" />
                Busca Ativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries({
                  consultaMedica: 'Consulta Médica',
                  consultaOdontologica: 'Consulta Odontológica', 
                  vacinacao: 'Vacinação',
                  examePreventivo: 'Exame Preventivo (Papanicolau)',
                  exameMama: 'Exame de Mama',
                  planejamentoFamiliar: 'Planejamento Familiar',
                  preNatal: 'Pré-Natal',
                  puericultura: 'Puericultura'
                }).map(([campo, label]) => (
                  <label key={campo} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={atendimento.buscaAtiva[campo as keyof typeof atendimento.buscaAtiva]}
                      onChange={() => toggleBuscaAtiva(campo as keyof typeof atendimento.buscaAtiva)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* RN04 - Acompanhamento (Expandível) */}
        {atendimento.motivosVisita.includes('Acompanhamento') && (
          <Card className="mb-6 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center text-orange-800">
                <Heart className="w-5 h-5 mr-2" />
                Acompanhamento de Condições
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Alerta se for pessoa do sexo masculino */}
              {dadosPessoa?.sexo === 'masculino' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      ✓ Sistema inteligente: Opções "Gestante" e "Puérpera" removidas automaticamente para pessoa do sexo masculino.
                    </span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {Object.entries({
                  gestante: 'Gestante',
                  puerpera: 'Puérpera',
                  recemNascido: 'Recém-Nascido',
                  crianca: 'Criança',
                  pessoaComDeficiencia: 'Pessoa com Deficiência',
                  hipertensao: 'Hipertensão',
                  diabetes: 'Diabetes',
                  asma: 'Asma',
                  dpoc: 'DPOC',
                  cancer: 'Câncer',
                  outrasCondicoes: 'Outras Condições',
                  problemaMental: 'Problema Mental',
                  dependenciaQuimica: 'Dependência Química',
                  reabilitacao: 'Reabilitação',
                  tuberculose: 'Tuberculose',
                  hanseniase: 'Hanseníase'
                })
                .filter(([campo]) => opcoesAcompanhamento.includes(campo))
                .map(([campo, label]) => (
                  <label key={campo} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={atendimento.acompanhamento[campo as keyof typeof atendimento.acompanhamento]}
                      onChange={() => toggleAcompanhamento(campo as keyof typeof atendimento.acompanhamento)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* RN05 - Antropometria (Expandível) */}
        <Card className="mb-6 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center text-purple-800">
                <Weight className="w-5 h-5 mr-2" />
                Antropometria
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAtendimento(prev => ({ ...prev, antropometriaExpandida: !prev.antropometriaExpandida }))}
              >
                {atendimento.antropometriaExpandida ? 'Recolher' : 'Expandir'}
              </Button>
            </div>
          </CardHeader>
          {atendimento.antropometriaExpandida && (
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Peso (kg) *</label>
                  <Input
                    type="number"
                    placeholder="70.5"
                    step="0.1"
                    min="0.5"
                    max="300"
                    value={atendimento.antropometria.peso}
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (valor === '' || validarPeso(valor)) {
                        setAtendimento(prev => ({
                          ...prev,
                          antropometria: { ...prev.antropometria, peso: valor }
                        }));
                      }
                    }}
                    className={!validarPeso(atendimento.antropometria.peso) && atendimento.antropometria.peso !== '' ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">Faixa: 0,5 a 300 kg</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Altura (cm) *</label>
                  <Input
                    type="number"
                    placeholder="170"
                    step="0.1"
                    min="30"
                    max="250"
                    value={atendimento.antropometria.altura}
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (valor === '' || validarAltura(valor)) {
                        setAtendimento(prev => ({
                          ...prev,
                          antropometria: { ...prev.antropometria, altura: valor }
                        }));
                      }
                    }}
                    className={!validarAltura(atendimento.antropometria.altura) && atendimento.antropometria.altura !== '' ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">Faixa: 30 a 250 cm</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Sinais Vitais (Novo - para análise IA) */}
        <Card className="mb-6 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center text-purple-800">
              <Stethoscope className="w-5 h-5 mr-2" />
              Sinais Vitais
              <Badge variant="outline" className="ml-2 text-xs bg-purple-50 text-purple-700">
                IA Ativa
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pressão Arterial</label>
                <Input
                  placeholder="120/80"
                  value={atendimento.sinaisVitais.pressaoArterial}
                  onChange={(e) => setAtendimento(prev => ({
                    ...prev,
                    sinaisVitais: { ...prev.sinaisVitais, pressaoArterial: e.target.value }
                  }))}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Formato: sistólica/diastólica</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Frequência Cardíaca</label>
                <Input
                  type="number"
                  placeholder="72"
                  value={atendimento.sinaisVitais.frequenciaCardiaca}
                  onChange={(e) => setAtendimento(prev => ({
                    ...prev,
                    sinaisVitais: { ...prev.sinaisVitais, frequenciaCardiaca: e.target.value }
                  }))}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">bpm</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Temperatura</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={atendimento.sinaisVitais.temperatura}
                  onChange={(e) => setAtendimento(prev => ({
                    ...prev,
                    sinaisVitais: { ...prev.sinaisVitais, temperatura: e.target.value }
                  }))}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">°C</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Saturação O2</label>
                <Input
                  type="number"
                  placeholder="98"
                  value={atendimento.sinaisVitais.saturacaoOxigenio}
                  onChange={(e) => setAtendimento(prev => ({
                    ...prev,
                    sinaisVitais: { ...prev.sinaisVitais, saturacaoOxigenio: e.target.value }
                  }))}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RN06/RN07 - Acompanhamento Profissional */}
        <Card className="mb-6 border-indigo-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center text-indigo-800">
              <User className="w-5 h-5 mr-2" />
              Acompanhamento Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={atendimento.visitaAcompanhada}
                  onChange={(e) => setAtendimento(prev => ({ ...prev, visitaAcompanhada: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Visita foi acompanhada por outro profissional</span>
              </label>
              
              {atendimento.visitaAcompanhada && (
                <div>
                  <label className="block text-sm font-medium mb-2">Profissional Acompanhante</label>
                  <Select
                    value={atendimento.profissionalAcompanhante}
                    onValueChange={(value) => setAtendimento(prev => ({ ...prev, profissionalAcompanhante: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profissionaisDisponiveis.map((profissional) => (
                        <SelectItem key={profissional} value={profissional}>
                          {profissional}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observações Gerais */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <ClipboardList className="w-5 h-5 mr-2" />
              Observações da Visita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Registre detalhes importantes da visita, condições encontradas, orientações dadas, encaminhamentos realizados..."
              value={atendimento.observacoes}
              onChange={(e) => setAtendimento(prev => ({ ...prev, observacoes: e.target.value }))}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="space-y-3">
          <Button 
            className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg"
            onClick={handleFinalizarAtendimento}
            disabled={!atendimento.visitaFoiRealizada || atendimento.motivosVisita.length === 0}
          >
            <CheckCircle2 className="w-5 h-5 mr-3" />
            Finalizar Atendimento
          </Button>

          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/roteiro/${roteiro.id}/executar`)}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar e Continuar Depois
          </Button>
        </div>

        {/* Validações */}
        {(!atendimento.visitaFoiRealizada || atendimento.motivosVisita.length === 0) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Campos obrigatórios:</strong>
              {!atendimento.visitaFoiRealizada && ' Confirmar realização da visita.'}
              {atendimento.motivosVisita.length === 0 && ' Selecionar pelo menos um motivo da visita.'}
            </p>
          </div>
        )}

        {/* Tempo de Atendimento */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Atendimento iniciado às {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtendimentoVisita;
