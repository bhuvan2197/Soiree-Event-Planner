import React from 'react';
import { Sparkles, X } from 'lucide-react';

/**
 * Accessible toast notification.
 * Uses role="status" + aria-live="polite" so screen readers announce
 * updates without interrupting the current reading flow.
 */
export default function Toast({ message, onClose }) {
  return (
    /* Live region is always rendered so screen readers register it early.
       When message is empty the region is invisible but remains in the DOM. */
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-none"
    >
      {message && (
        <div className="animate-fade-up bg-soiree-cream border-2 border-soiree-burgundy text-soiree-burgundyDeep rounded-2xl p-4 shadow-luxury-lg flex items-start gap-3 pointer-events-auto">
          <div className="w-6 h-6 rounded-full bg-soiree-burgundy text-[#FAF5EC] flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
            <Sparkles className="w-3.5 h-3.5 text-soiree-gold" />
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
            {message}
          </p>
          <button
            onClick={onClose}
            aria-label="Dismiss notification"
            className="text-soiree-muted hover:text-soiree-burgundy p-0.5 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
