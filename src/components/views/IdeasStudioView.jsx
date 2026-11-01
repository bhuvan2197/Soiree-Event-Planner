import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Plus,
  Check,
  Wand2,
  BookmarkCheck,
  Palette,
  Utensils,
  Music,
  Mail,
  Gift,
  Camera,
  PiggyBank
} from 'lucide-react';
import Badge from '../common/Badge';

export default function IdeasStudioView({
  event,
  onUpdateIdeas,
  onSurpriseMe,
  onAddIdeaToPlan,
  isGeneratingIdeas
}) {
  const categories = [
    { id: 'Theme and Decor', label: 'Theme & Decor', icon: Palette },
    { id: 'Menu', label: 'Menu & Tastings', icon: Utensils },
    { id: 'Entertainment and Games', label: 'Entertainment & Games', icon: Music },
    { id: 'Invitations wording', label: 'Invitations Wording', icon: Mail },
    { id: 'Return gifts/favors', label: 'Favors & Gifting', icon: Gift },
    { id: 'Photo-moment ideas', label: 'Photo Moments', icon: Camera },
    { id: 'Budget-friendly hacks', label: 'Budget Hacks', icon: PiggyBank },
  ];

  const [activeCategory, setActiveCategory] = useState('Theme and Decor');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);

  const ideas = event.ideas || [];

  const handleToggleSave = (ideaId) => {
    const updated = ideas.map(i => {
      if (i.id === ideaId) {
        return { ...i, saved: !i.saved };
      }
      return i;
    });
    onUpdateIdeas(updated);
  };

  const handleToggleAddToPlan = (idea) => {
    const isAdding = !idea.addedToPlan;
    const updated = ideas.map(i => {
      if (i.id === idea.id) {
        return { ...i, addedToPlan: isAdding };
      }
      return i;
    });
    onUpdateIdeas(updated);

    if (isAdding) {
      onAddIdeaToPlan(idea);
    }
  };

  const filteredIdeas = ideas
    .filter(i => i.category === activeCategory)
    .filter(i => (filterSavedOnly ? i.saved : true));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      
      {/* Banner */}
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Badge variant="gold" size="xs" className="mb-2">
            AI Creative Atelier
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soiree-burgundyDeep">
            Personalized Ideas Studio
          </h1>
          <p className="text-xs sm:text-sm text-soiree-muted mt-1 max-w-xl">
            Tailored sensory concepts honoring your {event.dietary} cuisine, {event.city} backdrop, and {event.vibe?.join(' & ')} aesthetic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterSavedOnly(!filterSavedOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filterSavedOnly
                ? 'bg-soiree-burgundy text-[#FAF5EC] border-soiree-burgundyDeep'
                : 'bg-soiree-bg hover:bg-soiree-sand text-soiree-ink border-soiree-sand'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-soiree-rose" />
            <span>{filterSavedOnly ? 'Showing Saved' : 'View Saved'}</span>
          </button>

          <button
            onClick={() => onSurpriseMe(activeCategory)}
            disabled={isGeneratingIdeas}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Wand2 className="w-4 h-4 text-soiree-gold" />
            <span>{isGeneratingIdeas ? 'Brainstorming...' : 'Surprise Me'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-soiree-sand scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-soiree-burgundy text-[#FAF5EC] font-semibold shadow-xs'
                  : 'bg-soiree-cream text-soiree-ink hover:bg-soiree-sand/40 border border-soiree-sand/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-soiree-rose'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Ideas Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full bg-soiree-cream rounded-3xl border border-soiree-sand p-10 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-soiree-gold mx-auto" />
            <h4 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
              No ideas here yet
            </h4>
            <p className="text-xs text-soiree-muted max-w-sm mx-auto">
              Click the "Surprise Me" button above to generate personalized concepts for {activeCategory}.
            </p>
            <button
              onClick={() => onSurpriseMe(activeCategory)}
              disabled={isGeneratingIdeas}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold shadow-sm"
            >
              <Wand2 className="w-3.5 h-3.5" /> Generate Ideas Now
            </button>
          </div>
        ) : (
          filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm hover:border-soiree-burgundy/40 hover:shadow-luxury transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="gold" size="xs">
                    {idea.badge || 'Curated'}
                  </Badge>

                  <button
                    onClick={() => handleToggleSave(idea.id)}
                    className="p-1.5 rounded-full hover:bg-soiree-sand/50 transition-colors"
                    title={idea.saved ? 'Remove from saved' : 'Save idea'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        idea.saved ? 'fill-soiree-burgundy text-soiree-burgundy' : 'text-soiree-muted hover:text-soiree-burgundy'
                      }`}
                    />
                  </button>
                </div>

                <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep leading-snug">
                  {idea.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-soiree-ink leading-relaxed">
                  {idea.description}
                </p>
              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-4 border-t border-soiree-sand/60 flex items-center justify-between">
                <span className="text-[11px] font-serif italic text-soiree-muted">
                  {activeCategory}
                </span>

                <button
                  onClick={() => handleToggleAddToPlan(idea)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    idea.addedToPlan
                      ? 'bg-emerald-900/10 text-emerald-800 border border-emerald-700/30'
                      : 'bg-soiree-burgundy text-[#FAF5EC] hover:bg-soiree-burgundyDeep shadow-xs'
                  }`}
                >
                  {idea.addedToPlan ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Added to Plan</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
