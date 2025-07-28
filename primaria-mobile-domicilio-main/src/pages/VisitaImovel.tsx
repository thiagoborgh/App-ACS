
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Home, Search, Save, FileText, MapPin } from 'lucide-react';
import ControleAmbientalSection from '@/components/visitas/ControleAmbientalSection';
import { useToast } from '@/hooks/use-toast';

const VisitaImovel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imovelSelecionado, setImovelSelecionado] = useState<any>(null);
  const [visitaRealizada, setVisitaRealizada] = useState(true);
  const [showControleAmbiental, setShowControleAmbiental] = useState(false);
  const [visitaAcompanhada, setVisitaAcompanhada] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  // Mock data para imóveis
  const imoveis = [
    { 
      id: 1, 
      endereco: 'Rua das Flores, 123',
      tipo: 'Casa',
      situacao: 'Ocupado',
      familias: 1,
      moradores: 4
    },
    { 
      id: 2, 
      endereco: 'Rua das Flores, 125',
      tipo: 'Apartamento',
      situacao: 'Ocupado', 
      familias: 1,
      moradores: 3
    },
    { 
      id: 3, 
      endereco: 'Rua das Flores, 127',
      tipo: 'Casa',
      situacao: 'Desocupado',
      familias: 0,
      moradores: 0
    },
    { 
      id: 4, 
      endereco: 'Rua das Flores, 129',
      tipo: 'Comércio',
      situacao: 'Ativo',
      familias: 0,
      moradores: 0
    }
  ];

  const motivosVisita = [
    'Vistoria',
    'Controle Vetorial',
    'Levantamento',
    'Outros'
  ];

  const profissionaisEquipe = [
    'Carlos - ACE',
    'Ana - Enfermeira',
    'João - Fiscal Sanitário',
    'Maria - ACS'
  ];

  const tiposImovel = [
    'Residencial',
    'Comercial',
    'Industrial',
    'Misto',
    'Institucional',
    'Terreno Baldio',
    'Em Construção'
  ];

  const situacoesImovel = [
    'Ocupado',
    'Desocupado',
    'Fechado',
    'Abandonado',
    'Em Reforma',
    'Demolido'
  ];

  const onSubmit = (data: any) => {
    console.log('Dados da visita ao imóvel:', data);
    toast({
      title: "Visita ao imóvel registrada com sucesso!",
      description: "Os dados foram salvos e serão sincronizados.",
    });
    navigate('/visitas');
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
              onClick={() => navigate('/visitas')}
              className="mr-2 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">Nova Visita ao Imóvel</h1>
              <p className="text-sm text-gray-600">Registro de visita domiciliar ao imóvel</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Seleção do Imóvel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!imovelSelecionado ? (
                <div className="space-y-3">
                  <Label>Buscar Imóvel</Label>
                  <div className="space-y-2">
                    {imoveis.map((imovel) => (
                      <div
                        key={imovel.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => setImovelSelecionado(imovel)}
                      >
                        <div className="flex items-center mb-1">
                          <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                          <p className="font-medium">{imovel.endereco}</p>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Tipo: {imovel.tipo} • Situação: {imovel.situacao}</p>
                          {imovel.familias > 0 && (
                            <p>{imovel.familias} família(s) • {imovel.moradores} morador(es)</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-1">
                    <MapPin className="w-4 h-4 mr-1 text-purple-600" />
                    <p className="font-medium text-purple-900">{imovelSelecionado.endereco}</p>
                  </div>
                  <p className="text-sm text-purple-700">
                    {imovelSelecionado.tipo} • {imovelSelecionado.situacao}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setImovelSelecionado(null)}
                  >
                    Alterar Imóvel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confirmação da Visita */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visitaRealizada"
                  checked={visitaRealizada}
                  onCheckedChange={(checked) => setVisitaRealizada(checked === true)}
                />
                <Label htmlFor="visitaRealizada" className="font-medium">
                  A visita foi realizada?
                </Label>
              </div>
            </CardContent>
          </Card>

          {visitaRealizada && (
            <>
              {/* Motivo da Visita */}
              <Card>
                <CardHeader>
                  <CardTitle>Motivo da Visita</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motivosVisita.map((motivo) => (
                    <div key={motivo} className="flex items-center space-x-2">
                      <Checkbox
                        id={`motivo-${motivo}`}
                        {...register('motivos')}
                        value={motivo}
                      />
                      <Label htmlFor={`motivo-${motivo}`}>{motivo}</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Seção Expandível de Controle Ambiental/Vetorial */}
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowControleAmbiental(!showControleAmbiental)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Controle Ambiental/Vetorial
                  {showControleAmbiental && <span className="ml-auto">▼</span>}
                  {!showControleAmbiental && <span className="ml-auto">▶</span>}
                </Button>
                
                {showControleAmbiental && (
                  <ControleAmbientalSection register={register} />
                )}
              </div>

              {/* Informações do Imóvel */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Imóvel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Imóvel</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      {...register('tipoImovel')}
                    >
                      <option value="">Selecione...</option>
                      {tiposImovel.map((tipo) => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Situação do Imóvel</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      {...register('situacaoImovel')}
                    >
                      <option value="">Selecione...</option>
                      {situacoesImovel.map((situacao) => (
                        <option key={situacao} value={situacao}>{situacao}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nº de Cômodos</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...register('numeroComodos')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nº de Famílias</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...register('numeroFamilias')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Condições do Imóvel */}
              <Card>
                <CardHeader>
                  <CardTitle>Condições Ambientais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="aguaEncanada" {...register('aguaEncanada')} />
                    <Label htmlFor="aguaEncanada">Água encanada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="energiaEletrica" {...register('energiaEletrica')} />
                    <Label htmlFor="energiaEletrica">Energia elétrica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="esgotoSanitario" {...register('esgotoSanitario')} />
                    <Label htmlFor="esgotoSanitario">Esgoto sanitário</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="coletaLixo" {...register('coletaLixo')} />
                    <Label htmlFor="coletaLixo">Coleta de lixo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="animaisDomesticos" {...register('animaisDomesticos')} />
                    <Label htmlFor="animaisDomesticos">Animais domésticos</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Visita Acompanhada */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visitaAcompanhada"
                      checked={visitaAcompanhada}
                      onCheckedChange={(checked) => setVisitaAcompanhada(checked === true)}
                    />
                    <Label htmlFor="visitaAcompanhada">Visita acompanhada por profissional</Label>
                  </div>
                  
                  {visitaAcompanhada && (
                    <div className="space-y-3">
                      <Label>Profissional Acompanhante</Label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        {...register('profissionalAcompanhante')}
                      >
                        <option value="">Selecione...</option>
                        {profissionaisEquipe.map((profissional) => (
                          <option key={profissional} value={profissional}>
                            {profissional}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Observações */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Registre aqui observações importantes sobre o imóvel e a visita..."
                    {...register('observacoes')}
                    rows={4}
                  />
                </CardContent>
              </Card>
            </>
          )}

          {/* Botão Salvar */}
          <Button 
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Visita ao Imóvel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VisitaImovel;
