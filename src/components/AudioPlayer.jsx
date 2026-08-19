import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AUDIO_SRC = '/bgm.mp3.mp3';
const CLIMAX_TIMESTAMP = 219;

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const startPlayback = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = false;
    audioRef.current.volume = 0.75;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      })
      .catch((err) => console.warn("Audio unlock pending interaction:", err));
  };

  useEffect(() => {
    window.unlockAudio = startPlayback;
    window.triggerClimaxAudio = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = CLIMAX_TIMESTAMP;
        audioRef.current.volume = 0.95;
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
        setIsMuted(false);
      }
    };

    const handleGlobalTap = () => {
      startPlayback();
      window.removeEventListener('click', handleGlobalTap);
      window.removeEventListener('touchstart', handleGlobalTap);
    };

    window.addEventListener('click', handleGlobalTap, { once: true });
    window.addEventListener('touchstart', handleGlobalTap, { once: true });

    return () => {
      window.removeEventListener('click', handleGlobalTap);
      window.removeEventListener('touchstart', handleGlobalTap);
    };
  }, []);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (audioRef.current.paused || isMuted) {
      startPlayback();
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" playsInline />

      {/* Floating Visualizer & Volume Pill */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-rose-400/40 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
        {/* Equalizer Waveform */}
        {isPlaying && !isMuted && (
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
          onClick={toggleSound}
          type="button"
          className="text-white hover:text-rose-300 transition cursor-pointer"
          aria-label="Toggle Sound"
        >
          {isPlaying && !isMuted ? (
            <Volume2 className="w-5 h-5 text-rose-400"/>
          ) : (
            <VolumeX className="w-5 h-5 text-rose-300/60"/>
          )}
        </button>
      </div>
    </>
  );
}
