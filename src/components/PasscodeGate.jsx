import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, Unlock, KeyRound, Sparkles, Eye, EyeOff, X, Loader2 } from 'lucide-react';

export default function PasscodeGate({ onUnlock, onUnlocked }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Exact unlock sequence stages: IDLE -> UNLOCKED_ICON -> GLOW -> SWEEP -> BLACKOUT
  const [stage, setStage] = useState('IDLE');
  const [lockGlowEnhanced, setLockGlowEnhanced] = useState(false);
  const [rosePulse, setRosePulse] = useState(false);

  // Camera Presence Experience States
  // cameraStatus: 'INACTIVE' | 'REQUESTING' | 'ACTIVE' | 'DENIED'
  const [cameraStatus, setCameraStatus] = useState('INACTIVE');
  const [cameraError, setCameraError] = useState('');
  const [isPresenceDetected, setIsPresenceDetected] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const timersRef = useRef([]);
  const audioCtxRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const faceDetectorRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const presenceCounterRef = useRef(0);
  const isUnlockingRef = useRef(false);

  // Stop camera tracks and intervals safely
  const stopCamera = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    presenceCounterRef.current = 0;
  }, []);

  // Full cleanup on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      stopCamera();
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, [stopCamera]);

  const playHeartbeatAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  // Reusable cinematic unlock transition (used by both manual passcode & 0s countdown)
  const triggerUnlockSequence = useCallback(() => {
    if (isUnlockingRef.current) return;
    isUnlockingRef.current = true;

    // Immediately stop camera tracks so webcam LED turns off
    stopCamera();

    // 0.0s: successful unlock triggered
    playHeartbeatAudio();
    if (typeof window.unlockAudio === 'function') {
      window.unlockAudio();
    }

    // 0.3s: lock ambient glow increases
    timersRef.current.push(
      setTimeout(() => {
        setLockGlowEnhanced(true);
      }, 300)
    );

    // 0.7s: stage = UNLOCKED_ICON (Lock changes into Unlock)
    timersRef.current.push(
      setTimeout(() => {
        setStage('UNLOCKED_ICON');
      }, 700)
    );

    // 1.0s: stage = GLOW (passcode text gets soft rose/gold glow)
    timersRef.current.push(
      setTimeout(() => {
        setStage('GLOW');
      }, 1000)
    );

    // 1.5s: stage = SWEEP (subtle cinematic light sweep passes across existing photos)
    timersRef.current.push(
      setTimeout(() => {
        setStage('SWEEP');
      }, 1500)
    );

    // 1.7s: subtle rose light pulse spreads across the screen
    timersRef.current.push(
      setTimeout(() => {
        setRosePulse(true);
      }, 1700)
    );

    // 2.0s: stage = BLACKOUT (smooth cinematic blackout)
    timersRef.current.push(
      setTimeout(() => {
        setStage('BLACKOUT');
      }, 2000)
    );

    // 2.3s: call existing onUnlock / onUnlocked callback
    timersRef.current.push(
      setTimeout(() => {
        const callback = onUnlock || onUnlocked;
        if (typeof callback === 'function') {
          callback();
        }
      }, 2300)
    );
  }, [onUnlock, onUnlocked, stopCamera]);

  // Handle manual passcode submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === 'SARANYA26') {
      setError(false);
      triggerUnlockSequence();
    } else {
      setError(true);
    }
  };

  // Lightweight local presence detection (Method 1: Browser FaceDetector API -> Method 2: Local Canvas RGB/YCbCr Analysis)
  const detectPresence = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return false;

    // Method 1: Native browser FaceDetector if supported
    if (typeof window !== 'undefined' && 'FaceDetector' in window) {
      try {
        if (!faceDetectorRef.current) {
          faceDetectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        }
        const faces = await faceDetectorRef.current.detect(video);
        if (faces && faces.length > 0) {
          return true;
        }
      } catch {}
    }

    // Method 2: Lightweight client-side canvas presence analyzer (zero external dependencies, 100% private)
    try {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return false;

      ctx.drawImage(video, 0, 0, 64, 48);
      const imgData = ctx.getImageData(0, 0, 64, 48);
      const data = imgData.data;

      let centralSkinCount = 0;
      let totalCentralPixels = 0;
      let totalLum = 0;

      // Sample central upper region (where person's face/presence is situated)
      for (let y = 10; y < 38; y++) {
        for (let x = 16; x < 48; x++) {
          totalCentralPixels++;
          const idx = (y * 64 + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLum += lum;

          // YCbCr skin tone boundaries (robust against varying skin tones and warm indoor lighting)
          const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
          const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

          const isSkinYCbCr = lum > 30 && cb >= 75 && cb <= 138 && cr >= 128 && cr <= 182;
          const isSkinRGB = r > 45 && g > 30 && b > 20 && r > g && (r - g) >= 8 && (r - b) >= 8;

          if (isSkinYCbCr || isSkinRGB) {
            centralSkinCount++;
          }
        }
      }

      const avgLum = totalLum / (totalCentralPixels || 1);
      const skinRatio = centralSkinCount / (totalCentralPixels || 1);

      // Pitch dark camera cover (< 18) or blinded white (> 248) means no presence
      if (avgLum < 18 || avgLum > 248) {
        return false;
      }

      return skinRatio >= 0.07;
    } catch {
      return false;
    }
  };

  // Start Camera Experience on explicit user click
  const handleStartCamera = async () => {
    setCameraError('');
    setCameraStatus('REQUESTING');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 480 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      cameraStreamRef.current = stream;
      setCameraStatus('ACTIVE');
      setCountdown(30);
      setIsPresenceDetected(false);
      presenceCounterRef.current = 0;
    } catch (err) {
      console.warn('Camera permission denied or camera unavailable:', err);
      setCameraStatus('DENIED');
      setCameraError('Camera experience skipped.');
    }
  };

  // Attach stream to video element when camera becomes active
  useEffect(() => {
    if (cameraStatus === 'ACTIVE' && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStatus]);

  // Close Camera Experience manually
  const handleCloseCamera = () => {
    stopCamera();
    setCameraStatus('INACTIVE');
    setCameraError('');
    setIsPresenceDetected(false);
    setCountdown(30);
  };

  // Presence Detection loop while camera is active
  useEffect(() => {
    if (cameraStatus !== 'ACTIVE') return;

    detectionIntervalRef.current = setInterval(async () => {
      if (isUnlockingRef.current) return;

      const detected = await detectPresence();
      if (detected) {
        presenceCounterRef.current = Math.min(presenceCounterRef.current + 1, 4);
      } else {
        presenceCounterRef.current = Math.max(presenceCounterRef.current - 1, 0);
      }

      const nowPresent = presenceCounterRef.current >= 2;
      setIsPresenceDetected(nowPresent);
    }, 320);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [cameraStatus]);

  // 30-Second Countdown behavior:
  // - Decrements by 1 while presence is detected
  // - Automatically PAUSES if presence disappears
  // - Resumes when presence returns
  // - At 0s: Triggers existing unlock sequence!
  useEffect(() => {
    if (cameraStatus !== 'ACTIVE' || !isPresenceDetected || stage !== 'IDLE') return;

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          triggerUnlockSequence();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [cameraStatus, isPresenceDetected, stage, triggerUnlockSequence]);

  const isUnlocking = stage !== 'IDLE';

  // SVG circular countdown progress variables (Radius: 66, Circumference: 414.69)
  const ringRadius = 66;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - (30 - countdown) / 30);

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      <style>{`
        @keyframes photoSweep {
          0% { transform: translateX(-100%); opacity: 0; }
          40% { opacity: 0.55; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes pulseSpread {
          0% { opacity: 0; transform: scale(0.85); }
          50% { opacity: 0.6; }
          100% { opacity: 0; transform: scale(1.35); }
        }
        @keyframes rgbSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rgbPulse {
          0%, 100% { opacity: 0.7; filter: blur(14px); }
          50% { opacity: 1; filter: blur(24px); }
        }
        @keyframes scanLine {
          0% { top: 5%; opacity: 0; }
          50% { opacity: 0.85; }
          100% { top: 95%; opacity: 0; }
        }
        .rgb-border-box {
          position: relative;
          border-radius: 1.5rem;
          overflow: hidden;
          padding: 3px;
        }
        .rgb-border-box::before {
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background: conic-gradient(from 0deg, #f43f5e, #ec4899, #a855f7, #3b82f6, #06b6d4, #f43f5e);
          animation: rgbSpin 6s linear infinite;
          z-index: 0;
        }
        .rgb-border-aura {
          position: absolute;
          inset: -6px;
          background: conic-gradient(from 0deg, #f43f5e, #ec4899, #a855f7, #3b82f6, #06b6d4, #f43f5e);
          border-radius: 1.75rem;
          animation: rgbSpin 6s linear infinite, rgbPulse 3.5s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        .rgb-border-box-right::before {
          animation-delay: -3s;
        }
        .rgb-border-aura-right {
          animation-delay: -3s;
        }
        @media (prefers-reduced-motion: reduce) {
          .rgb-border-box::before, .rgb-border-aura {
            animation: none !important;
          }
        }
      `}</style>

      {/* Hidden canvas for local client-side presence analysis */}
      <canvas ref={canvasRef} width={64} height={48} className="hidden" aria-hidden="true" />

      {/* Background Atmosphere: Deep navy/black ambient glow & soft rose radial spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-pink-600/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50 pointer-events-none"></div>

      {/* Tiny floating dust/light specks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '15%', left: '22%', size: '3px', delay: '0s' },
          { top: '28%', left: '78%', size: '2px', delay: '1.2s' },
          { top: '65%', left: '18%', size: '3px', delay: '2.1s' },
          { top: '75%', left: '82%', size: '2px', delay: '0.7s' },
          { top: '40%', left: '12%', size: '2px', delay: '1.8s' },
          { top: '85%', left: '48%', size: '3px', delay: '2.5s' },
          { top: '12%', left: '60%', size: '2px', delay: '0.4s' },
        ].map((speck, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-pink-300/40 blur-[0.5px] animate-pulse"
            style={{
              top: speck.top,
              left: speck.left,
              width: speck.size,
              height: speck.size,
              animationDelay: speck.delay,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>

      <div className="w-full h-full flex items-center justify-between gap-4 md:gap-6 lg:gap-8 max-w-[1920px] mx-auto z-10">
        {/* Left Side Dynamic Full Photo (/sa.jpg) with RGB Lighting */}
        <div
          className={`hidden md:flex flex-1 h-[88vh] relative group animate-fade-in transition-opacity duration-700 ${
            stage === 'BLACKOUT' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Ambient Aura */}
          <div className="rgb-border-aura pointer-events-none" />

          {/* 3px RGB Border Box */}
          <div className="rgb-border-box w-full h-full relative z-10">
            {/* Original Photo Container - relative z-10 bg-slate-950 */}
            <div className="w-full h-full rounded-[calc(1.5rem-3px)] overflow-hidden relative z-10 bg-slate-950">
              <img
                src="/sa.jpg"
                alt="Saranya"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/80 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>

              {/* Cinematic Light Sweep Overlay during unlock */}
              {(stage === 'SWEEP' || stage === 'BLACKOUT') && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-10"
                  style={{
                    animation: 'photoSweep 0.8s ease-in-out forwards',
                  }}
                />
              )}

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="text-pink-300 text-xs font-medium tracking-wider uppercase text-center flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Forever In My Eyes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Central Elevated Glassmorphic Passcode Box (Preserves layout & dimensions) */}
        <div className="relative z-20 w-full max-w-md shrink-0 bg-slate-900/85 backdrop-blur-3xl p-6 sm:p-8 md:p-10 rounded-[2.5rem] border border-pink-500/40 shadow-[0_0_60px_rgba(244,63,94,0.3)] text-center space-y-5 mx-auto animate-fade-in">
          {/* Lock Icon Container */}
          <div className="flex justify-center">
            <div
              className={`w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 transition-all duration-500 ${
                lockGlowEnhanced || isUnlocking
                  ? 'shadow-[0_0_35px_rgba(244,63,94,0.7)] border-pink-400 scale-105'
                  : passcode.length > 0 || isPresenceDetected
                  ? 'shadow-[0_0_25px_rgba(244,63,94,0.5)] border-pink-400/60 animate-pulse'
                  : 'shadow-[0_0_20px_rgba(244,63,94,0.35)]'
              }`}
            >
              {stage === 'UNLOCKED_ICON' ||
              stage === 'GLOW' ||
              stage === 'SWEEP' ||
              stage === 'BLACKOUT' ? (
                <Unlock className="w-8 h-8 text-pink-200 transition-all duration-300 scale-105" />
              ) : (
                <Lock className="w-8 h-8 text-pink-300 transition-all duration-300" />
              )}
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
              {isUnlocking ? (
                <span>Unlocked... ❤️</span>
              ) : (
                <>
                  A Little World Made For You <span className="text-pink-500">❤️</span>
                </>
              )}
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Some memories are meant to be unlocked...
            </p>
          </div>

          {/* OPTIONAL CAMERA PRESENCE EXPERIENCE */}
          <div className="w-full">
            {cameraStatus === 'INACTIVE' && (
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleStartCamera}
                  disabled={isUnlocking}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:scale-105"
                  title="Enable Camera Presence Experience"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>✨ A little surprise</span>
                </button>
                {cameraError && (
                  <p className="text-rose-300/80 text-[11px] animate-in fade-in duration-300">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {cameraStatus === 'REQUESTING' && (
              <div className="py-2.5 flex items-center justify-center gap-2 text-pink-300 text-xs font-medium animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                <span>Connecting with camera...</span>
              </div>
            )}

            {cameraStatus === 'DENIED' && (
              <div className="py-1 flex flex-col items-center gap-1">
                <p className="text-rose-300/80 text-xs font-medium">
                  Camera experience skipped.
                </p>
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="text-pink-400/80 hover:text-pink-300 text-[11px] underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Try camera again
                </button>
              </div>
            )}

            {cameraStatus === 'ACTIVE' && (
              <div className="flex flex-col items-center justify-center py-2 animate-in fade-in zoom-in-95 duration-500 relative">
                {/* Circular Glass Camera Preview Container with 30s Countdown Ring */}
                <div className="relative w-36 h-36 mx-auto rounded-full flex items-center justify-center">
                  {/* Ambient Rose Glow Pulse */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-700 pointer-events-none ${
                      isPresenceDetected
                        ? 'bg-rose-500/25 blur-xl animate-pulse'
                        : 'bg-pink-500/10 blur-lg'
                    }`}
                  />

                  {/* SVG Circular Progress Ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20">
                    <circle
                      cx="72"
                      cy="72"
                      r={ringRadius}
                      className="stroke-slate-800/80 fill-none"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r={ringRadius}
                      className="stroke-rose-500 transition-all duration-1000 ease-linear fill-none drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                      strokeWidth="3.5"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Rounded Video Frame (Mirrored, local-only, no biometric storage) */}
                  <div className="w-[124px] h-[124px] rounded-full overflow-hidden relative z-10 bg-slate-950 border border-pink-500/40 shadow-inner">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {/* Subtle cyan/purple scanning line when searching for presence */}
                    {!isPresenceDetected && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none opacity-70 animate-scanLine blur-[0.5px]" />
                    )}

                    {/* Gentle rose sweep when presence is detected */}
                    {isPresenceDetected && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/15 via-transparent to-pink-500/15 pointer-events-none animate-pulse" />
                    )}
                  </div>

                  {/* Floating tiny heart when presence is detected */}
                  {isPresenceDetected && (
                    <div className="absolute -top-1 -right-1 text-xs text-rose-400 animate-bounce pointer-events-none z-30">
                      ❤️
                    </div>
                  )}
                </div>

                {/* Presence Detection Feedback */}
                <div className="mt-3.5 flex flex-col items-center">
                  {!isPresenceDetected ? (
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-pink-300 text-xs font-medium tracking-wide flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        <span>Waiting for you... ✨</span>
                      </p>
                      {countdown < 30 && (
                        <p className="text-slate-500 text-[11px]">
                          (Paused at {countdown}s — look into camera to resume)
                        </p>
                      )}
                    </div>
                  ) : countdown > 0 ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                        <span>Face Detected ❤️</span>
                      </div>
                      <p className="text-pink-200/90 text-xs italic mt-0.5">
                        "Something feels familiar..."
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-300 text-xs font-medium">
                          Stay for a little moment... ❤️
                        </span>
                        <span className="text-rose-400 font-bold text-sm tracking-wider px-2 py-0.5 rounded-lg bg-rose-950/70 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                          {countdown}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-300 text-sm font-bold tracking-wide animate-pulse">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span>Unlocked... ❤️</span>
                    </div>
                  )}

                  {/* Close camera preview button */}
                  {!isUnlocking && (
                    <button
                      type="button"
                      onClick={handleCloseCamera}
                      className="mt-2.5 inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-[11px] underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>Close camera preview</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Passcode Form (Always fully functional) */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter secret word..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                disabled={isUnlocking}
                className={`w-full bg-slate-950/70 placeholder-slate-500 rounded-2xl py-3.5 pl-11 pr-11 text-center text-lg outline-none transition-all shadow-inner ${
                  stage === 'GLOW' || stage === 'SWEEP' || stage === 'BLACKOUT'
                    ? 'text-amber-200 border border-amber-400/70 shadow-[0_0_25px_rgba(251,191,36,0.4)] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] tracking-wider'
                    : passcode.length > 0
                    ? 'text-pink-100 border border-pink-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'text-pink-100 border border-pink-500/30 focus:border-pink-500 focus:shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                }`}
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-pink-400/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400/60 hover:text-pink-300 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide secret word' : 'Show secret word'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-rose-300 text-sm font-medium transition-opacity animate-in fade-in duration-300">
                Not this one... try again ❤️
              </p>
            )}

            <button
              type="submit"
              disabled={isUnlocking}
              className={`w-full bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-500 transform active:scale-95 cursor-pointer ${
                isUnlocking
                  ? 'shadow-[0_0_45px_rgba(244,63,94,0.8)] scale-[1.02] opacity-100'
                  : 'shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:opacity-95'
              }`}
            >
              {isUnlocking ? 'Unlocked... ❤️' : 'Unlock Forever >'}
            </button>

            {/* Need a Hint? trigger */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-pink-400/80 hover:text-pink-300 text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Need a Hint? 💡</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Dynamic Full Photo (/sk.jpg) with RGB Lighting */}
        <div
          className={`hidden md:flex flex-1 h-[88vh] relative group animate-fade-in transition-opacity duration-700 ${
            stage === 'BLACKOUT' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Ambient Aura with -3s delay */}
          <div className="rgb-border-aura rgb-border-aura-right pointer-events-none" />

          {/* 3px RGB Border Box with -3s delay */}
          <div className="rgb-border-box rgb-border-box-right w-full h-full relative z-10">
            {/* Original Photo Container - relative z-10 bg-slate-950 */}
            <div className="w-full h-full rounded-[calc(1.5rem-3px)] overflow-hidden relative z-10 bg-slate-950">
              <img
                src="/sk.jpg"
                alt="Saranya & Abishek"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-950/20 via-transparent to-slate-950/80 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>

              {/* Cinematic Light Sweep Overlay during unlock */}
              {(stage === 'SWEEP' || stage === 'BLACKOUT') && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-10"
                  style={{
                    animation: 'photoSweep 0.8s ease-in-out forwards',
                  }}
                />
              )}

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="text-pink-300 text-xs font-medium tracking-wider uppercase text-center flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Always In My Heart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Rose Light Pulse at 1.7s */}
      {rosePulse && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background:
              'radial-gradient(circle at center, rgba(244,63,94,0.35) 0%, rgba(244,63,94,0.1) 45%, transparent 70%)',
            animation: 'pulseSpread 0.6s ease-out forwards',
          }}
        />
      )}

      {/* Smooth Cinematic Blackout Layer at 2.0s */}
      {stage === 'BLACKOUT' && (
        <div className="fixed inset-0 bg-black z-50 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-pink-500/30 blur-xl animate-ping"></div>
        </div>
      )}

      {/* Minimal Glassmorphic Cinematic Hint Modal */}
      {showHint && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowHint(false)}
        >
          <div
            className="max-w-sm w-full bg-slate-900/90 border border-pink-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.35)] backdrop-blur-xl relative text-center space-y-4 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 mx-auto shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <Lock className="w-6 h-6 text-pink-300" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Hint #01 🔐
              </h3>
              <p className="text-pink-300/90 text-sm font-medium">
                7 letters + 2 numbers...
              </p>
            </div>

            <div className="bg-pink-950/30 border border-pink-500/20 rounded-2xl p-4 text-xs text-slate-200 space-y-2 leading-relaxed text-left">
              <p className="flex items-center gap-2">
                <span>7 எழுத்துகள் ஒரு பெயர். ❤️</span>
              </p>
              <p className="flex items-center gap-2">
                <span>2 எண்கள் அவளுடைய பிறந்த தேதியிலிருந்து. 🎂</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-pink-500/20 text-xs font-semibold text-pink-200 transition-colors cursor-pointer"
            >
              Got it ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
