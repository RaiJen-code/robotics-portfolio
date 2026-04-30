// src/components/ui/LiveChat.tsx
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react';
import { sendChatMessage, getOrCreateSessionId } from '../../lib/n8n';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

const BOT_RESPONSES: Record<string, string> = {
  default: 'Terima kasih atas pesanmu! Saya akan balas secepatnya. Untuk urusan mendesak, hubungi via Telegram @RaiJenDev.',
  greeting: 'Hei! 👋 Saya RaiJen — Robotics & AI Engineer. Ada yang bisa saya bantu? Konsultasi, 3D printing, atau kolaborasi project?',
  price: 'Untuk detail harga, bisa lihat di halaman Services, atau kirim detail project kamu supaya saya bisa kasih estimasi yang akurat.',
  portfolio: 'Kamu bisa lihat semua project saya di halaman Portfolio. Ada robotics, AI, IoT, dan mechanical design.',
  contact: 'Cara terbaik hubungi saya: email hello@raijen.dev, atau Telegram @RaiJenDev. Saya biasanya reply dalam 1-2 jam.',
};

function getBotReply(message: string): string {
  const lower = message.toLowerCase();
  if (/hei|halo|hi|hello|hay/.test(lower)) return BOT_RESPONSES.greeting;
  if (/harga|price|biaya|cost|tarif|rate/.test(lower)) return BOT_RESPONSES.price;
  if (/portfolio|project|karya|work/.test(lower)) return BOT_RESPONSES.portfolio;
  if (/kontak|contact|hubungi|reach|email|wa|whatsapp/.test(lower)) return BOT_RESPONSES.contact;
  return BOT_RESPONSES.default;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for global open event (from Hero CTA button)
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('openChat', handleOpen);
    return () => window.removeEventListener('openChat', handleOpen);
  }, []);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(BOT_RESPONSES.greeting);
      }, 500);
    }
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  function addBotMessage(text: string) {
    const msg: Message = {
      id: Date.now().toString() + '_bot',
      role: 'bot',
      text,
      timestamp: new Date(),
      status: 'sent',
    };
    setMessages(prev => [...prev, msg]);
    if (!isOpen || isMinimized) setHasNewMessage(true);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;

    setInput('');
    setIsSending(true);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString() + '_user',
      role: 'user',
      text,
      timestamp: new Date(),
      status: 'sending',
    };
    setMessages(prev => [...prev, userMsg]);

    // Send to n8n
    const result = await sendChatMessage(text);

    // Update message status
    setMessages(prev =>
      prev.map(m => m.id === userMsg.id
        ? { ...m, status: result.success ? 'sent' : 'error' }
        : m
      )
    );

    // Bot auto-reply
    setTimeout(() => {
      addBotMessage(getBotReply(text));
    }, 800);

    setIsSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleOpen() {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 text-dark-900 rounded-none flex items-center justify-center shadow-lg hover:bg-primary-400 transition-all duration-200 group"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            boxShadow: '0 0 20px rgba(0, 240, 230, 0.4)',
          }}
          aria-label="Open chat"
        >
          <MessageCircle size={22} />
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              !
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-dark-800 border border-dark-600 shadow-2xl transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[500px]'
          }`}
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
            boxShadow: '0 0 40px rgba(0, 240, 230, 0.15)',
          }}
        >
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 bg-dark-700 border-b border-dark-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/40 flex items-center justify-center">
                <Bot size={14} className="text-primary-500" />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-dark-50">RaiJen</p>
                <p className="text-xs text-dark-400 font-mono flex items-center gap-1.5">
                  <span className="status-online scale-75" />
                  Online · Replies biasanya &lt; 1 jam
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-dark-400 hover:text-dark-100 transition-colors p-1"
              >
                <Minimize2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dark-400 hover:text-dark-100 transition-colors p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 h-[calc(500px-112px)] overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                  >
                    {msg.role === 'bot' && (
                      <div className="w-6 h-6 bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0 mb-1">
                        <Bot size={10} className="text-primary-500" />
                      </div>
                    )}
                    <div>
                      <div className={msg.role === 'bot' ? 'chat-bubble-in' : 'chat-bubble-out'}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className="text-xs text-dark-500 mt-1 font-mono px-1">
                        {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        {msg.role === 'user' && msg.status === 'error' && (
                          <span className="text-red-500 ml-1">• Gagal terkirim</span>
                        )}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-6 h-6 bg-dark-600 flex items-center justify-center flex-shrink-0 mb-1">
                        <User size={10} className="text-dark-300" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="h-14 flex items-center gap-2 px-3 border-t border-dark-700">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tulis pesan..."
                  maxLength={500}
                  disabled={isSending}
                  className="flex-1 bg-dark-700 border border-dark-600 px-3 py-2 text-sm font-body text-dark-100 placeholder:text-dark-400 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  className="w-9 h-9 bg-primary-500 text-dark-900 flex items-center justify-center hover:bg-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
