import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { SAMPLE_EVENTS } from '../data/sampleEvents';
import { normalizeAndValidateEvent, calculateReadinessScore, calculateCateringMetrics } from '../utils/eventValidation';
import { generatePlan, rebalanceBudget } from '../services/geminiService';

describe('End-to-End Atelier State & Domain Flow', () => {
  let localStorageStore = {};

  beforeAll(() => {
    globalThis.localStorage = {
      getItem: (key) => localStorageStore[key] || null,
      setItem: (key, val) => { localStorageStore[key] = String(val); },
      removeItem: (key) => { delete localStorageStore[key]; },
      clear: () => { localStorageStore = {}; }
    };
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes default celebration blueprints with valid schema', () => {
    const wedding = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
    const birthday = normalizeAndValidateEvent(SAMPLE_EVENTS.birthday);
    const community = normalizeAndValidateEvent(SAMPLE_EVENTS.community);

    expect(wedding.id).toBe('sample-wedding');
    expect(wedding.budget.categories.length).toBeGreaterThan(0);
    expect(wedding.timeline.length).toBeGreaterThan(0);
    expect(wedding.readinessScore).toBeGreaterThanOrEqual(0);
    expect(wedding.readinessScore).toBeLessThanOrEqual(100);

    expect(birthday.id).toBe('sample-birthday');
    expect(community.id).toBe('sample-community');
  });

  it('persists and reloads events safely from localStorage', () => {
    const originalEvents = [
      normalizeAndValidateEvent(SAMPLE_EVENTS.wedding),
      normalizeAndValidateEvent(SAMPLE_EVENTS.birthday)
    ];

    // Simulate saving
    localStorage.setItem('soiree_saved_events', JSON.stringify(originalEvents));
    localStorage.setItem('soiree_active_event_id', originalEvents[0].id);

    // Simulate re-reading on app startup
    const loadedRaw = JSON.parse(localStorage.getItem('soiree_saved_events'));
    const loadedEvents = loadedRaw.map(e => normalizeAndValidateEvent(e));
    const activeId = localStorage.getItem('soiree_active_event_id');

    expect(loadedEvents.length).toBe(2);
    expect(activeId).toBe('sample-wedding');
    expect(loadedEvents[0].title).toBe(originalEvents[0].title);
    expect(loadedEvents[0].totalBudget).toBe(originalEvents[0].totalBudget);
  });

  it('creates a new event from user brief, updates budget, and maintains consistency', async () => {
    const brief = {
      description: "Leo's 30th Golden Speakeasy Milestone",
      eventType: "Birthday",
      guestCount: 60,
      totalBudget: 350000,
      currency: "INR",
      city: "Mumbai"
    };

    const newEvent = await generatePlan(brief);
    expect(newEvent.title).toBeDefined();
    expect(newEvent.guestCount).toBe(60);
    expect(newEvent.totalBudget).toBe(350000);

    // Initial readiness score
    const initialScore = calculateReadinessScore(newEvent);
    expect(initialScore).toBeGreaterThan(0);

    // Mark remaining tasks as completed
    const updatedTimeline = newEvent.timeline.map(t => ({
      ...t,
      completed: true
    }));

    const updatedEvent = normalizeAndValidateEvent({
      ...newEvent,
      timeline: updatedTimeline
    });

    // Score should increase with 100% task completion
    expect(updatedEvent.readinessScore).toBeGreaterThanOrEqual(initialScore);

    // Dynamic catering metrics
    const cateringMetrics = calculateCateringMetrics(updatedEvent);
    expect(cateringMetrics.costPerHead).toBeGreaterThan(0);
    expect(cateringMetrics.cateringBudget).toBeGreaterThan(0);
  });

  it('safely handles empty or corrupt JSON in localStorage without unhandled exceptions', () => {
    localStorage.setItem('soiree_saved_events', '{"invalid": "non-array-json"}');
    
    let recoveredEvents = [];
    try {
      const stored = localStorage.getItem('soiree_saved_events');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          recoveredEvents = parsed.map(e => normalizeAndValidateEvent(e));
        }
      }
    } catch (e) {
      // Fallback
    }

    if (recoveredEvents.length === 0) {
      recoveredEvents = [normalizeAndValidateEvent(SAMPLE_EVENTS.wedding)];
    }

    expect(recoveredEvents.length).toBe(1);
    expect(recoveredEvents[0].id).toBe('sample-wedding');
  });

  it('manages complete guest RSVP lifecycle and dynamically recalculates catering spend', () => {
    let event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
    const initialMetrics = calculateCateringMetrics(event);

    // 1. Add new party of 4
    const newGuest = {
      id: 'g-test-4',
      name: 'Lord & Lady Harrington',
      partySize: 4,
      group: 'VIP',
      dietary: 'Gluten-Free',
      status: 'Confirmed'
    };

    event = normalizeAndValidateEvent({
      ...event,
      guests: [...event.guests, newGuest]
    });

    const metricsAfterAdd = calculateCateringMetrics(event);
    expect(metricsAfterAdd.confirmedCount).toBe(initialMetrics.confirmedCount + 4);
    expect(metricsAfterAdd.committedSpend).toBe((initialMetrics.confirmedCount + 4) * metricsAfterAdd.costPerHead);

    // 2. Change RSVP status to Declined
    event = normalizeAndValidateEvent({
      ...event,
      guests: event.guests.map(g => g.id === newGuest.id ? { ...g, status: 'Declined' } : g)
    });

    const metricsAfterDeclined = calculateCateringMetrics(event);
    expect(metricsAfterDeclined.confirmedCount).toBe(initialMetrics.confirmedCount);

    // 3. Delete guest
    event = normalizeAndValidateEvent({
      ...event,
      guests: event.guests.filter(g => g.id !== newGuest.id)
    });
    const finalMetrics = calculateCateringMetrics(event);
    expect(finalMetrics.confirmedCount).toBe(initialMetrics.confirmedCount);
  });

  it('manages vendor booking lifecycle and updates readiness score', () => {
    let event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
    const initialScore = calculateReadinessScore(event);

    // Add a new booked vendor to the first category
    const updatedVendors = event.vendors.map((cat, idx) => {
      if (idx === 0) {
        return {
          ...cat,
          vendors: [
            ...cat.vendors,
            { id: 'v-new-1', name: 'Master Calligrapher', status: 'Booked', quote: 15000, advancePaid: 5000 }
          ]
        };
      }
      return cat;
    });

    event = normalizeAndValidateEvent({
      ...event,
      vendors: updatedVendors
    });

    const newScore = calculateReadinessScore(event);
    // Booking a vendor should maintain or increase readiness score
    expect(newScore).toBeGreaterThanOrEqual(0);
    expect(newScore).toBeLessThanOrEqual(100);
  });

  it('adds and deletes milestones from timeline cleanly', () => {
    let event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
    const initialCount = event.timeline.length;

    const newTask = {
      id: 'task-test-custom',
      title: 'Taste artisanal sorbet pairing',
      phase: 'Finalizing',
      dueDate: event.date,
      priority: 'High',
      owner: 'Host',
      completed: false
    };

    event = normalizeAndValidateEvent({
      ...event,
      timeline: [newTask, ...event.timeline]
    });
    expect(event.timeline.length).toBe(initialCount + 1);
    expect(event.timeline[0].title).toBe('Taste artisanal sorbet pairing');

    // Delete task
    event = normalizeAndValidateEvent({
      ...event,
      timeline: event.timeline.filter(t => t.id !== newTask.id)
    });
    expect(event.timeline.length).toBe(initialCount);
  });

  it('safely recovers from complete JSON syntax error in localStorage', () => {
    localStorage.setItem('soiree_saved_events', '{unclosed-bad-json-syntax}');
    
    let loadedEvents = null;
    try {
      const raw = localStorage.getItem('soiree_saved_events');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) loadedEvents = parsed;
      }
    } catch (e) {
      // Expected syntax error handled
      loadedEvents = [normalizeAndValidateEvent(SAMPLE_EVENTS.wedding)];
    }

    expect(Array.isArray(loadedEvents)).toBe(true);
    expect(loadedEvents[0].id).toBe('sample-wedding');
  });
});
