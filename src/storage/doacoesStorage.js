import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_DOACOES = '@compre_bem:doacoes';

export async function listarDoacoes() {
  try {
    const doacoesSalvas = await AsyncStorage.getItem(CHAVE_DOACOES);

    if (doacoesSalvas !== null) {
      const doacoes = JSON.parse(doacoesSalvas);

      if (Array.isArray(doacoes)) {
        return doacoes;
      }
    }

    return [];
  } catch (erro) {
    console.log('Erro ao listar doacoes:', erro);
    return [];
  }
}

export async function salvarDoacao(doacao) {
  try {
    const doacoes = await listarDoacoes();

    const novaDoacao = {
      ...doacao,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      criadoEm: new Date().toISOString(),
    };

    const novasDoacoes = [...doacoes, novaDoacao];

    await AsyncStorage.setItem(
      CHAVE_DOACOES,
      JSON.stringify(novasDoacoes)
    );

    return novaDoacao;
  } catch (erro) {
    console.log('Erro ao salvar doacao:', erro);
    return null;
  }
}

export async function atualizarDoacao(doacao) {
  try {
    const doacoes = await listarDoacoes();

    const novasDoacoes = doacoes.map((item) => {
      if (item.id === doacao.id) {
        return {
          ...item,
          tipoItem: doacao.tipoItem,
          quantidade: doacao.quantidade,
          pontoDestino: doacao.pontoDestino,
        };
      }

      return item;
    });

    await AsyncStorage.setItem(
      CHAVE_DOACOES,
      JSON.stringify(novasDoacoes)
    );

    return true;
  } catch (erro) {
    console.log('Erro ao atualizar doacao:', erro);
    return false;
  }
}

export async function excluirDoacao(id) {
  try {
    const doacoes = await listarDoacoes();

    const novasDoacoes = doacoes.filter(
      (doacao) => doacao.id !== id
    );

    await AsyncStorage.setItem(
      CHAVE_DOACOES,
      JSON.stringify(novasDoacoes)
    );

    return true;
  } catch (erro) {
    console.log('Erro ao excluir doacao:', erro);
    return false;
  }
}