import { Usuario } from "./usuario";


export interface Desastre {
  id: number;
  uf: string;
  titulo: string;
  descricao: string;
  createdAt: string;
  severidade: string;
  usuario: Usuario;
}
