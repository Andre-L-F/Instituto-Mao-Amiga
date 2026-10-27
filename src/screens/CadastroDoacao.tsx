import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { CadastroDoacaoScreenProps } from '../types/navigation';
import type { Doacao } from '../types/doacao';
import type { Ponto } from '../types/ponto';
import { salvarDoacao, atualizarDoacao } from '../services/doacoesStorage';
import { listarPontos } from '../services/pontosService';
import styles from '../styles/styles';

export default function CadastroDoacao({
  route,
  navigation,
}: CadastroDoacaoScreenProps) {
  const doacaoParaEditar = route.params?.doacaoParaEditar ?? null;
  const modoEdicao = doacaoParaEditar !== null;

  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');

  const [pontosDisponiveis, setPontosDisponiveis] = useState<Ponto[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);

  const [erroQuantidade, setErroQuantidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarPontosDaApi() {
      try {
        setCarregandoPontos(true);
        const resposta = await listarPontos({ size: 50 });
        setPontosDisponiveis(resposta.content || []);
      } catch (err) {
        console.log('Erro ao carregar pontos para escolha no cadastro:', err);
      } finally {
        setCarregandoPontos(false);
      }
    }

    carregarPontosDaApi();
  }, []);

  useEffect(() => {
    if (doacaoParaEditar) {
      setTipoItem(doacaoParaEditar.tipoItem || '');
      setQuantidade(
        doacaoParaEditar.quantidade ? String(doacaoParaEditar.quantidade) : ''
      );
      setPontoDestino(doacaoParaEditar.pontoDestino || '');
    } else {
      setTipoItem('');
      setQuantidade('');
      setPontoDestino('');
    }
  }, [doacaoParaEditar]);

  function alterarQuantidade(texto: string) {
    setQuantidade(texto);
    setMensagem('');

    if (texto !== '' && !/^\d+$/.test(texto)) {
      setErroQuantidade('A quantidade deve conter apenas números.');
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

    if (!/^\d+$/.test(quantidade) || Number(quantidade) <= 0) {
      setErroQuantidade('A quantidade deve ser um número maior que zero.');
      return;
    }

    if (!pontoDestino.trim()) {
      setMensagem('Selecione o ponto de destino.');
      return;
    }

    const quantidadeNumerica = Number(quantidade.trim());

    if (modoEdicao && doacaoParaEditar) {
      const doacaoAtualizada: Doacao = {
        ...doacaoParaEditar,
        tipoItem: tipoItem.trim(),
        quantidade: quantidadeNumerica,
        pontoDestino: pontoDestino.trim(),
      };

      const atualizada = await atualizarDoacao(doacaoAtualizada);

      if (atualizada) {
        setMensagem('Doação atualizada com sucesso!');
        setTimeout(() => {
          navigation.navigate('DetalheDoacao', { doacao: doacaoAtualizada });
        }, 500);
      } else {
        setMensagem('Não foi possível atualizar a doação.');
      }

      return;
    }

    const dadosNovaDoacao = {
      tipoItem: tipoItem.trim(),
      quantidade: quantidadeNumerica,
      pontoDestino: pontoDestino.trim(),
    };

    const doacaoSalva = await salvarDoacao(dadosNovaDoacao);

    if (doacaoSalva) {
      setMensagem('Doação cadastrada e salva com sucesso!');
      setTipoItem('');
      setQuantidade('');
      setPontoDestino('');
      setErroQuantidade('');

      setTimeout(() => {
        navigation.navigate('HistoricoDoacoes');
      }, 700);
    } else {
      setMensagem('Não foi possível salvar a doação.');
    }
  }

  function cancelar() {
    setMensagem('');
    setErroQuantidade('');
    navigation.goBack();
  }

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
        <TouchableOpacity style={styles.botaoVoltar} onPress={cancelar}>
          <Text style={styles.textoVoltar}>← Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.nomeDetalhe}>
          {modoEdicao ? 'Editar doação' : 'Cadastrar doação'}
        </Text>

        <Text style={styles.label}>Tipo do item</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Alimentos não perecíveis"
          placeholderTextColor="#888"
          value={tipoItem}
          onChangeText={(texto: string) => {
            setTipoItem(texto);
            setMensagem('');
          }}
        />

        <Text style={styles.label}>Quantidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 10"
          placeholderTextColor="#888"
          value={quantidade}
          onChangeText={alterarQuantidade}
          keyboardType="numeric"
        />

        {erroQuantidade !== '' && (
          <Text style={styles.erro}>{erroQuantidade}</Text>
        )}

        <Text style={styles.label}>Ponto de destino (da API)</Text>

        {carregandoPontos ? (
          <View style={{ marginVertical: 10 }}>
            <ActivityIndicator size="small" color="#2E7D32" />
            <Text style={[styles.texto, { fontSize: 13, textAlign: 'center' }]}>
              Carregando pontos da API...
            </Text>
          </View>
        ) : (
          <View style={styles.pontosOpcoesContainer}>
            {pontosDisponiveis.map((ponto) => {
              const selecionado = pontoDestino === ponto.nome;
              return (
                <TouchableOpacity
                  key={ponto.id}
                  style={[
                    styles.pontoChip,
                    selecionado && styles.pontoChipSelecionado,
                  ]}
                  onPress={() => {
                    setPontoDestino(ponto.nome);
                    setMensagem('');
                  }}
                >
                  <Text
                    style={[
                      styles.pontoChipTexto,
                      selecionado && styles.pontoChipTextoSelecionado,
                    ]}
                  >
                    📍 {ponto.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Ou digite o nome do ponto..."
          placeholderTextColor="#888"
          value={pontoDestino}
          onChangeText={(texto: string) => {
            setPontoDestino(texto);
            setMensagem('');
          }}
        />

        <TouchableOpacity style={styles.botaoCadastrar} onPress={salvar}>
          <Text style={styles.textoBotao}>
            {modoEdicao ? 'Salvar alterações' : 'Cadastrar doação'}
          </Text>
        </TouchableOpacity>

        {mensagem !== '' && (
          <Text
            style={
              mensagem.includes('sucesso') ? styles.sucesso : styles.erro
            }
          >
            {mensagem}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
