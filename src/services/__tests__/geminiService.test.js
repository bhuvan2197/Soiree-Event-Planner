import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import {
  generatePlan,
  rebalanceBudget,
  draftVendorMessage,
  generateIdeas,
  generateRunOfShow,
  generateRiskPlan,
  chatUpdatePlan,
  isAiLive,
  getStoredApiKey,
  setStoredApiKey
} from '../geminiService';
import { SAMPLE_EVENTS } from '../../data/sampleEvents';

describe('geminiService & Heuristic Engine', () => {
  const originalFetch = globalThis.fetch;

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
    globalThis.fetch = originalFetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('API Key and Status', () => {
    it('reports offline demo status when no key is set', () => {
      expect(isAiLive()).toBe(false);
      expect(getStoredApiKey()).toBe('');
    });

    it('stores and clears API keys via helper', () => {
      setStoredApiKey('test-key-123');
      expect(getStoredApiKey()).toBe('test-key-123');
      expect(isAiLive()).toBe(true);

      setStoredApiKey('');
      expect(isAiLive()).toBe(false);
    });
  });

  describe('generatePlan (Offline Fallback Engine)', () => {
    it('generates a full structured blueprint without live credentials', async () => {
      const input = {
        description: 'Bespoke Vintage Parisian Garden Wedding',
        eventType: 'Wedding',
        guestCount: 150,
        totalBudget: 45000,
        currency: 'EUR',
        date: '2026-09-18',
        city: 'Paris',
        vibe: ['Romantic', 'Vintage', 'Intimate']
      };

      const plan = await generatePlan(input);

      expect(plan).toBeDefined();
      expect(plan.id).toMatch(/^event-/);
      expect(plan.isLiveGenerated).toBe(false);
      expect(plan.guestCount).toBe(150);
      expect(plan.totalBudget).toBe(45000);
      expect(plan.currency).toBe('EUR');
      expect(plan.currencySymbol).toBe('€');
      expect(plan.budget.categories.length).toBeGreaterThan(0);
      expect(plan.timeline.length).toBeGreaterThan(0);
      expect(plan.runOfShow.length).toBeGreaterThan(0);
      expect(plan.vendors.length).toBeGreaterThan(0);
      expect(plan.ideas.length).toBeGreaterThan(0);
      expect(plan.guests.length).toBeGreaterThan(0);
      expect(plan.risks.length).toBeGreaterThan(0);
    });

    it('preserves contingency buffer in scaled budget', async () => {
      const input = {
        eventType: 'Birthday',
        totalBudget: 10000,
        currency: 'USD'
      };

      const plan = await generatePlan(input);
      const contingency = plan.budget.categories.find(c =>
        c.id === 'contingency' || c.name.toLowerCase().includes('contingency')
      );

      expect(contingency).toBeDefined();
      expect(contingency.planned).toBeGreaterThan(0);
      // Sum of categories must match total budget
      const sumPlanned = plan.budget.categories.reduce((acc, c) => acc + c.planned, 0);
      expect(sumPlanned).toBe(10000);
    });
  });

  describe('rebalanceBudget', () => {
    it('proportionally rebalances categories to a new total while maintaining integrity', async () => {
      const sample = SAMPLE_EVENTS.wedding;
      const targetBudget = 600000; // Original is 800,000

      const result = await rebalanceBudget(sample, targetBudget);

      expect(result).toBeDefined();
      expect(typeof result.reasoning).toBe('string');
      expect(Array.isArray(result.categories)).toBe(true);

      const sum = result.categories.reduce((acc, c) => acc + c.planned, 0);
      expect(sum).toBe(targetBudget);
    });
  });

  describe('draftVendorMessage', () => {
    it('creates formatted inquiry for WhatsApp and Email', async () => {
      const sample = SAMPLE_EVENTS.wedding;
      const draft = await draftVendorMessage('Floral Designer', sample, 'polite');

      expect(draft).toBeDefined();
      expect(draft.whatsappText).toContain(sample.title);
      expect(draft.whatsappText).toContain(sample.city);
      expect(draft.emailText).toContain('Floral Designer');
      expect(draft.subject).toContain('Inquiry: Floral Designer');
    });
  });

  describe('generateIdeas', () => {
    it('returns bespoke concepts for the chosen category', async () => {
      const sample = SAMPLE_EVENTS.wedding;
      const ideas = await generateIdeas(sample, 'Menu');

      expect(Array.isArray(ideas)).toBe(true);
      expect(ideas.length).toBeGreaterThanOrEqual(3);
      expect(ideas[0].category).toBe('Menu');
      expect(ideas[0].title).toBeDefined();
      expect(ideas[0].description).toBeDefined();
    });
  });

  describe('generateRunOfShow & generateRiskPlan', () => {
    it('returns existing run-of-show when offline', async () => {
      const sample = SAMPLE_EVENTS.wedding;
      const ros = await generateRunOfShow(sample);
      expect(Array.isArray(ros)).toBe(true);
      expect(ros.length).toBeGreaterThan(0);
      expect(ros[0].time).toBeDefined();
    });

    it('returns existing risk contingency shield when offline', async () => {
      const sample = SAMPLE_EVENTS.wedding;
      const risks = await generateRiskPlan(sample);
      expect(Array.isArray(risks)).toBe(true);
      expect(risks.length).toBeGreaterThan(0);
      expect(risks[0].risk).toBeDefined();
    });
  });

  describe('Live Gemini API Handling & Defensive Fallbacks', () => {
    it('successfully processes structured response from live endpoint', async () => {
      setStoredApiKey('AIzaSyMockKeyForTesting123');

      const mockPlanResponse = {
        title: "Sunset Vineyard Soirée",
        eventType: "Anniversary",
        tagline: "Golden hour toasts among grapevines",
        city: "Napa Valley",
        date: "2026-08-15",
        guestCount: 80,
        totalBudget: 40000,
        currency: "USD",
        currencySymbol: "$",
        vibe: ["Romantic", "Rustic"],
        dietary: "Farm to table",
        culturalNotes: "None",
        budget: {
          contingencyPercent: 8,
          categories: [
            { id: "venue", name: "Vineyard Estate", planned: 20000, actual: 0, notes: "Estate rental" },
            { id: "contingency", name: "Buffer", planned: 20000, actual: 0, notes: "Contingency" }
          ]
        },
        timeline: [],
        runOfShow: [],
        vendors: [],
        ideas: [],
        guests: [],
        risks: []
      };

      // Mock fetch with markdown code-fenced JSON
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  { text: "```json\n" + JSON.stringify(mockPlanResponse) + "\n```" }
                ]
              }
            }
          ]
        })
      });

      const plan = await generatePlan({
        description: "Sunset Vineyard 10th Anniversary",
        eventType: "Anniversary",
        guestCount: 80,
        totalBudget: 40000,
        currency: "USD"
      });

      expect(plan).toBeDefined();
      expect(plan.isLiveGenerated).toBe(true);
      expect(plan.title).toBe("Sunset Vineyard Soirée");
      expect(plan.totalBudget).toBe(40000);
    });

    it('gracefully degrades to heuristic engine on API HTTP 500 error', async () => {
      setStoredApiKey('AIzaSyMockKeyForTesting123');

      // Mock HTTP 500 error
      globalThis.fetch = async () => ({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const plan = await generatePlan({
        eventType: "Birthday",
        guestCount: 40,
        totalBudget: 15000,
        currency: "USD"
      });

      // Should fall back to heuristic generator without throwing
      expect(plan).toBeDefined();
      expect(plan.isLiveGenerated).toBe(false);
      expect(plan.totalBudget).toBe(15000);
      expect(plan.guestCount).toBe(40);
    });

    it('gracefully degrades to heuristic engine on network fetch failure', async () => {
      setStoredApiKey('AIzaSyMockKeyForTesting123');

      globalThis.fetch = async () => {
        throw new Error('Network error: Failed to fetch');
      };

      const plan = await generatePlan({
        eventType: "Wedding",
        guestCount: 100,
        totalBudget: 50000,
        currency: "USD"
      });

      expect(plan).toBeDefined();
      expect(plan.isLiveGenerated).toBe(false);
      expect(plan.budget.categories.length).toBeGreaterThan(0);
    });
  });

  describe('chatUpdatePlan', () => {
    it('responds intelligently and applies mutations for budget cut requests', async () => {
      const sample = SAMPLE_EVENTS.wedding;
      const originalBudget = sample.totalBudget;

      const result = await chatUpdatePlan(sample, 'Can you cut the budget by 15%?');

      expect(result).toBeDefined();
      expect(result.replyText).toContain('15%');
      expect(result.planUpdates.totalBudget).toBeLessThan(originalBudget);
      expect(result.planUpdates.budget.categories).toBeDefined();
    });

    it('adds eco-friendly milestones when requested', async () => {
      const sample = SAMPLE_EVENTS.wedding;
      const result = await chatUpdatePlan(sample, 'Make this event more eco-friendly please');

      expect(result.replyText).toContain('Eco-friendly');
      expect(result.planUpdates.vibe).toContain('Eco-friendly');
      expect(result.planUpdates.timeline[0].title).toContain('plastics');
    });
  });
});
