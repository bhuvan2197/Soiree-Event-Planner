import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Wand2
} from 'lucide-react';
import WaxSeal from '../common/WaxSeal';
import Badge from '../common/Badge';

export default function CoPlannerDrawer({
  isOpen,
  onClose,
  event,
  onChatUpdatePlan,
  isProcessingChat
}) {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello! I am your Soirée Co-Planner. I have full context of ${event.title} (${event.guestCount} guests, ${event.currencySymbol}${event.totalBudget.toLocaleString()} budget). How would you like to refine the celebration?`,
      changesSummary: null
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "✂️ Cut the budget by 15%",
    "🌿 Make it more eco-friendly",
    "👥 Add 20% more guests",
    "🕯️ Add a late-night candlelit afterparty",
    "💌 Suggest wording for WhatsApp invites"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isProcessingChat) return;

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      changesSummary: null
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Trigger AI plan mutation
    const result = await onChatUpdatePlan(text.trim());

    if (result) {
      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: result.replyText,
        changesSummary: result.changesSummary
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-soiree-burgundyDeep/30 backdrop-blur-xs flex justify-end animate-fade-up">
      <div className="w-full max-w-lg bg-soiree-cream h-full border-l border-soiree-sand shadow-luxury flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 border-b border-soiree-sand flex items-center justify-between bg-soiree-cream/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <WaxSeal size={34} />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                  AI Co-Planner
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-soiree-muted truncate max-w-[240px]">
                Active Blueprint: {event.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-soiree-sand/60 text-soiree-muted hover:text-soiree-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-soiree-burgundy text-[#FAF5EC] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-soiree-gold" />
                </div>
              )}

              <div className="space-y-2 max-w-[85%]">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-soiree-burgundy text-[#FAF5EC] rounded-tr-xs'
                      : 'bg-soiree-bg border border-soiree-sand text-soiree-ink rounded-tl-xs shadow-inner-soft'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Live Plan Mutation Card if changes applied */}
                {msg.changesSummary && (
                  <div className="bg-emerald-900/10 border border-emerald-700/30 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-2 animate-fade-up">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider text-emerald-900">
                        Plan Updated In-Place
                      </strong>
                      <span>{msg.changesSummary}</span>
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-soiree-sand text-soiree-burgundyDeep flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isProcessingChat && (
            <div className="flex gap-3 items-center text-xs text-soiree-muted italic pl-11">
              <div className="w-4 h-4 border-2 border-soiree-burgundy border-t-transparent rounded-full animate-spin" />
              <span>Co-Planner is analyzing and adapting your celebration...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 border-t border-soiree-sand/60 bg-soiree-bg/50">
          <span className="text-[10px] uppercase font-semibold text-soiree-muted tracking-wider block mb-1.5">
            Suggested Refinements:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={isProcessingChat}
                className="text-[11px] px-2.5 py-1 rounded-full bg-soiree-cream border border-soiree-sand hover:border-soiree-burgundy text-soiree-burgundy font-medium whitespace-nowrap transition-colors shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-4 border-t border-soiree-sand bg-soiree-cream">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="e.g. Cut 15% from decor, or add eco-friendly gifts..."
              disabled={isProcessingChat}
              className="flex-1 rounded-xl border border-soiree-sand bg-white p-3 text-xs sm:text-sm text-soiree-ink outline-none focus:border-soiree-burgundy focus:ring-1 focus:ring-soiree-burgundy transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isProcessingChat}
              className="p-3 rounded-xl bg-soiree-burgundy text-[#FAF5EC] hover:bg-soiree-burgundyDeep disabled:opacity-50 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
