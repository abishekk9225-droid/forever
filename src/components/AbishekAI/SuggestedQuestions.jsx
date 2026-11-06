import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  { label: 'Who is Abishek?', query: 'Who is Abishek K.?' },
  { label: 'அபிஷேக் பற்றி', query: 'அபிஷேக் பற்றி சொல்லுங்க' },
  { label: 'Projects enna?', query: 'Abishek projects enna bro?' },
  { label: 'College & Degree', query: 'What is Abishek college and degree?' },
  { label: 'How to navigate?', query: 'How do I continue to the next scene?' },
  { label: 'Passcode enna?', query: 'Website passcode enna?' },
];

const SuggestedQuestions = React.memo(function SuggestedQuestions({ onSelectQuestion }) {
  return (
    <div className="pt-2 pb-1 space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-300/80 px-1">
        <Sparkles className="w-3 h-3 text-amber-300" />
        <span>Suggested Questions / பரிந்துரைகள்:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(item.query)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-purple-900/40 text-purple-200/90 hover:text-white border border-purple-500/25 hover:border-purple-400/50 transition-all duration-150 active:scale-95 text-left cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <HelpCircle className="w-2.5 h-2.5 text-rose-400" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

export default SuggestedQuestions;
