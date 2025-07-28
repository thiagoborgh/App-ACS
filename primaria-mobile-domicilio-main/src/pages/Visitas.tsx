
import { useState } from 'react';
import { fuzzySearch } from '@/lib/fuzzySearch';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, Users, User, Home, Calendar, MapPin, Clock } from 'lucide-react';

const Visitas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todas');

  // Mock data para visitas
  const visitas = [
    {
      id: 1,
      tipo: 'cidadao',
      data: '2024-01-25',
      hora: '14:30',
      endereco: 'Rua das Flores, 123',
      pessoa: 'Maria Silva Santos',
      motivo: 'Consulta Médica',
      status: 'realizada',
      agente: 'João ACS'
    },
    {
      id: 2,
      tipo: 'familia',
      data: '2024-01-25',
      hora: '10:15',
      endereco: 'Rua das Flores, 125', 
      familia: 'Família Oliveira',
      motivo: 'Acompanhamento Rotineiro',
      status: 'realizada',
      agente: 'Maria ACS'
    },
    {
      id: 3,
      tipo: 'imovel',
      data: '2024-01-24',
      hora: '16:00',
      endereco: 'Rua das Flores, 127',
      motivo: 'Controle Vetorial',
      status: 'pendente',
      agente: 'Carlos ACE'
    }
  ];

  const filteredVisitas = searchTerm
    ? fuzzySearch(visitas, ['endereco', 'pessoa', 'familia'], searchTerm, 3).filter(visita => filterTipo === 'todas' || visita.tipo === filterTipo)
    : visitas.filter(visita => filterTipo === 'todas' || visita.tipo === filterTipo);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'cidadao': return <User className="w-4 h-4" />;
      case 'familia': return <Users className="w-4 h-4" />;
      case 'imovel': return <Home className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'cidadao': return 'Cidadão';
      case 'familia': return 'Família';
      case 'imovel': return 'Imóvel';
      default: return tipo;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizada': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              onClick={() => navigate('/')}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Visitas Domiciliares</h1>
              <p className="text-sm text-gray-600">Acompanhamento no território</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Busca */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por endereço ou pessoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filterTipo === 'todas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTipo('todas')}
            className="whitespace-nowrap"
          >
            Todas
          </Button>
          <Button
            variant={filterTipo === 'cidadao' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTipo('cidadao')}
            className="whitespace-nowrap"
          >
            <User className="w-4 h-4 mr-1" />
            Cidadão
          </Button>
          <Button
            variant={filterTipo === 'familia' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTipo('familia')}
            className="whitespace-nowrap"
          >
            <Users className="w-4 h-4 mr-1" />
            Família
          </Button>
          <Button
            variant={filterTipo === 'imovel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterTipo('imovel')}
            className="whitespace-nowrap"
          >
            <Home className="w-4 h-4 mr-1" />
            Imóvel
          </Button>
        </div>

        {/* Botões Nova Visita */}
        <div className="space-y-3 mb-6">
          <Button 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium"
            onClick={() => navigate('/visita/cidadao/nova')}
          >
            <User className="w-5 h-5 mr-2" />
            Nova Visita ao Cidadão
          </Button>
          <Button 
            className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium"
            onClick={() => navigate('/visita/familia/nova')}
          >
            <Users className="w-5 h-5 mr-2" />
            Nova Visita à Família
          </Button>
          <Button 
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
            onClick={() => navigate('/visita/imovel/nova')}
          >
            <Home className="w-5 h-5 mr-2" />
            Nova Visita ao Imóvel
          </Button>
        </div>

        {/* Lista de Visitas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Visitas Recentes ({filteredVisitas.length})
          </h2>
          
          {filteredVisitas.map((visita) => (
            <Card key={visita.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getTipoIcon(visita.tipo)}
                      <span className="ml-2 text-sm font-medium text-blue-600">
                        {getTipoLabel(visita.tipo)}
                      </span>
                      <Badge className={`ml-2 text-xs ${getStatusColor(visita.status)}`}>
                        {visita.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-800 mb-1">
                      {visita.pessoa || visita.familia || 'Visita ao Imóvel'}
                    </h3>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {visita.endereco}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {visita.data} às {visita.hora}
                      </div>
                      <p className="text-xs text-gray-500">
                        Motivo: {visita.motivo} • Por: {visita.agente}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVisitas.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma visita encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visitas;
