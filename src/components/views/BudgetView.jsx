import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Sliders,
  AlertTriangle,
  Plus,
  Trash2,
  Check,
  Info
} from 'lucide-react';
import Badge from '../common/Badge';
import { sanitizeNumber } from '../../utils/eventValidation';

export default function BudgetView({
  event,
  onUpdateBudget,
  onAiRebalance,
  isRebalancing
}) {
  const [whatIfBudget, setWhatIfBudget] = useState(event.totalBudget || 50000);
  const [whatIfGuests, setWhatIfGuests] = useState(event.guestCount || 100);
  const [rebalanceResult, setRebalanceResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync sandbox sliders whenever active event changes
  useEffect(() => {
    setWhatIfBudget(event.totalBudget || 50000);
    setWhatIfGuests(event.guestCount || 100);
  }, [event.id, event.totalBudget, event.guestCount]);

  // New category form state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPlanned, setNewCatPlanned] = useState(10000);
  const [newCatNotes, setNewCatNotes] = useState('');

  const categories = event.budget?.categories || [];
  const totalPlanned = categories.reduce((sum, c) => sum + (Number(c.planned) || 0), 0);
  const totalActual = categories.reduce((sum, c) => sum + (Number(c.actual) || 0), 0);
  const contingencyCategory = categories.find(c => c.id === 'contingency' || c.name.toLowerCase().includes('contingency'));
  const contingencyAmount = contingencyCategory ? contingencyCategory.planned : 0;
  const contingencyPercent = totalPlanned > 0 ? Math.round((contingencyAmount / totalPlanned) * 100) : 0;

  // Donut colors in strict Burgundy & Beige palette
  const PALETTE = [
    '#6D1A2B', // burgundy primary
    '#4A0F1C', // deep burgundy
    '#9B3347', // rose burgundy
    '#B8935A', // antique gold
    '#C47A88', // soft rose
    '#7A6A5E', // muted slate
    '#8C2539', // vibrant wine
    '#D4A373', // sand gold
    '#5C1625', // dark maroon
    '#A86F58'  // warm terracotta
  ];

  // Memoized SVG Donut slices calculation with full circle protection
  const donutSlices = useMemo(() => {
    if (totalPlanned <= 0 || categories.length === 0) return [];
    
    // Check if only 1 positive category exists
    const nonZeroCats = categories.filter(c => (Number(c.planned) || 0) > 0);
    if (nonZeroCats.length === 1) {
      const single = nonZeroCats[0];
      return [{
        id: single.id,
        name: single.name,
        planned: single.planned,
        actual: single.actual,
        percent: 100,
        color: PALETTE[0],
        isFullCircle: true
      }];
    }

    let cumulativePercent = 0;
    return categories.map((cat, idx) => {
      const plannedNum = sanitizeNumber(cat.planned, 0, 0);
      const fraction = totalPlanned > 0 ? plannedNum / totalPlanned : 0;
      const startAngle = cumulativePercent * 360;
      cumulativePercent += fraction;
      const endAngle = Math.min(360, cumulativePercent * 360);

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      const startX = 50 + 40 * Math.cos(startRad);
      const startY = 50 + 40 * Math.sin(startRad);
      const endX = 50 + 40 * Math.cos(endRad);
      const endY = 50 + 40 * Math.sin(endRad);
      const largeArc = fraction > 0.5 ? 1 : 0;

      return {
        id: cat.id,
        name: cat.name,
        planned: plannedNum,
        actual: sanitizeNumber(cat.actual, 0, 0),
        percent: Math.round(fraction * 100),
        color: PALETTE[idx % PALETTE.length],
        pathData: `M 50 50 L ${startX.toFixed(2)} ${startY.toFixed(2)} A 40 40 0 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)} Z`,
        isFullCircle: false
      };
    });
  }, [categories, totalPlanned]);

  // What-If Simulation
  const handleApplyWhatIf = () => {
    const scale = whatIfBudget / (event.totalBudget || 1);
    const guestScale = whatIfGuests / (event.guestCount || 1);

    const recomputed = categories.map((c, i, arr) => {
      // Scale food/drinks with guests, other categories with total budget
      const factor = (c.id === 'catering' || c.name.toLowerCase().includes('catering') || c.name.toLowerCase().includes('drink'))
        ? guestScale * scale
        : scale;

      let newPlanned = Math.round((c.planned * factor) / 50) * 50;
      if (i === arr.length - 1) {
        // Balance last line so sum roughly tracks
        newPlanned = Math.max(50, whatIfBudget - arr.slice(0, i).reduce((s, x) => s + Math.round((x.planned * scale) / 50) * 50, 0));
      }
      return {
        ...c,
        planned: newPlanned
      };
    });

    onUpdateBudget({
      totalBudget: whatIfBudget,
      guestCount: whatIfGuests,
      budget: {
        ...event.budget,
        categories: recomputed
      }
    });

    setIsSimulating(false);
  };

  // Trigger AI Rebalance
  const handleTriggerRebalance = async () => {
    const result = await onAiRebalance(whatIfBudget);
    if (result) {
      setRebalanceResult(result);
    }
  };

  const handleConfirmAiRebalance = () => {
    if (!rebalanceResult) return;
    onUpdateBudget({
      totalBudget: whatIfBudget,
      budget: {
        ...event.budget,
        categories: rebalanceResult.categories
      }
    });
    setRebalanceResult(null);
  };

  const handleUpdateCategory = (catId, field, value) => {
    const updated = categories.map(c => {
      if (c.id === catId) {
        let cleanVal = value;
        if (field === 'planned' || field === 'actual') {
          cleanVal = sanitizeNumber(value, 0, 0);
        }
        return { ...c, [field]: cleanVal };
      }
      return c;
    });
    onUpdateBudget({
      budget: { ...event.budget, categories: updated }
    });
  };

  const handleDeleteCategory = (catId) => {
    const updated = categories.filter(c => c.id !== catId);
    onUpdateBudget({
      budget: { ...event.budget, categories: updated }
    });
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    const newCat = {
      id: 'cat-' + Date.now(),
      name: trimmed.slice(0, 80),
      planned: sanitizeNumber(newCatPlanned, 5000, 0),
      actual: 0,
      notes: (newCatNotes || 'Custom allocation').slice(0, 150)
    };
    onUpdateBudget({
      budget: { ...event.budget, categories: [...categories, newCat] }
    });
    setNewCatName('');
    setNewCatPlanned(10000);
    setNewCatNotes('');
    setShowAddCategory(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      
      {/* Top Banner: Overview & AI Rebalance Trigger */}
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Badge variant="gold" size="xs" className="mb-2">
            Smart Allocation Engine
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soiree-burgundyDeep">
            Smart Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-soiree-muted mt-1 max-w-xl">
            Real-time planned vs. actual spend tracking with automatic contingency buffers and AI-powered redistribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
              isSimulating
                ? 'bg-soiree-burgundy text-[#FAF5EC] border-soiree-burgundyDeep'
                : 'bg-soiree-bg hover:bg-soiree-sand text-soiree-ink border-soiree-sand'
            }`}
          >
            <Sliders className="w-4 h-4 text-soiree-rose" />
            <span>{isSimulating ? 'Close Simulation' : 'What-If Sliders'}</span>
          </button>

          <button
            onClick={handleTriggerRebalance}
            disabled={isRebalancing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-soiree-gold" />
            <span>{isRebalancing ? 'Analyzing with AI...' : 'AI Rebalance'}</span>
          </button>
        </div>
      </div>

      {/* AI Rebalance Suggestion Banner (if active) */}
      {rebalanceResult && (
        <div className="bg-gradient-to-r from-soiree-cream via-soiree-sandLight to-soiree-cream rounded-2xl border-2 border-soiree-gold p-6 shadow-luxury animate-fade-up">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-soiree-gold" />
                <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                  AI Optimization Proposal
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-soiree-ink leading-relaxed">
                {rebalanceResult.reasoning}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setRebalanceResult(null)}
                className="px-3 py-1.5 rounded-xl border border-soiree-sand text-xs text-soiree-muted hover:bg-soiree-sand/40"
              >
                Dismiss
              </button>
              <button
                onClick={handleConfirmAiRebalance}
                className="px-4 py-1.5 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> Apply Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "What-If" Sliders Drawer */}
      {isSimulating && (
        <div className="bg-soiree-bg rounded-2xl border border-soiree-sand p-6 shadow-inner-soft animate-fade-up space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep flex items-center gap-2">
              <Sliders className="w-4 h-4 text-soiree-rose" /> What-If Scenario Sandbox
            </h3>
            <span className="text-xs text-soiree-muted">
              Dynamically scales all categories based on per-head catering ratios.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Budget Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-soiree-ink mb-1.5">
                <span>Simulated Total Budget</span>
                <span className="text-soiree-burgundy font-serif font-bold text-sm">
                  {event.currencySymbol}{whatIfBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={Math.round(event.totalBudget * 0.4)}
                max={Math.round(event.totalBudget * 1.8)}
                step="5000"
                value={whatIfBudget}
                onChange={(e) => setWhatIfBudget(Number(e.target.value))}
                className="w-full accent-soiree-burgundy cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-soiree-muted mt-1">
                <span>-60%</span>
                <span>Current: {event.currencySymbol}{event.totalBudget.toLocaleString()}</span>
                <span>+80%</span>
              </div>
            </div>

            {/* Guest Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-soiree-ink mb-1.5">
                <span>Simulated Guest Count</span>
                <span className="text-soiree-burgundy font-serif font-bold text-sm">
                  {whatIfGuests} Guests
                </span>
              </div>
              <input
                type="range"
                min={Math.max(10, Math.round(event.guestCount * 0.5))}
                max={Math.round(event.guestCount * 2)}
                step="5"
                value={whatIfGuests}
                onChange={(e) => setWhatIfGuests(Number(e.target.value))}
                className="w-full accent-soiree-burgundy cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-soiree-muted mt-1">
                <span>{Math.max(10, Math.round(event.guestCount * 0.5))} min</span>
                <span>Current: {event.guestCount}</span>
                <span>{Math.round(event.guestCount * 2)} max</span>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-soiree-sand">
            <button
              onClick={() => {
                setWhatIfBudget(event.totalBudget);
                setWhatIfGuests(event.guestCount);
              }}
              className="px-3 py-1.5 text-xs text-soiree-muted hover:underline"
            >
              Reset to Original
            </button>
            <button
              onClick={handleApplyWhatIf}
              className="px-4 py-2 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep"
            >
              Save Simulated Plan
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Donut Breakdown + Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Donut & Legend (5 cols) */}
        <div className="lg:col-span-5 bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
              Category Allocation
            </h3>
            <Badge variant="gold" size="xs">
              {contingencyPercent}% Contingency Reserved
            </Badge>
          </div>

          {/* SVG Donut Visual */}
          <div className="relative w-64 h-64 mx-auto">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transform -rotate-90"
              role="img"
              aria-label="Category allocation donut chart"
            >
              {donutSlices.map((slice) => (
                slice.isFullCircle ? (
                  <circle
                    key={slice.id}
                    cx="50"
                    cy="50"
                    r="40"
                    fill={slice.color}
                  >
                    <title>{`${slice.name}: ${event.currencySymbol}${slice.planned.toLocaleString()} (${slice.percent}%)`}</title>
                  </circle>
                ) : (
                  <path
                    key={slice.id}
                    d={slice.pathData}
                    fill={slice.color}
                    className="transition-opacity hover:opacity-85 cursor-pointer"
                  >
                    <title>{`${slice.name}: ${event.currencySymbol}${slice.planned.toLocaleString()} (${slice.percent}%)`}</title>
                  </path>
                )
              ))}
              {/* Inner cutout circle to form Donut */}
              <circle cx="50" cy="50" r="26" fill="#FAF5EC" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-sans tracking-widest text-soiree-muted font-bold">
                Total Target
              </span>
              <span className="font-serif text-base sm:text-lg font-bold text-soiree-burgundyDeep leading-tight">
                {event.currencySymbol}{totalPlanned.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-soiree-sand/60 text-xs">
            {donutSlices.map((slice) => (
              <div key={slice.id} className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="truncate text-soiree-ink">{slice.name}</span>
                <span className="font-semibold text-soiree-muted ml-auto shrink-0">
                  {slice.percent}%
                </span>
              </div>
            ))}
          </div>

          {/* Contingency Safety Note */}
          <div className="bg-soiree-bg/80 border border-soiree-sand rounded-xl p-3 flex items-start gap-2.5 text-xs text-soiree-ink">
            <Info className="w-4 h-4 text-soiree-rose shrink-0 mt-0.5" />
            <p>
              <strong>Safety Guardrail:</strong> Always keeping 5–10% in contingency shields you from unexpected overtime, weather cover rentals, and last-minute guest dietary surges.
            </p>
          </div>
        </div>

        {/* Right: Editable Budget Table (7 cols) */}
        <div className="lg:col-span-7 bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                Planned vs. Actual Spend
              </h3>
              <p className="text-xs text-soiree-muted">
                Bars turn rose/burgundy when actual exceeds planned allocation.
              </p>
            </div>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-soiree-sand bg-soiree-bg hover:bg-soiree-sand text-xs font-semibold text-soiree-burgundy transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          {/* Add Category Drawer */}
          {showAddCategory && (
            <form onSubmit={handleAddCategorySubmit} className="p-4 bg-soiree-bg rounded-2xl border border-soiree-sand space-y-3 animate-fade-up">
              <div className="text-xs font-bold text-soiree-burgundyDeep">New Budget Category</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Category Name"
                  aria-label="New category name"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="rounded-xl border border-soiree-sand bg-white px-3 py-1.5 text-xs outline-none focus:border-soiree-burgundy"
                />
                <input
                  type="number"
                  placeholder="Planned Budget"
                  aria-label="New category planned budget"
                  required
                  value={newCatPlanned}
                  onChange={(e) => setNewCatPlanned(e.target.value)}
                  className="rounded-xl border border-soiree-sand bg-white px-3 py-1.5 text-xs outline-none focus:border-soiree-burgundy"
                />
                <input
                  type="text"
                  placeholder="Notes"
                  aria-label="New category notes"
                  value={newCatNotes}
                  onChange={(e) => setNewCatNotes(e.target.value)}
                  className="rounded-xl border border-soiree-sand bg-white px-3 py-1.5 text-xs outline-none focus:border-soiree-burgundy"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="px-3 py-1 text-xs text-soiree-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          {/* Table List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isOver = cat.actual > cat.planned && cat.planned > 0;
              const percentUsed = cat.planned > 0 ? Math.round((cat.actual / cat.planned) * 100) : 0;
              const isContingency = cat.id === 'contingency' || cat.name.toLowerCase().includes('contingency');

              return (
                <div
                  key={cat.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isOver
                      ? 'border-soiree-rose/60 bg-soiree-rose/5'
                      : isContingency
                      ? 'border-soiree-gold/50 bg-soiree-gold/5'
                      : 'border-soiree-sand bg-soiree-bg/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-soiree-burgundyDeep">
                        {cat.name}
                      </span>
                      {isOver && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-soiree-rose font-bold uppercase tracking-wider bg-soiree-rose/10 px-1.5 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> Over Budget
                        </span>
                      )}
                      {isContingency && (
                        <span className="text-[10px] text-soiree-burgundy font-bold uppercase tracking-wider bg-soiree-gold/20 px-1.5 py-0.5 rounded">
                          Buffer
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-soiree-muted/60 hover:text-soiree-rose transition-colors p-1"
                      title="Delete category"
                      aria-label={`Delete category ${cat.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Planned vs Actual Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-soiree-muted block text-[10px] uppercase tracking-wider">Planned</span>
                      <div className="flex items-center gap-1 font-semibold text-soiree-ink">
                        <span>{event.currencySymbol}</span>
                        <input
                          type="number"
                          value={cat.planned}
                          onChange={(e) => handleUpdateCategory(cat.id, 'planned', e.target.value)}
                          aria-label={`Planned amount for ${cat.name}`}
                          className="w-full bg-transparent border-b border-soiree-sand focus:border-soiree-burgundy outline-none py-0.5"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-soiree-muted block text-[10px] uppercase tracking-wider">Actual Spend</span>
                      <div className="flex items-center gap-1 font-semibold text-soiree-ink">
                        <span>{event.currencySymbol}</span>
                        <input
                          type="number"
                          value={cat.actual}
                          onChange={(e) => handleUpdateCategory(cat.id, 'actual', e.target.value)}
                          aria-label={`Actual spend for ${cat.name}`}
                          className="w-full bg-transparent border-b border-soiree-sand focus:border-soiree-burgundy outline-none py-0.5"
                        />
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-soiree-muted block text-[10px] uppercase tracking-wider">Notes</span>
                      <input
                        type="text"
                        value={cat.notes || ''}
                        onChange={(e) => handleUpdateCategory(cat.id, 'notes', e.target.value)}
                        placeholder="Details..."
                        aria-label={`Notes for ${cat.name}`}
                        className="w-full bg-transparent border-b border-soiree-sand text-xs text-soiree-muted focus:border-soiree-burgundy outline-none py-0.5"
                      />
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-1.5 bg-soiree-sand/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-soiree-rose' : 'bg-soiree-burgundy'
                      }`}
                      style={{ width: `${Math.min(100, percentUsed)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals Summary Footer */}
          <div className="pt-3 border-t border-soiree-sand flex items-center justify-between text-xs font-semibold">
            <span className="text-soiree-muted">Total Committed vs Planned:</span>
            <span className="text-soiree-burgundyDeep font-serif text-sm font-bold">
              {event.currencySymbol}{totalActual.toLocaleString()} / {event.currencySymbol}{totalPlanned.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
