import React, { useState, useEffect, useRef } from 'react';
import { memoriesData, deskObjects } from '../data/memories';
import { Sparkles, ArrowRight, X, Volume2, VolumeX, Lock, Unlock } from 'lucide-react';

export default function MemoryRoom({ onProceed }) {
  const [unlockedDoors, setUnlockedDoors] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedDeskItem, setSelectedDeskItem] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [butterflies, setButterflies] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const audio = new Audio('/bgm.mp3');
      audio.loop = true;
      audio.volume = 0.35;
      audioRef.current = audio;
    } catch (e) {
      console.warn('Audio init error:', e);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) {
      setAudioPlaying(!audioPlaying);
      return;
    }
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setAudioPlaying(true);
      }).catch((e) => {
        console.warn('Playback error:', e);
        setAudioPlaying(true);
      });
    }
  };

  // Trigger Flying Butterflies from Click Position
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
      // First click: Open Door
      setUnlockedDoors((prev) => [...prev, item.id]);
    } else {
      // Already open: Spawn butterflies & open kavithai modal
      triggerButterflies(e);
      setSelectedMemory(item);
    }
  };

  const handleProceed = () => {
    if (audioRef.current && audioPlaying) {
      try {
        audioRef.current.pause();
      } catch (e) {}
    }
    if (typeof onProceed === 'function') {
      onProceed();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 flex flex-col justify-between p-6 md:p-10 relative overflow-hidden select-none animate-in fade-in duration-700">
      
      {/* 1. Continuous Rising Neon Hearts (Just like Celebration Scene) */}
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

      {/* 2. Flying Butterflies Layer */}
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

      {/* Header */}
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

      {/* Main Memory Wall with Mystery Doors */}
      <main className="relative z-10 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
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

                  {/* Mystery Door Layer (Closed State) */}
                  {!isOpen && (
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-950 flex flex-col items-center justify-center p-4 text-center z-10 transition-all duration-700 border border-pink-500/30 rounded-xl group-hover:border-pink-500/70">
                      <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                        <Lock className="w-5 h-5 text-pink-300" />
                      </div>
                      <span className="text-[11px] font-semibold text-pink-200 mt-3 uppercase tracking-wider">
                        Tap to Unlock
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

      {/* Footer Navigation */}
      <footer className="relative z-10 flex justify-end pt-4 border-t border-slate-800">
        <button
          onClick={handleProceed}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 shadow-[0_0_25px_rgba(244,63,94,0.4)] text-white text-sm transition-transform active:scale-95 cursor-pointer"
        >
          <span>Open Letters 💌</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* Modal: Zoomed Photo with Kavithai */}
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

      {/* Modal: Desk Object */}
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
