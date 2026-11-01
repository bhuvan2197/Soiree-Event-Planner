import React from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-up max-w-sm">
      <div className="bg-soiree-cream border-2 border-soiree-burgundy text-soiree-burgundyDeep rounded-2xl p-4 shadow-luxury-lg flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-soiree-burgundy text-[#FAF5EC] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-soiree-gold" />
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-soiree-muted hover:text-soiree-burgundy p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
