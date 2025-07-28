import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Bug, Droplets, Zap, Wind, BookOpen } from 'lucide-react';

interface ControleAmbientalSectionProps {
  register: any;
}

const ControleAmbientalSection = ({ register }: ControleAmbientalSectionProps) => {
  const acoes = [
    {
      id: 'eliminacaoCreiadouros',
      nome: 'Eliminação de Criadouros',
      icon: Bug,
      descricao: 'Remoção de recipientes com água parada'
    },
    {
      id: 'tratamentoFocal',
      nome: 'Tratamento Focal',
      icon: Droplets,
      descricao: 'Aplicação de larvicida em criadouros'
    },
    {
      id: 'tratamentoPerifocal',
      nome: 'Tratamento Perifocal',
      icon: Zap,
      descricao: 'Tratamento ao redor de criadouros'
    },
    {
      id: 'nebulizacao',
      nome: 'Nebulização',
      icon: Wind,
      descricao: 'Aplicação de inseticida'
    },
    {
      id: 'educacaoSaude',
      nome: 'Educação em Saúde',
      icon: BookOpen,
      descricao: 'Orientações preventivas'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bug className="w-5 h-5 mr-2" />
          Controle Ambiental/Vetorial
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {acoes.map((acao) => (
          <div key={acao.id} className="flex items-start space-x-3 p-3 border rounded-lg">
            <Checkbox
              id={acao.id}
              {...register('controleAmbiental')}
              value={acao.id}
            />
            <div className="flex-1">
              <div className="flex items-center">
                <acao.icon className="w-4 h-4 mr-2 text-green-600" />
                <Label htmlFor={acao.id} className="font-medium">
                  {acao.nome}
                </Label>
              </div>
              <p className="text-sm text-gray-600 mt-1">{acao.descricao}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ControleAmbientalSection;