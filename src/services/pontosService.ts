
import { apiFetch, ApiError } from './api';
import type { Page, Ponto } from '../types/ponto';

export interface ListarProdutosParams {
  page?: number;
  size?: number;
  sort?: string;
  busca?: string;
  bairro?: string;
  tipo?: string;
}

export type ListarPontosParams = ListarProdutosParams;

/**
 * Busca produtos na API paginada através de /produtos/filtro.
 * Funciona com ou sem parâmetros de busca e o backend ignora maiúsculas e minúsculas.
 */
export async function listarProdutos(
  params: ListarProdutosParams = {}
): Promise<Page<Ponto>> {
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
  if (params.busca && params.busca.trim()) {
    queryParams.append('busca', params.busca.trim());
    queryParams.append('nome', params.busca.trim());
  }
  if (params.bairro && params.bairro.trim()) {
    queryParams.append('bairro', params.bairro.trim());
  }
  if (params.tipo && params.tipo.trim()) {
    queryParams.append('tipo', params.tipo.trim());
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/produtos/filtro?${queryString}` : '/produtos/filtro';

  return apiFetch<Page<Ponto>>(endpoint);
}

export const listarPontos = listarProdutos;

/**
 * Busca o produto em /produtos/{id} usando o produtoId recebido na navegação.
 */
export async function buscarProdutoPorId(
  produtoId: string
): Promise<Ponto | null> {
  try {
    return await apiFetch<Ponto>(`/produtos/${produtoId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function buscarPontoPorId(
  id: string | number
): Promise<Ponto | null> {
  return buscarProdutoPorId(String(id));
}
