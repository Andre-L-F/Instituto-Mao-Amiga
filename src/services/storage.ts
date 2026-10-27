import AsyncStorage from '@react-native-async-storage/async-storage';

export async function lerJSON<T>(chave: string, valorPadrao: T): Promise<T> {
  try {
    const item = await AsyncStorage.getItem(chave);
    if (item !== null) {
      const parsed = JSON.parse(item);
      return parsed as T;
    }
    return valorPadrao;
  } catch (erro) {
    console.log(`Erro ao ler chave ${chave} do storage:`, erro);
    return valorPadrao;
  }
}

export async function salvarJSON<T>(chave: string, valor: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.log(`Erro ao salvar chave ${chave} no storage:`, erro);
    return false;
  }
}

export async function removerItem(chave: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(chave);
    return true;
  } catch (erro) {
    console.log(`Erro ao remover chave ${chave} do storage:`, erro);
    return false;
  }
}
