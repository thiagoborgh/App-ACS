import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BuscaAtivaSection from '@/components/visitas/BuscaAtivaSection';
import AcompanhamentoSection from '@/components/visitas/AcompanhamentoSection';
import AntropometriaSection from '@/components/visitas/AntropometriaSection';
import CitizenSelectionSection from '@/components/visitas/CitizenSelectionSection';
import VisitaConfirmationSection from '@/components/visitas/VisitaConfirmationSection';
import VisitaReasonsSection from '@/components/visitas/VisitaReasonsSection';
import ExpandableSection from '@/components/visitas/ExpandableSection';
import ProfessionalAccompanimentSection from '@/components/visitas/ProfessionalAccompanimentSection';
import ObservationsSection from '@/components/visitas/ObservationsSection';

const VisitaCidadao = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cidadaoSelecionado, setCidadaoSelecionado] = useState<any>(null);
  const [visitaRealizada, setVisitaRealizada] = useState(true);
  const [showBuscaAtiva, setShowBuscaAtiva] = useState(false);
  const [showAcompanhamento, setShowAcompanhamento] = useState(false);
  const [showAntropometria, setShowAntropometria] = useState(false);
  const [visitaAcompanhada, setVisitaAcompanhada] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  // Mock data para cidadãos
  const cidadaos = [
    { id: 1, nome: 'Maria Silva Santos', cpf: '123.456.789-01', endereco: 'Rua das Flores, 123' },
    { id: 2, nome: 'João Pedro Oliveira', cpf: '987.654.321-02', endereco: 'Rua das Flores, 125' },
    { id: 3, nome: 'Ana Costa Lima', cpf: '456.789.123-03', endereco: 'Rua das Flores, 127' }
  ];

  const motivosVisita = [
    'Consulta Médica',
    'Consulta Odontológica', 
    'Vacinação',
    'Acompanhamento',
    'Orientação em Saúde',
    'Busca Ativa',
    'Controle de Medicamentos',
    'Outros'
  ];

  const profissionaisEquipe = [
    'Dr. Carlos - Médico',
    'Dra. Ana - Enfermeira', 
    'Maria - Técnica de Enfermagem',
    'João - Dentista'
  ];

  const onSubmit = (data: any) => {
    console.log('Dados da visita:', data);
    toast({
      title: "Visita registrada com sucesso!",
      description: "Os dados foram salvos e serão sincronizados.",
    });
    navigate('/visitas');
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
              onClick={() => navigate('/visitas')}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Nova Visita ao Cidadão</h1>
              <p className="text-sm text-gray-600">Registro de visita domiciliar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Seleção do Cidadão */}
          <CitizenSelectionSection
            cidadaoSelecionado={cidadaoSelecionado}
            setCidadaoSelecionado={setCidadaoSelecionado}
            cidadaos={cidadaos}
          />

          {/* Confirmação da Visita */}
          <VisitaConfirmationSection
            visitaRealizada={visitaRealizada}
            setVisitaRealizada={setVisitaRealizada}
          />

          {visitaRealizada && (
            <>
              {/* Motivo da Visita */}
              <VisitaReasonsSection
                register={register}
                motivosVisita={motivosVisita}
              />

              {/* Seções Expandíveis */}
              <div className="space-y-4">
                <ExpandableSection
                  title="Busca Ativa"
                  isExpanded={showBuscaAtiva}
                  onToggle={() => setShowBuscaAtiva(!showBuscaAtiva)}
                >
                  <BuscaAtivaSection register={register} />
                </ExpandableSection>

                <ExpandableSection
                  title="Acompanhamento"
                  isExpanded={showAcompanhamento}
                  onToggle={() => setShowAcompanhamento(!showAcompanhamento)}
                >
                  <AcompanhamentoSection register={register} />
                </ExpandableSection>

                <ExpandableSection
                  title="Antropometria"
                  isExpanded={showAntropometria}
                  onToggle={() => setShowAntropometria(!showAntropometria)}
                >
                  <AntropometriaSection register={register} />
                </ExpandableSection>
              </div>

              {/* Visita Acompanhada */}
              <ProfessionalAccompanimentSection
                register={register}
                visitaAcompanhada={visitaAcompanhada}
                setVisitaAcompanhada={setVisitaAcompanhada}
                profissionaisEquipe={profissionaisEquipe}
              />

              {/* Observações */}
              <ObservationsSection
                register={register}
                placeholder="Registre aqui observações importantes sobre a visita..."
              />
            </>
          )}

          {/* Botão Salvar */}
          <Button 
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Visita
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VisitaCidadao;
