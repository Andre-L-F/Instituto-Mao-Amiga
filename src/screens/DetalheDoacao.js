import React from 'react';

import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  excluirDoacao,
} from '../storage/doacoesStorage';

import styles from '../styles/styles';

export default function DetalheDoacao({
  route,
  voltar,
  editar,
}) {
  const doacao = route.params.doacao;

  const data = new Date(doacao.criadoEm);

  const dataFormatada = data.toLocaleString(
    'pt-BR',
    {
      dateStyle: 'full',
      timeStyle: 'short',
    }
  );

  function confirmarExclusao() {
    Alert.alert(
      'Excluir doação',
      'Tem certeza que deseja excluir esta doação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const excluida =
              await excluirDoacao(doacao.id);

            if (excluida) {
              voltar();
            } else {
              Alert.alert(
                'Erro',
                'Não foi possível excluir a doação.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.detalheContainer
      }
    >
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={voltar}
      >
        <Text style={styles.textoVoltar}>
          ← Voltar
        </Text>
      </TouchableOpacity>

      <Text style={styles.nomeDetalhe}>
        Detalhe da doação
      </Text>

      <Text style={styles.label}>
        Tipo do item
      </Text>

      <Text style={styles.texto}>
        {doacao.tipoItem}
      </Text>

      <Text style={styles.label}>
        Quantidade
      </Text>

      <Text style={styles.texto}>
        {doacao.quantidade}
      </Text>

      <Text style={styles.label}>
        Ponto de destino
      </Text>

      <Text style={styles.texto}>
        {doacao.pontoDestino}
      </Text>

      <Text style={styles.label}>
        Data do registro
      </Text>

      <Text style={styles.texto}>
        {dataFormatada}
      </Text>

      <TouchableOpacity
        style={styles.botaoCadastrar}
        onPress={() => editar(doacao)}
      >
        <Text style={styles.textoBotao}>
          Editar doação
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoExcluir}
        onPress={confirmarExclusao}
      >
        <Text style={styles.textoBotao}>
          Excluir doação
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}