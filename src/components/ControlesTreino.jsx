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

  useEffect(() => {
    setBpmInputText(bpm.toString());
  }, [bpm]);

  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    <div 
      className="card px-3 py-2 shadow bg-white border-0 my-2 text-start sticky-top" 
      style={{ top: '56px', zIndex: 1020, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255, 255, 255, 0.95) !important' }}
    >
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        
        <div className="d-flex align-items-center gap-2">
          <button
            className={`btn ${isPlaying ? 'btn-danger' : 'btn-success'} fw-bold px-3 py-1 shadow-sm`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <i className={`bi ${isPlaying ? 'bi-stop-fill' : 'bi-play-fill'} me-1 fs-6`}></i>
            {isPlaying ? 'Parar' : 'Tocar'} <span className="small opacity-75 fw-normal font-monospace">(Espaço)</span>
          </button>

          <select
            className="form-select form-select-sm fw-semibold"
            style={{ width: '170px' }}
            value={instrumento}
            onChange={(e) => setInstrumento(e.target.value)}
          >
            <option value="acoustic_grand_piano">Piano Acústico</option>
            <option value="acoustic_guitar_steel">Violão Aço</option>
            <option value="acoustic_guitar_nylon">Violão Nylon</option>
          </select>
        </div>

        <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded border">
          <span className="small text-muted fw-bold" style={{ fontSize: '10px' }}>
            {faseCountIn ? 'CONTAGEM' : 'COMP.'}
          </span>
          <input
            type="number"
            className="form-control form-control-sm text-center fw-bold text-success p-0"
            style={{ width: '40px', height: '24px', fontSize: '12px' }}
            value={compassoAtual}
            min="1"
            max={totalCompassos || 1}
            onChange={(e) => setCompassoAtual(Math.max(1, Math.min(totalCompassos || 1, parseInt(e.target.value) || 1)))}
            title="Digite o compasso inicial de reprodução"
          />
          <div className="d-flex gap-1 ms-1">
            {Array.from({ length: beatsPorCompasso }, (_, i) => i + 1).map((beat) => (
              <div
                key={beat}
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: '20px',
                  height: '20px',
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

        <div className="d-flex align-items-center gap-2 flex-wrap">
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
                if (!isNaN(num)) {
                  setBpm(Math.max(40, Math.min(240, num)));
                }
              }}
              onBlur={() => {
                const num = parseInt(bpmInputText, 10);
                if (isNaN(num) || num < 40) {
                  setBpm(40);
                  setBpmInputText('40');
                } else if (num > 240) {
                  setBpm(240);
                  setBpmInputText('240');
                }
              }}
            />
          </div>

          <div className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded border">
            <div className="form-check form-switch m-0" title="Ativar/Desativar Looper">
              <input
                className="form-check-input"
                type="checkbox"
                id="looperSwitch"
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
                  style={{ width: '35px', height: '24px', fontSize: '12px' }}
                  value={compassoInicial}
                  min="1"
                  max={compassoFinal}
                  onChange={(e) => setCompassoInicial(Number(e.target.value))}
                />
                <span className="text-muted" style={{ fontSize: '11px' }}>até</span>
                <input
                  type="number"
                  className="form-control form-control-sm text-center p-0 fw-bold font-monospace"
                  style={{ width: '35px', height: '24px', fontSize: '12px' }}
                  value={compassoFinal}
                  min={compassoInicial}
                  max={totalCompassos || 1}
                  onChange={(e) => setCompassoFinal(Number(e.target.value))}
                />

                <div className="form-check form-switch m-0 ms-2" title="Ativar/Desativar Timer">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="timerSwitch"
                    checked={usarTimer}
                    onChange={(e) => setUsarTimer(e.target.checked)}
                  />
                </div>
                <i className="bi bi-clock text-success small"></i>
                {usarTimer && (
                  <div className="d-flex align-items-center gap-1">
                    <input
                      type="number"
                      className="form-control form-control-sm text-center p-0 fw-bold font-monospace text-success"
                      style={{ width: '28px', height: '24px', fontSize: '10px' }}
                      value={minutosInput}
                      min="0"
                      max="60"
                      onChange={(e) => setMinutosInput(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <span style={{ fontSize: '10px' }}>m</span>
                    <span className="badge bg-success font-monospace px-1" style={{ fontSize: '10px' }}>
                      {formatarTempo(tempoRestante)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <span className="small text-muted" style={{ fontSize: '11px' }}>Loop Off</span>
            )}
          </div>

          <div className="d-flex align-items-center gap-1 border-start ps-2">
            <div className="form-check form-switch m-0" title="Count-in (Contagem inicial)">
              <input
                className="form-check-input"
                type="checkbox"
                id="countInSwitch"
                checked={usarCountIn}
                onChange={(e) => setUsarCountIn(e.target.checked)}
              />
              <label className="form-check-label small text-muted" style={{ fontSize: '11px' }} htmlFor="countInSwitch">Count</label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}