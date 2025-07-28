
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, User, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IndividualData {
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  sexo: string;
  raca: string;
  nacionalidade: string;
  municipioNascimento: string;
  nomeMae: string;
  nomePai: string;
  cpf: string;
  rg: string;
  cartaoSus: string;
  parentesco: string;
  escolaridade: string;
  situacaoEscolar: string;
  ocupacao: string;
  situacaoTrabalho: string;
  telefone: string;
  email: string;
  observacoes: string;
}

const EditarIndividual = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data - normalmente viria de uma API
  const [formData, setFormData] = useState<IndividualData>({
    nome: 'Ana Silva Santos',
    nomeSocial: '',
    dataNascimento: '1990-05-15',
    sexo: 'feminino',
    raca: 'parda',
    nacionalidade: 'brasileira',
    municipioNascimento: 'São Paulo',
    nomeMae: 'Maria Silva Santos',
    nomePai: 'João Silva Santos',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    cartaoSus: '123456789012345',
    parentesco: 'filha',
    escolaridade: 'medio-completo',
    situacaoEscolar: 'nao-estuda',
    ocupacao: 'Vendedora',
    situacaoTrabalho: 'empregada',
    telefone: '(11) 99999-9999',
    email: 'ana.silva@email.com',
    observacoes: 'Paciente colaborativa, faz acompanhamento regular'
  });

  const updateFormData = (field: keyof IndividualData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Dados atualizados do indivíduo:', formData);
    toast({
      title: "Sucesso!",
      description: "Dados atualizados com sucesso.",
    });
    navigate(`/pessoa/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/pessoa/${id}`)}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Editar Dados</h1>
              <p className="text-sm text-gray-600">{formData.nome}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Dados Pessoais */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => updateFormData('nome', e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="nomeSocial">Nome Social</Label>
                <Input
                  id="nomeSocial"
                  value={formData.nomeSocial}
                  onChange={(e) => updateFormData('nomeSocial', e.target.value)}
                  placeholder="Nome social (se diferente do nome)"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={formData.sexo} onValueChange={(value) => updateFormData('sexo', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="intersexo">Intersexo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="raca">Raça/Cor</Label>
                <Select value={formData.raca} onValueChange={(value) => updateFormData('raca', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione a raça/cor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branca">Branca</SelectItem>
                    <SelectItem value="preta">Preta</SelectItem>
                    <SelectItem value="parda">Parda</SelectItem>
                    <SelectItem value="amarela">Amarela</SelectItem>
                    <SelectItem value="indigena">Indígena</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="parentesco">Parentesco</Label>
                <Select value={formData.parentesco} onValueChange={(value) => updateFormData('parentesco', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="responsavel">Responsável</SelectItem>
                    <SelectItem value="conjuge">Cônjuge</SelectItem>
                    <SelectItem value="filho">Filho(a)</SelectItem>
                    <SelectItem value="neto">Neto(a)</SelectItem>
                    <SelectItem value="pai">Pai</SelectItem>
                    <SelectItem value="mae">Mãe</SelectItem>
                    <SelectItem value="sogro">Sogro(a)</SelectItem>
                    <SelectItem value="genro">Genro/Nora</SelectItem>
                    <SelectItem value="irmao">Irmão(ã)</SelectItem>
                    <SelectItem value="cunhado">Cunhado(a)</SelectItem>
                    <SelectItem value="primo">Primo(a)</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filiação e Origem */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Filiação e Origem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nomeMae">Nome da Mãe</Label>
                <Input
                  id="nomeMae"
                  value={formData.nomeMae}
                  onChange={(e) => updateFormData('nomeMae', e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="nomePai">Nome do Pai</Label>
                <Input
                  id="nomePai"
                  value={formData.nomePai}
                  onChange={(e) => updateFormData('nomePai', e.target.value)}
                  placeholder="Nome do pai (se conhecido)"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="municipioNascimento">Município de Nascimento</Label>
                <Input
                  id="municipioNascimento"
                  value={formData.municipioNascimento}
                  onChange={(e) => updateFormData('municipioNascimento', e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <Select value={formData.nacionalidade} onValueChange={(value) => updateFormData('nacionalidade', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione a nacionalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brasileira">Brasileira</SelectItem>
                    <SelectItem value="estrangeira">Estrangeira</SelectItem>
                    <SelectItem value="naturalizada">Naturalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentação */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Documentação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => updateFormData('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={formData.rg}
                  onChange={(e) => updateFormData('rg', e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="cartaoSus">Cartão SUS</Label>
                <Input
                  id="cartaoSus"
                  value={formData.cartaoSus}
                  onChange={(e) => updateFormData('cartaoSus', e.target.value)}
                  placeholder="Número do Cartão SUS"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educação e Trabalho */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Educação e Trabalho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="escolaridade">Escolaridade</Label>
                <Select value={formData.escolaridade} onValueChange={(value) => updateFormData('escolaridade', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione a escolaridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem-escolaridade">Sem Escolaridade</SelectItem>
                    <SelectItem value="fundamental-incompleto">Fundamental Incompleto</SelectItem>
                    <SelectItem value="fundamental-completo">Fundamental Completo</SelectItem>
                    <SelectItem value="medio-incompleto">Médio Incompleto</SelectItem>
                    <SelectItem value="medio-completo">Médio Completo</SelectItem>
                    <SelectItem value="superior-incompleto">Superior Incompleto</SelectItem>
                    <SelectItem value="superior-completo">Superior Completo</SelectItem>
                    <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="situacaoEscolar">Situação Escolar</Label>
                <Select value={formData.situacaoEscolar} onValueChange={(value) => updateFormData('situacaoEscolar', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estuda">Estuda</SelectItem>
                    <SelectItem value="nao-estuda">Não Estuda</SelectItem>
                    <SelectItem value="nunca-estudou">Nunca Estudou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ocupacao">Ocupação</Label>
                <Input
                  id="ocupacao"
                  value={formData.ocupacao}
                  onChange={(e) => updateFormData('ocupacao', e.target.value)}
                  placeholder="Profissão ou ocupação"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="situacaoTrabalho">Situação no Trabalho</Label>
                <Select value={formData.situacaoTrabalho} onValueChange={(value) => updateFormData('situacaoTrabalho', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empregado">Empregado</SelectItem>
                    <SelectItem value="desempregado">Desempregado</SelectItem>
                    <SelectItem value="aposentado">Aposentado</SelectItem>
                    <SelectItem value="estudante">Estudante</SelectItem>
                    <SelectItem value="autonomo">Autônomo</SelectItem>
                    <SelectItem value="dona-casa">Dona de Casa</SelectItem>
                    <SelectItem value="menor-idade">Menor de Idade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => updateFormData('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => updateFormData('observacoes', e.target.value)}
                placeholder="Observações adicionais sobre o indivíduo"
                className="min-h-[100px]"
              />
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

export default EditarIndividual;
