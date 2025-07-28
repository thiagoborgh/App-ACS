import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, FileText, Eye, Lock } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Políticas de Privacidade</h1>
          <p className="text-muted-foreground">
            Saiba como seus dados são coletados, utilizados e protegidos
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Coleta de Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Coleta de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Dados Coletados</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Dados de identificação pessoal (nome, CPF, RG)</li>
                <li>• Informações de contato (telefone, endereço, email)</li>
                <li>• Dados socioeconômicos e demográficos</li>
                <li>• Informações de saúde e condições médicas</li>
                <li>• Dados de localização geográfica</li>
                <li>• Registros de visitas domiciliares</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Finalidade da Coleta</h3>
              <p className="text-sm text-muted-foreground">
                Os dados são coletados exclusivamente para fins de atendimento em saúde pública, 
                acompanhamento familiar e territorial, conforme diretrizes do Sistema Único de Saúde (SUS).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Uso dos Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Uso dos Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Como Utilizamos seus Dados</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Prestação de serviços de saúde e acompanhamento familiar</li>
                <li>• Elaboração de relatórios epidemiológicos e estatísticos</li>
                <li>• Planejamento de ações de saúde pública</li>
                <li>• Controle e prevenção de doenças</li>
                <li>• Avaliação de programas de saúde</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Compartilhamento</h3>
              <p className="text-sm text-muted-foreground">
                Os dados podem ser compartilhados com outros órgãos de saúde pública, sempre 
                respeitando os protocolos de segurança e apenas para finalidades relacionadas 
                ao atendimento em saúde.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Proteção e Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Proteção e Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Medidas de Segurança</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Criptografia de dados em trânsito e em repouso</li>
                <li>• Controle de acesso baseado em perfis de usuário</li>
                <li>• Backup automático e redundância de dados</li>
                <li>• Monitoramento constante de atividades suspeitas</li>
                <li>• Auditoria de logs de sistema</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Tempo de Retenção</h3>
              <p className="text-sm text-muted-foreground">
                Os dados são mantidos pelo período necessário para cumprimento das finalidades 
                de saúde pública, conforme estabelecido pela legislação sanitária vigente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Direitos do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle>Seus Direitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Você tem direito a:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Acessar seus dados pessoais</li>
                <li>• Corrigir dados incorretos ou incompletos</li>
                <li>• Solicitar a portabilidade dos dados</li>
                <li>• Ser informado sobre o uso de seus dados</li>
                <li>• Revogar consentimento quando aplicável</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Contato</h3>
              <p className="text-sm text-muted-foreground">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                entre em contato com o Encarregado de Proteção de Dados através do email: 
                <span className="font-medium"> dpo@saude.gov.br</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Última Atualização */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Esta política foi atualizada em 15 de janeiro de 2024.
              <br />
              Versão 2.1 - Conforme Lei Geral de Proteção de Dados (LGPD)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;