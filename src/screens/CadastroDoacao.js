import React, { useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {
  salvarDoacao,
  atualizarDoacao,
} from '../storage/doacoesStorage';

import styles from '../styles/styles';

export default function CadastroDoacao({
  voltar,
  doacaoParaEditar = null,
}) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');

  const [erroQuantidade, setErroQuantidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  const modoEdicao = doacaoParaEditar !== null;

  useEffect(() => {
    if (doacaoParaEditar) {
      setTipoItem(doacaoParaEditar.tipoItem || '');
      setQuantidade(doacaoParaEditar.quantidade || '');
      setPontoDestino(doacaoParaEditar.pontoDestino || '');
    } else {
      setTipoItem('');
      setQuantidade('');
      setPontoDestino('');
    }
  }, [doacaoParaEditar]);

  function alterarQuantidade(texto) {
    setQuantidade(texto);
    setMensagem('');

    if (texto !== '' && !/^\d+$/.test(texto)) {
      setErroQuantidade(
        'A quantidade deve conter apenas números.'
      );
    } else {
      setErroQuantidade('');
    }
  }

  async function salvar() {
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
      setErroQuantidade(
        'A quantidade deve conter apenas números.'
      );
      return;
    }

    if (!pontoDestino.trim()) {
      setMensagem('Informe o ponto de destino.');
      return;
    }

    const dadosDoacao = {
      tipoItem: tipoItem.trim(),
      quantidade: quantidade.trim(),
      pontoDestino: pontoDestino.trim(),
    };

    if (modoEdicao) {
      const doacaoAtualizada = {
        ...doacaoParaEditar,
        ...dadosDoacao,
      };

      const atualizada = await atualizarDoacao(
        doacaoAtualizada
      );

      if (atualizada) {
        setMensagem(
          'Doação atualizada com sucesso!'
        );

        setTimeout(() => {
          voltar(doacaoAtualizada);
        }, 500);
      } else {
        setMensagem(
          'Não foi possível atualizar a doação.'
        );
      }

      return;
    }

    const doacaoSalva = await salvarDoacao(
      dadosDoacao
    );

    if (doacaoSalva) {
      setMensagem(
        'Doação cadastrada e salva com sucesso!'
      );

      setTipoItem('');
      setQuantidade('');
      setPontoDestino('');
      setErroQuantidade('');
    } else {
      setMensagem(
        'Não foi possível salvar a doação.'
      );
    }
  }

  function cancelar() {
    setMensagem('');
    setErroQuantidade('');
    voltar();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.detalheContainer
        }
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={cancelar}
        >
          <Text style={styles.textoVoltar}>
            ← Cancelar
          </Text>
        </TouchableOpacity>

        <Text style={styles.nomeDetalhe}>
          {modoEdicao
            ? 'Editar doação'
            : 'Cadastrar doação'}
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
          onPress={salvar}
        >
          <Text style={styles.textoBotao}>
            {modoEdicao
              ? 'Salvar alterações'
              : 'Cadastrar doação'}
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