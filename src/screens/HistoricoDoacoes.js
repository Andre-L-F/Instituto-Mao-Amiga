import React, { useEffect, useState } from 'react';

import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { listarDoacoes } from '../storage/doacoesStorage';

import ItemDoacao from '../components/ItemDoacao';

import styles from '../styles/styles';

export default function HistoricoDoacoes({
  voltar,
  abrirCadastro,
  abrirDetalheDoacao,
}) {
  const [doacoes, setDoacoes] = useState([]);
  const [textoBusca, setTextoBusca] = useState('');

  useEffect(() => {
    async function carregarHistorico() {
      const doacoesSalvas = await listarDoacoes();

      setDoacoes(doacoesSalvas);
    }

    carregarHistorico();
  }, []);

  const doacoesFiltradas = doacoes.filter((doacao) =>
    doacao.tipoItem
      .toLowerCase()
      .includes(textoBusca.toLowerCase())
  );

  const resumoPorTipo = Object.values(
    doacoes.reduce((resumo, doacao) => {
      const tipo = doacao.tipoItem.trim();
      const quantidade = Number(doacao.quantidade);

      if (!resumo[tipo]) {
        resumo[tipo] = {
          tipo,
          quantidade: 0,
          doacoes: 0,
        };
      }

      resumo[tipo].quantidade += quantidade;
      resumo[tipo].doacoes += 1;

      return resumo;
    }, {})
  ).sort((a, b) => b.quantidade - a.quantidade);

  if (doacoes.length === 0) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        <View style={styles.detalheContainer}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={voltar}
          >
            <Text style={styles.textoVoltar}>
              ← Voltar
            </Text>
          </TouchableOpacity>

          <Text style={styles.nomeDetalhe}>
            Minhas doações
          </Text>

          <View style={styles.semResultados}>
            <Text style={styles.semResultadosTexto}>
              Nenhuma doação registrada.
            </Text>

            <Text style={styles.semResultadosSubtexto}>
              Você ainda não cadastrou nenhuma doação.
            </Text>

            <TouchableOpacity
              style={styles.botaoCadastrar}
              onPress={() => abrirCadastro('historico')}
            >
              <Text style={styles.textoBotao}>
                Cadastrar doação
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >
      <FlatList
        data={doacoesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => abrirDetalheDoacao(item)}
          >
            <ItemDoacao doacao={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={voltar}
            >
              <Text style={styles.textoVoltar}>
                ← Voltar
              </Text>
            </TouchableOpacity>

            <Text style={styles.nomeDetalhe}>
              Minhas doações
            </Text>

            <View style={styles.resumo}>
              <Text style={styles.resumoTitulo}>
                Resumo das doações
              </Text>

              <Text style={styles.resumoTotal}>
                Total de doações: {doacoes.length}
              </Text>

              {resumoPorTipo.map((item) => (
                <Text
                  key={item.tipo}
                  style={styles.resumoItem}
                >
                  {item.tipo}: {item.quantidade} unidades em{' '}
                  {item.doacoes} doações
                </Text>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Buscar por tipo de item"
              placeholderTextColor="#888"
              value={textoBusca}
              onChangeText={setTextoBusca}
              autoCapitalize="none"
            />

            <Text style={styles.resultados}>
              {doacoesFiltradas.length} doação(ões) encontrada(s)
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.semResultados}>
            <Text style={styles.semResultadosTexto}>
              Nenhuma doação encontrada.
            </Text>

            <Text style={styles.semResultadosSubtexto}>
              Nenhuma doação contém "{textoBusca}" no tipo do item.
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}