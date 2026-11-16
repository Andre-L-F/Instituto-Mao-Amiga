import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Doacao } from './doacao';
import type { Ponto } from './ponto';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { id: string; produtoId?: string };
  CadastroPonto: { pontoParaEditar?: Ponto } | undefined;
  CadastroDoacao: { doacaoParaEditar?: Doacao } | undefined;
  HistoricoDoacoes: undefined;
  DetalheDoacao: { id: string; doacao?: Doacao };
};

export type ListaPontosScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ListaPontos'
>;

export type DetalhePontoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetalhePonto'
>;

export type CadastroPontoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CadastroPonto'
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
