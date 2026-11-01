import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  CloudRain,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';
import Badge from '../common/Badge';

export default function RiskShieldView({
  event,
  onUpdateRisks,
  onRegenerateRisks,
  isGeneratingRisks
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRisk, setNewRisk] = useState('');
  const [newLikelihood, setNewLikelihood] = useState('Medium');
  const [newImpact, setNewImpact] = useState('High');
  const [newPreventative, setNewPreventative] = useState('');
  const [newPlanB, setNewPlanB] = useState('');

  const risks = event.risks || [];

  // ESC key listener for modal
  useEffect(() => {
    if (!showAddModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const handleAddRisk = (e) => {
    e.preventDefault();
    const cleanRisk = newRisk.trim();
    if (!cleanRisk) return;

    const item = {
      id: 'risk-' + Date.now(),
      risk: cleanRisk.slice(0, 150),
      likelihood: ['High', 'Medium', 'Low'].includes(newLikelihood) ? newLikelihood : 'Medium',
      impact: ['High', 'Medium', 'Low'].includes(newImpact) ? newImpact : 'Medium',
      preventative: newPreventative.trim().slice(0, 300),
      planB: newPlanB.trim().slice(0, 300)
    };

    onUpdateRisks([...risks, item]);
    setNewRisk('');
    setNewPreventative('');
    setNewPlanB('');
    setShowAddModal(false);
  };

  const handleDeleteRisk = (riskId) => {
    const updated = risks.filter(r => r.id !== riskId);
    onUpdateRisks(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      
      {/* Banner */}
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Badge variant="gold" size="xs" className="mb-2">
            Contingency Safeguards
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soiree-burgundyDeep">
            "Plan B" Risk Shield
          </h1>
          <p className="text-xs sm:text-sm text-soiree-muted mt-1 max-w-xl">
            Proactive mitigations and day-of emergency protocols to ensure zero surprises during {event.title}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-soiree-sand bg-soiree-bg hover:bg-soiree-sand text-xs font-semibold text-soiree-burgundy transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Log Custom Hazard
          </button>

          <button
            onClick={onRegenerateRisks}
            disabled={isGeneratingRisks}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-soiree-gold" />
            <span>{isGeneratingRisks ? 'Analyzing Vulnerabilities...' : 'Re-assess with AI'}</span>
          </button>
        </div>
      </div>

      {/* Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm hover:border-soiree-burgundy/40 hover:shadow-luxury transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={item.impact === 'High' ? 'rose' : 'gold'} size="xs">
                    Impact: {item.impact}
                  </Badge>
                  <Badge variant="sand" size="xs">
                    Likelihood: {item.likelihood}
                  </Badge>
                </div>

                <button
                  onClick={() => handleDeleteRisk(item.id)}
                  className="text-soiree-muted/40 hover:text-soiree-rose p-1 transition-colors"
                  title="Remove risk item"
                  aria-label="Remove risk item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                {item.risk}
              </h3>

              {/* Preventative measure */}
              <div className="bg-soiree-bg/80 border border-soiree-sand/80 rounded-2xl p-3.5 text-xs space-y-1">
                <span className="font-serif font-bold text-soiree-burgundyDeep flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Preventative Setup (Weeks Before)
                </span>
                <p className="text-soiree-ink leading-relaxed">
                  {item.preventative}
                </p>
              </div>

              {/* Plan B protocol */}
              <div className="bg-rose-50/60 border border-soiree-rose/30 rounded-2xl p-3.5 text-xs space-y-1">
                <span className="font-serif font-bold text-soiree-rose flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-soiree-rose" /> Day-of "Plan B" Execution
                </span>
                <p className="text-soiree-ink leading-relaxed">
                  {item.planB}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-soiree-muted border-t border-soiree-sand/50">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-700" /> Monitored by Soirée Atelier
              </span>
              <span className="font-serif italic">Shield Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Risk Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-soiree-burgundyDeep/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 max-w-md w-full shadow-luxury space-y-4">
            <h3 className="font-serif text-xl font-bold text-soiree-burgundyDeep">
              Log Celebration Hazard
            </h3>
            <form onSubmit={handleAddRisk} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-soiree-muted mb-1">Hazard / Risk Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unseasonal rain during outdoor lawn dinner"
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value)}
                  className="w-full rounded-xl border border-soiree-sand bg-white p-2.5 text-xs outline-none focus:border-soiree-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-soiree-muted mb-1">Likelihood</label>
                  <select
                    value={newLikelihood}
                    onChange={(e) => setNewLikelihood(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-soiree-muted mb-1">Impact</label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-soiree-muted mb-1">Preventative Action (Weeks Before)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Pre-book adjacent covered banquet hall as backup"
                  value={newPreventative}
                  onChange={(e) => setNewPreventative(e.target.value)}
                  className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-soiree-muted mb-1">Day-of Plan B Protocol</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Coordinator calls move inside at 4 PM if radar shows rain"
                  value={newPlanB}
                  onChange={(e) => setNewPlanB(e.target.value)}
                  className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-soiree-sand">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-soiree-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep"
                >
                  Save Hazard Shield
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
