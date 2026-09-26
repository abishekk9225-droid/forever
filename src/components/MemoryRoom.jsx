import React, { useState, useEffect, useRef } from 'react';
import { memoriesData, deskObjects } from '../data/memories';
import { Sparkles, ArrowRight, X, Volume2, VolumeX } from 'lucide-react';

export default function MemoryRoom({ onProceed }) {
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedDeskItem, setSelectedDeskItem] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
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
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setAudioPlaying(true);
      }).catch((e) => {
        console.warn('Audio playback error:', e);
      });
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
      
      {/* Cinematic Ambient Lighting */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-pink-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-pink-300/30 blur-[0.5px] animate-pulse"
            style={{
              top: `${(i * 17 + 5) % 96}%`,
              left: `${(i * 23 + 9) % 96}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              animationDuration: `${(i % 4) + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Top Header & Ambient Audio Toggle */}
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

      {/* Main 3D Memory Wall (Frames with Metallic Finish & Glow) */}
      <main className="relative z-10 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {memoriesData.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMemory(item)}
              className="group cursor-pointer rounded-2xl p-2 bg-gradient-to-b from-slate-800/60 to-slate-900/90 border border-slate-700/60 hover:border-pink-500/80 shadow-lg hover:shadow-[0_0_35px_rgba(244,63,94,0.4)] transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                <span className="absolute bottom-2 left-2 text-[10px] tracking-wider text-pink-300 font-semibold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>
              <p className="text-center text-xs font-medium text-slate-300 mt-2 truncate group-hover:text-pink-300">
                {item.title}
              </p>
            </div>
          ))}
        </div>

        {/* Vintage Desk / Table Objects */}
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

      {/* Modal 1: Enlarged Photo Wall Zoom with Emotional Kavithai */}
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

      {/* Modal 2: Desk Keepsake Object Details */}
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
