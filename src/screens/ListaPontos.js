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

import { listarProdutos } from '../services/pontosService';
import { carregarBusca, salvarBusca } from '../storage/storage';
import styles from '../styles/styles';

export default function ListaPontos({
  navigation,
  abrirDetalhe,
  abrirCadastro,
  abrirHistorico,
}) {
  const [pontos, setPontos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const buscaInicialCarregada = useRef(false);

  // A tela de listagem busca os produtos na API paginada (/produtos/filtro) e mostra o que vem no content da resposta
  const carregarDadosDaApi = useCallback(async (termoBusca) => {
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
      console.log('Erro ao carregar da API:', err);
      setErro('Não foi possível conectar ao servidor da API.');
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  useEffect(() => {
    async function buscarBuscaSalva() {
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

    buscarBuscaSalva();
  }, []);

  // Busca na API paginada ao digitar, com debounce (filtro local foi removido)
  useEffect(() => {
    if (!buscaInicialCarregada.current) return;

    salvarBusca(busca);

    const timer = setTimeout(() => {
      carregarDadosDaApi(busca);
    }, 350);

    return () => clearTimeout(timer);
  }, [busca]);

  const handleAbrirDetalhe = (item) => {
    if (navigation) {
      navigation.navigate('DetalhePonto', {
        produtoId: item.produtoId || String(item.id),
        id: item.produtoId || String(item.id),
      });
    } else if (abrirDetalhe) {
      abrirDetalhe(item);
    }
  };

  const handleAbrirCadastro = () => {
    if (navigation) {
      navigation.navigate('CadastroDoacao');
    } else if (abrirCadastro) {
      abrirCadastro();
    }
  };

  const handleAbrirHistorico = () => {
    if (navigation) {
      navigation.navigate('HistoricoDoacoes');
    } else if (abrirHistorico) {
      abrirHistorico();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        style={styles.container}
        data={erro ? [] : pontos}
        keyExtractor={(item) => item.produtoId || String(item.id)}
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
              onPress={handleAbrirCadastro}
            >
              <Text style={styles.textoBotao}>Cadastrar doação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoHistorico}
              onPress={handleAbrirHistorico}
            >
              <Text style={styles.textoBotao}>Minhas doações</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Buscar ponto..."
              placeholderTextColor="#888"
              value={busca}
              onChangeText={setBusca}
            />

            {carregando && (
              <View style={styles.carregandoContainer}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.carregandoTexto}>
                  Carregando da API...
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
                {pontos.length} item(ns) encontrado(s)
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleAbrirDetalhe(item)}
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
                Nenhum ponto encontrado.
              </Text>

              <Text style={styles.semResultadosSubtexto}>
                Tente pesquisar por outro nome, endereço ou tipo de doação.
              </Text>
            </View>
          ) : undefined
        }
      />
    </KeyboardAvoidingView>
  );
}
