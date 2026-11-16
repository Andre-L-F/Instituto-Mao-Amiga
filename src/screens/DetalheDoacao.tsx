import React from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { DetalheDoacaoScreenProps } from '../types/navigation';
import styles from '../styles/styles';

export default function DetalheDoacao({
  route,
  navigation,
}: DetalheDoacaoScreenProps) {
  const doacao = route.params?.doacao;

  if (!doacao) {
    return (
      <View style={[styles.container, styles.detalheContainer]}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.nomeDetalhe}>Doação não encontrada</Text>
      </View>
    );
  }

  const data = new Date(doacao.criadoEm);
  const dataFormatada = data.toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.detalheContainer}
    >
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.nomeDetalhe}>Detalhe da doação</Text>

      <Text style={styles.label}>Tipo do item</Text>
      <Text style={styles.texto}>{doacao.tipoItem}</Text>

      <Text style={styles.label}>Quantidade</Text>
      <Text style={styles.texto}>{doacao.quantidade}</Text>

      <Text style={styles.label}>Ponto de destino</Text>
      <Text style={styles.texto}>{doacao.pontoDestino}</Text>

      <Text style={styles.label}>Data do registro</Text>
      <Text style={styles.texto}>{dataFormatada}</Text>

      <TouchableOpacity
        style={styles.botaoCadastrar}
        onPress={() =>
          navigation.navigate('CadastroDoacao', { doacaoParaEditar: doacao })
        }
      >
        <Text style={styles.textoBotao}>Editar doação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
