import React, { useState, useEffect } from 'react';
import { KeyRound, Sparkles, X, Check, Trash2, Lock } from 'lucide-react';
import Badge from '../common/Badge';
import { getStoredApiKey, setStoredApiKey } from '../../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onApiKeySaved }) {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey() || '');
    }
  }, [isOpen]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = apiKey.trim();
    setStoredApiKey(trimmed);
    setSavedSuccess(true);
    onApiKeySaved(Boolean(trimmed));
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    onApiKeySaved(false);
  };

  const isLive = Boolean(apiKey.trim());

  return (
    <div
      className="fixed inset-0 z-50 bg-soiree-burgundyDeep/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
    >
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 max-w-md w-full shadow-luxury space-y-5">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-soiree-burgundy text-[#FAF5EC] flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5 text-soiree-gold" />
            </div>
            <div>
              <h3 id="api-modal-title" className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                AI Engine Settings
              </h3>
              <p className="text-xs text-soiree-muted">
                Toggle between Live Gemini API & Demo Mode
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close API Key Settings"
            className="p-1 rounded-full text-soiree-muted hover:text-soiree-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
          isLive ? 'bg-emerald-900/10 border-emerald-700/30 text-emerald-950' : 'bg-amber-900/10 border-amber-800/30 text-amber-950'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-600'}`} />
            <span>Current Status: {isLive ? 'AI Live Mode (Gemini 2.5 / 1.5 Flash)' : 'Demo Mode Active'}</span>
          </div>
          <Badge variant={isLive ? 'live' : 'demo'} size="xs">
            {isLive ? 'Live' : 'Demo'}
          </Badge>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="gemini-key-input" className="block text-xs font-semibold text-soiree-muted mb-1.5 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-soiree-rose hover:underline text-[11px] flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Reset to Demo Mode
                </button>
              )}
            </label>
            <input
              id="gemini-key-input"
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
              className="w-full rounded-xl border border-soiree-sand bg-white p-3 text-xs text-soiree-ink outline-none focus:border-soiree-burgundy focus:ring-1 focus:ring-soiree-burgundy font-mono"
            />
            
            {/* Security Notice */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-soiree-sand/40 border border-soiree-sand flex items-start gap-2 text-[11px] text-soiree-muted leading-relaxed">
              <Lock className="w-3.5 h-3.5 text-soiree-burgundy shrink-0 mt-0.5" />
              <span>
                <strong>Client-Side Storage:</strong> Your key is stored strictly in your browser's local session and transmitted only to Google's official Gemini endpoint. No intermediary server receives your key.
              </span>
            </div>

            <p className="text-[11px] text-soiree-muted mt-2 leading-relaxed">
              *If left blank, Soirée runs seamlessly in <strong>Demo Mode</strong> with rich heuristic blueprints and instant response times.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-soiree-sand">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-soiree-muted hover:text-soiree-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep shadow-sm transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-soiree-gold" />}
              <span>{savedSuccess ? 'Saved!' : 'Save & Apply'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
