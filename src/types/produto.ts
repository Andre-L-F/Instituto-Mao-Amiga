export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Page<T> {
  content: T[];
  page?: PageInfo;
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface Produto {
  produtoId: string;
  id?: number | string;
  nome: string;
  endereco?: string;
  horario?: string;
  recebeDistribui?: string;
  latitude?: number;
  longitude?: number;
  descricao?: string;
  preco?: number;
}
