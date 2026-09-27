import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendEmail } from '../utils/emailService';
import CelebrationReveal from './CelebrationReveal';
import EmotionalSongLyricScene from './EmotionalSongLyricScene';
import VoiceMessageScene from './VoiceMessageScene';
import MemoryRoom from './MemoryRoom';
import OpenWhenLetters from './OpenWhenLetters';

export default function EmotionalQuestionGate({ onFeelings, onNoFeelings, onAccept, onReset, onSelectFeelings }) {
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
          window.heartbeatEngine.setTargetBPM(66, 0.16);
          break;
        case 'LYRIC_SCENE':
          window.heartbeatEngine.setTargetBPM(68, 0.18);
          break;
        case 'VOICE':
          window.heartbeatEngine.setTargetBPM(74, 0.20);
          break;
        case 'MEMORY_ROOM':
          window.heartbeatEngine.setTargetBPM(82, 0.23);
          break;
        case 'OPEN_WHEN':
          window.heartbeatEngine.setTargetBPM(90, 0.27);
          break;
        case 'CELEBRATION':
          window.heartbeatEngine.setTargetBPM(102, 0.32);
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
    song.volume = 1.0;
    const playPromise = song.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // fallback if file name is abi.mp3.mpeg
        const fallbackSong = new Audio('/abi.mp3.mpeg');
        fallbackSong.preload = 'auto';
        fallbackSong.volume = 1.0;
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
          setStep('MEMORY_ROOM');
        }}
      />
    );
  }

  // Step 3: [NEW] 3D Memory Room (Wall photos + Desk objects)
  if (step === 'MEMORY_ROOM') {
    return (
      <MemoryRoom
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
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none animate-in fade-in zoom-in-95 duration-1000">

      {/* Background Cyber Neon Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-600/25 via-rose-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

      {/* Ambient Blurred /mem-03.jpg Backdrop Bloom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/mem-03.jpg"
          alt="Saranya Memory Backdrop"
          className="w-full h-full object-cover filter blur-2xl scale-125 opacity-30 animate-in fade-in zoom-in-95 duration-1000"
        />
        <div className="absolute inset-0 bg-[#030712]/65"></div>
      </div>

      {/* Main Glassmorphic Container with Ultra-Premium Theme */}
      <div className="max-w-xl w-full bg-slate-900/85 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_60px_rgba(244,63,94,0.35)] space-y-7 relative z-10 animate-in fade-in zoom-in-95 duration-1000">

        {/* Vivid Memory Photo Reveal (/mem-03.jpg) */}
        <div className="flex justify-center">
          <div className="relative group w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-pink-400/60 shadow-[0_0_35px_rgba(244,63,94,0.5)] bg-slate-950 flex items-center justify-center">
            <img
              src="/mem-03.jpg"
              alt="Saranya Memory"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-1.5 inset-x-0 text-center pointer-events-none">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-pink-300 drop-shadow flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400" /> Forever Special
              </span>
            </div>
          </div>
        </div>

        {/* Main Question */}
        <h2 className="text-lg md:text-xl font-medium text-white leading-relaxed tracking-wide drop-shadow-md">
          "உனக்குத்தான் என்னைப் பிடிக்கலை, எந்த feelings-ம் இல்லைனு சொல்ற, சரி... ஆனா உண்மைல உனக்கு என் மேல ஒரு துளி feelings இருந்தா மட்டும் உள்ள வா, இல்லன்னா எந்த அழுத்தமும் இல்லாம வெளியவே நில்லு..."
        </h2>

        {/* Advanced Typewriter Hidden Memory Note */}
        <div className="bg-pink-950/30 border border-pink-500/20 rounded-2xl p-4 shadow-inner">
          <p className="text-pink-200/90 text-sm md:text-base font-light italic tracking-wide min-h-[3rem] flex items-center justify-center">
            "{typedText}
            <span className="animate-ping inline-block w-1.5 h-4 bg-pink-400 ml-1 rounded-full"></span>"
          </p>
        </div>

        {/* Modern Buttons: Feelings & No Feelings */}
        <div className="flex flex-col sm:flex-row gap-5 pt-2">

          {/* Feelings Button with Luxury Animated Neon-Rose Gradient Glow & Smooth Hover States */}
          <button
            onClick={handleFeelingsClick}
            className="flex-1 group relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_35px_rgba(244,63,94,0.6)] hover:shadow-[0_0_50px_rgba(244,63,94,0.9)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-pink-400/50 cursor-pointer"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-lg tracking-wider drop-shadow-md">
              Feelings ❤️
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
  );
}