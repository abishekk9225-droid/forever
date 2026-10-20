import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSound } from '../context/SoundContext';
import CinematicRainbowBorder from './CinematicRainbowBorder';
import UmbrellaScene from './UmbrellaScene';

const ADMIN_PHONE = '6380404055';

// All 31 emotional paragraphs in natural, heartfelt Tamil Script (தமிழ் எழுத்துக்கள்)
const PARAGRAPHS_TAMIL = [
  "சரண்யா… நான் சொல்றதை ஒரு நிமிஷம் பொறுமையா கேளு. ❤️‍🩹",
  "தெரியுமா, ஏன் உன்னை love பண்ணேன்னு?",
  "உன்னை முதல் முறை பார்த்த உடனே எனக்குப் பிடிச்சுப் போச்சு. ஆனா, இது வரைக்கும் யாரையும் பார்த்து எனக்கு இப்படி ஒரு feeling வந்ததில்லை.",
  "நீ என்னை care பண்றது, protect பண்றது, என்னை பத்தி யோசிக்கிறது… இது எல்லாமே எனக்கு ரொம்ப பிடிக்கும்.",
  "நீ அடிக்கடி என்னை ஏதாவது பண்ண சொல்லுவல… அதை நான் ரொம்ப excitement-ஓட பண்ணுவேன். உன்னை நினைச்சிட்டே அதை பண்ணும்போது, அது எனக்கு ஒரு work மாதிரியே தெரியாது. எனக்கு அது ஒரு happiness.",
  "எவ்வளவு சண்டை வந்தாலும், நீ என்கிட்ட வந்து பேசுவ. இல்லைன்னா நான் உன்கிட்ட வந்து பேசிருவேன். ஆனா அந்த நாள் நீ என்னை ஒரு another person மாதிரி பேசுனது என்னால சுத்தமா தாங்கிக்க முடியல, control பண்ண முடியல.",
  "நான் சொல்ல வர வார்த்தைகளை நீ கேட்கவே இல்ல. அன்னைக்கு நீ கொஞ்சம் நேரம் என்னை பொறுமையா கேட்டிருந்தா, நான் அப்படி பேசியிருக்க மாட்டேன்.",
  "Just mail ID-ல login பண்ணி password மாத்துனதுனால இந்த website stop ஆகி, நான் ரொம்ப கஷ்டப்பட்டு பண்ணினதை lose பண்ணிட்டேன். தெரியுமா? நான் GitHub-ல போய் எவ்வளவு கஷ்டப்பட்டு தேடி, என்ன நடந்துச்சுன்னு கண்டுபிடிச்சேன்.",
  "ஆனா, அந்த நாள் எனக்கு என்ன ஆச்சுன்னு நீ கேட்டிருந்தா, எவ்வளவு பெரிய பிரச்சனை வராம இருந்திருக்கும் தெரியுமா?",
  "அந்த நாள் முழுக்க நான் எப்படி அழுது துடிச்சேன்னு, என்னை சுத்தி இருந்தவங்களுக்கு மட்டும்தான் தெரியும்.",
  "இதுவரைக்கும் ஒரு நபருக்காக நான் இவ்வளவு தூரம் வருத்தப்பட்டு அழுதது இதுதான் முதல் முறை.",
  "நான் யாரையும் இதுவரைக்கும் இப்படி hurt பண்ணது இல்ல. யாரையும் தப்பா நடத்தியிருந்தா அதுக்கு நான் முழு பொறுப்பு எடுத்துப்பேன். உன்னை நான் hurt பண்ணியிருந்தா, அதுக்காக மனசார sorry கேட்கிறேன்.",
  "இது வெறும் வார்த்தைகள் இல்ல, சரண்யா. உன் feelings-உம் எனக்கு ரொம்ப முக்கியம்.",
  "ஒரு promise-க்கு மேல ஒரு promise-ஆ சொல்றேன்…",
  "ஒவ்வொரு நிமிஷமும், ஒவ்வொரு hour-உம், ஒரு முறையாச்சும் உன்னை நினைக்காம நான் இருந்ததே இல்ல.",
  "தெரியுமா… எப்படியாச்சும் நீ எனக்கு phone பண்ணுவன்னு நான் ஏங்கி எதிர்பார்த்துட்டே இருந்தேன்.",
  "நான் உன்னை ஒரு நாள் மட்டும் love பண்ணல. ஒவ்வொரு நாளும் உன் கூட இன்னும் அன்பா, சந்தோஷமா இருக்கணும்னு தான் ஆசைப்படுறேன்.",
  "ஒண்ணு மட்டும் உன் மனசுல ஆழமா வச்சுக்கோ…",
  "நம்ம காதல்னால நம்ம career எப்பவுமே stop ஆகக் கூடாது. நம்ம ரெண்டு பேரும் சேர்ந்து நம்ம future-அ build பண்ணனும். உன் dreams-உம் என் dreams-உம் ரொம்ப முக்கியம்.",
  "நான் உன்னை எந்த சூழ்நிலையிலும் கைவிட மாட்டேன் என்று promise பண்றேன். ஆனா நம்ம ரெண்டு பேரும் ஒருத்தரோட feelings-அ இன்னொருத்தர் புரிஞ்சுகிட்டு, respect பண்ணி, மனம் விட்டு பேசி, ஒண்ணா சேர்ந்து problems-அ face பண்ணனும்.",
  "அன்னைக்கு உன்னை பார்க்காம இருக்க முடியாம தான் நான் class-க்கு வந்தேன். நான் ஏதாவது தப்பா பண்ணியிருந்தா, I am really sorry for that.",
  "என் மனசுல இருக்கிறதை உன்கிட்ட உண்மையா சொல்லணும்.",
  "Marriage பத்தி நான் யோசிக்கும்போது, என் மனசுல நீ மட்டும்தான் இருக்கிறாய். நம்ம future எப்படி இருக்கணும்னு நாம ரெண்டு பேரும் சேர்ந்துதான் முடிவு பண்ணனும்.",
  "நீ எனக்காக யார்கிட்ட பேச சொன்னாலும், எங்க, எப்போ பேச வேண்டியிருந்தாலும், நான் பொறுப்போட போய் பேசி explain பண்ண தயாரா இருக்கேன்.",
  "உன்னை எப்படி பார்த்துக்கணும்னு நினைக்கிறேனோ, அதைவிட நூறு மடங்கு அதிகமா உன் உணர்வுகளையும், உன் கனவுகளையும், உன் நம்பிக்கையையும் நான் பாதுகாப்பேன்.",
  "இதை நான் கும்பிடுற கடவுள் மேல சத்தியமா சொல்றேன்.",
  "ஆனா சரண்யா… நீ என்னை நம்பியே ஆகணும்னு நான் உன்னை force பண்ண மாட்டேன். என் வார்த்தைகள் மூலமா மட்டும் இல்ல, என் செயல்கள் (actions) மூலமா உன் நம்பிக்கையை திரும்ப earn பண்ண விரும்புறேன்.",
  "நீ இந்த message-அ படிச்சதுக்கு அப்புறம், என் மேல உனக்கு நம்பிக்கை இருந்தா, இந்த app-க்குள்ள வா… இல்லை என்கிட்ட உண்மையா உன் மனசுல என்ன தோணுதோ அதை பேசிட்டு வா.",
  "உன் மனசுல இருக்கிறதை நீ open-ஆ என்கிட்ட சொல்லலாம். நான் முழுசா கேட்க தயாரா இருக்கேன்.",
  "ஒரே ஒரு முறை என்கிட்ட பேசு, சரண்யா.",
  "நான் உனக்காக காத்திருக்கிறேன். ❤️"
];

// Build individual word tokens with granular pause timings
const ALL_TOKENS = [];
PARAGRAPHS_TAMIL.forEach((pText, pIndex) => {
  const words = pText.split(' ').filter(Boolean);

  // Especially meaningful lines & promises (2 second pause)
  const isSpecialPromise =
    pText.includes('career எப்பவுமே stop') ||
    pText.includes('கடவுள் மேல சத்தியமா') ||
    pText.includes('கைவிட மாட்டேன் என்று promise') ||
    pText.includes('ஒரே ஒரு முறை என்கிட்ட பேசு') ||
    pText.includes('நான் உனக்காக காத்திருக்கிறேன்');

  // Important emotional sentences (1.2–1.8 second pause)
  const isImportantEmotional =
    pText.includes('அழுது துடிச்சேன்னு') ||
    pText.includes('வருத்தப்பட்டு அழுதது') ||
    pText.includes('மனசார sorry கேட்கிறேன்') ||
    pText.includes('ஏங்கி எதிர்பார்த்துட்டே இருந்தேன்') ||
    pText.includes('GitHub-ல போய்');

  words.forEach((w, wIndex) => {
    ALL_TOKENS.push({
      word: w,
      pIndex,
      isParagraphStart: wIndex === 0,
      isParagraphEnd: wIndex === words.length - 1,
      isSpecialPromise,
      isImportantEmotional,
      isImportantHighlight: isSpecialPromise || isImportantEmotional,
    });
  });
});

export default function PhoneCallScene({ onComplete }) {
  const { startPhoneCallTrack, stopPhoneCallTrack, duckPhoneCallTrack } = useSound();

  // Controls the 6-second initial delay before the message box appears
  const [isMessageBoxVisible, setIsMessageBoxVisible] = useState(false);
  // Current typed word index: strictly starts at 0 so no message is visible at entry
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [showUmbrella, setShowUmbrella] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);
  const [isRainMuted, setIsRainMuted] = useState(false);

  const isOpeningUmbrellaRef = useRef(false);
  const rainCanvasRef = useRef(null);
  const letterContainerRef = useRef(null);
  const audioContextRef = useRef(null);
  const rainGainNodeRef = useRef(null);
  const ringOscillatorsRef = useRef([]);
  const ringIntervalRef = useRef(null);
  const userHasScrolledUpRef = useRef(false);

  // --------------------------------------------------------------------------
  // 1. SCENE AUDIO MANAGEMENT & RAIN SYNTHESIZER
  // --------------------------------------------------------------------------
  useEffect(() => {
    // A. Start mk.mp3 as clearly audible foreground music & duck existing background music
    if (typeof startPhoneCallTrack === 'function') {
      startPhoneCallTrack();
    }

    // B. Web Audio API Synthesizer for Stereo Rain & Distant Thunder
    let isCancelled = false;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
        const leftChannel = noiseBuffer.getChannelData(0);
        const rightChannel = noiseBuffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
          const whiteL = Math.random() * 2 - 1;
          const whiteR = Math.random() * 2 - 1;
          leftChannel[i] = (leftChannel[i - 1] || 0) * 0.92 + whiteL * 0.08;
          rightChannel[i] = (rightChannel[i - 1] || 0) * 0.92 + whiteR * 0.08;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(1400, ctx.currentTime);
        bandpass.Q.setValueAtTime(0.7, ctx.currentTime);

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(2800, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGainNodeRef.current = rainGain;
        rainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        rainGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2.0);

        noiseNode.connect(bandpass);
        bandpass.connect(lowpass);
        lowpass.connect(rainGain);
        rainGain.connect(ctx.destination);

        noiseNode.start(0);

        // Occasional distant subtle rolling thunder (every 36s)
        const triggerDistantThunder = () => {
          if (isCancelled || !audioContextRef.current) return;
          try {
            const tCtx = audioContextRef.current;
            if (tCtx.state !== 'running') return;
            const now = tCtx.currentTime;

            const tNoise = tCtx.createBufferSource();
            tNoise.buffer = noiseBuffer;
            const tFilter = tCtx.createBiquadFilter();
            tFilter.type = 'lowpass';
            tFilter.frequency.setValueAtTime(80, now);
            tFilter.frequency.exponentialRampToValueAtTime(45, now + 3.2);

            const tGain = tCtx.createGain();
            tGain.gain.setValueAtTime(0.0001, now);
            tGain.gain.linearRampToValueAtTime(0.08, now + 0.4);
            tGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

            tNoise.connect(tFilter);
            tFilter.connect(tGain);
            tGain.connect(tCtx.destination);
            tNoise.start(now);
            tNoise.stop(now + 3.8);

            setLightningFlash(true);
            setTimeout(() => setLightningFlash(false), 220);
          } catch {}
        };

        const thunderTimer = setInterval(triggerDistantThunder, 36000);

        return () => {
          isCancelled = true;
          clearInterval(thunderTimer);
          try {
            noiseNode.stop();
            ctx.close();
          } catch {}
        };
      }
    } catch (e) {
      console.warn('Web Audio rain ambience init deferred:', e);
    }

    return () => {
      isCancelled = true;
      if (typeof stopPhoneCallTrack === 'function') {
        stopPhoneCallTrack(1.5);
      }
    };
  }, [startPhoneCallTrack, stopPhoneCallTrack]);

  // Clean stop of ringing sound
  const stopRingingSound = useCallback(() => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    ringOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    ringOscillatorsRef.current = [];
  }, []);

  // Web Audio Ringing Sound Synthesizer
  const startRingingSound = useCallback(() => {
    stopRingingSound();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const playRingBurst = () => {
        try {
          const now = ctx.currentTime;
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(440, now);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(480, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
          gain.gain.setValueAtTime(0.18, now + 1.6);
          gain.gain.linearRampToValueAtTime(0.0001, now + 1.8);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 1.85);
          osc2.stop(now + 1.85);

          ringOscillatorsRef.current.push(osc1, osc2);
        } catch {}
      };

      playRingBurst();
      ringIntervalRef.current = setInterval(playRingBurst, 5000);
    } catch (e) {
      console.warn('Ringing synthesis error:', e);
    }
  }, [stopRingingSound]);

  // Exactly 6 seconds after the scene becomes active, smoothly reveal the message box
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMessageBoxVisible(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // --------------------------------------------------------------------------
  // 2. CANVAS RAIN STREAKS & WINDOW DROPLETS
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const drops = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 12,
      speed: Math.random() * 8 + 14,
      opacity: Math.random() * 0.35 + 0.18,
      thickness: Math.random() * 1.1 + 0.7,
    }));

    const windowDroplets = Array.from({ length: 28 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1.0,
      dripSpeed: Math.random() * 0.18 + 0.04,
      alpha: Math.random() * 0.35 + 0.18,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rain streaks
      ctx.lineCap = 'round';
      drops.forEach((d) => {
        ctx.lineWidth = d.thickness;
        ctx.strokeStyle = `rgba(225, 205, 250, ${d.opacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.length * 0.25, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= d.speed * 0.25;

        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * (width + 100);
        }
      });

      // Window droplets
      windowDroplets.forEach((w) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${w.alpha})`;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.fill();

        w.y += w.dripSpeed;
        if (w.y > height) {
          w.y = -10;
          w.x = Math.random() * width;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 3. SLOW EMOTIONAL TYPING ENGINE (1–2 WORDS/SEC + NATURAL SENTENCE PAUSES)
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Only begin typing once the message box is visible
    if (!isMessageBoxVisible || isFinished) return;

    if (currentWordIndex >= ALL_TOKENS.length) {
      setIsFinished(true);
      return;
    }

    const currentToken = ALL_TOKENS[currentWordIndex];

    // Gentle 600ms pause after message box reveals so user appreciates the entrance before words appear
    if (currentWordIndex === 0) {
      const initialTimer = setTimeout(() => {
        setCurrentWordIndex(1);
      }, 600);
      return () => clearTimeout(initialTimer);
    }

    // Exact Calibrated Timings:
    // 1. Base word delay: 550ms (~1.8 words per second, perfectly 1–2 words/sec)
    let delay = 550;

    // 2. Especially meaningful lines & promises: 2.0 second pause at end
    if (currentToken.isSpecialPromise && currentToken.isParagraphEnd) {
      delay = 2000;
    }
    // 3. Important emotional sentences: 1.5 second pause at end
    else if (currentToken.isImportantEmotional && currentToken.isParagraphEnd) {
      delay = 1500;
    }
    // 4. Normal paragraph end: 850ms pause
    else if (currentToken.isParagraphEnd) {
      delay = 850;
    }
    // 5. Normal sentence end (. or ? or ! or …): 700ms pause
    else if (currentToken.word) {
      const last = currentToken.word.slice(-1);
      if (['.', '?', '!', '…'].includes(last)) {
        delay = 700;
      } else if ([',', ':', ';'].includes(last)) {
        delay = 300;
      }
    }

    const timer = setTimeout(() => {
      setCurrentWordIndex((idx) => idx + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isMessageBoxVisible, currentWordIndex, isFinished]);

  // Gentle auto-scroll to keep the latest typed word visible (unless user scrolled up)
  useEffect(() => {
    const container = letterContainerRef.current;
    if (!container || userHasScrolledUpRef.current) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [currentWordIndex, isFinished]);

  const handleContainerScroll = () => {
    const el = letterContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    userHasScrolledUpRef.current = !isNearBottom;
  };

  const handleSkipTyping = () => {
    setIsMessageBoxVisible(true);
    setCurrentWordIndex(ALL_TOKENS.length);
    setIsFinished(true);
  };

  // --------------------------------------------------------------------------
  // 4. BUTTON ACTIONS
  // --------------------------------------------------------------------------
  const handleOpenUmbrella = () => {
    if (isOpeningUmbrellaRef.current) return;
    isOpeningUmbrellaRef.current = true;

    // Duck mk.mp3 cleanly to soft background level (0.05) over 1.2s without pausing it
    if (typeof duckPhoneCallTrack === 'function') {
      duckPhoneCallTrack(0.05, 1.2);
    }

    // Duck local rain synthesizer in PhoneCallScene so it doesn't clash with UmbrellaScene
    if (rainGainNodeRef.current && audioContextRef.current) {
      try {
        const now = audioContextRef.current.currentTime;
        rainGainNodeRef.current.gain.cancelScheduledValues(now);
        rainGainNodeRef.current.gain.setValueAtTime(rainGainNodeRef.current.gain.value, now);
        rainGainNodeRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      } catch {}
    }

    setShowUmbrella(true);
  };

  const handleButtonAAccept = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#ffd700', '#ffffff'],
    });

    if (typeof stopPhoneCallTrack === 'function') {
      stopPhoneCallTrack(1.6);
    }

    setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 850);
  };

  const handleButtonBCall = () => {
    startRingingSound();
    setShowIncomingCallModal(true);
  };

  const handleCloseCallModal = () => {
    stopRingingSound();
    setShowIncomingCallModal(false);
  };

  const handleActualPhoneCall = () => {
    stopRingingSound();
    if (ADMIN_PHONE) {
      window.location.href = `tel:${ADMIN_PHONE}`;
    }
  };

  const toggleRainMute = () => {
    setIsRainMuted((prev) => {
      const next = !prev;
      if (rainGainNodeRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        rainGainNodeRef.current.gain.cancelScheduledValues(now);
        rainGainNodeRef.current.gain.setValueAtTime(rainGainNodeRef.current.gain.value, now);
        rainGainNodeRef.current.gain.linearRampToValueAtTime(next ? 0.0001 : 0.12, now + 0.4);
      }
      return next;
    });
  };

  // Group strictly typed tokens into paragraphs
  const visibleTokens = ALL_TOKENS.slice(0, currentWordIndex);
  const renderedParagraphs = [];
  let currentGroup = [];
  let lastPIndex = -1;

  visibleTokens.forEach((token) => {
    if (token.pIndex !== lastPIndex) {
      if (currentGroup.length > 0) {
        renderedParagraphs.push({
          pIndex: lastPIndex,
          words: currentGroup,
          isImportant: currentGroup[0]?.isImportantHighlight,
        });
      }
      currentGroup = [token];
      lastPIndex = token.pIndex;
    } else {
      currentGroup.push(token);
    }
  });
  if (currentGroup.length > 0) {
    renderedParagraphs.push({
      pIndex: lastPIndex,
      words: currentGroup,
      isImportant: currentGroup[0]?.isImportantHighlight,
    });
  }

  return (
    <div className="fixed inset-0 w-full h-full text-white overflow-hidden select-none z-40 font-sans">
      {/* 1. PERSISTENT FULLSCREEN BACKGROUND (ph.jpg) — FULLY VISIBLE ACROSS ENTIRE VIEWPORT */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover transition-transform duration-1000"
          style={{
            backgroundImage: "url('/ph.jpg'), url('/ph.jpg.png')",
            backgroundPosition: 'center bottom',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Subtle, delicate atmospheric tint — leaves background rain, purple tones, lights, and flowers vivid & recognizable */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

        {/* Ambient Lightning Flash Overlay */}
        <div
          className={`absolute inset-0 bg-cyan-100 pointer-events-none transition-opacity duration-150 ${
            lightningFlash ? 'opacity-15' : 'opacity-0'
          }`}
        />
      </div>

      {/* 2. REALISTIC RAIN STREAKS & WINDOW DROPLETS CANVAS */}
      <canvas
        ref={rainCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 3. UNIVERSAL TRAVELLING RAINBOW BORDER */}
      <CinematicRainbowBorder mode="screen" />

      {/* 4. FLOATING BUTTERFLIES & ROSE PETALS (Behind Panel, Ambient) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <motion.div
          animate={{
            x: [0, 24, -12, 0],
            y: [0, -32, -14, 0],
            rotate: [0, 6, -5, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-10 text-2xl text-rose-300/40 drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]"
        >
          🦋✨
        </motion.div>
        <motion.div
          animate={{
            x: [0, -28, 16, 0],
            y: [0, -36, -18, 0],
            rotate: [0, -8, 6, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-24 right-12 text-2xl text-purple-300/35 drop-shadow-[0_0_14px_rgba(192,132,252,0.6)]"
        >
          🦋🌸
        </motion.div>
      </div>

      {/* 5. TOP RIGHT UTILITY BAR */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={toggleRainMute}
          title={isRainMuted ? 'மழை ஒலியை இயக்கு' : 'மழை ஒலியை நிறுத்து'}
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 text-rose-200 hover:text-white transition active:scale-95 cursor-pointer shadow-lg"
          aria-label="Toggle Rain Sound"
        >
          {isRainMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {isMessageBoxVisible && !isFinished && (
          <button
            onClick={handleSkipTyping}
            className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-rose-950/70 backdrop-blur-md border border-rose-400/30 text-rose-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-lg"
          >
            <Sparkles size={13} className="text-amber-300 animate-spin" />
            <span>முழு செய்தியையும் படிக்க</span>
          </button>
        )}
      </div>

      {/* 6. CENTRAL TRANSLUCENT DARK-PURPLE GLASS PANEL (UPPER-MIDDLE POSITION, STRICT FIXED HEIGHT) */}
      <div
        className="absolute inset-x-0 top-0 z-30 flex justify-center pointer-events-none px-4"
        style={{
          top: 'clamp(48px, 12vh, 90px)',
        }}
      >
        <AnimatePresence>
          {isMessageBoxVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto rounded-3xl bg-[#140420]/80 backdrop-blur-md border border-rose-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_25px_rgba(244,114,182,0.18)] overflow-hidden flex flex-col"
              style={{
                width: 'min(500px, 88vw)',
                height: 'min(46vh, 410px)',
                minHeight: '260px',
                boxSizing: 'border-box',
              }}
            >
          {/* Header: “அபிஷேக் சரண்யாவுக்காக எழுதுகிறார்…” */}
          <div className="px-5 py-3 border-b border-white/10 bg-white/[0.04] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <h3 className="text-xs sm:text-sm font-serif font-medium text-rose-200 tracking-wide">
                அபிஷேக் சரண்யாவுக்காக எழுதுகிறார்…
              </h3>
            </div>
            <span className="text-[11px] font-mono text-gray-400">
              01:42 AM
            </span>
          </div>

          {/* Letter Body: Scrollable, Reveals One Word at a Time (1-2 words/sec) */}
          <div
            ref={letterContainerRef}
            onScroll={handleContainerScroll}
            className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-3.5 text-left font-sans text-sm sm:text-[15px] leading-relaxed text-slate-100 scroll-smooth"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(244,114,182,0.3) transparent',
            }}
          >
            {/* Initial State: When 0 words typed, show gentle header with blinking cursor */}
            {renderedParagraphs.length === 0 && (
              <div className="flex items-center gap-2 text-rose-300 font-serif text-sm sm:text-base py-4">
                <span>அபிஷேக் சரண்யாவுக்காக எழுதுகிறார்…</span>
                <span className="inline-block w-2 h-4 bg-rose-400 animate-pulse" />
              </div>
            )}

            {/* Progressively typed paragraphs */}
            {renderedParagraphs.map((p, idx) => {
              const paragraphText = p.words.map((w) => w.word).join(' ');
              const isLastParagraph = idx === renderedParagraphs.length - 1;

              return (
                <p
                  key={p.pIndex}
                  className={`${
                    p.isImportant
                      ? 'text-amber-200 font-semibold border-l-2 border-amber-400/60 pl-3 py-1.5 my-1.5 font-serif'
                      : 'text-slate-100'
                  }`}
                >
                  {paragraphText}
                  {/* Blinking cursor strictly at the active typing edge */}
                  {isLastParagraph && !isFinished && (
                    <span className="inline-block w-1.5 h-4 ml-1.5 bg-rose-400 animate-pulse align-middle" />
                  )}
                </p>
              );
            })}

            {/* PHASE 4: FINAL EMOTIONAL PROMPT & THE EXACT TWO BUTTONS */}
            {isFinished && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="pt-4 border-t border-rose-500/25 space-y-4 text-center font-serif"
              >
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-widest font-mono text-rose-300">
                    இறுதிக் கேள்வி
                  </p>
                  <h4 className="text-base sm:text-lg font-bold text-white drop-shadow">
                    “இப்போ உன் மனசுல என்ன இருக்குன்னு எனக்குச் சொல்லு, Saranya…”
                  </h4>
                </div>

                {/* THE EXACT TWO BUTTONS IN TAMIL */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center w-full pt-1 pb-3">
                  {/* BUTTON A: “நான் ஒப்புக்கொள்கிறேன் ❤️” */}
                  <button
                    onClick={handleOpenUmbrella}
                    className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition cursor-pointer"
                  >
                    <Heart size={15} className="fill-white" />
                    <span>நான் ஒப்புக்கொள்கிறேன் ❤️</span>
                  </button>

                  {/* BUTTON B: “நான் உன்கிட்ட கொஞ்சம் பேசணும்…” */}
                  <button
                    onClick={handleButtonBCall}
                    className="flex-1 py-3 px-5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-emerald-500/40 text-emerald-200 hover:text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition cursor-pointer"
                  >
                    <Phone size={15} className="text-emerald-400" />
                    <span>நான் உன்கிட்ட கொஞ்சம் பேசணும்…</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. REALISTIC INCOMING-CALL OVERLAY (Triggered by Button B) */}
      <AnimatePresence>
        {showIncomingCallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center font-serif"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-sm w-full p-8 rounded-3xl bg-zinc-950/90 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col items-center space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold animate-pulse">
                  இணைப்பு அழைப்பு (Incoming Call)
                </span>
                <h3 className="text-2xl font-bold text-white">
                  அபிஷேக் (Abishek) ❤️
                </h3>
                <p className="text-xs text-gray-300">
                  நீ பேச நினைக்கும் அனைத்தையும் கேட்க காத்திருக்கிறான்
                </p>
              </div>

              {/* Pulsing Concentric Ripple Rings */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-pulse" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                  <Phone size={28} className="fill-white" />
                </div>
              </div>

              {/* Exact Required Tamil Text */}
              <div className="space-y-2 py-2 border-y border-white/10 w-full">
                <p className="text-xl font-bold text-white drop-shadow">
                  “Abishek-க்கு call பண்ணு…”
                </p>
                <p className="text-base font-semibold text-rose-300">
                  “அவன் உனக்காக wait பண்றான்… ❤️”
                </p>
              </div>

              {/* Call & Dismiss Actions */}
              <div className="flex gap-6 justify-center w-full pt-2">
                <button
                  onClick={handleCloseCallModal}
                  className="w-13 h-13 rounded-full bg-red-950/60 hover:bg-red-600 border border-red-500/40 text-red-200 hover:text-white flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
                  title="Close / Back to Letter"
                  aria-label="Decline"
                >
                  <PhoneOff size={20} />
                </button>

                <button
                  onClick={handleActualPhoneCall}
                  className="w-13 h-13 rounded-full bg-emerald-950/60 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-200 hover:text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 transition animate-pulse cursor-pointer"
                  title={`Call Abishek (${ADMIN_PHONE})`}
                  aria-label="Call Abishek"
                >
                  <Phone size={20} className="fill-current" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] text-gray-300 font-mono">
                  தொலைபேசி எண்: <strong className="text-white">{ADMIN_PHONE}</strong>
                </p>
                <button
                  onClick={() => {
                    handleCloseCallModal();
                    handleButtonAAccept();
                  }}
                  className="text-xs text-rose-300 hover:text-rose-100 underline transition cursor-pointer"
                >
                  அல்லது இணையதளப் பயணத்தைத் தொடர →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. CINEMATIC UMBRELLA SCENE OVERLAY */}
      <AnimatePresence>
        {showUmbrella && (
          <UmbrellaScene
            onComplete={handleButtonAAccept}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
