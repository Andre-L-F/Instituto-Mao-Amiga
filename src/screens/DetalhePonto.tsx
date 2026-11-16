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
import { buscarPorId, ApiError } from '../services/pontosService';
import styles from '../styles/styles';

export default function DetalhePonto({
  route,
  navigation,
}: DetalhePontoScreenProps) {
  const id = String(route.params.id ?? route.params.produtoId ?? '');

  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarPonto = useCallback(async () => {
    if (!id) {
      setNaoEncontrado(true);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setNaoEncontrado(false);
    setErro(null);

    try {
      const pontoBuscado = await buscarPorId(id);
      setPonto(pontoBuscado);
    } catch (err: unknown) {
      console.log('Erro ao buscar ponto por id na API:', err);
      if (err instanceof ApiError && err.status === 404) {
        setNaoEncontrado(true);
      } else {
        setErro('Não foi possível conectar ao servidor da API. Verifique a conexão.');
      }
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarPonto();
  }, [carregarPonto]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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

        <View style={styles.detalheContainer}>
          {carregando && (
            <View style={styles.carregandoContainer}>
              <ActivityIndicator size="large" color="#2E7D32" />
              <Text style={styles.carregandoTexto}>
                Carregando detalhes do ponto...
              </Text>
            </View>
          )}

          {!carregando && naoEncontrado && (
            <View style={styles.semResultados}>
              <Text style={styles.semResultadosTexto}>
                ponto não encontrado
              </Text>
              <Text style={styles.semResultadosSubtexto}>
                O ponto com identificador {id} não foi encontrado no servidor (HTTP 404).
              </Text>
            </View>
          )}

          {!carregando && erro && (
            <View style={styles.erroContainer}>
              <Text style={styles.erroTitulo}>Erro de Comunicação</Text>
              <Text style={styles.erroMensagem}>{erro}</Text>
              <TouchableOpacity
                style={styles.botaoTentarNovamente}
                onPress={carregarPonto}
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

              {ponto.bairro ? (
                <>
                  <Text style={styles.label}>Bairro</Text>
                  <Text style={styles.texto}>🏘️ {ponto.bairro}</Text>
                </>
              ) : null}

              {ponto.horario ? (
                <>
                  <Text style={styles.label}>Dias e horários</Text>
                  <Text style={styles.texto}>🕐 {ponto.horario}</Text>
                </>
              ) : null}

              {ponto.tipo ? (
                <>
                  <Text style={styles.label}>Tipo de ponto</Text>
                  <Text style={styles.texto}>🏷️ {ponto.tipo}</Text>
                </>
              ) : null}

              {ponto.recebeDistribui ? (
                <>
                  <Text style={styles.label}>O que recebe/distribui</Text>
                  <Text style={styles.texto}>{ponto.recebeDistribui}</Text>
                </>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
