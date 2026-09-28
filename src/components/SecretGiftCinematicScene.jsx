import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Gift, Sparkles, Heart } from 'lucide-react';
import CinematicRainbowBorder from './CinematicRainbowBorder';

// AUTHORIZED / CUSTOMIZABLE LYRIC STRUCTURE (Synchronized via audio.currentTime)
// The project owner can customize the start, end, and text entries below
const LYRICS = [
  { start: 0.5, end: 5.5, text: "நீயின்றி நானா... என் நெஞ்சில் நீயா..." },
  { start: 5.5, end: 11.0, text: "உன் புன்னகை பார்த்தே... என் வாழ்வு விடிந்ததே..." },
  { start: 11.0, end: 16.5, text: "சொல்லாத அன்பெல்லாம்... உனக்காக மட்டும் தானே..." },
  { start: 16.5, end: 22.0, text: "காலங்கள் கடந்தாலும்... நீயே என் உலகம் சரண்யா..." },
  { start: 22.0, end: 28.0, text: "என் ஒவ்வொரு மூச்சிலும்... உன் நினைவுகள் மட்டுமே..." },
  { start: 28.0, end: 35.0, text: "என்றென்றும் உன்னோடு... என் பயணம் தொடருமே... ❤️" },
];

const TAMIL_SENTENCES = [
  "சில விஷயங்களை\nவார்த்தைகளால் சொல்ல முடியாது...",
  "சில நினைவுகளை\nமறக்கவும் முடியாது...",
  "நீ என் வாழ்க்கையில் வந்தது\nஒரு சிறிய தருணமாக இருக்கலாம்...",
  "ஆனால்...\nஅந்த தருணங்கள்\nஎனக்கு மிகவும் பெரிய நினைவுகளாகிவிட்டன.",
  "சொல்லாமல் வைத்திருந்த\nசில உணர்வுகள் இருக்கின்றன...",
  "இன்று...\nஅதை மறைக்காமல்\nசொல்ல நினைக்கிறேன்."
];

// Parametric heart coordinates for the particle heart formation
const HEART_PARTICLES = Array.from({ length: 42 }).map((_, i) => {
  const t = (i / 42) * Math.PI * 2;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return {
    id: i,
    hx: x * 7.5,
    hy: y * 7.5,
    // Scatter coordinates
    sx: (Math.sin(i * 9) * 220),
    sy: (Math.cos(i * 7) * 220),
    color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f43f5e' : '#f472b6',
    size: (i % 3) + 2.5,
  };
});

const MEMORY_PHOTOS = [
  '/mem-01.jpg',
  '/mem-02.jpg',
  '/mem-03.jpg',
  '/sa.jpg',
  '/sk.jpg',
  '/as.jpg'
];

export default function SecretGiftCinematicScene({ onComplete }) {
  // Stages: 'BOX_OPENING' -> 'TAMIL_MSG' -> 'BUTTERFLIES' -> 'HEART_FORMATION' -> 'SONG' -> 'FADE_OUT'
  const [stage, setStage] = useState('BOX_OPENING');
  const [boxStep, setBoxStep] = useState(0); // 0 (0.0s), 1 (0.4s), 2 (0.8s), 3 (1.0s), 4 (1.3s), 5 (1.6s), 6 (2.0s)
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [heartAssembled, setHeartAssembled] = useState(false);
  const [currentLyric, setCurrentLyric] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const audioRef = useRef(null);
  const animFrameRef = useRef(null);
  const timersRef = useRef([]);
  const transitionRef = useRef(null);

  // Initialize and pre-warm audio instance immediately on mount
  useEffect(() => {
    try {
      const audio = new Audio('/abi3.mp3');
      audio.preload = 'auto';
      audioRef.current = audio;
    } catch {
      // Audio fallback
    }

    const activeTimers = timersRef.current;
    return () => {
      activeTimers.forEach((t) => clearTimeout(t));
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // 1. Box Opening Ceremony Timeline (0.0s - 2.0s)
  useEffect(() => {
    const t1 = setTimeout(() => setBoxStep(1), 400);  // 0.4s: Rose-gold light inside
    const t2 = setTimeout(() => setBoxStep(2), 800);  // 0.8s: Box opens with soft bloom
    const t3 = setTimeout(() => setBoxStep(3), 1000); // 1.0s: Golden particles rise
    const t4 = setTimeout(() => setBoxStep(4), 1300); // 1.3s: Butterflies emerge
    const t5 = setTimeout(() => setBoxStep(5), 1600); // 1.6s: Rose petals appear
    const t6 = setTimeout(() => {
      setBoxStep(6);
      setStage('TAMIL_MSG');
    }, 2200); // 2.2s: Box fades smoothly into Tamil messages

    timersRef.current.push(t1, t2, t3, t4, t5, t6);
  }, []);

  // 2. Emotional Tamil Messages Flow (Slow sequential reveals with thoughtful pauses)
  useEffect(() => {
    if (stage !== 'TAMIL_MSG') return;

    let currentIndex = 0;
    const holdDuration = 3200; // Time each sentence stays visible
    const fadeDuration = 600;  // Fade transition time

    const showNextSentence = () => {
      if (currentIndex >= TAMIL_SENTENCES.length - 1) {
        // After final sentence, hold for ~1.5s, then trigger butterfly moment
        const tEnd = setTimeout(() => {
          setStage('BUTTERFLIES');
        }, 3600);
        timersRef.current.push(tEnd);
        return;
      }

      const tHold = setTimeout(() => {
        // Fade out
        setMsgVisible(false);

        const tFade = setTimeout(() => {
          currentIndex += 1;
          setMsgIndex(currentIndex);
          setMsgVisible(true);
          showNextSentence();
        }, fadeDuration);

        timersRef.current.push(tFade);
      }, holdDuration);

      timersRef.current.push(tHold);
    };

    showNextSentence();
  }, [stage]);

  // 3. Butterfly Moment -> Heart Formation Timeline
  useEffect(() => {
    if (stage === 'BUTTERFLIES') {
      const tHeart = setTimeout(() => {
        setStage('HEART_FORMATION');
      }, 3000);
      timersRef.current.push(tHeart);
    }

    if (stage === 'HEART_FORMATION') {
      // Assemble particles
      const tAssemble = setTimeout(() => {
        setHeartAssembled(true);
      }, 300);

      // Hold heart for ~1.2s, then dissolve into song
      const tSong = setTimeout(() => {
        setStage('SONG');
      }, 2600);

      timersRef.current.push(tAssemble, tSong);
    }
  }, [stage]);

  // 4. Start Song & Monitor currentTime for Accurate Lyric Sync
  useEffect(() => {
    if (stage !== 'SONG') return;

    const audio = audioRef.current || new Audio('/abi3.mp3');
    audioRef.current = audio;

    audio.volume = 1.0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Playback blocked, attempting user unlock:', err);
        setAudioError(true);
      });
    }

    // Monitor synchronized lyrics via requestAnimationFrame / currentTime
    const syncLyrics = () => {
      if (audio && !audio.paused && !audio.ended) {
        const time = audio.currentTime;
        const matching = LYRICS.find((l) => time >= l.start && time < l.end);
        setCurrentLyric(matching ? matching.text : '');

        // Cycle background memory photo every 5 seconds
        const photoIdx = Math.floor(time / 5) % MEMORY_PHOTOS.length;
        setActivePhotoIdx(photoIdx);
      }
      animFrameRef.current = requestAnimationFrame(syncLyrics);
    };

    animFrameRef.current = requestAnimationFrame(syncLyrics);

    // Audio onended handler
    audio.onended = () => {
      transitionRef.current?.();
    };

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stage]);

  const handleManualPlay = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setAudioError(false)).catch(() => {});
    }
  };

  const handleFinalTransition = () => {
    if (isFinishing) return;
    setIsFinishing(true);
    setStage('FADE_OUT');

    const tComplete = setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 1200);

    timersRef.current.push(tComplete);
  };
  transitionRef.current = handleFinalTransition;

  const content = (
    <div
      className={`fixed inset-0 w-screen h-screen z-[9999] overflow-y-auto overflow-x-hidden bg-[#030108] text-white flex flex-col items-center justify-center select-none transition-opacity duration-1000 ${
        stage === 'FADE_OUT' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        fontFamily: "'Playfair Display', 'Noto Sans Tamil', 'Tamil Sangam MN', 'Mukta Malar', 'Latha', serif",
      }}
    >
      {/* Screen-level Travelling Rainbow Border */}
      <CinematicRainbowBorder mode="screen" />

      {/* INLINE CSS FOR CINEMATIC LIGHTING, PARTICLES & GLOWS */}
      <style>{`
        @keyframes softBloom {
          0% { transform: scale(0.9); opacity: 0; filter: blur(20px); }
          50% { opacity: 0.8; filter: blur(40px); }
          100% { transform: scale(1.15); opacity: 0.5; filter: blur(30px); }
        }
        @keyframes gentleFloatUp {
          0% { transform: translateY(40px) scale(0.6); opacity: 0; }
          30% { opacity: 0.85; }
          80% { opacity: 0.85; }
          100% { transform: translateY(-120px) scale(1); opacity: 0; }
        }
        @keyframes butterflyDrift {
          0% { transform: translate(0, 80px) scale(0.7) rotate(0deg); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.85; }
          100% { transform: translate(var(--dx, 30px), -180px) scale(1.1) rotate(var(--rot, 12deg)); opacity: 0; }
        }
        @keyframes ambientHeartbeat {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.08); opacity: 0.42; }
        }
        @keyframes textShimmerGlow {
          0%, 100% { text-shadow: 0 0 25px rgba(251,191,36,0.38), 0 0 50px rgba(244,63,94,0.32); }
          50% { text-shadow: 0 0 35px rgba(251,191,36,0.55), 0 0 70px rgba(244,63,94,0.5); }
        }
        .ambient-breathe {
          animation: ambientHeartbeat 7s ease-in-out infinite;
        }
        .shimmer-tamil {
          animation: textShimmerGlow 4s ease-in-out infinite;
        }
      `}</style>

      {/* 1. DEEP CINEMATIC BACKGROUND GLOWS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-rose-600/20 via-pink-600/15 to-amber-500/15 rounded-full blur-[150px] pointer-events-none ambient-breathe" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(3,1,8,0.55) 70%, #030108 100%)',
        }}
      />

      {/* 2. BACKGROUND MEMORY PHOTO FLASHES (DURING SONG STAGE) */}
      {stage === 'SONG' && (
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000">
          <img
            key={MEMORY_PHOTOS[activePhotoIdx]}
            src={MEMORY_PHOTOS[activePhotoIdx]}
            alt="Memory Flash"
            className="w-full h-full object-cover filter blur-[32px] scale-125 opacity-20 transition-opacity duration-1000 animate-in fade-in"
          />
          <div className="absolute inset-0 bg-[#030108]/65" />
        </div>
      )}

      {/* 3. PERSISTENT FLOATING MEMORY PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(16)].map((_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full bg-amber-200/40 blur-[0.8px]"
            style={{
              top: `${(i * 6.3) % 90}%`,
              left: `${(i * 7.1) % 92}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              animation: `gentleFloatUp ${6 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        {/* Subtle Floating Petals */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute text-rose-300/40 text-base"
            style={{
              top: `${15 + ((i * 11) % 75)}%`,
              left: `${10 + ((i * 13) % 80)}%`,
              animation: `gentleFloatUp ${8 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* 4. PHASE A: CINEMATIC GIFT BOX OPENING (0.0s - 2.0s) */}
      {stage === 'BOX_OPENING' && (
        <div className="relative z-20 flex flex-col items-center justify-center transition-all duration-700">
          {/* Internal Rose-Gold Bloom Light */}
          {boxStep >= 1 && (
            <div
              className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-amber-300/40 via-rose-500/50 to-pink-500/40 blur-2xl pointer-events-none"
              style={{ animation: 'softBloom 1.2s ease-out forwards' }}
            />
          )}

          {/* Emerging Golden Particles from Box */}
          {boxStep >= 3 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <div
                  key={`box-dust-${i}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 blur-[0.5px]"
                  style={{
                    animation: `gentleFloatUp 1.4s ease-out forwards`,
                    animationDelay: `${i * 0.08}s`,
                    transform: `translate(${(Math.random() - 0.5) * 80}px, ${(Math.random() - 0.5) * 60}px)`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Emerging Butterflies from Box */}
          {boxStep >= 4 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={`box-bfly-${i}`}
                  className="absolute text-2xl drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]"
                  style={{
                    animation: `butterflyDrift 1.6s ease-out forwards`,
                    animationDelay: `${i * 0.12}s`,
                    '--dx': `${(i - 2) * 45}px`,
                    '--rot': `${(i - 2) * 15}deg`,
                  }}
                >
                  🦋
                </span>
              ))}
            </div>
          )}

          {/* The Gift Box */}
          <div
            className={`w-32 h-32 rounded-3xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-0.5 shadow-[0_0_50px_rgba(244,114,182,0.7)] transition-all duration-700 ${
              boxStep >= 2 ? 'scale-110 shadow-[0_0_70px_rgba(251,191,36,0.8)]' : 'scale-100'
            }`}
          >
            <div className="w-full h-full rounded-3xl bg-zinc-950 flex items-center justify-center relative overflow-hidden">
              <Gift className={`w-16 h-16 text-rose-400 transition-transform duration-500 ${boxStep >= 2 ? 'scale-110 text-amber-200' : ''}`} />
              {boxStep >= 1 && (
                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/30 via-rose-500/20 to-transparent animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. PHASE B: EMOTIONAL TAMIL MESSAGES (Full Screen Responsive, Centered, Zero Clipping) */}
      {stage === 'TAMIL_MSG' && (
        <div
          className="relative z-30 mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center justify-center animate-in fade-in duration-700"
          style={{
            width: 'min(90vw, 900px)',
            minHeight: '160px',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          <div
            className={`w-full py-4 transition-all duration-700 ease-in-out transform ${
              msgVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-98'
            }`}
            style={{ overflow: 'visible' }}
          >
            <p
              className="shimmer-tamil text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-[#fffdfa] leading-[1.8] sm:leading-[1.9] md:leading-[2.0] tracking-wide whitespace-pre-line break-words drop-shadow-[0_0_35px_rgba(244,63,94,0.45)]"
              style={{
                fontFamily: "'Playfair Display', 'Noto Sans Tamil', 'Tamil Sangam MN', 'Mukta Malar', 'Latha', serif",
                textShadow: '0 0 25px rgba(251,191,36,0.4), 0 0 50px rgba(244,63,94,0.35)',
              }}
            >
              {TAMIL_SENTENCES[msgIndex]}
            </p>
          </div>
        </div>
      )}

      {/* 6. PHASE C: BUTTERFLY MOMENT (8-15 Glowing Butterflies Fluttering Upward) */}
      {stage === 'BUTTERFLIES' && (
        <div
          className="relative z-30 mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center justify-center"
          style={{
            width: 'min(90vw, 900px)',
            minHeight: '160px',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          {/* Centered final words fading softly with comfortable line height */}
          <p
            className="shimmer-tamil text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#fffdfa] leading-[1.8] sm:leading-[1.9] md:leading-[2.0] tracking-wide whitespace-pre-line break-words drop-shadow-[0_0_30px_rgba(244,63,94,0.4)] mb-8"
            style={{
              fontFamily: "'Playfair Display', 'Noto Sans Tamil', 'Tamil Sangam MN', 'Mukta Malar', 'Latha', serif",
              textShadow: '0 0 25px rgba(251,191,36,0.4), 0 0 50px rgba(244,63,94,0.35)',
            }}
          >
            "இன்று... அதை மறைக்காமல் சொல்ல நினைக்கிறேன்."
          </p>

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[...Array(14)].map((_, i) => (
              <span
                key={`flock-${i}`}
                className="absolute text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_0_15px_rgba(244,114,182,0.9)] opacity-90"
                style={{
                  animation: `butterflyDrift 2.8s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                  animationDelay: `${i * 0.14}s`,
                  '--dx': `${Math.sin(i * 1.8) * 180}px`,
                  '--rot': `${Math.sin(i * 2.2) * 30}deg`,
                }}
              >
                🦋
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7. PHASE D: HEART PARTICLE FORMATION (Rose & Gold Particles Gathering) */}
      {stage === 'HEART_FORMATION' && (
        <div className="relative z-30 w-full h-full flex flex-col items-center justify-center">
          <div className="relative w-80 h-80 flex items-center justify-center">
            {HEART_PARTICLES.map((p) => {
              const tx = heartAssembled ? p.hx : p.sx;
              const ty = heartAssembled ? p.hy : p.sy;
              return (
                <div
                  key={p.id}
                  className="absolute rounded-full transition-all duration-1000 ease-out"
                  style={{
                    transform: `translate(${tx}px, ${ty}px)`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 10px ${p.color}`,
                    opacity: heartAssembled ? 0.95 : 0.35,
                  }}
                />
              );
            })}
            {/* Center soft glow heart silhouette aura */}
            <div className={`w-36 h-36 rounded-full bg-rose-500/25 blur-2xl transition-opacity duration-1000 ${heartAssembled ? 'opacity-100 scale-110' : 'opacity-0 scale-75'}`} />
          </div>
        </div>
      )}

      {/* 8. PHASE E: SONG STAGE (Synchronized Lyrics + Movie Atmosphere, Zero Clipping) */}
      {stage === 'SONG' && (
        <div
          className="relative z-30 mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center text-center space-y-6"
          style={{
            width: 'min(90vw, 900px)',
            height: 'auto',
            overflow: 'visible',
          }}
        >
          {/* Subtle Ambient Heartbeat Halo */}
          <div className="w-20 h-20 rounded-full bg-rose-500/20 blur-xl flex items-center justify-center ambient-breathe">
            <Heart className="w-10 h-10 text-rose-400/80 fill-rose-500/20" />
          </div>

          {/* Synchronized Song Lyric Display (Lower-Middle Position with ample height and padding) */}
          <div
            className="w-full flex items-center justify-center py-4"
            style={{
              minHeight: '120px',
              height: 'auto',
              overflow: 'visible',
            }}
          >
            {currentLyric ? (
              <p
                key={currentLyric}
                className="text-2xl sm:text-3xl md:text-4xl text-[#fffdfa] leading-[1.8] sm:leading-[1.9] md:leading-[2.0] tracking-wide whitespace-pre-line break-words drop-shadow-[0_0_25px_rgba(244,63,94,0.45)] animate-in fade-in duration-500"
                style={{
                  fontFamily: "'Playfair Display', 'Noto Sans Tamil', 'Tamil Sangam MN', 'Mukta Malar', 'Latha', serif",
                  textShadow: '0 0 20px rgba(251,191,36,0.4), 0 0 45px rgba(244,63,94,0.4)',
                }}
              >
                "{currentLyric}"
              </p>
            ) : (
              <p className="text-base sm:text-lg text-rose-200/50 italic tracking-widest animate-pulse">
                ♪ Unakkaga oru paattu... ♪
              </p>
            )}
          </div>

          {/* Autoplay Fallback Tap Button */}
          {audioError && (
            <button
              onClick={handleManualPlay}
              className="mt-2 px-5 py-2 rounded-full bg-rose-500/30 border border-rose-400/50 text-rose-200 text-xs tracking-wider cursor-pointer hover:bg-rose-500/40 transition-colors"
            >
              ▶ Tap to Play Song Audio
            </button>
          )}

          {/* Elegant Continue Journey Button */}
          <div className="pt-6">
            <button
              onClick={handleFinalTransition}
              className="group px-8 py-3 rounded-full bg-gradient-to-r from-rose-500/80 via-pink-500/80 to-purple-600/80 hover:from-rose-500 hover:to-purple-600 border border-rose-400/40 text-white text-sm tracking-widest shadow-[0_0_30px_rgba(244,63,94,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <span>Continue Journey</span>
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
