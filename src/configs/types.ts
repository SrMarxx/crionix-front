export interface UserProfile {
  id: string
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
