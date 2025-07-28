import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProfessionalAccompanimentSectionProps {
  register: any;
  visitaAcompanhada: boolean;
  setVisitaAcompanhada: (value: boolean) => void;
  profissionaisEquipe: string[];
}

const ProfessionalAccompanimentSection = ({ 
  register, 
  visitaAcompanhada, 
  setVisitaAcompanhada, 
  profissionaisEquipe 
}: ProfessionalAccompanimentSectionProps) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="visitaAcompanhada"
            checked={visitaAcompanhada}
            onCheckedChange={(checked) => setVisitaAcompanhada(checked === true)}
          />
          <Label htmlFor="visitaAcompanhada">Visita acompanhada por profissional</Label>
        </div>
        
        {visitaAcompanhada && (
          <div className="space-y-3">
            <Label>Profissional Acompanhante</Label>
            <select 
              className="w-full p-2 border rounded-md"
              {...register('profissionalAcompanhante')}
            >
              <option value="">Selecione...</option>
              {profissionaisEquipe.map((profissional) => (
                <option key={profissional} value={profissional}>
                  {profissional}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalAccompanimentSection;