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
  Github,
  Brain,
  Target,
  Lightbulb,
  Code,
  Database,
  Zap
} from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Info className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Sobre o Projeto</h1>
          <p className="text-muted-foreground">
            Sistema ACS com Inteligência Artificial - Protótipo Avançado
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
                Sobre o Projeto ACS IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Este é um protótipo avançado de sistema para Agentes Comunitários de Saúde (ACS) 
                que integra Inteligência Artificial para otimizar o atendimento domiciliar e 
                melhorar a qualidade do cuidado oferecido às famílias.
              </p>
              <p className="text-sm text-muted-foreground">
                O sistema utiliza algoritmos inteligentes para validação de dados, detecção 
                de alertas clínicos, recomendações de materiais e otimização de rotas, 
                proporcionando uma experiência mais eficiente e precisa para os profissionais de saúde.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600">Inteligência Artificial</Badge>
                <Badge variant="secondary">Protótipo</Badge>
                <Badge variant="outline">ACS</Badge>
                <Badge variant="outline">Saúde Digital</Badge>
                <Badge className="bg-orange-100 text-orange-800">BETA</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Funcionalidades com IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <strong>Validação Inteligente:</strong> Sistema que previne erros baseados 
                    em contexto (ex: não permite marcar homem como gestante)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <strong>Detector de Alertas:</strong> Identifica automaticamente situações 
                    críticas que requerem atenção imediata
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <strong>Modal de Pré-Atendimento:</strong> Preparação inteligente com 
                    contexto IA antes de cada visita
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <strong>Assistente IA:</strong> Chatbot especializado para suporte 
                    aos ACS durante o trabalho
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <strong>Dashboard Inteligente:</strong> Relatórios e insights gerados 
                    automaticamente pela IA
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Objetivos do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Inovação Tecnológica</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Demonstrar potencial da IA na saúde</li>
                    <li>• Validar conceitos inovadores</li>
                    <li>• Testar usabilidade avançada</li>
                    <li>• Explorar automação inteligente</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Impacto na Saúde</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Reduzir erros humanos</li>
                    <li>• Acelerar atendimentos</li>
                    <li>• Melhorar precisão diagnóstica</li>
                    <li>• Otimizar recursos disponíveis</li>
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
                <Code className="w-5 h-5" />
                Stack Tecnológico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Frontend</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">React 18</Badge>
                  <Badge variant="outline" className="text-xs">TypeScript</Badge>
                  <Badge variant="outline" className="text-xs">Tailwind CSS</Badge>
                  <Badge variant="outline" className="text-xs">Shadcn/UI</Badge>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-1">Build & Deploy</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">Vite</Badge>
                  <Badge variant="outline" className="text-xs">Surge.sh</Badge>
                  <Badge variant="outline" className="text-xs">PWA Ready</Badge>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-1">Versão Atual</h4>
                <p className="text-sm text-muted-foreground">v1.0.0-beta</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-1">Última Atualização</h4>
                <p className="text-sm text-muted-foreground">05 de Agosto de 2025</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Status do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Protótipo funcional</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">IA integrada e operacional</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Em desenvolvimento contínuo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Testes de validação</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Dados de Demonstração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Este protótipo utiliza dados fictícios para demonstração das funcionalidades.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pessoas cadastradas:</span>
                  <span className="font-semibold">15+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Visitas no roteiro:</span>
                  <span className="font-semibold">9</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Famílias mapeadas:</span>
                  <span className="font-semibold">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center space-y-2">
                <div className="text-lg font-bold text-primary">ACS-IA</div>
                <div className="text-sm text-muted-foreground">
                  Protótipo com Inteligência Artificial
                </div>
                <div className="text-xs text-muted-foreground">
                  Desenvolvido para demonstrar o futuro da saúde digital
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <ExternalLink className="w-4 h-4" />
                Ver no GitHub
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;