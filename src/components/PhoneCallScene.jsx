import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, MessageSquare } from 'lucide-react';

export default function PhoneCallScene({ onComplete }) {
  const [callState, setCallState] = useState('ringing'); // ringing, connected, dialog_done
  const [dialogIndex, setDialogIndex] = useState(0);

  const dialogs = [
    { sender: 'abishek', text: "Hey Saranya..." },
    { sender: 'saranya', text: "Hey Abishek! 😊" },
    { sender: 'abishek', text: "Do you remember how we first met?" },
    { sender: 'abishek', text: "It wasn't across a table or in a crowded room..." },
    { sender: 'saranya', text: "Right, it started with a phone call! 📱" },
    { sender: 'abishek', text: "Yeah... funny how one ordinary call can become the beginning of everything you never expected." }
  ];

  // Auto-progress dialogue after call connects
  useEffect(() => {
    if (callState === 'connected') {
      const timer = setTimeout(() => {
        if (dialogIndex < dialogs.length - 1) {
          setDialogIndex((prev) => prev + 1);
        } else {
          setCallState('dialog_done');
        }
      }, dialogIndex === 0 ? 1500 : dialogs[dialogIndex].text.length * 50 + 1200); // Dynamic timer based on text length

      return () => clearTimeout(timer);
    }
  }, [callState, dialogIndex]);

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 rounded-3xl glass-card border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
      
      <AnimatePresence mode="wait">
        
        {/* RINGING SCREEN */}
        {callState === 'ringing' && (
          <motion.div
            key="ringing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-between flex-grow"
          >
            <div className="text-center mt-6">
              <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold font-sans animate-pulse">
                Incoming Call
              </span>
              <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-white mt-2">
                Saranya ❤️
              </h3>
              <p className="text-xs text-gray-500 mt-1">Abishek's Heart is calling...</p>
            </div>

            {/* Glowing Ring Animation */}
            <div className="relative w-28 h-28 my-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-rose-500/10 rounded-full animate-ping" />
              <div className="absolute inset-4 bg-rose-500/20 rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
                <Phone size={32} className="animate-bounce" />
              </div>
            </div>

            {/* Call Buttons */}
            <div className="flex gap-10 mb-4">
              {/* Decline Button (shrink or bounce away) */}
              <motion.button
                id="btn-call-decline"
                whileHover={{ scale: 0.9 }}
                onClick={() => alert("Are you sure? You cannot decline Abishek's love! 😭❤️")}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                <PhoneOff size={22} />
              </motion.button>
              
              {/* Accept Button */}
              <motion.button
                id="btn-call-accept"
                whileHover={{ scale: 1.1 }}
                onClick={() => setCallState('connected')}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20 animate-pulse transition-all active:scale-95"
              >
                <Phone size={22} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* DIALOG SCREEN (CONNECTED) */}
        {(callState === 'connected' || callState === 'dialog_done') && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-between flex-grow"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-300">Call Connected</span>
              </div>
              <span className="text-[10px] text-rose-300 font-medium">Saranya ❤️ Abishek</span>
            </div>

            {/* Simulated Dialogue Box */}
            <div className="flex-grow flex flex-col justify-end space-y-4 min-h-[220px] max-h-[260px] overflow-y-auto pr-1">
              <AnimatePresence>
                {dialogs.slice(0, dialogIndex + 1).map((dlg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${dlg.sender === 'abishek' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs md:text-sm shadow-md leading-relaxed ${
                        dlg.sender === 'abishek'
                          ? 'bg-zinc-800 text-gray-100 rounded-bl-none border border-white/5'
                          : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-br-none'
                      }`}
                    >
                      {dlg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Audio Waveform Animation */}
            {callState === 'connected' && (
              <div className="flex justify-center items-end gap-1.5 h-12 my-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                  const delay = Math.random() * 0.5;
                  const duration = Math.random() * 0.6 + 0.4;
                  return (
                    <motion.div
                      key={bar}
                      animate={{ height: ['8px', '32px', '8px'] }}
                      transition={{
                        repeat: Infinity,
                        duration: duration,
                        delay: delay,
                        ease: 'easeInOut'
                      }}
                      className="w-1 rounded-full bg-gradient-to-t from-rose-500 to-purple-600 opacity-60"
                    />
                  );
                })}
              </div>
            )}

            {/* Continue button when dialogue is finished */}
            {callState === 'dialog_done' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-4 border-t border-white/5 flex justify-center"
              >
                <button
                  id="btn-call-continue"
                  onClick={onComplete}
                  className="px-8 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/10 flex items-center gap-1.5"
                >
                  Start our little story →
                </button>
              </motion.div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
