
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { StepProps } from './types';

const CondicoesSaudeStep = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {formData.sexo === 'feminino' && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gestante"
                checked={formData.gestante}
                onCheckedChange={(checked) => updateFormData('gestante', checked as boolean)}
              />
              <Label htmlFor="gestante">Gestante</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="puerpera"
                checked={formData.puerpera}
                onCheckedChange={(checked) => updateFormData('puerpera', checked as boolean)}
              />
              <Label htmlFor="puerpera">Puérpera (até 45 dias pós-parto)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="amamentando"
                checked={formData.amamentando}
                onCheckedChange={(checked) => updateFormData('amamentando', checked as boolean)}
              />
              <Label htmlFor="amamentando">Amamentando</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="planejamentoFamiliar"
                checked={formData.planejamentoFamiliar}
                onCheckedChange={(checked) => updateFormData('planejamentoFamiliar', checked as boolean)}
              />
              <Label htmlFor="planejamentoFamiliar">Planejamento Familiar</Label>
            </div>
          </>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hipertensao"
            checked={formData.hipertensao}
            onCheckedChange={(checked) => updateFormData('hipertensao', checked as boolean)}
          />
          <Label htmlFor="hipertensao">Hipertensão</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="diabetes"
            checked={formData.diabetes}
            onCheckedChange={(checked) => updateFormData('diabetes', checked as boolean)}
          />
          <Label htmlFor="diabetes">Diabetes</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="avcDerrame"
            checked={formData.avcDerrame}
            onCheckedChange={(checked) => updateFormData('avcDerrame', checked as boolean)}
          />
          <Label htmlFor="avcDerrame">AVC/Derrame</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="infarto"
            checked={formData.infarto}
            onCheckedChange={(checked) => updateFormData('infarto', checked as boolean)}
          />
          <Label htmlFor="infarto">Infarto</Label>
        </div>
      </div>
    </div>
  );
};

export default CondicoesSaudeStep;
