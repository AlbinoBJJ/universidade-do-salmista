import { useState, useEffect, useRef } from 'react';
import Soundfont from 'soundfont-player';

export function useSoundfontEngine({ bpm, instrumento }) {
  const [volumeMetronomo, setVolumeMetronomo] = useState(0.3);
  const [volumePartitura, setVolumePartitura] = useState(0.7);
  
  const [metronomoMute, setMetronomoMute] = useState(false);
  const [partituraMute, setPartituraMute] = useState(false);

  const [metronomoSolo, setMetronomoSolo] = useState(false);
  const [partituraSolo, setPartituraSolo] = useState(false);

  const audioCtxRef = useRef(null);
  const instrumentPlayerRef = useRef(null);
  const [carregandoSom, setCarregandoSom] = useState(false);

  // Refs para controle em tempo real
  const volumeMetronomoRef = useRef(volumeMetronomo);
  const volumePartituraRef = useRef(volumePartitura);
  const metronomoMuteRef = useRef(metronomoMute);
  const partituraMuteRef = useRef(partituraMute);
  const metronomoSoloRef = useRef(metronomoSolo);
  const partituraSoloRef = useRef(partituraSolo);

  useEffect(() => { volumeMetronomoRef.current = volumeMetronomo; }, [volumeMetronomo]);
  useEffect(() => { volumePartituraRef.current = volumePartitura; }, [volumePartitura]);
  useEffect(() => { metronomoMuteRef.current = metronomoMute; }, [metronomoMute]);
  useEffect(() => { partituraMuteRef.current = partituraMute; }, [partituraMute]);
  useEffect(() => { metronomoSoloRef.current = metronomoSolo; }, [metronomoSolo]);
  useEffect(() => { partituraSoloRef.current = partituraSolo; }, [partituraSolo]);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Carrega o instrumento via Soundfont quando o usuário seleciona
  useEffect(() => {
    let isMounted = true;
    const ctx = getAudioContext();
    if (!ctx) return;

    setCarregandoSom(true);
    // Mapeia os nomes dos instrumentos para o padrão suportado pelo Soundfont
    let soundfontName = 'acoustic_grand_piano';
    if (instrumento === 'acoustic_guitar_steel' || instrumento === 'acoustic_guitar_nylon') {
      soundfontName = 'acoustic_guitar_nylon';
    }

    Soundfont.instrument(ctx, soundfontName, { soundfont: 'MusyngKite' })
      .then((player) => {
        if (isMounted) {
          instrumentPlayerRef.current = player;
          setCarregandoSom(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar soundfont:", err);
        if (isMounted) setCarregandoSom(false);
      });

    return () => {
      isMounted = false;
    };
  }, [instrumento]);

  const playClick = (isHighPitch = false) => {
    if (metronomoMuteRef.current) return;
    const anySolo = metronomoSoloRef.current || partituraSoloRef.current;
    if (anySolo && !metronomoSoloRef.current) return;

    const vol = volumeMetronomoRef.current;
    if (vol <= 0) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const envelope = ctx.createGain();

      let freq = isHighPitch ? 880 : 440;
      osc.type = 'sine';

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      envelope.gain.setValueAtTime(vol, ctx.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

      osc.connect(envelope);
      envelope.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error("Erro no áudio do metrônomo:", e);
    }
  };

  const playNote = (freq, durationInSeconds) => {
    if (partituraMuteRef.current) return;
    const anySolo = metronomoSoloRef.current || partituraSoloRef.current;
    if (anySolo && !partituraSoloRef.current) return;

    const vol = volumePartituraRef.current;
    if (vol <= 0) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (instrumentPlayerRef.current) {
        // Reproduz usando o player de Soundfont de alta fidelidade
        // Converte frequência Hz para número MIDI note number
        const midiNote = Math.round(69 + 12 * Math.log2(freq / 440));
        instrumentPlayerRef.current.play(midiNote, ctx.currentTime, {
          gain: vol * 1.5,
          duration: durationInSeconds
        });
      } else {
        // Fallback de segurança caso o soundfont ainda esteja carregando
        const osc = ctx.createOscillator();
        const envelope = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        envelope.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
        envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationInSeconds);
        osc.connect(envelope);
        envelope.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + durationInSeconds);
      }
    } catch (e) {
      console.error("Erro na reprodução da nota Soundfont:", e);
    }
  };

  return {
    playClick,
    playNote,
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
    carregandoSom,
    tipoMotor: 'soundfont'
  };
}