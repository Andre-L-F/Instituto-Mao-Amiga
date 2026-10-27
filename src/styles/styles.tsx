import { StyleSheet } from 'react-native';

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

  resumo: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 20,
  },

  resumoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },

  resumoTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },

  resumoItem: {
    fontSize: 14,
    color: '#444444',
    marginTop: 2,
  },

  detalheContainer: {
    padding: 20,
    paddingTop: 50,
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

  botaoCadastrar: {
    backgroundColor: '#2E7D32',
    minHeight: 44,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  botaoHistorico: {
    backgroundColor: '#558B2F',
    minHeight: 44,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  botaoExcluir: {
    backgroundColor: '#C62828',
    minHeight: 44,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  botaoVoltar: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: 20,
  },

  // Estilos adicionais para estado da API (carregamento e erro)
  carregandoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  carregandoTexto: {
    marginTop: 12,
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },

  erroContainer: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#EF9A9A',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },

  erroTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 6,
    textAlign: 'center',
  },

  erroMensagem: {
    fontSize: 14,
    color: '#B71C1C',
    textAlign: 'center',
    marginBottom: 12,
  },

  botaoTentarNovamente: {
    backgroundColor: '#C62828',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  textoBotaoTentarNovamente: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Seleção de pontos no cadastro
  pontosOpcoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  pontoChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  pontoChipSelecionado: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },

  pontoChipTexto: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },

  pontoChipTextoSelecionado: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default styles;
