import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const pontosMock = [
  {
    id: '1',
    nome: 'Ponto Central',
    endereco: 'Rua das Flores, 120 - Centro',
    horario: 'Segunda a sexta, das 8h às 17h',
    recebeDistribui:
      'Recebe alimentos não perecíveis e roupas. Distribui cestas básicas e roupas.',
  },
  {
    id: '2',
    nome: 'Ponto Vila Esperança',
    endereco: 'Avenida Esperança, 450 - Vila Esperança',
    horario: 'Terças e quintas, das 9h às 16h',
    recebeDistribui:
      'Recebe alimentos, produtos de higiene e roupas infantis. Distribui alimentos e roupas para famílias cadastradas.',
  },
  {
    id: '3',
    nome: 'Ponto Jardim Novo',
    endereco: 'Rua das Acácias, 85 - Jardim Novo',
    horario: 'Sábados, das 8h às 13h',
    recebeDistribui:
      'Recebe alimentos frescos e roupas. Distribui alimentos e kits de roupas.',
  },
];

const CHAVE_BUSCA = '@compre_bem:ultima_busca';
const CHAVE_DOACAO = '@compre_bem:cadastro_doacao';

export default function App() {
  // Controle da tela atual
  const [tela, setTela] = useState('lista');

  // Ponto selecionado para visualizar os detalhes
  const [pontoSelecionado, setPontoSelecionado] = useState(null);

  // Busca
  const [busca, setBusca] = useState('');

  // Formulário de doação
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');

  const [erroQuantidade, setErroQuantidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  // CARREGAR A ÚLTIMA BUSCA
  useEffect(() => {
    async function carregarBusca() {
      try {
        const buscaSalva = await AsyncStorage.getItem(CHAVE_BUSCA);

        if (buscaSalva !== null) {
          setBusca(buscaSalva);
        }
      } catch (erro) {
        console.log('Erro ao carregar busca:', erro);
      }
    }

    carregarBusca();
  }, []);

  // SALVAR A BUSCA
  useEffect(() => {
    async function salvarBusca() {
      try {
        await AsyncStorage.setItem(CHAVE_BUSCA, busca);
      } catch (erro) {
        console.log('Erro ao salvar busca:', erro);
      }
    }

    salvarBusca();
  }, [busca]);

  // CARREGAR O CADASTRO DE DOAÇÃO
  useEffect(() => {
    async function carregarDoacao() {
      try {
        const doacaoSalva = await AsyncStorage.getItem(CHAVE_DOACAO);

        if (doacaoSalva !== null) {
          const doacao = JSON.parse(doacaoSalva);

          setTipoItem(doacao.tipoItem || '');
          setQuantidade(doacao.quantidade || '');
          setPontoDestino(doacao.pontoDestino || '');
        }
      } catch (erro) {
        console.log('Erro ao carregar doação:', erro);
      }
    }

    carregarDoacao();
  }, []);

  function abrirDetalhe(ponto) {
    setPontoSelecionado(ponto);
    setTela('detalhe');
  }

  // Abre a tela de cadastro
  function abrirCadastro() {
    setTela('cadastro');
  }

  // Volta para a tela principal
  function voltar() {
    setPontoSelecionado(null);
    setTela('lista');
  }

  // VALIDAÇÃO DA QUANTIDADE
  function alterarQuantidade(texto) {
    setQuantidade(texto);
    setMensagem('');

    if (texto !== '' && !/^\d+$/.test(texto)) {
      setErroQuantidade('A quantidade deve conter apenas números.');
    } else {
      setErroQuantidade('');
    }
  }

  // CADASTRAR E SALVAR A DOAÇÃO
  async function cadastrarDoacao() {
    setMensagem('');

    if (!tipoItem.trim()) {
      setMensagem('Informe o tipo do item.');
      return;
    }

    if (!quantidade.trim()) {
      setMensagem('Informe a quantidade.');
      return;
    }

    if (!/^\d+$/.test(quantidade)) {
      setErroQuantidade('A quantidade deve conter apenas números.');
      return;
    }

    if (!pontoDestino.trim()) {
      setMensagem('Informe o ponto de destino.');
      return;
    }

    const doacao = {
      tipoItem,
      quantidade,
      pontoDestino,
    };

    try {
      await AsyncStorage.setItem(
        CHAVE_DOACAO,
        JSON.stringify(doacao)
      );

      setMensagem('Doação cadastrada e salva com sucesso!');
    } catch (erro) {
      console.log('Erro ao salvar doação:', erro);
      setMensagem('Não foi possível salvar a doação.');
    }
  }

  // FILTRO
  const pontosFiltrados = pontosMock.filter((ponto) => {
    const textoBusca = busca.toLowerCase();

    return (
      ponto.nome.toLowerCase().includes(textoBusca) ||
      ponto.endereco.toLowerCase().includes(textoBusca) ||
      ponto.horario.toLowerCase().includes(textoBusca) ||
      ponto.recebeDistribui.toLowerCase().includes(textoBusca)
    );
  });

  // TELA DE CADASTRO
  if (tela === 'cadastro') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.detalheContainer}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => {
              setMensagem('');
              setErroQuantidade('');
              setTela('lista');
            }}
          >
            <Text style={styles.textoVoltar}>
              ← Voltar
            </Text>
          </TouchableOpacity>

          <Text style={styles.nomeDetalhe}>
            Cadastrar doação
          </Text>

          <Text style={styles.label}>
            Tipo do item
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex.: alimentos"
            placeholderTextColor="#888"
            value={tipoItem}
            onChangeText={(texto) => {
              setTipoItem(texto);
              setMensagem('');
            }}
          />

          <Text style={styles.label}>
            Quantidade
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex.: 10"
            placeholderTextColor="#888"
            value={quantidade}
            onChangeText={alterarQuantidade}
            keyboardType="numeric"
          />

          {erroQuantidade !== '' && (
            <Text style={styles.erro}>
              {erroQuantidade}
            </Text>
          )}

          <Text style={styles.label}>
            Ponto de destino
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex.: Ponto Central"
            placeholderTextColor="#888"
            value={pontoDestino}
            onChangeText={(texto) => {
              setPontoDestino(texto);
              setMensagem('');
            }}
          />

          <TouchableOpacity
            style={styles.botaoCadastrar}
            onPress={cadastrarDoacao}
          >
            <Text style={styles.textoBotao}>
              Cadastrar doação
            </Text>
          </TouchableOpacity>

          {mensagem !== '' && (
            <Text
              style={
                mensagem.includes('sucesso')
                  ? styles.sucesso
                  : styles.erro
              }
            >
              {mensagem}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // TELA DE DETALHES
  // ============================================================

  if (tela === 'detalhe' && pontoSelecionado) {
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
              {pontoSelecionado.nome}
            </Text>

            <Text style={styles.label}>
              Endereço
            </Text>

            <Text style={styles.texto}>
              📍 {pontoSelecionado.endereco}
            </Text>

            <Text style={styles.label}>
              Dias e horários
            </Text>

            <Text style={styles.texto}>
              🕐 {pontoSelecionado.horario}
            </Text>

            <Text style={styles.label}>
              O que recebe/distribui
            </Text>

            <Text style={styles.texto}>
              {pontoSelecionado.recebeDistribui}
            </Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ============================================================
  // TELA PRINCIPAL
  // ============================================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        style={styles.container}
        data={pontosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={
          Platform.OS === 'ios' ? 'interactive' : 'on-drag'
        }

        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>
              Instituto Mão Amiga
            </Text>

            <Text style={styles.subtitulo}>
              Pontos de coleta e distribuição
            </Text>

            <TouchableOpacity
              style={styles.botaoCadastrar}
              onPress={() => setTela('cadastro')}
            >
              <Text style={styles.textoBotao}>
                Cadastrar doação
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Buscar ponto..."
              placeholderTextColor="#888"
              value={busca}
              onChangeText={setBusca}
            />

            <Text style={styles.resultados}>
              {pontosFiltrados.length} ponto(s) encontrado(s)
            </Text>
          </View>
        }

        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => abrirDetalhe(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.nome}>
              {item.nome}
            </Text>

            <Text style={styles.endereco}>
              📍 {item.endereco}
            </Text>

            <Text style={styles.horario}>
              🕐 {item.horario}
            </Text>

            <Text style={styles.verDetalhes}>
              Toque para ver detalhes →
            </Text>
          </TouchableOpacity>
        )}

        ListEmptyComponent={
          <View style={styles.semResultados}>
            <Text style={styles.semResultadosTexto}>
              Nenhum ponto encontrado.
            </Text>

            <Text style={styles.semResultadosSubtexto}>
              Tente pesquisar por outro nome, endereço ou tipo de doação.
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
      data={pontosFiltrados}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}

      ListHeaderComponent={
        <View>

          <Text style={styles.titulo}>
            Instituto Mão Amiga
          </Text>

          <Text style={styles.subtitulo}>
            Pontos de coleta e distribuição
          </Text>

          {/* BOTÃO PARA CADASTRAR DOAÇÃO */}

          <TouchableOpacity
            style={styles.botaoCadastrar}
            onPress={abrirCadastro}
          >
            <Text style={styles.textoBotaoCadastrar}>
              + Cadastrar doação
            </Text>
          </TouchableOpacity>

          {/* CAMPO DE BUSCA */}

          <TextInput
            style={styles.input}
            placeholder="Buscar ponto..."
            placeholderTextColor="#888"
            value={busca}
            onChangeText={setBusca}
          />

          <Text style={styles.resultados}>
            {pontosFiltrados.length} ponto(s) encontrado(s)
          </Text>

        </View>
      }

      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => abrirDetalhe(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.nome}>
            {item.nome}
          </Text>

          <Text style={styles.endereco}>
            📍 {item.endereco}
          </Text>

          <Text style={styles.horario}>
            🕐 {item.horario}
          </Text>

          <Text style={styles.verDetalhes}>
            Toque para ver detalhes →
          </Text>
        </TouchableOpacity>
      )}

      ListEmptyComponent={
        <View style={styles.semResultados}>

          <Text style={styles.semResultadosTexto}>
            Nenhum ponto encontrado.
          </Text>

          <Text style={styles.semResultadosSubtexto}>
            Tente pesquisar por outro nome, endereço ou tipo de
            doação.
          </Text>

        </View>
      }
    />
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: 20,
    paddingTop: 50,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 6,
  },

  subtitulo: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 20,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F9FFF8',
    marginBottom: 10,
  },

  inputErro: {
    borderColor: '#D32F2F',
  },

  erro: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
  },

  resultados: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },

  item: {
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  nome: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },

  endereco: {
    fontSize: 14,
    color: '#444444',
    marginTop: 4,
  },

  horario: {
    fontSize: 14,
    color: '#555555',
    marginTop: 6,
  },

  verDetalhes: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 10,
  },

  semResultados: {
    alignItems: 'center',
    padding: 30,
  },

  semResultadosTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
  },

  semResultadosSubtexto: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginTop: 8,
  },

  detalheContainer: {
    padding: 20,
    paddingTop: 50,
  },

  botaoVoltar: {
    marginBottom: 20,
  },

  textoVoltar: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  nomeDetalhe: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 6,
  },

  texto: {
    fontSize: 16,
    color: '#555555',
    lineHeight: 24,
  },

  botaoCadastrar: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  erro: {
    color: '#C62828',
    fontSize: 14,
    marginBottom: 10,
  },

  sucesso: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
