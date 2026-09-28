import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendEmail } from '../utils/emailService';
import CelebrationReveal from './CelebrationReveal';
import EmotionalSongLyricScene from './EmotionalSongLyricScene';
import VoiceMessageScene from './VoiceMessageScene';
import MemoryRoom from './MemoryRoom';
import OpenWhenLetters from './OpenWhenLetters';
import { useSound } from '../context/SoundContext';
import CinematicRainbowBorder from './CinematicRainbowBorder';

export default function EmotionalQuestionGate({ onFeelings, onNoFeelings, onAccept, onReset, onSelectFeelings }) {
  const { toggleSound, isPlaying } = useSound();
  // Flow steps: 'QUESTION' -> 'LYRIC_SCENE' -> 'VOICE' -> 'MEMORY_ROOM' -> 'OPEN_WHEN' -> 'CELEBRATION'
  const [step, setStep] = useState('QUESTION');
  const [typedText, setTypedText] = useState('');
  const [lyricAudio, setLyricAudio] = useState(null);
  const fullText = "நீ எப்போ இதை ஓபன் பண்ணுவனு எனக்குத் தெரியல... ஆனா உன்கிட்ட பேசணும்னு தோணினப்போ இது உருவானது...";

  // Typewriter Effect Logic
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, []);

  // Synchronize Emotional Question Gate progression with heartbeat BPM
  useEffect(() => {
    if (window.heartbeatEngine) {
      switch (step) {
        case 'QUESTION':
          window.heartbeatEngine.setTargetBPM(64, 0.25);
          break;
        case 'LYRIC_SCENE':
          window.heartbeatEngine.setTargetBPM(68, 0.26);
          break;
        case 'VOICE':
          window.heartbeatEngine.setTargetBPM(72, 0.28);
          break;
        case 'MEMORY_ROOM':
          window.heartbeatEngine.setTargetBPM(78, 0.30);
          break;
        case 'OPEN_WHEN':
          window.heartbeatEngine.setTargetBPM(84, 0.32);
          break;
        case 'CELEBRATION':
          window.heartbeatEngine.setTargetBPM(90, 0.34);
          break;
        default:
          break;
      }
    }
  }, [step]);

  const handleFeelingsClick = () => {
    // 1. Trigger celebratory confetti blast
    confetti({
      particleCount: 75,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff1493', '#ff69b4', '#ffd700', '#ff0055', '#a855f7'],
    });

    // 2. Trigger silent email notification via existing EmailJS
    sendEmail({
      title: 'Saranya Clicked: Feelings ❤️',
      message: 'Saranya unlocked the passcode "SARANYA26" and accepted the emotional question by clicking: "Feelings ❤️"!',
    }).catch(() => {});

    // 3. Trigger audio directly on click to bypass browser autoplay blocks
    let song = new Audio('/abi.mp3');
    song.preload = 'auto';
    song.volume = 0.18;
    const playPromise = song.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // fallback if file name is abi.mp3.mpeg
        const fallbackSong = new Audio('/abi.mp3.mpeg');
        fallbackSong.preload = 'auto';
        fallbackSong.volume = 0.18;
        fallbackSong.play().catch((e) => console.log('Audio playback error:', e));
        song = fallbackSong;
        setLyricAudio(fallbackSong);
      });
    }
    setLyricAudio(song);

    // 4. Move to Cinematic Musical Lyric Scene (abi.mp3)
    if (typeof onSelectFeelings === 'function') {
      onSelectFeelings();
    } else {
      setStep('LYRIC_SCENE');
    }
  };

  const handleNoFeelingsClick = () => {
    const callback = onNoFeelings || onReset;
    if (typeof callback === 'function') {
      callback();
    }
  };

  // Step 1.5: Cinematic Musical Lyric Scene (abi.mp3 + Synced Tamil Typewriter Lyrics)
  if (step === 'LYRIC_SCENE') {
    return (
      <EmotionalSongLyricScene
        audioInstance={lyricAudio}
        onComplete={() => {
          setStep('VOICE');
        }}
      />
    );
  }

  // Step 2: Voice Note Recorder Screen
  if (step === 'VOICE') {
    return (
      <VoiceMessageScene
        onComplete={() => {
          if (window.soundController?.fadeToSoftAmbience) {
            window.soundController.fadeToSoftAmbience(0.045, 3.5);
          }
          setStep('MEMORY_ROOM');
        }}
      />
    );
  }

  // Step 3: [NEW] 3D Memory Room (Wall photos + Desk objects)
  if (step === 'MEMORY_ROOM') {
    return (
      <MemoryRoom
        toggleAudio={toggleSound}
        isAudioPlaying={isPlaying}
        onProceed={() => {
          setStep('OPEN_WHEN');
        }}
      />
    );
  }

  // Step 4: [NEW] Open When Letters (Sealed letters + Secret Letter)
  if (step === 'OPEN_WHEN') {
    return (
      <OpenWhenLetters
        onComplete={() => {
          setStep('CELEBRATION');
        }}
      />
    );
  }

  // Step 5: Celebration Reveal (The special envelope message)
  if (step === 'CELEBRATION') {
    return (
      <CelebrationReveal
        onComplete={() => {
          const callback = onFeelings || onAccept;
          if (typeof callback === 'function') {
            callback();
          }
        }}
        isFeelings={true}
      />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-[#03050c] flex flex-col items-center justify-center p-4 sm:p-6 text-center relative overflow-hidden select-none animate-in fade-in zoom-in-95 duration-1000 z-[70]">

      {/* INLINE CSS FOR EMOTIONAL CINEMATIC ATMOSPHERE & QUESTION REVEAL */}
      <style>{`
        /* Cinematic Question Entrance: Soft fade-in -> upward movement -> subtle glow -> pause -> final stable position */
        @keyframes questionCinematicEntrance {
          0% {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(4px) drop-shadow(0 0 0px transparent);
          }
          35% {
            opacity: 0.85;
            transform: translateY(7px);
            filter: blur(1px) drop-shadow(0 0 16px rgba(244,63,94,0.7));
          }
          65% {
            opacity: 0.96;
            transform: translateY(0px);
            filter: blur(0px) drop-shadow(0 0 20px rgba(251,191,36,0.6));
          }
          82% {
            opacity: 1;
            transform: translateY(0px);
            filter: blur(0px) drop-shadow(0 0 12px rgba(244,63,94,0.4));
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
            filter: blur(0px);
          }
        }

        /* Heartbeat-like Visual Pulses applied to Surrounding Glow (NOT to text) */
        @keyframes heartbeatAuraPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
            filter: blur(42px);
          }
          14% {
            opacity: 0.72;
            transform: scale(1.08);
            filter: blur(48px);
          }
          28% {
            opacity: 0.45;
            transform: scale(1.03);
            filter: blur(40px);
          }
          42% {
            opacity: 0.80;
            transform: scale(1.12);
            filter: blur(52px);
          }
          56% {
            opacity: 0.35;
            transform: scale(1);
            filter: blur(42px);
          }
        }

        @keyframes bokehDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          50% { transform: translate(25px, -30px) scale(1.15); opacity: 0.55; }
        }

        @keyframes rayShift {
          0%, 100% { transform: rotate(15deg) translateY(0) scale(1); opacity: 0.15; }
          50% { transform: rotate(19deg) translateY(-15px) scale(1.08); opacity: 0.28; }
        }

        @keyframes floatHeartGate {
          0% { transform: translateY(105vh) translateX(0) scale(0.7) rotate(-5deg); opacity: 0; }
          15% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% { transform: translateY(-10vh) translateX(25px) scale(1.05) rotate(8deg); opacity: 0; }
        }

        @keyframes petalFallGate {
          0% { transform: translateY(-8vh) translateX(0) rotate(0deg) scale(0.75); opacity: 0; }
          15% { opacity: 0.85; }
          85% { opacity: 0.75; }
          100% { transform: translateY(108vh) translateX(30px) rotate(360deg) scale(1.05); opacity: 0; }
        }
      `}</style>

      {/* 1. SCREEN-LEVEL CONTINUOUS TRAVELLING RAINBOW BORDER */}
      <CinematicRainbowBorder mode="screen" />

      {/* 2. CINEMATIC VIGNETTE & DEEP ATMOSPHERIC BACKDROP */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,5,12,0.65) 65%, rgba(3,5,12,0.98) 100%)',
        }}
      />

      {/* Ambient Blurred /mem-03.jpg Backdrop Bloom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/mem-03.jpg"
          alt="Saranya Memory Backdrop"
          className="w-full h-full object-cover filter blur-3xl scale-125 opacity-25"
        />
        <div className="absolute inset-0 bg-[#03050c]/75" />
      </div>

      {/* Soft Bokeh Orbs in Rose, Purple & Amber */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-rose-600/20 blur-[120px] pointer-events-none"
        style={{ animation: 'bokehDrift 11s ease-in-out infinite' }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-purple-600/20 blur-[130px] pointer-events-none"
        style={{ animation: 'bokehDrift 14s ease-in-out infinite [animation-delay:3s]' }}
      />
      <div
        className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-amber-500/15 blur-[100px] pointer-events-none"
        style={{ animation: 'bokehDrift 9s ease-in-out infinite [animation-delay:1.5s]' }}
      />

      {/* Diagonal Cinematic Lens Rays */}
      <div
        className="absolute -inset-20 opacity-15 pointer-events-none z-10 mix-blend-screen bg-gradient-to-tr from-transparent via-rose-300/15 to-amber-200/20 blur-3xl"
        style={{ animation: 'rayShift 12s ease-in-out infinite' }}
      />

      {/* Floating Glowing Hearts & Cascading Petals */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {[
          { left: '8%', delay: '0s', dur: '9s', icon: '❤️', cls: 'text-rose-400 text-lg' },
          { left: '18%', delay: '2.5s', dur: '11s', icon: '🌸', cls: 'text-pink-300 text-base' },
          { left: '82%', delay: '1.2s', dur: '10s', icon: '❤️', cls: 'text-pink-400 text-lg' },
          { left: '90%', delay: '3.8s', dur: '12s', icon: '🌸', cls: 'text-rose-300 text-base' },
        ].map((item, idx) => (
          <div
            key={`gate-part-${idx}`}
            className={`absolute ${item.cls} drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]`}
            style={{
              left: item.left,
              animation: item.icon === '❤️' ? `floatHeartGate ${item.dur} linear infinite` : `petalFallGate ${item.dur} linear infinite`,
              animationDelay: item.delay,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* 3. MAIN CINEMATIC QUESTION CARD WITH TRAVELLING RAINBOW BORDER */}
      <div className="relative max-w-xl w-full rounded-[2.5rem] p-[3px] z-20 animate-in fade-in zoom-in-95 duration-1000 shadow-[0_0_70px_rgba(244,63,94,0.35)]">
        
        {/* Card Travelling Rainbow Border */}
        <CinematicRainbowBorder mode="card" borderRadius={40} />

        {/* Card Content Stage */}
        <div className="relative w-full h-full bg-[#050814]/90 backdrop-blur-2xl p-7 sm:p-10 md:p-12 rounded-[2.35rem] space-y-6 sm:space-y-7 border border-pink-500/25">

          {/* Memory Photo Reveal (/mem-03.jpg) */}
          <div className="flex justify-center">
            <div className="relative group w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-pink-400/60 shadow-[0_0_35px_rgba(244,63,94,0.5)] bg-slate-950 flex items-center justify-center">
              <img
                src="/mem-03.jpg"
                alt="Saranya Memory"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1.5 inset-x-0 text-center pointer-events-none">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-pink-300 drop-shadow flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-400" /> Forever Special
                </span>
              </div>
            </div>
          </div>

          {/* CINEMATIC QUESTION CONTAINER WITH HEARTBEAT AURA GLOW */}
          <div className="relative py-2 px-1">
            {/* Heartbeat-like Visual Pulse Glow behind the question (NOT on text) */}
            <div
              className="absolute inset-0 -inset-x-4 bg-gradient-to-r from-rose-600/30 via-amber-500/25 to-pink-600/30 rounded-full pointer-events-none"
              style={{ animation: 'heartbeatAuraPulse 3.5s ease-in-out infinite' }}
            />

            {/* Question with Cinematic Entrance & Emotional Typography */}
            <h2
              className="relative text-base sm:text-lg md:text-xl font-serif text-rose-50 leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
              style={{ animation: 'questionCinematicEntrance 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              "உனக்குத்தான் என்னைப் பிடிக்கலை, எந்த feelings-ம் இல்லைனு சொல்ற, சரி... ஆனா உண்மைல உனக்கு என் மேல ஒரு துளி feelings இருந்தா மட்டும் உள்ள வா, இல்லன்னா எந்த அழுத்தமும் இல்லாம வெளியவே நில்லு..."
            </h2>
          </div>

          {/* Typewriter Memory Note */}
          <div className="bg-pink-950/30 border border-pink-500/20 rounded-2xl p-4 shadow-inner">
            <p className="text-pink-200/90 text-sm md:text-base font-light italic tracking-wide min-h-[3rem] flex items-center justify-center">
              "{typedText}
              <span className="animate-ping inline-block w-1.5 h-4 bg-pink-400 ml-1 rounded-full" />"
            </p>
          </div>

          {/* Modern Action Buttons: Feelings & No Feelings */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 pt-1">
            {/* Feelings Button with Luxury Animated Neon-Rose Gradient Glow */}
            <button
              onClick={handleFeelingsClick}
              className="flex-1 group relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_35px_rgba(244,63,94,0.6)] hover:shadow-[0_0_55px_rgba(244,63,94,0.9)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-pink-400/50 cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-lg tracking-wider drop-shadow-md">
                Feelings ❤️
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* No Feelings Button */}
            <button
              onClick={handleNoFeelingsClick}
              className="flex-1 group bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold py-4 px-8 rounded-2xl border border-slate-700/80 hover:border-slate-500 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2 text-lg tracking-wider">
                No Feelings 🍃
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}