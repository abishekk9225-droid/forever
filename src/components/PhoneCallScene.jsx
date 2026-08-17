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
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold animate-pulse">
              Incoming Call
            </span>
            <h3 className="text-xl md:text-2xl font-playfair font-semibold text-white">
              Saranya 🌸
            </h3>
            <p className="text-[11px] text-gray-500">Connecting from the heart...</p>
          </div>

          {/* Ringing waves */}
          <div className="relative w-24 h-24 my-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-rose-500/20 animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/35 flex items-center justify-center text-rose-400">
              <Phone size={24} className="animate-bounce" />
            </div>
          </div>

          {/* Call actions */}
          <div className="flex gap-8 justify-center w-full">
            <button
              onClick={handleDecline}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <PhoneOff size={18} />
            </button>
            <button
              onClick={handleAnswer}
              className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform animate-pulse"
            >
              <Phone size={18} />
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
              className={`px-8 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                isFinished
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-md shadow-rose-500/10'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
