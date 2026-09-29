import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { sendEmail } from '../utils/emailService';

export default function SecretMessageCard() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || status === 'sending') return;

    setStatus('sending');

    try {
      await sendEmail({
        title: 'Forever Proposal Response 💌',
        message: message.trim(),
      });
      setStatus('sent');
    } catch (error) {
      console.error('Failed to send secret message email:', error);
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 px-4 z-40 relative select-none">
      <div className="p-7 sm:p-9 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-rose-400/35 shadow-[0_0_55px_rgba(244,114,182,0.25)] relative overflow-hidden">
        {/* Soft Ambient Floating Light */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-rose-500/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-amber-400/10 blur-2xl" />
        </div>

        <div className="relative z-10 flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-heartbeat"/>
          <h3 className="text-white font-serif italic text-xl tracking-wide">
            Leave a note for Abishek
          </h3>
        </div>

        <p className="relative z-10 text-rose-200/75 text-xs sm:text-sm font-serif italic mb-5 leading-relaxed">
          "Write anything in your heart... it lands directly in his inbox ✨"
        </p>

        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-7 text-center space-y-2 relative z-10"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] mb-2">
                <CheckCircle2 className="w-8 h-8"/>
              </div>
              <h4 className="text-white font-serif text-lg sm:text-xl font-medium">Your note was delivered ❤️</h4>
              <p className="text-rose-200/70 text-xs sm:text-sm font-serif italic">He will cherish every single word.</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSendMessage} className="space-y-4 relative z-10">
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-black/60 border border-rose-500/35 text-white placeholder-white/30 text-sm sm:text-base focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 transition-all duration-300 resize-none shadow-inner font-serif leading-relaxed"
                />
              </div>

              {status === 'error' && (
                <p className="text-rose-400 text-xs font-serif italic">
                  Delivery hiccup. Please check internet and tap Send again!
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !message.trim()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 text-white font-medium text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(244,114,182,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white"/>
                    <span>Sending your note...</span>
                  </>
                ) : (
                  <>
                    <span>Send Secret Note</span>
                    <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300"/>
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
