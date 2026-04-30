// src/components/ui/LiveChat.tsx
import { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Bot, User } from 'lucide-react';

const WA_NUMBER = '6288971759690';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

const BOT_RESPONSES: Record<string, string> = {
  default: 'Terima kasih atas pesanmu! Pesan kamu akan diteruskan ke WhatsApp saya. Klik tombol kirim untuk melanjutkan.',
  greeting: 'Hei! Saya RaiJen — Robotics & AI Engineer. Ada yang bisa saya bantu? Konsultasi, 3D printing, atau kolaborasi project?',
  price: 'Untuk detail harga, bisa lihat di halaman Services, atau ceritakan detail project kamu via WhatsApp supaya saya bisa kasih estimasi yang akurat.',
  portfolio: 'Kamu bisa lihat semua project saya di halaman Portfolio. Ada robotics, AI, IoT, dan mechanical design.',
  contact: 'Cara terbaik hubungi saya langsung via WhatsApp. Klik tombol kirim dan pesan akan terbuka di WhatsApp!',
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

  function handleSend() {
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
      status: 'sent',
    };
    setMessages(prev => [...prev, userMsg]);

    // Open WhatsApp with the message
    const waText = encodeURIComponent(`Halo Rangga! Saya dari portfolio website kamu.\n\n${text}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, '_blank');

    // Bot auto-reply
    setTimeout(() => {
      addBotMessage(getBotReply(text));
      setIsSending(false);
    }, 800);
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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-none flex items-center justify-center shadow-lg hover:bg-green-400 transition-all duration-200 group"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
          }}
          aria-label="Chat via WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
              <div className="w-8 h-8 bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#22c55e"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-dark-50">RaiJen</p>
                <p className="text-xs text-dark-400 font-mono flex items-center gap-1.5">
                  <span className="status-online scale-75" />
                  Chat via WhatsApp
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
