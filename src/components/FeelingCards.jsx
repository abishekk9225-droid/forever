import React, { useState } from 'react';
import { Phone, Star, Moon, FileText, Coffee, Flame, Heart } from 'lucide-react';

const memoryItems = [
  { id: 'phone', icon: Phone, label: "The first call", text: "That phone conversation changed everything.", x: '18%', y: '22%' },
  { id: 'star', icon: Star, label: "Twinkling star", text: "Finding comfort under the same night sky.", x: '75%', y: '15%' },
  { id: 'coffee', icon: Coffee, label: "Coffee chats", text: "Conversations that made hours feel like minutes.", x: '35%', y: '65%' },
  { id: 'note', icon: FileText, label: "Unspoken notes", text: "The words we didn't need to speak to understand.", x: '80%', y: '60%' },
  { id: 'moon', icon: Moon, label: "Moonlight", text: "Our thoughts aligning under the quiet moon.", x: '48%', y: '12%' },
  { id: 'firefly', icon: Flame, label: "Fireflies", text: "Simple moments lit up with genuine laughter.", x: '12%', y: '58%' }
];

export default function FeelingCards({ onComplete }) {
  const [tappedItems, setTappedItems] = useState(new Set());
  const [activeMessage, setActiveMessage] = useState('');
  const [activeCoords, setActiveCoords] = useState({ x: '50%', y: '50%' });

  const handleTap = (item, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    // Trigger reusable HeartBurst
    if (window.triggerHeartBurst) {
      window.triggerHeartBurst(clickX, clickY, 12);
    }
    // Play chime sound
    if (window.playRomanticChime) window.playRomanticChime();

    setTappedItems(prev => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });

    setActiveMessage(item.text);
    setActiveCoords({ x: item.x, y: item.y });
  };

  const showContinue = tappedItems.size >= 2;

  return (
    <div className="relative w-full max-w-lg mx-auto h-[480px] select-none flex flex-col justify-between p-4">
      {/* Title */}
      <div className="text-center z-10 space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">
          Memory Trail
        </span>
        <p className="text-xs text-gray-400">
          Tap the objects hidden in our garden to recall memories...
        </p>
      </div>

      {/* Floating Garden Objects Layer */}
      <div className="relative flex-grow w-full my-4 border border-white/5 bg-white/2 rounded-3xl overflow-hidden shadow-inner">
        {memoryItems.map((item) => {
          const Icon = item.icon;
          const isTapped = tappedItems.has(item.id);

          return (
            <button
              key={item.id}
              onClick={(e) => handleTap(item, e)}
              className="absolute p-3 rounded-full border bg-zinc-950/40 hover:bg-rose-500/10 active:scale-95 transition-all duration-300 pointer-events-auto"
              style={{
                left: item.x,
                top: item.y,
                transform: 'translate(-50%, -50%)',
                borderColor: isTapped ? 'rgba(242, 133, 168, 0.45)' : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isTapped ? '0 0 16px rgba(242, 133, 168, 0.22)' : 'none'
              }}
              aria-label={item.label}
            >
              <Icon
                size={22}
                className={isTapped ? 'text-rose-300 animate-pulse' : 'text-gray-400/80'}
              />
            </button>
          );
        })}

        {/* Display Active Memory Overlay */}
        {activeMessage && (
          <div
            key={activeMessage}
            className="absolute bg-zinc-950/85 border border-rose-500/20 backdrop-blur-md rounded-2xl p-3.5 max-w-[200px] text-xs text-rose-100 font-sans shadow-xl text-center pointer-events-none animate-fadeIn z-30"
            style={{
              left: activeCoords.x,
              top: `calc(${activeCoords.y} + 40px)`,
              transform: 'translateX(-50%)'
            }}
          >
            {activeMessage}
          </div>
        )}
      </div>

      {/* Progress and Tamil Verse Overlay */}
      <div className="z-10 text-center space-y-4">
        {/* Discovered progress */}
        <div className="flex justify-center items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold text-gray-500">
          <span>Discovered:</span>
          {memoryItems.map((item) => (
            <div
              key={item.id}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                tappedItems.has(item.id) ? 'bg-rose-500 shadow-[0_0_4px_#ff0055]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* First Tamil split beat appears upon tapping >= 2 items */}
        {showContinue && (
          <div className="animate-fadeIn p-4 border border-rose-500/5 bg-rose-950/5 rounded-2xl max-w-sm mx-auto">
            <p
              className="text-xs md:text-sm text-rose-200 leading-relaxed font-sans italic select-none"
              style={{
                fontFamily: "'Mukta Malar', 'Latha', 'Tamil', sans-serif"
              }}
            >
              "சில சந்திப்புகள்...
              நினைவாக மட்டும் இருப்பதில்லை.
              
              நம்மை அறியாமலே...
              நம் வாழ்க்கையின் ஒரு பகுதியாக மாறிவிடும்."
            </p>
          </div>
        )}

        {/* Action Continue Nudge */}
        <div className="flex justify-center pt-2 min-h-[44px]">
          {showContinue && (
            <button
              onClick={onComplete}
              className="px-8 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-md shadow-rose-500/10 pointer-events-auto"
            >
              Continue when ready →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
