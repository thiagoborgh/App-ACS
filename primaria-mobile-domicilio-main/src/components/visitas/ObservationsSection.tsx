import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ObservationsSectionProps {
  register: any;
  placeholder?: string;
}

const ObservationsSection = ({ register, placeholder = "Registre aqui observações importantes sobre a visita..." }: ObservationsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observações</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={placeholder}
          {...register('observacoes')}
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

export default ObservationsSection;