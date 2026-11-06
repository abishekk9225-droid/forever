import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';

/**
 * Parses basic markdown (bold text, lists, linebreaks) cleanly without heavy external markdown parsers.
 */
function renderFormattedContent(content) {
  if (!content) return null;

  // Split lines
  const lines = content.split('\n');

  return lines.map((line, lineIndex) => {
    // Process **bold** within each line
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formattedLine = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIndex} className="font-semibold text-rose-200">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
    return (
      <span
        key={lineIndex}
        className={`block ${isBullet ? 'pl-2 text-slate-200' : ''} ${lineIndex > 0 ? 'mt-1' : ''}`}
      >
        {formattedLine}
      </span>
    );
  });
}

const ChatMessage = React.memo(function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-start gap-2.5 w-full my-2.5 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } animate-in fade-in slide-in-from-bottom-2 duration-200`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
          isUser
            ? 'bg-gradient-to-br from-rose-500 to-purple-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
            : 'bg-slate-900 border border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4 text-purple-300" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[82%] sm:max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed break-words ${
          isUser
            ? 'bg-gradient-to-r from-purple-600/90 to-rose-600/90 text-white rounded-tr-none shadow-[0_4px_15px_rgba(168,85,247,0.25)] border border-white/10'
            : 'bg-slate-900/90 text-slate-200 rounded-tl-none border border-purple-500/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-white/5 text-[10px] font-mono text-purple-300/80">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>ABISHEK AI</span>
            {message.language && (
              <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-200/90 ml-auto border border-purple-500/20">
                {message.language}
              </span>
            )}
          </div>
        )}

        <div>{renderFormattedContent(message.content)}</div>

        {message.timestamp && (
          <div
            className={`text-[9px] mt-1 opacity-50 ${
              isUser ? 'text-right text-rose-100' : 'text-left text-slate-400'
            }`}
          >
            {message.timestamp}
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatMessage;
