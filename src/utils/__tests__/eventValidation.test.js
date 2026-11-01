import { describe, it, expect } from 'vitest';
import {
  sanitizeNumber,
  isValidDateString,
  calculateDaysRemaining,
  calculateReadinessScore,
  calculateCateringMetrics,
  normalizeAndValidateEvent
} from '../eventValidation';

describe('eventValidation Utilities', () => {
  describe('sanitizeNumber', () => {
    it('returns valid numbers within range', () => {
      expect(sanitizeNumber(500, 0, 0, 1000)).toBe(500);
      expect(sanitizeNumber('250', 0, 0, 1000)).toBe(250);
    });

    it('rejects NaN, null, undefined, empty strings and returns fallback', () => {
      expect(sanitizeNumber(NaN, 10)).toBe(10);
      expect(sanitizeNumber(null, 20)).toBe(20);
      expect(sanitizeNumber(undefined, 30)).toBe(30);
      expect(sanitizeNumber('', 40)).toBe(40);
      expect(sanitizeNumber('invalid-string', 50)).toBe(50);
    });

    it('clamps numbers below min and above max', () => {
      expect(sanitizeNumber(-10, 0, 0, 100)).toBe(0);
      expect(sanitizeNumber(250, 0, 0, 100)).toBe(100);
    });
  });

  describe('isValidDateString', () => {
    it('validates ISO dates correctly', () => {
      expect(isValidDateString('2026-06-20')).toBe(true);
      expect(isValidDateString('2025-12-31')).toBe(true);
    });

    it('rejects invalid dates or non-strings', () => {
      expect(isValidDateString('not-a-date')).toBe(false);
      expect(isValidDateString('')).toBe(false);
      expect(isValidDateString(null)).toBe(false);
    });
  });

  describe('calculateDaysRemaining', () => {
    it('calculates future days accurately and never returns negative numbers', () => {
      const pastDate = '2020-01-01';
      expect(calculateDaysRemaining(pastDate)).toBe(0);

      // Future date
      const future = new Date();
      future.setDate(future.getDate() + 10);
      const futureStr = future.toISOString().split('T')[0];
      expect(calculateDaysRemaining(futureStr)).toBeGreaterThanOrEqual(9);
    });
  });

  describe('calculateReadinessScore', () => {
    it('computes 0 for empty or null event', () => {
      expect(calculateReadinessScore(null)).toBe(0);
    });

    it('accurately balances tasks, vendors, and budget adherence', () => {
      const event = {
        totalBudget: 100000,
        timeline: [
          { completed: true },
          { completed: true },
          { completed: false },
          { completed: false }
        ], // 50% task progress -> 20 pts
        vendors: [
          {
            vendors: [
              { status: 'Booked' },
              { status: 'Paid' },
              { status: 'To research' },
              { status: 'To research' }
            ]
          }
        ], // 50% vendor booking -> 20 pts
        budget: {
          categories: [
            { actual: 40000 },
            { actual: 50000 }
          ]
        } // 90,000 <= 100,000 -> full 20 pts
      };

      const score = calculateReadinessScore(event);
      expect(score).toBe(60); // 20 + 20 + 20
    });

    it('applies penalty when actual spend exceeds total budget', () => {
      const overBudgetEvent = {
        totalBudget: 50000,
        timeline: [{ completed: true }],
        vendors: [{ vendors: [{ status: 'Booked' }] }],
        budget: {
          categories: [{ actual: 100000 }] // 100% over budget
        }
      };

      const score = calculateReadinessScore(overBudgetEvent);
      // taskWeight: 40, vendorWeight: 40, budgetWeight: 0 (penalized) -> 80
      expect(score).toBe(80);
    });
  });

  describe('calculateCateringMetrics', () => {
    it('computes per-head cost and committed spend accurately', () => {
      const event = {
        totalBudget: 100000,
        guestCount: 100,
        budget: {
          categories: [
            { id: 'catering', name: 'Catering & Drinks', planned: 30000 }
          ]
        },
        guests: [
          { name: 'Alice', partySize: 2, status: 'Confirmed' },
          { name: 'Bob', partySize: 3, status: 'Confirmed' },
          { name: 'Charlie', partySize: 1, status: 'Invited' }
        ]
      };

      const metrics = calculateCateringMetrics(event);
      expect(metrics.costPerHead).toBe(300); // 30,000 / 100
      expect(metrics.confirmedCount).toBe(5); // 2 + 3
      expect(metrics.committedSpend).toBe(1500); // 5 * 300
    });
  });

  describe('normalizeAndValidateEvent', () => {
    it('normalizes a partial or malformed event into a safe schema', () => {
      const raw = {
        title: '  My Celebration  ',
        guestCount: 'not-a-number',
        totalBudget: -500,
        budget: {
          categories: [
            { name: 'Venue', planned: '10000', actual: 'invalid' }
          ]
        }
      };

      const normalized = normalizeAndValidateEvent(raw);
      expect(normalized.title).toBe('My Celebration');
      expect(normalized.guestCount).toBe(100); // fallback applied
      expect(normalized.totalBudget).toBe(50000); // fallback applied
      expect(normalized.budget.categories[0].planned).toBe(10000);
      expect(normalized.budget.categories[0].actual).toBe(0);
      expect(Array.isArray(normalized.timeline)).toBe(true);
      expect(Array.isArray(normalized.vendors)).toBe(true);
      expect(Array.isArray(normalized.ideas)).toBe(true);
      expect(Array.isArray(normalized.guests)).toBe(true);
      expect(Array.isArray(normalized.risks)).toBe(true);
      expect(typeof normalized.readinessScore).toBe('number');
    });
  });
});

