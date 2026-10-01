import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../context/SoundContext';

export default function AudioPlayer() {
  const { isPlaying, toggleSound } = useSound();

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleSound();
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-rose-400/40 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
      {/* Equalizer Waveform */}
      {isPlaying && (
        <div className="flex items-end gap-1 h-4">
          {[0.6, 1, 0.4, 0.8, 0.5].map((scale, i) => (
            <span
              key={i}
              className="w-1 bg-rose-400 rounded-full animate-pulse"
              style={{
                height: `${scale * 100}%`,
                animationDuration: `${0.4 + i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleToggle}
        type="button"
        className="text-white hover:text-rose-300 transition cursor-pointer"
        aria-label="Toggle Sound"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-rose-400"/>
        ) : (
          <VolumeX className="w-5 h-5 text-rose-300/60"/>
        )}
      </button>
    </div>
  );
}
