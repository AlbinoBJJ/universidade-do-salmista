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
  faseCountIn
}) {
  const [bpmInputText, setBpmInputText] = useState(bpm.toString());
  const [expandidoMobile, setExpandidoMobile] = useState(false);

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
      {/* 
        BARRA FIXA INFERIOR UNIVERSAL (MOBILE E PC)
        Garante que os controles e o botão de play fiquem sempre ancorados no rodapé da tela.
      */}
      <div 
        className="fixed-bottom p-2 p-md-3 bg-white border-top shadow-lg text-start"
        style={{ 
          zIndex: 1080, 
          backdropFilter: 'blur(12px)', 
          backgroundColor: 'rgba(255, 255, 255, 0.98)' 
        }}
      >
        <div className="container-fluid px-2 px-md-4">
          
          {/* LINHA PRINCIPAL */}
          <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap flex-lg-nowrap">
            
            {/* Botão Play / Stop Principal */}
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

            {/* Botão para Expandir/Recolher ajustes no Mobile */}
            <button
              className="btn btn-outline-secondary btn-sm d-lg-none px-3 py-2 fw-semibold d-flex align-items-center gap-1"
              onClick={() => setExpandidoMobile(!expandidoMobile)}
              type="button"
            >
              <i className={`bi ${expandidoMobile ? 'bi-chevron-down' : 'bi-sliders'} fs-5`}></i>
              <span>{expandidoMobile ? 'Ocultar' : 'Ajustes'}</span>
            </button>

            {/* Bloco Completo Desktop (Visível apenas em telas grandes) */}
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

          {/* PAINEL EXPANSÍVEL MOBILE (ABRE AO CLICAR EM AJUSTES) */}
          {expandidoMobile && (
            <div className="d-lg-none mt-3 pt-3 border-top d-flex flex-column gap-3">
              
              <div className="d-flex flex-column gap-1">
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

              <div className="d-flex flex-column bg-light p-2 rounded border gap-2">
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

              <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
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

              <div className="d-flex flex-column bg-light p-2 rounded border gap-2">
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="looperSwitchMobile"
                    checked={usarLooper}
                    onChange={(e) => setUsarLooper(e.target.checked)}
                  />
                  <label className="form-check-label small fw-bold text-success ms-1" htmlFor="looperSwitchMobile">Ativar Looper (Trecho)</label>
                </div>
                {usarLooper && (
                  <div className="d-flex align-items-center justify-content-between pt-1">
                    <span className="small text-muted">Do compasso:</span>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center p-0 fw-bold"
                      style={{ width: '50px', height: '28px' }}
                      value={compassoInicial}
                      min="1"
                      max={compassoFinal}
                      onChange={(e) => setCompassoInicial(Number(e.target.value))}
                    />
                    <span className="small text-muted">até:</span>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center p-0 fw-bold"
                      style={{ width: '50px', height: '28px' }}
                      value={compassoFinal}
                      min={compassoInicial}
                      max={totalCompassos || 1}
                      onChange={(e) => setCompassoFinal(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Espaçamento extra no fundo da página (tanto no PC quanto no mobile) para o conteúdo não ficar por baixo da barra fixa */}
      <div style={{ height: '90px' }}></div>
    </>
  );
}