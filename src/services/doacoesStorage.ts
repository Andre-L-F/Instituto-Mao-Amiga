import { lerJSON, salvarJSON } from './storage';
import type { Doacao, NovaDoacao } from '../types/doacao';

const CHAVE_DOACOES = '@instituto_mao_amiga:doacoes';
const CHAVE_BUSCA = '@instituto_mao_amiga:ultima_busca';

export async function listarDoacoes(): Promise<Doacao[]> {
  const doacoes = await lerJSON<Doacao[]>(CHAVE_DOACOES, []);
  if (Array.isArray(doacoes)) {
    // Garante que quantidade é sempre number mesmo para doações antigas gravadas como string
    return doacoes.map((item) => ({
      ...item,
      quantidade: Number(item.quantidade) || 0,
    }));
  }
  return [];
}

export async function salvarDoacao(doacao: NovaDoacao): Promise<Doacao | null> {
  try {
    const doacoes = await listarDoacoes();

    const novaDoacao: Doacao = {
      ...doacao,
      quantidade: Number(doacao.quantidade),
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      criadoEm: new Date().toISOString(),
    };

    const novasDoacoes = [...doacoes, novaDoacao];
    const sucesso = await salvarJSON(CHAVE_DOACOES, novasDoacoes);

    return sucesso ? novaDoacao : null;
  } catch (erro) {
    console.log('Erro ao salvar doação:', erro);
    return null;
  }
}

export async function atualizarDoacao(doacao: Doacao): Promise<boolean> {
  try {
    const doacoes = await listarDoacoes();

    const novasDoacoes = doacoes.map((item) => {
      if (item.id === doacao.id) {
        return {
          ...item,
          tipoItem: doacao.tipoItem,
          quantidade: Number(doacao.quantidade),
          pontoDestino: doacao.pontoDestino,
        };
      }
      return item;
    });

    return await salvarJSON(CHAVE_DOACOES, novasDoacoes);
  } catch (erro) {
    console.log('Erro ao atualizar doação:', erro);
    return false;
  }
}

export async function excluirDoacao(id: string): Promise<boolean> {
  try {
    const doacoes = await listarDoacoes();
    const novasDoacoes = doacoes.filter((doacao) => doacao.id !== id);
    return await salvarJSON(CHAVE_DOACOES, novasDoacoes);
  } catch (erro) {
    console.log('Erro ao excluir doação:', erro);
    return false;
  }
}

export async function carregarBusca(): Promise<string> {
  return lerJSON<string>(CHAVE_BUSCA, '');
}

export async function salvarBusca(busca: string): Promise<void> {
  await salvarJSON(CHAVE_BUSCA, busca);
}
