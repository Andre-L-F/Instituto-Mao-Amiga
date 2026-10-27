import { apiFetch, ApiError } from './api';
import type { PageResponse, Ponto } from '../types/ponto';

export interface ListarPontosParams {
  page?: number;
  size?: number;
  sort?: string;
  busca?: string;
  bairro?: string;
  tipo?: string;
}

export async function listarPontos(
  params: ListarPontosParams = {}
): Promise<PageResponse<Ponto>> {
  const queryParams = new URLSearchParams();

  if (params.page !== undefined) {
    queryParams.append('page', String(params.page));
  }
  if (params.size !== undefined) {
    queryParams.append('size', String(params.size));
  }
  if (params.sort) {
    queryParams.append('sort', params.sort);
  }
  if (params.busca) {
    queryParams.append('busca', params.busca);
  }
  if (params.bairro) {
    queryParams.append('bairro', params.bairro);
  }
  if (params.tipo) {
    queryParams.append('tipo', params.tipo);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/pontos?${queryString}` : '/pontos';

  return apiFetch<PageResponse<Ponto>>(endpoint);
}

export async function buscarPontoPorId(id: number): Promise<Ponto | null> {
  try {
    return await apiFetch<Ponto>(`/pontos/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
