
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Users, Clock, Heart, AlertTriangle, UserPlus, Calendar, MapPin } from 'lucide-react';

const FamiliaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data para família
  const familia = {
    id: 1,
    prontuario: 'F2024001',
    responsavel: 'Maria Silva Santos',
    membros: 4,
    dataCadastro: '2024-01-15',
    ultimaVisita: '2024-01-20',
    diasSemVisita: 5,
    rendaFamiliar: 'Até 2 SM',
    referenciaRenda: 'Trabalho Formal',
    possuiPlanoSaude: false,
    aceitaVisitas: true,
    observacoes: 'Família colaborativa, sempre presente nas consultas',
    endereco: 'Rua das Flores, 123 - Centro',
    marcadores: ['hipertensao', 'diabetes', 'crianca'],
    situacoesEspeciais: ['vulnerabilidade-social'],
    membrosDetalhes: [
      { id: 1, nome: 'Maria Silva Santos', idade: 45, parentesco: 'Responsável', condicoes: ['Hipertensão', 'Diabetes'] },
      { id: 2, nome: 'João Silva Santos', idade: 47, parentesco: 'Cônjuge', condicoes: [] },
      { id: 3, nome: 'Ana Silva Santos', idade: 16, parentesco: 'Filha', condicoes: [] },
      { id: 4, nome: 'Pedro Silva Santos', idade: 12, parentesco: 'Filho', condicoes: ['Asma'] }
    ],
    historicoVisitas: [
      { data: '2024-01-20', tipo: 'Visita Domiciliar', observacoes: 'Família bem, acompanhamento da hipertensão' },
      { data: '2024-01-10', tipo: 'Consulta na UBS', observacoes: 'Consulta de rotina da responsável' }
    ]
  };

  const getMarcadorColor = (marcador: string) => {
    const cores = {
      'hipertensao': 'bg-red-100 text-red-800',
      'diabetes': 'bg-orange-100 text-orange-800',
      'crianca': 'bg-blue-100 text-blue-800',
      'idoso': 'bg-purple-100 text-purple-800',
      'deficiencia': 'bg-green-100 text-green-800',
      'vulnerabilidade-social': 'bg-yellow-100 text-yellow-800'
    };
    return cores[marcador as keyof typeof cores] || 'bg-gray-100 text-gray-800';
  };

  const getMarcadorLabel = (marcador: string) => {
    const labels = {
      'hipertensao': 'Hipertensão',
      'diabetes': 'Diabetes',
      'crianca': 'Criança',
      'idoso': 'Idoso',
      'deficiencia': 'Deficiência',
      'vulnerabilidade-social': 'Vulnerabilidade Social'
    };
    return labels[marcador as keyof typeof labels] || marcador;
  };

  const getAlertaVisita = (dias: number) => {
    if (dias > 30) return 'text-red-600';
    if (dias > 15) return 'text-yellow-600';
    return 'text-green-600';
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
              <h1 className="text-lg font-bold text-gray-800">{familia.responsavel}</h1>
              <p className="text-sm text-gray-600">Prontuário: {familia.prontuario}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Informações Gerais */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Membros da família:</span>
                <span className="font-medium">{familia.membros}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data de cadastro:</span>
                <span className="font-medium">{new Date(familia.dataCadastro).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Renda familiar:</span>
                <span className="font-medium">{familia.rendaFamiliar}</span>
              </div>
              
              {familia.referenciaRenda && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Referência da renda:</span>
                  <span className="font-medium">{familia.referenciaRenda}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Plano de saúde:</span>
                <span className="font-medium">{familia.possuiPlanoSaude ? 'Sim' : 'Não'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Aceita visitas:</span>
                <span className="font-medium">{familia.aceitaVisitas ? 'Sim' : 'Não'}</span>
              </div>

              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{familia.endereco}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status de Acompanhamento */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Acompanhamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-3">
              <span className={`text-sm font-medium ${getAlertaVisita(familia.diasSemVisita)}`}>
                {familia.diasSemVisita} dias sem visita
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Última visita: {new Date(familia.ultimaVisita).toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>

        {/* Marcadores de Saúde */}
        {familia.marcadores.length > 0 && (
          <Card className="mb-4 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Heart className="w-5 h-5 mr-2 text-blue-600" />
                Condições de Saúde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {familia.marcadores.map((marcador) => (
                  <Badge
                    key={marcador}
                    className={`text-xs ${getMarcadorColor(marcador)}`}
                  >
                    {getMarcadorLabel(marcador)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Situações Especiais */}
        {familia.situacoesEspeciais.length > 0 && (
          <Card className="mb-4 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Situações Especiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {familia.situacoesEspeciais.map((situacao) => (
                  <Badge
                    key={situacao}
                    className={`text-xs ${getMarcadorColor(situacao)}`}
                  >
                    {getMarcadorLabel(situacao)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Membros da Família */}
        <Card className="mb-4 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Membros da Família
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/familia/${id}/novo-membro`)}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {familia.membrosDetalhes.map((membro) => (
                <div key={membro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{membro.nome}</h4>
                    <p className="text-sm text-gray-600">{membro.idade} anos • {membro.parentesco}</p>
                    {membro.condicoes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {membro.condicoes.map((condicao) => (
                          <Badge key={condicao} className="text-xs bg-blue-100 text-blue-800">
                            {condicao}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/pessoa/${membro.id}`)}
                  >
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        {familia.observacoes && (
          <Card className="mb-4 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{familia.observacoes}</p>
            </CardContent>
          </Card>
        )}

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            onClick={() => navigate(`/familia/${id}/editar`)}
          >
            <Edit className="w-5 h-5 mr-2" />
            Editar Família
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => navigate(`/familia/${id}/nova-visita`)}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Registrar Visita
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FamiliaDetalhes;
