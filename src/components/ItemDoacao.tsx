import React from 'react';
import { Text, View } from 'react-native';

import type { Doacao } from '../types/doacao';
import styles from '../styles/styles';

export interface ItemDoacaoProps {
  doacao: Doacao;
}

function ItemDoacao({ doacao }: ItemDoacaoProps) {
  const data = new Date(doacao.criadoEm);
  const dataFormatada = data.toLocaleString('pt-BR');

  return (
    <View style={styles.item}>
      <Text style={styles.nome}>{doacao.tipoItem}</Text>

      <Text style={styles.endereco}>
        Quantidade: {doacao.quantidade}
      </Text>

      <Text style={styles.endereco}>
        Ponto de destino: {doacao.pontoDestino}
      </Text>

      <Text style={styles.horario}>
        Registrada em: {dataFormatada}
      </Text>
    </View>
  );
}

export default React.memo(ItemDoacao);
