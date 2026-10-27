import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Doacao } from './doacao';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { id: number };
  CadastroDoacao: { doacaoParaEditar?: Doacao } | undefined;
  HistoricoDoacoes: undefined;
  DetalheDoacao: { doacao: Doacao };
};

export type ListaPontosScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ListaPontos'
>;

export type DetalhePontoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetalhePonto'
>;

export type CadastroDoacaoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CadastroDoacao'
>;

export type HistoricoDoacoesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'HistoricoDoacoes'
>;

export type DetalheDoacaoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetalheDoacao'
>;
