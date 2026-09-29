import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Sparkles, Heart, ArrowRight, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendEmail } from '../utils/emailService';
import CinematicSceneAtmosphere from './CinematicSceneAtmosphere';

// EXACT 6 SINCERE & RESPECTFUL PROMISES (NO PRESSURE, NO GUILT)
const PROMISES = [
  {
    id: 1,
    lines: [
      "உனக்காக எதுவாக இருந்தாலும்,",
      "என்னால் முடிந்ததை செய்வேன். ❤️"
    ]
  },
  {
    id: 2,
    lines: [
      "உன்னை எப்போதும்",
      "மரியாதையோடு பார்த்துக்கொள்வேன். ❤️"
    ]
  },
  {
    id: 3,
    lines: [
      "எந்த சூழ்நிலையிலும்",
      "உன் மனதை காயப்படுத்தாமல் இருக்க முயற்சி செய்வேன். ❤️"
    ]
  },
  {
    id: 4,
    lines: [
      "உன் கனவுகளையும்,",
      "உன் விருப்பங்களையும் மதிப்பேன். ❤️"
    ]
  },
  {
    id: 5,
    lines: [
      "நீ அருகில் இருந்தாலும்,",
      "தொலைவில் இருந்தாலும்,",
      "உன் நினைவுகளுக்கு மதிப்பு இருக்கும். ❤️"
    ]
  },
  {
    id: 6,
    lines: [
      "உன் விருப்பம் எதுவாக இருந்தாலும்,",
      "அதை நான் மதிப்பேன். ❤️"
    ]
  }
];

export default function PromiseVault({ onComplete }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeartFormation, setShowHeartFormation] = useState(false);
  const [showPersonalQuestion, setShowPersonalQuestion] = useState(false);

  // Personal message state
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showFinalTransition, setShowFinalTransition] = useState(false);

  const hasSubmittedRef = useRef(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#f43f5e', '#ffffff', '#fbbf24']
    });
  };

  const handleNextPromise = () => {
    if (currentIndex < PROMISES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Trigger final promise heart formation & sincere explanation
      setShowHeartFormation(true);
      setTimeout(() => {
        setShowPersonalQuestion(true);
      }, 3500);
    }
  };

  // Safe single-submission handler using existing EmailJS service
  const handleSubmitAnswer = async () => {
    if (hasSubmittedRef.current || isSubmitting) return;

    // Allow empty answers if user simply wants to proceed
    const trimmed = userAnswer.trim();

    hasSubmittedRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const emailBody = `
❤️ Promise Vault Response from Saranya:
----------------------------------------
Message:
"${trimmed || '(No written note provided - She proceeded silently)'}"

Time:
${formattedDate}

Source:
For Saranya Cinematic Experience
----------------------------------------
    `.trim();

    try {
      const isSent = await sendEmail({
        title: '❤️ A Message From The Promise Vault',
        message: emailBody,
      });

      if (isSent) {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        // After successful submission, trigger the cinematic handwritten transition
        setTimeout(() => {
          setShowFinalTransition(true);
        }, 1800);

        setTimeout(() => {
          onComplete();
        }, 6500);
      } else {
        throw new Error('Email service returned false');
      }
    } catch (err) {
      console.error('Promise Vault submission error:', err);
      hasSubmittedRef.current = false;
      setIsSubmitting(false);
      setSubmitError('ஒரு சிறிய technical issue ஏற்பட்டது... மீண்டும் முயற்சி செய்யலாம் ❤️');
    }
  };

  return (
    <div className="min-h-[82vh] w-full flex flex-col items-center justify-center p-4 text-center select-none z-30 relative animate-fade-in">
      {/* Cinematic Shared Atmosphere */}
      <CinematicSceneAtmosphere accentGlow="amber" />

      {/* ==================================================================== */}
      {/* STAGE 1: LOCKED VAULT VIEW WITH MAGICAL KEY                         */}
      {/* ==================================================================== */}
      {!isUnlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-zinc-950/85 backdrop-blur-3xl border border-amber-400/40 shadow-[0_0_60px_rgba(251,191,36,0.25)] space-y-6 relative overflow-hidden"
        >
          {/* Subtle Golden Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-purple-600/10 pointer-events-none" />

          <motion.div
            animate={{ scale: [1, 1.07, 1], rotate: [0, -3, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="w-22 h-22 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-zinc-950 shadow-[0_0_35px_rgba(251,191,36,0.6)] cursor-pointer"
            onClick={handleUnlock}
          >
            <KeyRound className="w-11 h-11"/>
          </motion.div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-300">
              Sacred Promises • The Vault
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Unlock My 6 Promises 🔐✨
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-serif italic pt-1">
              "6 eternal promises sealed exclusively for Saranya..."
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleUnlock}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Sparkles className="w-4 h-4"/>
            <span>Open Promise Vault</span>
          </motion.button>
        </motion.div>
      )}

      {/* ==================================================================== */}
      {/* STAGE 2: PROMISE REVEAL CARD VIEW (ONE BY ONE)                       */}
      {/* ==================================================================== */}
      {isUnlocked && !showPersonalQuestion && !showFinalTransition && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -25, scale: 0.94 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-zinc-950/85 backdrop-blur-3xl border border-rose-500/40 shadow-[0_0_60px_rgba(244,63,94,0.3)] space-y-6 text-center relative overflow-hidden"
        >
          {/* Header Progress Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-rose-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400"/>
              Promise {currentIndex + 1} of {PROMISES.length}
            </span>
            <span className="text-amber-300/80">Sealed in Heart 🔒</span>
          </div>

          {/* Golden Heart forming on final promise */}
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="p-4 rounded-full bg-gradient-to-tr from-amber-400/20 to-rose-500/20 border border-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.4)]"
            >
              <Heart className="w-8 h-8 fill-rose-500 text-amber-300" />
            </motion.div>
          </div>

          {/* Promise Text Lines (Sincere & Respectful) */}
          <div className="space-y-2 py-2">
            {PROMISES[currentIndex].lines.map((line, idx) => (
              <p
                key={idx}
                className="text-lg sm:text-2xl font-serif text-slate-100 font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
              >
                "{line}"
              </p>
            ))}
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {PROMISES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-gradient-to-r from-amber-400 to-rose-500' : 'w-2 bg-zinc-800'
                }`}
              />
            ))}
          </div>

          {/* Sincere disclaimer appearing on final promise */}
          {showHeartFormation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5 pt-3 border-t border-rose-400/20 text-xs sm:text-sm font-serif italic text-amber-200/90 leading-relaxed"
            >
              <p>"இந்த வாக்குறுதிகள்... உன்னை கட்டுப்படுத்துவதற்காக அல்ல."</p>
              <p className="font-medium text-rose-200">"என் மனதில் இருக்கும் உண்மையை சொல்லுவதற்காக. ❤️"</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNextPromise}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-medium text-sm tracking-wider shadow-[0_0_30px_rgba(244,114,182,0.4)] flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <span>
              {currentIndex === PROMISES.length - 1
                ? "இறுதி கேள்விக்கு செல்வோம் 💌"
                : "Next Promise 💖"}
            </span>
            <ArrowRight className="w-4 h-4"/>
          </motion.button>
        </motion.div>
      )}

      {/* ==================================================================== */}
      {/* STAGE 3: FINAL PERSONAL QUESTION + TEXT ANSWER + EMAIL SUBMISSION    */}
      {/* ==================================================================== */}
      {showPersonalQuestion && !showFinalTransition && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-zinc-950/90 backdrop-blur-3xl border border-amber-300/40 shadow-[0_0_65px_rgba(251,191,36,0.3)] space-y-6 text-center relative overflow-hidden"
        >
          {/* Header Title Required by Prompt */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif text-amber-100 font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              "இப்போ...
              <br />
              நீ என்னிடம் சொல்ல விரும்புவது ஏதாவது இருக்கிறதா? ❤️"
            </h3>
            <p className="text-xs sm:text-sm font-serif italic text-rose-200/80">
              "உன் மனதில் இருப்பதை சுதந்திரமாக எழுதலாம்..."
            </p>
          </div>

          {/* Beautiful Multiline Textarea */}
          <div className="space-y-2 text-left">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="உன் மனதில் இருப்பதை இங்கே எழுதலாம்... ❤️"
              rows={5}
              disabled={isSubmitting || submitSuccess}
              className="w-full px-5 py-4 rounded-2xl bg-black/60 border border-amber-400/35 text-white text-sm sm:text-base placeholder:text-white/30 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 transition-all duration-300 shadow-inner resize-none font-serif leading-relaxed"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500 px-1">
              <span>Free heartfelt expression (optional)</span>
              <span>{userAnswer.length} chars</span>
            </div>
          </div>

          {/* Technical Error Notice */}
          {submitError && (
            <p className="text-xs font-serif italic text-rose-400">
              {submitError}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={!isSubmitting ? { scale: 1.03 } : {}}
            whileTap={!isSubmitting ? { scale: 0.97 } : {}}
            onClick={handleSubmitAnswer}
            disabled={isSubmitting || submitSuccess}
            className={`w-full py-4 rounded-2xl font-serif text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 transition duration-300 cursor-pointer ${
              submitSuccess
                ? 'bg-emerald-600/90 text-white'
                : 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-[0_0_30px_rgba(251,191,36,0.4)]'
            }`}
          >
            {isSubmitting ? (
              <span>உன் வார்த்தைகளை பாதுகாத்துக்கொண்டிருக்கிறேன்... ❤️</span>
            ) : submitSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300"/>
                <span>உன் வார்த்தைகள் பாதுகாப்பாக சென்றுவிட்டது. ❤️</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-amber-200"/>
                <span>என் பதிலை வைத்துக்கொள் ❤️</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* ==================================================================== */}
      {/* STAGE 4: AFTER ANSWER — EMOTIONAL TRANSITION TO CERTIFICATE          */}
      {/* ==================================================================== */}
      {showFinalTransition && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="max-w-lg w-full p-8 sm:p-12 rounded-3xl bg-zinc-950/90 backdrop-blur-3xl border border-amber-300/40 shadow-[0_0_70px_rgba(251,191,36,0.35)] text-center space-y-6 relative overflow-hidden"
        >
          {/* Handwritten Card Preview */}
          {userAnswer.trim() && (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-amber-300/25 text-rose-200 text-xs sm:text-sm font-serif italic max-w-sm mx-auto shadow-inner">
              "{userAnswer.trim()}"
            </div>
          )}

          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-xl font-serif text-slate-200 font-light leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
            >
              "சில வார்த்தைகள்...
              <br />
              ஒரு screen-ல் எழுதப்படுவதில்லை."
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="text-lg sm:text-2xl font-serif text-amber-200 font-normal tracking-wide drop-shadow-[0_0_20px_rgba(251,191,36,0.85)]"
            >
              "அவை...
              <br />
              ஒரு நினைவாக மாறிவிடுகின்றன. ❤️"
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
            className="pt-2 text-xs font-mono text-zinc-400 uppercase tracking-widest"
          >
            Entering Certificate of Forever... ✨
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
