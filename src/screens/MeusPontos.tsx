import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { MeusPontosScreenProps } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { buscarPorId } from '../services/pontosService';
import {
  obterFavoritosIds,
  removerFavorito,
} from '../services/favoritosService';
import styles from '../styles/styles';

export default function MeusPontos({ navigation }: MeusPontosScreenProps) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarFavoritos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const ids = await obterFavoritosIds();
      if (ids.length === 0) {
        setPontos([]);
        setCarregando(false);
        return;
      }

      // Busca cada ponto na API pelo ID
      // Se algum ponto foi excluído (404), ele fica de fora sem quebrar a tela
      const resultados = await Promise.allSettled(
        ids.map(async (id) => {
          try {
            return await buscarPorId(id);
          } catch (e) {
            // Ponto não encontrado ou excluído na API
            return null;
          }
        })
      );

      const pontosValidos: Ponto[] = [];
      const idsInvalidos: string[] = [];

      resultados.forEach((res, index) => {
        if (res.status === 'fulfilled' && res.value !== null) {
          pontosValidos.push(res.value);
        } else {
          // Ponto excluído da API: limpa do AsyncStorage
          idsInvalidos.push(ids[index]);
        }
      });

      // Remove IDs de pontos que foram deletados da API
      if (idsInvalidos.length > 0) {
        for (const idInvalido of idsInvalidos) {
          await removerFavorito(idInvalido);
        }
      }

      setPontos(pontosValidos);
    } catch (err) {
      console.log('Erro ao carregar favoritos da API:', err);
      setErro('Não foi possível conectar ao servidor para carregar os favoritos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarFavoritos();

    const unsubscribe = navigation.addListener('focus', () => {
      carregarFavoritos();
    });

    return unsubscribe;
  }, [navigation, carregarFavoritos]);

  async function desmarcarFavorito(id: string) {
    // Remove imediatamente do estado visual
    setPontos((prev) => prev.filter((p) => p.id !== id));
    // Atualiza o AsyncStorage
    await removerFavorito(id);
  }

  const renderItem = ({ item }: { item: Ponto }) => (
    <View style={styles.item}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, paddingRight: 8 }}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('DetalhePonto', { id: item.id })}
        >
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.endereco}>📍 {item.endereco} - {item.bairro}</Text>
          <Text style={styles.horario}>🕒 {item.horario}</Text>
          <View style={{ marginTop: 8 }}>
            <Text
              style={[
                styles.texto,
                {
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: item.tipo === 'coleta' ? '#2E7D32' : '#E65100',
                },
              ]}
            >
              🏷️ Ponto de {item.tipo}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botão de desmarcar favorito com área de toque de pelo menos 44x44 */}
        <TouchableOpacity
          style={{
            minWidth: 44,
            minHeight: 44,
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 22,
            backgroundColor: '#FFEBEE',
          }}
          onPress={() => desmarcarFavorito(item.id)}
          accessibilityRole="button"
          accessibilityLabel="Remover dos favoritos"
        >
          <Text style={{ fontSize: 24, color: '#D32F2F', lineHeight: 28 }}>
            ♥
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={pontos}
        keyExtractor={(item: Ponto) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.textoVoltar}>← Voltar</Text>
            </TouchableOpacity>

            <Text style={styles.titulo}>Meus pontos</Text>
            <Text style={styles.subtitulo}>
              Pontos favoritos salvos no seu aparelho
            </Text>

            {pontos.length > 0 && (
              <Text style={styles.resultados}>
                {pontos.length} ponto(s) favorito(s)
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          carregando ? (
            <View style={{ marginTop: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#2E7D32" />
              <Text style={[styles.texto, { marginTop: 12 }]}>
                Carregando seus pontos favoritos...
              </Text>
            </View>
          ) : erro ? (
            <View style={styles.semResultados}>
              <Text style={styles.semResultadosTexto}>Erro ao carregar</Text>
              <Text style={styles.semResultadosSubtexto}>{erro}</Text>
              <TouchableOpacity
                style={styles.botaoCadastrar}
                onPress={carregarFavoritos}
              >
                <Text style={styles.textoBotao}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.semResultados}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>♡</Text>
              <Text style={styles.semResultadosTexto}>
                Nenhum ponto favorito
              </Text>
              <Text style={styles.semResultadosSubtexto}>
                Você ainda não favoritou nenhum ponto. Toque no ícone de coração (♡)
                ao lado de um ponto na lista principal para adicioná-lo aqui.
              </Text>
              <TouchableOpacity
                style={[styles.botaoCadastrar, { marginTop: 16 }]}
                onPress={() => navigation.navigate('ListaPontos')}
              >
                <Text style={styles.textoBotao}>Explorar pontos</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </KeyboardAvoidingView>
  );
}
