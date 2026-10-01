import React, { useEffect, useState } from 'react';

import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { listarDoacoes } from '../storage/doacoesStorage';

import ItemDoacao from '../components/ItemDoacao';

import styles from '../styles/styles';

export default function HistoricoDoacoes({
  voltar,
  abrirCadastro,
}) {
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
    async function carregarHistorico() {
      const doacoesSalvas = await listarDoacoes();

      setDoacoes(doacoesSalvas);
    }

    carregarHistorico();
  }, []);

  if (doacoes.length === 0) {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={doacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemDoacao doacao={item} />
        )}
        contentContainerStyle={styles.content}
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

            <Text style={styles.resultados}>
              {doacoes.length} doação(ões) registrada(s)
            </Text>
          </View>
        }
      />
    </View>
  );
}