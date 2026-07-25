import React, { useState } from 'react';

export default function MixerAudio({
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
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="card p-2 shadow-sm bg-white border my-2 text-start">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <h6 className="text-success fw-bold m-0" style={{ fontSize: '14px' }}>
            <i className="bi bi-sliders me-2"></i> Mixer de Canais
          </h6>
          {!expandido && (
            <span className="badge bg-light text-dark border font-monospace" style={{ fontSize: '10px' }}>
              Metrônomo: {Math.round(volumeMetronomo * 100)}% | Partitura: {Math.round(volumePartitura * 100)}%
            </span>
          )}
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Chave Opcional para Soundfont / Hi-Fi */}
          <div className="form-check form-switch m-0 d-flex align-items-center gap-1" title="Ativar instrumentos reais amostrados (Soundfont)">
            <input
              className="form-check-input"
              type="checkbox"
              id="soundfontSwitch"
              checked={usarSoundfont}
              onChange={(e) => setUsarSoundfont(e.target.checked)}
            />
            <label className="form-check-label small fw-bold text-success" style={{ fontSize: '11px', cursor: 'pointer' }} htmlFor="soundfontSwitch">
              🎵 Som Real (Hi-Fi) {carregandoSom && <span className="spinner-border spinner-border-sm ms-1" style={{ width: '10px', height: '10px' }} role="status"></span>}
            </label>
          </div>

          <button
            className="btn btn-sm btn-outline-success py-0 px-2"
            style={{ fontSize: '12px' }}
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? <><i className="bi bi-chevron-up me-1"></i> Recolher Mesa</> : <><i className="bi bi-chevron-down me-1"></i> Expandir Mesa</>}
          </button>
        </div>
      </div>

      {expandido && (
        <div className="d-flex justify-content-around align-items-center bg-light p-3 rounded border mt-2">
          
          {/* Canal 1: Metrônomo */}
          <div className="d-flex flex-column align-items-center bg-white p-2 rounded border shadow-sm" style={{ width: '110px' }}>
            <div className="d-flex gap-1 mb-2">
              <button
                className={`btn btn-sm py-0 px-1 fw-bold ${metronomoMute ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
                style={{ fontSize: '10px', width: '34px' }}
                onClick={() => setMetronomoMute(!metronomoMute)}
              >
                M
              </button>
              <button
                className={`btn btn-sm py-0 px-1 fw-bold ${metronomoSolo ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                style={{ fontSize: '10px', width: '34px' }}
                onClick={() => setMetronomoSolo(!metronomoSolo)}
              >
                S
              </button>
            </div>
            
            <div className="py-2 d-flex justify-content-center align-items-center" style={{ height: '110px' }}>
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
                  width: '20px',
                  height: '90px',
                  cursor: 'pointer'
                }}
              />
            </div>
            <span className="font-monospace text-success fw-bold mt-1" style={{ fontSize: '11px' }}>
              {Math.round(volumeMetronomo * 100)}%
            </span>
            <span className="small fw-bold text-uppercase text-muted mt-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
              Metrônomo
            </span>
          </div>

          {/* Canal 2: Partitura */}
          <div className="d-flex flex-column align-items-center bg-white p-2 rounded border shadow-sm" style={{ width: '110px' }}>
            <div className="d-flex gap-1 mb-2">
              <button
                className={`btn btn-sm py-0 px-1 fw-bold ${partituraMute ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
                style={{ fontSize: '10px', width: '34px' }}
                onClick={() => setPartituraMute(!partituraMute)}
              >
                M
              </button>
              <button
                className={`btn btn-sm py-0 px-1 fw-bold ${partituraSolo ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                style={{ fontSize: '10px', width: '34px' }}
                onClick={() => setPartituraSolo(!partituraSolo)}
              >
                S
              </button>
            </div>
            
            <div className="py-2 d-flex justify-content-center align-items-center" style={{ height: '110px' }}>
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
                  width: '20px',
                  height: '90px',
                  cursor: 'pointer'
                }}
              />
            </div>
            <span className="font-monospace text-success fw-bold mt-1" style={{ fontSize: '11px' }}>
              {Math.round(volumePartitura * 100)}%
            </span>
            <span className="small fw-bold text-uppercase text-muted mt-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
              Partitura
            </span>
          </div>

        </div>
      )}
    </div>
  );
}