import React, { useState } from 'react';

import {
  FlatList,
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

export default function App() {
  // Controle da tela atual
  const [tela, setTela] = useState('lista');

  // Ponto selecionado para visualizar os detalhes
  const [pontoSelecionado, setPontoSelecionado] = useState(null);

  // Texto digitado no filtro
  const [busca, setBusca] = useState('');

  // Campos do formulário de doação
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');

  // Mensagem de erro da quantidade
  const [erroQuantidade, setErroQuantidade] = useState('');

  // Abre a tela de detalhes
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

  // Validação da quantidade
  function alterarQuantidade(texto) {
    setQuantidade(texto);

    // Se o campo estiver vazio, remove o erro
    if (texto === '') {
      setErroQuantidade('');
      return;
    }

    // Verifica se contém somente números
    if (!/^\d+$/.test(texto)) {
      setErroQuantidade(
        'A quantidade deve conter apenas números.'
      );
    } else {
      setErroQuantidade('');
    }
  }

  // Validação e envio do formulário
  function cadastrarDoacao() {
    // Verifica se todos os campos foram preenchidos
    if (!tipoItem || !quantidade || !pontoDestino) {
      return;
    }

    // Verifica novamente se a quantidade contém apenas números
    if (!/^\d+$/.test(quantidade)) {
      setErroQuantidade(
        'A quantidade deve conter apenas números.'
      );
      return;
    }

    /*
      Nesta atividade os dados não serão salvos.

      O objetivo é somente construir o formulário
      e fazer a validação dos campos.

      O salvamento ficará para uma atividade futura.
    */

    alert('Doação cadastrada com sucesso!');

    // Limpa o formulário
    setTipoItem('');
    setQuantidade('');
    setPontoDestino('');
    setErroQuantidade('');

    // Volta para a tela principal
    setTela('lista');
  }

  // Filtro dos pontos
  const pontosFiltrados = pontosMock.filter((ponto) => {
    const textoBusca = busca.toLowerCase();

    return (
      ponto.nome.toLowerCase().includes(textoBusca) ||
      ponto.endereco.toLowerCase().includes(textoBusca) ||
      ponto.horario.toLowerCase().includes(textoBusca) ||
      ponto.recebeDistribui.toLowerCase().includes(textoBusca)
    );
  });

  // ============================================================
  // TELA DE CADASTRO
  // ============================================================

  if (tela === 'cadastro') {
    return (
      <ScrollView style={styles.container}>
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
            Cadastro de doação
          </Text>

          <Text style={styles.label}>
            Tipo do item
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex.: alimentos, roupas, higiene"
            placeholderTextColor="#888"
            value={tipoItem}
            onChangeText={setTipoItem}
          />

          <Text style={styles.label}>
            Quantidade
          </Text>

          <TextInput
            style={[
              styles.input,
              erroQuantidade !== '' && styles.inputErro,
            ]}
            placeholder="Digite a quantidade"
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
            onChangeText={setPontoDestino}
          />

          <TouchableOpacity
            style={[
              styles.botaoCadastrar,
              (
                !tipoItem ||
                !quantidade ||
                !pontoDestino ||
                erroQuantidade !== ''
              ) && styles.botaoDesabilitado,
            ]}
            onPress={cadastrarDoacao}
            disabled={
              !tipoItem ||
              !quantidade ||
              !pontoDestino ||
              erroQuantidade !== ''
            }
          >
            <Text style={styles.textoBotaoCadastrar}>
              Cadastrar doação
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    );
  }

  // ============================================================
  // TELA DE DETALHES
  // ============================================================

  if (tela === 'detalhe' && pontoSelecionado) {
    return (
      <ScrollView style={styles.container}>
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
    );
  }

  // ============================================================
  // TELA PRINCIPAL
  // ============================================================

  return (
    <FlatList
      style={styles.container}
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
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  textoBotaoCadastrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoDesabilitado: {
    backgroundColor: '#A5D6A7',
  },
});