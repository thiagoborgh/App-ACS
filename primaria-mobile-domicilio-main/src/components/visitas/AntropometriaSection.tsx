
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AntropometriaSectionProps {
  register: any;
}

const AntropometriaSection = ({ register }: AntropometriaSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dados Antropométricos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input
              id="peso"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('antropometria.peso')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altura">Altura (cm)</Label>
            <Input
              id="altura"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('antropometria.altura')}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="imc">IMC</Label>
            <Input
              id="imc"
              type="number"
              step="0.1"
              placeholder="Calculado automaticamente"
              {...register('antropometria.imc')}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="circunferenciaAbdominal">Circ. Abdominal (cm)</Label>
            <Input
              id="circunferenciaAbdominal"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('antropometria.circunferenciaAbdominal')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pressaoArterial">Pressão Arterial (mmHg)</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Sist."
              {...register('antropometria.pressaoSistolica')}
            />
            <span className="text-gray-500">x</span>
            <Input
              type="number"
              placeholder="Diast."
              {...register('antropometria.pressaoDiastolica')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="glicemia">Glicemia (mg/dL)</Label>
          <Input
            id="glicemia"
            type="number"
            placeholder="0"
            {...register('antropometria.glicemia')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AntropometriaSection;
