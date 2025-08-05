
import { useState, useEffect } from 'react';
import { fuzzySearch } from '@/lib/fuzzySearch';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, Users, User, Home, Calendar, MapPin, Clock, Route, Navigation, CheckCircle2, Timer, Star } from 'lucide-react';

const Visitas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todas');
  const [abaSelecionada, setAbaSelecionada] = useState('roteiros'); // 'roteiros' ou 'historico'

  // ACS logado no sistema
  const acsLogado = {
    nome: 'Jonathan Silva Costa',
    cpf: '789.456.123-00',
    microarea: 'MA-003 - Esperança'
  };

  // Mock data para roteiros do dia (apenas do ACS logado)
  const roteirosHoje = [
    {
      id: 'rot-003',
      acs: 'Jonathan Silva Costa',
      microarea: 'MA-003 - Esperança',
      dataRoteiro: '2025-01-25',
      status: 'ativo',
      tempoEstimado: 280, // em minutos
      distanciaTotal: 3.5, // em km
      visitasTotal: 9,
      visitasRealizadas: 4,
      visitas: [
        {
          id: 'v1',
          nome: 'Família Santos (Gestante)',
          endereco: 'Rua da Esperança, 234',
          prioridade: 'critica',
          condicao: 'Gestante de alto risco - 32 semanas',
          tempoEstimado: 45,
          status: 'realizada',
          observacao: 'Pressão controlada, encaminhada para pré-natal especializado'
        },
        {
          id: 'v2', 
          nome: 'Maria das Dores (72 anos)',
          endereco: 'Rua da Esperança, 189',
          prioridade: 'critica',
          condicao: 'Diabetes descompensada + HAS',
          tempoEstimado: 40,
          status: 'realizada',
          observacao: 'Glicemia 280mg/dl, orientado sobre medicação'
        },
        {
          id: 'v3',
          nome: 'João Pereira (58 anos)',
          endereco: 'Travessa São João, 45',
          prioridade: 'alta',
          condicao: 'Tuberculose em tratamento - 3º mês',
          tempoEstimado: 35,
          status: 'realizada',
          observacao: 'Aderindo ao tratamento, sem sintomas respiratórios'
        },
        {
          id: 'v4',
          nome: 'Família Oliveira',
          endereco: 'Travessa São João, 67',
          prioridade: 'alta',
          condicao: 'Criança desnutrida - 2 anos',
          tempoEstimado: 40,
          status: 'realizada',
          observacao: 'Peso ganho 200g, continuidade do acompanhamento nutricional'
        },
        {
          id: 'v5',
          nome: 'Carlos Mendonça (45 anos)',
          endereco: 'Conjunto Vila União, 123',
          prioridade: 'critica',
          condicao: 'Hipertensão grave + AVC recente',
          tempoEstimado: 50,
          status: 'pendente',
          observacao: ''
        },
        {
          id: 'v6',
          nome: 'Dona Rosa (85 anos)',
          endereco: 'Conjunto Vila União, 145',
          prioridade: 'alta',
          condicao: 'Idosa acamada + úlcera de pressão',
          tempoEstimado: 45,
          status: 'pendente',
          observacao: ''
        },
        {
          id: 'v7',
          nome: 'Família Costa',
          endereco: 'Rua da Esperança, 401',
          prioridade: 'media',
          condicao: 'Acompanhamento puericultura',
          tempoEstimado: 25,
          status: 'pendente',
          observacao: ''
        }
      ]
    }
  ];

  // Mock data para visitas históricas (apenas do Jonathan)
  const visitas = [
    {
      id: 1,
      tipo: 'cidadao',
      data: '2024-01-24',
      hora: '14:30',
      endereco: 'Rua da Esperança, 189',
      pessoa: 'Maria das Dores',
      motivo: 'Controle Diabetes',
      status: 'realizada',
      agente: 'Jonathan Silva Costa'
    },
    {
      id: 2,
      tipo: 'familia',
      data: '2024-01-24',
      hora: '10:15',
      endereco: 'Travessa São João, 67', 
      familia: 'Família Oliveira',
      motivo: 'Acompanhamento Nutricional Infantil',
      status: 'realizada',
      agente: 'Jonathan Silva Costa'
    },
    {
      id: 3,
      tipo: 'cidadao',
      data: '2024-01-23',
      hora: '16:00',
      endereco: 'Conjunto Vila União, 123',
      pessoa: 'Carlos Mendonça',
      motivo: 'Pós AVC - Reabilitação',
      status: 'realizada',
      agente: 'Jonathan Silva Costa'
    }
  ];

  const filteredVisitas = searchTerm
    ? fuzzySearch(visitas, ['endereco', 'pessoa', 'familia'], searchTerm, 3).filter(visita => filterTipo === 'todas' || visita.tipo === filterTipo)
    : visitas.filter(visita => filterTipo === 'todas' || visita.tipo === filterTipo);

  // Funções auxiliares para roteiros
  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatarTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const calcularProgresso = (realizadas: number, total: number) => {
    return Math.round((realizadas / total) * 100);
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'cidadao': return <User className="w-4 h-4" />;
      case 'familia': return <Users className="w-4 h-4" />;
      case 'imovel': return <Home className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'cidadao': return 'Cidadão';
      case 'familia': return 'Família';
      case 'imovel': return 'Imóvel';
      default: return tipo;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizada': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Minhas Visitas</h1>
              <p className="text-sm text-gray-600">{acsLogado.nome} • {acsLogado.microarea}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Abas */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <Button
            variant={abaSelecionada === 'roteiros' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setAbaSelecionada('roteiros')}
            className="flex-1 h-10"
          >
            <Route className="w-4 h-4 mr-2" />
            Roteiros do Dia
          </Button>
          <Button
            variant={abaSelecionada === 'historico' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setAbaSelecionada('historico')}
            className="flex-1 h-10"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Histórico
          </Button>
        </div>

        {/* Conteúdo das Abas */}
        {abaSelecionada === 'roteiros' ? (
          <>
            {/* Roteiros Inteligentes do Dia */}
            <div className="space-y-4 mb-6">
              {/* Mensagem motivacional */}
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <h3 className="font-semibold text-green-800">Bom trabalho, Jonathan!</h3>
                </div>
                <p className="text-sm text-green-700">
                  Você já realizou 4 de 9 visitas hoje. Continue assim! 
                  {roteirosHoje[0]?.visitasRealizadas >= 5 
                    ? " Você está quase terminando seu roteiro! 🎯" 
                    : " Próximas visitas são casos prioritários. 🚨"
                  }
                </p>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Meu Roteiro - Hoje
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/planejamento-roteiro')}
                  className="text-xs"
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Planejar
                </Button>
              </div>

              {roteirosHoje.map((roteiro) => (
                <Card key={roteiro.id} className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold text-blue-800">
                          {roteiro.microarea}
                        </CardTitle>
                        <p className="text-sm text-gray-600">Roteiro otimizado pela IA</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {roteiro.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Métricas do Roteiro */}
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div className="bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-green-600">
                          {roteiro.visitasRealizadas}/{roteiro.visitasTotal}
                        </div>
                        <div className="text-xs text-gray-500">Visitas</div>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-blue-600">
                          {formatarTempo(roteiro.tempoEstimado)}
                        </div>
                        <div className="text-xs text-gray-500">Tempo</div>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-purple-600">
                          {roteiro.distanciaTotal}km
                        </div>
                        <div className="text-xs text-gray-500">Distância</div>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progresso</span>
                        <span>{calcularProgresso(roteiro.visitasRealizadas, roteiro.visitasTotal)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calcularProgresso(roteiro.visitasRealizadas, roteiro.visitasTotal)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Lista de Visitas do Roteiro */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Próximas Visitas:</h4>
                      {roteiro.visitas.slice(0, 3).map((visita, index) => (
                        <div 
                          key={visita.id}
                          className={`p-3 rounded-lg border ${
                            visita.status === 'realizada' 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                {visita.status === 'realizada' ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                                ) : (
                                  <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
                                    {index + 1}
                                  </div>
                                )}
                                <span className="text-sm font-medium text-gray-800">
                                  {visita.nome}
                                </span>
                              </div>
                              
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {visita.endereco}
                                </div>
                                <div className="flex items-center">
                                  <Timer className="w-3 h-3 mr-1" />
                                  {formatarTempo(visita.tempoEstimado)} • {visita.condicao}
                                </div>
                                {visita.observacao && (
                                  <div className="text-xs text-green-600 font-medium">
                                    ✓ {visita.observacao}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Badge className={`text-xs ml-2 ${getPrioridadeColor(visita.prioridade)}`}>
                              {visita.prioridade}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {roteiro.visitas.length > 3 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 text-xs"
                          onClick={() => navigate(`/roteiro/${roteiro.id}`)}
                        >
                          Ver todas as {roteiro.visitas.length} visitas
                        </Button>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/roteiro/${roteiro.id}/executar`)}
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Executar Roteiro
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/roteiro/${roteiro.id}/detalhes`)}
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Botões Nova Visita Avulsa */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Visita Avulsa (Fora do Roteiro)</h3>
              <div className="space-y-2">
                <Button 
                  className="w-full h-10 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-sm"
                  onClick={() => navigate('/visita/cidadao/nova')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Cidadão
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="h-10 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm"
                    onClick={() => navigate('/visita/familia/nova')}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Família
                  </Button>
                  <Button 
                    className="h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm"
                    onClick={() => navigate('/visita/imovel/nova')}
                  >
                    <Home className="w-4 h-4 mr-1" />
                    Imóvel
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Aba Histórico - Conteúdo Original */}
        {/* Busca */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por endereço ou pessoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filterTipo === 'todas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTipo('todas')}
            className="whitespace-nowrap"
          >
            Todas
          </Button>
          <Button
            variant={filterTipo === 'cidadao' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTipo('cidadao')}
            className="whitespace-nowrap"
          >
            <User className="w-4 h-4 mr-1" />
            Cidadão
          </Button>
          <Button
            variant={filterTipo === 'familia' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTipo('familia')}
            className="whitespace-nowrap"
          >
            <Users className="w-4 h-4 mr-1" />
            Família
          </Button>
          <Button
            variant={filterTipo === 'imovel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTipo('imovel')}
            className="whitespace-nowrap"
          >
            <Home className="w-4 h-4 mr-1" />
            Imóvel
          </Button>
        </div>

        {/* Botões Nova Visita */}
        <div className="space-y-3 mb-6">
          <Button 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium"
            onClick={() => navigate('/visita/cidadao/nova')}
          >
            <User className="w-5 h-5 mr-2" />
            Nova Visita ao Cidadão
          </Button>
          <Button 
            className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium"
            onClick={() => navigate('/visita/familia/nova')}
          >
            <Users className="w-5 h-5 mr-2" />
            Nova Visita à Família
          </Button>
          <Button 
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
            onClick={() => navigate('/visita/imovel/nova')}
          >
            <Home className="w-5 h-5 mr-2" />
            Nova Visita ao Imóvel
          </Button>
        </div>

        {/* Lista de Visitas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Minhas Visitas Anteriores ({filteredVisitas.length})
          </h2>
          
          {filteredVisitas.map((visita) => (
            <Card key={visita.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getTipoIcon(visita.tipo)}
                      <span className="ml-2 text-sm font-medium text-blue-600">
                        {getTipoLabel(visita.tipo)}
                      </span>
                      <Badge className={`ml-2 text-xs ${getStatusColor(visita.status)}`}>
                        {visita.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-800 mb-1">
                      {visita.pessoa || visita.familia || 'Visita ao Imóvel'}
                    </h3>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {visita.endereco}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {visita.data} às {visita.hora}
                      </div>
                      <p className="text-xs text-gray-500">
                        Motivo: {visita.motivo} • Por: {visita.agente}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVisitas.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma visita encontrada</p>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default Visitas;
