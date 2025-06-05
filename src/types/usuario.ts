export interface Usuario {
  id: number;
  username: string;
  email: string;
  uf: string;
  ativo: boolean;
  role?: string;
}

export interface JwtUser {
  id: number;
  role: string;
  sub: string;
  exp: number;
};
