import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface Cidadao {
  id: number;
  nome: string;
  cpf: string;
  endereco: string;
}

interface CitizenSelectionSectionProps {
  cidadaoSelecionado: Cidadao | null;
  setCidadaoSelecionado: (cidadao: Cidadao | null) => void;
  cidadaos: Cidadao[];
}

const CitizenSelectionSection = ({ 
  cidadaoSelecionado, 
  setCidadaoSelecionado, 
  cidadaos 
}: CitizenSelectionSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Cidadão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!cidadaoSelecionado ? (
          <div className="space-y-3">
            <Label>Buscar Cidadão</Label>
            <div className="space-y-2">
              {cidadaos.map((cidadao) => (
                <div
                  key={cidadao.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setCidadaoSelecionado(cidadao)}
                >
                  <p className="font-medium">{cidadao.nome}</p>
                  <p className="text-sm text-gray-600">{cidadao.cpf}</p>
                  <p className="text-sm text-gray-500">{cidadao.endereco}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900">{cidadaoSelecionado.nome}</p>
            <p className="text-sm text-blue-700">{cidadaoSelecionado.endereco}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setCidadaoSelecionado(null)}
            >
              Alterar Cidadão
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CitizenSelectionSection;