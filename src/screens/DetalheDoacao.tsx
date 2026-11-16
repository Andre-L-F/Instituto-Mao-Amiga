import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { DetalheDoacaoScreenProps } from '../types/navigation';
import type { Doacao } from '../types/doacao';
import { buscarPorId, excluir, ApiError } from '../services/doacoesService';
import styles from '../styles/styles';

export default function DetalheDoacao({
  route,
  navigation,
}: DetalheDoacaoScreenProps) {
  const { id } = route.params;

  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDoacao = useCallback(async () => {
    if (!id) {
      setNaoEncontrado(true);
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setNaoEncontrado(false);
    setErro(null);

    try {
      const doacaoBuscada = await buscarPorId(id);
      setDoacao(doacaoBuscada);
    } catch (err: unknown) {
      console.log('Erro ao buscar doação por id na API:', err);
      if (err instanceof ApiError && err.status === 404) {
        setNaoEncontrado(true);
      } else {
        setErro('Não foi possível conectar ao servidor da API. Verifique a conexão.');
      }
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarDoacao();

    const unsubscribe = navigation.addListener('focus', () => {
      carregarDoacao();
    });

    return unsubscribe;
  }, [navigation, carregarDoacao]);

  const confirmarExclusao = () => {
    if (!doacao) return;

    Alert.alert(
      'Excluir doação',
      `Tem certeza que deseja excluir a doação de ${doacao.quantidade}x "${doacao.tipoItem}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setExcluindo(true);
            try {
              await excluir(doacao.id);
              Alert.alert('Sucesso', 'Doação excluída com sucesso!');
              navigation.goBack();
            } catch (err: unknown) {
              console.log('Erro ao excluir doação na API:', err);
              Alert.alert(
                'Erro',
                'Não foi possível excluir a doação na API. Verifique a conexão com o servidor.'
              );
            } finally {
              setExcluindo(false);
            }
          },
        },
      ]
    );
  };

  if (carregando) {
    return (
      <View style={[styles.container, styles.detalheContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={[styles.texto, { marginTop: 12 }]}>Carregando dados da doação...</Text>
      </View>
    );
  }

  if (naoEncontrado) {
    return (
      <View style={[styles.container, styles.detalheContainer]}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.semResultados}>
          <Text style={styles.semResultadosTexto}>Doação não encontrada</Text>
          <Text style={styles.semResultadosSubtexto}>
            A doação solicitada não foi localizada no sistema da API ou pode ter sido excluída.
          </Text>
        </View>
      </View>
    );
  }

  if (erro || !doacao) {
    return (
      <View style={[styles.container, styles.detalheContainer]}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.semResultados}>
          <Text style={styles.semResultadosTexto}>Erro de conexão</Text>
          <Text style={styles.semResultadosSubtexto}>{erro}</Text>
          <TouchableOpacity
            style={styles.botaoCadastrar}
            onPress={carregarDoacao}
          >
            <Text style={styles.textoBotao}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const data = new Date(doacao.criadoEm);
  const dataFormatada = !isNaN(data.getTime())
    ? data.toLocaleString('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : doacao.criadoEm;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.detalheContainer}
      >
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.nomeDetalhe}>Detalhe da doação</Text>

        <Text style={styles.label}>Tipo do item</Text>
        <Text style={styles.texto}>{doacao.tipoItem}</Text>

        <Text style={styles.label}>Quantidade</Text>
        <Text style={styles.texto}>{doacao.quantidade}</Text>

        <Text style={styles.label}>Ponto de destino</Text>
        <Text style={styles.texto}>{doacao.pontoDestino}</Text>

        <Text style={styles.label}>Data do registro</Text>
        <Text style={styles.texto}>{dataFormatada}</Text>

        <TouchableOpacity
          style={styles.botaoCadastrar}
          onPress={() =>
            navigation.navigate('CadastroDoacao', { doacaoParaEditar: doacao })
          }
        >
          <Text style={styles.textoBotao}>Editar doação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoExcluir, excluindo && { opacity: 0.6 }]}
          onPress={confirmarExclusao}
          disabled={excluindo}
        >
          {excluindo ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotao}>Excluir doação</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
