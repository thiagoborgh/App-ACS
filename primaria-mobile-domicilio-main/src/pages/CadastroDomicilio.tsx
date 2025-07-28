
import { useState } from 'react';
import { validarCamposObrigatorios } from '@/lib/cadastroValidation';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Check, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface DomicilioData {
  tipoLogradouro: string;
  nomeLogradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  municipio: string;
  tipoImovel: string;
  situacaoMoradia: string;
  tipoDomicilio: string;
  condicaoPosse: string;
  numeroComodos: string;
  numeroDormitorios: string;
  materialPredominante: string;
  abastecimentoAgua: string;
  aguaConsumo: string;
  escoamentoSanitario: string;
  destinoLixo: string;
  energiaEletrica: string;
  animaisDomicilio: string[];
}

const CadastroDomicilio = () => {
  const { logradouroId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DomicilioData>({
    tipoLogradouro: '',
    nomeLogradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    municipio: 'Cidade Exemplo',
    tipoImovel: '',
    situacaoMoradia: '',
    tipoDomicilio: '',
    condicaoPosse: '',
    numeroComodos: '',
    numeroDormitorios: '',
    materialPredominante: '',
    abastecimentoAgua: '',
    aguaConsumo: '',
    escoamentoSanitario: '',
    destinoLixo: '',
    energiaEletrica: '',
    animaisDomicilio: []
  });

  const updateFormData = (field: keyof DomicilioData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        const obrigatorios = ['tipoLogradouro', 'nomeLogradouro', 'bairro', 'tipoImovel'];
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
        const obrigatorios = ['situacaoMoradia', 'tipoDomicilio', 'condicaoPosse', 'numeroComodos', 'numeroDormitorios', 'materialPredominante', 'abastecimentoAgua'];
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
        const obrigatorios = ['aguaConsumo', 'escoamentoSanitario', 'destinoLixo', 'energiaEletrica'];
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
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
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
    console.log('Dados do domicílio:', formData);
    toast({
      title: "Sucesso!",
      description: "Domicílio cadastrado com sucesso.",
    });
    navigate(`/logradouro/${logradouroId}`);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="tipoLogradouro">Tipo de Logradouro *</Label>
          <Select value={formData.tipoLogradouro} onValueChange={(value) => updateFormData('tipoLogradouro', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rua">Rua</SelectItem>
              <SelectItem value="avenida">Avenida</SelectItem>
              <SelectItem value="praca">Praça</SelectItem>
              <SelectItem value="estrada">Estrada</SelectItem>
              <SelectItem value="travessa">Travessa</SelectItem>
              <SelectItem value="alameda">Alameda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="nomeLogradouro">Nome do Logradouro *</Label>
          <Input
            id="nomeLogradouro"
            value={formData.nomeLogradouro}
            onChange={(e) => updateFormData('nomeLogradouro', e.target.value)}
            placeholder="Digite o nome do logradouro"
            className="h-12"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              value={formData.numero}
              onChange={(e) => updateFormData('numero', e.target.value)}
              placeholder="123"
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              value={formData.complemento}
              onChange={(e) => updateFormData('complemento', e.target.value)}
              placeholder="Apto 101"
              className="h-12"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bairro">Bairro *</Label>
          <Input
            id="bairro"
            value={formData.bairro}
            onChange={(e) => updateFormData('bairro', e.target.value)}
            placeholder="Nome do bairro"
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            value={formData.cep}
            onChange={(e) => updateFormData('cep', e.target.value)}
            placeholder="12345-678"
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="tipoImovel">Tipo de Imóvel *</Label>
          <Select value={formData.tipoImovel} onValueChange={(value) => updateFormData('tipoImovel', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="domicilio">Domicílio</SelectItem>
              <SelectItem value="comercio">Comércio</SelectItem>
              <SelectItem value="terreno-baldio">Terreno Baldio</SelectItem>
              <SelectItem value="escola">Escola</SelectItem>
              <SelectItem value="creche">Creche</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="situacaoMoradia">Situação de Moradia *</Label>
          <Select value={formData.situacaoMoradia} onValueChange={(value) => updateFormData('situacaoMoradia', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ocupado">Ocupado</SelectItem>
              <SelectItem value="vago">Vago</SelectItem>
              <SelectItem value="recusou">Recusou Informação</SelectItem>
              <SelectItem value="nao-existe">Não Existe Mais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tipoDomicilio">Tipo de Domicílio *</Label>
          <Select value={formData.tipoDomicilio} onValueChange={(value) => updateFormData('tipoDomicilio', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="comodo">Cômodo</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="condicaoPosse">Condição de Posse *</Label>
          <Select value={formData.condicaoPosse} onValueChange={(value) => updateFormData('condicaoPosse', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a condição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="proprio">Próprio</SelectItem>
              <SelectItem value="financiado">Financiado</SelectItem>
              <SelectItem value="alugado">Alugado</SelectItem>
              <SelectItem value="arrendado">Arrendado</SelectItem>
              <SelectItem value="cedido">Cedido</SelectItem>
              <SelectItem value="ocupacao">Ocupação</SelectItem>
              <SelectItem value="situacao-rua">Situação de Rua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numeroComodos">Número de Cômodos *</Label>
            <Input
              id="numeroComodos"
              type="number"
              min="1"
              value={formData.numeroComodos}
              onChange={(e) => updateFormData('numeroComodos', e.target.value)}
              placeholder="0"
              className="h-12"
            />
          </div>
          <div>
            <Label htmlFor="numeroDormitorios">Número de Dormitórios *</Label>
            <Input
              id="numeroDormitorios"
              type="number"
              min="0"
              value={formData.numeroDormitorios}
              onChange={(e) => updateFormData('numeroDormitorios', e.target.value)}
              placeholder="0"
              className="h-12"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="materialPredominante">Material Predominante *</Label>
          <Select value={formData.materialPredominante} onValueChange={(value) => updateFormData('materialPredominante', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alvenaria-revestimento">Alvenaria com Revestimento</SelectItem>
              <SelectItem value="alvenaria-sem-revestimento">Alvenaria sem Revestimento</SelectItem>
              <SelectItem value="taipa-revestida">Taipa Revestida</SelectItem>
              <SelectItem value="taipa-nao-revestida">Taipa não Revestida</SelectItem>
              <SelectItem value="madeira-aparelhada">Madeira Aparelhada</SelectItem>
              <SelectItem value="material-aproveitado">Material Aproveitado</SelectItem>
              <SelectItem value="palha">Palha</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="abastecimentoAgua">Abastecimento de Água *</Label>
          <Select value={formData.abastecimentoAgua} onValueChange={(value) => updateFormData('abastecimentoAgua', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rede-geral">Rede Geral</SelectItem>
              <SelectItem value="poco-nascente">Poço/Nascente</SelectItem>
              <SelectItem value="cisterna">Cisterna</SelectItem>
              <SelectItem value="carro-pipa">Carro Pipa</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="aguaConsumo">Água para Consumo *</Label>
          <Select value={formData.aguaConsumo} onValueChange={(value) => updateFormData('aguaConsumo', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o tratamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="filtracao">Filtração</SelectItem>
              <SelectItem value="fervura">Fervura</SelectItem>
              <SelectItem value="cloracao">Cloração</SelectItem>
              <SelectItem value="sem-tratamento">Sem Tratamento</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="escoamentoSanitario">Escoamento Sanitário *</Label>
          <Select value={formData.escoamentoSanitario} onValueChange={(value) => updateFormData('escoamentoSanitario', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rede-geral">Rede Geral</SelectItem>
              <SelectItem value="fossa-septica">Fossa Séptica</SelectItem>
              <SelectItem value="fossa-rudimentar">Fossa Rudimentar</SelectItem>
              <SelectItem value="direto-rio">Direto para Rio/Lago/Mar</SelectItem>
              <SelectItem value="ceu-aberto">Céu Aberto</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="destinoLixo">Destino do Lixo *</Label>
          <Select value={formData.destinoLixo} onValueChange={(value) => updateFormData('destinoLixo', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coletado">Coletado</SelectItem>
              <SelectItem value="queimado-enterrado">Queimado/Enterrado</SelectItem>
              <SelectItem value="ceu-aberto">Céu Aberto</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="energiaEletrica">Energia Elétrica *</Label>
          <Select value={formData.energiaEletrica} onValueChange={(value) => updateFormData('energiaEletrica', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Endereço', component: renderStep1 },
    { number: 2, title: 'Condições de Moradia (1/2)', component: renderStep2 },
    { number: 3, title: 'Condições de Moradia (2/2)', component: renderStep3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer">IA</Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Validação automática de campos obrigatórios usando IA (ACS-221).
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/logradouro/${logradouroId}`)}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Novo Domicílio</h1>
              <p className="text-sm text-gray-600">Etapa {currentStep} de 3</p>
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
              <Home className="w-5 h-5 mr-2 text-blue-600" />
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
            {currentStep === 3 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Finalizar
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

export default CadastroDomicilio;
