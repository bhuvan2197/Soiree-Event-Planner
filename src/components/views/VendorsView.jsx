import React, { useState, useEffect } from 'react';
import {
  Store,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  Plus,
  DollarSign,
  Phone,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Trash2,
  X
} from 'lucide-react';
import Badge from '../common/Badge';
import { sanitizeNumber } from '../../utils/eventValidation';

export default function VendorsView({
  event,
  onUpdateVendors,
  onDraftMessage,
  isDrafting
}) {
  const [selectedCatId, setSelectedCatId] = useState(event.vendors?.[0]?.id || null);
  const [draftModalData, setDraftModalData] = useState(null);
  const [draftTone, setDraftTone] = useState('polite');
  const [copiedType, setCopiedType] = useState(null);

  // Add/Edit vendor modal state
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [vendorStatus, setVendorStatus] = useState('To research');
  const [vendorQuote, setVendorQuote] = useState('');
  const [vendorAdvance, setVendorAdvance] = useState('');
  const [vendorNotes, setVendorNotes] = useState('');

  const vendorCategories = event.vendors || [];
  const activeCategory = vendorCategories.find(c => c.id === selectedCatId) || vendorCategories[0];

  const pipelineStatuses = [
    'To research',
    'Contacted',
    'Quote received',
    'Booked',
    'Paid'
  ];

  // ESC key listener for modals
  useEffect(() => {
    if (!draftModalData && !showAddVendorModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDraftModalData(null);
        setShowAddVendorModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draftModalData, showAddVendorModal]);

  const handleOpenDraft = async (categoryName) => {
    const draft = await onDraftMessage(categoryName, draftTone);
    if (draft) {
      setDraftModalData({
        category: categoryName,
        ...draft
      });
    }
  };

  const handleCopyText = (text, type) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleSaveVendor = (e) => {
    e.preventDefault();
    const cleanName = vendorName.trim();
    if (!cleanName || !activeCategory) return;

    const newVendor = {
      id: 'vnd-' + Date.now(),
      name: cleanName.slice(0, 80),
      contact: vendorContact.trim().slice(0, 80),
      status: vendorStatus,
      quote: sanitizeNumber(vendorQuote, 0, 0),
      advancePaid: sanitizeNumber(vendorAdvance, 0, 0),
      notes: vendorNotes.slice(0, 200)
    };

    const updatedCategories = vendorCategories.map(cat => {
      if (cat.id === activeCategory.id) {
        return {
          ...cat,
          vendors: [...(cat.vendors || []), newVendor]
        };
      }
      return cat;
    });

    onUpdateVendors(updatedCategories);
    setVendorName('');
    setVendorContact('');
    setVendorQuote('');
    setVendorAdvance('');
    setVendorNotes('');
    setShowAddVendorModal(false);
  };

  const handleUpdateVendorStatus = (catId, vendorId, newStatus) => {
    const updatedCategories = vendorCategories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          vendors: (cat.vendors || []).map(v => {
            if (v.id === vendorId) return { ...v, status: newStatus };
            return v;
          })
        };
      }
      return cat;
    });
    onUpdateVendors(updatedCategories);
  };

  const handleDeleteVendor = (catId, vendorId) => {
    const updatedCategories = vendorCategories.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          vendors: (cat.vendors || []).filter(v => v.id !== vendorId)
        };
      }
      return cat;
    });
    onUpdateVendors(updatedCategories);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      
      {/* Banner */}
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Badge variant="gold" size="xs" className="mb-2">
            Vendor Sourcing & Contracts
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soiree-burgundyDeep">
            Vendor Checklist & Playbook
          </h1>
          <p className="text-xs sm:text-sm text-soiree-muted mt-1 max-w-xl">
            Sourcing playbooks with questions to ask, contract red flags, and 1-click AI inquiry message drafting.
          </p>
        </div>

        {activeCategory && (
          <button
            onClick={() => handleOpenDraft(activeCategory.category)}
            disabled={isDrafting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-soiree-gold" />
            <span>{isDrafting ? 'Writing Inquiry...' : `Draft ${activeCategory.category} Inquiry`}</span>
          </button>
        )}
      </div>

      {/* Main Vendor Content Grid: Left Categories Pill List, Right Category Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Category Selector (4 cols) */}
        <div className="lg:col-span-4 bg-soiree-cream rounded-3xl border border-soiree-sand p-4 shadow-sm space-y-2">
          <div className="px-3 py-2 text-xs font-serif font-bold text-soiree-burgundy uppercase tracking-wider border-b border-soiree-sand/60">
            Categories ({vendorCategories.length})
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {vendorCategories.map((cat) => {
              const isSelected = (activeCategory && activeCategory.id === cat.id);
              const bookedCount = (cat.vendors || []).filter(v => v.status === 'Booked' || v.status === 'Paid').length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-soiree-burgundy text-[#FAF5EC] shadow-sm font-semibold'
                      : 'hover:bg-soiree-sand/40 text-soiree-ink'
                  }`}
                >
                  <div className="truncate">
                    <span className="text-sm font-serif">{cat.category}</span>
                    <span className={`block text-[11px] truncate ${isSelected ? 'text-[#FAF5EC]/80' : 'text-soiree-muted'}`}>
                      Est: {cat.typicalBudgetRange}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {bookedCount > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-900/10 text-emerald-800'
                      }`}>
                        ✓ {bookedCount}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-soiree-muted'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Category Details (8 cols) */}
        {activeCategory ? (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Playbook Card: What to look for, questions to ask, red flags */}
            <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm space-y-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-soiree-sand pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-soiree-burgundyDeep">
                    {activeCategory.category} Playbook
                  </h3>
                  <span className="text-xs text-soiree-muted">
                    Typical Budget Range: <strong className="text-soiree-burgundy">{activeCategory.typicalBudgetRange}</strong>
                  </span>
                </div>

                <button
                  onClick={() => setShowAddVendorModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-soiree-sand bg-soiree-bg hover:bg-soiree-sand text-xs font-semibold text-soiree-burgundy transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Prospective Vendor
                </button>
              </div>

              {/* What to look for */}
              <div className="bg-soiree-bg/80 border border-soiree-sand/80 rounded-2xl p-4 text-xs space-y-1">
                <span className="font-serif font-bold text-soiree-burgundyDeep flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> What to Look For
                </span>
                <p className="text-soiree-ink leading-relaxed">
                  {activeCategory.whatToLookFor}
                </p>
              </div>

              {/* Questions to ask */}
              <div className="bg-soiree-bg/80 border border-soiree-sand/80 rounded-2xl p-4 text-xs space-y-1">
                <span className="font-serif font-bold text-soiree-burgundyDeep flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <HelpCircle className="w-4 h-4 text-soiree-rose" /> Essential Questions to Ask
                </span>
                <p className="text-soiree-ink leading-relaxed">
                  "{activeCategory.questionsToAsk}"
                </p>
              </div>

              {/* Red flags */}
              <div className="bg-rose-50/70 border border-soiree-rose/30 rounded-2xl p-4 text-xs space-y-1">
                <span className="font-serif font-bold text-soiree-rose flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-soiree-rose" /> Contract Red Flags
                </span>
                <p className="text-soiree-ink leading-relaxed">
                  {activeCategory.redFlags}
                </p>
              </div>

            </div>

            {/* Vendor Pipeline Roster */}
            <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm space-y-4">
              <h4 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
                Tracked Vendors & Contracts ({activeCategory.vendors?.length || 0})
              </h4>

              <div className="space-y-3">
                {(!activeCategory.vendors || activeCategory.vendors.length === 0) ? (
                  <div className="text-center py-6 text-soiree-muted text-xs italic">
                    No vendors logged for this category yet. Click "Add Prospective Vendor" above.
                  </div>
                ) : (
                  activeCategory.vendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="p-4 rounded-2xl border border-soiree-sand bg-soiree-bg/60 space-y-3 hover:border-soiree-burgundy/40 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-serif font-bold text-base text-soiree-burgundyDeep">
                            {vendor.name}
                          </span>
                          <span className="text-xs text-soiree-muted block">
                            📞 {vendor.contact || 'No contact specified'}
                          </span>
                        </div>

                        {/* Status Pipeline Dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            value={vendor.status}
                            onChange={(e) => handleUpdateVendorStatus(activeCategory.id, vendor.id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-soiree-sand bg-white text-soiree-burgundyDeep outline-none focus:border-soiree-burgundy"
                          >
                            {pipelineStatuses.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleDeleteVendor(activeCategory.id, vendor.id)}
                            className="text-soiree-muted/40 hover:text-soiree-rose p-1 transition-colors"
                            title="Remove vendor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quote & Advance row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-soiree-ink pt-1 border-t border-soiree-sand/50">
                        <span>Quote: {event.currencySymbol}{(vendor.quote || 0).toLocaleString()}</span>
                        <span>•</span>
                        <span className="text-emerald-800">Paid: {event.currencySymbol}{(vendor.advancePaid || 0).toLocaleString()}</span>
                        <span>•</span>
                        <span className="font-normal italic text-soiree-muted truncate max-w-xs">{vendor.notes || 'No notes'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        ) : null}

      </div>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 bg-soiree-burgundyDeep/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 max-w-md w-full shadow-luxury space-y-4">
            <h3 className="font-serif text-xl font-bold text-soiree-burgundyDeep">
              Add Vendor to {activeCategory?.category}
            </h3>
            <form onSubmit={handleSaveVendor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-soiree-muted mb-1">Vendor / Studio Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Heritage Bloom Atelier"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full rounded-xl border border-soiree-sand bg-white p-2.5 text-xs outline-none focus:border-soiree-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-soiree-muted mb-1">Phone / Email</label>
                  <input
                    type="text"
                    placeholder="+91 ... or email"
                    value={vendorContact}
                    onChange={(e) => setVendorContact(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-soiree-muted mb-1">Status</label>
                  <select
                    value={vendorStatus}
                    onChange={(e) => setVendorStatus(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy font-medium"
                  >
                    {pipelineStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-soiree-muted mb-1">Quote ({event.currencySymbol})</label>
                  <input
                    type="number"
                    value={vendorQuote}
                    onChange={(e) => setVendorQuote(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-soiree-muted mb-1">Advance Paid</label>
                  <input
                    type="number"
                    value={vendorAdvance}
                    onChange={(e) => setVendorAdvance(e.target.value)}
                    className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-soiree-muted mb-1">Notes / Scope details</label>
                <input
                  type="text"
                  placeholder="Includes 4 floral arches..."
                  value={vendorNotes}
                  onChange={(e) => setVendorNotes(e.target.value)}
                  className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-soiree-sand">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-4 py-2 text-xs text-soiree-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep"
                >
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Inquiry Message Modal */}
      {draftModalData && (
        <div className="fixed inset-0 z-50 bg-soiree-burgundyDeep/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 max-w-2xl w-full shadow-luxury space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="gold" size="xs" className="mb-1">
                  Ready-to-Send Sourcing Message
                </Badge>
                <h3 className="font-serif text-xl font-bold text-soiree-burgundyDeep">
                  Inquiry for {draftModalData.category}
                </h3>
              </div>
              <button
                onClick={() => setDraftModalData(null)}
                className="text-soiree-muted hover:text-soiree-ink text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* WhatsApp Tone Box */}
            <div className="bg-soiree-bg rounded-2xl border border-soiree-sand p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-soiree-burgundy uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-700" /> WhatsApp Ready Format
                </span>
                <button
                  onClick={() => handleCopyText(draftModalData.whatsappText, 'whatsapp')}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-soiree-cream border border-soiree-sand text-xs font-semibold text-soiree-burgundy hover:bg-white transition-all"
                >
                  {copiedType === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'whatsapp' ? 'Copied!' : 'Copy WhatsApp'}</span>
                </button>
              </div>
              <pre className="font-sans text-xs text-soiree-ink whitespace-pre-wrap leading-relaxed bg-white/70 p-3 rounded-xl border border-soiree-sand/60">
                {draftModalData.whatsappText}
              </pre>
            </div>

            {/* Email Format Box */}
            <div className="bg-soiree-bg rounded-2xl border border-soiree-sand p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-soiree-burgundy uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-soiree-rose" /> Formal Email Format
                </span>
                <button
                  onClick={() => handleCopyText(`${draftModalData.subject}\n\n${draftModalData.emailText}`, 'email')}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-soiree-cream border border-soiree-sand text-xs font-semibold text-soiree-burgundy hover:bg-white transition-all"
                >
                  {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'email' ? 'Copied!' : 'Copy Email'}</span>
                </button>
              </div>
              <p className="text-xs text-soiree-muted">
                <strong>Subject:</strong> {draftModalData.subject}
              </p>
              <pre className="font-sans text-xs text-soiree-ink whitespace-pre-wrap leading-relaxed bg-white/70 p-3 rounded-xl border border-soiree-sand/60 max-h-40 overflow-y-auto">
                {draftModalData.emailText}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDraftModalData(null)}
                className="px-5 py-2 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
