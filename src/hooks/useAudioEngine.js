import { useState, useEffect, useRef } from 'react';

export function useAudioEngine({ bpm, instrumento }) {
  const [volumeMetronomo, setVolumeMetronomo] = useState(0.3);
  const [volumePartitura, setVolumePartitura] = useState(0.7);
  
  const [metronomoMute, setMetronomoMute] = useState(false);
  const [partituraMute, setPartituraMute] = useState(false);

  const [metronomoSolo, setMetronomoSolo] = useState(false);
  const [partituraSolo, setPartituraSolo] = useState(false);

  const audioCtxRef = useRef(null);
  
  // Refs para controle em tempo real (mesmo com a música tocando)
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
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const envelope = ctx.createGain();

      if (instrumento === 'acoustic_grand_piano') {
        osc1.type = 'triangle';
        osc2.type = 'sine';
      } else {
        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
      }

      osc1.frequency.setValueAtTime(freq, ctx.currentTime);
      osc2.frequency.setValueAtTime(freq * 1.002, ctx.currentTime);

      const gainVal = vol * 0.3;
      envelope.gain.setValueAtTime(0.001, ctx.currentTime);
      envelope.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.03);
      envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationInSeconds);

      osc1.connect(envelope);
      osc2.connect(envelope);
      envelope.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + durationInSeconds);
      osc2.stop(ctx.currentTime + durationInSeconds);
    } catch (e) {
      console.error("Erro na reprodução da nota:", e);
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
    setPartituraSolo
  };
}