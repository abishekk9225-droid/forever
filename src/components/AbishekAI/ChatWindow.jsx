import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Trash2,
  Sparkles,
  Loader2,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import SuggestedQuestions from './SuggestedQuestions';
import { sendChatMessage } from '../../services/aiService';

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I am **ABISHEK AI**, your personal AI assistant and guide for this Forever journey.\n\nI can answer questions about Abishek's background, education at VSB Engineering College, his AI projects (like Nirbhaya AI and LeadTrack AI), or guide you through any scene on this website.\n\nYou can ask me in **English**, **தமிழ்**, or **Tanglish**! ✨",
  timestamp: 'Just now',
};

const ChatWindow = React.memo(function ChatWindow({ isOpen, onClose, currentScene }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('abishek_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading, scrollToBottom]);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('abishek_ai_chat_history', JSON.stringify(messages));
    } catch {
      // Ignore storage quota
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleClearChat = useCallback(() => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    try {
      localStorage.removeItem('abishek_ai_chat_history');
    } catch {
      // Ignore
    }
  }, []);

  const handleSendMessage = useCallback(
    async (textToSend) => {
      const query = (textToSend || input).trim();
      if (!query || isLoading) return;

      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedHistory = [...messages, userMsg];
      setMessages(updatedHistory);
      setInput('');
      setIsLoading(true);

      try {
        // Send to backend with conversation turns & active scene context
        const historyForApi = updatedHistory
          .filter((m) => m.id !== 'welcome')
          .slice(-8)
          .map((m) => ({ role: m.role, content: m.content }));

        const result = await sendChatMessage({
          message: query,
          conversationHistory: historyForApi,
          currentScene,
        });

        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: result.reply,
          language: result.language,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error('[ABISHEK AI] Error handling response:', err);
        const errorMsg = {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: 'I had trouble connecting for a moment. Please feel free to ask again! 🙏',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, currentScene]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.94 }}
      transition={{ type: 'spring', damping: 25, stiffness: 320 }}
      className="abishek-ai-glass fixed bottom-20 left-4 sm:left-6 z-[9995] w-[90vw] sm:w-[380px] md:w-[410px] h-[520px] max-h-[78vh] rounded-3xl border border-purple-500/35 flex flex-col overflow-hidden text-white select-text"
      style={{
        boxShadow:
          '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(168, 85, 247, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
      }}
    >
      {/* 1. Header Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-purple-500/20 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 via-rose-600 to-amber-500 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.5)]">
              <Bot className="w-4 h-4 text-white" />
            </div>
            {/* Online Green Indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_6px_#34d399]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-purple-200 to-amber-200">
                ABISHEK AI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                v1.0
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Personal Assistant · Online</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-white/5 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages Scroll Area */}
      <div className="abishek-ai-scrollbar flex-1 p-3.5 overflow-y-auto space-y-1">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing Animation */}
        {isLoading && (
          <div className="flex items-center gap-2 text-purple-300 text-xs py-2 px-1">
            <div className="w-6 h-6 rounded-full bg-slate-900 border border-purple-500/40 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-purple-300" />
            </div>
            <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-slate-900/80 border border-purple-500/20 rounded-tl-none">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 typing-dot-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 typing-dot-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 typing-dot-3" />
              <span className="text-[11px] font-mono text-purple-200/70 ml-1.5">Thinking...</span>
            </div>
          </div>
        )}

        {/* Suggested Questions if chat history is brief */}
        {messages.length <= 3 && !isLoading && (
          <SuggestedQuestions onSelectQuestion={handleSendMessage} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Footer */}
      <form
        onSubmit={handleSubmit}
        className="p-2.5 bg-slate-950/90 border-t border-purple-500/20 backdrop-blur-xl shrink-0"
      >
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask in English, தமிழ், or Tanglish..."
            disabled={isLoading}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-white placeholder-slate-400 text-xs sm:text-[13px] focus:outline-none focus:border-rose-400/70 focus:ring-1 focus:ring-rose-400/50 transition-all shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 p-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white hover:from-purple-500 hover:to-rose-500 disabled:opacity-30 disabled:hover:from-purple-600 disabled:hover:to-rose-600 transition-all duration-150 active:scale-95 cursor-pointer shadow-md"
            title="Send Message"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center justify-between px-1 pt-1.5 text-[9px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
            <span>Grounded Knowledge Base</span>
          </span>
          <span>English · தமிழ் · Tanglish</span>
        </div>
      </form>
    </motion.div>
  );
});

export default ChatWindow;

