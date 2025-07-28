import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Home, 
  MoreVertical, 
  History, 
  RefreshCw, 
  Edit, 
  Trash2,
  Plus,
  AlertTriangle,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DomicilioDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('domicilio');

  // Mock data
  const domicilio = {
    id: 1,
    rua: 'das Farmácias, S/N',
    microarea: 'Microárea 01',
    bairro: 'Abraão',
    cidade: 'Florianópolis/SC',
    complemento: 'Não informado',
    pontoReferencia: 'Não informado',
    tipoResidencia: 'RESIDENCIAL',
    contato: 'Não informado',
    condicoesMoradia: 5,
    ultimaVisita: null
  };

  const familias = [
    {
      id: 1,
      numero: '001',
      responsavel: 'João José',
      genero: 'Masculino',
      idade: '19 anos e 4 meses',
      condicoes: ['Acima do peso', 'Fumante', 'Hipertenso', 'Expresso de internação', 'Usa PIC'],
      alerta: 'Família sem responsável cadastrado. Se um novo responsável não for identificado a família será removida da sincronização.',
      membros: [
        { nome: 'Não informado', info: 'Membro 1 - Não informado' },
        { nome: 'Recusado', info: 'Membro 2 - Não informado' }
      ]
    }
  ];

  const getCondicaoColor = (condicao: string) => {
    const cores = {
      'Acima do peso': 'bg-yellow-100 text-yellow-800',
      'Fumante': 'bg-red-100 text-red-800',
      'Hipertenso': 'bg-red-100 text-red-800',
      'Expresso de internação': 'bg-orange-100 text-orange-800',
      'Usa PIC': 'bg-green-100 text-green-800'
    };
    return cores[condicao as keyof typeof cores] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mr-2 p-2 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold">Informações do domicílio</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Domicilio Info Card */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">RUA</div>
                  <h2 className="font-semibold text-gray-800 mb-1">{domicilio.rua}</h2>
                  <p className="text-sm text-gray-600">{domicilio.microarea}, {domicilio.bairro} - {domicilio.cidade}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => console.log('Histórico de visitas')}>
                    <History className="w-4 h-4 mr-2" />
                    Histórico de visitas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Atualizar imóvel')}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar imóvel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Editar imóvel')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar imóvel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Excluir imóvel')} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir imóvel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="visitas" className="text-xs">
                  {domicilio.ultimaVisita ? 'Última visita' : 'Nenhuma visita'}
                </TabsTrigger>
                <TabsTrigger value="condicoes" className="text-xs">
                  {domicilio.condicoesMoradia} condições para acompanhar
                </TabsTrigger>
                <TabsTrigger value="domicilio" className="text-xs">
                  Domicílio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="domicilio" className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-500">Complemento não informado</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-500">Ponto de referência não informado</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">RESIDENCIAL</div>
                      <div className="text-sm text-gray-500">Não informado</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">CONTATO</div>
                      <div className="text-sm text-gray-500">Não informado</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="condicoes" className="mt-4">
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Condições para acompanhar</p>
                </div>
              </TabsContent>

              <TabsContent value="visitas" className="mt-4">
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Nenhuma visita registrada</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Ver Condições de Moradia */}
            <Button 
              variant="outline" 
              className="w-full mt-4 text-primary border-primary hover:bg-primary/10"
              onClick={() => console.log('Ver condições de moradia')}
            >
              VER CONDIÇÕES DE MORADIA
            </Button>
          </CardContent>
        </Card>

        {/* Famílias Section */}
        {familias.length > 0 && (
          <div className="space-y-4">
            {familias.map((familia) => (
              <Card key={familia.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <h3 className="font-medium">Família N° {familia.numero}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => navigate(`/visita/familia/${familia.id}`)}
                      >
                        VISITAR
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-2">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/familia/${familia.id}`)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/familia/${familia.id}/editar`)}>
                            Editar família
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Alerta */}
                  {familia.alerta && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-red-800 mb-1">
                            Família sem responsável cadastrado.
                          </div>
                          <div className="text-xs text-red-700">
                            Se um novo responsável não for identificado a família será removida da sincronização.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Responsável */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-800">{familia.responsavel}</div>
                        <div className="text-sm text-gray-600">{familia.genero} | {familia.idade}</div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => navigate(`/visita/cidadao/${familia.id}`)}
                      >
                        VISITAR
                      </Button>
                    </div>
                    
                    {/* Condições de Saúde */}
                    <div className="flex flex-wrap gap-1">
                      {familia.condicoes.map((condicao, index) => (
                        <Badge key={index} className={`text-xs ${getCondicaoColor(condicao)}`}>
                          {condicao}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Outros Membros */}
                  {familia.membros.map((membro, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-t border-gray-100">
                      <div>
                        <div className="font-medium text-gray-800">{membro.nome}</div>
                        <div className="text-sm text-gray-600">{membro.info}</div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => navigate(`/visita/cidadao/${index}`)}
                      >
                        VISITAR
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Adicionar Cidadão */}
            <Button 
              variant="outline" 
              className="w-full border-dashed border-2 border-gray-300 hover:border-primary hover:bg-primary/10"
              onClick={() => navigate(`/domicilio/${id}/nova-familia`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              ADICIONAR CIDADÃO
            </Button>
          </div>
        )}

        {/* Empty State when no families */}
        {familias.length === 0 && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Nenhuma família cadastrada</p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate(`/domicilio/${id}/nova-familia`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Família
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomicilioDetalhes;