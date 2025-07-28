import { useState } from 'react';
import { validarCamposObrigatorios } from '@/lib/cadastroValidation';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Check, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FamiliaData {
  prontuario: string;
  dataCadastro: string;
  rendaFamiliar: string;
  referenciaRenda: string;
  possuiPlanoSaude: string;
  aceitaVisitas: string;
  observacoes: string;
}

const CadastroFamilia = () => {
  const { domicilioId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FamiliaData>({
    prontuario: `F${new Date().getFullYear()}${String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0')}`,
    dataCadastro: new Date().toISOString().split('T')[0],
    rendaFamiliar: '',
    referenciaRenda: '',
    possuiPlanoSaude: '',
    aceitaVisitas: '',
    observacoes: ''
  });

  const updateFormData = (field: keyof FamiliaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        const obrigatorios = ['rendaFamiliar', 'possuiPlanoSaude', 'aceitaVisitas'];
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
      case 2:
        return true; // Etapa de confirmação
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
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
    console.log('Dados da família:', formData);
    const familiaId = Math.floor(Math.random() * 1000);
    toast({
      title: "Sucesso!",
      description: "Família cadastrada com sucesso.",
    });
    navigate(`/familia/${familiaId}/novo-membro`);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="prontuario">Número do Prontuário</Label>
          <Input
            id="prontuario"
            value={formData.prontuario}
            disabled
            className="h-12 bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">Gerado automaticamente pelo sistema</p>
        </div>

        <div>
          <Label htmlFor="dataCadastro">Data de Cadastro</Label>
          <Input
            id="dataCadastro"
            type="date"
            value={formData.dataCadastro}
            disabled
            className="h-12 bg-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="rendaFamiliar">Renda Familiar *</Label>
          <Select value={formData.rendaFamiliar} onValueChange={(value) => updateFormData('rendaFamiliar', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a faixa de renda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sem-renda">Sem Renda</SelectItem>
              <SelectItem value="ate-1-4-sm">Até 1/4 SM</SelectItem>
              <SelectItem value="ate-1-2-sm">Até 1/2 SM</SelectItem>
              <SelectItem value="ate-1-sm">Até 1 SM</SelectItem>
              <SelectItem value="ate-2-sm">Até 2 SM</SelectItem>
              <SelectItem value="ate-3-sm">Até 3 SM</SelectItem>
              <SelectItem value="ate-5-sm">Até 5 SM</SelectItem>
              <SelectItem value="acima-5-sm">Acima de 5 SM</SelectItem>
              <SelectItem value="nao-informado">Não Informado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="referenciaRenda">Referência da Renda</Label>
          <Select value={formData.referenciaRenda} onValueChange={(value) => updateFormData('referenciaRenda', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a referência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bolsa-familia">Bolsa Família</SelectItem>
              <SelectItem value="bpc">BPC</SelectItem>
              <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
              <SelectItem value="pensao">Pensão</SelectItem>
              <SelectItem value="auxilio-doenca">Auxílio Doença</SelectItem>
              <SelectItem value="seguro-desemprego">Seguro Desemprego</SelectItem>
              <SelectItem value="trabalho-formal">Trabalho Formal</SelectItem>
              <SelectItem value="trabalho-informal">Trabalho Informal</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="possuiPlanoSaude">Possui Plano de Saúde *</Label>
          <Select value={formData.possuiPlanoSaude} onValueChange={(value) => updateFormData('possuiPlanoSaude', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
              <SelectItem value="nao-informado">Não Informado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="aceitaVisitas">Aceita Visitas Domiciliares *</Label>
          <Select value={formData.aceitaVisitas} onValueChange={(value) => updateFormData('aceitaVisitas', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Input
            id="observacoes"
            value={formData.observacoes}
            onChange={(e) => updateFormData('observacoes', e.target.value)}
            placeholder="Observações adicionais (opcional)"
            className="h-12"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Resumo do Cadastro</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Prontuário:</strong> {formData.prontuario}</p>
          <p><strong>Data de Cadastro:</strong> {new Date(formData.dataCadastro).toLocaleDateString('pt-BR')}</p>
          <p><strong>Renda Familiar:</strong> {formData.rendaFamiliar}</p>
          {formData.referenciaRenda && (
            <p><strong>Referência da Renda:</strong> {formData.referenciaRenda}</p>
          )}
          <p><strong>Possui Plano de Saúde:</strong> {formData.possuiPlanoSaude}</p>
          <p><strong>Aceita Visitas:</strong> {formData.aceitaVisitas}</p>
          {formData.observacoes && (
            <p><strong>Observações:</strong> {formData.observacoes}</p>
          )}
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-2">Próxima Etapa</h4>
        <p className="text-sm text-yellow-800">
          Após confirmar o cadastro da família, você será direcionado para o cadastro do primeiro membro familiar.
        </p>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Dados da Família', component: renderStep1 },
    { number: 2, title: 'Confirmação', component: renderStep2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Dialog>
        <DialogTrigger asChild>
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer">IA</Badge>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ponto de Contato IA</DialogTitle>
            <DialogDescription>
              Validação automática de campos obrigatórios usando IA (ACS-221).<br/>
              Este recurso detecta campos não preenchidos e sugere correções, promovendo eficiência e clareza no cadastro.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/domicilio/${domicilioId}/familias`)}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Nova Família</h1>
              <p className="text-sm text-gray-600">Etapa {currentStep} de 2</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 mb-2">
            {steps.map((step) => (
              <div key={step.number} className="flex-1">
                <div className={`h-2 rounded-full ${
                  currentStep >= step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">{steps[currentStep - 1].title}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {steps[currentStep - 1].component()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 h-12"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
          >
            {currentStep === 2 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Finalizar e Cadastrar Membros
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CadastroFamilia;
