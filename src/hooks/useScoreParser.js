import { useState, useEffect } from 'react';

export function useScoreParser(arquivoXml) {
  const [compassos, setCompassos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const pitchToFreq = (step, octave, alter = 0) => {
    const stepNames = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    const stepVal = stepNames[step] !== undefined ? stepNames[step] : 0;
    const semitonesFromC4 = stepVal + (octave - 4) * 12 + alter;
    return 261.63 * Math.pow(2, semitonesFromC4 / 12);
  };

  useEffect(() => {
    if (!arquivoXml) return;
    let isMounted = true;
    setCarregando(true);

    fetch(arquivoXml)
      .then((res) => res.text())
      .then((xmlString) => {
        if (!isMounted) return;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const measureElements = xmlDoc.getElementsByTagName("measure");
        const compassosEstruturados = [];

        let currentDivisions = 2;
        let beatsPorCompasso = 4;
        let beatType = 4;

        for (let m = 0; m < measureElements.length; m++) {
          const measure = measureElements[m];
          const numCompasso = parseInt(measure.getAttribute("number") || (m + 1), 10);

          const divEl = measure.getElementsByTagName("divisions")[0];
          if (divEl) {
            currentDivisions = parseInt(divEl.textContent, 10) || currentDivisions;
          }

          const timeEl = measure.getElementsByTagName("time")[0];
          if (timeEl) {
            const b = timeEl.getElementsByTagName("beats")[0];
            const bt = timeEl.getElementsByTagName("beat-type")[0];
            if (b) beatsPorCompasso = parseInt(b.textContent, 10) || beatsPorCompasso;
            if (bt) beatType = parseInt(bt.textContent, 10) || beatType;
          }

          let repeatStart = false;
          let repeatEnd = false;
          let endingNum = null;
          let endingType = null;

          const barlines = measure.getElementsByTagName("barline");
          for (let b = 0; b < barlines.length; b++) {
            const barline = barlines[b];
            const repeat = barline.getElementsByTagName("repeat")[0];
            if (repeat) {
              if (repeat.getAttribute("direction") === "forward") repeatStart = true;
              if (repeat.getAttribute("direction") === "backward") repeatEnd = true;
            }
            const ending = barline.getElementsByTagName("ending")[0];
            if (ending) {
              endingNum = parseInt(ending.getAttribute("number"), 10) || 1;
              endingType = ending.getAttribute("type"); // 'start', 'stop', 'discontinue'
            }
          }

          const noteElements = measure.getElementsByTagName("note");
          const notasDoCompasso = [];
          let tempoAcumuladoNoCompasso = 0;
          let ultimaNotaLocal = null;

          let duracaoTotalNotasCompasso = 0;
          for (let i = 0; i < noteElements.length; i++) {
            if (noteElements[i].getElementsByTagName("chord").length > 0) continue;
            const dEl = noteElements[i].getElementsByTagName("duration")[0];
            if (dEl) {
              duracaoTotalNotasCompasso += (parseFloat(dEl.textContent) / currentDivisions);
            }
          }

          let offsetInicial = 0;
          if (m === 0 && duracaoTotalNotasCompasso < beatsPorCompasso && duracaoTotalNotasCompasso > 0) {
            offsetInicial = beatsPorCompasso - duracaoTotalNotasCompasso;
          }
          tempoAcumuladoNoCompasso = offsetInicial;

          let maxDuracaoCompasso = beatsPorCompasso;

          for (let i = 0; i < noteElements.length; i++) {
            const noteEl = noteElements[i];
            
            if (noteEl.getElementsByTagName("chord").length > 0) {
              continue;
            }

            const durationEl = noteEl.getElementsByTagName("duration")[0];
            const durVal = durationEl ? parseFloat(durationEl.textContent) : currentDivisions;
            const dur = durVal / currentDivisions;

            if (noteEl.getElementsByTagName("rest").length > 0) {
              notasDoCompasso.push({ isRest: true, dur, offset: Number(tempoAcumuladoNoCompasso.toFixed(4)) });
              tempoAcumuladoNoCompasso += dur;
              continue;
            }

            const pitchEl = noteEl.getElementsByTagName("pitch")[0];
            if (pitchEl) {
              const step = pitchEl.getElementsByTagName("step")[0]?.textContent || 'C';
              const octave = parseInt(pitchEl.getElementsByTagName("octave")[0]?.textContent || '4', 10);
              const alter = parseInt(pitchEl.getElementsByTagName("alter")[0]?.textContent || '0', 10);
              const freq = pitchToFreq(step, octave, alter);

              const tieElements = noteEl.getElementsByTagName("tied");
              let isTieStop = false;
              let isTieStart = false;

              for (let t = 0; t < tieElements.length; t++) {
                const type = tieElements[t].getAttribute("type");
                if (type === "stop") isTieStop = true;
                if (type === "start") isTieStart = true;
              }

              if (isTieStop) {
                if (ultimaNotaLocal && !ultimaNotaLocal.isRest && ultimaNotaLocal.freq === freq) {
                  ultimaNotaLocal.dur += dur;
                } else if (compassosEstruturados.length > 0) {
                  const ultimoCompasso = compassosEstruturados[compassosEstruturados.length - 1];
                  const ultimaNotaGeral = ultimoCompasso.notas[ultimoCompasso.notas.length - 1];
                  if (ultimaNotaGeral && !ultimaNotaGeral.isRest && ultimaNotaGeral.freq === freq) {
                    ultimaNotaGeral.dur += dur;
                  }
                }
                tempoAcumuladoNoCompasso += dur;
                continue;
              }

              const novaNota = { 
                freq, 
                dur, 
                isRest: false, 
                isTied: isTieStart, 
                offset: Number(tempoAcumuladoNoCompasso.toFixed(4))
              };

              notasDoCompasso.push(novaNota);
              tempoAcumuladoNoCompasso += dur;
              ultimaNotaLocal = novaNota;
            }
          }

          if (tempoAcumuladoNoCompasso > beatsPorCompasso) {
            maxDuracaoCompasso = tempoAcumuladoNoCompasso;
          }

          compassosEstruturados.push({
            numero: numCompasso,
            beatsPorCompasso: maxDuracaoCompasso,
            notas: notasDoCompasso,
            repeatStart,
            repeatEnd,
            endingNum,
            endingType
          });
        }

        // --- MOTOR DE EXPANSAO DE REPETICOES E CASAS (1ª E 2ª VEZ) ---
        // Expande o array linear de compassos para incluir a ordem real de execução das repetições
        const compassosExpandidos = [];
        let i = 0;
        let repeatTargetIndex = 0;
        let passCount = 1; // 1 = primeira vez, 2 = segunda vez

        while (i < compassosEstruturados.length) {
          const comp = compassosEstruturados[i];

          // Se encontrar início de ritornelo, marca o ponto de retorno
          if (comp.repeatStart) {
            repeatTargetIndex = i;
          }

          // Se estiver na 2ª vez e o compasso pertencer à 1ª casa (endingNum === 1), pula ele
          if (passCount === 2 && comp.endingNum === 1) {
            i++;
            continue;
          }

          compassosExpandidos.push({
            ...comp,
            // ID único para garantir que o player saiba distinguir passadas se necessário
            passIndex: passCount 
          });

          // Se encontrar fim de ritornelo
          if (comp.repeatEnd) {
            if (passCount === 1) {
              passCount = 2;
              i = repeatTargetIndex; // Volta para o início do ritornelo
              continue;
            } else {
              passCount = 1; // Reseta para futuras repetições
            }
          }

          i++;
        }

        setCompassos(compassosExpandidos.length > 0 ? compassosExpandidos : compassosEstruturados);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao analisar XML:", err);
        setCarregando(false);
      });

    return () => {
      isMounted = false;
    };
  }, [arquivoXml]);

  return { compassos, carregando };
}