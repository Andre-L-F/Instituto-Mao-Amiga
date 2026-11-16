export interface Ponto {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: string;
  recebeDistribui?: string;
  latitude?: number;
  longitude?: number;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface Page<T> {
  content: T[];
  page: PageInfo;
}

export type PageResponse<T> = Page<T>;
