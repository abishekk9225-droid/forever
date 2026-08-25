import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Heart, Sparkles, AlertCircle, Eye } from 'lucide-react';
import ThreeDHeartBackground from './ThreeDHeartBackground';
import ProposalConfession from './ProposalConfession';
import { sendEmail } from '../utils/emailService';

const ADMIN_PHONE = '6380404055';
const FAST2SMS_API_KEY = 'tOA5S8nMw6IXZRiUzEcNBb93a7xuh2qTYeVsjLgyfQCkWmDl4dTOpwGi2XmRsMJIV5Be4hFk1PaHWfAU';

export default function SuspenseProposalFlow({ onYesAccepted }) {
  const [subStage, setSubStage] = useState('SUSPENSE'); // 'SUSPENSE' | 'GIFT_BOX' | 'TEASER' | 'GRAND_PROPOSAL'
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

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
    } catch (e) {}

    // 4. EmailJS notification to Gmail
    try {
      await sendEmail({
        title: 'Proposal Confession Accepted: YES! 💍✨',
        message: 'Saranya clicked YES on the 3D rotating heart confession page!',
      });
    } catch (e) {
      console.error('Failed to send proposal acceptance email:', e);
    }

    if (onYesAccepted) onYesAccepted();
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
          <motion.div
            key="gift_box"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            className="w-full p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_50px_rgba(244,114,182,0.25)] text-center relative"
          >
            {!isBoxOpen ? (
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
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl bg-white/[0.05] border border-rose-400/30 shadow-inner">
                  <span className="text-4xl block mb-2">😜😂</span>
                  <h4 className="text-2xl font-serif text-white mb-2">"Onnum illa..."</h4>
                  <p className="text-rose-200/80 text-xs italic">
                    Chumma oru prank! Original surprise adutha page-la irukku... 🙈❤️
                  </p>
                </div>

                <button
                  onClick={() => setSubStage('TEASER')}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 text-white font-medium text-sm tracking-wider shadow-lg hover:scale-102 transition cursor-pointer"
                >
                  Aii summa... 😆❤️
                </button>
              </motion.div>
            )}
          </motion.div>
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
              onClick={() => setSubStage('GRAND_PROPOSAL')}
              className="py-4 px-10 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-rose-600 text-white font-semibold text-base tracking-wider shadow-[0_0_35px_rgba(251,191,36,0.4)] transition cursor-pointer"
            >
              Show ✨
            </motion.button>
          </motion.div>
        )}

        {/* SUBSTAGE 4: GRAND 3D ROTATING HEART PROPOSAL + GOLDEN TEXT ANIMATIONS */}
        {subStage === 'GRAND_PROPOSAL' && (
          <ProposalConfession onAccept={handleYes} />
        )}
      </AnimatePresence>
    </div>
  );
}
