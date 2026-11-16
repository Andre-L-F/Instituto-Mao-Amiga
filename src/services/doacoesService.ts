import { get, post, put, del, ApiError } from './api';
import type { Page } from '../types/ponto';
import type { Doacao } from '../types/doacao';

export { ApiError };

export interface DoacaoInput {
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
}

export interface BuscarDoacoesParams {
  filtro?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Lista todas as doações sem paginação
 * GET /api/v1/doacoes
 */
export async function listar(): Promise<Doacao[]> {
  return get<Doacao[]>('/api/v1/doacoes');
}

/**
 * Busca página de doações com filtro por tipo de item
 * GET /api/v1/doacoes/filtro?filtro=...&page=0&size=10
 */
export async function buscarPagina(params: BuscarDoacoesParams = {}): Promise<Page<Doacao>> {
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
  const endpoint = qs ? `/api/v1/doacoes/filtro?${qs}` : '/api/v1/doacoes/filtro';
  return get<Page<Doacao>>(endpoint);
}

/**
 * Busca uma doação por UUID
 * GET /api/v1/doacoes/{id}
 */
export async function buscarPorId(id: string): Promise<Doacao> {
  return get<Doacao>(`/api/v1/doacoes/${id}`);
}

/**
 * Cadastra uma nova doação na API
 * POST /api/v1/doacoes
 */
export async function cadastrar(doacao: DoacaoInput): Promise<Doacao> {
  return post<Doacao>('/api/v1/doacoes', doacao);
}

/**
 * Atualiza uma doação existente na API
 * PUT /api/v1/doacoes/{id}
 */
export async function editar(id: string, doacao: DoacaoInput): Promise<Doacao> {
  return put<Doacao>(`/api/v1/doacoes/${id}`, doacao);
}

/**
 * Exclui uma doação existente na API
 * DELETE /api/v1/doacoes/{id}
 */
export async function excluir(id: string): Promise<void> {
  return del<void>(`/api/v1/doacoes/${id}`);
}

// Aliases para compatibilidade
export const listarDoacoes = async (params: { page?: number; size?: number; busca?: string } = {}) => {
  return buscarPagina({
    filtro: params.busca,
    page: params.page,
    size: params.size,
  });
};

export const buscarDoacaoPorId = buscarPorId;
