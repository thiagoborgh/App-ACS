import { useState, useEffect } from 'react';
import { fuzzySearch } from '@/lib/fuzzySearch';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Search, Home, Edit, MapPin } from 'lucide-react';
import { mockApi, Logradouro, Domicilio } from '@/data/mockData';

const LogradouroDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [logradouro, setLogradouro] = useState<Logradouro | null>(null);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega dados do logradouro e domicílios
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [logradouroData, domiciliosData] = await Promise.all([
          mockApi.getLogradouro(id),
          mockApi.getDomicilios(id)
        ]);
        
        setLogradouro(logradouroData);
        setDomicilios(domiciliosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const filteredDomicilios = searchTerm
    ? fuzzySearch(domicilios, ['numero', 'complemento'], searchTerm, 3)
    : domicilios;

  const getSituacaoColor = (situacao: string) => {
    switch (situacao.toLowerCase()) {
      case 'ocupado':
        return 'bg-green-100 text-green-800';
      case 'desocupado':
        return 'bg-yellow-100 text-yellow-800';
      case 'recusou':
        return 'bg-red-100 text-red-800';
      case 'ausente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-lg font-bold text-gray-800">{logradouro?.nome || 'Carregando...'}</h1>
              <p className="text-sm text-gray-600">{logradouro?.bairro || ''}</p>
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
            placeholder="Buscar por número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Botão Novo Domicílio */}
        <Button 
          className="w-full mb-4 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium"
          onClick={() => navigate(`/logradouro/${id}/novo-domicilio`)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Domicílio
        </Button>

        {/* Lista de Domicílios */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Domicílios</h2>
          {filteredDomicilios.map((domicilio) => (
            <Card key={domicilio.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Home className="w-4 h-4 text-blue-600 mr-2" />
                      <h3 className="font-medium text-gray-800">
                        Nº {domicilio.numero}
                        {domicilio.complemento && (
                          <span className="text-gray-600 font-normal"> - {domicilio.complemento}</span>
                        )}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600 capitalize">{domicilio.tipo}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSituacaoColor(domicilio.situacao)}`}>
                        {domicilio.situacao}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {domicilio.quantidadeFamilias} família(s) cadastrada(s)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/domicilio/${domicilio.id}/familias`)}
                    className="flex-1"
                  >
                    Ver Famílias
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/domicilio/${domicilio.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDomicilios.length === 0 && (
          <div className="text-center py-8">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum domicílio encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogradouroDetalhes;
