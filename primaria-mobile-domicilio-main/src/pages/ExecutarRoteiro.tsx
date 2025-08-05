import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Navigation,
  AlertTriangle,
  Heart,
  Timer,
  Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ModalPreAtendimento from '@/components/ia/ModalPreAtendimento';

const ExecutarRoteiro = () => {
  const { roteiroId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [visitaAtual, setVisitaAtual] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [roteiro, setRoteiro] = useState<any>(null);
  const [showModalPreAtendimento, setShowModalPreAtendimento] = useState(false);
  const [contextoAtendimento, setContextoAtendimento] = useState<any>(null);

  // Mock data do roteiro do Jonathan
  const mockRoteiro = {
    id: 'rot-003',
    acs: 'Jonathan Silva Costa',
    microarea: 'MA-003 - Esperança',
    dataRoteiro: '2025-01-25',
    status: 'em_execucao',
    tempoEstimado: 280,
    distanciaTotal: 3.5,
    visitasTotal: 9,
    visitasRealizadas: 4,
    visitas: [
      {
        id: 'v5',
        nome: 'Carlos Mendonça (45 anos)',
        endereco: 'Conjunto Vila União, 123',
        prioridade: 'critica',
        condicao: 'Hipertensão grave + AVC recente',
        tempoEstimado: 50,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_carlos_mendonca',
        detalhes: {
          cpf: '123.456.789-00',
          idade: 45,
          telefone: '(85) 99999-1234',
          responsavel: 'Maria Mendonça (esposa)',
          ultimaVisita: '2025-01-20',
          medicamentos: ['Losartana 50mg', 'AAS 100mg', 'Clopidogrel'],
          alergias: 'Nenhuma conhecida'
        }
      },
      {
        id: 'v6',
        nome: 'Dona Rosa (85 anos)',
        endereco: 'Conjunto Vila União, 145',
        prioridade: 'alta',
        condicao: 'Idosa acamada + úlcera de pressão',
        tempoEstimado: 45,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_rosa_silva',
        detalhes: {
          cpf: '987.654.321-00',
          idade: 85,
          telefone: '(85) 98888-5678',
          responsavel: 'João Rosa (filho)',
          ultimaVisita: '2025-01-18',
          medicamentos: ['Omeprazol', 'Dipirona'],
          alergias: 'Penicilina'
        }
      },
      {
        id: 'v7',
        nome: 'Família Costa',
        endereco: 'Rua da Esperança, 401',
        prioridade: 'media',
        condicao: 'Acompanhamento puericultura',
        tempoEstimado: 25,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_pedro_costa', // Bebê sendo acompanhado
        detalhes: {
          responsavel: 'Ana Costa',
          crianca: 'Pedro Costa (6 meses)',
          telefone: '(85) 97777-9012',
          ultimaVisita: '2025-01-15',
          vacinas: 'Em dia conforme calendário',
          peso: '7.2kg'
        }
      },
      {
        id: 'v8',
        nome: 'Joaquim Santos (52 anos)',
        endereco: 'Rua da Esperança, 425',
        prioridade: 'media',
        condicao: 'Diabético + Controle glicêmico',
        tempoEstimado: 35,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_joaquim_santos',
        detalhes: {
          cpf: '456.789.123-00',
          idade: 52,
          telefone: '(85) 96666-7890',
          responsavel: 'Joaquim Santos',
          ultimaVisita: '2025-01-19',
          medicamentos: ['Metformina 850mg', 'Glibenclamida 5mg'],
          alergias: 'Sulfa'
        }
      },
      {
        id: 'v9',
        nome: 'Maria Fernandes (38 anos)',
        endereco: 'Conjunto Vila União, 178',
        prioridade: 'alta',
        condicao: 'Gestante 32 semanas',
        tempoEstimado: 40,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_maria_fernandes',
        detalhes: {
          cpf: '789.123.456-00',
          idade: 38,
          telefone: '(85) 95555-2345',
          responsavel: 'Pedro Fernandes (esposo)',
          ultimaVisita: '2025-01-16',
          medicamentos: ['Ácido fólico', 'Sulfato ferroso'],
          alergias: 'Nenhuma conhecida'
        }
      },
      {
        id: 'v10',
        nome: 'Antônio Lima (67 anos)',
        endereco: 'Rua da Esperança, 456',
        prioridade: 'media',
        condicao: 'Cardiopatia + Acompanhamento',
        tempoEstimado: 30,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_antonio_lima',
        detalhes: {
          cpf: '321.654.987-00',
          idade: 67,
          telefone: '(85) 94444-5678',
          responsavel: 'Antônio Lima',
          ultimaVisita: '2025-01-17',
          medicamentos: ['Carvedilol', 'Enalapril', 'Furosemida'],
          alergias: 'Iodo'
        }
      },
      {
        id: 'v11',
        nome: 'Família Oliveira',
        endereco: 'Conjunto Vila União, 203',
        prioridade: 'media',
        condicao: 'Criança com asma',
        tempoEstimado: 25,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_lucas_oliveira', // Criança sendo acompanhada
        detalhes: {
          responsavel: 'Sandra Oliveira',
          crianca: 'Lucas Oliveira (8 anos)',
          telefone: '(85) 93333-4567',
          ultimaVisita: '2025-01-14',
          medicamentos: ['Bombinha broncodilatadora'],
          alergias: 'Ácaros, pólen'
        }
      },
      {
        id: 'v12',
        nome: 'Sebastião Rocha (71 anos)',
        endereco: 'Rua da Esperança, 489',
        prioridade: 'alta',
        condicao: 'DPOC + Oxigenoterapia',
        tempoEstimado: 45,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_sebastiao_rocha',
        detalhes: {
          cpf: '654.987.321-00',
          idade: 71,
          telefone: '(85) 92222-6789',
          responsavel: 'Carmen Rocha (filha)',
          ultimaVisita: '2025-01-18',
          medicamentos: ['Spiriva', 'Prednisolona', 'Brometo de ipratrópio'],
          alergias: 'Látex'
        }
      },
      {
        id: 'v13',
        nome: 'Joana Pereira (29 anos)',
        endereco: 'Conjunto Vila União, 234',
        prioridade: 'critica',
        condicao: 'Puérpera + Depressão pós-parto',
        tempoEstimado: 50,
        status: 'pendente',
        observacao: '',
        pessoaId: 'p_joana_pereira',
        detalhes: {
          cpf: '147.258.369-00',
          idade: 29,
          telefone: '(85) 91111-8901',
          responsavel: 'Roberto Pereira (esposo)',
          ultimaVisita: '2025-01-21',
          medicamentos: ['Sertralina', 'Complexo B'],
          alergias: 'Nenhuma conhecida'
        }
      }
    ]
  };

  useEffect(() => {
    // Simular carregamento do roteiro
    setRoteiro(mockRoteiro);
    
    // Encontrar primeira visita pendente
    const primeiraPendente = mockRoteiro.visitas.findIndex(v => v.status === 'pendente');
    if (primeiraPendente !== -1) {
      setVisitaAtual(primeiraPendente);
    }
  }, [roteiroId]);

  const visitaCorrente = roteiro?.visitas[visitaAtual];
  const visitasRestantes = roteiro?.visitas.filter(v => v.status === 'pendente').length || 0;

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleIniciarAtendimento = () => {
    // Abrir modal de preparação ao invés de navegar diretamente
    setShowModalPreAtendimento(true);
  };

  const handleConfirmarAtendimento = (contextoIA: any) => {
    setContextoAtendimento(contextoIA);
    setShowModalPreAtendimento(false);
    
    toast({
      title: "Atendimento iniciado",
      description: `Visita a ${visitaCorrente.nome} em andamento com contexto IA preparado.`
    });
    
    // Navegar para tela de atendimento com contexto IA
    navigate(`/visita/atendimento/${visitaCorrente.id}`, {
      state: { 
        visita: visitaCorrente, 
        roteiro: roteiro,
        contextoIA: contextoIA
      }
    });
  };

  const handleCancelarModal = () => {
    setShowModalPreAtendimento(false);
  };

  const handleMunicipeAusente = () => {
    if (!roteiro) return;
    
    const novasVisitas = [...roteiro.visitas];
    novasVisitas[visitaAtual] = {
      ...novasVisitas[visitaAtual],
      status: 'ausente',
      observacao: 'Munícipe ausente no momento da visita'
    };
    
    setRoteiro({ ...roteiro, visitas: novasVisitas });
    proximaVisita();
    
    toast({
      title: "Munícipe ausente",
      description: "Visita marcada como ausente. Próxima visita carregada.",
      variant: "default"
    });
  };

  const handleVoltarMaisTarde = () => {
    if (!roteiro) return;
    
    const novasVisitas = [...roteiro.visitas];
    novasVisitas[visitaAtual] = {
      ...novasVisitas[visitaAtual],
      status: 'reagendada',
      observacao: observacoes || 'Reagendada para mais tarde'
    };
    
    setRoteiro({ ...roteiro, visitas: novasVisitas });
    proximaVisita();
    
    toast({
      title: "Visita reagendada",
      description: "Visita marcada para mais tarde. Próxima visita carregada."
    });
  };

  const proximaVisita = () => {
    if (!roteiro) return;
    
    // Encontrar próxima visita pendente
    const proximaPendente = roteiro.visitas.findIndex((v, index) => 
      index > visitaAtual && v.status === 'pendente'
    );
    
    if (proximaPendente !== -1) {
      setVisitaAtual(proximaPendente);
      setObservacoes('');
    } else {
      // Todas as visitas foram processadas
      toast({
        title: "Roteiro concluído!",
        description: "Todas as visitas foram processadas.",
        variant: "default"
      });
      navigate('/visitas');
    }
  };

  if (!roteiro || !visitaCorrente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando roteiro...</p>
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
              onClick={() => navigate('/visitas')}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Executando Roteiro</h1>
              <p className="text-sm text-gray-600">Jonathan Silva Costa • MA-003 - Esperança</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Progresso do Roteiro */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Progresso do Roteiro
              </h2>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {visitaAtual + 1} / {roteiro.visitas.length}
              </div>
              <p className="text-sm text-gray-600">
                {visitasRestantes} visita{visitasRestantes !== 1 ? 's' : ''} restante{visitasRestantes !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((visitaAtual + 1) / roteiro.visitas.length) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Próxima Visita */}
        <Card className="mb-6 border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-orange-800">
                Próxima Visita
              </CardTitle>
              <Badge className={`${getPrioridadeColor(visitaCorrente.prioridade)}`}>
                {visitaCorrente.prioridade}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Informações da Visita */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  {visitaCorrente.nome}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {visitaCorrente.endereco}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Timer className="w-4 h-4 mr-2" />
                    Tempo estimado: {visitaCorrente.tempoEstimado} minutos
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Heart className="w-4 h-4 mr-2" />
                    {visitaCorrente.condicao}
                  </div>
                </div>
              </div>

              {/* Detalhes Adicionais */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-700 mb-2">Informações do Paciente</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {visitaCorrente.detalhes.telefone && (
                    <p><strong>Telefone:</strong> {visitaCorrente.detalhes.telefone}</p>
                  )}
                  {visitaCorrente.detalhes.responsavel && (
                    <p><strong>Responsável:</strong> {visitaCorrente.detalhes.responsavel}</p>
                  )}
                  {visitaCorrente.detalhes.ultimaVisita && (
                    <p><strong>Última visita:</strong> {visitaCorrente.detalhes.ultimaVisita}</p>
                  )}
                  {visitaCorrente.detalhes.medicamentos && (
                    <p><strong>Medicamentos:</strong> {visitaCorrente.detalhes.medicamentos.join(', ')}</p>
                  )}
                </div>
              </div>

              {/* Campo de Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <Textarea
                  placeholder="Adicione observações sobre esta visita..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações da Visita */}
        <div className="space-y-3">
          <Button 
            className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg"
            onClick={handleIniciarAtendimento}
          >
            <User className="w-5 h-5 mr-3" />
            Iniciar Atendimento
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              className="h-12 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              onClick={handleMunicipeAusente}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Ausente
            </Button>
            
            <Button 
              variant="outline"
              className="h-12 border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={handleVoltarMaisTarde}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Mais Tarde
            </Button>
          </div>

          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/visitas')}
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar às Visitas
          </Button>
        </div>

        {/* Próximas Visitas (Preview) */}
        {visitasRestantes > 1 && (
          <Card className="mt-6 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gray-700">
                Próximas Visitas ({visitasRestantes - 1})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roteiro.visitas
                  .filter((v, index) => index > visitaAtual && v.status === 'pendente')
                  .slice(0, 2)
                  .map((visita, index) => (
                    <div key={visita.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 2}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{visita.nome}</p>
                        <p className="text-xs text-gray-600">{visita.endereco}</p>
                      </div>
                      <Badge className={`text-xs ${getPrioridadeColor(visita.prioridade)}`}>
                        {visita.prioridade}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Preparação para Atendimento */}
      <ModalPreAtendimento
        isOpen={showModalPreAtendimento}
        onClose={handleCancelarModal}
        onIniciarAtendimento={handleConfirmarAtendimento}
        visita={visitaCorrente}
      />
    </div>
  );
};

export default ExecutarRoteiro;
