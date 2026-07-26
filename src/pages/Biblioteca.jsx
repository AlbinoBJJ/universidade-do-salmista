import React, { useState, useEffect } from 'react';
import PartituraViewer from '../components/PartituraViewer';
import ControlesTreino from '../components/ControlesTreino';
import MixerAudio from '../components/MixerAudio';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { useSoundfontEngine } from '../hooks/useSoundfontEngine';
import { useScoreParser } from '../hooks/useScoreParser';

const listaLicoes = [
  { 
    id: 'licao0000', 
    title: 'Introdução', 
    resumo: 'Bem-vindo à Universidade do Salmista. Compreenda o papel do instrumento a serviço da Palavra.',
    temPartitura: false 
  },
  { 
    id: 'licao0001', 
    title: 'Lição 1: Pelos Prados', 
    resumo: 'Partitura da música Pelos Prados e Campinas adaptada em C maior para o Salmo 22(23).',
    temPartitura: true,
    arquivoXml: `${import.meta.env.BASE_URL}assets/musicxml/pelos_prados.musicxml`,
    letraCompleta: [
      {
        estrofe: "1",
        linhas: [
          "Pelos prados e campinas verdes, verdes, eu vou.",
          "É o Senhor que me leva a descansar.",
          "Junto às fontes de águas puras, repousantes eu vou!",
          "Minhas forças, o Senhor vai animar."
        ]
      },
      {
        estrofe: "Refrão",
        linhas: [
          "Tu és, Senhor, o meu Pastor. Por isso nada em minha vida faltará!",
          "Tu és, Senhor, o meu Pastor. Nada faltará!"
        ]
      },
      {
        estrofe: "2",
        linhas: [
          "Nos caminhos mais seguros junto d'Ele eu vou,",
          "e para sempre o Seu nome eu honrarei.",
          "Se eu encontro mil abismos nos caminhos eu vou,",
          "segurança sempre tenho em Suas mãos."
        ]
      },
      {
        estrofe: "3",
        linhas: [
          "Ao banquete em Sua casa muito alegre eu vou,",
          "um lugar na Sua mesa me preparou.",
          "Ele unge minha fronte e me faz ser feliz,",
          "e transborda a minha taça em Seu amor."
        ]
      },
      {
        estrofe: "4",
        linhas: [
          "Com alegria e esperança caminhando eu vou,",
          "minha vida está sempre em Suas mãos.",
          "E na casa do Senhor eu irei habitar,",
          "e este canto para sempre irei cantar."
        ]
      }
    ]
  },
  { 
    id: 'licao0002', 
    title: 'Lição 2: Em breve', 
    resumo: 'Conteúdo em desenvolvimento.',
    temPartitura: false 
  }
];



export default function Biblioteca({ licaoInicialId = 'licao0001' }) {
  const licaoEncontrada = listaLicoes.find(l => l.id === licaoInicialId) || listaLicoes[1];
  const [licaoAtual, setLicaoAtual] = useState(licaoEncontrada);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [instrumento, setInstrumento] = useState('acoustic_grand_piano');
  
  // Opção de usar Soundfont / Som Real
  const [usarSoundfont, setUsarSoundfont] = useState(false);
  
  // Estados de treino e controle
  const [usarCountIn, setUsarCountIn] = useState(false);
  const [compassoAtual, setCompassoAtual] = useState(1);
  const [usarLooper, setUsarLooper] = useState(false);
  const [compassoInicial, setCompassoInicial] = useState(1);
  const [compassoFinal, setCompassoFinal] = useState(27);
  
  // Estados de Timer
  const [usarTimer, setUsarTimer] = useState(false);
  const [minutosInput, setMinutosInput] = useState(2);
  const [segundosInput, setSegundosInput] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(120);

  // Estados visuais do metrônomo
  const [currentBeat, setCurrentBeat] = useState(1);
  const [faseCountIn, setFaseCountIn] = useState(false);

  // Estado da barra lateral
  const [sidebarAberta, setSidebarAberta] = useState(true);

  // Hooks customizados de Áudio (Sintético vs Soundfont)
  const syntheticAudio = useAudioEngine({ bpm, instrumento, usarCountIn });
  const soundfontAudio = useSoundfontEngine({ bpm, instrumento });

  // Seleciona o engine ativo dinamicamente conforme a preferência do estudante
  const audioEngine = usarSoundfont ? soundfontAudio : syntheticAudio;

  // Hook customizado de Parsing do MusicXML
  const { compassos: compassosMapeados } = useScoreParser(licaoAtual.arquivoXml);

  // Gerenciamento do Timer atrelado ao treino
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

  // Atualiza tempo total do timer quando o input de minutos muda
  useEffect(() => {
    setTempoRestante(minutosInput * 60 + segundosInput);
  }, [minutosInput, segundosInput]);

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row g-0" style={{ minHeight: 'calc(100vh - 56px)' }}>
        
        {/* SIDEBAR RETRÁTIL */}
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

        {/* CONTEÚDO PRINCIPAL */}
        <div className={`${sidebarAberta ? 'col-md-9 col-lg-10' : 'col-12'} p-4 bg-light transition-all position-relative`}>
          
          {/* BOTÃO FLUTUANTE PARA RECOLHER/ABRIR BARRA LATERAL */}
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
            
            {licaoAtual.temPartitura ? (
              <div className="mt-4">
                {/* Painel de Controles de Treino */}
                <ControlesTreino 
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  bpm={bpm}
                  setBpm={setBpm}
                  instrumento={instrumento}
                  setInstrumento={setInstrumento}
                  compassoAtual={compassoAtual}
                  setCompassoAtual={setCompassoAtual}
                  totalCompassos={27}
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

                {/* Mixer de Canais de Áudio com suporte ao modo Soundfont */}
                <MixerAudio 
                  {...audioEngine} 
                  usarSoundfont={usarSoundfont} 
                  setUsarSoundfont={setUsarSoundfont} 
                  carregandoSom={soundfontAudio.carregandoSom} 
                />

                {/* Visualizador da Partitura */}
                <PartituraViewer 
                  arquivoXml={licaoAtual.arquivoXml}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  bpm={bpm}
                  usarCountIn={usarCountIn}
                  compassoAtual={compassoAtual}
                  setCompassoAtual={setCompassoAtual}
                  compassosMapeados={compassosMapeados}
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

                {/* Letra e Cifras */}
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