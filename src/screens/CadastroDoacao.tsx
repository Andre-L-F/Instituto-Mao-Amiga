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
import type { Ponto } from '../types/ponto';
import { cadastrar, editar, ApiError } from '../services/doacoesService';
import { listar as listarPontos } from '../services/pontosService';
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
  const [erroPontos, setErroPontos] = useState<string | null>(null);

  const [erroQuantidade, setErroQuantidade] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarPontosDaApi() {
      try {
        setCarregandoPontos(true);
        setErroPontos(null);
        const resposta = await listarPontos();
        setPontosDisponiveis(resposta || []);
      } catch (err) {
        console.log('Erro ao carregar pontos para escolha no cadastro:', err);
        setErroPontos('Não foi possível carregar os pontos da API.');
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

    // Validação no app antes de enviar
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
    const payload = {
      tipoItem: tipoItem.trim(),
      quantidade: quantidadeNumerica,
      pontoDestino: pontoDestino.trim(),
    };

    setSalvando(true);

    try {
      if (modoEdicao && doacaoParaEditar) {
        const doacaoAtualizada = await editar(doacaoParaEditar.id, payload);
        setMensagem('Doação atualizada com sucesso!');
        setTimeout(() => {
          navigation.navigate('DetalheDoacao', { id: doacaoAtualizada.id });
        }, 500);
      } else {
        await cadastrar(payload);
        setMensagem('Doação cadastrada com sucesso na API!');
        setTipoItem('');
        setQuantidade('');
        setPontoDestino('');
        setErroQuantidade('');

        setTimeout(() => {
          navigation.navigate('HistoricoDoacoes');
        }, 600);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.data && typeof err.data === 'object' && 'campos' in err.data) {
          const campos = (err.data as { campos?: Record<string, string> }).campos;
          if (campos) {
            const msgs = Object.values(campos).join('\n');
            setMensagem(`Erro de validação na API:\n${msgs}`);
          } else {
            setMensagem(err.message || 'Erro ao validar dados na API.');
          }
        } else {
          setMensagem(err.message || 'Não foi possível salvar a doação na API.');
        }
      } else {
        setMensagem('Erro inesperado ao conectar com a API.');
      }
      // Mantém o que foi digitado!
    } finally {
      setSalvando(false);
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
          editable={!salvando}
        />

        <Text style={styles.label}>Quantidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 10"
          placeholderTextColor="#888"
          value={quantidade}
          onChangeText={alterarQuantidade}
          keyboardType="numeric"
          editable={!salvando}
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
        ) : erroPontos ? (
          <Text style={[styles.erro, { marginVertical: 6 }]}>{erroPontos}</Text>
        ) : (
          <View style={styles.pontosOpcoesContainer}>
            {pontosDisponiveis.map((ponto) => {
              const selecionado = pontoDestino === ponto.nome;
              return (
                <TouchableOpacity
                  key={String(ponto.id)}
                  style={[
                    styles.pontoChip,
                    selecionado && styles.pontoChipSelecionado,
                  ]}
                  onPress={() => {
                    setPontoDestino(ponto.nome);
                    setMensagem('');
                  }}
                  disabled={salvando}
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
          placeholder="Ou selecione um ponto acima..."
          placeholderTextColor="#888"
          value={pontoDestino}
          onChangeText={(texto: string) => {
            setPontoDestino(texto);
            setMensagem('');
          }}
          editable={!salvando}
        />

        <TouchableOpacity
          style={[styles.botaoCadastrar, salvando && { opacity: 0.6 }]}
          onPress={salvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotao}>
              {modoEdicao ? 'Salvar alterações' : 'Cadastrar doação'}
            </Text>
          )}
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
