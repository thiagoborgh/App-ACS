import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Activity,
  Brain,
  MapPin,
  Clock,
  Target
} from 'lucide-react';
import { detectorAlertas, mockPessoas, pacientesPrioritarios } from '@/data/mockData';

interface DashboardWidget {
  id: string;
  titulo: string;
  tipo: 'alerta' | 'insight' | 'metrica' | 'tendencia';
  icone: React.ReactNode;
  dados: any;
  acao?: string;
  urgencia?: 'alta' | 'media' | 'baixa';
}

interface InsightIA {
  titulo: string;
  descricao: string;
  tipo: 'epidemiologico' | 'territorial' | 'operacional';
  impacto: 'alto' | 'medio' | 'baixo';
  recomendacao: string;
}

const DashboardInteligente: React.FC = () => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [insights, setInsights] = useState<InsightIA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateWidgets();
    generateInsights();
    setLoading(false);
  }, []);

  const generateWidgets = () => {
    // Analisar candidatos para busca ativa
    const candidatosBuscaAtiva = detectorAlertas.identificarBuscaAtiva(mockPessoas);
    const alertasAlta = candidatosBuscaAtiva.filter(c => c.urgencia === 'ALTA').length;
    
    // Calcular métricas de eficiência
    const totalPacientes = mockPessoas.length;
    const pacientesRisco = pacientesPrioritarios.length;
    const cobertura = Math.round((pacientesRisco / totalPacientes) * 100);

    const widgetsGerados: DashboardWidget[] = [
      {
        id: 'alertas-criticos',
        titulo: 'Alertas Críticos',
        tipo: 'alerta',
        icone: <AlertTriangle className="h-5 w-5" />,
        dados: {
          quantidade: alertasAlta,
          descricao: alertasAlta > 0 ? `${alertasAlta} casos de alta prioridade` : 'Nenhum alerta crítico'
        },
        urgencia: alertasAlta > 0 ? 'alta' : 'baixa',
        acao: 'Ver detalhes'
      },
      {
        id: 'busca-ativa',
        titulo: 'Busca Ativa IA',
        tipo: 'insight',
        icone: <Target className="h-5 w-5" />,
        dados: {
          total: candidatosBuscaAtiva.length,
          gestantes: candidatosBuscaAtiva.filter(c => c.motivo.includes('GESTANTE')).length,
          cronicos: candidatosBuscaAtiva.filter(c => c.motivo.includes('DIABETES') || c.motivo.includes('HIPERTENSAO')).length
        },
        acao: 'Planejar busca ativa'
      },
      {
        id: 'cobertura-territorio',
        titulo: 'Cobertura Territorial',
        tipo: 'metrica',
        icone: <MapPin className="h-5 w-5" />,
        dados: {
          cobertura,
          meta: 95,
          status: cobertura >= 95 ? 'Meta atingida' : 'Abaixo da meta'
        }
      },
      {
        id: 'eficiencia-ia',
        titulo: 'Eficiência IA',
        tipo: 'tendencia',
        icone: <Brain className="h-5 w-5" />,
        dados: {
          priorizacaoCorreta: '94.2%',
          tempoEconomizado: '2.3h/dia',
          precisaoAlertas: '87.5%'
        }
      }
    ];

    setWidgets(widgetsGerados);
  };

  const generateInsights = () => {
    const insightsGerados: InsightIA[] = [
      {
        titulo: 'Aumento de Diabetes na Microárea Centro',
        descricao: 'IA detectou crescimento de 25% nos casos de diabetes na microárea Centro nos últimos 3 meses',
        tipo: 'epidemiologico',
        impacto: 'alto',
        recomendacao: 'Intensificar busca ativa e organizar grupo de diabéticos'
      },
      {
        titulo: 'Padrão de Visitas Otimizado',
        descricao: 'Algoritmo sugere nova rota que pode reduzir tempo de deslocamento em 30%',
        tipo: 'operacional',
        impacto: 'medio',
        recomendacao: 'Implementar nova sequência de visitas sugerida pela IA'
      },
      {
        titulo: 'Gestantes Faltosas Identificadas',
        descricao: 'Sistema identificou 3 gestantes sem consulta pré-natal há mais de 30 dias',
        tipo: 'territorial',
        impacto: 'alto',
        recomendacao: 'Priorizar busca ativa imediata dessas gestantes'
      }
    ];

    setInsights(insightsGerados);
  };

  const getWidgetColor = (tipo: string, urgencia?: string) => {
    if (urgencia === 'alta') return 'border-red-500 bg-red-50';
    if (tipo === 'alerta') return 'border-orange-500 bg-orange-50';
    if (tipo === 'insight') return 'border-blue-500 bg-blue-50';
    if (tipo === 'metrica') return 'border-green-500 bg-green-50';
    return 'border-purple-500 bg-purple-50';
  };

  const getBadgeColor = (impacto: string) => {
    switch (impacto) {
      case 'alto': return 'bg-red-100 text-red-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'baixo': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Inteligente</h2>
          <p className="text-gray-600">Insights e alertas gerados por IA</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Brain className="w-4 h-4 mr-1" />
          IA Ativa
        </Badge>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map(widget => (
          <Card key={widget.id} className={`${getWidgetColor(widget.tipo, widget.urgencia)} transition-all hover:shadow-md`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {widget.icone}
                  {widget.titulo}
                </CardTitle>
                {widget.urgencia === 'alta' && (
                  <Badge variant="destructive" className="text-xs">
                    Urgente
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {widget.tipo === 'alerta' && (
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {widget.dados.quantidade}
                  </div>
                  <p className="text-xs text-gray-600">{widget.dados.descricao}</p>
                </div>
              )}
              
              {widget.tipo === 'insight' && (
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">
                    {widget.dados.total} casos
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>Gestantes: {widget.dados.gestantes}</div>
                    <div>Crônicos: {widget.dados.cronicos}</div>
                  </div>
                </div>
              )}
              
              {widget.tipo === 'metrica' && (
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {widget.dados.cobertura}%
                  </div>
                  <p className="text-xs text-gray-600">
                    Meta: {widget.dados.meta}% • {widget.dados.status}
                  </p>
                </div>
              )}
              
              {widget.tipo === 'tendencia' && (
                <div className="space-y-1">
                  <div className="text-sm text-gray-900">
                    Priorização: <span className="font-semibold">{widget.dados.priorizacaoCorreta}</span>
                  </div>
                  <div className="text-sm text-gray-900">
                    Economia: <span className="font-semibold">{widget.dados.tempoEconomizado}</span>
                  </div>
                  <div className="text-sm text-gray-900">
                    Precisão: <span className="font-semibold">{widget.dados.precisaoAlertas}</span>
                  </div>
                </div>
              )}
              
              {widget.acao && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3 text-xs"
                  onClick={() => console.log(`Ação: ${widget.acao} para ${widget.titulo}`)}
                >
                  {widget.acao}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Insights da IA
          </CardTitle>
          <CardDescription>
            Análises automáticas e recomendações baseadas nos dados do território
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Alert key={index} className="border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{insight.titulo}</h4>
                      <Badge className={getBadgeColor(insight.impacto)}>
                        {insight.impacto}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.tipo}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm text-gray-600 mb-2">
                      {insight.descricao}
                    </AlertDescription>
                    <div className="text-sm text-blue-700 font-medium">
                      💡 Recomendação: {insight.recomendacao}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Activity className="w-4 h-4 mr-1" />
                    Aplicar
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Validações IA Hoje</p>
                <p className="text-2xl font-bold text-blue-900">247</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Alertas Prevenidos</p>
                <p className="text-2xl font-bold text-green-900">12</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Eficiência Geral</p>
                <p className="text-2xl font-bold text-purple-900">91.7%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardInteligente;
