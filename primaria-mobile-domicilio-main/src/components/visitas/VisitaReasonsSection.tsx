import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface VisitaReasonsSectionProps {
  register: any;
  motivosVisita: string[];
}

const VisitaReasonsSection = ({ register, motivosVisita }: VisitaReasonsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Motivo da Visita</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {motivosVisita.map((motivo) => (
          <div key={motivo} className="flex items-center space-x-2">
            <Checkbox
              id={`motivo-${motivo}`}
              {...register('motivos')}
              value={motivo}
            />
            <Label htmlFor={`motivo-${motivo}`}>{motivo}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VisitaReasonsSection;