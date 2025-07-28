
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AcompanhamentoSectionProps {
  register: any;
}

const AcompanhamentoSection = ({ register }: AcompanhamentoSectionProps) => {
  const opcoesAcompanhamento = [
    { id: 'gestante', label: 'Gestante' },
    { id: 'puerpera', label: 'Puérpera' },
    { id: 'recemNascido', label: 'Recém-Nascido' },
    { id: 'crianca', label: 'Criança' },
    { id: 'pessoaComDeficiencia', label: 'Pessoa com Deficiência' },
    { id: 'hipertensao', label: 'Hipertensão' },
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'asma', label: 'Asma' },
    { id: 'dpoc', label: 'DPOC' },
    { id: 'cancer', label: 'Câncer' },
    { id: 'tuberculose', label: 'Tuberculose' },
    { id: 'hanseniase', label: 'Hanseníase' },
    { id: 'saudeMental', label: 'Saúde Mental' },
    { id: 'dependenciaQuimica', label: 'Dependência Química' },
    { id: 'reabilitacao', label: 'Reabilitação' },
    { id: 'acamado', label: 'Acamado' },
    { id: 'domiciliado', label: 'Domiciliado' },
    { id: 'condicoesCronicas', label: 'Condições Crônicas' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Acompanhamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
          {opcoesAcompanhamento.map((opcao) => (
            <div key={opcao.id} className="flex items-center space-x-2">
              <Checkbox
                id={`acompanhamento-${opcao.id}`}
                {...register(`acompanhamento.${opcao.id}`)}
              />
              <Label htmlFor={`acompanhamento-${opcao.id}`} className="text-sm">
                {opcao.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AcompanhamentoSection;
