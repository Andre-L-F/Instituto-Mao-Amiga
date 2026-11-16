import { lerJSON, salvarJSON } from './storage';

const CHAVE_FAVORITOS = '@instituto_mao_amiga:pontos_favoritos';

/**
 * Obtém a lista de IDs dos pontos favoritados pelo usuário no aparelho
 */
export async function obterFavoritosIds(): Promise<string[]> {
  return lerJSON<string[]>(CHAVE_FAVORITOS, []);
}

/**
 * Verifica se um determinado ponto está favoritado
 */
export async function isFavorito(id: string): Promise<boolean> {
  const ids = await obterFavoritosIds();
  return ids.includes(id);
}

/**
 * Adiciona um ponto à lista de favoritos se ainda não estiver
 */
export async function adicionarFavorito(id: string): Promise<void> {
  const ids = await obterFavoritosIds();
  if (!ids.includes(id)) {
    const novos = [...ids, id];
    await salvarJSON(CHAVE_FAVORITOS, novos);
  }
}

/**
 * Remove um ponto da lista de favoritos
 */
export async function removerFavorito(id: string): Promise<void> {
  const ids = await obterFavoritosIds();
  const novos = ids.filter((item) => item !== id);
  await salvarJSON(CHAVE_FAVORITOS, novos);
}

/**
 * Alterna o estado de favorito do ponto (adiciona se não tiver, remove se tiver)
 * Retorna true se passou a ser favorito, ou false se foi removido
 */
export async function alternarFavorito(id: string): Promise<boolean> {
  const ids = await obterFavoritosIds();
  const index = ids.indexOf(id);

  if (index >= 0) {
    const novos = ids.filter((item) => item !== id);
    await salvarJSON(CHAVE_FAVORITOS, novos);
    return false;
  } else {
    const novos = [...ids, id];
    await salvarJSON(CHAVE_FAVORITOS, novos);
    return true;
  }
}
