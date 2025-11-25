export interface UserProfile {
  userId: string
  name: string
  cpf: string
  nascimento: string
  matricula: string
  email: string
  mustChangePassword: boolean
  cargo: string
}

export interface UserCreatePayload {
  name: string
  cpf: string
  nascimento: string // O input type="date" nos dá uma string no formato 'yyyy-mm-dd'
  email: string
  cargo: string
}

export interface ChangePasswordPayload {
  senhaAntiga: string
  novaSenha: string
}

export interface DecodedToken {
  sub: string
  scope: string
  iat: number
  exp: number
}

export interface AuthState {
  accessToken: string | null
  user: UserProfile | null
  permissions: Set<string>
  csrfToken: string | null
}

export interface MachineProfile{
  id: number;
  name: string;
  description: string;
  tensaoPadrao: number;
  tensaoVariacao: number;
  temperaturaPadrao: number;
  temperaturaVariacao: number;
  pressaoPadrao: number;
  pressaoVariacao: number;
  humidadePadrao: number;
  humidadeVariacao: number;
  sensores: SensorProfile[];
}

export interface MachineCreatePayload{
  name: string;
  description: string;
  tensaoPadrao: number;
  tensaoVariacao: number;
  temperaturaPadrao: number;
  temperaturaVariacao: number;
  pressaoPadrao: number;
  pressaoVariacao: number;
  humidadePadrao: number;
  humidadeVariacao: number;
  sensores: number[];
}

export interface SensorCreatePayload{
  name: string;
  description: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'PRESSURE' | 'OPENDOOR' | 'VOLTAGE'
}

export interface SensorProfile{
  id: number;
  name: string;
  description: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'PRESSURE' | 'OPENDOOR' | 'VOLTAGE'
}

export interface ResumoResponseDTO {
  equipamentos: Equipamentos;
  pendentes: ManutencoesPendentes;
  concluidas: ManutencoesConcluidas;
  falhas: TaxaFalha;
}

export interface Equipamentos {
  quantidadeAtual: number;
  vsMesAnterior: number;
}

export interface ManutencoesPendentes {
  quantidadePendentes: number;
  quantidadeUrgentes: number;
}

export interface ManutencoesConcluidas {
  quantidadeAtual: number;
  vsMesAnterior: number;
}

export interface TaxaFalha {
  quantidadeFalha: number;
  vsMesAnterior: number;
}

export interface PerformanceProfile{
  setor: 'ACOUGUE' | 'PADARIA' | 'FRUTAS' | 'LATICINIOS';
  performance: number;
}

export interface ManutencaoResponseDTO {
  id: number;
  maquina: string;
  colaborador: string;
  dataCriacao: string; // Usualmente LocalDateTime é serializado como string (ISO 8601)
  dataLimite: string;
  ativo: boolean;
  descricao: string;
  prioridade: 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAIXA';
  tipo: 'PREVENTIVA' | 'CORRETIVA' | 'PREDITIVA';
  dataConclusao: string | null; // Caso venha nulo
  conclusao: 'SUCESSO' | 'FALHA' | 'ADIAMENTO';
  relatorio: string;
  setor: 'ACOUGUE' | 'PADARIA' | 'FRUTAS' | 'LATICINIOS';
}
export interface ManutencaoRequestDTO {
  maquina: number;
  colaborador: string; // UUID geralmente serializado como string
  dataLimite: string;  // LocalDateTime serializado em formato ISO 8601 string
  descricao: string;
  prioridade: 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAIXA';
  tipo: 'PREVENTIVA' | 'CORRETIVA' | 'PREDITIVA';
}
export interface ManutencaoConclusaoDTO{
  conclusao: 'SUCESSO' | 'FALHA' | 'ADIAMENTO';
  relatorio: string;
}
export interface LeituraResponseDTO {
  id: number;
  valor: number;
  timestamp: string; // LocalDateTime serializado como string (ISO 8601)
  tipo: 'TEMPERATURE' | 'HUMIDITY' | 'PRESSURE' | 'OPENDOOR' | 'VOLTAGE';
}
export interface UserUpdateDTO {
  name: string;
  email: string;
}