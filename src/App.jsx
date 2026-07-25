import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Biblioteca from './pages/Biblioteca';

export default function App() {
  const [paginaAtiva, setPaginaAtiva] = useState('home');
  const [licaoSelecionadaId, setLicaoSelecionadaId] = useState('licao0001');

  return (
    <div>
      <Navbar setPaginaAtiva={setPaginaAtiva} paginaAtiva={paginaAtiva} />

      {paginaAtiva === 'home' && (
        <Home 
          setPaginaAtiva={setPaginaAtiva} 
          setLicaoSelecionadaId={setLicaoSelecionadaId} 
        />
      )}
      {paginaAtiva === 'biblioteca' && (
        <Biblioteca 
          licaoInicialId={licaoSelecionadaId} 
        />
      )}
    </div>
  );
}