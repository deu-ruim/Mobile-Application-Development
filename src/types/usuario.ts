export interface Usuario {
  id: number;
  username: string;
  email: string;
  uf: string;
  ativo: boolean;
  role?: string;
}
