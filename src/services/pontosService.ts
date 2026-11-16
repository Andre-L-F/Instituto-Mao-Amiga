import { get, post, put, del, ApiError } from './api';
import type { Page, Ponto } from '../types/ponto';

export { ApiError };

export interface PontoInput {
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: string;
}

export interface BuscarPaginaParams {
  filtro?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export type ListarProdutosParams = BuscarPaginaParams;

/**
 * Lista todos os pontos sem paginação
 * GET /api/v1/pontos
 */
export async function listar(): Promise<Ponto[]> {
  return get<Ponto[]>('/api/v1/pontos');
}

/**
 * Busca página de pontos com filtro por nome ou bairro
 * GET /api/v1/pontos/filtro?filtro=...&page=0&size=10
 */
export async function buscarPagina(params: BuscarPaginaParams = {}): Promise<Page<Ponto>> {
  const query = new URLSearchParams();

  if (params.filtro && params.filtro.trim()) {
    query.append('filtro', params.filtro.trim());
  }
  if (params.page !== undefined) {
    query.append('page', String(params.page));
  }
  if (params.size !== undefined) {
    query.append('size', String(params.size));
  }
  if (params.sort) {
    query.append('sort', params.sort);
  }

  const qs = query.toString();
  const endpoint = qs ? `/api/v1/pontos/filtro?${qs}` : '/api/v1/pontos/filtro';
  return get<Page<Ponto>>(endpoint);
}

/**
 * Busca um ponto por UUID
 * GET /api/v1/pontos/{id}
 */
export async function buscarPorId(id: string): Promise<Ponto> {
  return get<Ponto>(`/api/v1/pontos/${id}`);
}

/**
 * Cadastra um novo ponto na API
 * POST /api/v1/pontos
 */
export async function cadastrar(ponto: PontoInput): Promise<Ponto> {
  return post<Ponto>('/api/v1/pontos', ponto);
}

/**
 * Atualiza um ponto existente na API
 * PUT /api/v1/pontos/{id}
 */
export async function editar(id: string, ponto: PontoInput): Promise<Ponto> {
  return put<Ponto>(`/api/v1/pontos/${id}`, ponto);
}

/**
 * Exclui um ponto existente na API
 * DELETE /api/v1/pontos/{id}
 */
export async function excluir(id: string): Promise<void> {
  return del<void>(`/api/v1/pontos/${id}`);
}

// Aliases para compatibilidade com chamadas existentes
export const listarPontos = async (params: { page?: number; size?: number; busca?: string } = {}) => {
  return buscarPagina({
    filtro: params.busca,
    page: params.page,
    size: params.size,
  });
};

export const buscarPontoPorId = buscarPorId;
export const listarProdutos = listarPontos;
export const buscarProdutoPorId = buscarPorId;
