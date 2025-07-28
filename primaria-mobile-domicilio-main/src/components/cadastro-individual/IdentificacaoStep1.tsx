
import { Button } from '@/components/ui/button';
import InputMask from 'react-input-mask';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';
import { StepProps } from './types';

interface IdentificacaoStep1Props extends StepProps {
  currentStep: number;
}

const IdentificacaoStep1 = ({ formData, updateFormData, onRecusaCadastro, currentStep }: IdentificacaoStep1Props) => {
  // Simulação de validação
  const cpfInvalido = formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11;
  const nomeCompletoInvalido = !formData.nomeCompleto;
  const dataNascimentoInvalida = formData.dataNascimento && formData.dataNascimento.length !== 10;
  return (
    <div className="space-y-8">
      {/* Seção de documentos */}
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Documentação</h3>
          <p className="text-sm text-muted-foreground">Informe pelo menos um documento de identificação</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium text-foreground">CPF *</Label>
            <InputMask
              mask="999.999.999-99"
              value={formData.cpf}
              onChange={(e) => updateFormData('cpf', e.target.value)}
            >
              {(inputProps) => (
                <Input
                  {...inputProps}
                  id="cpf"
                  placeholder="000.000.000-00"
                  className={`h-11 border-border bg-background ${cpfInvalido ? 'border-red-500' : ''}`}
                />
              )}
            </InputMask>
            <p className="text-xs text-muted-foreground">Obrigatório se CNS não informado</p>
            {cpfInvalido && <span className="text-xs text-red-600">CPF inválido</span>}
            <Input
              id="cns"
              value={formData.cns}
              onChange={(e) => updateFormData('cns', e.target.value)}
              placeholder="000 0000 0000 0000"
              className="h-11 border-border bg-background"
            />
            <p className="text-xs text-muted-foreground">Obrigatório se CPF não informado</p>
          </div>
        </div>
      </div>

      {/* Seção de informações pessoais */}
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-foreground mb-2">Informações Pessoais</h3>
          <p className="text-sm text-muted-foreground">Dados básicos do cidadão</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nomeCompleto" className="text-sm font-medium text-foreground">Nome Completo *</Label>
          <Input
            id="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
            placeholder="Nome completo do cidadão"
            className={`h-11 border-border bg-background ${nomeCompletoInvalido ? 'border-red-500' : ''}`}
          />
          {nomeCompletoInvalido && <span className="text-xs text-red-600">Campo obrigatório</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nomeSocial" className="text-sm font-medium text-foreground">Nome Social</Label>
          <Input
            id="nomeSocial"
            value={formData.nomeSocial}
            onChange={(e) => updateFormData('nomeSocial', e.target.value)}
            placeholder="Nome social (opcional)"
            className="h-11 border-border bg-background"
          />
          <p className="text-xs text-muted-foreground">Nome pelo qual prefere ser chamado</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataNascimento" className="text-sm font-medium text-foreground">Data de Nascimento *</Label>
          <InputMask
            mask="99/99/9999"
            value={formData.dataNascimento}
            onChange={(e) => updateFormData('dataNascimento', e.target.value)}
          >
            {(inputProps) => (
              <Input
                {...inputProps}
                id="dataNascimento"
                placeholder="DD/MM/AAAA"
                className={`h-11 border-border bg-background ${dataNascimentoInvalida ? 'border-red-500' : ''}`}
              />
            )}
          </InputMask>
          {dataNascimentoInvalida && <span className="text-xs text-red-600">Data inválida</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sexo" className="text-sm font-medium text-foreground">Sexo *</Label>
          <Select value={formData.sexo} onValueChange={(value) => updateFormData('sexo', value)}>
            <SelectTrigger className="h-11 border-border bg-background">
              <SelectValue placeholder="Selecione o sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="responsavelFamiliar"
            checked={formData.responsavelFamiliar}
            onCheckedChange={(checked) => updateFormData('responsavelFamiliar', checked as boolean)}
          />
          <div>
            <Label htmlFor="responsavelFamiliar" className="text-sm font-medium text-foreground">Responsável Familiar</Label>
            <p className="text-xs text-muted-foreground">Marque se esta pessoa é responsável pela família</p>
          </div>
        </div>
      </div>

      {/* Botão de recusa */}
      {(currentStep === 1 || currentStep === 2) && onRecusaCadastro && (
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onRecusaCadastro}
            className="w-full h-11 text-destructive border-destructive/30 hover:bg-destructive/5 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Registrar Recusa do Cadastro
          </Button>
        </div>
      )}
    </div>
  );
};

export default IdentificacaoStep1;
