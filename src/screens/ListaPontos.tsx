import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { ListaPontosScreenProps } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { listarPontos } from '../services/pontosService';
import { carregarBusca, salvarBusca } from '../services/doacoesStorage';
import styles from '../styles/styles';

export default function ListaPontos({ navigation }: ListaPontosScreenProps) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDadosDaApi = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const resposta = await listarPontos({ size: 50 });
      setPontos(resposta.content || []);
    } catch (err) {
      console.log('Erro ao carregar pontos da API:', err);
      setErro(
        'Não foi possível conectar ao servidor da API. Verifique se o serviço Spring Boot está rodando em http://localhost:8080 (ou 10.0.2.2:8080 no Android) e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    async function inicializarBusca() {
      const buscaSalva = await carregarBusca();
      setBusca(buscaSalva);
    }

    inicializarBusca();
    carregarDadosDaApi();
  }, [carregarDadosDaApi]);

  useEffect(() => {
    salvarBusca(busca);
  }, [busca]);

  const pontosFiltrados = pontos.filter((ponto) => {
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
        data={erro ? [] : pontosFiltrados}
        keyExtractor={(item: Ponto) => String(item.id)}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>Instituto Mão Amiga</Text>

            <Text style={styles.subtitulo}>
              Pontos de coleta e distribuição
            </Text>

            <TouchableOpacity
              style={styles.botaoCadastrar}
              onPress={() => navigation.navigate('CadastroDoacao')}
            >
              <Text style={styles.textoBotao}>Cadastrar doação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoHistorico}
              onPress={() => navigation.navigate('HistoricoDoacoes')}
            >
              <Text style={styles.textoBotao}>Minhas doações</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Buscar ponto..."
              placeholderTextColor="#888"
              value={busca}
              onChangeText={(texto: string) => setBusca(texto)}
            />

            {carregando && (
              <View style={styles.carregandoContainer}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.carregandoTexto}>
                  Carregando pontos da API...
                </Text>
              </View>
            )}

            {erro !== null && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTitulo}>Erro de Conexão com a API</Text>
                <Text style={styles.erroMensagem}>{erro}</Text>
                <TouchableOpacity
                  style={styles.botaoTentarNovamente}
                  onPress={carregarDadosDaApi}
                >
                  <Text style={styles.textoBotaoTentarNovamente}>
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!carregando && !erro && (
              <Text style={styles.resultados}>
                {pontosFiltrados.length} ponto(s) encontrado(s)
              </Text>
            )}
          </View>
        }
        renderItem={({ item }: { item: Ponto }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('DetalhePonto', { id: item.id })
            }
            activeOpacity={0.7}
          >
            <Text style={styles.nome}>{item.nome}</Text>

            <Text style={styles.endereco}>📍 {item.endereco}</Text>

            <Text style={styles.horario}>🕐 {item.horario}</Text>

            <Text style={styles.verDetalhes}>Toque para ver detalhes →</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !carregando && !erro ? (
            <View style={styles.semResultados}>
              <Text style={styles.semResultadosTexto}>
                Nenhum ponto encontrado.
              </Text>

              <Text style={styles.semResultadosSubtexto}>
                Tente pesquisar por outro nome, endereço ou tipo de doação.
              </Text>
            </View>
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
}
