import { useState, useEffect } from 'react';
import { fuzzySearch } from '@/lib/fuzzySearch';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Plus, MapPin, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockApi, Logradouro } from '@/data/mockData';

const Logradouros = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logradouros, setLogradouros] = useState<Logradouro[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carrega logradouros dos dados mocados
  useEffect(() => {
    const loadLogradouros = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getLogradouros();
        setLogradouros(data);
      } catch (error) {
        console.error('Erro ao carregar logradouros:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogradouros();
  }, []);

  const filteredLogradouros = searchTerm
    ? fuzzySearch(logradouros, ['nome', 'bairro'], searchTerm, 3)
    : logradouros;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="mr-2 p-2 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Famílias e Domicílios</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Search */}
        <div className="flex items-center mb-6 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar logradouro ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12 h-12 text-base border-gray-300 focus:border-primary focus:ring-primary"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              <Filter className="w-5 h-5" />
            </Button>
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
                  Este recurso facilita encontrar logradouros mesmo com erros de digitação, tornando o processo mais ágil e confiável para o ACS.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* New Logradouro Button */}
        <Button 
          className="w-full mb-6 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          onClick={() => console.log('Novo logradouro')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Logradouro
        </Button>

        {/* Logradouros List */}
        <div className="space-y-3">
          <h3 className="text-base font-medium text-gray-700 mb-3">Logradouros Cadastrados</h3>
          {filteredLogradouros.map((logradouro) => (
            <Card key={logradouro.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-primary mr-2" />
                      <h4 className="font-medium text-gray-800">{logradouro.nome}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{logradouro.bairro}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {logradouro.quantidadeDomicilios} domicílios
                      </span>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/logradouro/${logradouro.id}`)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2"
                      >
                        Acessar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLogradouros.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum logradouro encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logradouros;