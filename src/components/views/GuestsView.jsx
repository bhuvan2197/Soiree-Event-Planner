import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Utensils,
  CheckCircle,
  HelpCircle,
  XCircle,
  DollarSign,
  Trash2,
  Filter
} from 'lucide-react';
import Badge from '../common/Badge';
import { calculateCateringMetrics, sanitizeNumber } from '../../utils/eventValidation';

export default function GuestsView({ event, onUpdateGuests }) {
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  // Form state
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [guestGroup, setGuestGroup] = useState('Close Friends');
  const [guestDietary, setGuestDietary] = useState(event.dietary || 'Standard');
  const [guestStatus, setGuestStatus] = useState('Confirmed');

  const guests = event.guests || [];

  // Headcount metrics
  const totalInvitedGuests = guests.reduce((acc, g) => acc + (Number(g.partySize) || 1), 0);
  const confirmedGuests = guests.filter(g => g.status === 'Confirmed').reduce((acc, g) => acc + (Number(g.partySize) || 1), 0);
  const pendingGuests = guests.filter(g => g.status === 'Invited').reduce((acc, g) => acc + (Number(g.partySize) || 1), 0);
  const declinedGuests = guests.filter(g => g.status === 'Declined').reduce((acc, g) => acc + (Number(g.partySize) || 1), 0);

  // Centralized catering impact metrics
  const { costPerHead, committedSpend } = useMemo(() => calculateCateringMetrics(event), [event]);

  const handleAddGuest = (e) => {
    e.preventDefault();
    const cleanName = guestName.trim();
    if (!cleanName) return;

    const newGuest = {
      id: 'g-' + Date.now(),
      name: cleanName.slice(0, 80),
      partySize: sanitizeNumber(partySize, 1, 1, 20),
      group: guestGroup.slice(0, 40),
      dietary: guestDietary.slice(0, 80),
      status: ['Confirmed', 'Invited', 'Declined'].includes(guestStatus) ? guestStatus : 'Invited'
    };

    onUpdateGuests([...guests, newGuest]);
    setGuestName('');
    setPartySize(1);
    setShowAddGuest(false);
  };

  const handleUpdateStatus = (guestId, newStatus) => {
    const updated = guests.map(g => {
      if (g.id === guestId) return { ...g, status: newStatus };
      return g;
    });
    onUpdateGuests(updated);
  };

  const handleDeleteGuest = (guestId) => {
    const updated = guests.filter(g => g.id !== guestId);
    onUpdateGuests(updated);
  };

  const filteredGuests = filterStatus === 'All'
    ? guests
    : guests.filter(g => g.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      
      {/* Banner */}
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 sm:p-8 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Badge variant="gold" size="xs" className="mb-2">
            Hospitality & RSVP Management
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-soiree-burgundyDeep">
            Guest List & RSVP Tracker
          </h1>
          <p className="text-xs sm:text-sm text-soiree-muted mt-1 max-w-xl">
            Monitor RSVP responses, party groups, dietary restrictions, and dynamic per-head culinary impact.
          </p>
        </div>

        <button
          onClick={() => setShowAddGuest(!showAddGuest)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-soiree-burgundy hover:bg-soiree-burgundyDeep text-[#FAF5EC] text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-105"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Guest / Party</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Confirmed */}
        <div className="bg-soiree-cream rounded-2xl border border-soiree-sand p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-soiree-muted uppercase tracking-wider">Confirmed</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-soiree-burgundyDeep">
            {confirmedGuests} <span className="text-xs font-sans text-soiree-muted font-normal">/ {event.guestCount} target</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium mt-1">
            Confirmed seats reserved
          </p>
        </div>

        {/* Pending RSVP */}
        <div className="bg-soiree-cream rounded-2xl border border-soiree-sand p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-soiree-muted uppercase tracking-wider">Awaiting RSVP</span>
            <HelpCircle className="w-4 h-4 text-amber-700" />
          </div>
          <div className="font-serif text-2xl font-bold text-soiree-burgundyDeep">
            {pendingGuests}
          </div>
          <p className="text-[11px] text-amber-800 font-medium mt-1">
            Follow-up reminders recommended
          </p>
        </div>

        {/* Cost per head */}
        <div className="bg-soiree-cream rounded-2xl border border-soiree-sand p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-soiree-muted uppercase tracking-wider">Est. Cost Per Plate</span>
            <DollarSign className="w-4 h-4 text-soiree-rose" />
          </div>
          <div className="font-serif text-2xl font-bold text-soiree-burgundyDeep">
            {event.currencySymbol}{costPerHead.toLocaleString()}
          </div>
          <p className="text-[11px] text-soiree-muted mt-1">
            Culinary & beverage allocation
          </p>
        </div>

        {/* Committed Food Spend */}
        <div className="bg-soiree-cream rounded-2xl border border-soiree-sand p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-soiree-muted uppercase tracking-wider">Committed Dining</span>
            <Utensils className="w-4 h-4 text-soiree-burgundy" />
          </div>
          <div className="font-serif text-2xl font-bold text-soiree-burgundyDeep">
            {event.currencySymbol}{committedCateringSpend.toLocaleString()}
          </div>
          <p className="text-[11px] text-soiree-muted mt-1">
            Based on confirmed party size
          </p>
        </div>

      </div>

      {/* Add Guest Drawer */}
      {showAddGuest && (
        <form onSubmit={handleAddGuest} className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-luxury space-y-4 animate-fade-up">
          <h3 className="font-serif text-lg font-bold text-soiree-burgundyDeep">
            Add Guest / Party
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-soiree-muted mb-1">Guest / Family Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Elena Rostova & Guest"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-soiree-muted mb-1">Party Size (Seats)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-soiree-muted mb-1">Group Affiliation</label>
              <select
                value={guestGroup}
                onChange={(e) => setGuestGroup(e.target.value)}
                className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy font-medium"
              >
                <option value="Family">Family</option>
                <option value="Close Friends">Close Friends</option>
                <option value="Colleagues">Colleagues</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-soiree-muted mb-1">Dietary Restriction</label>
              <input
                type="text"
                placeholder="e.g. Jain, Vegan, Nut-free"
                value={guestDietary}
                onChange={(e) => setGuestDietary(e.target.value)}
                className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-soiree-muted mb-1">RSVP Status</label>
              <select
                value={guestStatus}
                onChange={(e) => setGuestStatus(e.target.value)}
                className="w-full rounded-xl border border-soiree-sand bg-white p-2 text-xs outline-none focus:border-soiree-burgundy font-medium"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Invited">Invited</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-soiree-sand/60">
            <button
              type="button"
              onClick={() => setShowAddGuest(false)}
              className="px-4 py-1.5 text-xs text-soiree-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-xl bg-soiree-burgundy text-[#FAF5EC] text-xs font-semibold hover:bg-soiree-burgundyDeep"
            >
              Add to Guestbook
            </button>
          </div>
        </form>
      )}

      {/* Guest Roster Table */}
      <div className="bg-soiree-cream rounded-3xl border border-soiree-sand p-6 shadow-sm space-y-4">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-soiree-sand pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-soiree-rose" />
            <span className="text-xs font-serif font-bold text-soiree-burgundyDeep">Filter Status:</span>
            {['All', 'Confirmed', 'Invited', 'Declined'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                  filterStatus === st
                    ? 'bg-soiree-burgundy text-[#FAF5EC]'
                    : 'bg-soiree-bg text-soiree-muted hover:text-soiree-ink'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-xs text-soiree-muted">
            Displaying {filteredGuests.length} party entries ({filteredGuests.reduce((s, g) => s + g.partySize, 0)} attendees)
          </span>
        </div>

        {/* Table Rows */}
        <div className="space-y-2.5">
          {filteredGuests.length === 0 ? (
            <div className="text-center py-8 text-xs text-soiree-muted italic">
              No guests found in this filter view.
            </div>
          ) : (
            filteredGuests.map((guest) => (
              <div
                key={guest.id}
                className="p-3.5 rounded-2xl border border-soiree-sand bg-soiree-bg/50 hover:bg-soiree-bg transition-colors flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-soiree-sand/60 font-serif font-bold text-xs text-soiree-burgundyDeep flex items-center justify-center">
                    {guest.partySize}
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-soiree-burgundyDeep">
                      {guest.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-soiree-muted mt-0.5">
                      <span className="font-medium text-soiree-ink">{guest.group}</span>
                      <span>•</span>
                      <span>Dietary: {guest.dietary}</span>
                      <span>•</span>
                      <span>Impact: ~{event.currencySymbol}{(guest.partySize * costPerHead).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={guest.status}
                    onChange={(e) => handleUpdateStatus(guest.id, e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-xl border border-soiree-sand bg-white text-soiree-burgundyDeep outline-none focus:border-soiree-burgundy"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Invited">Invited</option>
                    <option value="Declined">Declined</option>
                  </select>

                  <button
                    onClick={() => handleDeleteGuest(guest.id)}
                    className="text-soiree-muted/40 hover:text-soiree-rose p-1 transition-colors"
                    title="Remove guest"
                    aria-label="Remove guest"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
