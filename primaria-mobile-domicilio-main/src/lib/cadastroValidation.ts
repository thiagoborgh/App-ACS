// Validações e sugestões automáticas para cadastros
export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[\D]/g, '');
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;
  return true;
}

export function validarDataNascimento(data: string): boolean {
  if (!data) return false;
  const hoje = new Date();
  const nascimento = new Date(data);
  return nascimento < hoje && nascimento.getFullYear() > 1900;
}

export function sugerirCorrecaoCPF(cpf: string): string {
  // Sugere formato correto
  const limpo = cpf.replace(/[\D]/g, '');
  if (limpo.length !== 11) return 'CPF deve ter 11 dígitos';
  return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function validarCamposObrigatorios(obj: Record<string, any>, campos: string[]): string[] {
  return campos.filter(campo => !obj[campo]);
}

export function validarDataFutura(data: string): boolean {
  if (!data) return false;
  return new Date(data) > new Date();
}

// Sugestão de correção para data
export function sugerirCorrecaoData(data: string): string {
  return 'Corrija para DD/MM/AAAA';
}
