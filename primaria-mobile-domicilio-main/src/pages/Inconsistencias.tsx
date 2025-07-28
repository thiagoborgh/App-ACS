import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X,
  Eye,
  Users,
  Home,
  UserX,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Inconsistencia {
  id: string;
  tipo: 'vinculo_familiar' | 'responsavel_ausente' | 'domicilio_orfao' | 'dados_conflitantes';
  titulo: string;
  descricao: string;
  acoesSugeridas: string[];
  status: 'pendente' | 'em_resolucao' | 'resolvida' | 'ignorada';
  prioridade: 'alta' | 'media' | 'baixa';
  dataDeteccao: Date;
  logradouro?: string;
  familia?: string;
}

const Inconsistencias = () => {
  const { toast } = useToast();
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const [inconsistencias] = useState<Inconsistencia[]>([
    {
      id: '1',
      tipo: 'vinculo_familiar',
      titulo: 'Vínculo Familiar Inconsistente',
      descricao: 'Pessoa cadastrada como responsável familiar em dois domicílios diferentes',
      acoesSugeridas: [
        'Verificar cadastro nos dois domicílios',
        'Definir domicílio principal',
        'Atualizar vínculos familiares'
      ],
      status: 'pendente',
      prioridade: 'alta',
      dataDeteccao: new Date(Date.now() - 86400000),
      logradouro: 'Rua das Flores, 123',
      familia: 'Silva'
    },
    {
      id: '2',
      tipo: 'responsavel_ausente',
      titulo: 'Responsável Familiar Ausente',
      descricao: 'Família sem responsável familiar cadastrado',
      acoesSugeridas: [
        'Definir responsável familiar',
        'Verificar situação da família',
        'Atualizar cadastro familiar'
      ],
      status: 'em_resolucao',
      prioridade: 'alta',
      dataDeteccao: new Date(Date.now() - 172800000),
      logradouro: 'Av. Principal, 456',
      familia: 'Santos'
    },
    {
      id: '3',
      tipo: 'domicilio_orfao',
      titulo: 'Domicílio Órfão',
      descricao: 'Domicílio cadastrado sem famílias vinculadas',
      acoesSugeridas: [
        'Verificar se domicílio está ocupado',
        'Cadastrar família residente',
        'Inativar domicílio se vazio'
      ],
      status: 'pendente',
      prioridade: 'media',
      dataDeteccao: new Date(Date.now() - 259200000),
      logradouro: 'Rua do Campo, 789'
    },
    {
      id: '4',
      tipo: 'dados_conflitantes',
      titulo: 'Dados Conflitantes',
      descricao: 'Informações divergentes entre cadastro individual e familiar',
      acoesSugeridas: [
        'Comparar dados dos cadastros',
        'Atualizar informações corretas',
        'Validar com a família'
      ],
      status: 'resolvida',
      prioridade: 'baixa',
      dataDeteccao: new Date(Date.now() - 345600000),
      familia: 'Oliveira'
    }
  ]);

  const tiposInconsistencia = {
    vinculo_familiar: { label: 'Vínculo Familiar', icon: Users, color: 'bg-red-500' },
    responsavel_ausente: { label: 'Responsável Ausente', icon: UserX, color: 'bg-orange-500' },
    domicilio_orfao: { label: 'Domicílio Órfão', icon: Home, color: 'bg-yellow-500' },
    dados_conflitantes: { label: 'Dados Conflitantes', icon: Database, color: 'bg-blue-500' }
  };

  const statusInfo = {
    pendente: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
    em_resolucao: { label: 'Em Resolução', variant: 'default' as const, icon: Eye },
    resolvida: { label: 'Resolvida', variant: 'default' as const, icon: CheckCircle },
    ignorada: { label: 'Ignorada', variant: 'outline' as const, icon: X }
  };

  const prioridadeColors = {
    alta: 'border-l-red-500',
    media: 'border-l-yellow-500',
    baixa: 'border-l-green-500'
  };

  const inconsistenciasFiltradas = inconsistencias.filter(inc => {
    const tipoMatch = filtroTipo === 'todos' || inc.tipo === filtroTipo;
    const statusMatch = filtroStatus === 'todos' || inc.status === filtroStatus;
    return tipoMatch && statusMatch;
  });

  const handleResolverInconsistencia = (id: string) => {
    toast({
      title: "Inconsistência marcada como resolvida",
      description: "A inconsistência foi movida para o status resolvida."
    });
  };

  const handleIgnorarInconsistencia = (id: string) => {
    toast({
      title: "Inconsistência ignorada",
      description: "A inconsistência foi marcada como ignorada."
    });
  };

  const contadores = {
    total: inconsistencias.length,
    pendentes: inconsistencias.filter(i => i.status === 'pendente').length,
    emResolucao: inconsistencias.filter(i => i.status === 'em_resolucao').length,
    resolvidas: inconsistencias.filter(i => i.status === 'resolvida').length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Inconsistências</h1>
        <p className="text-muted-foreground">
          Identifique e resolva inconsistências nos dados cadastrais
        </p>
      </div>

      {/* Resumo das Inconsistências */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{contadores.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{contadores.pendentes}</div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{contadores.emResolucao}</div>
            <div className="text-sm text-muted-foreground">Em Resolução</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{contadores.resolvidas}</div>
            <div className="text-sm text-muted-foreground">Resolvidas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="vinculo_familiar">Vínculo Familiar</SelectItem>
                  <SelectItem value="responsavel_ausente">Responsável Ausente</SelectItem>
                  <SelectItem value="domicilio_orfao">Domicílio Órfão</SelectItem>
                  <SelectItem value="dados_conflitantes">Dados Conflitantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_resolucao">Em Resolução</SelectItem>
                  <SelectItem value="resolvida">Resolvida</SelectItem>
                  <SelectItem value="ignorada">Ignorada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Inconsistências */}
      <div className="space-y-4">
        {inconsistenciasFiltradas.map((inconsistencia, index) => {
          const tipoInfo = tiposInconsistencia[inconsistencia.tipo];
          const statusData = statusInfo[inconsistencia.status];
          const TipoIcon = tipoInfo.icon;
          const StatusIcon = statusData.icon;

          return (
            <Card key={inconsistencia.id} className={`border-l-4 ${prioridadeColors[inconsistencia.prioridade]}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${tipoInfo.color}`} />
                    <TipoIcon className="w-5 h-5" />
                    <div>
                      <CardTitle className="text-lg">{inconsistencia.titulo}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={statusData.variant} className="gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {statusData.label}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {inconsistencia.prioridade}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {inconsistencia.dataDeteccao.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{inconsistencia.descricao}</p>
                
                {inconsistencia.logradouro && (
                  <div>
                    <span className="text-sm font-medium">Logradouro: </span>
                    <span className="text-sm">{inconsistencia.logradouro}</span>
                  </div>
                )}

                {inconsistencia.familia && (
                  <div>
                    <span className="text-sm font-medium">Família: </span>
                    <span className="text-sm">{inconsistencia.familia}</span>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Ações Sugeridas:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {inconsistencia.acoesSugeridas.map((acao, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                        {acao}
                      </li>
                    ))}
                  </ul>
                </div>

                {inconsistencia.status !== 'resolvida' && inconsistencia.status !== 'ignorada' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleResolverInconsistencia(inconsistencia.id)}
                      className="gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Marcar como Resolvida
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleIgnorarInconsistencia(inconsistencia.id)}
                      className="gap-1"
                    >
                      <X className="w-3 h-3" />
                      Ignorar
                    </Button>
                  </div>
                )}
                
                {index < inconsistenciasFiltradas.length - 1 && <Separator className="mt-4" />}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {inconsistenciasFiltradas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhuma inconsistência encontrada</h3>
            <p className="text-muted-foreground">
              Não há inconsistências que correspondam aos filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Inconsistencias;