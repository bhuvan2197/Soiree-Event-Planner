import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { SAMPLE_EVENTS } from '../data/sampleEvents';
import {
  sanitizeNumber,
  isValidDateString,
  calculateDaysRemaining,
  calculateReadinessScore,
  calculateCateringMetrics,
  normalizeAndValidateEvent
} from '../utils/eventValidation';
import {
  getStoredApiKey,
  setStoredApiKey,
  isAiLive,
  generatePlan,
  rebalanceBudget,
  draftVendorMessage,
  generateIdeas,
  generateRunOfShow,
  generateRiskPlan,
  chatUpdatePlan
} from '../services/geminiService';

describe('Comprehensive Atelier Feature & Logic Tests', () => {
  beforeAll(() => {
    let store = {};
    globalThis.localStorage = {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { store = {}; }
    };
  });

  beforeEach(() => {
    localStorage.clear();
    setStoredApiKey('');
  });

  describe('Budget Calculations & Edge Cases', () => {
    it('handles zero target budget rebalance gracefully by clamping to safe minimum', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
      const result = await rebalanceBudget(event, 0);
      expect(result).toBeDefined();
      expect(result.categories.length).toBe(event.budget.categories.length);
      const totalPlanned = result.categories.reduce((acc, c) => acc + c.planned, 0);
      expect(totalPlanned).toBeGreaterThanOrEqual(0);
    });

    it('handles extreme surplus budget rebalance while safeguarding contingency', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
      const highTarget = 2500000;
      const result = await rebalanceBudget(event, highTarget);
      expect(result).toBeDefined();
      const totalPlanned = result.categories.reduce((acc, c) => acc + c.planned, 0);
      expect(totalPlanned).toBe(highTarget);
      expect(result.reasoning).toContain('Expanded total budget');
    });

    it('handles deficit budget rebalance with graceful cut reasoning', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
      const lowTarget = 400000; // Half of 800,000
      const result = await rebalanceBudget(event, lowTarget);
      expect(result).toBeDefined();
      const totalPlanned = result.categories.reduce((acc, c) => acc + c.planned, 0);
      expect(totalPlanned).toBe(lowTarget);
      expect(result.reasoning).toContain('Optimized total by');
    });
  });

  describe('Vendor Sourcing & Communication Tones', () => {
    it('generates inquiry messages across different tone parameters', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
      const formalDraft = await draftVendorMessage('Catering', event, 'formal');
      expect(formalDraft.subject).toContain('Inquiry: Catering');
      expect(formalDraft.whatsappText).toContain(event.title);
      expect(formalDraft.emailText).toContain('Catering');

      const casualDraft = await draftVendorMessage('DJ & Sound', event, 'casual');
      expect(casualDraft.subject).toContain('DJ & Sound');
    });
  });

  describe('Creative Ideas Studio & Action Mapping', () => {
    it('generates ideas across all 7 supported luxury categories', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.birthday);
      const supportedCategories = [
        'Theme and Decor',
        'Menu',
        'Entertainment and Games',
        'Invitations wording',
        'Return gifts/favors',
        'Photo-moment ideas',
        'Budget-friendly hacks'
      ];

      for (const cat of supportedCategories) {
        const ideas = await generateIdeas(event, cat);
        expect(Array.isArray(ideas)).toBe(true);
        expect(ideas.length).toBeGreaterThanOrEqual(3);
        expect(ideas[0].category).toBe(cat);
        expect(ideas[0].badge).toBeDefined();
        expect(ideas[0].saved).toBe(false);
        expect(ideas[0].addedToPlan).toBe(false);
      }
    });

    it('falls back to Theme and Decor when unknown category is supplied', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
      const ideas = await generateIdeas(event, 'NonExistentCategory');
      expect(Array.isArray(ideas)).toBe(true);
      expect(ideas.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Risk Shield Matrix Generation', () => {
    it('provides operational hazards and day-of Plan B actions', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
      const risks = await generateRiskPlan(event);
      expect(Array.isArray(risks)).toBe(true);
      expect(risks.length).toBeGreaterThan(0);
      risks.forEach(r => {
        expect(r.risk).toBeDefined();
        expect(r.preventative).toBeDefined();
        expect(r.planB).toBeDefined();
      });
    });
  });

  describe('AI Co-Planner Conversational Mutations', () => {
    it('handles guest headcount increment requests', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
      const initialGuests = event.guestCount;
      const result = await chatUpdatePlan(event, 'We need to invite more people and expand guests');
      expect(result.planUpdates.guestCount).toBeGreaterThan(initialGuests);
      expect(result.replyText).toContain('guest count');
    });

    it('handles non-mutation conversational advice gently', async () => {
      const event = normalizeAndValidateEvent(SAMPLE_EVENTS.wedding);
      const result = await chatUpdatePlan(event, 'What color shoes should the groom wear with burgundy?');
      expect(result.replyText).toBeDefined();
      expect(Object.keys(result.planUpdates).length).toBe(0);
    });
  });

  describe('Date & Countdown Calculations', () => {
    it('returns 0 for today or past dates and positive integers for future dates', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(calculateDaysRemaining(today)).toBe(0);

      const past = '2010-05-15';
      expect(calculateDaysRemaining(past)).toBe(0);

      // 30 days ahead
      const future = new Date();
      future.setDate(future.getDate() + 30);
      const futureStr = future.toISOString().split('T')[0];
      expect(calculateDaysRemaining(futureStr)).toBeGreaterThanOrEqual(29);
      expect(calculateDaysRemaining(futureStr)).toBeLessThanOrEqual(31);
    });
  });
});
