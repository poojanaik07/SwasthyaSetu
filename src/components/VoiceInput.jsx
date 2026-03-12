import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { analyzeSeverity } from '../utils/symptomSeverity';

const WAVEFORM_BARS = 20;

export default function VoiceInput({ onTranscript, onSeverityDetected }) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [bars, setBars] = useState(Array(WAVEFORM_BARS).fill(4));
  const recognitionRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }

    const rec = new SpeechRecognition();
    rec.lang = 'hi-IN,en-IN,en-US';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      const combined = (transcript + final + interim).trim();
      setTranscript(combined);
      onTranscript?.(combined);
      if (final.trim()) {
        const severity = analyzeSeverity(combined);
        if (severity) onSeverityDetected?.(severity);
      }
    };

    rec.onerror = () => stopRecording();
    rec.onend = () => { if (recording) rec.start(); };
    recognitionRef.current = rec;
  }, [recording, transcript]);

  const animateBars = () => {
    setBars(Array(WAVEFORM_BARS).fill(0).map(() => Math.floor(Math.random() * 32) + 4));
    animFrameRef.current = setTimeout(animateBars, 120);
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }
    const rec = new SpeechRecognition();
    rec.lang = 'hi-IN';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + ' ';
      const cleaned = text.trim();
      setTranscript(cleaned);
      onTranscript?.(cleaned);
      const severity = analyzeSeverity(cleaned);
      if (severity) onSeverityDetected?.(severity);
    };
    rec.onerror = () => stopRecording();
    recognitionRef.current = rec;
    rec.start();
    setRecording(true);
    animateBars();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
    clearTimeout(animFrameRef.current);
    setBars(Array(WAVEFORM_BARS).fill(4));
  };

  if (!supported) {
    return (
      <div style={{ padding: '12px', background: '#fef9c3', borderRadius: '12px', fontSize: '14px', color: '#a16207', marginBottom: '16px' }}>
        🎤 Voice input not supported in this browser. Please use Chrome or Edge on Android/Desktop.
      </div>
    );
  }

  return (
    <div className="voice-section">
      <button
        className={`voice-btn ${recording ? 'recording' : ''}`}
        onClick={recording ? stopRecording : startRecording}
        title={recording ? 'Stop recording' : 'Start voice input'}
      >
        {recording ? <Square size={28} fill="white" /> : <Mic size={28} />}
      </button>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: recording ? '#ef4444' : '#6366f1', marginBottom: '8px' }}>
          {recording ? '🔴 Listening... Speak in Hindi or English' : '🎤 Tap to describe symptoms by voice'}
        </div>
        <div className="waveform">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`waveform-bar ${recording ? 'active' : ''}`}
              style={{
                height: `${h}px`,
                background: recording ? '#ef4444' : '#6366f1',
                animationDelay: `${(i % 6) * 0.08}s`,
                opacity: recording ? 1 : 0.3
              }}
            />
          ))}
        </div>
        {transcript && (
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>
            "{transcript}"
          </div>
        )}
      </div>
    </div>
  );
}
