import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

export default function PartituraViewer({ 
  arquivoXml, 
  isPlaying, 
  setIsPlaying, 
  bpm, 
  usarCountIn,
  compassoAtual,
  setCompassoAtual,
  compassosMapeados,
  audioEngine,
  usarLooper,
  compassoInicial,
  compassoFinal,
  setCurrentBeat,
  setFaseCountIn
}) {
  const containerRef = useRef(null);
  const osmdInstanceRef = useRef(null);
  const [zoom, setZoom] = useState(1.0);

  // Refs para manter valores atualizados sem re-gatilhar efeitos desnecessários
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;

  const compassoAtualRef = useRef(compassoAtual);
  compassoAtualRef.current = compassoAtual;

  const compassosRef = useRef(compassosMapeados);
  compassosRef.current = compassosMapeados;

  const usarLooperRef = useRef(usarLooper);
  usarLooperRef.current = usarLooper;

  const compassoInicialRef = useRef(compassoInicial);
  compassoInicialRef.current = compassoInicial;

  const compassoFinalRef = useRef(compassoFinal);
  compassoFinalRef.current = compassoFinal;

  const usarCountInRef = useRef(usarCountIn);
  usarCountInRef.current = usarCountIn;

  // Garante que o count-in rode apenas 1 vez por sessão de Play
  const hasCountedRef = useRef(false);

  // Carrega e renderiza o OSMD
  useEffect(() => {
    let isMounted = true;
    if (containerRef.current && arquivoXml) {
      containerRef.current.innerHTML = '';
      const osmd = new OpenSheetMusicDisplay(containerRef.current, {
        autoResize: true,
        backend: 'svg',
        drawingParameters: 'default',
        drawCursor: false,
      });

      osmdInstanceRef.current = osmd;
      osmd.load(arquivoXml).then(() => {
        if (!isMounted || !containerRef.current) return;
        osmd.zoom = zoom;
        osmd.render();

        setTimeout(() => {
          if (!osmd.graphicSheet || !osmd.graphicSheet.MeasureList) return;
          osmd.graphicSheet.MeasureList.forEach((measureStaff, index) => {
            if (measureStaff && measureStaff[0]) {
              const measureNode = measureStaff[0].getSvgElement ? measureStaff[0].getSvgElement() : null;
              if (measureNode) {
                measureNode.style.cursor = 'pointer';
                measureNode.onclick = () => {
                  const targetNum = index + 1;
                  if (targetNum <= compassosRef.current.length) {
                    setCompassoAtual(targetNum);
                  }
                };
              }
            }
          });
        }, 600);
      });
    }
    return () => {
      isMounted = false;
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [arquivoXml, zoom]);

  // Reseta o controle de contagem quando o play é desativado (Parar)
  useEffect(() => {
    if (!isPlaying) {
      hasCountedRef.current = false;
      setFaseCountIn(false);
      setCurrentBeat(1);
    }
  }, [isPlaying, setFaseCountIn, setCurrentBeat]);

  // Motor de Reprodução Principal isolado e blindado contra re-triggers de compasso
  useEffect(() => {
    if (!isPlaying || compassosMapeados.length === 0) return;

    let activeTimeouts = [];
    const list = compassosRef.current;
    
    let startIndex = list.findIndex(c => c.numero === compassoAtualRef.current);
    if (startIndex === -1) startIndex = 0;

    const currentBpm = bpmRef.current;
    const msPerBeat = (60 / currentBpm) * 1000;

    let globalTimeMs = 0;

    // 1. COUNT-IN: Executa estritamente uma única vez se ativado e se ainda não foi contado neste Play
    if (usarCountInRef.current && !hasCountedRef.current) {
      hasCountedRef.current = true;
      setFaseCountIn(true);
      const targetComp = list[startIndex];
      const beatsCount = Math.floor(targetComp?.beatsPorCompasso || 4);

      for (let b = 1; b <= beatsCount; b++) {
        const beatTime = globalTimeMs;
        const currentB = b;
        const t = setTimeout(() => {
          if (!isPlayingRef.current) return;
          setCurrentBeat(currentB);
          audioEngine.playClick(currentB === 1);
        }, beatTime);
        activeTimeouts.push(t);
        globalTimeMs += msPerBeat;
      }

      // Desliga o modo de contagem visual assim que o count-in termina
      const tResetFase = setTimeout(() => {
        if (!isPlayingRef.current) return;
        setFaseCountIn(false);
      }, globalTimeMs);
      activeTimeouts.push(tResetFase);
    } else {
      setFaseCountIn(false);
    }

    // 2. SELEÇÃO DOS COMPASSOS A EXECUTAR
    let compassosParaTocar = list.slice(startIndex);

    if (usarLooperRef.current) {
      const startLoopIndex = list.findIndex(c => c.numero === compassoInicialRef.current);
      const endLoopIndex = list.findIndex(c => c.numero === compassoFinalRef.current);
      if (startLoopIndex !== -1 && endLoopIndex !== -1 && startLoopIndex <= endLoopIndex) {
        compassosParaTocar = list.slice(startLoopIndex, endLoopIndex + 1);
      }
    }

    // 3. EXECUÇÃO DOS COMPASSOS DA MÚSICA (Sem novas contagens sob nenhuma hipótese)
    compassosParaTocar.forEach((comp) => {
      const beatsMax = comp.beatsPorCompasso || 4;
      const compassOffsetTime = globalTimeMs;
      const compNum = comp.numero;

      // Metrônomo dos tempos do compasso real
      for (let b = 0; b < beatsMax; b++) {
        const clickTime = compassOffsetTime + (b * msPerBeat);
        const beatNum = b + 1;

        const t = setTimeout(() => {
          if (!isPlayingRef.current) return;
          setCurrentBeat(beatNum);
          setCompassoAtual(compNum);
          audioEngine.playClick(beatNum === 1);
        }, clickTime);
        activeTimeouts.push(t);
      }

      // Notas musicais reais do compasso
      const notas = comp.notas || [];
      notas.forEach((note) => {
        if (!note.isRest) {
          const noteOffsetTime = compassOffsetTime + ((note.offset / beatsMax) * (msPerBeat * beatsMax));
          const noteDurationSec = (note.dur * 60) / currentBpm;

          const tNote = setTimeout(() => {
            if (!isPlayingRef.current) return;
            audioEngine.playNote(note.freq, Math.max(0.1, noteDurationSec));
          }, noteOffsetTime);
          activeTimeouts.push(tNote);
        }
      });

      globalTimeMs += msPerBeat * beatsMax;
    });

    // 4. ENCERRAMENTO OU LOOPER
    const endTimeout = setTimeout(() => {
      if (!isPlayingRef.current) return;
      if (usarLooperRef.current) {
        // Reinicia o loop mantendo a flag de count-in já dada (para não contar de novo dentro do looper)
        setCompassoAtual(compassoInicialRef.current);
      } else {
        setIsPlaying(false);
        setCompassoAtual(list[0]?.numero || 1);
      }
    }, globalTimeMs);
    activeTimeouts.push(endTimeout);

    return () => {
      activeTimeouts.forEach(t => clearTimeout(t));
    };
  }, [isPlaying, bpm, compassosMapeados, usarCountIn, usarLooper, compassoInicial, compassoFinal]);

  const handleZoomChange = (novoZoom) => {
    if (osmdInstanceRef.current) {
      const zoomLimit = Math.max(0.5, Math.min(2.5, novoZoom));
      setZoom(zoomLimit);
      osmdInstanceRef.current.zoom = zoomLimit;
      osmdInstanceRef.current.render();
    }
  };

  return (
    <div className="card p-3 shadow-sm bg-white border-0 my-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom gap-2">
        <div className="btn-group btn-group-sm" role="group">
          <button type="button" className="btn btn-outline-success" onClick={() => handleZoomChange(zoom - 0.15)}>-</button>
          <button type="button" className="btn btn-outline-success disabled text-dark fw-bold">{Math.round(zoom * 100)}%</button>
          <button type="button" className="btn btn-outline-success" onClick={() => handleZoomChange(zoom + 0.15)}>+</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => handleZoomChange(1.0)}>100%</button>
        </div>
      </div>

      <div ref={containerRef} style={{ width: '100%', overflowX: 'auto' }} />
    </div>
  );
}