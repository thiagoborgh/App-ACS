
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ControleAmbientalSection from '@/components/visitas/ControleAmbientalSection';
import FamilySelectionSection from '@/components/visitas/FamilySelectionSection';
import VisitaConfirmationSection from '@/components/visitas/VisitaConfirmationSection';
import VisitaReasonsSection from '@/components/visitas/VisitaReasonsSection';
import ExpandableSection from '@/components/visitas/ExpandableSection';
import ProfessionalAccompanimentSection from '@/components/visitas/ProfessionalAccompanimentSection';
import ObservationsSection from '@/components/visitas/ObservationsSection';

const VisitaFamilia = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [familiaEImovelSelecionado, setFamiliaEImovelSelecionado] = useState<any>(null);
  const [visitaRealizada, setVisitaRealizada] = useState(true);
  const [showControleAmbiental, setShowControleAmbiental] = useState(false);
  const [visitaAcompanhada, setVisitaAcompanhada] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  // Mock data para famílias
  const familias = [
    { 
      id: 1, 
      nome: 'Família Silva Santos', 
      endereco: 'Rua das Flores, 123',
      responsavel: 'Maria Silva Santos',
      membros: 4,
      domicilio: 'Casa própria'
    },
    { 
      id: 2, 
      nome: 'Família Oliveira', 
      endereco: 'Rua das Flores, 125',
      responsavel: 'João Pedro Oliveira',
      membros: 3,
      domicilio: 'Apartamento alugado'
    },
    { 
      id: 3, 
      nome: 'Família Costa Lima', 
      endereco: 'Rua das Flores, 127',
      responsavel: 'Ana Costa Lima',
      membros: 5,
      domicilio: 'Casa própria'
    }
  ];

  const motivosVisita = [
    'Visita Periódica',
    'Controle Ambiental',
    'Orientação',
    'Cadastramento',
    'Outros'
  ];

  const profissionaisEquipe = [
    'Dr. Carlos - Médico',
    'Dra. Ana - Enfermeira', 
    'Maria - Técnica de Enfermagem',
    'João - Dentista'
  ];

  const onSubmit = (data: any) => {
    console.log('Dados da visita à família:', data);
    toast({
      title: "Visita à família registrada com sucesso!",
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
              <h1 className="text-lg font-bold text-gray-800">Nova Visita à Família</h1>
              <p className="text-sm text-gray-600">Registro de visita domiciliar familiar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Seleção da Família */}
          <FamilySelectionSection
            familiaEImovelSelecionado={familiaEImovelSelecionado}
            setFamiliaEImovelSelecionado={setFamiliaEImovelSelecionado}
            familias={familias}
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
              <ExpandableSection
                title="Controle Ambiental/Vetorial"
                isExpanded={showControleAmbiental}
                onToggle={() => setShowControleAmbiental(!showControleAmbiental)}
              >
                <ControleAmbientalSection register={register} />
              </ExpandableSection>

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
                placeholder="Registre aqui observações importantes sobre a visita à família..."
              />
            </>
          )}

          {/* Botão Salvar */}
          <Button 
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Visita à Família
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VisitaFamilia;
