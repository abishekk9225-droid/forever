import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, ArrowRight, MessageCircle } from 'lucide-react';
import { sendEmail } from '../utils/emailService';
import CinematicSceneAtmosphere from './CinematicSceneAtmosphere';

const ADMIN_PHONE = '6380404055';
const FAST2SMS_API_KEY = 'tOA5S8nMw6IXZRiUzEcNBb93a7xuh2qTYeVsjLgyfQCkWmDl4dTOpwGi2XmRsMJIV5Be4hFk1PaHWfAU';

const QUESTIONS = [
  {
    id: 1,
    category: "Our Memory",
    question: "நாம முதல் முதலா பேசி சிரிச்ச அந்த தருணம் உனக்கு இன்னும் ஞாபகம் இருக்கா?",
    options: [
      { text: "எப்பவுமே என் மனசுல பத்திரமா இருக்கு ❤️" },
      { text: "மறக்கவே முடியாத ஒரு மேஜிக் ✨" }
    ]
  },
  {
    id: 2,
    category: "The Bond",
    question: "என்கிட்ட உனக்கு ரொம்ப பிடிச்ச ஒரு விஷயம் எது?",
    options: [
      { text: "உன்னோட இந்த அன்பும் அக்கறையும் 🥰" },
      { text: "உன்னோட சிரிப்பும் குழந்தை மனசும் ✨" }
    ]
  },
  {
    id: 3,
    category: "The Promise",
    question: "வாழ்க்கையோட கடைசி வரைக்கும் இந்த கையை விடாம கூடவே இருப்பியா?",
    options: [
      { text: "எந்த ஜென்மமானாலும் உன் கூடத்தான் 💍" },
      { text: "Forever & Always with you ❤️" }
    ]
  }
];

export default function PostProposalQuiz({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [selectedOptIdx, setSelectedOptIdx] = useState(null);

  const handleSelectOption = async (option, optIdx) => {
    setSelectedOptIdx(optIdx);

    const updatedAnswers = { ...answers, [QUESTIONS[currentIndex].category]: option.text };
    setAnswers(updatedAnswers);

    setTimeout(async () => {
      setSelectedOptIdx(null);
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCompleted(true);

        const summaryText = `Proposal Answers:\n1. Memory: ${updatedAnswers['Our Memory']}\n2. Bond: ${updatedAnswers['The Bond']}\n3. Promise: ${updatedAnswers['The Promise']}`;

        // 1. Fast2SMS Trigger
        try {
          await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
              'authorization': FAST2SMS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              route: 'q',
              message: `Saranya answered YES! Answers:\n1. ${updatedAnswers['Our Memory']}\n2. ${updatedAnswers['The Bond']}\n3. ${updatedAnswers['The Promise']}`,
              language: 'english',
              numbers: ADMIN_PHONE,
            }),
          });
        } catch (e) {}

        // 2. EmailJS Trigger to Gmail
        try {
          await sendEmail({
            title: 'Proposal Quiz Responses & YES! 💖',
            message: summaryText,
          });
        } catch (e) {
          console.error('Failed to send proposal quiz email:', e);
        }
      }
    }, 450); // Gentle 450ms ripple & zoom effect before advancing
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey Abishek! ❤️ I said YES to Forever! 💍✨\n\nHere are my answers:\n1. ${answers['Our Memory'] || ''}\n2. ${answers['The Bond'] || ''}\n3. ${answers['The Promise'] || ''}\n\nForever & Always with you! 💖`
    );
    window.open(`https://wa.me/91${ADMIN_PHONE}?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 px-4 z-40 relative select-none">
      {/* Cinematic Shared Atmosphere */}
      <CinematicSceneAtmosphere accentGlow="amber" />

      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key={`quiz-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-amber-300/35 shadow-[0_0_60px_rgba(251,191,36,0.2)] relative overflow-hidden"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-300/90 flex items-center gap-1.5">
                <Stars className="w-3.5 h-3.5 text-amber-400"/>
                {QUESTIONS[currentIndex].category} • {currentIndex + 1} of 3
              </span>
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse"/>
            </div>

            {/* Question Text */}
            <h3 className="text-xl sm:text-2xl font-serif text-white/95 mb-8 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              "{QUESTIONS[currentIndex].question}"
            </h3>

            {/* Options */}
            <div className="space-y-4">
              {QUESTIONS[currentIndex].options.map((opt, idx) => {
                const isSelected = selectedOptIdx === idx;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOption(opt, idx)}
                    className={`w-full p-4 sm:p-5 rounded-2xl text-left text-sm sm:text-base flex items-center justify-between transition-all duration-300 group cursor-pointer shadow-lg relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/30 via-rose-500/25 to-purple-600/30 border border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.4)] scale-[1.02]'
                        : 'bg-white/[0.04] border border-amber-400/25 hover:border-amber-300/60 hover:bg-white/[0.07] text-white'
                    }`}
                  >
                    <span className="font-serif pr-4 text-slate-100">{opt.text}</span>
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 group-hover:bg-amber-400 group-hover:text-zinc-950 transition duration-300 shrink-0">
                      <ArrowRight className="w-4 h-4"/>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ================================================================= */
          /* COMPLETION STAGE: "MEMORIES FADE... BUT ONES THAT MATTER STAY"    */
          /* ================================================================= */
          <motion.div
            key="quiz-success"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="p-8 sm:p-10 rounded-3xl bg-zinc-950/90 border border-amber-400/40 text-center shadow-[0_0_55px_rgba(251,191,36,0.3)] space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400/20 to-rose-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <Heart className="w-8 h-8 fill-amber-400 text-amber-300 animate-heartbeat"/>
            </div>

            {/* Emotional Staged Text Required */}
            <div className="space-y-2 pt-1">
              <p className="text-lg sm:text-xl font-serif text-slate-200 font-light leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
                "Memories fade..."
              </p>
              <h4 className="text-xl sm:text-3xl font-serif text-amber-200 font-normal tracking-wide drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                "But the ones that matter stay. ❤️"
              </h4>
            </div>

            <p className="text-rose-200/70 text-xs sm:text-sm font-serif italic max-w-sm mx-auto">
              Your sweet answers have been delivered straight to Abishek.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={openWhatsApp}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366]/90 hover:bg-[#25D366] text-white font-medium text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.4)] transition cursor-pointer"
              >
                <MessageCircle className="w-5 h-5"/>
                <span>Send to Abishek on WhatsApp 💬</span>
              </button>

              <button
                onClick={onComplete}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(244,114,182,0.4)] transition duration-300 cursor-pointer"
              >
                <span>Enter The Promise Vault 🔑</span>
                <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
