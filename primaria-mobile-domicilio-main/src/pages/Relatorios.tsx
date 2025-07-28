import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Activity, 
  Users, 
  TrendingUp,
  Search,
  Eye,
  Filter,
  ChevronRight,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CondicaoSaude {
  id: string;
  nome: string;
  categoria: 'cronica' | 'mental' | 'deficiencia' | 'infecciosa' | 'outros';
  total: number;
  gravidade: 'baixa' | 'media' | 'alta';
  tendencia: 'crescente' | 'estavel' | 'decrescente';
}

interface Individuo {
  id: string;
  nome: string;
  idade: number;
  sexo: 'M' | 'F';
  cpf: string;
  telefone: string;
  endereco: string;
  condicoesIds: string[];
  ultimaConsulta?: Date;
  responsavel?: string;
  observacoes?: string;
}

const Relatorios = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'dashboard' | 'condicoes' | 'individuos'>('dashboard');
  const [condicaoSelecionada, setCondicaoSelecionada] = useState<CondicaoSaude | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');

  const condicoesSaude: CondicaoSaude[] = [
    {
      id: '1',
      nome: 'Hipertensão Arterial',
      categoria: 'cronica',
      total: 245,
      gravidade: 'media',
      tendencia: 'crescente'
    },
    {
      id: '2',
      nome: 'Diabetes Mellitus',
      categoria: 'cronica',
      total: 189,
      gravidade: 'alta',
      tendencia: 'estavel'
    },
    {
      id: '3',
      nome: 'Depressão',
      categoria: 'mental',
      total: 142,
      gravidade: 'media',
      tendencia: 'crescente'
    },
    {
      id: '4',
      nome: 'Deficiência Visual',
      categoria: 'deficiencia',
      total: 98,
      gravidade: 'media',
      tendencia: 'estavel'
    },
    {
      id: '5',
      nome: 'Asma',
      categoria: 'cronica',
      total: 87,
      gravidade: 'baixa',
      tendencia: 'decrescente'
    },
    {
      id: '6',
      nome: 'Deficiência Física',
      categoria: 'deficiencia',
      total: 76,
      gravidade: 'media',
      tendencia: 'estavel'
    },
    {
      id: '7',
      nome: 'Ansiedade',
      categoria: 'mental',
      total: 134,
      gravidade: 'media',
      tendencia: 'crescente'
    },
    {
      id: '8',
      nome: 'Doença Cardíaca',
      categoria: 'cronica',
      total: 65,
      gravidade: 'alta',
      tendencia: 'estavel'
    }
  ];

  const individuosExemplo: Individuo[] = [
    {
      id: '1',
      nome: 'Maria Silva Santos',
      idade: 58,
      sexo: 'F',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123 - Centro',
      condicoesIds: ['1', '2'],
      ultimaConsulta: new Date('2024-06-15'),
      responsavel: 'Dr. João Pereira',
      observacoes: 'Paciente com adesão irregular ao tratamento'
    },
    {
      id: '2',
      nome: 'José Carlos Oliveira',
      idade: 45,
      sexo: 'M',
      cpf: '987.654.321-00',
      telefone: '(11) 91234-5678',
      endereco: 'Av. Principal, 456 - Jardim Primavera',
      condicoesIds: ['1'],
      ultimaConsulta: new Date('2024-06-20'),
      responsavel: 'Dra. Ana Costa'
    },
    {
      id: '3',
      nome: 'Ana Paula Rodrigues',
      idade: 32,
      sexo: 'F',
      cpf: '456.789.123-00',
      telefone: '(11) 95555-1234',
      endereco: 'Travessa São João, 789 - Vila Nova',
      condicoesIds: ['3', '7'],
      ultimaConsulta: new Date('2024-06-18'),
      responsavel: 'Dr. Carlos Mendes',
      observacoes: 'Acompanhamento psicológico semanal'
    }
  ];

  const estatisticas = {
    totalCondicoes: condicoesSaude.length,
    individuosAfetados: 892,
    condicoesGraves: condicoesSaude.filter(c => c.gravidade === 'alta').length,
    tendenciaCrescente: condicoesSaude.filter(c => c.tendencia === 'crescente').length
  };

  const categorias = {
    cronica: { label: 'Doenças Crônicas', color: 'bg-red-100 text-red-700', icon: Heart },
    mental: { label: 'Saúde Mental', color: 'bg-purple-100 text-purple-700', icon: Activity },
    deficiencia: { label: 'Deficiências', color: 'bg-blue-100 text-blue-700', icon: Users },
    infecciosa: { label: 'Doenças Infecciosas', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
    outros: { label: 'Outras', color: 'bg-gray-100 text-gray-700', icon: Activity }
  };

  const gravidadeColors = {
    baixa: 'bg-green-100 text-green-700',
    media: 'bg-yellow-100 text-yellow-700',
    alta: 'bg-red-100 text-red-700'
  };

  const tendenciaIcons = {
    crescente: <TrendingUp className="w-4 h-4 text-red-500" />,
    estavel: <div className="w-4 h-1 bg-gray-400 rounded" />,
    decrescente: <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
  };

  const condicoesFiltradas = condicoesSaude.filter(condicao => {
    const matchesSearch = condicao.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filtroCategoria === 'todas' || condicao.categoria === filtroCategoria;
    return matchesSearch && matchesCategory;
  });

  const individuosDaCondicao = condicaoSelecionada 
    ? individuosExemplo.filter(ind => ind.condicoesIds.includes(condicaoSelecionada.id))
    : [];

  const handleVerCondicao = (condicao: CondicaoSaude) => {
    setCondicaoSelecionada(condicao);
    setViewMode('individuos');
    toast({
      title: "Visualizando indivíduos",
      description: `Carregando indivíduos com ${condicao.nome}...`
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatório de Condições de Saúde</h1>
        <p className="text-muted-foreground">
          Análise detalhada das condições de saúde da população cadastrada
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{estatisticas.totalCondicoes}</div>
            <div className="text-sm text-muted-foreground">Condições Identificadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{estatisticas.individuosAfetados}</div>
            <div className="text-sm text-muted-foreground">Indivíduos Afetados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{estatisticas.condicoesGraves}</div>
            <div className="text-sm text-muted-foreground">Condições Graves</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{estatisticas.tendenciaCrescente}</div>
            <div className="text-sm text-muted-foreground">Em Crescimento</div>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={() => setViewMode('condicoes')} 
        className="w-full md:w-auto"
        size="lg"
      >
        Ver Detalhes das Condições
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderCondicoes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Condições de Saúde</h1>
          <p className="text-muted-foreground">
            Clique em uma condição para ver os indivíduos afetados
          </p>
        </div>
        <Button variant="outline" onClick={() => setViewMode('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar condições de saúde..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="todas">Todas as categorias</option>
          {Object.entries(categorias).map(([key, cat]) => (
            <option key={key} value={key}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Lista de Condições */}
      <div className="grid gap-4">
        {condicoesFiltradas.map((condicao) => {
          const categoria = categorias[condicao.categoria];
          const IconeCategoria = categoria.icon;

          return (
            <Card key={condicao.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVerCondicao(condicao)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${categoria.color}`}>
                      <IconeCategoria className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{condicao.nome}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={categoria.color}>
                          {categoria.label}
                        </Badge>
                        <Badge className={gravidadeColors[condicao.gravidade]}>
                          {condicao.gravidade.charAt(0).toUpperCase() + condicao.gravidade.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{condicao.total}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      {tendenciaIcons[condicao.tendencia]}
                      indivíduos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderIndividuos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Indivíduos com {condicaoSelecionada?.nome}</h1>
          <p className="text-muted-foreground">
            {individuosDaCondicao.length} indivíduos encontrados
          </p>
        </div>
        <Button variant="outline" onClick={() => setViewMode('condicoes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar às Condições
        </Button>
      </div>

      {/* Lista de Indivíduos */}
      <div className="grid gap-4">
        {individuosDaCondicao.map((individuo) => (
          <Card key={individuo.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{individuo.nome}</h3>
                      <p className="text-sm text-muted-foreground">
                        {individuo.idade} anos • {individuo.sexo === 'M' ? 'Masculino' : 'Feminino'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">CPF:</span>
                      <span>{individuo.cpf}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Telefone:</span>
                      <span>{individuo.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Endereço:</span>
                      <span>{individuo.endereco}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Informações de Saúde</h4>
                  <div className="space-y-3">
                    {individuo.ultimaConsulta && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Última consulta:</span>
                        <span>{individuo.ultimaConsulta.toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    {individuo.responsavel && (
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Responsável:</span>
                        <span>{individuo.responsavel}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-sm">Condições:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {individuo.condicoesIds.map(condId => {
                          const cond = condicoesSaude.find(c => c.id === condId);
                          return cond ? (
                            <Badge key={condId} variant="outline" className="text-xs">
                              {cond.nome}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                    {individuo.observacoes && (
                      <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Observações:</strong> {individuo.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {individuosDaCondicao.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum indivíduo encontrado</h3>
            <p className="text-muted-foreground">
              Não há indivíduos cadastrados com esta condição de saúde.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {viewMode === 'dashboard' && renderDashboard()}
      {viewMode === 'condicoes' && renderCondicoes()}
      {viewMode === 'individuos' && renderIndividuos()}
    </div>
  );
};

export default Relatorios;