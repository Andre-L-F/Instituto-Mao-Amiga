import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_BUSCA = '@compre_bem:ultima_busca';
const CHAVE_DOACAO = '@compre_bem:cadastro_doacao';

export async function carregarBusca() {
  try {
    const buscaSalva = await AsyncStorage.getItem(CHAVE_BUSCA);

    if (buscaSalva !== null) {
      return buscaSalva;
    }

    return '';
  } catch (erro) {
    console.log('Erro ao carregar busca:', erro);
    return '';
  }
}

export async function salvarBusca(busca) {
  try {
    await AsyncStorage.setItem(CHAVE_BUSCA, busca);
  } catch (erro) {
    console.log('Erro ao salvar busca:', erro);
  }
}

export async function carregarDoacao() {
  try {
    const doacaoSalva = await AsyncStorage.getItem(CHAVE_DOACAO);

    if (doacaoSalva !== null) {
      return JSON.parse(doacaoSalva);
    }

    return null;
  } catch (erro) {
    console.log('Erro ao carregar doacao:', erro);
    return null;
  }
}

export async function salvarDoacao(doacao) {
  try {
    await AsyncStorage.setItem(
      CHAVE_DOACAO,
      JSON.stringify(doacao)
    );

    return true;
  } catch (erro) {
    console.log('Erro ao salvar doacao:', erro);
    return false;
  }
}