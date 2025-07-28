
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProps } from './types';

const IdentificacaoStep2 = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="nomeMae">Nome da Mãe</Label>
          <Input
            id="nomeMae"
            value={formData.nomeMae}
            onChange={(e) => updateFormData('nomeMae', e.target.value)}
            placeholder="Nome completo da mãe"
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="nomePai">Nome do Pai</Label>
          <Input
            id="nomePai"
            value={formData.nomePai}
            onChange={(e) => updateFormData('nomePai', e.target.value)}
            placeholder="Nome completo do pai"
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="nacionalidade">Nacionalidade *</Label>
          <Select value={formData.nacionalidade} onValueChange={(value) => updateFormData('nacionalidade', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Selecione a nacionalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brasileira">Brasileira</SelectItem>
              <SelectItem value="naturalizada">Naturalizada</SelectItem>
              <SelectItem value="estrangeira">Estrangeira</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="municipioNascimento">Município de Nascimento *</Label>
          <Input
            id="municipioNascimento"
            value={formData.municipioNascimento}
            onChange={(e) => updateFormData('municipioNascimento', e.target.value)}
            placeholder="Cidade onde nasceu"
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="telefoneCelular">Telefone Celular</Label>
          <Input
            id="telefoneCelular"
            value={formData.telefoneCelular}
            onChange={(e) => updateFormData('telefoneCelular', e.target.value)}
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
    </div>
  );
};

export default IdentificacaoStep2;
