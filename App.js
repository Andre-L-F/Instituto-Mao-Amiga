import React, { useState } from 'react';

import ListaPontos from './src/screens/ListaPontos';
import DetalhePonto from './src/screens/DetalhePonto';
import CadastroDoacao from './src/screens/CadastroDoacao';

export default function App() {
  const [tela, setTela] = useState('lista');
  const [pontoSelecionado, setPontoSelecionado] = useState(null);

  function abrirDetalhe(ponto) {
    setPontoSelecionado(ponto);
    setTela('detalhe');
  }

  function abrirCadastro() {
    setTela('cadastro');
  }

  function voltar() {
    setPontoSelecionado(null);
    setTela('lista');
  }

  if (tela === 'cadastro') {
    return (
      <CadastroDoacao
        voltar={voltar}
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
    />
  );
}