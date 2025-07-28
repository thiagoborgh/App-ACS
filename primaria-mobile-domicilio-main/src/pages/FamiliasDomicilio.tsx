
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fuzzySearch } from '@/lib/fuzzySearch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Plus, Search, Users, Clock, Heart, AlertTriangle, Edit } from 'lucide-react';

const FamiliasDomicilio = () => {
  const { domicilioId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para famílias
  const familias = [
    {
      id: 1,
      prontuario: 'F2024001',
      responsavel: 'Maria Silva Santos',
      membros: 4,
      dataCadastro: '2024-01-15',
      ultimaVisita: '2024-01-20',
      diasSemVisita: 5,
      rendaFamiliar: 'Até 2 SM',
      possuiPlanoSaude: false,
      aceitaVisitas: true,
      marcadores: ['hipertensao', 'diabetes', 'crianca'],
      situacoesEspeciais: ['vulnerabilidade-social']
    },
    {
      id: 2,
      prontuario: 'F2024002',
      responsavel: 'João Pedro Oliveira',
      membros: 2,
      dataCadastro: '2024-01-10',
      ultimaVisita: '2024-01-18',
      diasSemVisita: 7,
      rendaFamiliar: 'Até 1 SM',
      possuiPlanoSaude: false,
      aceitaVisitas: true,
      marcadores: ['idoso', 'deficiencia'],
      situacoesEspeciais: []
    }
  ];

  const domicilio = {
    endereco: 'Rua das Flores, 123',
    bairro: 'Centro'
  };

  // Removido: definição duplicada de filteredFamilias
  const filteredFamilias = searchTerm
    ? fuzzySearch(familias, ['responsavel', 'prontuario'], searchTerm, 3)
    : familias;

  const getMarcadorColor = (marcador: string) => {
    const cores = {
      'hipertensao': 'bg-red-100 text-red-800',
      'diabetes': 'bg-orange-100 text-orange-800',
      'crianca': 'bg-blue-100 text-blue-800',
      'idoso': 'bg-purple-100 text-purple-800',
      'deficiencia': 'bg-green-100 text-green-800',
      'vulnerabilidade-social': 'bg-yellow-100 text-yellow-800'
    };
    return cores[marcador as keyof typeof cores] || 'bg-gray-100 text-gray-800';
  };

  const getMarcadorLabel = (marcador: string) => {
    const labels = {
      'hipertensao': 'Hipertensão',
      'diabetes': 'Diabetes',
      'crianca': 'Criança',
      'idoso': 'Idoso',
      'deficiencia': 'Deficiência',
      'vulnerabilidade-social': 'Vulnerabilidade Social'
    };
    return labels[marcador as keyof typeof labels] || marcador;
  };

  const getAlertaVisita = (dias: number) => {
    if (dias > 30) return 'text-red-600';
    if (dias > 15) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/domicilio/${domicilioId}`)}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Famílias</h1>
              <p className="text-sm text-gray-600">{domicilio.endereco} - {domicilio.bairro}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Busca */}
        <div className="flex items-center mb-6 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar família por responsável ou prontuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer">IA</Badge>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ponto de Contato IA</DialogTitle>
                <DialogDescription>
                  Busca inteligente: sugestões automáticas tolerantes a erros de digitação usando IA (ACS-220).<br/>
                  Este recurso facilita encontrar famílias mesmo com erros de digitação, tornando o processo mais ágil e confiável para o ACS.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Botão Nova Família */}
        <Button 
          className="w-full mb-6 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium"
          onClick={() => navigate(`/domicilio/${domicilioId}/nova-familia`)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Família
        </Button>

        {/* Lista de Famílias */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Famílias Cadastradas ({filteredFamilias.length})
          </h2>
          
          {filteredFamilias.map((familia) => (
            <Card key={familia.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Users className="w-4 h-4 text-blue-600 mr-2" />
                      <h3 className="font-medium text-gray-800">{familia.responsavel}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Prontuário: {familia.prontuario} • {familia.membros} membros
                    </p>
                    
                    {/* Informações de Visita */}
                    <div className="flex items-center mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className={`text-sm ${getAlertaVisita(familia.diasSemVisita)}`}>
                        {familia.diasSemVisita} dias sem visita
                      </span>
                    </div>

                    {/* Marcadores de Saúde */}
                    {familia.marcadores.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {familia.marcadores.map((marcador) => (
                          <Badge
                            key={marcador}
                            className={`text-xs ${getMarcadorColor(marcador)}`}
                          >
                            {getMarcadorLabel(marcador)}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Situações Especiais */}
                    {familia.situacoesEspeciais.length > 0 && (
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
                        <span className="text-sm text-yellow-700">Requer atenção especial</span>
                      </div>
                    )}

                    {/* Informações Socioeconômicas */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Renda: {familia.rendaFamiliar}</p>
                      <p>Plano de saúde: {familia.possuiPlanoSaude ? 'Sim' : 'Não'}</p>
                      <p>Aceita visitas: {familia.aceitaVisitas ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/familia/${familia.id}/editar`)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/familia/${familia.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFamilias.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma família encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamiliasDomicilio;
