import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { DetalhePontoScreenProps } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { buscarProdutoPorId } from '../services/pontosService';
import styles from '../styles/styles';

export default function DetalhePonto({
  route,
  navigation,
}: DetalhePontoScreenProps) {
  // Usa o produtoId recebido na navegação
  const produtoId = String(route.params.produtoId ?? route.params.id ?? '');

  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Busca o produto em /produtos/{id} usando o produtoId recebido na navegação
  const carregarProduto = useCallback(async () => {
    if (!produtoId) {
      setNaoEncontrado(true);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setNaoEncontrado(false);
    setErro(null);

    try {
      const produtoBuscado = await buscarProdutoPorId(produtoId);
      if (produtoBuscado) {
        setPonto(produtoBuscado);
      } else {
        setNaoEncontrado(true);
      }
    } catch (err) {
      console.log('Erro ao buscar produto por id na API:', err);
      setErro('Não foi possível carregar as informações deste item da API.');
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

  useEffect(() => {
    carregarProduto();
  }, [carregarProduto]);

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
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoVoltar}>← Voltar</Text>
          </TouchableOpacity>

          {carregando && (
            <View style={styles.carregandoContainer}>
              <ActivityIndicator size="large" color="#2E7D32" />
              <Text style={styles.carregandoTexto}>
                Carregando detalhes da API...
              </Text>
            </View>
          )}

          {!carregando && naoEncontrado && (
            <View style={styles.semResultados}>
              <Text style={styles.semResultadosTexto}>
                Item não encontrado
              </Text>
              <Text style={styles.semResultadosSubtexto}>
                O item com identificador {produtoId} não foi encontrado no servidor (HTTP 404).
              </Text>
            </View>
          )}

          {!carregando && erro && (
            <View style={styles.erroContainer}>
              <Text style={styles.erroTitulo}>Erro de Comunicação</Text>
              <Text style={styles.erroMensagem}>{erro}</Text>
              <TouchableOpacity
                style={styles.botaoTentarNovamente}
                onPress={carregarProduto}
              >
                <Text style={styles.textoBotaoTentarNovamente}>
                  Tentar novamente
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {!carregando && ponto && (
            <View>
              <Text style={styles.nomeDetalhe}>{ponto.nome}</Text>

              {ponto.endereco ? (
                <>
                  <Text style={styles.label}>Endereço</Text>
                  <Text style={styles.texto}>📍 {ponto.endereco}</Text>
                </>
              ) : null}

              {ponto.horario ? (
                <>
                  <Text style={styles.label}>Dias e horários</Text>
                  <Text style={styles.texto}>🕐 {ponto.horario}</Text>
                </>
              ) : null}

              {ponto.recebeDistribui ? (
                <>
                  <Text style={styles.label}>O que recebe/distribui</Text>
                  <Text style={styles.texto}>{ponto.recebeDistribui}</Text>
                </>
              ) : null}

              {ponto.latitude !== undefined && ponto.longitude !== undefined ? (
                <>
                  <Text style={styles.label}>Coordenadas geográficas</Text>
                  <Text style={styles.texto}>
                    🌐 Lat: {ponto.latitude.toFixed(4)}, Long: {ponto.longitude.toFixed(4)}
                  </Text>
                </>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
