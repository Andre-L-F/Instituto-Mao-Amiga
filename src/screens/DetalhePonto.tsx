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
import { buscarPontoPorId } from '../services/pontosService';
import styles from '../styles/styles';

export default function DetalhePonto({
  route,
  navigation,
}: DetalhePontoProps) {
  const { id } = route.params;

  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarPonto = useCallback(async () => {
    setCarregando(true);
    setNaoEncontrado(false);
    setErro(null);

    try {
      const pontoBuscado = await buscarPontoPorId(id);
      if (pontoBuscado) {
        setPonto(pontoBuscado);
      } else {
        setNaoEncontrado(true);
      }
    } catch (err) {
      console.log('Erro ao buscar ponto por id:', err);
      setErro('Não foi possível carregar as informações deste ponto da API.');
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
                Carregando detalhes do ponto...
              </Text>
            </View>
          )}

          {!carregando && naoEncontrado && (
            <View style={styles.semResultados}>
              <Text style={styles.semResultadosTexto}>
                Ponto não encontrado
              </Text>
              <Text style={styles.semResultadosSubtexto}>
                O ponto com identificador {id} não foi encontrado no sistema (HTTP 404).
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

              <Text style={styles.label}>Endereço</Text>
              <Text style={styles.texto}>📍 {ponto.endereco}</Text>

              <Text style={styles.label}>Dias e horários</Text>
              <Text style={styles.texto}>🕐 {ponto.horario}</Text>

              <Text style={styles.label}>O que recebe/distribui</Text>
              <Text style={styles.texto}>{ponto.recebeDistribui}</Text>

              <Text style={styles.label}>Coordenadas geográficas</Text>
              <Text style={styles.texto}>
                🌐 Lat: {ponto.latitude.toFixed(4)}, Long: {ponto.longitude.toFixed(4)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type DetalhePontoProps = DetalhePontoScreenProps;
