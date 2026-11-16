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

import type { CadastroPontoScreenProps } from '../types/navigation';
import { cadastrar, editar, ApiError } from '../services/pontosService';
import styles from '../styles/styles';

export default function CadastroPonto({
  route,
  navigation,
}: CadastroPontoScreenProps) {
  const pontoParaEditar = route.params?.pontoParaEditar ?? null;
  const modoEdicao = pontoParaEditar !== null;

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [horario, setHorario] = useState('');
  const [tipo, setTipo] = useState<'coleta' | 'distribuição'>('coleta');

  const [salvando, setSalvando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    if (pontoParaEditar) {
      setNome(pontoParaEditar.nome || '');
      setEndereco(pontoParaEditar.endereco || '');
      setBairro(pontoParaEditar.bairro || '');
      setHorario(pontoParaEditar.horario || '');
      const tipoLower = (pontoParaEditar.tipo || '').toLowerCase();
      setTipo(tipoLower.includes('distribui') ? 'distribuição' : 'coleta');
    } else {
      setNome('');
      setEndereco('');
      setBairro('');
      setHorario('');
      setTipo('coleta');
    }
  }, [pontoParaEditar]);

  const validarCampos = (): boolean => {
    if (!nome.trim()) {
      setMensagemErro('O nome do ponto é obrigatório.');
      return false;
    }
    if (!endereco.trim()) {
      setMensagemErro('O endereço é obrigatório.');
      return false;
    }
    if (!bairro.trim()) {
      setMensagemErro('O bairro é obrigatório.');
      return false;
    }
    if (!horario.trim()) {
      setMensagemErro('O horário de funcionamento é obrigatório.');
      return false;
    }
    if (!tipo) {
      setMensagemErro('Selecione o tipo do ponto (coleta ou distribuição).');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    setMensagemErro('');
    setMensagemSucesso('');

    if (!validarCampos()) {
      return;
    }

    setSalvando(true);

    const dadosPonto = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      horario: horario.trim(),
      tipo,
    };

    try {
      if (modoEdicao && pontoParaEditar) {
        await editar(pontoParaEditar.id, dadosPonto);
        setMensagemSucesso('Ponto atualizado com sucesso!');
        setTimeout(() => {
          navigation.goBack();
        }, 600);
      } else {
        await cadastrar(dadosPonto);
        setMensagemSucesso('Ponto cadastrado com sucesso!');
        setTimeout(() => {
          navigation.goBack();
        }, 600);
      }
    } catch (err: unknown) {
      console.log('Erro ao salvar ponto na API:', err);
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setMensagemErro('A API recusou o cadastro (HTTP 400): verifique se todos os campos estão preenchidos corretamente.');
        } else {
          setMensagemErro(`Erro no servidor (${err.status}): ${err.message}`);
        }
      } else {
        setMensagemErro('Servidor da API indisponível. Verifique se o backend está ativo e tente novamente.');
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.detalheContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVoltar}>← Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.nomeDetalhe}>
          {modoEdicao ? 'Editar ponto de coleta' : 'Cadastrar ponto de coleta'}
        </Text>

        <Text style={styles.label}>Nome do ponto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Ponto Setor Sul"
          placeholderTextColor="#888"
          value={nome}
          onChangeText={(texto) => {
            setNome(texto);
            setMensagemErro('');
          }}
        />

        <Text style={styles.label}>Endereço completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Rua 84, 520"
          placeholderTextColor="#888"
          value={endereco}
          onChangeText={(texto) => {
            setEndereco(texto);
            setMensagemErro('');
          }}
        />

        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Setor Sul"
          placeholderTextColor="#888"
          value={bairro}
          onChangeText={(texto) => {
            setBairro(texto);
            setMensagemErro('');
          }}
        />

        <Text style={styles.label}>Dias e horários</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Seg a Sex, 8h às 17h"
          placeholderTextColor="#888"
          value={horario}
          onChangeText={(texto) => {
            setHorario(texto);
            setMensagemErro('');
          }}
        />

        <Text style={styles.label}>Tipo de ponto</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            style={[
              styles.pontoChip,
              { flex: 1, paddingVertical: 12, alignItems: 'center' },
              tipo === 'coleta' && styles.pontoChipSelecionado,
            ]}
            onPress={() => setTipo('coleta')}
          >
            <Text
              style={[
                styles.pontoChipTexto,
                tipo === 'coleta' && styles.pontoChipTextoSelecionado,
              ]}
            >
              📥 Ponto de Coleta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pontoChip,
              { flex: 1, paddingVertical: 12, alignItems: 'center' },
              tipo === 'distribuição' && styles.pontoChipSelecionado,
            ]}
            onPress={() => setTipo('distribuição')}
          >
            <Text
              style={[
                styles.pontoChipTexto,
                tipo === 'distribuição' && styles.pontoChipTextoSelecionado,
              ]}
            >
              📤 Distribuição
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.botaoCadastrar}
          onPress={handleSalvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotao}>
              {modoEdicao ? 'Salvar alterações' : 'Cadastrar ponto'}
            </Text>
          )}
        </TouchableOpacity>

        {mensagemErro !== '' && (
          <Text style={[styles.erro, { marginTop: 10, textAlign: 'center' }]}>
            {mensagemErro}
          </Text>
        )}

        {mensagemSucesso !== '' && (
          <Text style={[styles.sucesso, { marginTop: 10, textAlign: 'center' }]}>
            {mensagemSucesso}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
