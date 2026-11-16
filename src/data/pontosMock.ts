import type { Ponto } from '../types/ponto';

const pontosMock: Ponto[] = [
  {
    produtoId: '1',
    id: 1,
    nome: 'Ponto Central',
    endereco: 'Rua das Flores, 120 - Centro',
    horario: 'Segunda a sexta, das 8h às 17h',
    recebeDistribui:
      'Recebe alimentos não perecíveis e roupas. Distribui cestas básicas e roupas.',
    latitude: -16.6799,
    longitude: -49.255,
  },
  {
    produtoId: '2',
    id: 2,
    nome: 'Ponto Vila Esperança',
    endereco: 'Avenida Esperança, 450 - Vila Esperança',
    horario: 'Terças e quintas, das 9h às 16h',
    recebeDistribui:
      'Recebe alimentos, produtos de higiene e roupas infantis. Distribui alimentos e roupas para famílias cadastradas.',
    latitude: -16.6215,
    longitude: -49.2482,
  },
  {
    produtoId: '3',
    id: 3,
    nome: 'Ponto Jardim Novo',
    endereco: 'Rua das Acácias, 85 - Jardim Novo',
    horario: 'Sábados, das 8h às 13h',
    recebeDistribui:
      'Recebe alimentos frescos e roupas. Distribui alimentos e kits de roupas.',
    latitude: -16.6854,
    longitude: -49.2141,
  },
];

export default pontosMock;
