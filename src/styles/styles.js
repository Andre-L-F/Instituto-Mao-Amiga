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

  botaoHistorico: {
  backgroundColor: '#558B2F',
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 20,
  },
  
  botaoExcluir: {
  backgroundColor: '#C62828',
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 30,
  },

});

export default styles;