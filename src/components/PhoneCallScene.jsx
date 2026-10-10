import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { useScene, SCENES } from '../context/SceneProvider';

export default function PhoneCallScene({ onComplete }) {
  const [callState, setCallState] = useState('ringing'); // ringing, connected, ended
  const [dialogIdx, setDialogIdx] = useState(0);
  const canvasRef = useRef(null);

  const dialogs = [
    { sender: 'abishek', text: "Hey Saranya..." },
    { sender: 'saranya', text: "Hey Abishek! 😊" },
    { sender: 'abishek', text: "Do you remember how we first met?" },
    { sender: 'saranya', text: "Of course! It started with a phone call. 📱" },
    { sender: 'abishek', text: "Yeah... funny how one ordinary call can become the beginning of everything." }
  ];

  const handleAnswer = () => {
    setCallState('connected');
    if (window.playRomanticChime) window.playRomanticChime();
  };

  const handleDecline = () => {
    // Decline bounces back with soft reminder
    if (window.triggerNoSoundDesign) window.triggerNoSoundDesign();
    alert("I think you should answer... there is something I want to tell you! 📞❤️");
  };

  // Dialogue progression loop
  useEffect(() => {
    if (callState !== 'connected') return;

    const timer = setInterval(() => {
      setDialogIdx(prev => {
        if (prev < dialogs.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 3800);

    return () => clearInterval(timer);
  }, [callState]);

  // Waveform render loop
  useEffect(() => {
    if (callState !== 'connected') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(242, 133, 168, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      phase += 0.15;

      for (let x = 0; x < canvas.width; x++) {
        // Multi-sine composite wave
        const y = canvas.height / 2 +
          Math.sin(x * 0.04 + phase) * 12 * Math.sin(phase * 0.5) +
          Math.sin(x * 0.08 - phase * 1.5) * 4;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [callState]);

  const current = dialogs[dialogIdx];
  const isFinished = callState === 'connected' && dialogIdx === dialogs.length - 1;

  return (
    <div className="w-full max-w-sm mx-auto p-6 md:p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-2xl border border-white/5">
      {callState === 'ringing' ? (
        <div className="flex flex-col items-center justify-between flex-grow text-center">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold animate-pulse">
              Incoming Connection
            </span>
            <h3 className="text-xl md:text-2xl font-playfair font-semibold text-white tracking-wide">
              Saranya 🌸
            </h3>
            <p className="text-[11px] text-gray-500 font-medium">Connecting from the heart...</p>
          </div>

          {/* Ringing concentric waves and Avatar Portrait */}
          <div className="relative w-28 h-28 my-6 flex items-center justify-center pointer-events-none">
            {/* Concentric expanding ripples */}
            <div className="absolute inset-0 rounded-full border border-rose-500/20 animate-ping-slow" />
            <div className="absolute inset-2 rounded-full border border-rose-500/30 animate-ping-medium" />
            <div className="absolute inset-4 rounded-full border border-rose-500/40 animate-ping-fast" />
            
            {/* Pulsing Avatar Portrait */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#1b0a1d] to-[#3a0c28] border-2 border-rose-400 flex flex-col items-center justify-center text-rose-200 shadow-[0_0_24px_rgba(244,114,182,0.35)] animate-pulse">
              <span className="text-2xl font-playfair font-black tracking-widest text-[#fffbe6]">S</span>
              <span className="text-[8px] tracking-widest uppercase font-sans font-bold mt-0.5 text-rose-300">Saranya</span>
            </div>
          </div>

          {/* Call actions */}
          <div className="flex gap-8 justify-center w-full pointer-events-auto">
            {/* Decline Button (Obsidian Glass styling) */}
            <button
              onClick={handleDecline}
              className="w-12 h-12 rounded-full bg-red-950/40 hover:bg-red-600 border border-red-500/30 text-red-200 hover:text-white flex items-center justify-center shadow-lg active:scale-95 hover:scale-105 transition-all duration-300"
              aria-label="Decline Call"
            >
              <PhoneOff size={16} />
            </button>
            
            {/* Accept Button (Emerald Glow styling) */}
            <button
              onClick={handleAnswer}
              className="w-12 h-12 rounded-full bg-emerald-950/40 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-200 hover:text-white flex items-center justify-center shadow-lg active:scale-95 hover:scale-105 transition-all duration-300 animate-pulse"
              aria-label="Answer Call"
            >
              <Phone size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between flex-grow">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Connected
            </span>
            <span className="text-[10px] text-rose-300 font-bold">
              Saranya • Abishek
            </span>
          </div>

          {/* Dialog area */}
          <div className="flex-grow flex items-center justify-center min-h-[140px] px-2 text-center">
            <div key={dialogIdx} className="space-y-1.5 animate-fadeIn">
              <p className="text-[10px] uppercase font-bold text-rose-400/80 tracking-widest">
                {current.sender === 'abishek' ? 'Abishek' : 'Saranya'}
              </p>
              <p className="text-sm md:text-base text-white leading-relaxed font-sans font-medium">
                {current.text}
              </p>
            </div>
          </div>

          {/* Sound Wave Visualizer */}
          <div className="my-4 h-12 w-full flex items-center justify-center bg-black/10 rounded-2xl overflow-hidden">
            <canvas ref={canvasRef} width="280" height="48" className="w-full h-full" />
          </div>

          {/* Navigation to next */}
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-center">
            <button
              onClick={onComplete}
              disabled={!isFinished}
              className="btn-primary disabled:bg-white/5 disabled:text-gray-500 disabled:border-white/5 disabled:scale-100 disabled:pointer-events-none disabled:shadow-none pointer-events-auto"
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
