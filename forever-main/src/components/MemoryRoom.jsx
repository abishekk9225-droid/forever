import React, { useState, useEffect, useRef } from 'react';
import { memoriesData, deskObjects } from '../data/memories';
import { Sparkles, ArrowRight, X, Volume2, VolumeX, Lock } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import CinematicRainbowBorder from './CinematicRainbowBorder';

const LETTER_POSITIONS = [
  { x: 12, y: 22 },  // S
  { x: 84, y: 18 },  // A
  { x: 18, y: 78 },  // R
  { x: 80, y: 82 },  // A
  { x: 8,  y: 50 },  // N
  { x: 90, y: 52 },  // Y
  { x: 50, y: 14 },  // A
];

export default function MemoryRoom({
  onProceed,
  toggleAudio: propToggleAudio,
  isPlaying: propIsPlaying,
  isAudioPlaying,
}) {
  const soundContext = useSound();

  const audioPlaying =
    propIsPlaying !== undefined
      ? Boolean(propIsPlaying)
      : isAudioPlaying !== undefined
      ? Boolean(isAudioPlaying)
      : Boolean(soundContext?.isPlaying);

  const toggleAudio =
    propToggleAudio ||
    soundContext?.toggleAudio ||
    soundContext?.toggleSound ||
    window.soundController?.toggleAudio ||
    window.soundController?.toggleSound ||
    window.toggleAudio ||
    (() => {});

  const [unlockedDoors, setUnlockedDoors] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedDeskItem, setSelectedDeskItem] = useState(null);
  const [butterflies, setButterflies] = useState([]);
  const [isCombined, setIsCombined] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Trigger Flying Butterflies from Click Position on opened doors
  const triggerButterflies = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const newButterflies = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x: originX,
      y: originY,
      targetX: originX + (Math.random() - 0.5) * 600,
      targetY: originY - Math.random() * 500 - 100,
      size: Math.random() * 1.2 + 1.2,
      duration: Math.random() * 1.5 + 1.8,
    }));

    setButterflies((prev) => [...prev, ...newButterflies]);
    setTimeout(() => {
      setButterflies((prev) => prev.filter((b) => !newButterflies.find((nb) => nb.id === b.id)));
    }, 3000);
  };

  const handleFrameClick = (e, item) => {
    if (!unlockedDoors.includes(item.id)) {
      const nextUnlocked = [...unlockedDoors, item.id];
      setUnlockedDoors(nextUnlocked);

      // When all 7 doors are unlocked, trigger the cinematic convergence
      if (nextUnlocked.length === 7) {
        setTimeout(() => setIsCombined(true), 1500);
        setTimeout(() => setShowBurst(true), 4000);
        setTimeout(() => {
          setIsCombined(false);
          setShowBurst(false);
        }, 8500);
      }
    } else {
      triggerButterflies(e);
      setSelectedMemory(item);
    }
  };

  // Canvas Butterfly Burst System for Convergence
  useEffect(() => {
    if (!showBurst || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const particles = Array.from({ length: 90 }).map(() => ({
      x: centerX,
      y: centerY,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 5 + 3,
      size: Math.random() * 14 + 12,
      opacity: 1,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      curve: (Math.random() - 0.5) * 0.04,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.angle += p.curve;
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed - 0.8;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.009;

        if (p.opacity > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.font = `${p.size}px serif`;
          ctx.fillText('🦋', -p.size / 2, p.size / 2);
          ctx.restore();
        }
      });

      if (particles.some((p) => p.opacity > 0)) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [showBurst]);

  const handleProceed = () => {
    if (typeof onProceed === 'function') {
      onProceed();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col justify-between p-4 md:p-8 relative overflow-hidden select-none animate-in fade-in duration-700">
      {/* Screen-level Travelling Rainbow Border */}
      <CinematicRainbowBorder mode="screen" />
      
      {/* 1. Continuous Rising Neon Hearts */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-500/80 animate-rise-heart drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]"
            style={{
              left: `${(i * 2.5) % 96}%`,
              bottom: '-40px',
              fontSize: `${(i % 3) * 0.4 + 1.2}rem`,
              animationDuration: `${(i % 4) + 4}s`,
              animationDelay: `${(i % 6) * 0.8}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* 2. Flying Butterflies Layer (from door clicks) */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {butterflies.map((b) => (
          <div
            key={b.id}
            className="absolute transition-all ease-out animate-butterfly-flight"
            style={{
              left: `${b.x}px`,
              top: `${b.y}px`,
              '--dx': `${b.targetX - b.x}px`,
              '--dy': `${b.targetY - b.y}px`,
              '--s': b.size,
              animationDuration: `${b.duration}s`,
            }}
          >
            <span className="inline-block animate-bounce drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]">
              🦋
            </span>
          </div>
        ))}
      </div>

      {/* 3. Canvas for Butterfly Burst on S A R A N Y A Convergence */}
      {showBurst && (
        <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />
      )}

      {/* 4. Floating S A R A N Y A Letters Overlay System */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {isCombined ? (
          /* Converged "S A R A N Y A" in Center */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-1000 animate-in fade-in">
            <div className="flex gap-4 md:gap-7 items-center justify-center">
              {['S', 'A', 'R', 'A', 'N', 'Y', 'A'].map((char, idx) => (
                <span
                  key={idx}
                  className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-widest text-amber-200 drop-shadow-[0_0_25px_rgba(244,63,94,0.95)] animate-pulse"
                >
                  {char}
                </span>
              ))}
            </div>
            <p className="text-pink-300 text-xs md:text-sm tracking-widest uppercase mt-4 opacity-90 animate-bounce">
              Forever In Every Memory ✨
            </p>
          </div>
        ) : (
          /* Individual Floating Letters for Unlocked Doors */
          memoriesData.map((item, idx) => {
            const isUnlocked = unlockedDoors.includes(item.id);
            if (!isUnlocked) return null;
            const pos = LETTER_POSITIONS[idx];

            return (
              <div
                key={item.id}
                className="absolute text-2xl md:text-4xl font-serif font-extrabold text-amber-200/90 drop-shadow-[0_0_18px_rgba(244,63,94,0.85)] animate-pulse transition-all duration-1000 select-none"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {item.letter}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-pink-500/20 pb-4">
        <div>
          <span className="text-pink-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 3D Virtual Gallery
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-white mt-1">Our Memory Room</h1>
        </div>

        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-pink-500/30 text-pink-300 text-xs hover:border-pink-400 transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)] cursor-pointer"
        >
          {audioPlaying ? <Volume2 className="w-4 h-4 text-pink-400 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          <span>{audioPlaying ? "♫ Ambient Memories" : "Play Music"}</span>
        </button>
      </header>

      {/* 6. Main 7-Door Photo Grid */}
      <main className="relative z-10 py-6 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {memoriesData.map((item) => {
            const isOpen = unlockedDoors.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={(e) => handleFrameClick(e, item)}
                className="group cursor-pointer rounded-2xl p-2 bg-gradient-to-b from-slate-800/60 to-slate-900/90 border border-slate-700/60 hover:border-pink-500/80 shadow-lg hover:shadow-[0_0_35px_rgba(244,63,94,0.4)] transition-all duration-500 transform hover:-translate-y-2 relative"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                  
                  {/* Photo Layer */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover object-center transition-all duration-1000 ${
                      isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
                    }`}
                  />

                  {/* Sealed Door State */}
                  {!isOpen && (
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-950 flex flex-col items-center justify-center p-3 text-center z-10 transition-all duration-700 border border-pink-500/30 rounded-xl group-hover:border-pink-500/70">
                      <div className="w-11 h-11 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                        <Lock className="w-4 h-4 text-pink-300" />
                      </div>
                      <span className="text-[11px] font-semibold text-pink-200 mt-2 uppercase tracking-wider">
                        Door {item.id}
                      </span>
                    </div>
                  )}

                  {isOpen && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                      <span className="absolute bottom-2 left-2 text-[10px] tracking-wider text-pink-300 font-semibold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                        {item.tag}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-center text-xs font-medium text-slate-300 mt-2 truncate group-hover:text-pink-300">
                  {isOpen ? item.title : `Door ${item.id}`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Vintage Desk Keepsakes */}
        <div className="mt-8 p-4 rounded-3xl bg-slate-950/60 border border-pink-500/20 backdrop-blur-xl flex flex-wrap items-center justify-around gap-4">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">The Desk of Keepsakes:</span>
          {deskObjects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => setSelectedDeskItem(obj)}
              className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-pink-400 text-xs text-pink-200 hover:scale-105 transition-all shadow-sm cursor-pointer"
            >
              {obj.name}
            </button>
          ))}
        </div>
      </main>

      {/* 7. Footer Navigation */}
      <footer className="relative z-10 flex justify-end pt-4 border-t border-slate-800">
        <button
          onClick={handleProceed}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 shadow-[0_0_25px_rgba(244,63,94,0.4)] text-white text-sm transition-transform active:scale-95 cursor-pointer"
        >
          <span>Open Letters 💌</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* 8. Modal: Zoomed Photo with Kavithai */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900/95 border border-pink-500/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.4)] relative animate-in fade-in zoom-in-95 duration-300 space-y-4">
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-pink-500/30 bg-slate-950">
              <img src={selectedMemory.image} alt={selectedMemory.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex justify-between items-center text-xs text-pink-400 font-semibold uppercase">
                <span>{selectedMemory.tag}</span>
                <span>{selectedMemory.date}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-white mt-1">{selectedMemory.title}</h3>
              <p className="text-slate-200 text-sm italic mt-2 leading-relaxed bg-pink-950/30 p-3 rounded-xl border border-pink-500/20">
                "{selectedMemory.quote}"
              </p>
            </div>
            <button
              onClick={() => setSelectedMemory(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              ← Back to Memory Room
            </button>
          </div>
        </div>
      )}

      {/* 9. Modal: Desk Object */}
      {selectedDeskItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900/95 border border-pink-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(244,63,94,0.3)] relative text-center space-y-4">
            <button
              onClick={() => setSelectedDeskItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mt-2">{selectedDeskItem.name}</h3>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "{selectedDeskItem.message}"
            </p>
            <button
              onClick={() => setSelectedDeskItem(null)}
              className="w-full py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
