import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Clock,
  Edit,
  Activity
} from 'lucide-react';

const UserInfo = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Informações do Usuário</h1>
            <p className="text-muted-foreground">
              Dados pessoais e informações profissionais
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit className="w-4 h-4" />
          Editar Perfil
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Perfil Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt="Foto do usuário" />
                  <AvatarFallback className="text-lg">J</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold">Jonathan Silva Santos</h3>
                    <p className="text-muted-foreground">Agente Comunitário de Saúde</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>CPF: 123.456.789-00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Nascimento: 15/03/1985</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>(11) 99999-9999</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>jonathan.santos@saude.gov.br</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Unidade de Saúde</h4>
                  <p className="text-sm text-muted-foreground">UBS MIRANTE DA MATA</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Matrícula</h4>
                  <p className="text-sm text-muted-foreground">ACS-2024-001</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">CNES</h4>
                  <p className="text-sm text-muted-foreground">2269311</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Equipe</h4>
                  <p className="text-sm text-muted-foreground">ESF Mirante - Equipe 01</p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Área de Atuação</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Microárea 001 - Bairro Mirante da Mata</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ruas: Rua das Flores, Rua do Sol, Rua da Esperança (números 1-50)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">156</div>
                  <div className="text-sm text-muted-foreground">Famílias</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">542</div>
                  <div className="text-sm text-muted-foreground">Pessoas</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">23</div>
                  <div className="text-sm text-muted-foreground">Visitas/Mês</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Cobertura</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Permissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="default" className="w-full justify-center">
                Agente Comunitário
              </Badge>
              <Badge variant="secondary" className="w-full justify-center">
                Cadastro Individual
              </Badge>
              <Badge variant="secondary" className="w-full justify-center">
                Visitas Domiciliares
              </Badge>
              <Badge variant="outline" className="w-full justify-center">
                Relatórios Básicos
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Histórico de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Último acesso</p>
                <p className="text-muted-foreground">Hoje, 14:30</p>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="font-medium">Dispositivo</p>
                <p className="text-muted-foreground">Tablet Android</p>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="font-medium">Localização</p>
                <p className="text-muted-foreground">UBS Mirante da Mata</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Conectado</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sincronizado</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                Última sincronização: 15 min atrás
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;