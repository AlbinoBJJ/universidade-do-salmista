import React, { useState, useEffect } from 'react';
import PartituraViewer from '../components/PartituraViewer';
import ControlesTreino from '../components/ControlesTreino';
import MixerAudio from '../components/MixerAudio';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { useSoundfontEngine } from '../hooks/useSoundfontEngine';
import { useScoreParser } from '../hooks/useScoreParser';
import { listaLicoes } from '../data/licoes';

export default function Biblioteca({ licaoInicialId = 'licao0001' }) {
  const licaoEncontrada = listaLicoes.find(l => l.id === licaoInicialId) || listaLicoes[1];
  const [licaoAtual, setLicaoAtual] = useState(licaoEncontrada);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(licaoAtual?.bpm || 80);
  const [instrumento, setInstrumento] = useState('acoustic_grand_piano');
  
  const [abaAtiva, setAbaAtiva] = useState('bemvindo');
  const [usarSoundfont, setUsarSoundfont] = useState(false);
  
  const [usarCountIn, setUsarCountIn] = useState(false);
  const [compassoAtual, setCompassoAtual] = useState(1);
  const [usarLooper, setUsarLooper] = useState(false);
  const [compassoInicial, setCompassoInicial] = useState(1);
  const [compassoFinal, setCompassoFinal] = useState(27);
  
  const [usarTimer, setUsarTimer] = useState(false);
  const [minutosInput, setMinutosInput] = useState(2);
  const [segundosInput, setSegundosInput] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(120);

  const [currentBeat, setCurrentBeat] = useState(1);
  const [faseCountIn, setFaseCountIn] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(true);

  // Estados extras necessários para o player de partitura
  const [beatsPorCompassoDinamico, setBeatsPorCompassoDinamico] = useState(4);

  const syntheticAudio = useAudioEngine({ bpm, instrumento, usarCountIn });
  const soundfontAudio = useSoundfontEngine({ bpm, instrumento });
  const audioEngine = usarSoundfont ? soundfontAudio : syntheticAudio;

  const { compassos: compassosMapeados, setCompassosMapeados } = useScoreParser(licaoAtual?.arquivoXml);

  // Determina dinamicamente o número de beats do compasso atual selecionado
  useEffect(() => {
    const compassoAtualObj = compassosMapeados.find(c => c.numero === compassoAtual) || compassosMapeados[0];
    if (compassoAtualObj) {
      setBeatsPorCompassoDinamico(Math.floor(compassoAtualObj.beatsPorCompasso || 4));
    }
  }, [compassosMapeados, compassoAtual]);

  useEffect(() => {
    if (compassosMapeados.length > 0) {
      setCompassoFinal(compassosMapeados.length);
    }
  }, [compassosMapeados]);

  useEffect(() => {
    let interval = null;
    if (isPlaying && usarTimer && tempoRestante > 0) {
      interval = setInterval(() => {
        setTempoRestante((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, usarTimer, tempoRestante]);

  useEffect(() => {
    setTempoRestante(minutosInput * 60 + segundosInput);
  }, [minutosInput, segundosInput]);

  // Gerenciamento unificado de abas ao trocar de lição
  useEffect(() => {
    if (licaoAtual?.conteudoHtml && licaoAtual.conteudoHtml.abas?.length > 0) {
      setAbaAtiva(licaoAtual.conteudoHtml.abas[0].id);
    } else if (licaoAtual?.abas && licaoAtual.abas.length > 0) {
      setAbaAtiva(licaoAtual.abas[0].id);
    } else {
      setAbaAtiva('bemvindo');
    }
    setIsPlaying(false);
    setCompassoAtual(1);
  }, [licaoAtual]);

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ minHeight: 'calc(100vh - 56px)' }}>
        
        {/* Sidebar / Menu Lateral */}
        {sidebarAberta && (
          <div className="col-md-3 col-lg-2 bg-white border-end p-0 transition-all">
            <div className="p-3 bg-light border-bottom fw-bold text-success d-flex justify-content-between align-items-center">
              <span>Módulos de Estudo</span>
            </div>
            <ul className="list-group list-group-flush text-start">
              {listaLicoes.map((licao) => (
                <button
                  key={licao.id}
                  onClick={() => {
                    setLicaoAtual(licao);
                    setIsPlaying(false);
                    setCompassoAtual(1);
                  }}
                  className={`list-group-item list-group-item-action py-3 text-truncate ${
                    licaoAtual.id === licao.id ? 'active bg-success border-success text-white' : ''
                  }`}
                >
                  {licao.title}
                </button>
              ))}
            </ul>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className={`${sidebarAberta ? 'col-md-9 col-lg-10' : 'col-12'} p-4 bg-light transition-all position-relative`}>
          
          {/* Botão de Recolher/Expandir Sidebar */}
          <button
            className="btn btn-light border shadow-sm position-absolute top-0 start-0 m-3 z-3 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px', borderRadius: '8px' }}
            onClick={() => setSidebarAberta(!sidebarAberta)}
            title={sidebarAberta ? "Recolher barra lateral" : "Expandir barra lateral"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {sidebarAberta ? (
                <path d="M4 6H20M4 12H20M4 18H20M9 6V18" stroke="#198754" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <path d="M4 6H20M4 12H20M4 18H20M15 6V18" stroke="#198754" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </button>

          <div className="card shadow-sm border-0 p-4 ps-5 mt-2">
            <div className="ms-5">
              <h1 className="text-success fw-bold mb-2">{licaoAtual.title}</h1>
              <hr />
              <p className="lead mt-3">{licaoAtual.resumo}</p>
            </div>
            
            {/* Renderização para Lições Conceituais (conteudoHtml) */}
            {licaoAtual.conteudoHtml ? (
              <div className="mt-4 text-start">
                {licaoAtual.conteudoHtml.citacao && (
                  <div className="card p-3 bg-light border-start border-4 border-success mb-4 shadow-sm">
                    <p className="fst-italic text-dark mb-0">{licaoAtual.conteudoHtml.citacao}</p>
                  </div>
                )}

                {licaoAtual.conteudoHtml.abas && (
                  <div className="d-flex gap-2 mb-4 flex-wrap">
                    {licaoAtual.conteudoHtml.abas.map((aba) => (
                      <button
                        key={aba.id}
                        className={`btn ${abaAtiva === aba.id ? 'btn-success fw-bold' : 'btn-outline-success'}`}
                        onClick={() => setAbaAtiva(aba.id)}
                      >
                        {aba.label}
                      </button>
                    ))}
                  </div>
                )}

                {(() => {
                  const abaAtual = licaoAtual.conteudoHtml.abas?.find(a => a.id === abaAtiva) || licaoAtual.conteudoHtml.abas?.[0];
                  if (!abaAtual) return null;

                  return (
                    <div className="card p-4 shadow-sm border-0 bg-white">
                      <h4 className="text-success fw-bold mb-3">{abaAtual.titulo}</h4>
                      {abaAtual.texto && <p className="mb-3 text-secondary">{abaAtual.texto}</p>}
                      {abaAtual.subtopico && (
                        <>
                          <h5 className="fw-bold text-dark mt-4">{abaAtual.subtopico}</h5>
                          <p className="text-secondary">{abaAtual.textoSub}</p>
                        </>
                      )}
                      {abaAtual.itens && (
                        <ul className="list-unstyled d-flex flex-column gap-2 mt-2">
                          {abaAtual.itens.map((item, idx) => (
                            <li key={idx} className="bg-light p-3 rounded border-start border-3 border-success" dangerouslySetInnerHTML={{ __html: item }} />
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : licaoAtual.temPartitura ? (
              /* Renderização para Lições com Partitura e Suporte a Abas de Apoio */
              <div className="mt-4">
                {licaoAtual.abas && licaoAtual.abas.length > 0 && (
                  <div className="d-flex gap-2 mb-4 flex-wrap">
                    {licaoAtual.abas.map((aba) => (
                      <button
                        key={aba.id}
                        className={`btn ${abaAtiva === aba.id ? 'btn-success fw-bold' : 'btn-outline-success'}`}
                        onClick={() => setAbaAtiva(aba.id)}
                      >
                        {aba.label}
                      </button>
                    ))}
                  </div>
                )}

                {abaAtiva === 'apoio' ? (
                  <div className="card p-4 shadow-sm border-0 bg-white text-start">
                    <h4 className="text-success fw-bold mb-3">
                      <i className="bi bi-folder2-open me-2"></i> Material de Apoio
                    </h4>
                    <p className="text-secondary">{licaoAtual.abas.find(a => a.id === 'apoio')?.texto}</p>
                    
                    <div className="d-flex flex-column gap-3 mt-3">
                      {licaoAtual.abas.find(a => a.id === 'apoio')?.downloads?.map((item, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between p-3 bg-light rounded border">
                          <div className="d-flex align-items-center gap-3">
                            <i className={`bi ${item.icone || 'bi-file-earmark-text'} fs-4 text-success`}></i>
                            <span className="fw-semibold text-dark">{item.nome}</span>
                          </div>
                          <a 
                            href={item.url} 
                            download 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-success fw-bold px-3"
                          >
                            <i className="bi bi-download me-1"></i> Baixar Arquivo
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <ControlesTreino 
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      bpm={bpm}
                      setBpm={setBpm}
                      instrumento={instrumento}
                      setInstrumento={setInstrumento}
                      compassoAtual={compassoAtual}
                      setCompassoAtual={setCompassoAtual}
                      totalCompassos={compassosMapeados.length || 1}
                      beatsPorCompasso={beatsPorCompassoDinamico}
                      usarCountIn={usarCountIn}
                      setUsarCountIn={setUsarCountIn}
                      usarLooper={usarLooper}
                      setUsarLooper={setUsarLooper}
                      compassoInicial={compassoInicial}
                      setCompassoInicial={setCompassoInicial}
                      compassoFinal={compassoFinal}
                      setCompassoFinal={setCompassoFinal}
                      usarTimer={usarTimer}
                      setUsarTimer={setUsarTimer}
                      minutosInput={minutosInput}
                      setMinutosInput={setMinutosInput}
                      segundosInput={segundosInput}
                      setSegundosInput={setSegundosInput}
                      tempoRestante={tempoRestante}
                      currentBeat={currentBeat}
                      faseCountIn={faseCountIn}
                    />

                    <MixerAudio 
                      {...audioEngine} 
                      usarSoundfont={usarSoundfont} 
                      setUsarSoundfont={setUsarSoundfont} 
                      carregandoSom={soundfontAudio.carregandoSom} 
                    />

                    <PartituraViewer 
                      arquivoXml={licaoAtual.arquivoXml}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      bpm={bpm}
                      usarCountIn={usarCountIn}
                      compassoAtual={compassoAtual}
                      setCompassoAtual={setCompassoAtual}
                      compassosMapeados={compassosMapeados}
                      setCompassosMapeados={setCompassosMapeados}
                      setBeatsPorCompassoDinamico={setBeatsPorCompassoDinamico}
                      audioEngine={audioEngine}
                      usarLooper={usarLooper}
                      compassoInicial={compassoInicial}
                      compassoFinal={compassoFinal}
                      usarTimer={usarTimer}
                      tempoRestante={tempoRestante}
                      setTempoRestante={setTempoRestante}
                      setCurrentBeat={setCurrentBeat}
                      setFaseCountIn={setFaseCountIn}
                    />

                    {licaoAtual.letraCompleta && (
                      <div className="card mt-4 p-4 border-0 bg-light shadow-sm text-start">
                        <h5 className="text-success fw-bold mb-3">
                          <i className="bi bi-journal-text me-2"></i> Letra e Cifras para Acompanhamento
                        </h5>
                        <hr className="text-muted" />
                        <div className="row">
                          {licaoAtual.letraCompleta.map((bloco, index) => (
                            <div key={index} className="col-md-6 mb-3">
                              <span className="badge bg-success mb-1">
                                {bloco.estrofe === "Refrão" ? "Refrão" : `Estrofe ${bloco.estrofe}`}
                              </span>
                              <div className="ps-2 border-start border-3 border-success">
                                {bloco.linhas.map((linha, lIndex) => (
                                  <p key={lIndex} className="mb-1 text-dark small" style={{ fontFamily: 'var(--sans)' }}>
                                    {linha}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="alert alert-secondary mt-4">
                <i className="bi bi-info-circle-fill me-2"></i>
                Esta lição foca na introdução conceitual e não possui partitura associada.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}