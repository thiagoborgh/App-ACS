import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  RefreshCw, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Wifi, 
  WifiOff,
  Download,
  Upload,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { validarCPF } from '@/lib/cadastroValidation';

interface SyncStatus {
  status: 'synchronized' | 'pending' | 'syncing' | 'error' | 'offline';
  lastSync: Date | null;
  pendingCount: number;
  progress: number;
  autoSync: boolean;
}

interface SyncLog {
  id: string;
  timestamp: Date;
  type: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const Sync = () => {
  const { toast } = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: 'pending',
    lastSync: null,
    pendingCount: 15,
    progress: 0,
    autoSync: true
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000),
      type: 'success',
      message: 'Sincronização realizada com sucesso',
      details: '12 registros enviados, 3 recebidos'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000),
      type: 'error',
      message: 'Falha na sincronização',
      details: 'Timeout na conexão com servidor'
    }
  ]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusInfo = () => {
    switch (syncStatus.status) {
      case 'synchronized':
        return { 
          label: 'Sincronizado', 
          icon: CheckCircle, 
          color: 'bg-green-500',
          variant: 'default' as const
        };
      case 'pending':
        return { 
          label: 'Pendente', 
          icon: Clock, 
          color: 'bg-yellow-500',
          variant: 'secondary' as const
        };
      case 'syncing':
        return { 
          label: 'Sincronizando', 
          icon: RefreshCw, 
          color: 'bg-blue-500',
          variant: 'default' as const
        };
      case 'error':
        return { 
          label: 'Erro', 
          icon: AlertCircle, 
          color: 'bg-red-500',
          variant: 'destructive' as const
        };
      case 'offline':
        return { 
          label: 'Offline', 
          icon: WifiOff, 
          color: 'bg-gray-500',
          variant: 'outline' as const
        };
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "Sem conexão",
        description: "Conecte-se à internet para sincronizar os dados.",
        variant: "destructive"
      });
      return;
    }

    // Simulação de verificação de inconsistências antes da sincronização
    // Exemplo: CPF duplicado ou inválido, peso fora do intervalo
    // Aqui você pode integrar com o banco local ou mock de dados
    const registrosPendentes = [
      { id: 1, tipo: 'individual', cpf: '12345678900', peso: 120 },
      { id: 2, tipo: 'individual', cpf: '11111111111', peso: 45 },
      { id: 3, tipo: 'familia', cpf: '98765432100', peso: 200 }, // Peso fora do intervalo
      { id: 4, tipo: 'individual', cpf: '12345678900', peso: 70 } // CPF duplicado
    ];

    // Detectar CPFs duplicados
    const cpfCounts = registrosPendentes.reduce((acc, reg) => {
      acc[reg.cpf] = (acc[reg.cpf] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const cpfsDuplicados = Object.entries(cpfCounts).filter(([cpf, count]) => count > 1).map(([cpf]) => cpf);

    // Detectar CPFs inválidos
    const cpfsInvalidos = registrosPendentes.filter(reg => !validarCPF(reg.cpf)).map(reg => reg.cpf);

    // Detectar pesos fora do intervalo (exemplo: 20kg a 150kg)
    const pesosInvalidos = registrosPendentes.filter(reg => reg.peso < 20 || reg.peso > 150).map(reg => reg.id);

    if (cpfsDuplicados.length > 0 || cpfsInvalidos.length > 0 || pesosInvalidos.length > 0) {
      let detalhes = '';
      if (cpfsDuplicados.length > 0) detalhes += `CPFs duplicados: ${cpfsDuplicados.join(', ')}.\n`;
      if (cpfsInvalidos.length > 0) detalhes += `CPFs inválidos: ${cpfsInvalidos.join(', ')}.\n`;
      if (pesosInvalidos.length > 0) detalhes += `Pesos fora do intervalo nos registros: ${pesosInvalidos.join(', ')}.\n`;
      toast({
        title: "Inconsistências detectadas na sincronização",
        description: detalhes,
        variant: "destructive"
      });
      setSyncLogs(prev => [{
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'error',
        message: 'Inconsistências detectadas antes da sincronização',
        details: detalhes
      }, ...prev]);
      return;
    }

    setSyncStatus(prev => ({ ...prev, status: 'syncing', progress: 0 }));

    // Simular processo de sincronização
    const interval = setInterval(() => {
      setSyncStatus(prev => {
        const newProgress = prev.progress + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            status: 'synchronized',
            progress: 100,
            lastSync: new Date(),
            pendingCount: 0
          };
        }
        return { ...prev, progress: newProgress };
      });
    }, 1000);

    // Adicionar log de sucesso após 5 segundos
    setTimeout(() => {
      const newLog: SyncLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'success',
        message: 'Sincronização concluída',
        details: `${syncStatus.pendingCount} registros sincronizados`
      };
      setSyncLogs(prev => [newLog, ...prev]);
      
      toast({
        title: "Sincronização concluída",
        description: "Todos os dados foram sincronizados com sucesso."
      });
    }, 5000);
  };

  const handleAutoSyncToggle = (enabled: boolean) => {
    setSyncStatus(prev => ({ ...prev, autoSync: enabled }));
    toast({
      title: enabled ? "Sincronização automática ativada" : "Sincronização automática desativada",
      description: enabled 
        ? "O app sincronizará automaticamente quando conectado ao Wi-Fi." 
        : "Você precisará sincronizar manualmente."
    });
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sincronização</h1>
          <p className="text-muted-foreground">
            Gerencie a sincronização dos dados com o servidor
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm text-muted-foreground">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Status da Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Status da Sincronização
            <Dialog>
              <DialogTrigger asChild>
                <Badge className="ml-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white cursor-pointer">IA</Badge>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ponto de Contato IA</DialogTitle>
                  <DialogDescription>
                    Verificação automática de inconsistências (CPF duplicado/inválido, peso fora do intervalo) antes da sincronização usando IA (ACS-223).<br/>
                    Este recurso garante que os dados sincronizados estejam corretos, promovendo segurança e confiança para o ACS.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
              <StatusIcon className="w-5 h-5" />
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            <Button 
              onClick={handleSync}
              disabled={syncStatus.status === 'syncing' || !isOnline}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus.status === 'syncing' ? 'animate-spin' : ''}`} />
              Sincronizar Agora
            </Button>
          </div>

          {syncStatus.status === 'syncing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Sincronização</span>
                <span>{syncStatus.progress}%</span>
              </div>
              <Progress value={syncStatus.progress} className="w-full" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Última Sincronização</div>
              <div className="font-medium">
                {syncStatus.lastSync 
                  ? syncStatus.lastSync.toLocaleString('pt-BR')
                  : 'Nunca'
                }
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Dados Pendentes</div>
              <div className="font-medium">{syncStatus.pendingCount} registros</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <Download className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Sincronização Automática</div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Switch
                  checked={syncStatus.autoSync}
                  onCheckedChange={handleAutoSyncToggle}
                />
                <Label className="text-sm">
                  {syncStatus.autoSync ? 'Ativada' : 'Desativada'}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log de Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle>Log de Sincronização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncLogs.map((log, index) => (
              <div key={log.id}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.type === 'success' ? 'bg-green-500' :
                    log.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{log.message}</p>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>
                {index < syncLogs.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sync;