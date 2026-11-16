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
import { buscarPagina } from '../services/pontosService';
import { carregarBusca, salvarBusca } from '../services/doacoesStorage';
import styles from '../styles/styles';

const ITENS_POR_PAGINA = 10;

export default function ListaPontos({ navigation }: ListaPontosScreenProps) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [busca, setBusca] = useState('');
  const [carregandoPrimeiraPagina, setCarregandoPrimeiraPagina] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);

  const buscaInicialCarregada = useRef(false);

  // Busca a primeira página de dados pela API com filtro
  const carregarPrimeiraPagina = useCallback(async (termoBusca: string) => {
    setCarregandoPrimeiraPagina(true);
    setErro(null);
    setPaginaAtual(0);

    try {
      const resposta = await buscarPagina({
        filtro: termoBusca,
        page: 0,
        size: ITENS_POR_PAGINA,
      });

      setPontos(resposta.content || []);
      setPaginaAtual(resposta.page?.number ?? 0);
      setTotalPaginas(resposta.page?.totalPages ?? 1);
      setTotalElementos(resposta.page?.totalElements ?? (resposta.content?.length || 0));
    } catch (err) {
      console.log('Erro ao carregar pontos da API:', err);
      setErro(
        'Não foi possível conectar ao servidor da API. Verifique se o backend Spring Boot está ativo em http://localhost:8080 (ou IP da rede local) e tente novamente.'
      );
    } finally {
      setCarregandoPrimeiraPagina(false);
    }
  }, []);

  // Carrega mais itens (próxima página) com rolagem infinita
  const carregarMaisItens = useCallback(async () => {
    if (carregandoPrimeiraPagina || carregandoMais) return;
    if (paginaAtual + 1 >= totalPaginas) return;

    setCarregandoMais(true);

    try {
      const proximaPagina = paginaAtual + 1;
      const resposta = await buscarPagina({
        filtro: busca,
        page: proximaPagina,
        size: ITENS_POR_PAGINA,
      });

      setPontos((atuais) => [...atuais, ...(resposta.content || [])]);
      setPaginaAtual(resposta.page?.number ?? proximaPagina);
      setTotalPaginas(resposta.page?.totalPages ?? totalPaginas);
    } catch (err) {
      console.log('Erro ao carregar mais páginas da API:', err);
    } finally {
      setCarregandoMais(false);
    }
  }, [carregandoPrimeiraPagina, carregandoMais, paginaAtual, totalPaginas, busca]);

  // Inicialização com busca salva
  useEffect(() => {
    async function inicializar() {
      const buscaSalva = await carregarBusca();
      if (buscaSalva) {
        setBusca(buscaSalva);
        buscaInicialCarregada.current = true;
        carregarPrimeiraPagina(buscaSalva);
      } else {
        buscaInicialCarregada.current = true;
        carregarPrimeiraPagina('');
      }
    }

    inicializar();
  }, [carregarPrimeiraPagina]);

  // Atualiza automaticamente a lista quando a tela ganha foco (ao voltar de cadastrar, editar ou excluir)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (buscaInicialCarregada.current) {
        carregarPrimeiraPagina(busca);
      }
    });

    return unsubscribe;
  }, [navigation, busca, carregarPrimeiraPagina]);

  // Busca com debounce a cada alteração no texto
  useEffect(() => {
    if (!buscaInicialCarregada.current) return;

    salvarBusca(busca);

    const timer = setTimeout(() => {
      carregarPrimeiraPagina(busca);
    }, 350);

    return () => clearTimeout(timer);
  }, [busca, carregarPrimeiraPagina]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        style={styles.container}
        data={erro ? [] : pontos}
        keyExtractor={(item: Ponto) => String(item.id)}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        onEndReached={carregarMaisItens}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>Instituto Mão Amiga</Text>

            <Text style={styles.subtitulo}>
              Pontos de coleta e distribuição
            </Text>

            {/* Botão de cadastrar novo ponto na API */}
            <TouchableOpacity
              style={[styles.botaoCadastrar, { backgroundColor: '#1B5E20' }]}
              onPress={() => navigation.navigate('CadastroPonto')}
            >
              <Text style={styles.textoBotao}>+ Cadastrar novo ponto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCadastrar}
              onPress={() => navigation.navigate('CadastroDoacao')}
            >
              <Text style={styles.textoBotao}>+ Cadastrar doação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoHistorico}
              onPress={() => navigation.navigate('HistoricoDoacoes')}
            >
              <Text style={styles.textoBotao}>Minhas doações</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Buscar ponto por nome ou bairro..."
              placeholderTextColor="#888"
              value={busca}
              onChangeText={(texto: string) => setBusca(texto)}
            />

            {carregandoPrimeiraPagina && (
              <View style={styles.carregandoContainer}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.carregandoTexto}>
                  Carregando pontos da API...
                </Text>
              </View>
            )}

            {!carregandoPrimeiraPagina && erro && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTitulo}>API Indisponível</Text>
                <Text style={styles.erroMensagem}>{erro}</Text>
                <TouchableOpacity
                  style={styles.botaoTentarNovamente}
                  onPress={() => carregarPrimeiraPagina(busca)}
                >
                  <Text style={styles.textoBotaoTentarNovamente}>
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!carregandoPrimeiraPagina && !erro && (
              <Text style={styles.resultados}>
                {pontos.length} ponto(s) exibido(s) de {totalElementos} cadastrado(s)
              </Text>
            )}
          </View>
        }
        renderItem={({ item }: { item: Ponto }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('DetalhePonto', { id: item.id })}
            activeOpacity={0.7}
          >
            <Text style={styles.nome}>{item.nome}</Text>

            <Text style={styles.endereco}>
              📍 {item.endereco}{item.bairro ? ` - ${item.bairro}` : ''}
            </Text>

            <Text style={styles.horario}>🕐 {item.horario}</Text>

            {item.tipo ? (
              <Text style={[styles.texto, { color: item.tipo.toLowerCase().includes('coleta') ? '#2E7D32' : '#E65100', fontWeight: '600', marginTop: 4 }]}>
                🏷️ Tipo: {item.tipo}
              </Text>
            ) : null}

            <Text style={styles.verDetalhes}>Toque para ver detalhes →</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          carregandoMais ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator size="small" color="#2E7D32" />
              <Text style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 4 }}>
                Carregando mais pontos...
              </Text>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          !carregandoPrimeiraPagina && !erro ? (
            <View style={styles.semResultados}>
              <Text style={styles.semResultadosTexto}>
                Nenhum ponto encontrado.
              </Text>

              <Text style={styles.semResultadosSubtexto}>
                Tente pesquisar por outro nome ou bairro na API.
              </Text>
            </View>
          ) : undefined
        }
      />
    </KeyboardAvoidingView>
  );
}
