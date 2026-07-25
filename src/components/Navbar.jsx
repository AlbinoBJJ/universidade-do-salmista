import React from 'react';

export default function Navbar({ setPaginaAtiva, paginaAtiva }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
      <div className="container">
        <a 
          className="navbar-brand fw-bold" 
          href="#home" 
          onClick={(e) => { e.preventDefault(); setPaginaAtiva('home'); }}
        >
          Universidade do Salmista
        </a>
        
        <div className="navbar-nav ms-auto flex-row gap-3">
          <button 
            className={`btn btn-sm ${paginaAtiva === 'home' ? 'btn-light text-success fw-bold' : 'btn-outline-light'}`}
            onClick={() => setPaginaAtiva('home')}
          >
            Home
          </button>
          <button 
            className={`btn btn-sm ${paginaAtiva === 'biblioteca' ? 'btn-light text-success fw-bold' : 'btn-outline-light'}`}
            onClick={() => setPaginaAtiva('biblioteca')}
          >
            Biblioteca
          </button>
        </div>
      </div>
    </nav>
  );
}