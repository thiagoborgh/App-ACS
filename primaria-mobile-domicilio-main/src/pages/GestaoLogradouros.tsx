import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Edit, 
  Merge,
  Search,
  Home,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Logradouro {
  id: string;
  nome: string;
  tipo: string;
  cep?: string;
  bairro: string;
  totalDomicilios: number;
  totalFamilias: number;
  totalIndividuos: number;
  situacao: 'ativo' | 'inativo' | 'duplicado';
  dataUltimaAtualizacao: Date;
}

const GestaoLogradouros = () => {
  const { toast } = useToast();
  const [busca, setBusca] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState<string>('todos');
  const [logradouroSelecionado, setLogradouroSelecionado] = useState<Logradouro | null>(null);
  const [logradouroOrigem, setLogradouroOrigem] = useState<string>('');
  const [logradouroDestino, setLogradouroDestino] = useState<string>('');
  const [editandoLogradouro, setEditandoLogradouro] = useState<Logradouro | null>(null);

  const [logradouros] = useState<Logradouro[]>([
    {
      id: '1',
      nome: 'Rua das Flores',
      tipo: 'Rua',
      cep: '12345-678',
      bairro: 'Centro',
      totalDomicilios: 45,
      totalFamilias: 52,
      totalIndividuos: 187,
      situacao: 'ativo',
      dataUltimaAtualizacao: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      nome: 'Avenida Principal',
      tipo: 'Avenida',
      cep: '12345-900',
      bairro: 'Centro',
      totalDomicilios: 78,
      totalFamilias: 89,
      totalIndividuos: 312,
      situacao: 'ativo',
      dataUltimaAtualizacao: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      nome: 'Rua das Flores',
      tipo: 'Rua',
      bairro: 'Centro',
      totalDomicilios: 12,
      totalFamilias: 14,
      totalIndividuos: 45,
      situacao: 'duplicado',
      dataUltimaAtualizacao: new Date(Date.now() - 259200000)
    },
    {
      id: '4',
      nome: 'Travessa do Campo',
      tipo: 'Travessa',
      bairro: 'Norte',
      totalDomicilios: 0,
      totalFamilias: 0,
      totalIndividuos: 0,
      situacao: 'inativo',
      dataUltimaAtualizacao: new Date(Date.now() - 345600000)
    }
  ]);

  const situacaoInfo = {
    ativo: { label: 'Ativo', variant: 'default' as const, color: 'bg-green-500' },
    inativo: { label: 'Inativo', variant: 'secondary' as const, color: 'bg-gray-500' },
    duplicado: { label: 'Duplicado', variant: 'destructive' as const, color: 'bg-red-500' }
  };

  const logradourosFiltrados = logradouros.filter(log => {
    const matchBusca = log.nome.toLowerCase().includes(busca.toLowerCase()) || 
                     log.bairro.toLowerCase().includes(busca.toLowerCase());
    const matchSituacao = filtroSituacao === 'todos' || log.situacao === filtroSituacao;
    return matchBusca && matchSituacao;
  });

  const logradourosElegiveis = logradouros.filter(log => 
    log.situacao === 'ativo' && (log.totalDomicilios > 0 || log.totalFamilias > 0)
  );

  const handleEditarLogradouro = (logradouro: Logradouro) => {
    setEditandoLogradouro({ ...logradouro });
  };

  const handleSalvarEdicao = () => {
    if (!editandoLogradouro) return;
    
    toast({
      title: "Logradouro atualizado",
      description: `As informações do logradouro "${editandoLogradouro.nome}" foram atualizadas.`
    });
    setEditandoLogradouro(null);
  };

  const handleMesclarLogradouros = () => {
    if (!logradouroOrigem || !logradouroDestino) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione tanto o logradouro de origem quanto o de destino.",
        variant: "destructive"
      });
      return;
    }

    if (logradouroOrigem === logradouroDestino) {
      toast({
        title: "Seleção inválida",
        description: "O logradouro de origem deve ser diferente do destino.",
        variant: "destructive"
      });
      return;
    }

    const origem = logradouros.find(l => l.id === logradouroOrigem);
    const destino = logradouros.find(l => l.id === logradouroDestino);

    toast({
      title: "Mesclagem realizada",
      description: `Logradouro "${origem?.nome}" mesclado com "${destino?.nome}" com sucesso.`
    });

    setLogradouroOrigem('');
    setLogradouroDestino('');
  };

  const contadores = {
    total: logradouros.length,
    ativos: logradouros.filter(l => l.situacao === 'ativo').length,
    duplicados: logradouros.filter(l => l.situacao === 'duplicado').length,
    inativos: logradouros.filter(l => l.situacao === 'inativo').length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Logradouros</h1>
        <p className="text-muted-foreground">
          Gerencie, edite e unifique logradouros do território
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{contadores.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{contadores.ativos}</div>
            <div className="text-sm text-muted-foreground">Ativos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{contadores.duplicados}</div>
            <div className="text-sm text-muted-foreground">Duplicados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{contadores.inativos}</div>
            <div className="text-sm text-muted-foreground">Inativos</div>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Busca e Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou bairro..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filtroSituacao} onValueChange={setFiltroSituacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as situações</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="duplicado">Duplicado</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mesclagem de Logradouros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Merge className="w-5 h-5" />
            Mesclar Logradouros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Logradouro de Origem</Label>
              <Select value={logradouroOrigem} onValueChange={setLogradouroOrigem}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar origem" />
                </SelectTrigger>
                <SelectContent>
                  {logradourosElegiveis.map(log => (
                    <SelectItem key={log.id} value={log.id}>
                      {log.nome} - {log.bairro} ({log.totalDomicilios} domicílios)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Logradouro de Destino</Label>
              <Select value={logradouroDestino} onValueChange={setLogradouroDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar destino" />
                </SelectTrigger>
                <SelectContent>
                  {logradouros.map(log => (
                    <SelectItem key={log.id} value={log.id}>
                      {log.nome} - {log.bairro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className="gap-2"
                disabled={!logradouroOrigem || !logradouroDestino}
              >
                <Merge className="w-4 h-4" />
                Confirmar Mesclagem
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Mesclagem de Logradouros</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá mesclar todos os dados do logradouro de origem com o destino. 
                  Esta operação não pode ser desfeita. Deseja continuar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleMesclarLogradouros}>
                  Confirmar Mesclagem
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Lista de Logradouros */}
      <div className="space-y-4">
        {logradourosFiltrados.map((logradouro, index) => {
          const situacaoData = situacaoInfo[logradouro.situacao];

          return (
            <Card key={logradouro.id} className={`border-l-4 border-l-${situacaoData.color.replace('bg-', '')}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${situacaoData.color}`} />
                    <MapPin className="w-5 h-5" />
                    <div>
                      <CardTitle className="text-lg">
                        {logradouro.tipo} {logradouro.nome}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={situacaoData.variant}>
                          {situacaoData.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {logradouro.bairro}
                        </span>
                        {logradouro.cep && (
                          <span className="text-sm text-muted-foreground">
                            CEP: {logradouro.cep}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditarLogradouro(logradouro)}
                        className="gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Logradouro</DialogTitle>
                        <DialogDescription>
                          Atualize as informações do logradouro selecionado.
                        </DialogDescription>
                      </DialogHeader>
                      {editandoLogradouro && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Tipo</Label>
                              <Select 
                                value={editandoLogradouro.tipo} 
                                onValueChange={(value) => setEditandoLogradouro({...editandoLogradouro, tipo: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Rua">Rua</SelectItem>
                                  <SelectItem value="Avenida">Avenida</SelectItem>
                                  <SelectItem value="Travessa">Travessa</SelectItem>
                                  <SelectItem value="Alameda">Alameda</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Nome</Label>
                              <Input
                                value={editandoLogradouro.nome}
                                onChange={(e) => setEditandoLogradouro({...editandoLogradouro, nome: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Bairro</Label>
                              <Input
                                value={editandoLogradouro.bairro}
                                onChange={(e) => setEditandoLogradouro({...editandoLogradouro, bairro: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>CEP</Label>
                              <Input
                                value={editandoLogradouro.cep || ''}
                                onChange={(e) => setEditandoLogradouro({...editandoLogradouro, cep: e.target.value})}
                                placeholder="00000-000"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditandoLogradouro(null)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSalvarEdicao}>
                          Salvar Alterações
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Home className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-lg font-bold">{logradouro.totalDomicilios}</div>
                    <div className="text-xs text-muted-foreground">Domicílios</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-lg font-bold">{logradouro.totalFamilias}</div>
                    <div className="text-xs text-muted-foreground">Famílias</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-lg font-bold">{logradouro.totalIndividuos}</div>
                    <div className="text-xs text-muted-foreground">Indivíduos</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Última atualização: </span>
                  {logradouro.dataUltimaAtualizacao.toLocaleString('pt-BR')}
                </div>

                {logradouro.situacao === 'duplicado' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">
                      Este logradouro pode ser uma duplicata. Considere fazer a mesclagem.
                    </span>
                  </div>
                )}

                {index < logradourosFiltrados.length - 1 && <Separator className="mt-4" />}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {logradourosFiltrados.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhum logradouro encontrado</h3>
            <p className="text-muted-foreground">
              Não há logradouros que correspondam aos filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GestaoLogradouros;