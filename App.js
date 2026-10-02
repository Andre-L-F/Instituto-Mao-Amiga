import React, { useState } from 'react';

import ListaPontos from './src/screens/ListaPontos';
import DetalhePonto from './src/screens/DetalhePonto';
import CadastroDoacao from './src/screens/CadastroDoacao';
import HistoricoDoacoes from './src/screens/HistoricoDoacoes';
import DetalheDoacao from './src/screens/DetalheDoacao';

export default function App() {
  // Controle da tela atual
  const [tela, setTela] = useState('lista');
  const [telaAnterior, setTelaAnterior] = useState('lista');
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

  function abrirDetalhe(ponto) {
    setPontoSelecionado(ponto);
    setTela('detalhe');
  }

  function abrirCadastro(origem = 'lista') {
    setTelaAnterior(origem);
    setTela('cadastro');
  }

  function abrirHistorico() {
    setTela('historico');
  }

  function abrirDetalheDoacao(doacao) {
    setDoacaoSelecionada(doacao);
    setTela('detalheDoacao');
  }

  function voltar() {
    setPontoSelecionado(null);
    setTela('lista');
  }

  function voltarDoCadastro() {
    setTela(telaAnterior);
  }

  function voltarDoHistorico() {
    setTela('lista');
  }

  function voltarDoDetalheDoacao() {
    setDoacaoSelecionada(null);
    setTela('historico');
  }

  if (tela === 'cadastro') {
    return (
      <CadastroDoacao
        voltar={voltarDoCadastro}
      />
    );
  }

  if (tela === 'historico') {
    return (
      <HistoricoDoacoes
        voltar={voltarDoHistorico}
        abrirCadastro={abrirCadastro}
        abrirDetalheDoacao={abrirDetalheDoacao}
      />
    );
  }

  if (
    tela === 'detalheDoacao' &&
    doacaoSelecionada
  ) {
    return (
      <DetalheDoacao
        route={{
          params: {
            doacao: doacaoSelecionada,
          },
        }}
        voltar={voltarDoDetalheDoacao}
      />
    );
  }

  if (tela === 'detalhe' && pontoSelecionado) {
    return (
      <DetalhePonto
        ponto={pontoSelecionado}
        voltar={voltar}
      />
    );
  }

  return (
    <ListaPontos
      abrirDetalhe={abrirDetalhe}
      abrirCadastro={abrirCadastro}
      abrirHistorico={abrirHistorico}
    />
  );
}
