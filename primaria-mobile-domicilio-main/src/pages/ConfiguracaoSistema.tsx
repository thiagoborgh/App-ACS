import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  User, 
  Shield, 
  Settings, 
  Smartphone,
  Trash2,
  RefreshCw,
  Info,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

const ConfiguracaoSistema = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    servidor: 'https://esus.saude.gov.br:8080/esus',
    cpf: '12345678901',
    senha: '',
    lembraServidor: true
  });

  const [userInfo] = useState({
    nome: 'João Silva Santos',
    cpf: '123.456.789-01',
    equipe: 'Equipe 001 - Centro',
    unidade: 'UBS Central',
    lotacao: 'Agente Comunitário de Saúde'
  });

  const [appInfo] = useState({
    versao: '2.1.0',
    build: '20240701',
    compatibilidade: 'PEC 5.2+',
    ultimaAtualizacao: '01/07/2024'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestarConexao = async () => {
    toast({
      title: "Testando conexão...",
      description: "Verificando conectividade com o servidor."
    });

    // Simular teste de conexão
    setTimeout(() => {
      toast({
        title: "Conexão bem-sucedida",
        description: "Servidor PEC conectado e disponível.",
        variant: "default"
      });
    }, 2000);
  };

  const handleSalvarConfiguracao = () => {
    if (!formData.servidor || !formData.cpf || !formData.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Configuração salva",
      description: "As configurações foram salvas com sucesso."
    });
  };

  const handleTrocarLotacao = () => {
    toast({
      title: "Troca de lotação",
      description: "Funcionalidade de troca de lotação iniciada."
    });
  };

  const handleLimparDados = () => {
    toast({
      title: "Dados limpos",
      description: "Todos os dados locais foram removidos.",
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações e informações do aplicativo
        </p>
      </div>

      {/* Autenticação e Servidor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Configuração do Servidor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="servidor">Endereço do Servidor PEC</Label>
            <Input
              id="servidor"
              placeholder="http://servidor:porta/esus"
              value={formData.servidor}
              onChange={(e) => handleInputChange('servidor', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Formato: http://endereço:porta/esus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF do Usuário</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="lembrar"
              checked={formData.lembraServidor}
              onCheckedChange={(checked) => handleInputChange('lembraServidor', checked)}
            />
            <Label htmlFor="lembrar">Lembrar servidor para próximos acessos</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleTestarConexao} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Testar Conexão
            </Button>
            <Button onClick={handleSalvarConfiguracao} className="gap-2">
              <Shield className="w-4 h-4" />
              Salvar Configuração
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Nome Completo</Label>
              <p className="font-medium">{userInfo.nome}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">CPF</Label>
              <p className="font-medium">{userInfo.cpf}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Equipe</Label>
              <p className="font-medium">{userInfo.equipe}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Unidade</Label>
              <p className="font-medium">{userInfo.unidade}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm text-muted-foreground">Lotação</Label>
              <div className="flex items-center gap-2">
                <p className="font-medium">{userInfo.lotacao}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTrocarLotacao}
                  className="gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  Trocar Lotação
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Informações do Aplicativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Versão</Label>
              <div className="flex items-center gap-2">
                <p className="font-medium">{appInfo.versao}</p>
                <Badge variant="outline">Build {appInfo.build}</Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Compatibilidade</Label>
              <p className="font-medium">{appInfo.compatibilidade}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm text-muted-foreground">Última Atualização</Label>
              <p className="font-medium">{appInfo.ultimaAtualizacao}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Manutenção do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Limpar Dados Locais
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Limpeza de Dados</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação removerá todos os dados armazenados localmente no dispositivo. 
                    Certifique-se de ter sincronizado todos os dados importantes antes de continuar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLimparDados}>
                    Confirmar Limpeza
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" className="gap-2">
              <Info className="w-4 h-4" />
              Sobre o Sistema
            </Button>
          </div>

          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Suporte Técnico:</strong> suporte.esus@saude.gov.br</p>
            <p><strong>Manual do Usuário:</strong> Disponível no menu Ajuda</p>
            <p><strong>Versão do Protocolo:</strong> e-SUS APS 5.2</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracaoSistema;