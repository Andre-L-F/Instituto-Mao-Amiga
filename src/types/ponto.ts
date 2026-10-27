export interface Ponto {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  recebeDistribui: string;
  latitude: number;
  longitude: number;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  content: T[];
  page?: PageInfo;
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
}
