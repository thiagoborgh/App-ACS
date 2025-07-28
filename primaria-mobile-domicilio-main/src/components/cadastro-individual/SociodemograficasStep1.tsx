
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProps } from './types';

const SociodemograficasStep1 = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="racaCor">Raça/Cor *</Label>
          <Select value={formData.racaCor} onValueChange={(value) => updateFormData('racaCor', value)}>
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

        {formData.racaCor === 'indigena' && (
          <div>
            <Label htmlFor="etniaIndigena">Etnia Indígena</Label>
            <Input
              id="etniaIndigena"
              value={formData.etniaIndigena}
              onChange={(e) => updateFormData('etniaIndigena', e.target.value)}
              placeholder="Especifique a etnia"
              className="h-12"
            />
          </div>
        )}

        <div>
          <Label htmlFor="relacaoParentesco">Relação de Parentesco *</Label>
          <Select value={formData.relacaoParentesco} onValueChange={(value) => updateFormData('relacaoParentesco', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione o parentesco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pessoa-responsavel">Pessoa Responsável</SelectItem>
              <SelectItem value="conjuge-companheiro">Cônjuge/Companheiro</SelectItem>
              <SelectItem value="filho">Filho</SelectItem>
              <SelectItem value="enteado">Enteado</SelectItem>
              <SelectItem value="neto">Neto</SelectItem>
              <SelectItem value="pai-mae">Pai/Mãe</SelectItem>
              <SelectItem value="sogro">Sogro</SelectItem>
              <SelectItem value="irmao">Irmão</SelectItem>
              <SelectItem value="genro-nora">Genro/Nora</SelectItem>
              <SelectItem value="outros-parentes">Outros Parentes</SelectItem>
              <SelectItem value="outros-nao-parentes">Outros não Parentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ocupacao">Ocupação</Label>
          <Input
            id="ocupacao"
            value={formData.ocupacao}
            onChange={(e) => updateFormData('ocupacao', e.target.value)}
            placeholder="Profissão/ocupação"
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="situacaoMercado">Situação no Mercado de Trabalho</Label>
          <Select value={formData.situacaoMercado} onValueChange={(value) => updateFormData('situacaoMercado', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empregador">Empregador</SelectItem>
              <SelectItem value="assalariado">Assalariado</SelectItem>
              <SelectItem value="autonomo">Autônomo</SelectItem>
              <SelectItem value="aposentado-pensionista">Aposentado/Pensionista</SelectItem>
              <SelectItem value="desempregado">Desempregado</SelectItem>
              <SelectItem value="nao-trabalha">Não Trabalha</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SociodemograficasStep1;
