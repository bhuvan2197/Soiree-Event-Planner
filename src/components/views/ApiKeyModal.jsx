import React, { useState } from 'react';
import { KeyRound, Sparkles, X, Check, AlertCircle, Trash2, Shield } from 'lucide-react';
import Badge from '../common/Badge';
import { getStoredApiKey, setStoredApiKey } from '../../services/geminiService';

export default function ApiKeyModal({ isOpen, onClose, onApiKeySaved }) {
  const [apiKey, setApiKey] = useState(getStoredApiKey() || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(apiKey.trim());
    setSavedSuccess(true);
    onApiKeySaved(Boolean(apiKey.trim()));
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    onApiKeySaved(false);
  };

  const isLive = Boolean(apiKey.trim());

  return (
    <div className="fixed inset-0 z-50 bg-soiree-burgundyDeep/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-up">
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 max-w-md w-full shadow-luxury space-y-5">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-soiree-burgundy text-[#FAF5EC] flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5 text-soiree-gold" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                AI Engine Settings
              </h3>
              <p className="text-xs text-soiree-muted">
                Toggle between Live Gemini API & Demo Mode
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-soiree-muted hover:text-soiree-ink"
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
            <label className="block text-xs font-semibold text-soiree-muted mb-1.5 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-soiree-rose hover:underline text-[11px] flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Reset to Demo Mode
                </button>
              )}
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-xl border border-soiree-sand bg-white p-3 text-xs text-soiree-ink outline-none focus:border-soiree-burgundy focus:ring-1 focus:ring-soiree-burgundy font-mono"
            />
            <p className="text-[11px] text-soiree-muted mt-1.5 leading-relaxed">
              *If left blank, Soirée runs seamlessly in <strong>Demo Mode</strong> with rich, realistic pre-packaged celebrations and zero network errors during judging.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-soiree-sand">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-soiree-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep shadow-sm"
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
