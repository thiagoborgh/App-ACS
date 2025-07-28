
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Users, UserCog, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FamiliaData {
  prontuario: string;
  dataCadastro: string;
  rendaFamiliar: string;
  referenciaRenda: string;
  possuiPlanoSaude: string;
  aceitaVisitas: string;
  observacoes: string;
  responsavelAtual: string;
}

const EditarFamilia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMudancaResponsavel, setShowMudancaResponsavel] = useState(false);
  const [motivoMudanca, setMotivoMudanca] = useState('');
  const [novoResponsavel, setNovoResponsavel] = useState('');
  
  // Mock data - normalmente viria de uma API
  const [formData, setFormData] = useState<FamiliaData>({
    prontuario: 'F2024001',
    dataCadastro: '2024-01-15',
    rendaFamiliar: 'ate-2-sm',
    referenciaRenda: 'trabalho-formal',
    possuiPlanoSaude: 'nao',
    aceitaVisitas: 'sim',
    observacoes: 'Família colaborativa, sempre presente nas consultas',
    responsavelAtual: 'maria-silva-santos'
  });

  // Mock data para membros da família (potenciais responsáveis)
  const membrosDisponiveis = [
    { id: 'maria-silva-santos', nome: 'Maria Silva Santos', idade: 45 },
    { id: 'joao-silva-santos', nome: 'João Silva Santos', idade: 47 },
    { id: 'ana-silva-santos', nome: 'Ana Silva Santos', idade: 16 },
    { id: 'pedro-silva-santos', nome: 'Pedro Silva Santos', idade: 12 }
  ];

  const updateFormData = (field: keyof FamiliaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMudancaResponsavel = () => {
    if (!novoResponsavel || !motivoMudanca) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o novo responsável e o motivo da mudança.",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ ...prev, responsavelAtual: novoResponsavel }));
    setShowMudancaResponsavel(false);
    setNovoResponsavel('');
    setMotivoMudanca('');
    
    toast({
      title: "Responsável alterado",
      description: "O responsável familiar foi alterado com sucesso.",
    });
  };

  const handleSubmit = () => {
    console.log('Dados atualizados da família:', formData);
    toast({
      title: "Sucesso!",
      description: "Família atualizada com sucesso.",
    });
    navigate(`/familia/${id}`);
  };

  const responsavelAtual = membrosDisponiveis.find(m => m.id === formData.responsavelAtual);
  const outrosMembros = membrosDisponiveis.filter(m => m.id !== formData.responsavelAtual && m.idade >= 18);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/familia/${id}`)}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Editar Família</h1>
              <p className="text-sm text-gray-600">Prontuário: {formData.prontuario}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Responsável Familiar */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <UserCog className="w-5 h-5 mr-2 text-blue-600" />
              Responsável Familiar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{responsavelAtual?.nome}</h4>
                  <p className="text-sm text-gray-600">{responsavelAtual?.idade} anos</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowMudancaResponsavel(true)}
                  disabled={outrosMembros.length === 0}
                >
                  Alterar
                </Button>
              </div>

              {showMudancaResponsavel && (
                <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900">Mudança de Responsável</h4>
                  
                  <div>
                    <Label htmlFor="novoResponsavel">Novo Responsável *</Label>
                    <Select value={novoResponsavel} onValueChange={setNovoResponsavel}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione o novo responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        {outrosMembros.map((membro) => (
                          <SelectItem key={membro.id} value={membro.id}>
                            {membro.nome} ({membro.idade} anos)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="motivoMudanca">Motivo da Mudança *</Label>
                    <Select value={motivoMudanca} onValueChange={setMotivoMudanca}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="obito">Óbito do Responsável</SelectItem>
                        <SelectItem value="mudanca-territorio">Mudança de Território</SelectItem>
                        <SelectItem value="incapacidade">Incapacidade</SelectItem>
                        <SelectItem value="transferencia">Transferência de Responsabilidade</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowMudancaResponsavel(false);
                        setNovoResponsavel('');
                        setMotivoMudanca('');
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleMudancaResponsavel}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dados da Família */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Dados da Família
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="prontuario">Número do Prontuário</Label>
                <Input
                  id="prontuario"
                  value={formData.prontuario}
                  disabled
                  className="h-12 bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="dataCadastro">Data de Cadastro</Label>
                <Input
                  id="dataCadastro"
                  type="date"
                  value={formData.dataCadastro}
                  disabled
                  className="h-12 bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="rendaFamiliar">Renda Familiar</Label>
                <Select value={formData.rendaFamiliar} onValueChange={(value) => updateFormData('rendaFamiliar', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione a faixa de renda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem-renda">Sem Renda</SelectItem>
                    <SelectItem value="ate-1-4-sm">Até 1/4 SM</SelectItem>
                    <SelectItem value="ate-1-2-sm">Até 1/2 SM</SelectItem>
                    <SelectItem value="ate-1-sm">Até 1 SM</SelectItem>
                    <SelectItem value="ate-2-sm">Até 2 SM</SelectItem>
                    <SelectItem value="ate-3-sm">Até 3 SM</SelectItem>
                    <SelectItem value="ate-5-sm">Até 5 SM</SelectItem>
                    <SelectItem value="acima-5-sm">Acima de 5 SM</SelectItem>
                    <SelectItem value="nao-informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="referenciaRenda">Referência da Renda</Label>
                <Select value={formData.referenciaRenda} onValueChange={(value) => updateFormData('referenciaRenda', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione a referência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bolsa-familia">Bolsa Família</SelectItem>
                    <SelectItem value="bpc">BPC</SelectItem>
                    <SelectItem value="aposentadoria">Aposentadoria</SelectItem>
                    <SelectItem value="pensao">Pensão</SelectItem>
                    <SelectItem value="auxilio-doenca">Auxílio Doença</SelectItem>
                    <SelectItem value="seguro-desemprego">Seguro Desemprego</SelectItem>
                    <SelectItem value="trabalho-formal">Trabalho Formal</SelectItem>
                    <SelectItem value="trabalho-informal">Trabalho Informal</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="possuiPlanoSaude">Possui Plano de Saúde</Label>
                <Select value={formData.possuiPlanoSaude} onValueChange={(value) => updateFormData('possuiPlanoSaude', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="nao-informado">Não Informado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="aceitaVisitas">Aceita Visitas Domiciliares</Label>
                <Select value={formData.aceitaVisitas} onValueChange={(value) => updateFormData('aceitaVisitas', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => updateFormData('observacoes', e.target.value)}
                  placeholder="Observações adicionais"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
        >
          <Save className="w-5 h-5 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default EditarFamilia;
