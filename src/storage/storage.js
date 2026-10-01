import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_BUSCA = '@compre_bem:ultima_busca';

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