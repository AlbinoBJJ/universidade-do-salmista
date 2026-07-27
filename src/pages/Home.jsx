import React from 'react';

export default function Home({ setPaginaAtiva, setLicaoSelecionadaId }) {
  
  // Função auxiliar para redirecionar para uma lição específica na Biblioteca
  const irParaLicao = (idLicao) => {
    if (setLicaoSelecionadaId) {
      setLicaoSelecionadaId(idLicao);
    }
    setPaginaAtiva('biblioteca');
  };

  const numeroWhatsApp = "5511998825574"; // Número formatado para o link do WhatsApp
  const mensagemWhatsApp = encodeURIComponent("Olá Lucas! Gostaria de ser um colaborador na Universidade do Salmista.");

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      {/* Hero Section */}
      <header className="hero-section text-white text-center py-5 bg-success flex-grow-1 d-flex align-items-center">
        <div className="container py-5">
          <h1 className="display-3 fw-bold text-white">Universidade do Salmista</h1>
          <p className="lead mb-4 text-white-50">
            A arte de servir ao altar com técnica, devoção e excelência.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button 
              className="btn btn-light btn-lg text-success fw-bold px-4 shadow-sm"
              onClick={() => irParaLicao('introducao')}
            >
              <i className="bi bi-play-circle-fill me-2"></i> Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* Seção de Chamada para Colaboradores */}
      <section className="py-5 bg-light border-bottom text-center">
        <div className="container py-3">
          <h3 className="text-success fw-bold mb-3">Seja um Colaborador</h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
            Tem interesse em contribuir com novas partituras, arranjos ou conteúdos para a plataforma? Entre em contato conosco e faça parte deste projeto!
          </p>
          <a
            href={`https://wa.me/${numeroWhatsApp}?text=${mensagemWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success fw-bold px-4 py-2 shadow-sm"
          >
            <i className="bi bi-whatsapp me-2 fs-5"></i> Colaborar via WhatsApp
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-1 fw-semibold" style={{ fontSize: '15px' }}>
            Lucas Bibiana de Brito
          </p>
          <p className="text-muted small mb-3">
            Universidade do Salmista &copy; {new Date().getFullYear()} — Todos os direitos reservados.
          </p>
          <div>
            <a
              href={`https://wa.me/${numeroWhatsApp}?text=${mensagemWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-success btn-sm text-white border-success"
            >
              <i className="bi bi-whatsapp me-1 text-success"></i> (11) 99882-5574
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}