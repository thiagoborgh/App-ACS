import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Users, Home } from 'lucide-react';

interface Familia {
  id: number;
  nome: string;
  endereco: string;
  responsavel: string;
  membros: number;
  domicilio: string;
}

interface FamilySelectionSectionProps {
  familiaEImovelSelecionado: Familia | null;
  setFamiliaEImovelSelecionado: (familia: Familia | null) => void;
  familias: Familia[];
}

const FamilySelectionSection = ({ 
  familiaEImovelSelecionado, 
  setFamiliaEImovelSelecionado, 
  familias 
}: FamilySelectionSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Família e Imóvel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!familiaEImovelSelecionado ? (
          <div className="space-y-3">
            <Label>Buscar Família</Label>
            <div className="space-y-2">
              {familias.map((familia) => (
                <div
                  key={familia.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setFamiliaEImovelSelecionado(familia)}
                >
                  <p className="font-medium">{familia.nome}</p>
                  <p className="text-sm text-gray-600">Responsável: {familia.responsavel}</p>
                  <p className="text-sm text-gray-500">{familia.endereco}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Users className="w-3 h-3 mr-1" />
                    {familia.membros} membros
                    <Home className="w-3 h-3 ml-3 mr-1" />
                    {familia.domicilio}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-medium text-green-900">{familiaEImovelSelecionado.nome}</p>
            <p className="text-sm text-green-700">Responsável: {familiaEImovelSelecionado.responsavel}</p>
            <p className="text-sm text-green-600">{familiaEImovelSelecionado.endereco}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setFamiliaEImovelSelecionado(null)}
            >
              Alterar Família
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilySelectionSection;