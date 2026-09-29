import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, AlertCircle, Eye } from 'lucide-react';
import ProposalConfession from './ProposalConfession';
import SecretGiftCinematicScene from './SecretGiftCinematicScene';
import EmotionalWaitingScene from './EmotionalWaitingScene';
import StillWaitingCinematicScene from './StillWaitingCinematicScene';
import CinematicSecretGiftBackground from './CinematicSecretGiftBackground';
import { sendEmail } from '../utils/emailService';

const ADMIN_PHONE = '6380404055';
const FAST2SMS_API_KEY = 'tOA5S8nMw6IXZRiUzEcNBb93a7xuh2qTYeVsjLgyfQCkWmDl4dTOpwGi2XmRsMJIV5Be4hFk1PaHWfAU';

export default function SuspenseProposalFlow({ onYesAccepted }) {
  const [subStage, setSubStage] = useState('SUSPENSE'); // 'SUSPENSE' | 'GIFT_BOX' | 'TEASER' | 'GRAND_PROPOSAL' | 'EMOTIONAL_WAITING' | 'STILL_WAITING'
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  // ==========================================================================
  // lk.mp3 AUDIO SYNCHRONIZATION FOR GRAND PROPOSAL
  //
  // Timeline:
  //   T=0      → "Show ✨" clicked: audio.currentTime set to 9.0s, play() called
  //   T=0+     → setSubStage('GRAND_PROPOSAL') called immediately after play starts
  //   T=0→2s  → AnimatePresence exit (TEASER) + enter (ProposalConfession) ~2s
  //   T≈2s    → Proposal fully visible; audio.currentTime ≈ 11.0s
  // ==========================================================================
  const lkAudioRef = useRef(null);
  const hasStartedLkRef = useRef(false);

  // Cleanup lk.mp3 on unmount to prevent leaks / duplicate instances
  useEffect(() => {
    return () => {
      if (lkAudioRef.current) {
        lkAudioRef.current.pause();
        lkAudioRef.current.currentTime = 0;
        lkAudioRef.current = null;
      }
      hasStartedLkRef.current = false;
    };
  }, []);

  /**
   * Start /lk.mp3 at exactly currentTime=9.0s, then immediately
   * transition to GRAND_PROPOSAL so the 2-second entry animation
   * carries the audio from 9.0→11.0s.
   *
   * Guards:
   * - hasStartedLkRef prevents double-fire from React StrictMode or re-render
   * - lkAudioRef prevents creating a second Audio instance
   */
  const handleShowProposal = () => {
    // Guard: never create a second instance
    if (hasStartedLkRef.current) {
      setSubStage('GRAND_PROPOSAL');
      return;
    }
    hasStartedLkRef.current = true;

    try {
      const audio = new Audio('/lk.mp3');
      audio.volume = 0.85;
      audio.loop = false;
      audio.preload = 'auto';

      // Seek to exactly 9.0 seconds so audio is at the right position
      // when Proposal entry transition begins
      audio.currentTime = 9.0;
      lkAudioRef.current = audio;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        // Transition to GRAND_PROPOSAL immediately after play() resolves
        // (or rejects — browser policy). Either way the scene starts right away.
        playPromise
          .then(() => {
            // audio.currentTime ≈ 9.0s; Proposal entry animation begins now
            setSubStage('GRAND_PROPOSAL');
          })
          .catch((err) => {
            // Autoplay blocked — still transition; audio will attempt resume on next gesture
            console.warn('lk.mp3 autoplay deferred by browser:', err);
            setSubStage('GRAND_PROPOSAL');

            // Fallback: resume on next user interaction
            const resumeOnGesture = () => {
              if (lkAudioRef.current && lkAudioRef.current.paused) {
                lkAudioRef.current.play().catch(() => {});
              }
              window.removeEventListener('click', resumeOnGesture);
              window.removeEventListener('touchstart', resumeOnGesture);
            };
            window.addEventListener('click', resumeOnGesture, { once: true });
            window.addEventListener('touchstart', resumeOnGesture, { once: true });
          });
      } else {
        // Legacy browser without Promise-based play()
        setSubStage('GRAND_PROPOSAL');
      }
    } catch (e) {
      console.warn('lk.mp3 initialization error:', e);
      // Ensure we still navigate even if audio fails entirely
      setSubStage('GRAND_PROPOSAL');
    }
  };

  // Synchronize suspense buildup with heartbeat BPM
  useEffect(() => {
    if (window.heartbeatEngine) {
      switch (subStage) {
        case 'SUSPENSE':
          window.heartbeatEngine.setTargetBPM(126, 0.48);
          break;
        case 'GIFT_BOX':
          window.heartbeatEngine.setTargetBPM(132, 0.50);
          break;
        case 'TEASER':
          window.heartbeatEngine.setTargetBPM(136, 0.52);
          break;
        default:
          break;
      }
    }
  }, [subStage]);

  const dodgeNoButton = () => {
    const randomX = (Math.random() - 0.5) * 260;
    const randomY = (Math.random() - 0.5) * 160;
    setNoPos({ x: randomX, y: randomY });
    setDodgeCount((prev) => prev + 1);
  };

  const handleYes = async () => {
    // 1. Audio jump to climax 219s
    if (typeof window.triggerClimaxAudio === 'function') {
      window.triggerClimaxAudio();
    }

    // 2. Confetti explosion
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#ffd54f', '#ffffff'],
    });

    // 3. Fast2SMS notification
    try {
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: 'Saranya said YES to the Proposal! 💍❤️',
          language: 'english',
          numbers: ADMIN_PHONE,
        }),
      });
    } catch {}

    // 4. EmailJS notification to Gmail
    try {
      await sendEmail({
        title: 'Proposal Confession Accepted: YES! 💍✨',
        message: 'Saranya clicked YES on the 3D rotating heart confession page!',
      });
    } catch (e) {
      console.error('Failed to send proposal acceptance email:', e);
    }

    // Transition to the new Emotional Waiting Scene ("100 ஜென்மம் காத்திருப்பேன்...")
    setSubStage('EMOTIONAL_WAITING');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 z-30 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {/* SUBSTAGE 1: SUSPENSE QUESTION */}
        {subStage === 'SUSPENSE' && (
          <motion.div
            key="suspense"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="w-full p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-8 h-8 animate-pulse"/>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-4">
              Saranya, oru mukkiyamana vishayam... 🥺
            </h3>

            <p className="text-rose-100/90 text-sm sm:text-base font-serif italic mb-8 leading-relaxed">
              "Naan onnu solluven... adhu nee epdi eduthukkuve-nu therila. Sollatta? Aana naan sonna aprom nee enkitta pesama irukka koodathu... ok-va? ❤️"
            </p>

            <div className="flex items-center justify-center gap-5 relative min-h-[90px] w-full">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSubStage('GIFT_BOX')}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.5)] transition cursor-pointer z-10"
              >
                Sollu da ❤️
              </motion.button>

              <motion.button
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                onMouseEnter={dodgeNoButton}
                onTouchStart={dodgeNoButton}
                onClick={dodgeNoButton}
                className="py-3 px-6 rounded-2xl bg-zinc-900/80 border border-white/20 text-white/50 text-xs select-none cursor-pointer"
              >
                Venaa 🙈
              </motion.button>
            </div>

            {dodgeCount > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-300/80 italic mt-3"
              >
                {dodgeCount > 2
                  ? "Escape aaga mudiyadhu! 'Sollu da' mattum thaan option 😜❤️"
                  : "Oops! You can't click this 🙈"}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* SUBSTAGE 2: PRANK GIFT BOX & LETTER */}
        {subStage === 'GIFT_BOX' && (
          <>
            <CinematicSecretGiftBackground />

            <motion.div
              key="gift_box"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              className="w-full p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative z-20"
            >
              <div
                onClick={() => setIsBoxOpen(true)}
                className="cursor-pointer group flex flex-col items-center justify-center py-6"
              >
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-0.5 shadow-[0_0_35px_rgba(244,114,182,0.6)] group-hover:scale-105 transition-transform flex items-center justify-center animate-bounce">
                  <div className="w-full h-full rounded-3xl bg-zinc-950 flex items-center justify-center">
                    <Gift className="w-14 h-14 text-rose-400"/>
                  </div>
                </div>
                <h3 className="text-xl font-serif text-white mt-6 mb-1">
                  Tap to Open Your Secret Gift 🎁✨
                </h3>
                <p className="text-xs text-rose-300/70">Unakkaga oru chinna message ulla irukku...</p>
              </div>
            </motion.div>

            {isBoxOpen && (
              <SecretGiftCinematicScene
                onComplete={() => {
                  setIsBoxOpen(false);
                  setSubStage('TEASER');
                }}
              />
            )}
          </>
        )}

        {/* SUBSTAGE 3: TEASER SCREEN */}
        {subStage === 'TEASER' && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="w-full p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Eye className="w-8 h-8 animate-pulse"/>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">
              Saranya, I want to show you something... ✨
            </h3>

            <p className="text-rose-200/80 text-xs sm:text-sm font-serif italic mb-8">
              "En manasula irukkuradha ippo un kannu munnadi kaatta poren..."
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowProposal}
              className="py-4 px-10 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-rose-600 text-white font-semibold text-base tracking-wider shadow-[0_0_35px_rgba(251,191,36,0.4)] transition cursor-pointer"
            >
              Show ✨
            </motion.button>
          </motion.div>
        )}

        {/* SUBSTAGE 4: GRAND PROPOSAL CONFESSION ("THE LAST FRAME") */}
        {subStage === 'GRAND_PROPOSAL' && (
          <ProposalConfession key="grand_proposal" onAccept={handleYes} onReject={() => setSubStage('SUSPENSE')} />
        )}

        {/* SUBSTAGE 5: EXISTING EMOTIONAL WAITING SCENE ("100 ஜென்மம் காத்திருப்பேன்...") */}
        {subStage === 'EMOTIONAL_WAITING' && (
          <EmotionalWaitingScene
            key="emotional_waiting"
            onComplete={() => setSubStage('STILL_WAITING')}
          />
        )}

        {/* SUBSTAGE 6: NEW REALISTIC CINEMATIC "STILL WAITING" SCENE */}
        {subStage === 'STILL_WAITING' && (
          <StillWaitingCinematicScene
            key="still_waiting"
            onComplete={() => {
              if (onYesAccepted) onYesAccepted();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
