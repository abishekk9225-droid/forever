import React, { useState, useEffect, useRef } from 'react';
import { Music, ArrowRight, Sparkles, Disc3, Volume2, VolumeX } from 'lucide-react';

const TAMIL_LYRICS = [
  "உன் ஒற்றைப் பார்வையில் என் உலகம் உறைந்தது...",
  "சொல்லாத வார்த்தைகள் யாவும் என் மௌனத்தில் வாழ்ந்தது...",
  "எத்தனை ஜென்மம் வந்தாலும் நீயே என் சுவாசமடி...",
  "உன் இதயத்துடிப்பில் நான் வாழ ஏங்கினேன் சரண்யா... ❤️"
];

export default function EmotionalSongLyricScene({ audioInstance, onComplete }) {
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);
  const isTransitioningRef = useRef(false);
  // Hard 30-second scene wall — transitions exactly once at mount + 30s
  const sceneTimerRef = useRef(null);

  useEffect(() => {
    sceneTimerRef.current = setTimeout(() => {
      handleComplete();
    }, 30000);
    return () => {
      if (sceneTimerRef.current) {
        clearTimeout(sceneTimerRef.current);
        sceneTimerRef.current = null;
      }
    };
    // handleComplete is stable (uses refs only) — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with audio instance or initialize fallback
  useEffect(() => {
    let audio = audioInstance;

    if (!audio) {
      audio = new Audio('/abi.mp3');
      audio.preload = 'auto';
      audio.volume = 0.18;
      audio.play().catch(() => {
        const fallback = new Audio('/abi.mp3.mpeg');
        fallback.preload = 'auto';
        fallback.volume = 0.18;
        fallback.play().catch(() => {});
        audio = fallback;
      });
    }

    audioRef.current = audio;

    if (audio) {
      if (!audio.paused) {
        setIsPlayingAudio(true);
      } else {
        audio.play()
          .then(() => setIsPlayingAudio(true))
          .catch(() => setIsPlayingAudio(false));
      }

      const onPlay = () => setIsPlayingAudio(true);
      const onPause = () => setIsPlayingAudio(false);
      // Do NOT trigger handleComplete on ended — the 30-second timer is the sole gate
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);

      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioInstance]);

  // Cinematic Synced Tamil Typewriter Effect
  useEffect(() => {
    if (currentLineIdx >= TAMIL_LYRICS.length) {
      // All lyrics displayed — stay on screen until the 30-second timer fires
      return;
    }

    const fullLine = TAMIL_LYRICS[currentLineIdx];
    let charIndex = 0;
    setDisplayText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex <= fullLine.length) {
        setDisplayText(fullLine.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);

        // Hold lyric line for 3.5 seconds, then move to next
        const holdTimer = setTimeout(() => {
          setCurrentLineIdx((prev) => prev + 1);
        }, 3500);

        return () => clearTimeout(holdTimer);
      }
    }, 65);

    return () => clearInterval(typeInterval);
  }, [currentLineIdx]);

  const togglePlayPause = () => {
    if (!audioRef.current) {
      const newAudio = new Audio('/abi.mp3');
      audioRef.current = newAudio;
    }
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {
          const fallback = new Audio('/abi.mp3.mpeg');
          audioRef.current = fallback;
          fallback.play().then(() => setIsPlayingAudio(true)).catch(() => {});
        });
    } else {
      audio.pause();
      setIsPlayingAudio(false);
    }
  };

  const handleComplete = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    // Smooth audio fade out before scene change
    if (audioRef.current) {
      const audio = audioRef.current;
      const startVol = audio.volume;
      const startTime = performance.now();
      const fadeDuration = 1200;
      const fadeStep = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / fadeDuration);
        audio.volume = Math.max(0, startVol * (1 - progress));
        if (progress < 1) {
          requestAnimationFrame(fadeStep);
        } else {
          audio.pause();
          if (typeof onComplete === 'function') onComplete();
        }
      };
      requestAnimationFrame(fadeStep);
    } else {
      if (typeof onComplete === 'function') onComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#030712] text-slate-100 flex flex-col justify-between items-center p-6 md:p-12 overflow-hidden select-none z-50 animate-in fade-in duration-1000">
      
      {/* Background Atmosphere: Deep Starry Glows & Breathing Rose Pulses */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[170px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-700/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-700/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Floating Stardust / Sparkle Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '15%', left: '20%', size: '3px', delay: '0s' },
          { top: '35%', left: '80%', size: '2px', delay: '1s' },
          { top: '65%', left: '15%', size: '3px', delay: '2s' },
          { top: '80%', left: '85%', size: '2px', delay: '0.5s' },
          { top: '50%', left: '50%', size: '2.5px', delay: '1.5s' },
          { top: '25%', left: '70%', size: '2px', delay: '2.5s' },
        ].map((p, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-pink-300/40 blur-[0.5px] animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: '3.5s',
            }}
          />
        ))}
      </div>

      {/* Top Header Badge, Vinyl Record, and Play/Pause Toggle */}
      <header className="relative z-10 flex flex-col items-center gap-3 mt-2">
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/30 text-pink-300 text-xs shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse">
          <Music className="w-3.5 h-3.5 text-rose-400" />
          <span className="tracking-widest uppercase font-semibold">A Melody From My Soul</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
        </div>

        {/* Retro Pulsing Vinyl Icon with spinning glow */}
        <div className="relative flex items-center justify-center">
          <div
            onClick={togglePlayPause}
            className="w-14 h-14 rounded-full bg-slate-950 border-2 border-pink-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.4)] cursor-pointer hover:scale-105 transition-transform"
          >
            <Disc3
              className={`w-8 h-8 text-pink-400/80 ${isPlayingAudio ? 'animate-spin' : ''}`}
              style={{ animationDuration: '8s' }}
            />
          </div>
          <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-md animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
        </div>

        {/* Fallback Play/Pause Toggle Pill */}
        <button
          onClick={togglePlayPause}
          type="button"
          className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-pink-500/30 text-pink-200 text-xs transition cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.25)]"
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Playing 🎵</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span className="text-amber-200 font-medium">Tap to Play Song 🔊</span>
            </>
          )}
        </button>
      </header>

      {/* Main Lyric Theater */}
      <main className="relative z-10 max-w-3xl w-full text-center my-auto px-4 space-y-8">
        
        {/* Animated Live Equalizer Waveform */}
        <div className="flex items-center justify-center gap-1.5 h-9">
          {[40, 70, 95, 60, 100, 75, 90, 50, 85].map((height, i) => (
            <span
              key={i}
              className="w-1 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-200 rounded-full"
              style={{
                height: isPlayingAudio ? `${height}%` : '20%',
                animation: isPlayingAudio ? `pulse ${0.5 + (i * 0.1)}s ease-in-out infinite alternate` : 'none',
                boxShadow: '0 0 8px rgba(244,63,94,0.6)',
              }}
            />
          ))}
        </div>

        {/* Dynamic Tamil Lyric Reveal */}
        <div className="min-h-[160px] flex items-center justify-center px-2">
          <p className="text-2xl sm:text-3xl md:text-5xl font-serif font-extrabold leading-relaxed tracking-wide bg-gradient-to-r from-amber-100 via-rose-200 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(244,63,94,0.8)]">
            {displayText}
            {isTyping && <span className="text-pink-400 animate-pulse ml-1 inline-block">|</span>}
          </p>
        </div>

        {/* Lyric Progression Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {TAMIL_LYRICS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentLineIdx
                  ? 'w-7 bg-pink-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                  : idx < currentLineIdx
                  ? 'w-2 bg-pink-500/40'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <p className="text-slate-400/90 text-xs sm:text-sm font-light tracking-widest italic opacity-85">
          "Listen to every word... it's written only for you ✨"
        </p>
      </main>

      {/* Bottom Action Button */}
      <footer className="relative z-10 mb-4">
        <button
          onClick={handleSkip}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-medium text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-900 border border-pink-500/40 hover:border-pink-500 text-pink-200 hover:text-white shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:shadow-[0_0_35px_rgba(244,63,94,0.6)] transition-all transform hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <span>Continue to Voice Note 🎙️</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-pink-400" />
        </button>
      </footer>

    </div>
  );
}
