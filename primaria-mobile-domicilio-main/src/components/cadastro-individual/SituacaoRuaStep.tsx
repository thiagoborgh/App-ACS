
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { StepProps } from './types';

const SituacaoRuaStep = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
        <h4 className="font-medium text-yellow-900 mb-2">Situação de Rua</h4>
        <p className="text-sm text-yellow-800">
          Preencha as informações específicas para pessoas em situação de rua.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="tempoSituacaoRua">Tempo em Situação de Rua *</Label>
          <Select value={formData.tempoSituacaoRua} onValueChange={(value) => updateFormData('tempoSituacaoRua', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menos-6-meses">Menos de 6 meses</SelectItem>
              <SelectItem value="6-meses-1-ano">6 meses a 1 ano</SelectItem>
              <SelectItem value="1-2-anos">1 a 2 anos</SelectItem>
              <SelectItem value="2-5-anos">2 a 5 anos</SelectItem>
              <SelectItem value="mais-5-anos">Mais de 5 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="recebeBeneficio"
            checked={formData.recebeBeneficio}
            onCheckedChange={(checked) => updateFormData('recebeBeneficio', checked as boolean)}
          />
          <Label htmlFor="recebeBeneficio">Recebe Benefício</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="referenciaFamiliar"
            checked={formData.referenciaFamiliar}
            onCheckedChange={(checked) => updateFormData('referenciaFamiliar', checked as boolean)}
          />
          <Label htmlFor="referenciaFamiliar">Tem Referência Familiar</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acompanhamentoCras"
            checked={formData.acompanhamentoCras}
            onCheckedChange={(checked) => updateFormData('acompanhamentoCras', checked as boolean)}
          />
          <Label htmlFor="acompanhamentoCras">Acompanhamento CRAS</Label>
        </div>

        <div>
          <Label htmlFor="visitaParentes">Frequência de Visita a Parentes</Label>
          <Select value={formData.visitaParentes} onValueChange={(value) => updateFormData('visitaParentes', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diariamente">Diariamente</SelectItem>
              <SelectItem value="semanalmente">Semanalmente</SelectItem>
              <SelectItem value="quinzenalmente">Quinzenalmente</SelectItem>
              <SelectItem value="mensalmente">Mensalmente</SelectItem>
              <SelectItem value="eventualmente">Eventualmente</SelectItem>
              <SelectItem value="nao-visita">Não Visita</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SituacaoRuaStep;
