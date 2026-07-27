import React, { useState, useEffect } from 'react';
import PartituraViewer from '../components/PartituraViewer';
import ControlesTreino from '../components/ControlesTreino';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { useSoundfontEngine } from '../hooks/useSoundfontEngine';
import { useScoreParser } from '../hooks/useScoreParser';
import { listaLicoes } from '../data/licoes';

const extrairTodasLicoes = (estrutura) => {
  let resultado = [];
  estrutura.forEach(sec => {
    sec.itens.forEach(item => {
      if (item.subgrupo) {
        resultado = resultado.concat(item.itens);
      } else {
        resultado.push(item);
      }
    });
  });
  return resultado;
};

const todasAsLicoes = extrairTodasLicoes(listaLicoes);

export default function Biblioteca({ licaoInicialId = 'licao0001' }) {
  const licaoEncontrada = todasAsLicoes.find(l => l.id === licaoInicialId) || todasAsLicoes[1];
  const [licaoAtual, setLicaoAtual] = useState(licaoEncontrada);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(licaoAtual?.bpm || 80);
  const [instrumento, setInstrumento] = useState('acoustic_guitar_nylon');
  
  const [abaAtiva, setAbaAtiva] = useState('bemvindo');
  const [usarSoundfont, setUsarSoundfont] = useState(true);
  
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
  const [sidebarAberta, setSidebarAberta] = useState(false);

  // Estado para controlar quais subgrupos estão expandidos. Todos começam como `false` (recolhidos por padrão).
  const [gruposAbertos, setGruposAbertos] = useState({
    modulo_teoria: false,
    modulo_harmonia: false,
    entrada: false,
    ato_penitencial: false,
    gloria: false,
    salmos: false,
    aclamacao: false,
    ofertorio: false,
    comunhao: false
  });

  const toggleGrupo = (idGrupo) => {
    setGruposAbertos(prev => ({
      ...prev,
      [idGrupo]: !prev[idGrupo]
    }));
  };

  const [beatsPorCompassoDinamico, setBeatsPorCompassoDinamico] = useState(4);

  const syntheticAudio = useAudioEngine({ bpm, instrumento, usarCountIn });
  const soundfontAudio = useSoundfontEngine({ bpm, instrumento });
  const audioEngine = usarSoundfont ? soundfontAudio : syntheticAudio;

  const { compassos: compassosMapeados, setCompassosMapeados } = useScoreParser(licaoAtual?.arquivoXml);

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
    <div className="container-fluid p-0 m-0 overflow-hidden position-relative">
      
      {/* BOTÃO FLUTUANTE FIXO */}
      <div className="position-fixed" style={{ top: '70px', left: '15px', zIndex: 1050 }}>
        <button
          className="btn btn-success shadow-lg d-flex align-items-center justify-content-center text-white rounded-circle"
          style={{ width: '45px', height: '45px' }}
          onClick={() => setSidebarAberta(!sidebarAberta)}
          title="Alternar Menu de Lições"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="row g-0 position-relative" style={{ minHeight: 'calc(100vh - 56px)' }}>
        
        {/* SIDEBAR COM SUBGRUPOS RECOLHÍVEIS */}
        {sidebarAberta && (
          <div 
            className="col-10 col-sm-6 col-md-4 col-lg-3 bg-white border-end p-0 position-fixed h-100 shadow-lg" 
            style={{ zIndex: 1100, top: 0, left: 0, bottom: 0, display: 'flex', flexDirection: 'column' }}
          >
            <div className="p-3 bg-light border-bottom fw-bold text-success d-flex justify-content-between align-items-center">
              <span>Navegação da Biblioteca</span>
              <button 
                className="btn btn-sm btn-outline-secondary border-0 fw-bold" 
                onClick={() => setSidebarAberta(false)}
                title="Recolher menu"
              >
                ✕ Fechar
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow-1 text-start p-2">
              {listaLicoes.map((secao, idx) => (
                <div key={idx} className="mb-3">
                  <h6 className="text-uppercase text-muted fw-bold px-2 mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                    {secao.categoria}
                  </h6>
                  
                  <div className="list-group list-group-flush">
                    {secao.itens.map((itemSecao, itemIdx) => {
                      if (itemSecao.subgrupo) {
                        const aberto = gruposAbertos[itemSecao.idGrupo];
                        return (
                          <div key={itemIdx} className="mb-1">
                            <button
                              onClick={() => toggleGrupo(itemSecao.idGrupo)}
                              className="w-100 btn btn-sm d-flex justify-content-between align-items-center text-success fw-semibold px-2 py-1 bg-light border-0 text-start"
                              style={{ fontSize: '12px' }}
                            >
                              <span>{itemSecao.subgrupo}</span>
                              <span style={{ transform: aberto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                ▼
                              </span>
                            </button>
                            
                            {aberto && (
                              <div className="ps-2 border-start border-2 border-light ms-2 my-1">
                                {itemSecao.itens.map((licao) => (
                                  <button
                                    key={licao.id}
                                    onClick={() => {
                                      setLicaoAtual(licao);
                                      setIsPlaying(false);
                                      setCompassoAtual(1);
                                      setSidebarAberta(false);
                                    }}
                                    className={`list-group-item list-group-item-action py-1 px-2 text-truncate rounded mb-1 ${
                                      licaoAtual.id === licao.id ? 'active bg-success border-success text-white' : ''
                                    }`}
                                    style={{ fontSize: '13px' }}
                                  >
                                    {licao.title}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <button
                          key={itemSecao.id}
                          onClick={() => {
                            setLicaoAtual(itemSecao);
                            setIsPlaying(false);
                            setCompassoAtual(1);
                            setSidebarAberta(false);
                          }}
                          className={`list-group-item list-group-item-action py-2 px-3 text-truncate rounded mb-1 ${
                            licaoAtual.id === itemSecao.id ? 'active bg-success border-success text-white' : ''
                          }`}
                          style={{ fontSize: '14px' }}
                        >
                          {itemSecao.title}
                          {itemSecao.resumo?.includes('desenvolvimento') && (
                            <span className="badge bg-secondary ms-2" style={{ fontSize: '10px' }}>Em breve</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL */}
        <div className="col-12 col-md p-2 p-md-3 bg-light position-relative">
          
          <div className="card shadow-sm border-0 p-3 mb-2">
            <div>
              <h4 className="text-success fw-bold m-0 fs-5 fs-md-4">{licaoAtual.title}</h4>
              <p className="text-secondary small m-0 mt-1">{licaoAtual.resumo}</p>
            </div>
            
            {licaoAtual.conteudoHtml ? (
              <div className="mt-3 text-start">
                {licaoAtual.conteudoHtml.citacao && (
                  <div className="card p-2 bg-light border-start border-3 border-success mb-3 shadow-sm">
                    <p className="fst-italic text-dark small mb-0">{licaoAtual.conteudoHtml.citacao}</p>
                  </div>
                )}

                {licaoAtual.conteudoHtml.abas && (
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    {licaoAtual.conteudoHtml.abas.map((aba) => (
                      <button
                        key={aba.id}
                        className={`btn btn-sm ${abaAtiva === aba.id ? 'btn-success fw-bold' : 'btn-outline-success'}`}
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
                    <div className="card p-3 shadow-sm border-0 bg-white">
                      <h5 className="text-success fw-bold mb-2" style={{ fontSize: '16px' }}>{abaAtual.titulo}</h5>
                      {abaAtual.texto && <p className="mb-2 text-secondary small">{abaAtual.texto}</p>}
                      {abaAtual.subtopico && (
                        <>
                          <h6 className="fw-bold text-dark mt-3" style={{ fontSize: '14px' }}>{abaAtual.subtopico}</h6>
                          <p className="text-secondary small">{abaAtual.textoSub}</p>
                        </>
                      )}
                      {abaAtual.itens && (
                        <ul className="list-unstyled d-flex flex-column gap-2 mt-2">
                          {abaAtual.itens.map((item, idx) => (
                            <li key={idx} className="bg-light p-2 rounded border-start border-3 border-success small" dangerouslySetInnerHTML={{ __html: item }} />
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : licaoAtual.temPartitura ? (
              <div className="mt-3">
                {licaoAtual.citacao && (
                  <div className="card p-2 bg-light border-start border-3 border-success mb-3 shadow-sm text-start">
                    <p className="fst-italic text-dark small mb-0">{licaoAtual.citacao}</p>
                  </div>
                )}

                {licaoAtual.abas && licaoAtual.abas.length > 0 && (
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    {licaoAtual.abas.map((aba) => (
                      <button
                        key={aba.id}
                        className={`btn btn-sm ${abaAtiva === aba.id ? 'btn-success fw-bold' : 'btn-outline-success'}`}
                        onClick={() => setAbaAtiva(aba.id)}
                      >
                        {aba.label}
                      </button>
                    ))}
                  </div>
                )}

                {(() => {
                  const abaAtual = licaoAtual.abas?.find(a => a.id === abaAtiva) || licaoAtual.abas?.[0];
                  if (!abaAtual) return null;

                  if (abaAtual.tipo === 'conteudo') {
                    return (
                      <div className="card p-3 shadow-sm border-0 bg-white text-start">
                        <h5 className="text-success fw-bold mb-2" style={{ fontSize: '16px' }}>{abaAtual.titulo}</h5>
                        {abaAtual.texto && <p className="mb-2 text-secondary small">{abaAtual.texto}</p>}
                        {abaAtual.subtopico && (
                          <>
                            <h6 className="fw-bold text-dark mt-3" style={{ fontSize: '14px' }}>{abaAtual.subtopico}</h6>
                            <p className="text-secondary small">{abaAtual.textoSub}</p>
                          </>
                        )}
                        {abaAtual.itens && (
                          <ul className="list-unstyled d-flex flex-column gap-2 mt-2">
                            {abaAtual.itens.map((item, idx) => (
                              <li key={idx} className="bg-light p-2 rounded border-start border-3 border-success small" dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  }

                  if (abaAtiva === 'apoio') {
                    return (
                      <div className="card p-3 shadow-sm border-0 bg-white text-start">
                        <h5 className="text-success fw-bold mb-2" style={{ fontSize: '16px' }}>
                          <i className="bi bi-folder2-open me-2"></i> Material de Apoio
                        </h5>
                        <p className="text-secondary small">{abaAtual.texto}</p>
                        
                        <div className="d-flex flex-column gap-2 mt-2">
                          {abaAtual.downloads?.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center justify-content-between p-2 bg-light rounded border flex-wrap gap-2">
                              <div className="d-flex align-items-center gap-2">
                                <i className={`bi ${item.icone || 'bi-file-earmark-text'} fs-5 text-success`}></i>
                                <span className="fw-semibold text-dark small">{item.nome}</span>
                              </div>
                              <a 
                                href={item.url} 
                                download 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-success fw-bold px-2 py-1"
                                style={{ fontSize: '12px' }}
                              >
                                <i className="bi bi-download me-1"></i> Baixar
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <>
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
                        <div className="card mt-3 p-3 border-0 bg-light shadow-sm text-start">
                          <h6 className="text-success fw-bold mb-2" style={{ fontSize: '15px' }}>
                            <i className="bi bi-journal-text me-2"></i> Letra e Cifras para Acompanhamento
                          </h6>
                          <hr className="text-muted my-2" />
                          <div className="row">
                            {licaoAtual.letraCompleta.map((bloco, index) => (
                              <div key={index} className="col-md-6 mb-2">
                                <span className="badge bg-success mb-1" style={{ fontSize: '10px' }}>
                                  {bloco.estrofe === "Refrão" ? "Refrão" : `Estrofe ${bloco.estrofe}`}
                                </span>
                                <div className="ps-2 border-start border-3 border-success">
                                  {bloco.linhas.map((linha, lIndex) => (
                                    <p key={lIndex} className="mb-1 text-dark small" style={{ fontSize: '13px' }}>
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
                  );
                })()}
              </div>
            ) : (
              <div className="alert alert-secondary mt-3 small">
                <i className="bi bi-info-circle-fill me-2"></i>
                Este item litúrgico está em desenvolvimento ou aguardando cadastro de partitura.
              </div>
            )}
          </div>
        </div>

      </div>

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
        {...audioEngine}
        usarSoundfont={usarSoundfont}
        setUsarSoundfont={setUsarSoundfont}
        carregandoSom={soundfontAudio.carregandoSom}
      />
    </div>
  );
}