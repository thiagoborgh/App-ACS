import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Stethoscope,
  ClipboardList,
  Wifi,
  Heart,
  User,
  Lightbulb,
  X,
  Loader2
} from 'lucide-react';
import { detectorAlertas, mockPessoas } from '@/data/mockData';

interface PreChecklist {
  localConfirmado: boolean;
  materialCompleto: boolean;
  connectividade: boolean;
  alertasRevisados: boolean;
  protocoloCarregado: boolean;
}

interface ContextoIA {
  alertaPrincipal: string;
  alertasSecundarios: string[];
  materiaisNecessarios: string[];
  perguntasChave: string[];
  protocoloSugerido: string;
  tempoEstimadoReal: number;
  ultimasVisitas: string[];
  medicamentosAtivos: string[];
  pontosAtencao: string[];
}

interface ModalPreAtendimentoProps {
  isOpen: boolean;
  onClose: () => void;
  onIniciarAtendimento: (contexto: ContextoIA) => void;
  visita: any;
}

const ModalPreAtendimento: React.FC<ModalPreAtendimentoProps> = ({
  isOpen,
  onClose,
  onIniciarAtendimento,
  visita
}) => {
  const [checklist, setChecklist] = useState<PreChecklist>({
    localConfirmado: false,
    materialCompleto: false,
    connectividade: true, // Assumir conectividade inicial
    alertasRevisados: false,
    protocoloCarregado: false
  });

  const [contextoIA, setContextoIA] = useState<ContextoIA | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);

  // Simular carregamento do contexto IA
  useEffect(() => {
    if (isOpen && visita) {
      setCarregandoIA(true);
      
      // Simular delay de processamento IA
      setTimeout(() => {
        const contextoSimulado = gerarContextoIA(visita);
        setContextoIA(contextoSimulado);
        setCarregandoIA(false);
        
        // Auto-marcar que protocolo foi carregado
        setChecklist(prev => ({ ...prev, protocoloCarregado: true }));
      }, 1500);
    }
  }, [isOpen, visita]);

  const gerarContextoIA = (visita: any): ContextoIA => {
    // Gerar contexto baseado no tipo de visita e condição
    const contextos = {
      'critica': {
        alertaPrincipal: `🚨 CRÍTICO: ${visita.condicao} - Monitoramento intensivo necessário`,
        alertasSecundarios: [
          'Pressão arterial pode estar instável',
          'Verificar adesão rigorosa aos medicamentos',
          'Avaliar sinais de agravamento'
        ],
        materiaisNecessarios: [
          '🩺 Aparelho de Pressão (obrigatório)',
          '📋 Formulário de Emergência',
          '📱 Telefone carregado (emergências)',
          '💊 Lista de medicamentos atualizada'
        ],
        perguntasChave: [
          '❓ Como se sente hoje comparado à última visita?',
          '💊 Tomou todos os medicamentos conforme orientado?',
          '🩺 Teve algum episódio de pressão alta esta semana?',
          '🏥 Precisa de encaminhamento para UBS?'
        ],
        protocoloSugerido: 'Protocolo de Hipertensão Grave + AVC',
        tempoEstimadoReal: Math.round(visita.tempoEstimado * 1.3),
        ultimasVisitas: [
          '20/01: PA 180/110 - Medicação ajustada',
          '15/01: Queixa de tontura e dor de cabeça',
          '10/01: Adesão irregular aos medicamentos'
        ],
        medicamentosAtivos: ['Losartana 50mg', 'AAS 100mg', 'Clopidogrel'],
        pontosAtencao: [
          'Histórico de baixa adesão medicamentosa',
          'Episódios recorrentes de PA elevada',
          'Necessita monitoramento semanal'
        ]
      },
      'alta': {
        alertaPrincipal: `⚠️ ALTA PRIORIDADE: ${visita.condicao} - Cuidados especializados`,
        alertasSecundarios: [
          'Risco de infecção na úlcera de pressão',
          'Necessita mobilização assistida',
          'Atenção especial à hidratação'
        ],
        materiaisNecessarios: [
          '🧤 Luvas descartáveis',
          '🧴 Material para curativo',
          '📏 Régua para medir úlcera',
          '📋 Escala de Braden'
        ],
        perguntasChave: [
          '🛏️ Como está a mobilização no leito?',
          '🩹 Houve mudanças na úlcera?',
          '💧 Está se alimentando e hidratando bem?',
          '😴 Qualidade do sono tem melhorado?'
        ],
        protocoloSugerido: 'Protocolo de Cuidados ao Idoso Acamado',
        tempoEstimadoReal: Math.round(visita.tempoEstimado * 1.2),
        ultimasVisitas: [
          '18/01: Úlcera estável, sem sinais de infecção',
          '13/01: Orientações sobre posicionamento',
          '08/01: Início do protocolo de prevenção'
        ],
        medicamentosAtivos: ['Omeprazol', 'Dipirona'],
        pontosAtencao: [
          'Cuidador principal: João Rosa (filho)',
          'Úlcera em região sacral - estágio II',
          'Necessita visitas semanais'
        ]
      },
      'media': {
        alertaPrincipal: `ℹ️ ACOMPANHAMENTO: ${visita.condicao} - Rotina de puericultura`,
        alertasSecundarios: [
          'Verificar desenvolvimento neuropsicomotor',
          'Conferir cartão de vacinação',
          'Avaliar ganho de peso adequado'
        ],
        materiaisNecessarios: [
          '⚖️ Balança infantil',
          '📏 Fita métrica',
          '📋 Cartão de vacinas',
          '📚 Material educativo'
        ],
        perguntasChave: [
          '👶 Como está o desenvolvimento do bebê?',
          '🍼 Aleitamento materno está funcionando?',
          '💉 Vacinas estão em dia?',
          '😊 Alguma preocupação com o crescimento?'
        ],
        protocoloSugerido: 'Protocolo de Puericultura - 6 meses',
        tempoEstimadoReal: visita.tempoEstimado,
        ultimasVisitas: [
          '15/01: Peso 7.0kg - curva adequada',
          '10/01: Vacinas em dia, desenvolvimento normal',
          '05/01: Orientações sobre alimentação complementar'
        ],
        medicamentosAtivos: ['Vitamina D'],
        pontosAtencao: [
          'Aleitamento materno exclusivo até os 6 meses',
          'Desenvolvimento dentro do esperado',
          'Próxima consulta: introdução alimentar'
        ]
      }
    };

    return contextos[visita.prioridade as keyof typeof contextos] || contextos.media;
  };

  const handleChecklistChange = (campo: keyof PreChecklist, valor: boolean) => {
    setChecklist(prev => ({ ...prev, [campo]: valor }));
  };

  const podeIniciar = Object.values(checklist).every(Boolean) && contextoIA !== null;

  const handleIniciar = () => {
    if (contextoIA && podeIniciar) {
      onIniciarAtendimento(contextoIA);
    }
  };

  const getCheckIcon = (checked: boolean) => {
    return checked ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-6 h-6 text-blue-600" />
            Preparação Inteligente para Atendimento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Visita */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                {visita?.nome}
                <Badge className={`ml-auto ${
                  visita?.prioridade === 'critica' ? 'bg-red-500' :
                  visita?.prioridade === 'alta' ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  {visita?.prioridade?.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{visita?.endereco}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span>{visita?.condicao}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Tempo estimado: {visita?.tempoEstimado} min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contexto IA */}
          {carregandoIA ? (
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span className="text-purple-700">IA analisando contexto da visita...</span>
                </div>
              </CardContent>
            </Card>
          ) : contextoIA && (
            <Card className="border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-purple-800">
                  <Brain className="w-4 h-4" />
                  Análise Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Alerta Principal */}
                <Alert className={`${
                  visita?.prioridade === 'critica' ? 'border-red-500 bg-red-50' :
                  visita?.prioridade === 'alta' ? 'border-orange-500 bg-orange-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {contextoIA.alertaPrincipal}
                  </AlertDescription>
                </Alert>

                {/* Tempo Estimado Ajustado */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">
                    <strong>Tempo ajustado pela IA:</strong> {contextoIA.tempoEstimadoReal} min
                    {contextoIA.tempoEstimadoReal > visita?.tempoEstimado && (
                      <span className="text-orange-600 ml-1">
                        (+{contextoIA.tempoEstimadoReal - visita?.tempoEstimado} min devido à complexidade)
                      </span>
                    )}
                  </span>
                </div>

                {/* Últimas Visitas */}
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Histórico Recente
                  </h4>
                  <div className="space-y-1">
                    {contextoIA.ultimasVisitas.map((visita, index) => (
                      <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {visita}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Checklist Pré-Atendimento */}
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                Checklist Pré-Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleChecklistChange('localConfirmado', !checklist.localConfirmado)}>
                  {getCheckIcon(checklist.localConfirmado)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">Local confirmado e pessoa presente</div>
                    <div className="text-xs text-gray-500">Endereço correto, morador disponível para atendimento</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleChecklistChange('materialCompleto', !checklist.materialCompleto)}>
                  {getCheckIcon(checklist.materialCompleto)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">Material completo disponível</div>
                    <div className="text-xs text-gray-500">Equipamentos, formulários e materiais necessários</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleChecklistChange('connectividade', !checklist.connectividade)}>
                  {getCheckIcon(checklist.connectividade)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">Conectividade verificada</div>
                    <div className="text-xs text-gray-500">Internet disponível para sincronização (ou modo offline ativo)</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleChecklistChange('alertasRevisados', !checklist.alertasRevisados)}>
                  {getCheckIcon(checklist.alertasRevisados)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">Alertas clínicos revisados</div>
                    <div className="text-xs text-gray-500">Análise IA e pontos de atenção verificados</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getCheckIcon(checklist.protocoloCarregado)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">Protocolo de atendimento carregado</div>
                    <div className="text-xs text-gray-500">IA preparou protocolo específico para esta visita</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Materiais Necessários (só aparece se contexto IA carregado) */}
          {contextoIA && (
            <Card className="border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-yellow-800">
                  <Stethoscope className="w-4 h-4" />
                  Materiais Necessários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contextoIA.materiaisNecessarios.map((material, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>{material}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Perguntas-Chave (só aparece se contexto IA carregado) */}
          {contextoIA && (
            <Card className="border-indigo-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-indigo-800">
                  <Lightbulb className="w-4 h-4" />
                  Perguntas-Chave Sugeridas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contextoIA.perguntasChave.map((pergunta, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                      <span>{pergunta}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            disabled={!podeIniciar}
            onClick={handleIniciar}
            className={`flex-1 ${podeIniciar ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {podeIniciar ? 'Iniciar Atendimento' : 'Complete o Checklist'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPreAtendimento;
