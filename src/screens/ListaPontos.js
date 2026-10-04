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

import pontosMock from '../data/pontosMock';

import {
  carregarBusca,
  salvarBusca,
} from '../storage/storage';

import styles from '../styles/styles';

export default function ListaPontos({
  abrirDetalhe,
  abrirCadastro,
  abrirHistorico,
}) {
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function buscarBuscaSalva() {
      const buscaSalva = await carregarBusca();

      setBusca(buscaSalva);
    }

    buscarBuscaSalva();
  }, []);

  useEffect(() => {
    salvarBusca(busca);
  }, [busca]);

  const pontosFiltrados = pontosMock.filter((ponto) => {
    const textoBusca = busca.toLowerCase();

    return (
      ponto.nome.toLowerCase().includes(textoBusca) ||
      ponto.endereco.toLowerCase().includes(textoBusca) ||
      ponto.horario.toLowerCase().includes(textoBusca) ||
      ponto.recebeDistribui.toLowerCase().includes(textoBusca)
    );
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        style={styles.container}
        data={pontosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={
          Platform.OS === 'ios' ? 'interactive' : 'on-drag'
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>
              Instituto Mão Amiga
            </Text>

            <Text style={styles.subtitulo}>
              Pontos de coleta e distribuição
            </Text>

            <TouchableOpacity
              style={styles.botaoCadastrar}
              onPress={() => abrirCadastro('lista')}
            >
              <Text style={styles.textoBotao}>
                Cadastrar doação
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoHistorico}
              onPress={abrirHistorico}
            >
              <Text style={styles.textoBotao}>
                Minhas doações
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Buscar ponto..."
              placeholderTextColor="#888"
              value={busca}
              onChangeText={setBusca}
            />

            <Text style={styles.resultados}>
              {pontosFiltrados.length} ponto(s) encontrado(s)
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => abrirDetalhe(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.nome}>
              {item.nome}
            </Text>

            <Text style={styles.endereco}>
              📍 {item.endereco}
            </Text>

            <Text style={styles.horario}>
              🕐 {item.horario}
            </Text>

            <Text style={styles.verDetalhes}>
              Toque para ver detalhes →
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.semResultados}>
            <Text style={styles.semResultadosTexto}>
              Nenhum ponto encontrado.
            </Text>

            <Text style={styles.semResultadosSubtexto}>
              Tente pesquisar por outro nome, endereço ou tipo de doação.
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}