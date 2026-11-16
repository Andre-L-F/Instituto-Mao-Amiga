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

import type { HistoricoDoacoesScreenProps } from '../types/navigation';
import type { Doacao } from '../types/doacao';
import { buscarPagina, ApiError } from '../services/doacoesService';
import ItemDoacao from '../components/ItemDoacao';
import styles from '../styles/styles';

const ITENS_POR_PAGINA = 10;

export default function HistoricoDoacoes({
  navigation,
}: HistoricoDoacoesScreenProps) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [busca, setBusca] = useState('');
  const [carregandoPrimeiraPagina, setCarregandoPrimeiraPagina] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalElementos, setTotalElementos] = useState(0);

  const buscaInicialCarregada = useRef(false);

  // Busca a primeira página de doações na API com filtro por tipo de item
  const carregarPrimeiraPagina = useCallback(async (termoBusca: string) => {
    try {
      setCarregandoPrimeiraPagina(true);
      setErro(null);

      const resposta = await buscarPagina({
        filtro: termoBusca.trim() || undefined,
        page: 0,
        size: ITENS_POR_PAGINA,
        sort: 'criadoEm,desc',
      });

      setDoacoes(resposta.content || []);
      setPaginaAtual(resposta.page?.number ?? 0);
      setTotalPaginas(resposta.page?.totalPages ?? 1);
      setTotalElementos(resposta.page?.totalElements ?? (resposta.content?.length || 0));
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 0) {
        setErro('Não foi possível conectar ao servidor. Verifique se a API está em execução.');
      } else {
        setErro('Erro ao carregar o histórico de doações da API.');
      }
      setDoacoes([]);
    } finally {
      setCarregandoPrimeiraPagina(false);
    }
  }, []);

  // Recarrega ao focar na tela para que novas doações apareçam no topo
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarPrimeiraPagina(busca);
    });

    return unsubscribe;
  }, [navigation, busca, carregarPrimeiraPagina]);

  // Busca inicial
  useEffect(() => {
    if (!buscaInicialCarregada.current) {
      buscaInicialCarregada.current = true;
      carregarPrimeiraPagina('');
    }
  }, [carregarPrimeiraPagina]);

  // Carrega mais itens (rolagem infinita)
  const carregarMaisItens = async () => {
    if (carregandoMais || carregandoPrimeiraPagina) {
      return;
    }

    const proximaPagina = paginaAtual + 1;
    if (proximaPagina >= totalPaginas) {
      return; // Já estamos na última página
    }

    try {
      setCarregandoMais(true);
      const resposta = await buscarPagina({
        filtro: busca.trim() || undefined,
        page: proximaPagina,
        size: ITENS_POR_PAGINA,
        sort: 'criadoEm,desc',
      });

      if (resposta.content && resposta.content.length > 0) {
        setDoacoes((prev) => {
          const existentes = new Set(prev.map((d) => d.id));
          const novos = resposta.content.filter((d) => !existentes.has(d.id));
          return [...prev, ...novos];
        });
        setPaginaAtual(resposta.page?.number ?? proximaPagina);
        setTotalPaginas(resposta.page?.totalPages ?? totalPaginas);
        setTotalElementos(resposta.page?.totalElements ?? totalElementos);
      }
    } catch (err) {
      console.log('Erro ao carregar mais doações da API:', err);
    } finally {
      setCarregandoMais(false);
    }
  };

  function aoDigitarBusca(texto: string) {
    setBusca(texto);
    carregarPrimeiraPagina(texto);
  }

  function limparBusca() {
    setBusca('');
    carregarPrimeiraPagina('');
  }

  const renderItem = ({ item }: { item: Doacao }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('DetalheDoacao', { id: item.id, doacao: item })
      }
    >
      <ItemDoacao doacao={item} />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!carregandoMais) return null;
    return (
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#2E7D32" />
        <Text style={[styles.texto, { fontSize: 12, marginTop: 4 }]}>
          Carregando mais doações...
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.nomeDetalhe}>Minhas doações (API)</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Filtrar por tipo de item..."
          placeholderTextColor="#888"
          value={busca}
          onChangeText={aoDigitarBusca}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {busca !== '' && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 12,
              padding: 6,
            }}
            onPress={limparBusca}
          >
            <Text style={{ fontSize: 16, color: '#888', fontWeight: 'bold' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 8,
        }}
      >
        <Text style={styles.resultados}>
          {totalElementos} doação(ões) encontrada(s)
          {totalPaginas > 1 && ` • pág. ${paginaAtual + 1} de ${totalPaginas}`}
        </Text>

        <TouchableOpacity
          style={[styles.botaoCadastrar, { paddingHorizontal: 12, paddingVertical: 8, height: 40, marginTop: 0 }]}
          onPress={() => navigation.navigate('CadastroDoacao')}
        >
          <Text style={[styles.textoBotao, { fontSize: 14 }]}>+ Nova doação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {carregandoPrimeiraPagina ? (
        <View style={styles.detalheContainer}>
          {renderHeader()}
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={[styles.texto, { marginTop: 12 }]}>
              Carregando doações da API...
            </Text>
          </View>
        </View>
      ) : erro ? (
        <View style={styles.detalheContainer}>
          {renderHeader()}
          <View style={styles.semResultados}>
            <Text style={styles.semResultadosTexto}>Erro de conexão</Text>
            <Text style={styles.semResultadosSubtexto}>{erro}</Text>
            <TouchableOpacity
              style={styles.botaoCadastrar}
              onPress={() => carregarPrimeiraPagina(busca)}
            >
              <Text style={styles.textoBotao}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={doacoes}
          keyExtractor={(item: Doacao) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={carregarMaisItens}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <View style={styles.semResultados}>
              <Text style={styles.semResultadosTexto}>
                Nenhuma doação encontrada.
              </Text>
              <Text style={styles.semResultadosSubtexto}>
                {busca
                  ? `Nenhuma doação cadastrada com o tipo "${busca}".`
                  : 'Nenhuma doação foi registrada ainda no servidor.'}
              </Text>
              <TouchableOpacity
                style={styles.botaoCadastrar}
                onPress={() => navigation.navigate('CadastroDoacao')}
              >
                <Text style={styles.textoBotao}>Cadastrar primeira doação</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}
