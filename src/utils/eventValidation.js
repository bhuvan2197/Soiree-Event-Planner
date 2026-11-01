/**
 * Event Data Validation, Normalization and Calculation Utilities
 * Ensures runtime stability, defensive schema boundaries, and single-source-of-truth domain calculations.
 */

/**
 * Defensive number sanitizer: rejects NaN, Infinity, negative values (unless allowed).
 */
export function sanitizeNumber(value, fallback = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
  if (value === null || value === undefined || value === '') return fallback;
  const num = Number(value);
  if (!Number.isFinite(num) || Number.isNaN(num)) return fallback;
  if (num < min) return fallback;
  if (num > max) return max;
  return num;
}

/**
 * Validates and safely parses an ISO date string (YYYY-MM-DD or standard ISO).
 * Performs strict calendar checking so impossible dates like 2026-02-31 or 2026-99-99 are rejected.
 */
export function isValidDateString(dateStr) {
  if (typeof dateStr !== 'string' || !dateStr.trim()) return false;
  const trimmed = dateStr.trim();
  
  // Strict check for YYYY-MM-DD format
  const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (ymdMatch) {
    const year = Number(ymdMatch[1]);
    const month = Number(ymdMatch[2]);
    const day = Number(ymdMatch[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2200) return false;
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return (
      parsed.getUTCFullYear() === year &&
      parsed.getUTCMonth() === month - 1 &&
      parsed.getUTCDate() === day
    );
  }

  const parsed = new Date(trimmed);
  return !Number.isNaN(parsed.getTime());
}

/**
 * Calculates days remaining until the target date, timezone-safe and non-negative.
 */
export function calculateDaysRemaining(dateStr) {
  if (!isValidDateString(dateStr)) return 0;
  const target = new Date(dateStr);
  const now = new Date();
  
  // Set to midnight for clean day counting
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Single source of truth for Readiness Score calculation (0 - 100).
 * Balances tasks completion (40%), vendor booking progress (40%), and budget adherence (20%).
 */
export function calculateReadinessScore(event) {
  if (!event) return 0;

  // 1. Task progress (0 - 40 pts)
  const timeline = Array.isArray(event.timeline) ? event.timeline : [];
  const totalTasks = timeline.length;
  const completedTasks = timeline.filter(t => Boolean(t.completed)).length;
  const taskWeight = totalTasks > 0 ? (completedTasks / totalTasks) * 40 : 20;

  // 2. Vendor booking progress (0 - 40 pts)
  const vendorCats = Array.isArray(event.vendors) ? event.vendors : [];
  let totalVendors = 0;
  let bookedVendors = 0;

  vendorCats.forEach(cat => {
    const list = Array.isArray(cat?.vendors) ? cat.vendors : [];
    totalVendors += list.length;
    bookedVendors += list.filter(v => {
      const s = (v?.status || '').toLowerCase();
      return s === 'booked' || s === 'paid' || s === 'contracted';
    }).length;
  });

  const vendorWeight = totalVendors > 0 ? (bookedVendors / totalVendors) * 40 : 20;

  // 3. Budget adherence (0 - 20 pts)
  const totalBudget = sanitizeNumber(event.totalBudget, 0, 0);
  const categories = Array.isArray(event.budget?.categories) ? event.budget.categories : [];
  const totalActual = categories.reduce((sum, c) => sum + sanitizeNumber(c.actual, 0), 0);

  let budgetWeight = 20;
  if (totalBudget > 0) {
    if (totalActual > totalBudget) {
      // Over budget penalty
      const overRatio = (totalActual - totalBudget) / totalBudget;
      budgetWeight = Math.max(0, Math.round(20 - (overRatio * 40)));
    } else {
      budgetWeight = 20;
    }
  }

  const score = Math.min(100, Math.max(0, Math.round(taskWeight + vendorWeight + budgetWeight)));
  return score;
}

/**
 * Calculates per-head culinary impact and commitment.
 */
export function calculateCateringMetrics(event) {
  if (!event) return { costPerHead: 0, committedSpend: 0, cateringBudget: 0 };

  const categories = Array.isArray(event.budget?.categories) ? event.budget.categories : [];
  const cateringCat = categories.find(c => {
    const name = (c?.name || '').toLowerCase();
    const id = (c?.id || '').toLowerCase();
    return id.includes('cater') || name.includes('cater') || name.includes('food') || name.includes('feast');
  });

  const totalBudget = sanitizeNumber(event.totalBudget, 0);
  const plannedGuestCount = sanitizeNumber(event.guestCount, 1, 1);
  const cateringBudget = cateringCat ? sanitizeNumber(cateringCat.planned, 0) : Math.round(totalBudget * 0.35);

  const costPerHead = plannedGuestCount > 0 ? Math.round(cateringBudget / plannedGuestCount) : 0;

  const guests = Array.isArray(event.guests) ? event.guests : [];
  const confirmedCount = guests
    .filter(g => (g?.status || '').toLowerCase() === 'confirmed')
    .reduce((sum, g) => sum + sanitizeNumber(g.partySize, 1, 1), 0);

  const committedSpend = confirmedCount * costPerHead;

  return {
    costPerHead,
    committedSpend,
    cateringBudget,
    confirmedCount
  };
}

/**
 * Comprehensive schema validator and normalizer for Event Blueprints.
 * Ensures model outputs and persisted objects are safe, resilient, and non-crashing.
 */
export function normalizeAndValidateEvent(raw, fallback = {}) {
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const title = typeof raw.title === 'string' && raw.title.trim().length > 0 
    ? raw.title.trim().slice(0, 120) 
    : (fallback.title || 'Untitled Celebration');

  const eventType = typeof raw.eventType === 'string' && raw.eventType.trim().length > 0
    ? raw.eventType.trim().slice(0, 50)
    : (fallback.eventType || 'Celebration');

  const tagline = typeof raw.tagline === 'string'
    ? raw.tagline.trim().slice(0, 300)
    : (fallback.tagline || '');

  const date = isValidDateString(raw.date) ? raw.date : (fallback.date || new Date().toISOString().split('T')[0]);
  const city = typeof raw.city === 'string' ? raw.city.trim().slice(0, 80) : (fallback.city || 'Local Venue');

  const guestCount = sanitizeNumber(raw.guestCount, fallback.guestCount || 100, 1, 100000);
  const totalBudget = sanitizeNumber(raw.totalBudget, fallback.totalBudget || 50000, 1, 1000000000);
  const currency = typeof raw.currency === 'string' ? raw.currency.trim().toUpperCase().slice(0, 5) : (fallback.currency || 'USD');
  const currencySymbol = raw.currencySymbol || (currency === 'INR' ? '₹' : (currency === 'EUR' ? '€' : (currency === 'GBP' ? '£' : '$')));

  const vibe = Array.isArray(raw.vibe) 
    ? raw.vibe.filter(v => typeof v === 'string').map(v => v.trim()).filter(Boolean).slice(0, 8)
    : (fallback.vibe || ['Intimate', 'Elegant']);

  const dietary = typeof raw.dietary === 'string' ? raw.dietary.trim().slice(0, 150) : (fallback.dietary || 'Standard');
  const culturalNotes = typeof raw.culturalNotes === 'string' ? raw.culturalNotes.trim().slice(0, 300) : (fallback.culturalNotes || 'None');

  // Budget validation & normalization
  const rawCategories = Array.isArray(raw.budget?.categories) ? raw.budget.categories : (fallback.budget?.categories || []);
  const normalizedCategories = rawCategories.map((c, i) => ({
    id: typeof c.id === 'string' && c.id ? c.id : `cat-${i + 1}`,
    name: typeof c.name === 'string' && c.name ? c.name.slice(0, 80) : `Category ${i + 1}`,
    planned: sanitizeNumber(c.planned, 0, 0),
    actual: sanitizeNumber(c.actual, 0, 0),
    notes: typeof c.notes === 'string' ? c.notes.slice(0, 200) : ''
  }));

  // Timeline validation
  const rawTimeline = Array.isArray(raw.timeline) ? raw.timeline : (fallback.timeline || []);
  const normalizedTimeline = rawTimeline.map((t, i) => ({
    id: typeof t.id === 'string' && t.id ? t.id : `t-${i + 1}`,
    phase: typeof t.phase === 'string' ? t.phase : 'Booking Phase',
    title: typeof t.title === 'string' && t.title ? t.title.slice(0, 150) : `Milestone ${i + 1}`,
    dueDate: isValidDateString(t.dueDate) ? t.dueDate : date,
    priority: ['High', 'Medium', 'Low'].includes(t.priority) ? t.priority : 'Medium',
    owner: typeof t.owner === 'string' ? t.owner.slice(0, 50) : 'Host',
    completed: Boolean(t.completed)
  }));

  // Run of Show validation
  const rawRos = Array.isArray(raw.runOfShow) ? raw.runOfShow : (fallback.runOfShow || []);
  const normalizedRos = rawRos.map((r, i) => ({
    id: typeof r.id === 'string' && r.id ? r.id : `ros-${i + 1}`,
    time: typeof r.time === 'string' ? r.time.slice(0, 30) : '12:00 PM',
    title: typeof r.title === 'string' ? r.title.slice(0, 120) : `Activity ${i + 1}`,
    location: typeof r.location === 'string' ? r.location.slice(0, 80) : 'Main Area',
    leadPerson: typeof r.leadPerson === 'string' ? r.leadPerson.slice(0, 50) : 'Coordinator',
    notes: typeof r.notes === 'string' ? r.notes.slice(0, 250) : ''
  }));

  // Vendors validation
  const rawVendors = Array.isArray(raw.vendors) ? raw.vendors : (fallback.vendors || []);
  const normalizedVendors = rawVendors.map((cat, i) => ({
    id: typeof cat.id === 'string' && cat.id ? cat.id : `vcat-${i + 1}`,
    category: typeof cat.category === 'string' ? cat.category.slice(0, 60) : `Service ${i + 1}`,
    whatToLookFor: typeof cat.whatToLookFor === 'string' ? cat.whatToLookFor.slice(0, 250) : '',
    questionsToAsk: typeof cat.questionsToAsk === 'string' ? cat.questionsToAsk.slice(0, 250) : '',
    redFlags: typeof cat.redFlags === 'string' ? cat.redFlags.slice(0, 250) : '',
    typicalBudgetRange: typeof cat.typicalBudgetRange === 'string' ? cat.typicalBudgetRange.slice(0, 60) : '',
    vendors: Array.isArray(cat.vendors) ? cat.vendors.map((v, j) => ({
      id: typeof v.id === 'string' && v.id ? v.id : `vnd-${i}-${j}`,
      name: typeof v.name === 'string' ? v.name.slice(0, 80) : 'Prospective Vendor',
      contact: typeof v.contact === 'string' ? v.contact.slice(0, 80) : '',
      status: typeof v.status === 'string' ? v.status : 'To research',
      quote: sanitizeNumber(v.quote, 0, 0),
      advancePaid: sanitizeNumber(v.advancePaid, 0, 0),
      notes: typeof v.notes === 'string' ? v.notes.slice(0, 200) : ''
    })) : []
  }));

  // Ideas validation
  const rawIdeas = Array.isArray(raw.ideas) ? raw.ideas : (fallback.ideas || []);
  const normalizedIdeas = rawIdeas.map((idea, i) => ({
    id: typeof idea.id === 'string' && idea.id ? idea.id : `idea-${i + 1}`,
    category: typeof idea.category === 'string' ? idea.category : 'Theme and Decor',
    title: typeof idea.title === 'string' ? idea.title.slice(0, 100) : 'Bespoke Idea',
    description: typeof idea.description === 'string' ? idea.description.slice(0, 300) : '',
    badge: typeof idea.badge === 'string' ? idea.badge.slice(0, 40) : 'Curated',
    saved: Boolean(idea.saved),
    addedToPlan: Boolean(idea.addedToPlan)
  }));

  // Guests validation
  const rawGuests = Array.isArray(raw.guests) ? raw.guests : (fallback.guests || []);
  const normalizedGuests = rawGuests.map((g, i) => ({
    id: typeof g.id === 'string' && g.id ? g.id : `guest-${i + 1}`,
    name: typeof g.name === 'string' ? g.name.slice(0, 80) : 'Guest',
    partySize: sanitizeNumber(g.partySize, 1, 1, 50),
    group: typeof g.group === 'string' ? g.group.slice(0, 50) : 'Friends',
    dietary: typeof g.dietary === 'string' ? g.dietary.slice(0, 80) : 'Standard',
    status: ['Confirmed', 'Invited', 'Declined'].includes(g.status) ? g.status : 'Invited'
  }));

  // Risks validation
  const rawRisks = Array.isArray(raw.risks) ? raw.risks : (fallback.risks || []);
  const normalizedRisks = rawRisks.map((r, i) => ({
    id: typeof r.id === 'string' && r.id ? r.id : `risk-${i + 1}`,
    risk: typeof r.risk === 'string' ? r.risk.slice(0, 150) : 'Operational Risk',
    likelihood: ['High', 'Medium', 'Low'].includes(r.likelihood) ? r.likelihood : 'Medium',
    impact: ['High', 'Medium', 'Low'].includes(r.impact) ? r.impact : 'Medium',
    preventative: typeof r.preventative === 'string' ? r.preventative.slice(0, 300) : '',
    planB: typeof r.planB === 'string' ? r.planB.slice(0, 300) : ''
  }));

  const normalizedEvent = {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `event-${Date.now()}`,
    title,
    eventType,
    tagline,
    date,
    city,
    guestCount,
    totalBudget,
    currency,
    currencySymbol,
    vibe,
    dietary,
    culturalNotes,
    budget: {
      contingencyPercent: sanitizeNumber(raw.budget?.contingencyPercent, 8, 5, 20),
      categories: normalizedCategories
    },
    timeline: normalizedTimeline,
    runOfShow: normalizedRos,
    vendors: normalizedVendors,
    ideas: normalizedIdeas,
    guests: normalizedGuests,
    risks: normalizedRisks,
    isLiveGenerated: Boolean(raw.isLiveGenerated)
  };

  // Derive dynamic readiness score
  normalizedEvent.readinessScore = calculateReadinessScore(normalizedEvent);

  return normalizedEvent;
}
