
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProps } from './types';

const SociodemograficasStep2 = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="frequentaEscola">Frequenta Escola</Label>
          <Select value={formData.frequentaEscola} onValueChange={(value) => updateFormData('frequentaEscola', value)}>
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
          <Label htmlFor="escolaridade">Escolaridade</Label>
          <Select value={formData.escolaridade} onValueChange={(value) => updateFormData('escolaridade', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a escolaridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sem-escolaridade">Sem Escolaridade</SelectItem>
              <SelectItem value="fundamental-incompleto">Fundamental Incompleto</SelectItem>
              <SelectItem value="fundamental-completo">Fundamental Completo</SelectItem>
              <SelectItem value="medio-incompleto">Médio Incompleto</SelectItem>
              <SelectItem value="medio-completo">Médio Completo</SelectItem>
              <SelectItem value="superior-incompleto">Superior Incompleto</SelectItem>
              <SelectItem value="superior-completo">Superior Completo</SelectItem>
              <SelectItem value="pos-graduacao">Pós-Graduação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="situacaoConjugal">Situação Conjugal</Label>
          <Select value={formData.situacaoConjugal} onValueChange={(value) => updateFormData('situacaoConjugal', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro</SelectItem>
              <SelectItem value="casado">Casado</SelectItem>
              <SelectItem value="uniao-estavel">União Estável</SelectItem>
              <SelectItem value="viuvo">Viúvo</SelectItem>
              <SelectItem value="divorciado">Divorciado</SelectItem>
              <SelectItem value="separado">Separado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="orientacaoSexual">Orientação Sexual</Label>
          <Select value={formData.orientacaoSexual} onValueChange={(value) => updateFormData('orientacaoSexual', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a orientação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heterossexual">Heterossexual</SelectItem>
              <SelectItem value="homossexual">Homossexual</SelectItem>
              <SelectItem value="bissexual">Bissexual</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="identidadeGenero">Identidade de Gênero</Label>
          <Select value={formData.identidadeGenero} onValueChange={(value) => updateFormData('identidadeGenero', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a identidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homem-trans">Homem Trans</SelectItem>
              <SelectItem value="mulher-trans">Mulher Trans</SelectItem>
              <SelectItem value="travesti">Travesti</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SociodemograficasStep2;
