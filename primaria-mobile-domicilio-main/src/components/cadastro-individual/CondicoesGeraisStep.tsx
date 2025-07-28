
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { StepProps } from './types';

const CondicoesGeraisStep = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="problemaRenalCronico"
            checked={formData.problemaRenalCronico}
            onCheckedChange={(checked) => updateFormData('problemaRenalCronico', checked as boolean)}
          />
          <Label htmlFor="problemaRenalCronico">Problema Renal Crônico</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="problemaMental"
            checked={formData.problemaMental}
            onCheckedChange={(checked) => updateFormData('problemaMental', checked as boolean)}
          />
          <Label htmlFor="problemaMental">Problema Mental</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="alcoolismo"
            checked={formData.alcoolismo}
            onCheckedChange={(checked) => updateFormData('alcoolismo', checked as boolean)}
          />
          <Label htmlFor="alcoolismo">Alcoolismo</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="outrasDrogas"
            checked={formData.outrasDrogas}
            onCheckedChange={(checked) => updateFormData('outrasDrogas', checked as boolean)}
          />
          <Label htmlFor="outrasDrogas">Outras Drogas</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="tabagismo"
            checked={formData.tabagismo}
            onCheckedChange={(checked) => updateFormData('tabagismo', checked as boolean)}
          />
          <Label htmlFor="tabagismo">Tabagismo</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acamado"
            checked={formData.acamado}
            onCheckedChange={(checked) => updateFormData('acamado', checked as boolean)}
          />
          <Label htmlFor="acamado">Acamado</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="domiciliado"
            checked={formData.domiciliado}
            onCheckedChange={(checked) => updateFormData('domiciliado', checked as boolean)}
          />
          <Label htmlFor="domiciliado">Domiciliado</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="problemaMobilidade"
            checked={formData.problemaMobilidade}
            onCheckedChange={(checked) => updateFormData('problemaMobilidade', checked as boolean)}
          />
          <Label htmlFor="problemaMobilidade">Problema de Mobilidade</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="situacaoRua"
            checked={formData.situacaoRua}
            onCheckedChange={(checked) => updateFormData('situacaoRua', checked as boolean)}
          />
          <Label htmlFor="situacaoRua">Situação de Rua</Label>
        </div>
      </div>
    </div>
  );
};

export default CondicoesGeraisStep;
