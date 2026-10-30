import type { Page, PageInfo, Produto } from './produto';

export type { Page, PageInfo, Produto };

export interface Ponto extends Produto {
  produtoId: string;
  id?: number | string;
  nome: string;
  endereco: string;
  horario: string;
  recebeDistribui: string;
  latitude: number;
  longitude: number;
}

export type PageResponse<T> = Page<T>;
