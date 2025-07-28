import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Heart, 
  Users, 
  Globe, 
  Shield, 
  Smartphone,
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Info className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Sobre o Sistema</h1>
          <p className="text-muted-foreground">
            Conheça mais sobre o sistema e-SUS Território
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Sobre o e-SUS Território
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                O e-SUS Território é uma ferramenta digital desenvolvida para apoiar o trabalho 
                dos Agentes Comunitários de Saúde (ACS) e Agentes de Combate às Endemias (ACE) 
                na coleta e organização de informações sobre as famílias e indivíduos em seus 
                territórios de atuação.
              </p>
              <p className="text-sm text-muted-foreground">
                Este sistema faz parte da Estratégia e-SUS Atenção Básica, que busca informatizar 
                e qualificar o registro das informações de saúde na Atenção Básica, contribuindo 
                para o cuidado integral e a vigilância em saúde.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="default">Atenção Básica</Badge>
                <Badge variant="secondary">Vigilância em Saúde</Badge>
                <Badge variant="outline">Território</Badge>
                <Badge variant="outline">Cadastro Familiar</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Funcionalidades Principais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Cadastro Domiciliar e Territorial:</strong> Registro das condições 
                    de moradia e saneamento básico
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Cadastro da Família:</strong> Informações sobre composição e 
                    situação socioeconômica das famílias
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Cadastro Individual:</strong> Dados demográficos, condições de 
                    saúde e situações de vulnerabilidade
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Visitas Domiciliares:</strong> Registro de visitas e 
                    acompanhamentos realizados
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <strong>Relatórios Territoriais:</strong> Geração de relatórios para 
                    planejamento e gestão
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Benefícios para a Saúde Pública
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Para os Profissionais</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Agilidade no registro de informações</li>
                    <li>• Redução de retrabalho</li>
                    <li>• Melhor organização dos dados</li>
                    <li>• Facilita o planejamento de ações</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Para a Comunidade</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Melhoria no atendimento</li>
                    <li>• Identificação de vulnerabilidades</li>
                    <li>• Ações de prevenção direcionadas</li>
                    <li>• Acompanhamento contínuo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com informações técnicas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Informações Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Versão do Sistema</h4>
                <p className="text-sm text-muted-foreground">v3.1.2</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-1">Última Atualização</h4>
                <p className="text-sm text-muted-foreground">22 de Janeiro de 2024</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-1">Compatibilidade</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">Android 8+</Badge>
                  <Badge variant="outline" className="text-xs">iOS 12+</Badge>
                  <Badge variant="outline" className="text-xs">Web</Badge>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-1">Desenvolvido por</h4>
                <p className="text-sm text-muted-foreground">Ministério da Saúde</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Segurança e Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Dados criptografados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Conforme LGPD</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Backup automático</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Controle de acesso</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suporte e Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Mail className="w-4 h-4" />
                suporte@saude.gov.br
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Phone className="w-4 h-4" />
                0800 644 6543
              </Button>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <ExternalLink className="w-4 h-4" />
                Manual do Usuário
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-lg font-bold text-primary">SUS</div>
                <div className="text-sm text-muted-foreground">
                  Sistema Único de Saúde
                </div>
                <div className="text-xs text-muted-foreground">
                  Saúde é direito de todos e dever do Estado
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;