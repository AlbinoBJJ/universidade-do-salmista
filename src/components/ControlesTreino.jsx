import React, { useEffect, useState } from 'react';

export default function ControlesTreino({ 
  isPlaying, 
  setIsPlaying, 
  bpm, 
  setBpm, 
  instrumento, 
  setInstrumento,
  compassoAtual,
  setCompassoAtual,
  totalCompassos,
  beatsPorCompasso = 4,
  usarCountIn,
  setUsarCountIn,
  usarLooper,
  setUsarLooper,
  compassoInicial,
  setCompassoInicial,
  compassoFinal,
  setCompassoFinal,
  usarTimer,
  setUsarTimer,
  minutosInput,
  setMinutosInput,
  segundosInput,
  setSegundosInput,
  tempoRestante,
  currentBeat,
  faseCountIn,
  // Props do Mixer
  volumeMetronomo,
  setVolumeMetronomo,
  volumePartitura,
  setVolumePartitura,
  metronomoMute,
  setMetronomoMute,
  partituraMute,
  setPartituraMute,
  metronomoSolo,
  setMetronomoSolo,
  partituraSolo,
  setPartituraSolo,
  usarSoundfont,
  setUsarSoundfont,
  carregandoSom
}) {
  const [bpmInputText, setBpmInputText] = useState(bpm.toString());
  const [expandidoMobile, setExpandidoMobile] = useState(false);
  const [mixerExpandido, setMixerExpandido] = useState(false);

  useEffect(() => {
    setBpmInputText(bpm.toString());
  }, [bpm]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsPlaying]);

  return (
    <>
      {/* BARRA FIXA INFERIOR ABSOLUTA (FIXA NO RODAPÉ EM PC E MOBILE) */}
      <div 
        className="fixed-bottom p-2 p-md-3 bg-white border-top shadow-lg text-start"
        style={{ 
          zIndex: 1090, 
          backdropFilter: 'blur(12px)', 
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <div className="container-fluid px-2 px-md-4">
          
          {/* LINHA PRINCIPAL DE CONTROLES */}
          <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap flex-lg-nowrap">
            
            {/* Botão Play / Stop Principal (Garantido em todas as telas) */}
            <button
              className={`btn ${isPlaying ? 'btn-danger' : 'btn-success'} fw-bold px-4 py-2 shadow-sm d-flex align-items-center justify-content-center flex-grow-1 flex-lg-grow-0`}
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ minWidth: '140px' }}
              type="button"
            >
              <i className={`bi ${isPlaying ? 'bi-stop-fill' : 'bi-play-fill'} me-1 fs-4`}></i>
              {isPlaying ? 'PARAR' : 'TOCAR'}
            </button>

            {/* Seletor rápido de instrumento visível no desktop */}
            <select
              className="form-select form-select-sm fw-semibold w-auto d-none d-lg-block"
              value={instrumento}
              onChange={(e) => setInstrumento(e.target.value)}
            >
              <option value="acoustic_grand_piano">Piano Acústico</option>
              <option value="acoustic_guitar_steel">Violão Aço</option>
              <option value="acoustic_guitar_nylon">Violão Nylon</option>
            </select>

            {/* Botão para Expandir/Recolher Ajustes e Mixer */}
            <button
              className="btn btn-outline-secondary btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-1"
              onClick={() => setExpandidoMobile(!expandidoMobile)}
              type="button"
            >
              <i className={`bi ${expandidoMobile ? 'bi-chevron-down' : 'bi-sliders'} fs-5`}></i>
              <span>{expandidoMobile ? 'Ocultar' : 'Ajustes & Mixer'}</span>
            </button>

            {/* Bloco Completo Desktop */}
            <div className="d-none d-lg-flex align-items-center justify-content-end gap-3 flex-wrap">
              
              {/* Compassos e Beats */}
              <div className="d-flex align-items-center bg-light px-2 py-1 rounded border gap-2">
                <div className="d-flex align-items-center gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0 px-1"
                    style={{ height: '26px', fontSize: '12px' }}
                    onClick={() => setCompassoAtual(1)}
                    title="Voltar ao início"
                  >
                    <i className="bi bi-skip-start-fill"></i>
                  </button>
                  <span className="small text-muted fw-bold" style={{ fontSize: '11px' }}>
                    {faseCountIn ? 'CONT.' : 'COMP.'}
                  </span>
                  <input
                    type="number"
                    className="form-control form-control-sm text-center fw-bold text-success p-0"
                    style={{ width: '45px', height: '26px', fontSize: '13px' }}
                    value={compassoAtual}
                    min="1"
                    max={totalCompassos || 1}
                    onChange={(e) => setCompassoAtual(Math.max(1, Math.min(totalCompassos || 1, parseInt(e.target.value) || 1)))}
                  />
                </div>

                <div className="d-flex gap-1">
                  {Array.from({ length: beatsPorCompasso }, (_, i) => i + 1).map((beat) => (
                    <div
                      key={beat}
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: '22px',
                        height: '22px',
                        fontSize: '11px',
                        backgroundColor: isPlaying && currentBeat === beat 
                          ? (faseCountIn ? '#ffc107' : (beat === 1 ? '#198754' : '#ffc107')) 
                          : '#e5e4e7',
                        color: isPlaying && currentBeat === beat 
                          ? (faseCountIn ? '#000' : (beat === 1 ? '#fff' : '#000')) 
                          : '#6b6375',
                      }}
                    >
                      {beat}
                    </div>
                  ))}
                </div>
              </div>

              {/* BPM e Looper */}
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-1">
                  <span className="small text-muted fw-bold">BPM:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-control form-control-sm text-center fw-bold text-success p-1"
                    style={{ width: '55px' }}
                    value={bpmInputText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBpmInputText(val);
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) setBpm(Math.max(40, Math.min(240, num)));
                    }}
                    onBlur={() => {
                      const num = parseInt(bpmInputText, 10);
                      if (isNaN(num) || num < 40) { setBpm(40); setBpmInputText('40'); }
                      else if (num > 240) { setBpm(240); setBpmInputText('240'); }
                    }}
                  />
                </div>

                <div className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded border">
                  <div className="form-check form-switch m-0" title="Looper">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="looperSwitchDesktop"
                      checked={usarLooper}
                      onChange={(e) => setUsarLooper(e.target.checked)}
                    />
                  </div>
                  <i className="bi bi-repeat text-success small"></i>
                  {usarLooper ? (
                    <div className="d-flex align-items-center gap-1">
                      <input
                        type="number"
                        className="form-control form-control-sm text-center p-0 fw-bold font-monospace"
                        style={{ width: '35px', height: '24px', fontSize: '11px' }}
                        value={compassoInicial}
                        min="1"
                        max={compassoFinal}
                        onChange={(e) => setCompassoInicial(Number(e.target.value))}
                      />
                      <span className="text-muted small">-</span>
                      <input
                        type="number"
                        className="form-control form-control-sm text-center p-0 fw-bold font-monospace"
                        style={{ width: '35px', height: '24px', fontSize: '11px' }}
                        value={compassoFinal}
                        min={compassoInicial}
                        max={totalCompassos || 1}
                        onChange={(e) => setCompassoFinal(Number(e.target.value))}
                      />
                    </div>
                  ) : (
                    <span className="small text-muted" style={{ fontSize: '11px' }}>Loop Off</span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-1 border-start ps-2">
                  <div className="form-check form-switch m-0" title="Contagem Inicial">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="countInSwitchDesktop"
                      checked={usarCountIn}
                      onChange={(e) => setUsarCountIn(e.target.checked)}
                    />
                    <label className="form-check-label small text-muted" style={{ fontSize: '11px' }} htmlFor="countInSwitchDesktop">Count</label>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* PAINEL EXPANSÍVEL (AJUSTES + MIXER) */}
          {expandidoMobile && (
            <div className="mt-3 pt-3 border-top d-flex flex-column gap-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              
              <div className="d-flex flex-column gap-1 d-lg-none">
                <label className="small fw-bold text-muted">Instrumento:</label>
                <select
                  className="form-select form-select-sm fw-semibold"
                  value={instrumento}
                  onChange={(e) => setInstrumento(e.target.value)}
                >
                  <option value="acoustic_grand_piano">Piano Acústico</option>
                  <option value="acoustic_guitar_steel">Violão Aço</option>
                  <option value="acoustic_guitar_nylon">Violão Nylon</option>
                </select>
              </div>

              <div className="d-flex flex-column bg-light p-2 rounded border gap-2 d-lg-none">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="small fw-bold text-muted">Compasso Atual:</span>
                  <div className="d-flex align-items-center gap-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary py-0 px-2"
                      onClick={() => setCompassoAtual(1)}
                    >
                      <i className="bi bi-skip-start-fill"></i>
                    </button>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center fw-bold text-success p-0"
                      style={{ width: '55px', height: '30px' }}
                      value={compassoAtual}
                      min="1"
                      max={totalCompassos || 1}
                      onChange={(e) => setCompassoAtual(Math.max(1, Math.min(totalCompassos || 1, parseInt(e.target.value) || 1)))}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-1 py-1">
                  {Array.from({ length: beatsPorCompasso }, (_, i) => i + 1).map((beat) => (
                    <div
                      key={beat}
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: '28px',
                        height: '28px',
                        fontSize: '12px',
                        backgroundColor: isPlaying && currentBeat === beat 
                          ? (faseCountIn ? '#ffc107' : (beat === 1 ? '#198754' : '#ffc107')) 
                          : '#e5e4e7',
                        color: isPlaying && currentBeat === beat 
                          ? (faseCountIn ? '#000' : (beat === 1 ? '#fff' : '#000')) 
                          : '#6b6375',
                      }}
                    >
                      {beat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap d-lg-none">
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted fw-bold">BPM:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-control form-control-sm text-center fw-bold text-success p-1"
                    style={{ width: '70px' }}
                    value={bpmInputText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBpmInputText(val);
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) setBpm(Math.max(40, Math.min(240, num)));
                    }}
                    onBlur={() => {
                      const num = parseInt(bpmInputText, 10);
                      if (isNaN(num) || num < 40) { setBpm(40); setBpmInputText('40'); }
                      else if (num > 240) { setBpm(240); setBpmInputText('240'); }
                    }}
                  />
                </div>

                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="countInSwitchMobile"
                    checked={usarCountIn}
                    onChange={(e) => setUsarCountIn(e.target.checked)}
                  />
                  <label className="form-check-label small fw-bold text-muted ms-1" htmlFor="countInSwitchMobile">Contagem Inicial</label>
                </div>
              </div>

              {/* MIXER DE ÁUDIO EMBUTIDO */}
              <div className="card p-2 bg-white border shadow-sm text-start">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="text-success fw-bold m-0" style={{ fontSize: '13px' }}>
                      <i className="bi bi-sliders me-1"></i> Mixer de Canais
                    </h6>
                    {!mixerExpandido && (
                      <span className="badge bg-light text-dark border font-monospace" style={{ fontSize: '10px' }}>
                        Metr.: {Math.round(volumeMetronomo * 100)}% | Part.: {Math.round(volumePartitura * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <div className="form-check form-switch m-0 d-flex align-items-center gap-1" title="Som Real (Hi-Fi)">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="soundfontSwitchBar"
                        checked={usarSoundfont}
                        onChange={(e) => setUsarSoundfont(e.target.checked)}
                      />
                      <label className="form-check-label small fw-bold text-success" style={{ fontSize: '10px', cursor: 'pointer' }} htmlFor="soundfontSwitchBar">
                        🎵 Som Real {carregandoSom && <span className="spinner-border spinner-border-sm ms-1" style={{ width: '8px', height: '8px' }} role="status"></span>}
                      </label>
                    </div>

                    <button
                      className="btn btn-sm btn-outline-success py-0 px-2"
                      style={{ fontSize: '11px' }}
                      onClick={() => setMixerExpandido(!mixerExpandido)}
                    >
                      {mixerExpandido ? 'Recolher' : 'Mesa'}
                    </button>
                  </div>
                </div>

                {mixerExpandido && (
                  <div className="d-flex justify-content-around align-items-center bg-light p-2 rounded border mt-2">
                    
                    {/* Canal Metrônomo */}
                    <div className="d-flex flex-column align-items-center bg-white p-2 rounded border shadow-sm" style={{ width: '100px' }}>
                      <div className="d-flex gap-1 mb-1">
                        <button
                          className={`btn btn-sm py-0 px-1 fw-bold ${metronomoMute ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
                          style={{ fontSize: '9px', width: '30px' }}
                          onClick={() => setMetronomoMute(!metronomoMute)}
                        >
                          M
                        </button>
                        <button
                          className={`btn btn-sm py-0 px-1 fw-bold ${metronomoSolo ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                          style={{ fontSize: '9px', width: '30px' }}
                          onClick={() => setMetronomoSolo(!metronomoSolo)}
                        >
                          S
                        </button>
                      </div>
                      
                      <div className="py-1 d-flex justify-content-center align-items-center" style={{ height: '90px' }}>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volumeMetronomo}
                          onChange={(e) => setVolumeMetronomo(parseFloat(e.target.value))}
                          style={{
                            writingMode: 'vertical-lr',
                            direction: 'rtl',
                            width: '16px',
                            height: '75px',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <span className="font-monospace text-success fw-bold mt-1" style={{ fontSize: '10px' }}>
                        {Math.round(volumeMetronomo * 100)}%
                      </span>
                      <span className="small fw-bold text-uppercase text-muted mt-1" style={{ fontSize: '9px' }}>
                        Metrônomo
                      </span>
                    </div>

                    {/* Canal Partitura */}
                    <div className="d-flex flex-column align-items-center bg-white p-2 rounded border shadow-sm" style={{ width: '100px' }}>
                      <div className="d-flex gap-1 mb-1">
                        <button
                          className={`btn btn-sm py-0 px-1 fw-bold ${partituraMute ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
                          style={{ fontSize: '9px', width: '30px' }}
                          onClick={() => setPartituraMute(!partituraMute)}
                        >
                          M
                        </button>
                        <button
                          className={`btn btn-sm py-0 px-1 fw-bold ${partituraSolo ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                          style={{ fontSize: '9px', width: '30px' }}
                          onClick={() => setPartituraSolo(!partituraSolo)}
                        >
                          S
                        </button>
                      </div>
                      
                      <div className="py-1 d-flex justify-content-center align-items-center" style={{ height: '90px' }}>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volumePartitura}
                          onChange={(e) => setVolumePartitura(parseFloat(e.target.value))}
                          style={{
                            writingMode: 'vertical-lr',
                            direction: 'rtl',
                            width: '16px',
                            height: '75px',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <span className="font-monospace text-success fw-bold mt-1" style={{ fontSize: '10px' }}>
                        {Math.round(volumePartitura * 100)}%
                      </span>
                      <span className="small fw-bold text-uppercase text-muted mt-1" style={{ fontSize: '9px' }}>
                        Partitura
                      </span>
                    </div>

                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Espaçamento garantido no fundo da página para o conteúdo não ficar por baixo da barra fixa */}
      <div style={{ height: '120px' }}></div>
    </>
  );
  
}