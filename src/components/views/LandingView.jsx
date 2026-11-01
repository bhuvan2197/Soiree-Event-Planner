import React, { useState } from 'react';
import { Sparkles, Calendar, Users, DollarSign, MapPin, Compass, ArrowRight, Wand2 } from 'lucide-react';
import WaxSeal from '../common/WaxSeal';
import Badge from '../common/Badge';
import { sanitizeNumber } from '../../utils/eventValidation';

export default function LandingView({ onGeneratePlan, onLoadSample, isGenerating }) {
  const [description, setDescription] = useState(
    "Sister's engagement, 120 guests, intimate, vegetarian, budget 8 lakh, in March"
  );
  const [eventType, setEventType] = useState('Engagement');
  const [guestCount, setGuestCount] = useState(120);
  const [totalBudget, setTotalBudget] = useState(800000);
  const [currency, setCurrency] = useState('INR');
  const [date, setDate] = useState('2026-03-28');
  const [city, setCity] = useState('Jaipur');
  const [selectedVibes, setSelectedVibes] = useState(['Intimate', 'Traditional', 'Elegant']);
  const [dietary, setDietary] = useState('Strictly Vegetarian (Artisanal royal regional)');
  const [culturalNotes, setCulturalNotes] = useState('Twilight ceremony with Sufi folk acoustic music under banyan lights');

  const eventTypes = [
    'Wedding',
    'Birthday',
    'Community Event',
    'Engagement',
    'Anniversary',
    'Festival',
    'Fundraiser',
    'Baby Shower'
  ];

  const vibeOptions = [
    'Traditional',
    'Modern',
    'Intimate',
    'Grand',
    'Eco-friendly',
    'Fun',
    'Elegant'
  ];

  const toggleVibe = (vibe) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGeneratePlan({
      description: description.trim().slice(0, 500),
      eventType,
      guestCount: sanitizeNumber(guestCount, 100, 1, 50000),
      totalBudget: sanitizeNumber(totalBudget, 50000, 1000, 1000000000),
      currency,
      date,
      city: city.trim().slice(0, 100),
      vibe: selectedVibes,
      dietary: dietary.trim().slice(0, 150),
      culturalNotes: culturalNotes.trim().slice(0, 300)
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 animate-fade-up">
      
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center mb-4">
          <WaxSeal size={56} className="shadow-luxury" />
        </div>
        <Badge variant="gold" size="sm" className="mb-3 uppercase tracking-widest font-semibold">
          AI Event Atelier & Living Blueprint
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-soiree-burgundyDeep leading-tight mb-4">
          Turn a few sentences into an exquisite celebration.
        </h1>
        <p className="font-sans text-soiree-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Soirée interprets your concept’s soul, backward-plans your milestone schedule, allocates intelligent budgets, drafts vendor inquiries, and crafts bespoke moments.
        </p>

        {/* Quick Instant Demo Samples */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <span className="text-xs font-serif italic text-soiree-muted">Instant Demo Blueprints:</span>
          <button
            type="button"
            onClick={() => onLoadSample('wedding')}
            className="text-xs px-3 py-1.5 rounded-full bg-soiree-cream hover:bg-soiree-sand border border-soiree-sand text-soiree-burgundy font-medium transition-all shadow-xs hover:scale-105"
          >
            💍 Sister's Engagement (₹8L)
          </button>
          <button
            type="button"
            onClick={() => onLoadSample('birthday')}
            className="text-xs px-3 py-1.5 rounded-full bg-soiree-cream hover:bg-soiree-sand border border-soiree-sand text-soiree-burgundy font-medium transition-all shadow-xs hover:scale-105"
          >
            🍸 Maya's 30th Rooftop ($4.5k)
          </button>
          <button
            type="button"
            onClick={() => onLoadSample('community')}
            className="text-xs px-3 py-1.5 rounded-full bg-soiree-cream hover:bg-soiree-sand border border-soiree-sand text-soiree-burgundy font-medium transition-all shadow-xs hover:scale-105"
          >
            🌿 Willow Glen Spring Fair ($12k)
          </button>
        </div>
      </div>

      {/* Main Creation Card */}
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-10 shadow-luxury relative overflow-hidden">
        
        {/* Subtle decorative gold edge accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-soiree-gold/40 via-soiree-burgundy to-soiree-gold/40" />

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Natural Language Free Text Input */}
          <div>
            <label htmlFor="event-description" className="block font-serif text-lg sm:text-xl font-bold text-soiree-burgundyDeep mb-2">
              Describe your vision in plain language
            </label>
            <p className="text-xs text-soiree-muted mb-3 font-sans" id="event-description-hint">
              Mention the occasion, vibe, guest count, city, budget, and any cultural or dietary essence.
            </p>
            <div className="relative">
              <textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                aria-describedby="event-description-hint"
                placeholder="e.g., Sister's engagement, 120 guests, intimate, vegetarian, budget 8 lakh, in March at Jaipur"
                className="w-full rounded-2xl border border-soiree-sand bg-soiree-bg/50 p-4 text-soiree-ink placeholder-soiree-muted/60 focus:bg-white focus:border-soiree-burgundy focus:ring-1 focus:ring-soiree-burgundy outline-none transition-all text-base leading-relaxed resize-none shadow-inner-soft"
              />
              <div className="absolute right-3 bottom-3 text-soiree-rose opacity-80 pointer-events-none" aria-hidden="true">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Event Type Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-soiree-muted mb-2.5">
              Celebration Type
            </label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEventType(type)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    eventType === type
                      ? 'bg-soiree-burgundy text-[#FAF5EC] shadow-sm scale-105'
                      : 'bg-soiree-bg/80 text-soiree-ink border border-soiree-sand hover:border-soiree-burgundy/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Structured Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-soiree-sand/60">
            
            {/* Guests */}
            <div>
              <label htmlFor="guest-count" className="block text-xs font-semibold text-soiree-muted mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-soiree-rose" aria-hidden="true" /> Estimated Guests
              </label>
              <input
                id="guest-count"
                type="number"
                min="5"
                max="5000"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full rounded-xl border border-soiree-sand bg-soiree-bg/60 px-3 py-2 text-sm text-soiree-ink focus:border-soiree-burgundy outline-none"
              />
            </div>

            {/* Total Budget */}
            <div>
              <label htmlFor="total-budget" className="block text-xs font-semibold text-soiree-muted mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-soiree-rose" aria-hidden="true" /> Total Budget
              </label>
              <div className="flex gap-2">
                <label htmlFor="currency-select" className="sr-only">Currency</label>
                <select
                  id="currency-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-soiree-sand bg-soiree-bg/60 px-2.5 py-2 text-xs font-semibold text-soiree-burgundyDeep focus:border-soiree-burgundy outline-none"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <input
                  id="total-budget"
                  type="number"
                  min="500"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="w-full rounded-xl border border-soiree-sand bg-soiree-bg/60 px-3 py-2 text-sm text-soiree-ink focus:border-soiree-burgundy outline-none"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="event-date" className="block text-xs font-semibold text-soiree-muted mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-soiree-rose" aria-hidden="true" /> Celebration Date
              </label>
              <input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-soiree-sand bg-soiree-bg/60 px-3 py-2 text-sm text-soiree-ink focus:border-soiree-burgundy outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="event-city" className="block text-xs font-semibold text-soiree-muted mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-soiree-rose" aria-hidden="true" /> City / Region
              </label>
              <input
                id="event-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Jaipur or Brooklyn"
                className="w-full rounded-xl border border-soiree-sand bg-soiree-bg/60 px-3 py-2 text-sm text-soiree-ink focus:border-soiree-burgundy outline-none"
              />
            </div>

          </div>

          {/* Vibe Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-soiree-muted mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-soiree-rose" /> Desired Aesthetic & Vibe
            </label>
            <div className="flex flex-wrap gap-2">
              {vibeOptions.map((vibe) => {
                const isSelected = selectedVibes.includes(vibe);
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => toggleVibe(vibe)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-soiree-rose text-white shadow-xs font-semibold'
                        : 'bg-soiree-sand/30 text-soiree-muted hover:bg-soiree-sand hover:text-soiree-ink'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {vibe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nuances: Dietary & Cultural */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dietary-tone" className="block text-xs font-semibold text-soiree-muted mb-1.5">
                Dietary &amp; Culinary Tone
              </label>
              <input
                id="dietary-tone"
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="e.g. Vegetarian, Halal, Gluten-free tapas"
                className="w-full rounded-xl border border-soiree-sand bg-soiree-bg/60 px-3 py-2 text-xs text-soiree-ink focus:border-soiree-burgundy outline-none"
              />
            </div>
            <div>
              <label htmlFor="cultural-notes" className="block text-xs font-semibold text-soiree-muted mb-1.5">
                Cultural / Ceremonial Traditions
              </label>
              <input
                id="cultural-notes"
                type="text"
                value={culturalNotes}
                onChange={(e) => setCulturalNotes(e.target.value)}
                placeholder="e.g. Ring exchange at dusk, folk Sufi music"
                className="w-full rounded-xl border border-soiree-sand bg-soiree-bg/60 px-3 py-2 text-xs text-soiree-ink focus:border-soiree-burgundy outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-soiree-sand/60">
            <div className="text-xs text-soiree-muted flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-soiree-gold" />
              <span>Full editable budget, timeline, vendors & run-of-show will be synthesized.</span>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] font-serif text-base font-semibold shadow-luxury transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isGenerating ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Arranging your celebration...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 text-soiree-gold" />
                  <span>Create my plan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
