import React, { useState, useEffect } from 'react';
import { Sparkles, Printer, Share2, Plus, ChevronDown, KeyRound, Check } from 'lucide-react';
import WaxSeal from '../common/WaxSeal';
import Badge from '../common/Badge';

export default function Navbar({
  currentEvent,
  eventsList,
  onSelectEvent,
  onNewEvent,
  onOpenPrint,
  onOpenApiKey,
  isLive,
  onShowToast
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close dropdown on ESC
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dropdownOpen]);

  const handleShare = () => {
    if (!currentEvent) return;
    const shareText = `🍾 ${currentEvent.title}\n📅 Date: ${currentEvent.date} | 📍 ${currentEvent.city}\n👥 ${currentEvent.guestCount} Guests | 💰 Budget: ${currentEvent.currencySymbol}${currentEvent.totalBudget.toLocaleString()}\nPlanned seamlessly with Soirée.`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      onShowToast("Event summary copied to clipboard! Ready to share via WhatsApp or Email.");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-soiree-cream/95 backdrop-blur-md border-b border-soiree-sand shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onSelectEvent(null)}>
            <WaxSeal size={42} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-soiree-burgundyDeep">
                  Soirée
                </span>
                <span className="hidden sm:inline-block text-[11px] font-sans tracking-widest uppercase px-2 py-0.5 rounded border border-soiree-sand text-soiree-muted bg-soiree-bg/60">
                  Atelier
                </span>
              </div>
              <p className="text-[11px] font-serif italic text-soiree-muted tracking-wide -mt-0.5 hidden xs:block">
                GenAI Celebration Architect
              </p>
            </div>
          </div>

          {/* Center: Event Selector (if event active) */}
          {currentEvent && (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="Switch celebration blueprint"
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-soiree-sand bg-soiree-bg/70 hover:bg-soiree-bg text-soiree-ink transition-all text-sm font-medium shadow-inner-soft"
              >
                <span className="w-2 h-2 rounded-full bg-soiree-burgundy animate-pulse" />
                <span className="max-w-[200px] truncate font-serif text-soiree-burgundyDeep font-semibold">
                  {currentEvent.title}
                </span>
                <ChevronDown className="w-4 h-4 text-soiree-muted" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-soiree-cream border border-soiree-sand shadow-luxury-lg z-20 py-2 animate-fade-up">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-soiree-muted uppercase tracking-wider border-b border-soiree-sand/60">
                      Switch Celebration
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {eventsList.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => {
                            onSelectEvent(ev.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-soiree-sand/40 transition-colors ${
                            ev.id === currentEvent.id ? 'bg-soiree-sand/30 font-semibold text-soiree-burgundy' : 'text-soiree-ink'
                          }`}
                        >
                          <span className="truncate">{ev.title}</span>
                          <span className="text-xs text-soiree-muted shrink-0 ml-2">{ev.eventType}</span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-soiree-sand/60 pt-1.5 mt-1 px-2">
                      <button
                        onClick={() => {
                          onNewEvent();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-soiree-burgundy hover:bg-soiree-burgundy/10 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Plan New Celebration
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Status Badge (Click to configure key) */}
            <button
              type="button"
              onClick={onOpenApiKey}
              title="Click to manage Gemini API Key or Demo Mode"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all shadow-sm border hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isLive ? '#064E3B' : '#FAF5EC',
                color: isLive ? '#ECFDF5' : '#4A0F1C',
                borderColor: isLive ? '#047857' : '#E3D5BF',
              }}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-600'}`} />
              <span className="font-semibold">{isLive ? 'AI Live' : 'Demo Mode'}</span>
              <KeyRound className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {/* Print Blueprint Button */}
            {currentEvent && (
              <button
                type="button"
                onClick={onOpenPrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-soiree-sand bg-soiree-cream hover:bg-soiree-sandLight text-soiree-burgundyDeep text-xs font-medium transition-all shadow-sm hover:border-soiree-burgundy/40"
              >
                <Printer className="w-3.5 h-3.5 text-soiree-burgundy" />
                <span>Blueprint</span>
              </button>
            )}

            {/* Share Button */}
            {currentEvent && (
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-soiree-sand bg-soiree-cream hover:bg-soiree-sandLight text-soiree-burgundyDeep text-xs font-medium transition-all shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-soiree-muted" />}
                <span className="hidden xs:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>
            )}

            {/* New Event Button */}
            <button
              type="button"
              onClick={onNewEvent}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs font-medium shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Plan</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
