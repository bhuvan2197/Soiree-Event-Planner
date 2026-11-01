import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  X,
  FileText,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import WaxSeal from '../common/WaxSeal';
import Badge from '../common/Badge';

export default function PrintBlueprintModal({ event, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownSummary = () => {
    const categoriesText = event.budget?.categories
      ?.map(c => `- ${c.name}: ${event.currencySymbol}${c.planned.toLocaleString()} (Spent: ${event.currencySymbol}${c.actual.toLocaleString()})`)
      .join('\n');

    const timelineText = event.timeline
      ?.map(t => `- [${t.completed ? 'x' : ' '}] ${t.dueDate} (${t.priority}): ${t.title} [Owner: ${t.owner}]`)
      .join('\n');

    const runOfShowText = event.runOfShow
      ?.map(r => `- ${r.time} @ ${r.location} | ${r.title} (Lead: ${r.leadPerson})`)
      .join('\n');

    return `# ${event.title} — Soirée Event Blueprint
*${event.tagline || ''}*

**Occasion:** ${event.eventType}
**Date:** ${event.date}
**City:** ${event.city}
**Guests:** ${event.guestCount}
**Total Budget:** ${event.currencySymbol}${event.totalBudget.toLocaleString()}
**Aesthetic / Vibe:** ${(event.vibe || []).join(', ')}
**Dietary:** ${event.dietary}

---

## 1. Budget Allocations
${categoriesText}

---

## 2. Backward Planning Timeline
${timelineText}

---

## 3. Event Day Run-of-Show
${runOfShowText}

---
*Synthesized with Soirée — GenAI Celebration Atelier*
`;
  };

  const handleCopySummary = () => {
    const text = generateMarkdownSummary();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-soiree-burgundyDeep/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-up">
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand max-w-4xl w-full max-h-[92vh] flex flex-col shadow-luxury-lg overflow-hidden">
        
        {/* Top bar controls */}
        <div className="p-4 sm:p-6 border-b border-soiree-sand flex items-center justify-between bg-soiree-cream/95 backdrop-blur-sm no-print">
          <div className="flex items-center gap-3">
            <WaxSeal size={36} />
            <div>
              <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                Event Blueprint Dossier
              </h3>
              <p className="text-xs text-soiree-muted">
                Official presentation document ready for print, PDF export, or team sharing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-soiree-sand bg-soiree-bg hover:bg-soiree-sand text-xs font-semibold text-soiree-burgundy transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs font-semibold shadow-sm transition-all hover:scale-105"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-soiree-sand/60 text-soiree-muted hover:text-soiree-ink transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Content Sheet (Styled for Screen & Print) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 print:p-0 print:space-y-6 bg-white text-soiree-ink">
          
          {/* Header Cover Banner */}
          <div className="border-b-2 border-soiree-burgundy pb-6 text-center space-y-3">
            <div className="flex justify-center mb-2">
              <WaxSeal size={48} />
            </div>
            <span className="text-[11px] font-sans uppercase tracking-widest text-soiree-muted font-bold block">
              Official Celebration Dossier
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-soiree-burgundyDeep">
              {event.title}
            </h1>
            <p className="font-serif italic text-sm text-soiree-muted max-w-xl mx-auto">
              "{event.tagline}"
            </p>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-soiree-ink pt-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-soiree-burgundy" /> {event.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-soiree-burgundy" /> {event.city}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-soiree-burgundy" /> {event.guestCount} Guests
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-soiree-burgundy" /> Budget: {event.currencySymbol}{event.totalBudget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Section 1: Executive Budget Allocation */}
          <div className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-soiree-burgundyDeep border-b border-soiree-sand pb-1 flex items-center gap-2">
              <span>I. Executive Budget Allocation</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {event.budget?.categories?.map((cat) => (
                <div key={cat.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-stone-900">{cat.name}</span>
                    <span className="block text-[11px] text-stone-500">{cat.notes}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-stone-900">
                      {event.currencySymbol}{cat.planned.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-stone-500">
                      Spent: {event.currencySymbol}{cat.actual.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Phased Backward Timeline */}
          <div className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-soiree-burgundyDeep border-b border-soiree-sand pb-1">
              II. Phased Milestones & Key Gates
            </h2>
            <div className="space-y-2 text-xs">
              {event.timeline?.map((t) => (
                <div key={t.id} className="p-2 rounded-lg border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[10px] ${
                      t.completed ? 'bg-stone-800 text-white' : 'border-stone-400'
                    }`}>
                      {t.completed ? '✓' : ''}
                    </span>
                    <span className={t.completed ? 'line-through text-stone-500' : 'font-medium text-stone-900'}>
                      {t.title}
                    </span>
                  </div>
                  <div className="text-stone-500 text-[11px] flex items-center gap-2">
                    <span>{t.phase}</span>
                    <span>•</span>
                    <span>Due: {t.dueDate}</span>
                    <span>•</span>
                    <span className="font-semibold">{t.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Event Day Run-of-Show */}
          <div className="space-y-3 page-break">
            <h2 className="font-serif text-lg font-bold text-soiree-burgundyDeep border-b border-soiree-sand pb-1">
              III. Event Day Master Run-of-Show
            </h2>
            <div className="space-y-2 text-xs">
              {event.runOfShow?.map((ros) => (
                <div key={ros.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/70 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-serif text-soiree-burgundy">{ros.time}</strong>
                      <span className="font-semibold text-stone-900">{ros.title}</span>
                    </div>
                    <p className="text-stone-600 mt-0.5">{ros.notes}</p>
                  </div>
                  <div className="text-right text-[11px] text-stone-500 shrink-0">
                    <span className="block font-medium text-stone-800">📍 {ros.location}</span>
                    <span>Lead: {ros.leadPerson}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Confirmed Vendors & Risk Playbook */}
          <div className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-soiree-burgundyDeep border-b border-soiree-sand pb-1">
              IV. Confirmed Vendors & Key Contacts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {event.vendors?.map((cat) => (
                <div key={cat.id} className="p-2.5 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-serif">{cat.category}</strong>
                  <span className="text-[11px] text-stone-500 block mb-1">Guide: {cat.whatToLookFor}</span>
                  {cat.vendors && cat.vendors.length > 0 ? (
                    <div className="space-y-1 mt-1">
                      {cat.vendors.map(v => (
                        <div key={v.id} className="flex justify-between items-center text-[11px] bg-stone-100 p-1.5 rounded">
                          <span>{v.name} ({v.status})</span>
                          <span className="font-semibold">{v.contact}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] italic text-stone-400">No vendor locked yet</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dossier Footer */}
          <div className="pt-6 border-t border-stone-300 text-center text-xs text-stone-500 space-y-1">
            <p className="font-serif italic text-stone-700">
              Generated by Soirée Atelier — Designed with bespoke care and intelligence.
            </p>
            <p className="text-[10px]">
              Confidential & Proprietary celebration blueprint • All rights reserved
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
