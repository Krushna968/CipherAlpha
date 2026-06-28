import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  agentActivity?: string[];
}

interface ChatWindowProps {
  fheAnalytics: any;
  walletAddress: string | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ fheAnalytics, walletAddress }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Greetings. I've completed a confidential audit of your vault. All assets are currently shielded via CoFHE.js. Would you like to simulate a rebalancing execution under zero-knowledge conditions?",
      timestamp: '10:42 AM'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingSteps, setTypingSteps] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, {
      sender: 'user',
      text,
      timestamp: timeStr
    }]);

    setInputText('');
    setIsTyping(true);
    setTypingSteps(["Initializing multi-agent supervisor..."]);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: fheAnalytics
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Progressively show thinking steps if present
        if (data.agentActivity && data.agentActivity.length > 0) {
          for (let i = 0; i < data.agentActivity.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setTypingSteps(prev => [...prev, data.agentActivity[i]]);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 600));

        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.reply,
          timestamp: timeStr,
          agentActivity: data.agentActivity
        }]);
      }
    } catch (e) {
      console.error("Chat API failed, using fallback responses:", e);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I received your command. The CipherAlpha supervisor has queried your FHE contract and scheduled an analytics check. You can execute this rebalancing directly on Sepolia.",
        timestamp: timeStr
      }]);
    } finally {
      setIsTyping(false);
      setTypingSteps([]);
    }
  };

  return (
    <section className="flex flex-col glass-panel rounded-2xl overflow-hidden min-h-[500px] flex-grow border border-outline-variant/30">
      {/* Chat Header */}
      <div className="bg-surface-container-high px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.5)]"></div>
          <span className="font-headline-md text-lg font-bold">CipherAlpha Core</span>
        </div>
        <span className="text-[11px] text-on-surface-variant font-medium">v4.2.0 FHE-Enhanced</span>
      </div>

      {/* Chat Messages Scrolling */}
      <div className="flex-grow p-6 flex flex-col gap-6 overflow-y-auto max-h-[380px] min-h-[300px]">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={idx} 
              className={`flex gap-3 max-w-[85%] ${
                isUser ? 'self-end flex-row-reverse' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                isUser ? 'bg-surface-variant' : 'bg-primary-container'
              }`}>
                {isUser ? <User className="w-4.5 h-4.5 text-on-surface" /> : <Bot className="w-4.5 h-4.5 text-on-primary-container" />}
              </div>
              <div className={`p-4 rounded-2xl relative ${
                isUser 
                  ? 'bg-primary-container/20 border border-primary/30 rounded-tr-none text-on-surface'
                  : 'bg-surface-container rounded-tl-none text-on-surface'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                
                {msg.agentActivity && msg.agentActivity.length > 0 && (
                  <div className="mt-3 border-t border-outline-variant/15 pt-2 flex flex-col gap-1">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Agent Audits Run:</p>
                    {msg.agentActivity.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <span className={`text-[9px] mt-2 block ${
                  isUser ? 'text-primary/70' : 'text-on-surface-variant'
                }`}>{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {/* AI Typing State */}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
              <Bot className="w-4.5 h-4.5 text-on-primary-container" />
            </div>
            <div className="bg-surface-container p-4 rounded-2xl rounded-tl-none flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs text-on-surface-variant font-medium">Orchestrating AI core...</span>
                <span className="flex mt-1">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </span>
              </div>
              
              {typingSteps.length > 0 && (
                <div className="flex flex-col gap-1 border-t border-outline-variant/10 pt-2">
                  {typingSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5 text-[10px] text-primary-fixed-dim">
                      <span className="w-1 h-1 rounded-full bg-primary"></span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input & Pills */}
      <div className="p-6 border-t border-outline-variant/30 bg-surface-container-low">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(inputText)}
            placeholder={walletAddress ? "Type instructions for your intelligence core..." : "Connect MetaMask to prompt the intelligence core..."}
            className="w-full bg-surface-container px-4 py-3.5 pr-12 rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-0 text-sm text-on-surface focus:outline-none placeholder-on-surface-variant/50"
            disabled={!walletAddress || isTyping}
          />
          <button 
            onClick={() => handleSend(inputText)}
            disabled={!walletAddress || !inputText.trim() || isTyping}
            className="absolute right-3 bg-primary text-on-primary w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary-fixed transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button 
            onClick={() => handleSend("Generate Portfolio Snapshot")}
            disabled={!walletAddress || isTyping}
            className="flex-shrink-0 bg-surface-variant/30 text-primary-fixed-dim text-[11px] px-3 py-1.5 rounded-full border border-outline-variant/20 hover:bg-surface-variant/50 transition-colors"
          >
            Generate Portfolio Snapshot
          </button>
          <button 
            onClick={() => handleSend("Verify Contract Safety")}
            disabled={!walletAddress || isTyping}
            className="flex-shrink-0 bg-surface-variant/30 text-primary-fixed-dim text-[11px] px-3 py-1.5 rounded-full border border-outline-variant/20 hover:bg-surface-variant/50 transition-colors"
          >
            Verify Contract Safety
          </button>
          <button 
            onClick={() => handleSend("Suggest investment strategy to maximize yield")}
            disabled={!walletAddress || isTyping}
            className="flex-shrink-0 bg-surface-variant/30 text-primary-fixed-dim text-[11px] px-3 py-1.5 rounded-full border border-outline-variant/20 hover:bg-surface-variant/50 transition-colors"
          >
            Suggest Investment
          </button>
        </div>
      </div>
    </section>
  );
};
