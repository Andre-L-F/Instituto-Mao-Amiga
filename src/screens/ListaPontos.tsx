import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { listarProdutos } from '../services/pontosService';
import { carregarBusca, salvarBusca } from '../services/doacoesStorage';
import styles from '../styles/styles';

export default function ListaPontos({ navigation }: ListaPontosScreenProps) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const buscaInicialCarregada = useRef(false);

  // A tela de listagem busca os produtos na API paginada (/produtos/filtro) e mostra o que vem no content da resposta
  const carregarDadosDaApi = useCallback(async (termoBusca?: string) => {
    setCarregando(true);
    setErro(null);

    try {
      const termo = termoBusca !== undefined ? termoBusca : busca;
      const resposta = await listarProdutos({
        size: 50,
        busca: termo,
      });

      // Mostra o que vem no content da resposta (sem filtro local)
      setPontos(resposta.content || []);
    } catch (err) {
      console.log('Erro ao carregar dados da API:', err);
      setErro(
        'Não foi possível conectar ao servidor da API. Verifique se o serviço Spring Boot está rodando em http://localhost:8080 (ou 10.0.2.2:8080 no Android) e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  // Inicializa com o histórico da busca e realiza o carregamento inicial da API
  useEffect(() => {
    async function inicializar() {
      const buscaSalva = await carregarBusca();
      if (buscaSalva) {
        setBusca(buscaSalva);
        buscaInicialCarregada.current = true;
        carregarDadosDaApi(buscaSalva);
      } else {
        buscaInicialCarregada.current = true;
        carregarDadosDaApi('');
      }
    }

    inicializar();
  }, []);

  // Busca direto na API ao digitar, com debounce (filtro local foi apagado)
  useEffect(() => {
    if (!buscaInicialCarregada.current) return;

    salvarBusca(busca);

    const timer = setTimeout(() => {
      carregarDadosDaApi(busca);
    }, 350);

    return () => clearTimeout(timer);
  }, [busca]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        style={styles.container}
        data={erro ? [] : pontos}
        keyExtractor={(item: Ponto) => item.produtoId || String(item.id)}
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
              placeholder="Buscar na API..."
              placeholderTextColor="#888"
              value={busca}
              onChangeText={(texto: string) => setBusca(texto)}
            />

            {carregando && (
              <View style={styles.carregandoContainer}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.carregandoTexto}>
                  Buscando na API...
                </Text>
              </View>
            )}

            {erro !== null && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTitulo}>Erro de Conexão com a API</Text>
                <Text style={styles.erroMensagem}>{erro}</Text>
                <TouchableOpacity
                  style={styles.botaoTentarNovamente}
                  onPress={() => carregarDadosDaApi(busca)}
                >
                  <Text style={styles.textoBotaoTentarNovamente}>
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!carregando && !erro && (
              <Text style={styles.resultados}>
                {pontos.length} item(ns) retornado(s) da API
              </Text>
            )}
          </View>
        }
        renderItem={({ item }: { item: Ponto }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('DetalhePonto', {
                produtoId: item.produtoId || String(item.id),
                id: item.produtoId || String(item.id),
              })
            }
            activeOpacity={0.7}
          >
            <Text style={styles.nome}>{item.nome}</Text>

            {item.endereco ? (
              <Text style={styles.endereco}>📍 {item.endereco}</Text>
            ) : null}

            {item.horario ? (
              <Text style={styles.horario}>🕐 {item.horario}</Text>
            ) : null}

            <Text style={styles.verDetalhes}>Toque para ver detalhes →</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !carregando && !erro ? (
            <View style={styles.semResultados}>
              <Text style={styles.semResultadosTexto}>
                Nenhum item encontrado.
              </Text>

              <Text style={styles.semResultadosSubtexto}>
                Tente pesquisar por outro termo na API.
              </Text>
            </View>
          ) : undefined
        }
      />
    </KeyboardAvoidingView>
  );
}
