import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface VisitaConfirmationSectionProps {
  visitaRealizada: boolean;
  setVisitaRealizada: (value: boolean) => void;
}

const VisitaConfirmationSection = ({ visitaRealizada, setVisitaRealizada }: VisitaConfirmationSectionProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="visitaRealizada"
            checked={visitaRealizada}
            onCheckedChange={(checked) => setVisitaRealizada(checked === true)}
          />
          <Label htmlFor="visitaRealizada" className="font-medium">
            A visita foi realizada?
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitaConfirmationSection;