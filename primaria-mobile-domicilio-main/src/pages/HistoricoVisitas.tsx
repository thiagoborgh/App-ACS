import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Filter, User, Users, Home, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HistoricoVisitas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [buscaTexto, setBuscaTexto] = useState('');

  // Mock data para histórico de visitas
  const visitas = [
    {
      id: 1,
      tipo: 'cidadao',
      nome: 'Maria Silva Santos',
      endereco: 'Rua das Flores, 123',
      data: '2024-01-15',
      motivo: ['Acompanhamento', 'Hipertensão'],
      realizada: true,
      agente: 'Ana Santos',
      observacoes: 'Paciente seguindo tratamento corretamente'
    },
    {
      id: 2,
      tipo: 'familia',
      nome: 'Família Oliveira',
      endereco: 'Rua das Flores, 125',
      data: '2024-01-14',
      motivo: ['Visita Periódica'],
      realizada: true,
      agente: 'João Silva',
      observacoes: 'Família em boas condições'
    },
    {
      id: 3,
      tipo: 'imovel',
      nome: 'Imóvel Comercial',
      endereco: 'Rua das Flores, 127',
      data: '2024-01-13',
      motivo: ['Controle Vetorial'],
      realizada: true,
      agente: 'Carlos Lima',
      observacoes: 'Aplicado tratamento focal'
    },
    {
      id: 4,
      tipo: 'cidadao',
      nome: 'João Pedro Costa',
      endereco: 'Rua das Flores, 129',
      data: '2024-01-12',
      motivo: ['Busca Ativa', 'Vacinação'],
      realizada: false,
      agente: 'Maria Santos',
      observacoes: 'Morador não estava presente'
    },
    {
      id: 5,
      tipo: 'familia',
      nome: 'Família Santos',
      endereco: 'Rua das Flores, 131',
      data: '2024-01-11',
      motivo: ['Cadastramento'],
      realizada: true,
      agente: 'Ana Santos',
      observacoes: 'Cadastro familiar atualizado'
    }
  ];

  const tiposVisita = [
    { value: 'cidadao', label: 'Cidadão', icon: User, color: 'bg-blue-100 text-blue-800' },
    { value: 'familia', label: 'Família', icon: Users, color: 'bg-green-100 text-green-800' },
    { value: 'imovel', label: 'Imóvel', icon: Home, color: 'bg-purple-100 text-purple-800' }
  ];

  const visitasFiltradas = useMemo(() => {
    let resultado = visitas;

    // Filtro por tipo
    if (filtroTipo) {
      resultado = resultado.filter(visita => visita.tipo === filtroTipo);
    }

    // Filtro por data
    if (filtroData) {
      resultado = resultado.filter(visita => visita.data >= filtroData);
    }

    // Busca por texto
    if (buscaTexto) {
      const termo = buscaTexto.toLowerCase();
      resultado = resultado.filter(visita =>
        visita.nome.toLowerCase().includes(termo) ||
        visita.endereco.toLowerCase().includes(termo) ||
        visita.motivo.some(m => m.toLowerCase().includes(termo))
      );
    }

    return resultado.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [filtroTipo, filtroData, buscaTexto]);

  const getTipoVisita = (tipo: string) => {
    return tiposVisita.find(t => t.value === tipo) || tiposVisita[0];
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const editarVisita = (id: number) => {
    toast({
      title: "Função em desenvolvimento",
      description: "A edição de visitas será implementada em breve.",
    });
  };

  const excluirVisita = (id: number) => {
    toast({
      title: "Visita excluída",
      description: "A visita foi removida do histórico.",
    });
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
              onClick={() => navigate('/visitas')}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Histórico de Visitas</h1>
              <p className="text-sm text-gray-600">Consulte e gerencie visitas realizadas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Busca por texto */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome, endereço ou motivo..."
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por tipo */}
            <div className="space-y-2">
              <Label>Tipo de Visita</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="cidadao">Cidadão</SelectItem>
                  <SelectItem value="familia">Família</SelectItem>
                  <SelectItem value="imovel">Imóvel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por data */}
            <div className="space-y-2">
              <Label>A partir da data</Label>
              <Input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
              />
            </div>

            {/* Botão limpar filtros */}
            {(filtroTipo || filtroData || buscaTexto) && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setFiltroTipo('');
                  setFiltroData('');
                  setBuscaTexto('');
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Resumo */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {visitasFiltradas.length} visita(s) encontrada(s)
          </p>
        </div>

        {/* Lista de Visitas */}
        <div className="space-y-4">
          {visitasFiltradas.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma visita encontrada</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tente ajustar os filtros ou realizar novas visitas
                </p>
              </CardContent>
            </Card>
          ) : (
            visitasFiltradas.map((visita) => {
              const tipoVisita = getTipoVisita(visita.tipo);
              const IconeTipo = tipoVisita.icon;

              return (
                <Card key={visita.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    {/* Header da visita */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${tipoVisita.color} rounded-full flex items-center justify-center`}>
                          <IconeTipo className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{visita.nome}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {visita.endereco}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editarVisita(visita.id)}
                          className="p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => excluirVisita(visita.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Detalhes da visita */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatarData(visita.data)} • {visita.agente}
                      </div>

                      {/* Status da visita */}
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={visita.realizada ? "default" : "secondary"}
                          className={visita.realizada ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {visita.realizada ? "Realizada" : "Não realizada"}
                        </Badge>
                        <Badge variant="outline" className={tipoVisita.color}>
                          {tipoVisita.label}
                        </Badge>
                      </div>

                      {/* Motivos */}
                      <div className="flex flex-wrap gap-1">
                        {visita.motivo.map((motivo, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {motivo}
                          </Badge>
                        ))}
                      </div>

                      {/* Observações */}
                      {visita.observacoes && (
                        <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded-md">
                          {visita.observacoes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricoVisitas;