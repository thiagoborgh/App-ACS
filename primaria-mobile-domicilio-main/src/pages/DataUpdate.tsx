import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Calendar,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UpdateInfo {
  type: 'cadastral' | 'territorial' | 'formulario' | 'sistema';
  name: string;
  version: string;
  status: 'available' | 'installed' | 'installing';
  size: string;
  description: string;
  releaseDate: string;
}

const DataUpdate = () => {
  const { toast } = useToast();
  const [updates] = useState<UpdateInfo[]>([
    {
      type: 'cadastral',
      name: 'Dados Cadastrais IBGE',
      version: '2024.1',
      status: 'available',
      size: '2.4 MB',
      description: 'Atualização dos códigos de logradouros e bairros do IBGE',
      releaseDate: '2024-01-15'
    },
    {
      type: 'territorial',
      name: 'Mapas Territoriais',
      version: '2024.1',
      status: 'installed',
      size: '15.2 MB',
      description: 'Atualização dos limites territoriais das microáreas',
      releaseDate: '2024-01-10'
    },
    {
      type: 'formulario',
      name: 'Formulários e-SUS',
      version: '5.2.1',
      status: 'available',
      size: '1.8 MB',
      description: 'Novos formulários para cadastro individual e visitas',
      releaseDate: '2024-01-20'
    },
    {
      type: 'sistema',
      name: 'Sistema Core',
      version: '3.1.2',
      status: 'installing',
      size: '8.5 MB',
      description: 'Melhorias de performance e correções de bugs',
      releaseDate: '2024-01-22'
    }
  ]);

  const [progress, setProgress] = useState(45);

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'cadastral':
        return { icon: Database, label: 'Cadastral', color: 'bg-blue-500' };
      case 'territorial':
        return { icon: RefreshCw, label: 'Territorial', color: 'bg-green-500' };
      case 'formulario':
        return { icon: FileText, label: 'Formulário', color: 'bg-purple-500' };
      case 'sistema':
        return { icon: RefreshCw, label: 'Sistema', color: 'bg-orange-500' };
      default:
        return { icon: Database, label: 'Dados', color: 'bg-gray-500' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'available':
        return { 
          label: 'Disponível', 
          icon: Download, 
          variant: 'secondary' as const,
          color: 'text-blue-600' 
        };
      case 'installed':
        return { 
          label: 'Instalado', 
          icon: CheckCircle, 
          variant: 'default' as const,
          color: 'text-green-600' 
        };
      case 'installing':
        return { 
          label: 'Instalando', 
          icon: RefreshCw, 
          variant: 'outline' as const,
          color: 'text-orange-600' 
        };
      default:
        return { 
          label: 'Desconhecido', 
          icon: AlertTriangle, 
          variant: 'destructive' as const,
          color: 'text-red-600' 
        };
    }
  };

  const handleInstallUpdate = (updateName: string) => {
    toast({
      title: "Atualização iniciada",
      description: `Instalando ${updateName}...`
    });
  };

  const handleCheckUpdates = () => {
    toast({
      title: "Verificando atualizações",
      description: "Buscando novas atualizações disponíveis..."
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary" />
            {/* Badge IA com modal explicativo */}
            <Dialog>
              <DialogTrigger asChild>
                <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer">IA</Badge>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ponto de Contato IA</DialogTitle>
                  <DialogDescription>
                    Validação inteligente de atualizações de dados governamentais (IBGE, Mapas Territoriais, Formulários e-SUS).<br/>
                    O sistema sugere e verifica automaticamente se há novas versões disponíveis, promovendo eficiência e segurança na atualização dos dados oficiais.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          <div>
            <h1 className="text-3xl font-bold">Atualizações de Dados</h1>
            <p className="text-muted-foreground">
              Mantenha seus dados sempre atualizados com as últimas versões
            </p>
          </div>
        </div>
        <Button onClick={handleCheckUpdates} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Verificar Atualizações
        </Button>
      </div>

      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Status Geral das Atualizações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-muted-foreground">Instaladas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-muted-foreground">Disponíveis</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-muted-foreground">Instalando</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">28.9 MB</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Atualizações */}
      <Card>
        <CardHeader>
          <CardTitle>Atualizações Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {updates.map((update, index) => {
              const typeInfo = getTypeInfo(update.type);
              const statusInfo = getStatusInfo(update.status);
              const TypeIcon = typeInfo.icon;
              const StatusIcon = statusInfo.icon;

              return (
                <div key={index}>
                  <div className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.color}`}>
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{update.name}</h3>
                        <Badge variant="outline">{typeInfo.label}</Badge>
                        <Badge variant={statusInfo.variant} className="gap-1">
                          <StatusIcon className={`w-3 h-3 ${update.status === 'installing' ? 'animate-spin' : ''}`} />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {update.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Versão: {update.version}</span>
                        <span>Tamanho: {update.size}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(update.releaseDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {update.status === 'installing' && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Instalando...</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {update.status === 'available' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleInstallUpdate(update.name)}
                          className="gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Instalar
                        </Button>
                      )}
                      {update.status === 'installed' && (
                        <Button size="sm" variant="outline" disabled>
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {index < updates.length - 1 && <Separator className="my-2" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Atualização */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Atualização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Atualização Automática</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Instalar automaticamente atualizações críticas
              </p>
              <Badge variant="default">Ativado</Badge>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Horário de Atualização</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Instalar atualizações apenas em horários específicos
              </p>
              <Badge variant="secondary">02:00 - 06:00</Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center gap-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">Última verificação</p>
              <p className="text-muted-foreground">Hoje às 14:30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUpdate;