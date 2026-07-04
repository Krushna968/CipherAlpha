import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Cpu, Loader2, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  agentActivity?: string[];
}

interface ChatWindowProps {
  fheAnalytics: any;
  walletAddress: string | null;
}

const TOKENS = ['ETH', 'WBTC', 'USDT', 'LINK', 'BTC', 'USD', 'APY', 'FHE', 'TVL'];

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const segments: React.ReactNode[] = [];
  let key = 0;

  const regex = new RegExp(`(\\*\\*.*?\\*\\*|\`.*?\`|\\b(?:${TOKENS.join('|')})\\b)`, 'g');
  const parts = text.split(regex);

  parts.forEach(part => {
    if (!part) return;
    if (part.startsWith('**') && part.endsWith('**')) {
      segments.push(<strong key={key++} className="text-secondary font-bold font-mono">{part.slice(2, -2)}</strong>);
    } else if (part.startsWith('`') && part.endsWith('`')) {
      segments.push(
        <code key={key++} className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-[11px] text-tertiary">
          {part.slice(1, -1)}
        </code>
      );
    } else if (TOKENS.includes(part)) {
      segments.push(<span key={key++} className="font-bold text-tertiary font-mono">{part}</span>);
    } else {
      part.split('\n').forEach((line, i, arr) => {
        segments.push(<span key={key++}>{line}</span>);
        if (i < arr.length - 1) segments.push(<br key={key++} />);
      });
    }
  });

  return <>{segments}</>;
};

const QUICK_PROMPTS = [
  { label: 'STATUS', msg: 'Generate a full portfolio snapshot and balance summary' },
  { label: 'RISK', msg: 'What is my current risk profile and what are the drawdown concerns?' },
  { label: 'YIELD', msg: 'Suggest an investment strategy to maximize yield and APY' },
  { label: 'AUDIT', msg: 'Verify smart contract safety and check for exploit risks' },
];

export const ChatWindow: React.FC<ChatWindowProps> = ({ fheAnalytics }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      sender: 'ai',
      text: "SYSTEM_ONLINE\n\nI am CipherAlpha Core. Running on Fhenix Helium L2. All data is encrypted via CoFHE.js.\n\nAwaiting homomorphic parameters or natural language queries...",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingSteps, setTypingSteps] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const userId = `u-${Date.now()}`;

    setMessages(prev => [...prev, { id: userId, sender: 'user', text, timestamp: timeStr }]);
    setInputText('');
    setIsTyping(true);
    setTypingSteps(['[INIT] Supervisor Node...']);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: fheAnalytics }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.agentActivity?.length > 0) {
          for (const step of data.agentActivity) {
            await new Promise(r => setTimeout(r, 600));
            setTypingSteps(prev => [...prev, `> ${step}`]);
          }
        }
        await new Promise(r => setTimeout(r, 400));
        setMessages(prev => [
          ...prev,
          { id: `ai-${Date.now()}`, sender: 'ai', text: data.reply, timestamp: timeStr, agentActivity: data.agentActivity },
        ]);
      } else {
        throw new Error('API error');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { id: `ai-err-${Date.now()}`, sender: 'ai', text: 'Error connecting to CipherAlpha LLM.', timestamp: timeStr },
      ]);
    } finally {
      setIsTyping(false);
      setTypingSteps([]);
    }
  }, [isTyping, fheAnalytics]);

  return (
    <div className="flex flex-col h-full bg-transparent w-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-secondary animate-ping opacity-50" />
          </div>
          <span className="font-mono text-lg font-bold text-on-surface tracking-widest">CIPHER_CORE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-tertiary font-mono bg-tertiary/10 px-2 py-1 rounded border border-tertiary/30">
            FHE_ACTIVE
          </span>
          <button onClick={() => setMessages([messages[0]])} className="text-on-surface-variant hover:text-error transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-grow p-5 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 ${isUser ? 'self-end flex-row-reverse max-w-[85%]' : 'max-w-[90%]'}`}
              >
                <div className={`w-8 h-8 rounded border flex items-center justify-center flex-shrink-0 ${
                  isUser ? 'bg-surface-variant border-outline-variant' : 'bg-secondary/10 border-secondary/50 glow-secondary'
                }`}>
                  {isUser ? <Terminal className="w-4 h-4 text-on-surface" /> : <Cpu className="w-4 h-4 text-secondary" />}
                </div>

                <div className={`p-4 rounded-xl backdrop-blur-md border ${
                  isUser
                    ? 'bg-surface-variant/40 border-outline-variant/30 text-on-surface'
                    : 'bg-surface/60 border-secondary/20 text-on-surface'
                }`}>
                  <p className={`text-sm leading-relaxed ${!isUser && 'glitch-text'} font-sans`}>
                    <FormattedText text={msg.text} />
                  </p>
                  
                  {msg.agentActivity && msg.agentActivity.length > 0 && (
                    <div className="mt-4 border-t border-outline-variant/20 pt-3 flex flex-col gap-2 bg-black/20 p-2 rounded">
                      <p className="text-[10px] text-secondary font-mono tracking-widest">&gt;&gt; TRACE_LOG:</p>
                      {msg.agentActivity.map((step, i) => (
                        <div key={i} className="text-[10px] text-on-surface-variant font-mono pl-2 border-l-2 border-tertiary">
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                  <span className={`text-[9px] font-mono mt-2 block ${isUser ? 'text-on-surface-variant' : 'text-secondary/60'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[90%]">
            <div className="w-8 h-8 rounded border bg-secondary/10 border-secondary/50 glow-secondary flex items-center justify-center flex-shrink-0">
              <Cpu className="w-4 h-4 text-secondary animate-pulse" />
            </div>
            <div className="bg-surface/60 p-4 rounded-xl border border-secondary/20 flex flex-col gap-2 min-w-[200px]">
               <div className="flex items-center gap-2 text-secondary font-mono text-[10px]">
                 <Loader2 className="w-3 h-3 animate-spin" /> EXECUTING...
               </div>
               {typingSteps.length > 0 && (
                 <div className="flex flex-col gap-1 mt-2">
                   {typingSteps.map((step, i) => (
                     <div key={i} className="text-[10px] text-tertiary font-mono">
                       {step}
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </motion.div>
        )}

      </div>

      {/* Input area */}
      <div className="p-4 border-t border-outline-variant/30 bg-surface/80 backdrop-blur-xl">
        <div className="flex gap-2 mb-3">
          {QUICK_PROMPTS.map(qp => (
            <button
              key={qp.label}
              onClick={() => handleSend(qp.msg)}
              disabled={isTyping}
              className="bg-surface-variant/50 text-secondary hover:text-background hover:bg-secondary border border-secondary/30 text-[10px] font-mono px-3 py-1 rounded transition-colors disabled:opacity-40"
            >
              [{qp.label}]
            </button>
          ))}
        </div>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-secondary font-mono text-sm">&gt;</span>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(inputText)}
            placeholder="Enter command..."
            className="w-full bg-black/40 px-8 py-3 rounded border border-outline-variant/30 focus:border-secondary text-sm text-on-surface font-mono focus:outline-none placeholder-on-surface-variant/40"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 bg-secondary/10 text-secondary w-8 h-8 rounded border border-secondary/30 flex items-center justify-center hover:bg-secondary hover:text-background transition-all disabled:opacity-40"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
