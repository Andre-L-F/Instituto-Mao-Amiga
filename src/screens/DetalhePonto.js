import React from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles/styles';

export default function DetalhePonto({
  ponto,
  voltar,
}) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
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
            {ponto.nome}
          </Text>

          <Text style={styles.label}>
            Endereço
          </Text>

          <Text style={styles.texto}>
            📍 {ponto.endereco}
          </Text>

          <Text style={styles.label}>
            Dias e horários
          </Text>

          <Text style={styles.texto}>
            🕐 {ponto.horario}
          </Text>

          <Text style={styles.label}>
            O que recebe/distribui
          </Text>

          <Text style={styles.texto}>
            {ponto.recebeDistribui}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}