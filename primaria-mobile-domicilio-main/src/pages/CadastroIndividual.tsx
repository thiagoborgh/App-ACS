
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, FileText, Heart, AlertTriangle, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { CidadaoData } from '@/components/cadastro-individual/types';
import IdentificacaoStep1 from '@/components/cadastro-individual/IdentificacaoStep1';
import IdentificacaoStep2 from '@/components/cadastro-individual/IdentificacaoStep2';
import SociodemograficasStep1 from '@/components/cadastro-individual/SociodemograficasStep1';
import SociodemograficasStep2 from '@/components/cadastro-individual/SociodemograficasStep2';
import CondicoesSaudeStep from '@/components/cadastro-individual/CondicoesSaudeStep';
import CondicoesGeraisStep from '@/components/cadastro-individual/CondicoesGeraisStep';
import SituacaoRuaStep from '@/components/cadastro-individual/SituacaoRuaStep';
import StepNavigation from '@/components/cadastro-individual/StepNavigation';
import { validarCPF, sugerirCorrecaoCPF, validarDataNascimento, sugerirCorrecaoData, validarCamposObrigatorios, validarDataFutura } from '@/lib/cadastroValidation';

const CadastroIndividual = () => {
  const { familiaId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Verificar se é cadastro independente ou dentro do contexto familiar
  const isIndependentRegistration = !familiaId;
  
  // Função para salvar cadastro mockado
  const salvarCadastroMock = (dados: CidadaoData) => {
    const cadastros = JSON.parse(localStorage.getItem('cadastros_individuais') || '[]');
    cadastros.push(dados);
    localStorage.setItem('cadastros_individuais', JSON.stringify(cadastros));
  };

  const [formData, setFormData] = useState<CidadaoData>({
    cpf: '',
    cns: '',
    nomeCompleto: '',
    nomeSocial: '',
    dataNascimento: '',
    sexo: '',
    responsavelFamiliar: false,
    nomeMae: '',
    nomePai: '',
    nacionalidade: '',
    municipioNascimento: '',
    telefoneCelular: '',
    email: '',
    racaCor: '',
    etniaIndigena: '',
    relacaoParentesco: '',
    ocupacao: '',
    situacaoMercado: '',
    frequentaEscola: '',
    escolaridade: '',
    situacaoConjugal: '',
    orientacaoSexual: '',
    identidadeGenero: '',
    gestante: false,
    puerpera: false,
    amamentando: false,
    planejamentoFamiliar: false,
    hipertensao: false,
    diabetes: false,
    avcDerrame: false,
    infarto: false,
    problemaRenalCronico: false,
    problemaMental: false,
    alcoolismo: false,
    outrasDrogas: false,
    tabagismo: false,
    acamado: false,
    domiciliado: false,
    problemaMobilidade: false,
    situacaoRua: false,
    tempoSituacaoRua: '',
    recebeBeneficio: false,
    referenciaFamiliar: false,
    acompanhamentoCras: false,
    visitaParentes: '',
    recusaCadastro: false
  });

  const updateFormData = (field: keyof CidadaoData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        // CPF ou CNS: pelo menos um deve ser preenchido
        const cpfPreenchido = formData.cpf && formData.cpf.replace(/\D/g, '').length === 11;
        const cnsPreenchido = formData.cns && formData.cns.trim().length > 0;
        if (!cpfPreenchido && !cnsPreenchido) {
          toast({
            title: 'Documento obrigatório',
            description: 'Preencha CPF válido (11 dígitos) ou CNS.',
            variant: 'destructive'
          });
             // Função para salvar cadastro mockado
             const salvarCadastroMock = (dados: CidadaoData) => {
               const cadastros = JSON.parse(localStorage.getItem('cadastros_individuais') || '[]');
               cadastros.push(dados);
               localStorage.setItem('cadastros_individuais', JSON.stringify(cadastros));
             };

             const [currentStep, setCurrentStep] = useState(1);
        }
        // Se CPF preenchido, validar
        if (formData.cpf && !validarCPF(formData.cpf)) {
          toast({
            title: 'CPF inválido',
            description: `Sugestão: ${sugerirCorrecaoCPF(formData.cpf)}`,
            variant: 'destructive'
          });
          return false;
        }
        // Validação de data de nascimento
        if (formData.dataNascimento && (!validarDataNascimento(formData.dataNascimento) || validarDataFutura(formData.dataNascimento))) {
          toast({
            title: 'Data de nascimento inválida',
            description: sugerirCorrecaoData(formData.dataNascimento),
            variant: 'destructive'
          });
          return false;
        }
        // Campos obrigatórios
        const obrigatorios = ['nomeCompleto', 'dataNascimento', 'sexo'];
        const faltando = validarCamposObrigatorios(formData, obrigatorios);
        if (faltando.length > 0) {
          toast({
            title: 'Campos obrigatórios',
            description: `Preencha: ${faltando.join(', ')}`,
            variant: 'destructive'
          });
          return false;
        }
        return true;
      }
      case 2: {
        const obrigatorios = ['nacionalidade', 'municipioNascimento'];
        const faltando = validarCamposObrigatorios(formData, obrigatorios);
        if (faltando.length > 0) {
          toast({
            title: 'Campos obrigatórios',
            description: `Preencha: ${faltando.join(', ')}`,
            variant: 'destructive'
          });
          return false;
        }
        return true;
      }
      case 3: {
        const obrigatorios = ['racaCor', 'relacaoParentesco'];
        const faltando = validarCamposObrigatorios(formData, obrigatorios);
        if (faltando.length > 0) {
          toast({
            title: 'Campos obrigatórios',
            description: `Preencha: ${faltando.join(', ')}`,
            variant: 'destructive'
          });
          return false;
        }
        return true;
      }
      case 4:
      case 5:
      case 6:
        return true;
      case 7:
        if (!formData.situacaoRua) return true;
        return !!formData.tempoSituacaoRua;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 7) {
        // Pular etapa 7 se não está em situação de rua
        if (currentStep === 6 && !formData.situacaoRua) {
          handleSubmit();
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else {
        handleSubmit();
      }
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = () => {
    console.log('Dados do cidadão:', formData);
    console.log('Contexto familiar:', familiaId);
    console.log('Cadastro independente:', isIndependentRegistration);
    
    const cidadaoId = Math.floor(Math.random() * 1000);
    toast({
      title: "Sucesso!",
      description: "Cidadão cadastrado com sucesso.",
    });
    
    // Navegar para diferentes páginas dependendo do contexto
    if (isIndependentRegistration) {
      navigate(`/pessoa/${cidadaoId}`);
    } else {
      navigate(`/pessoa/${cidadaoId}`);
    }
  };

  const handleRecusaCadastro = () => {
    if (currentStep <= 2) {
      setFormData(prev => ({ ...prev, recusaCadastro: true }));
      console.log('Recusa de cadastro registrada:', { 
        cpf: formData.cpf,
        cns: formData.cns,
        nomeCompleto: formData.nomeCompleto,
        recusaCadastro: true,
        contexto: isIndependentRegistration ? 'independente' : 'familiar'
      });
      toast({
        title: "Recusa registrada",
        description: "A recusa do cadastro foi registrada com os dados mínimos.",
      });
      
      if (isIndependentRegistration) {
        navigate('/');
      } else {
        navigate(`/familia/${familiaId}`);
      }
    }
  };

  const handleBack = () => {
    if (isIndependentRegistration) {
      navigate('/');
    } else {
      navigate(`/familia/${familiaId}`);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = { formData, updateFormData };
    
    switch (currentStep) {
      case 1:
        return <IdentificacaoStep1 {...stepProps} currentStep={currentStep} onRecusaCadastro={handleRecusaCadastro} />;
      case 2:
        return <IdentificacaoStep2 {...stepProps} />;
      case 3:
        return <SociodemograficasStep1 {...stepProps} />;
      case 4:
        return <SociodemograficasStep2 {...stepProps} />;
      case 5:
        return <CondicoesSaudeStep {...stepProps} />;
      case 6:
        return <CondicoesGeraisStep {...stepProps} />;
      case 7:
        return <SituacaoRuaStep {...stepProps} />;
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Identificação (1/2)', icon: User },
    { number: 2, title: 'Identificação (2/2)', icon: User },
    { number: 3, title: 'Sociodemográficas (1/2)', icon: FileText },
    { number: 4, title: 'Sociodemográficas (2/2)', icon: FileText },
    { number: 5, title: 'Condições de Saúde', icon: Heart },
    { number: 6, title: 'Condições Gerais', icon: Heart },
    { number: 7, title: 'Situação de Rua', icon: AlertTriangle }
  ];

  const totalSteps = formData.situacaoRua ? 7 : 6;
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-background">
      {/* Header com gradiente sutil */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                {isIndependentRegistration ? 'Novo Cadastro' : 'Novo Membro'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Etapa {currentStep} de {totalSteps} • {currentStepData.title}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/cadastro-inteligente')}
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Brain className="w-4 h-4" />
              IA
            </Button>
          </div>

          {/* Progress Bar melhorado */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isCompleted = currentStep > stepNumber;
                const isCurrent = currentStep === stepNumber;
                
                return (
                  <div key={stepNumber} className="flex-1 relative">
                    <div className={`h-1.5 rounded-full transition-colors ${
                      isCompleted ? 'bg-primary' : 
                      isCurrent ? 'bg-primary/60' : 'bg-muted'
                    }`} />
                    {isCurrent && (
                      <div className="absolute -top-1 left-0 right-0 h-3.5 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                <currentStepData.icon className="w-4 h-4 text-primary" />
                {currentStepData.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Card className="border-border shadow-sm">
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-8">
          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={() => setCurrentStep(currentStep - 1)}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CadastroIndividual;
