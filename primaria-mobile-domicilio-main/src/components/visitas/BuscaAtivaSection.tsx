
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface BuscaAtivaSectionProps {
  register: any;
}

const BuscaAtivaSection = ({ register }: BuscaAtivaSectionProps) => {
  const opcoesBuscaAtiva = [
    { id: 'consultaMedica', label: 'Consulta Médica' },
    { id: 'consultaOdontologica', label: 'Consulta Odontológica' },
    { id: 'vacinacao', label: 'Vacinação' },
    { id: 'examePreventivo', label: 'Exame Preventivo' },
    { id: 'exameMama', label: 'Exame de Mama' },
    { id: 'planejamentoFamiliar', label: 'Planejamento Familiar' },
    { id: 'preNatal', label: 'Pré-Natal' },
    { id: 'puericultura', label: 'Puericultura' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Busca Ativa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {opcoesBuscaAtiva.map((opcao) => (
          <div key={opcao.id} className="flex items-center space-x-2">
            <Checkbox
              id={`buscaAtiva-${opcao.id}`}
              {...register(`buscaAtiva.${opcao.id}`)}
            />
            <Label htmlFor={`buscaAtiva-${opcao.id}`} className="text-sm">
              {opcao.label}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BuscaAtivaSection;
