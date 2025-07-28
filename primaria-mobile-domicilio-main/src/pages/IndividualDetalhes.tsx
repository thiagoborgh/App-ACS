
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, Calendar, FileText, Heart, AlertTriangle, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const IndividualDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data para indivíduo
  const individuo = {
    id: 1,
    nome: 'Ana Silva Santos',
    nomeSocial: '',
    dataNascimento: '1990-05-15',
    idade: 34,
    sexo: 'Feminino',
    raca: 'Parda',
    parentesco: 'Filha',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    nomeMae: 'Maria Silva Santos',
    nomePai: 'João Silva Santos',
    nacionalidade: 'Brasileira',
    municipioNascimento: 'São Paulo',
    escolaridade: 'Médio Completo',
    situacaoEscolar: 'Não Estuda',
    ocupacao: 'Vendedora',
    situacaoTrabalho: 'Empregada',
    telefone: '(11) 99999-9999',
    email: 'ana.silva@email.com',
    deficiencias: [],
    doencas: ['Hipertensão'],
    medicamentos: ['Losartana 50mg'],
    alergias: [],
    observacoes: 'Paciente colaborativa, faz acompanhamento regular',
    familiaId: 1,
    endereco: 'Rua das Flores, 123 - Centro',
    dataUltimaConsulta: '2024-01-15',
    cartaoSus: '123456789012345',
    unidadeSaude: 'UBS Centro'
  };

  const getIdadeFormatada = () => {
    const anos = Math.floor(individuo.idade);
    return `${anos} anos`;
  };

  const getStatusSaude = () => {
    if (individuo.doencas.length > 0) return 'Requer Acompanhamento';
    return 'Sem Condições Especiais';
  };

  const getCorStatusSaude = () => {
    if (individuo.doencas.length > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
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
              onClick={() => navigate(-1)}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">{individuo.nome}</h1>
              <p className="text-sm text-gray-600">{individuo.parentesco} • {getIdadeFormatada()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Informações Pessoais */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nome completo:</span>
                <span className="font-medium text-right">{individuo.nome}</span>
              </div>
              
              {individuo.nomeSocial && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nome social:</span>
                  <span className="font-medium">{individuo.nomeSocial}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data de nascimento:</span>
                <span className="font-medium">{new Date(individuo.dataNascimento).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Idade:</span>
                <span className="font-medium">{getIdadeFormatada()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sexo:</span>
                <span className="font-medium">{individuo.sexo}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Raça/Cor:</span>
                <span className="font-medium">{individuo.raca}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Parentesco:</span>
                <span className="font-medium">{individuo.parentesco}</span>
              </div>

              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{individuo.endereco}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentação */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Documentação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {individuo.cpf && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CPF:</span>
                  <span className="font-medium">{individuo.cpf}</span>
                </div>
              )}
              
              {individuo.rg && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">RG:</span>
                  <span className="font-medium">{individuo.rg}</span>
                </div>
              )}
              
              {individuo.cartaoSus && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cartão SUS:</span>
                  <span className="font-medium">{individuo.cartaoSus}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nacionalidade:</span>
                <span className="font-medium">{individuo.nacionalidade}</span>
              </div>
              
              {individuo.municipioNascimento && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Naturalidade:</span>
                  <span className="font-medium">{individuo.municipioNascimento}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filiação */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Filiação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nome da mãe:</span>
                <span className="font-medium text-right">{individuo.nomeMae}</span>
              </div>
              
              {individuo.nomePai && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nome do pai:</span>
                  <span className="font-medium text-right">{individuo.nomePai}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Educação e Trabalho */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Educação e Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Escolaridade:</span>
                <span className="font-medium">{individuo.escolaridade}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Situação escolar:</span>
                <span className="font-medium">{individuo.situacaoEscolar}</span>
              </div>
              
              {individuo.ocupacao && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ocupação:</span>
                  <span className="font-medium">{individuo.ocupacao}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Situação no trabalho:</span>
                <span className="font-medium">{individuo.situacaoTrabalho}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condições de Saúde */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Heart className="w-5 h-5 mr-2 text-blue-600" />
              Condições de Saúde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className={`text-xs ${getCorStatusSaude()}`}>
                  {getStatusSaude()}
                </Badge>
              </div>

              {individuo.doencas.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Condições Identificadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {individuo.doencas.map((doenca, index) => (
                      <Badge key={index} className="text-xs bg-red-100 text-red-800">
                        {doenca}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {individuo.medicamentos.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Medicamentos em Uso</h4>
                  <div className="flex flex-wrap gap-2">
                    {individuo.medicamentos.map((medicamento, index) => (
                      <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                        {medicamento}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {individuo.dataUltimaConsulta && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Última consulta:</span>
                  <span className="font-medium">{new Date(individuo.dataUltimaConsulta).toLocaleDateString('pt-BR')}</span>
                </div>
              )}

              {individuo.unidadeSaude && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Unidade de referência:</span>
                  <span className="font-medium text-right">{individuo.unidadeSaude}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        {(individuo.telefone || individuo.email) && (
          <Card className="mb-4 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {individuo.telefone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Telefone:</span>
                    <span className="font-medium">{individuo.telefone}</span>
                  </div>
                )}
                
                {individuo.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">E-mail:</span>
                    <span className="font-medium text-right">{individuo.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Observações */}
        {individuo.observacoes && (
          <Card className="mb-4 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{individuo.observacoes}</p>
            </CardContent>
          </Card>
        )}

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            onClick={() => navigate(`/pessoa/${id}/editar`)}
          >
            <Edit className="w-5 h-5 mr-2" />
            Editar Dados
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => navigate(`/pessoa/${id}/condicoes-saude`)}
          >
            <Heart className="w-5 h-5 mr-2" />
            Gerenciar Condições de Saúde
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndividualDetalhes;
