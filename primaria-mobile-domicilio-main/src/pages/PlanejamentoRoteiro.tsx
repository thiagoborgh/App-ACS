import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MapPin, 
  Route, 
  Clock, 
  AlertTriangle, 
  Heart, 
  User, 
  Users, 
  Home,
  Brain,
  RefreshCw,
  Calendar,
  Navigation,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Activity,
  Target,
  Settings,
  Plus,
  Edit,
  Trash2,
  Map,
  UserCheck,
  Building,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { mockApi, Microarea, ConfiguracaoTerritorio, PacientePrioritario } from '@/data/mockData';
import DashboardInteligente from '@/components/ia/DashboardInteligente';

// Tipos de dados
interface VisitaPlanejada {
  id: string;
  tipo: 'cidadao' | 'familia' | 'imovel';
  nome: string;
  endereco: string;
  coordenadas: { lat: number; lng: number };
  condicoesSaude: string[];
  prioridadeClinica: 'critica' | 'alta' | 'media' | 'baixa';
  diasSemUltimaVisita: number;
  dataUltimoDiagnostico?: string;
  observacoes?: string;
  tempoEstimado: number; // em minutos
  distanciaProximaVisita?: number; // em metros
}

interface Roteiro {
  id: string;
  data: string;
  visitas: VisitaPlanejada[];
  tempoTotal: number;
  distanciaTotal: number;
  score: number;
}

const PlanejamentoRoteiro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [visitasPendentes, setVisitasPendentes] = useState<VisitaPlanejada[]>([]);
  const [roteiroAtual, setRoteiroAtual] = useState<Roteiro | null>(null);
  const [algoritmoIA, setAlgoritmoIA] = useState(true);
  const [dataRoteiro, setDataRoteiro] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  
  // Estados para microáreas
  const [microareas, setMicroareas] = useState<Microarea[]>([]);
  const [configuracaoTerritorio, setConfiguracaoTerritorio] = useState<ConfiguracaoTerritorio | null>(null);
  const [microareaSelecionada, setMicroareaSelecionada] = useState<string>('');
  const [showModalMicroarea, setShowModalMicroarea] = useState(false);
  const [microareaEditando, setMicroareaEditando] = useState<Microarea | null>(null);
  
  // Estados do formulário de microárea
  const [formMicroarea, setFormMicroarea] = useState({
    codigo: '',
    nome: '',
    acsResponsavel: '',
    descricao: '',
    familiasCadastradas: 0,
    populacaoEstimada: 0,
    status: 'ativa' as 'ativa' | 'inativa' | 'reorganizacao'
  });

  // Dados mock com condições de saúde sensíveis
  const visitasBaseMock: VisitaPlanejada[] = [
    {
      id: '1',
      tipo: 'cidadao',
      nome: 'Maria Silva Santos',
      endereco: 'Rua das Flores, 123',
      coordenadas: { lat: -23.5505, lng: -46.6333 },
      condicoesSaude: ['Diabetes recém-diagnosticada', 'Hipertensão'],
      prioridadeClinica: 'critica',
      diasSemUltimaVisita: 45,
      dataUltimoDiagnostico: '2024-07-20',
      observacoes: 'Diagnóstico de diabetes há 15 dias. Precisa orientação urgente sobre medicação.',
      tempoEstimado: 30
    },
    {
      id: '2',
      tipo: 'cidadao',
      nome: 'José Carlos Oliveira',
      endereco: 'Rua das Flores, 145',
      coordenadas: { lat: -23.5506, lng: -46.6334 },
      condicoesSaude: ['Hipertensão descontrolada'],
      prioridadeClinica: 'alta',
      diasSemUltimaVisita: 32,
      dataUltimoDiagnostico: '2024-07-10',
      observacoes: 'Pressão arterial acima de 180/110 na última consulta.',
      tempoEstimado: 25
    },
    {
      id: '3',
      tipo: 'familia',
      nome: 'Família Rodrigues',
      endereco: 'Avenida Brasil, 456',
      coordenadas: { lat: -23.5510, lng: -46.6340 },
      condicoesSaude: ['Criança com desnutrição'],
      prioridadeClinica: 'alta',
      diasSemUltimaVisita: 28,
      dataUltimoDiagnostico: '2024-07-25',
      observacoes: 'Criança de 3 anos com peso abaixo do esperado. Acompanhamento nutricional.',
      tempoEstimado: 40
    },
    {
      id: '4',
      tipo: 'cidadao',
      nome: 'Ana Paula Costa',
      endereco: 'Rua da Esperança, 789',
      coordenadas: { lat: -23.5515, lng: -46.6350 },
      condicoesSaude: ['Depressão severa'],
      prioridadeClinica: 'alta',
      diasSemUltimaVisita: 21,
      dataUltimoDiagnostico: '2024-07-30',
      observacoes: 'Diagnóstico recente de depressão. Família relatou tentativa de autolesão.',
      tempoEstimado: 35
    },
    {
      id: '5',
      tipo: 'familia',
      nome: 'Família Santos',
      endereco: 'Rua das Flores, 167',
      coordenadas: { lat: -23.5507, lng: -46.6335 },
      condicoesSaude: ['Idoso com demência'],
      prioridadeClinica: 'media',
      diasSemUltimaVisita: 18,
      observacoes: 'Acompanhamento de rotina para idoso com Alzheimer.',
      tempoEstimado: 30
    },
    {
      id: '6',
      tipo: 'imovel',
      nome: 'Controle Vetorial - Dengue',
      endereco: 'Travessa São João, 234',
      coordenadas: { lat: -23.5520, lng: -46.6355 },
      condicoesSaude: ['Controle de focos'],
      prioridadeClinica: 'media',
      diasSemUltimaVisita: 14,
      observacoes: 'Inspeção para controle de mosquito da dengue.',
      tempoEstimado: 20
    },
    {
      id: '7',
      tipo: 'cidadao',
      nome: 'Pedro Henrique Silva',
      endereco: 'Avenida Brasil, 478',
      coordenadas: { lat: -23.5511, lng: -46.6341 },
      condicoesSaude: ['Tuberculose em tratamento'],
      prioridadeClinica: 'alta',
      diasSemUltimaVisita: 25,
      dataUltimoDiagnostico: '2024-07-15',
      observacoes: 'Paciente em tratamento de tuberculose. Verificar adesão aos medicamentos.',
      tempoEstimado: 25
    },
    {
      id: '8',
      tipo: 'familia',
      nome: 'Família Oliveira',
      endereco: 'Rua da Esperança, 801',
      coordenadas: { lat: -23.5516, lng: -46.6351 },
      condicoesSaude: ['Gestante de alto risco'],
      prioridadeClinica: 'critica',
      diasSemUltimaVisita: 12,
      dataUltimoDiagnostico: '2024-08-01',
      observacoes: 'Gestante com pré-eclâmpsia. Monitoramento semanal necessário.',
      tempoEstimado: 35
    }
  ];

  // Algoritmo de otimização inteligente
  const calcularScorePrioridade = (visita: VisitaPlanejada): number => {
    let score = 0;
    
    // Prioridade clínica (peso maior)
    const prioridadeScores = {
      'critica': 100,
      'alta': 80,
      'media': 60,
      'baixa': 40
    };
    score += prioridadeScores[visita.prioridadeClinica];
    
    // Condições sensíveis (diabetes, hipertensão descontrolada, etc.)
    const condicoesSensiveis = [
      'Diabetes recém-diagnosticada',
      'Hipertensão descontrolada',
      'Tuberculose',
      'Gestante de alto risco',
      'Depressão severa',
      'Desnutrição'
    ];
    
    const temCondicaoSensivel = visita.condicoesSaude.some(condicao =>
      condicoesSensiveis.some(sensivel => condicao.includes(sensivel.split(' ')[0]))
    );
    
    if (temCondicaoSensivel) score += 50;
    
    // Tempo sem visita (máximo 30 pontos)
    score += Math.min(visita.diasSemUltimaVisita, 30);
    
    // Diagnóstico recente (últimos 30 dias)
    if (visita.dataUltimoDiagnostico) {
      const diasDesdeDiagnostico = Math.floor(
        (new Date().getTime() - new Date(visita.dataUltimoDiagnostico).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diasDesdeDiagnostico <= 30) {
        score += 40 - diasDesdeDiagnostico;
      }
    }
    
    return score;
  };

  // Cálculo de distância aproximada entre coordenadas
  const calcularDistancia = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number => {
    const R = 6371e3; // raio da Terra em metros
    const φ1 = coord1.lat * Math.PI/180;
    const φ2 = coord2.lat * Math.PI/180;
    const Δφ = (coord2.lat-coord1.lat) * Math.PI/180;
    const Δλ = (coord2.lng-coord1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Algoritmo de otimização de rota com IA
  const gerarRoteiroOtimizado = (visitas: VisitaPlanejada[]): Roteiro => {
    if (visitas.length === 0) {
      return {
        id: Date.now().toString(),
        data: dataRoteiro,
        visitas: [],
        tempoTotal: 0,
        distanciaTotal: 0,
        score: 0
      };
    }

    // 1. Ordenar por prioridade clínica
    const visitasComScore = visitas.map(visita => ({
      ...visita,
      score: calcularScorePrioridade(visita)
    })).sort((a, b) => b.score - a.score);

    // 2. Otimização de rota por proximidade geográfica (TSP simplificado)
    const visitasOrdenadas: VisitaPlanejada[] = [];
    const visitasRestantes = [...visitasComScore];
    
    // Começar com a visita de maior prioridade
    let visitaAtual = visitasRestantes.shift()!;
    visitasOrdenadas.push(visitaAtual);
    
    while (visitasRestantes.length > 0) {
      // Encontrar a próxima visita mais próxima com alta prioridade
      let melhorProxima = visitasRestantes[0];
      let menorDistancia = calcularDistancia(visitaAtual.coordenadas, melhorProxima.coordenadas);
      let melhorIndex = 0;
      
      for (let i = 1; i < visitasRestantes.length; i++) {
        const distancia = calcularDistancia(visitaAtual.coordenadas, visitasRestantes[i].coordenadas);
        const fatorPrioridade = visitasRestantes[i].score > 150 ? 0.5 : 1; // Reduz distância se prioridade alta
        
        if (distancia * fatorPrioridade < menorDistancia) {
          menorDistancia = distancia;
          melhorProxima = visitasRestantes[i];
          melhorIndex = i;
        }
      }
      
      visitasRestantes.splice(melhorIndex, 1);
      visitasOrdenadas.push(melhorProxima);
      visitaAtual = melhorProxima;
    }

    // 3. Calcular métricas totais
    let distanciaTotal = 0;
    let tempoTotal = 0;
    
    for (let i = 0; i < visitasOrdenadas.length; i++) {
      tempoTotal += visitasOrdenadas[i].tempoEstimado;
      
      if (i > 0) {
        const distancia = calcularDistancia(
          visitasOrdenadas[i-1].coordenadas,
          visitasOrdenadas[i].coordenadas
        );
        distanciaTotal += distancia;
        visitasOrdenadas[i].distanciaProximaVisita = distancia;
        
        // Tempo de deslocamento (assumindo 30 km/h = 8.33 m/s)
        tempoTotal += Math.round(distancia / 8.33 / 60); // minutos
      }
    }

    const scoreTotal = visitasOrdenadas.reduce((acc, v) => acc + calcularScorePrioridade(v), 0);

    return {
      id: Date.now().toString(),
      data: dataRoteiro,
      visitas: visitasOrdenadas,
      tempoTotal: Math.round(tempoTotal),
      distanciaTotal: Math.round(distanciaTotal),
      score: scoreTotal
    };
  };

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        const [pacientes, configTerritorio, microareasData] = await Promise.all([
          mockApi.getPacientesPrioritarios(),
          mockApi.getConfiguracaoTerritorio(),
          mockApi.getMicroareas()
        ]);
        
        // Converter pacientes para formato de visitas
        const visitas: VisitaPlanejada[] = pacientes.map(p => ({
          id: p.id,
          tipo: p.familiaId ? 'familia' : 'cidadao',
          nome: p.nome,
          endereco: p.endereco,
          coordenadas: p.coordenadas,
          condicoesSaude: p.condicoesSaude,
          prioridadeClinica: p.prioridadeClinica,
          diasSemUltimaVisita: p.diasSemUltimaVisita,
          dataUltimoDiagnostico: p.dataUltimoDiagnostico,
          observacoes: p.observacoes,
          tempoEstimado: p.tempoEstimadoVisita
        }));
        
        setVisitasPendentes(visitas);
        setConfiguracaoTerritorio(configTerritorio);
        setMicroareas(microareasData);
        
        // Selecionar primeira microárea por padrão
        if (microareasData.length > 0) {
          setMicroareaSelecionada(microareasData[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações do território.",
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [toast]);

  // Gerar roteiro automaticamente
  const handleGerarRoteiro = async () => {
    setLoading(true);
    
    // Simular processamento IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const novoRoteiro = gerarRoteiroOtimizado(visitasPendentes);
    setRoteiroAtual(novoRoteiro);
    setLoading(false);
    
    toast({
      title: "Roteiro otimizado com sucesso!",
      description: `${novoRoteiro.visitas.length} visitas organizadas por prioridade clínica e proximidade.`
    });
  };

  // Funções para gerenciar microáreas
  const abrirModalMicroarea = (microarea?: Microarea) => {
    if (microarea) {
      setMicroareaEditando(microarea);
      setFormMicroarea({
        codigo: microarea.codigo,
        nome: microarea.nome,
        acsResponsavel: microarea.acsResponsavel,
        descricao: microarea.descricao,
        familiasCadastradas: microarea.familiasCadastradas,
        populacaoEstimada: microarea.populacaoEstimada,
        status: microarea.status
      });
    } else {
      setMicroareaEditando(null);
      setFormMicroarea({
        codigo: '',
        nome: '',
        acsResponsavel: '',
        descricao: '',
        familiasCadastradas: 0,
        populacaoEstimada: 0,
        status: 'ativa'
      });
    }
    setShowModalMicroarea(true);
  };

  const salvarMicroarea = () => {
    if (microareaEditando) {
      // Editar microárea existente
      const microareasAtualizadas = microareas.map(m => 
        m.id === microareaEditando.id 
          ? { ...m, ...formMicroarea }
          : m
      );
      setMicroareas(microareasAtualizadas);
      
      toast({
        title: "Microárea atualizada!",
        description: `${formMicroarea.nome} foi atualizada com sucesso.`
      });
    } else {
      // Criar nova microárea
      const novaMicroarea: Microarea = {
        id: `MA-${Date.now()}`,
        ...formMicroarea,
        logradouros: [],
        area: {
          coordenadas: [],
          perimetro: 0
        },
        metas: {
          visitasMensais: Math.ceil(formMicroarea.familiasCadastradas * 1.2),
          coberturaFamilias: 90,
          acompanhamentoCronicos: 85
        },
        dataCriacao: new Date().toISOString().split('T')[0]
      };
      
      setMicroareas([...microareas, novaMicroarea]);
      
      toast({
        title: "Nova microárea criada!",
        description: `${formMicroarea.nome} foi criada com sucesso.`
      });
    }
    
    setShowModalMicroarea(false);
    setMicroareaEditando(null);
  };

  // Componentes visuais
  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'cidadao': return <User className="w-4 h-4" />;
      case 'familia': return <Users className="w-4 h-4" />;
      case 'imovel': return <Home className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="mr-3 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Route className="w-6 h-6 text-blue-600" />
                  Planejamento Inteligente de Roteiro
                </h1>
                <p className="text-sm text-gray-600">Otimização com IA baseada em prioridade clínica</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <Brain className="w-4 h-4 mr-1" />
              IA Ativada
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="configuracao" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="configuracao">Configuração</TabsTrigger>
            <TabsTrigger value="microareas">Microáreas</TabsTrigger>
            <TabsTrigger value="roteiro">Roteiro Gerado</TabsTrigger>
            <TabsTrigger value="metricas">Métricas & IA</TabsTrigger>
          </TabsList>

          <TabsContent value="configuracao">
            <div className="grid gap-6">
              {/* Controles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Configurações do Roteiro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Data do Roteiro</label>
                      <Input
                        type="date"
                        value={dataRoteiro}
                        onChange={(e) => setDataRoteiro(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Algoritmo IA</label>
                      <Badge className={algoritmoIA ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {algoritmoIA ? 'Ativado' : 'Desativado'}
                      </Badge>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={handleGerarRoteiro}
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Brain className="w-4 h-4 mr-2" />
                        )}
                        {loading ? 'Otimizando...' : 'Gerar Roteiro IA'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de visitas pendentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Visitas Pendentes ({visitasPendentes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {visitasPendentes.map((visita) => (
                      <div key={visita.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getTipoIcon(visita.tipo)}
                          </div>
                          <div>
                            <h4 className="font-medium">{visita.nome}</h4>
                            <p className="text-sm text-gray-600">{visita.endereco}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {visita.condicoesSaude.map((condicao, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {condicao}
                                </Badge>
                              ))}
                            </div>
                            {visita.observacoes && (
                              <p className="text-xs text-gray-500 mt-1">{visita.observacoes}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getPrioridadeColor(visita.prioridadeClinica)}>
                            {visita.prioridadeClinica.toUpperCase()}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {visita.diasSemUltimaVisita} dias sem visita
                          </p>
                          <p className="text-xs text-gray-500">
                            ~{visita.tempoEstimado}min
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="microareas">
            <div className="space-y-6">
              {/* Header com estatísticas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Configuração do Território
                    {configuracaoTerritorio && (
                      <Badge className="ml-2">
                        {configuracaoTerritorio.unidadeSaude}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {configuracaoTerritorio && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{microareas.length}</div>
                        <div className="text-sm text-gray-600">Microáreas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{configuracaoTerritorio.totalAcs}</div>
                        <div className="text-sm text-gray-600">ACS Ativos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {microareas.reduce((acc, m) => acc + m.familiasCadastradas, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Famílias Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{configuracaoTerritorio.metaCobertura}%</div>
                        <div className="text-sm text-gray-600">Meta Cobertura</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Filtro por microárea */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Gerenciar Microáreas
                    </span>
                    <Dialog open={showModalMicroarea} onOpenChange={setShowModalMicroarea}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => abrirModalMicroarea()}
                          className="bg-gradient-to-r from-blue-600 to-green-600"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nova Microárea
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {microareaEditando ? 'Editar' : 'Nova'} Microárea
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Código</label>
                              <Input 
                                placeholder="MA-006" 
                                value={formMicroarea.codigo}
                                onChange={(e) => setFormMicroarea(prev => ({ ...prev, codigo: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Nome</label>
                              <Input 
                                placeholder="Nome da microárea" 
                                value={formMicroarea.nome}
                                onChange={(e) => setFormMicroarea(prev => ({ ...prev, nome: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">ACS Responsável</label>
                            <Input 
                              placeholder="Nome completo do ACS" 
                              value={formMicroarea.acsResponsavel}
                              onChange={(e) => setFormMicroarea(prev => ({ ...prev, acsResponsavel: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Descrição</label>
                            <Input 
                              placeholder="Descrição da área de abrangência" 
                              value={formMicroarea.descricao}
                              onChange={(e) => setFormMicroarea(prev => ({ ...prev, descricao: e.target.value }))}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Famílias</label>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                value={formMicroarea.familiasCadastradas}
                                onChange={(e) => setFormMicroarea(prev => ({ ...prev, familiasCadastradas: parseInt(e.target.value) || 0 }))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">População</label>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                value={formMicroarea.populacaoEstimada}
                                onChange={(e) => setFormMicroarea(prev => ({ ...prev, populacaoEstimada: parseInt(e.target.value) || 0 }))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Status</label>
                              <Select 
                                value={formMicroarea.status}
                                onValueChange={(value: 'ativa' | 'inativa' | 'reorganizacao') => 
                                  setFormMicroarea(prev => ({ ...prev, status: value }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ativa">Ativa</SelectItem>
                                  <SelectItem value="inativa">Inativa</SelectItem>
                                  <SelectItem value="reorganizacao">Em Reorganização</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button className="flex-1" onClick={salvarMicroarea}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Salvar
                            </Button>
                            <Button variant="outline" onClick={() => setShowModalMicroarea(false)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {microareas.map((microarea) => (
                      <Card key={microarea.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-blue-100 text-blue-800">
                                  {microarea.codigo}
                                </Badge>
                                <h4 className="font-medium">{microarea.nome}</h4>
                                <Badge className={
                                  microarea.status === 'ativa' ? 'bg-green-100 text-green-800' :
                                  microarea.status === 'inativa' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {microarea.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <UserCheck className="w-4 h-4" />
                                    <span className="font-medium">ACS:</span>
                                    <span>{microarea.acsResponsavel}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building className="w-4 h-4" />
                                    <span className="font-medium">Área:</span>
                                    <span>{(microarea.area.perimetro / 1000).toFixed(1)} km de perímetro</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium">Famílias:</span>
                                    <span>{microarea.familiasCadastradas}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">População:</span>
                                    <span>{microarea.populacaoEstimada}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <span className="text-sm font-medium text-gray-700">Logradouros:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {microarea.logradouros.slice(0, 3).map((logradouro, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {logradouro}
                                    </Badge>
                                  ))}
                                  {microarea.logradouros.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{microarea.logradouros.length - 3} mais
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                <div>
                                  <div className="font-bold text-blue-600">{microarea.metas.visitasMensais}</div>
                                  <div className="text-gray-500">Visitas/mês</div>
                                </div>
                                <div>
                                  <div className="font-bold text-green-600">{microarea.metas.coberturaFamilias}%</div>
                                  <div className="text-gray-500">Cobertura</div>
                                </div>
                                <div>
                                  <div className="font-bold text-purple-600">{microarea.metas.acompanhamentoCronicos}%</div>
                                  <div className="text-gray-500">Crônicos</div>
                                </div>
                              </div>

                              {microarea.observacoes && (
                                <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm">
                                  <span className="font-medium">Observações:</span> {microarea.observacoes}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => abrirModalMicroarea(microarea)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setMicroareaSelecionada(microarea.id)}
                                className={microareaSelecionada === microarea.id ? 'bg-blue-50' : ''}
                              >
                                <BarChart3 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas da microárea selecionada */}
              {microareaSelecionada && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Pacientes Prioritários - {microareas.find(m => m.id === microareaSelecionada)?.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {visitasPendentes
                        .filter(v => {
                          // Filtrar por microárea baseado no endereço (simulação)
                          const microarea = microareas.find(m => m.id === microareaSelecionada);
                          if (!microarea) return false;
                          return microarea.logradouros.some(log => 
                            v.endereco.includes(log.split(' ')[0]) || 
                            v.endereco.includes(log.split(' ')[1])
                          );
                        })
                        .slice(0, 5)
                        .map((paciente) => (
                          <div key={paciente.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h5 className="font-medium">{paciente.nome}</h5>
                              <p className="text-sm text-gray-600">{paciente.endereco}</p>
                              <div className="flex gap-1 mt-1">
                                {paciente.condicoesSaude.slice(0, 2).map((condicao, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {condicao.split(' ')[0]}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Badge className={getPrioridadeColor(paciente.prioridadeClinica)}>
                              {paciente.prioridadeClinica.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="roteiro">
            {roteiroAtual ? (
              <div className="space-y-6">
                {/* Resumo do roteiro */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="w-5 h-5" />
                      Roteiro Otimizado - {new Date(roteiroAtual.data).toLocaleDateString('pt-BR')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{roteiroAtual.visitas.length}</div>
                        <div className="text-sm text-gray-600">Visitas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{Math.round(roteiroAtual.tempoTotal / 60)}h{roteiroAtual.tempoTotal % 60}m</div>
                        <div className="text-sm text-gray-600">Tempo Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{(roteiroAtual.distanciaTotal / 1000).toFixed(1)} km</div>
                        <div className="text-sm text-gray-600">Distância</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{roteiroAtual.score}</div>
                        <div className="text-sm text-gray-600">Score IA</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sequência de visitas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sequência Otimizada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {roteiroAtual.visitas.map((visita, index) => (
                        <div key={visita.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getTipoIcon(visita.tipo)}
                              <h4 className="font-medium">{visita.nome}</h4>
                              <Badge className={getPrioridadeColor(visita.prioridadeClinica)}>
                                {visita.prioridadeClinica}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{visita.endereco}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {visita.condicoesSaude.map((condicao, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {condicao}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {visita.tempoEstimado}min
                            </div>
                            {visita.distanciaProximaVisita && (
                              <div className="flex items-center gap-1 mt-1">
                                <Navigation className="w-3 h-3" />
                                {Math.round(visita.distanciaProximaVisita)}m
                              </div>
                            )}
                          </div>
                          {index < roteiroAtual.visitas.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Roteiro
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Visitas
                  </Button>
                  <Button variant="outline">
                    Exportar PDF
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Route className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Nenhum roteiro gerado
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Configure as opções e clique em "Gerar Roteiro IA" para otimizar suas visitas.
                  </p>
                  <Button onClick={() => window.dispatchEvent(new Event('click'))}>
                    <Brain className="w-4 h-4 mr-2" />
                    Ir para Configuração
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metricas">
            <DashboardInteligente />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlanejamentoRoteiro;
