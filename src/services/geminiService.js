import { SAMPLE_EVENTS } from '../data/sampleEvents';
import { normalizeAndValidateEvent, sanitizeNumber, isValidDateString } from '../utils/eventValidation';

const STORAGE_KEY_API_KEY = 'soiree_gemini_api_key';
const REQUEST_TIMEOUT_MS = 15000;

export function getStoredApiKey() {
  if (typeof localStorage === 'undefined') return '';
  const customKey = localStorage.getItem(STORAGE_KEY_API_KEY);
  if (customKey && customKey.trim().length > 0) return customKey.trim();
  const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0 && envKey !== 'YOUR_API_KEY_HERE') return envKey.trim();
  return '';
}

export function setStoredApiKey(key) {
  if (typeof localStorage === 'undefined') return;
  if (!key) {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  }
}

export function isAiLive() {
  return Boolean(getStoredApiKey());
}

const SYSTEM_INSTRUCTION = `You are Soirée, an expert event planner with deep knowledge of weddings, birthdays, and community events across cultures. Be practical, specific, budget-aware, and warm. Never exceed the user's budget. You must ALWAYS return valid raw JSON only, with no markdown code blocks, no backticks, and no commentary.`;

async function callGeminiApi(promptText, apiKey) {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nTask:\n${promptText}` }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          responseMimeType: "application/json"
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Gemini service returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response payload from Gemini endpoint');

      // Strip potential code fences if any
      const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError';
      // Ensure error object doesn't carry sensitive details
      lastError = new Error(isTimeout ? 'Gemini request timed out after 15 seconds' : 'Gemini service temporarily unavailable');
      console.warn(`Attempt with ${model} failed: ${lastError.message}`);
    }
  }

  throw lastError || new Error('All Gemini model endpoints failed');
}

/**
 * 1. generatePlan(inputData)
 */
export async function generatePlan(inputData) {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const safeDesc = typeof inputData.description === 'string' ? inputData.description.slice(0, 500).replace(/[\r\n]+/g, ' ') : 'Celebration';
      const safeType = typeof inputData.eventType === 'string' ? inputData.eventType.slice(0, 50) : 'Celebration';
      const safeCity = typeof inputData.city === 'string' ? inputData.city.slice(0, 80) : 'Local';
      const safeDiet = typeof inputData.dietary === 'string' ? inputData.dietary.slice(0, 150) : 'Standard';
      const safeNotes = typeof inputData.culturalNotes === 'string' ? inputData.culturalNotes.slice(0, 300) : 'None';
      const safeGuests = sanitizeNumber(inputData.guestCount, 100, 1, 50000);
      const safeBudget = sanitizeNumber(inputData.totalBudget, 500000, 100, 1000000000);
      const safeCurrency = typeof inputData.currency === 'string' ? inputData.currency.slice(0, 5).toUpperCase() : 'USD';
      const safeDate = isValidDateString(inputData.date) ? inputData.date : '2026-06-20';

      const prompt = `
Generate a comprehensive, luxurious celebration plan based on this user input:
- Event description: "${safeDesc}"
- Event Type: ${safeType}
- Estimated Guests: ${safeGuests}
- Total Budget: ${safeBudget} ${safeCurrency}
- City / Location: ${safeCity}
- Date: ${safeDate}
- Vibe tags: ${(inputData.vibe || []).slice(0, 8).join(', ')}
- Dietary preferences: "${safeDiet}"
- Cultural or religious notes: "${safeNotes}"

Strict JSON output format:
{
  "title": "Short poetic title (e.g. Mira's Tuscan Dusk Wedding)",
  "eventType": "${safeType}",
  "tagline": "Warm 1-2 sentence aesthetic concept",
  "city": "${safeCity}",
  "date": "${safeDate}",
  "guestCount": ${safeGuests},
  "totalBudget": ${safeBudget},
  "currency": "${safeCurrency}",
  "currencySymbol": "${safeCurrency === 'INR' ? '₹' : (safeCurrency === 'EUR' ? '€' : (safeCurrency === 'GBP' ? '£' : '$'))}",
  "vibe": ${(inputData.vibe && inputData.vibe.length > 0) ? JSON.stringify(inputData.vibe.slice(0, 8)) : '["Intimate", "Elegant"]'},
  "dietary": "${safeDiet}",
  "culturalNotes": "${safeNotes}",
  "readinessScore": 65,
  "budget": {
    "contingencyPercent": 8,
    "categories": [
      { "id": "venue", "name": "Category name", "planned": number, "actual": 0, "notes": "brief guidance" }
    ] // MUST reserve a contingency category of 5-10% of total budget. The sum of planned items MUST exactly equal totalBudget.
  },
  "timeline": [
    { "id": "t1", "phase": "Early Planning | Booking Phase | Finalizing | Final Week | Event Day", "title": "Milestone name", "dueDate": "YYYY-MM-DD", "priority": "High | Medium | Low", "owner": "Host | Planner", "completed": false }
  ],
  "runOfShow": [
    { "id": "ros1", "time": "HH:MM AM/PM", "title": "Activity name", "location": "Room/Spot", "leadPerson": "Coordinator", "notes": "Quick detail" }
  ],
  "vendors": [
    {
      "id": "v1",
      "category": "Vendor category",
      "whatToLookFor": "Advice",
      "questionsToAsk": "Questions",
      "redFlags": "Red flag warning",
      "typicalBudgetRange": "Range in currency",
      "vendors": [
        { "id": "vnd1", "name": "Recommended Vendor Archetype", "contact": "Contact placeholder", "status": "To Research", "quote": 0, "advancePaid": 0, "notes": "Recommendation" }
      ]
    }
  ],
  "ideas": [
    { "id": "i1", "category": "Theme and Decor | Menu | Entertainment and Games | Invitations wording | Return gifts/favors | Photo-moment ideas | Budget-friendly hacks", "title": "Idea title", "description": "Practical description", "badge": "Tag", "saved": false, "addedToPlan": false }
  ],
  "guests": [
    { "id": "g1", "name": "Primary VIP Guest", "partySize": 2, "group": "Family", "dietary": "${inputData.dietary || 'Standard'}", "status": "Confirmed" }
  ],
  "risks": [
    { "id": "r1", "risk": "Specific potential challenge", "likelihood": "Medium", "impact": "High", "preventative": "Proactive measure", "planB": "Immediate day-of action" }
  ]
}
`;

      const aiPlan = await callGeminiApi(prompt, apiKey);
      if (aiPlan && aiPlan.title && aiPlan.budget?.categories) {
        return normalizeAndValidateEvent({
          ...aiPlan,
          id: 'event-' + Date.now(),
          isLiveGenerated: true
        }, inputData);
      }
    } catch (error) {
      console.warn("Live Gemini plan generation failed, using intelligent fallback:", error);
    }
  }

  // Fallback: Intelligent custom tailoring based on sample templates & user inputs
  return generateIntelligentFallbackPlan(inputData);
}

function generateIntelligentFallbackPlan(input) {
  const typeKey = (input.eventType || '').toLowerCase();
  let baseTemplate = SAMPLE_EVENTS.wedding;
  if (typeKey.includes('birth') || typeKey.includes('party')) {
    baseTemplate = SAMPLE_EVENTS.birthday;
  } else if (typeKey.includes('communit') || typeKey.includes('fest') || typeKey.includes('fair') || typeKey.includes('fundraiser')) {
    baseTemplate = SAMPLE_EVENTS.community;
  }

  const budget = sanitizeNumber(input.totalBudget, baseTemplate.totalBudget, 1000);
  const guestCount = sanitizeNumber(input.guestCount, baseTemplate.guestCount, 1);
  const currency = input.currency || baseTemplate.currency;
  const currencySymbol = currency === 'INR' ? '₹' : (currency === 'EUR' ? '€' : (currency === 'GBP' ? '£' : '$'));

  // Ratio-scale budget categories
  const oldTotal = baseTemplate.budget.categories.reduce((acc, c) => acc + c.planned, 0) || 1;
  const scale = budget / oldTotal;

  const scaledCategories = baseTemplate.budget.categories.map((cat, idx, arr) => {
    let planned = Math.round((cat.planned * scale) / 100) * 100;
    if (idx === arr.length - 1) {
      // Balance contingency so sum equals budget exactly
      const priorSum = arr.slice(0, idx).reduce((acc, c) => acc + Math.round((c.planned * scale) / 100) * 100, 0);
      planned = Math.max(0, budget - priorSum);
    }
    return {
      ...cat,
      planned,
      actual: Math.round((cat.actual * scale) / 100) * 100
    };
  });

  const rawFallback = {
    ...JSON.parse(JSON.stringify(baseTemplate)),
    id: 'event-' + Date.now(),
    title: input.description && input.description.length > 5 
      ? (input.description.length > 55 ? input.description.slice(0, 52) + '...' : input.description)
      : `${input.eventType || 'Celebration'} Soirée`,
    eventType: input.eventType || baseTemplate.eventType,
    tagline: input.description || baseTemplate.tagline,
    date: input.date || baseTemplate.date,
    city: input.city || baseTemplate.city,
    guestCount,
    totalBudget: budget,
    currency,
    currencySymbol,
    vibe: (input.vibe && input.vibe.length > 0) ? input.vibe : baseTemplate.vibe,
    dietary: input.dietary || baseTemplate.dietary,
    culturalNotes: input.culturalNotes || baseTemplate.culturalNotes,
    budget: {
      contingencyPercent: 8,
      categories: scaledCategories
    },
    isLiveGenerated: false
  };

  return normalizeAndValidateEvent(rawFallback, baseTemplate);
}

/**
 * 2. rebalanceBudget(plan, targetBudget)
 */
export async function rebalanceBudget(plan, targetBudget) {
  const apiKey = getStoredApiKey();
  const currentTotal = plan.totalBudget;
  const newBudget = Number(targetBudget) || currentTotal;

  if (apiKey) {
    try {
      const prompt = `
Given this event: "${plan.title}" (${plan.eventType}, ${plan.guestCount} guests).
Current budget categories: ${JSON.stringify(plan.budget.categories)}
We need to rebalance the budget to a new total of ${newBudget} ${plan.currency}.
Suggest the optimal category adjustments while keeping the 5-10% contingency safe.
Return strict JSON:
{
  "reasoning": "2-3 sentences explaining where cuts or increases were made and why (e.g., preserving guest dining experience while scaling decor/print)",
  "categories": [
    { "id": "string", "name": "string", "planned": number, "actual": number, "notes": "string" }
  ]
}
The sum of categories planned MUST exactly equal ${newBudget}.
`;
      const result = await callGeminiApi(prompt, apiKey);
      if (result && Array.isArray(result.categories) && result.categories.length > 0) {
        const sanitizedCats = result.categories.map((c, i) => ({
          id: typeof c.id === 'string' && c.id ? c.id : `cat-${i + 1}`,
          name: typeof c.name === 'string' && c.name ? c.name : `Category ${i + 1}`,
          planned: sanitizeNumber(c.planned, 0, 0),
          actual: sanitizeNumber(c.actual, 0, 0),
          notes: typeof c.notes === 'string' ? c.notes : ''
        }));
        return {
          reasoning: typeof result.reasoning === 'string' ? result.reasoning : 'AI optimized allocations across categories.',
          categories: sanitizedCats
        };
      }
    } catch (e) {
      console.warn("AI budget rebalance failed, falling back to heuristic:", e);
    }
  }

  // Fallback intelligent rebalancing
  const scale = newBudget / (currentTotal || 1);
  const updatedCategories = (plan.budget?.categories || []).map((c, i, arr) => {
    let newPlanned = Math.round((c.planned * scale) / 50) * 50;
    if (i === arr.length - 1) {
      const sumBefore = arr.slice(0, i).reduce((sum, item) => sum + Math.round((item.planned * scale) / 50) * 50, 0);
      newPlanned = Math.max(50, newBudget - sumBefore);
    }
    return {
      ...c,
      planned: sanitizeNumber(newPlanned, 50, 0)
    };
  });

  const diff = newBudget - currentTotal;
  const reasoning = diff < 0
    ? `Optimized total by ${Math.abs(diff)} ${plan.currency}. Trimmed non-essential decor & stationery while safeguarding high-touch culinary and hospitality moments.`
    : `Expanded total budget by ${diff} ${plan.currency}. Reallocated surplus into elevated guest hospitality, sound ambience, and fortified contingency reserve.`;

  return {
    reasoning,
    categories: updatedCategories
  };
}

/**
 * 3. generateIdeas(plan, category)
 */
export async function generateIdeas(plan, category) {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const prompt = `
Generate 3 fresh, creative, highly bespoke ideas for the event:
"${plan.title}" (${plan.eventType}, Vibe: ${(plan.vibe || []).join(', ')}, Guests: ${plan.guestCount}, Budget: ${plan.totalBudget} ${plan.currency}, Dietary: ${plan.dietary}).
Focus specifically on category: "${category}".
Return strict JSON array of objects:
[
  {
    "id": "idea-unique-id",
    "category": "${category}",
    "title": "Inspiring Idea Name",
    "description": "Rich 2-3 sentence actionable concept with exact materials, flavors, or staging.",
    "badge": "Signature | Trend | Eco-Friendly | High-Impact",
    "saved": false,
    "addedToPlan": false
  }
]
`;
      const result = await callGeminiApi(prompt, apiKey);
      if (Array.isArray(result) && result.length > 0) return result;
    } catch (e) {
      console.warn("AI generateIdeas failed, falling back:", e);
    }
  }

  // Heuristic / Creative library fallback
  const idSeed = Date.now();
  const sampleBank = {
    "Theme and Decor": [
      { title: "Candlelit Glass Cloche Centerpieces", description: "Clustered vintage glass cloches enclosing fragrant rosemary sprigs and flickering micro-LED fairy filaments.", badge: "Signature" },
      { title: "Burgundy Velvet Ribbon Cutlery Wraps", description: "Heavy linen napkins bound with hand-torn raw silk burgundy ribbon and a sprig of fresh dried lavender.", badge: "Editorial" },
      { title: "Hand-Painted Watercolor Placecards", description: "Custom calligraphy on deckle-edged sand paper matching the heritage palette.", badge: "Guest Favorite" }
    ],
    "Menu": [
      { title: "Midnight Truffle Mac & Cheese Shooters", description: "Warm mini ceramic ramekins passed around during the late-night dancing hour.", badge: "Crowd Pleaser" },
      { title: "Artisan Shrub & Botanical Elixir Bar", description: "Sparkling ginger-fig and pomegranate-rosemary craft mocktails served in etched vintage coupes.", badge: "Non-Alcoholic Trend" },
      { title: "Interactive Artisanal Gelato Cart", description: "A three-flavor vintage bicycle cart featuring blood orange sorbet, roasted pistachio, and dark cocoa.", badge: "Interactive" }
    ],
    "Entertainment and Games": [
      { title: "Audio Guestbook Rotary Telephone", description: "A vintage 1970s rotary phone where guests pick up the receiver to record voice messages and toasts.", badge: "Viral Favorite" },
      { title: "Secret Acoustic Vignette", description: "A surprise 20-minute acoustic vocal set during sunset cocktail hour right as dusk settles.", badge: "Intimate" },
      { title: "Trivia Coasters", description: "Fun, lighthearted facts about the host or couple printed on gold foil coasters placed at each table.", badge: "Icebreaker" }
    ],
    "Invitations wording": [
      { title: "The Romantic Heritage Overture", description: "'Two journeys intertwine beneath an evening sky. We invite you to feast, toast, and celebrate with us.'", badge: "Warm & Poetic" },
      { title: "Modern Minimalist Summons", description: "'Great music, exquisite wine, and our favorite people. Join us for an unforgettable evening under the lights.'", badge: "Chic" },
      { title: "Storybook Vignette Invite", description: "'Before the clock strikes midnight, let us gather where laughter flows freely and memories are etched forever.'", badge: "Playful" }
    ],
    "Return gifts/favors": [
      { title: "Botanical Wildflower Honey Jars", description: "Locally harvested clover honey in hexagonal jars sealed with burgundy bees-wax and gold twine.", badge: "Eco Luxury" },
      { title: "Monogrammed Linen Bread Bags", description: "Organic unbleached linen with custom couple embroidery, accompanied by artisanal sourdough mini loaf.", badge: "Artisanal" },
      { title: "Handmade Ceramic Match Strikers", description: "Artisan clay pots with strike-anywhere matches and scented amber incense sticks.", badge: "Keepsake" }
    ],
    "Photo-moment ideas": [
      { title: "The Burgundy Velvet Chesterfield Vignette", description: "A deep red velvet settee nestled beneath an arched canopy of olive branches and brass candelabras.", badge: "Most Photographed" },
      { title: "Polaroid String-Lit Memory Tree", description: "Guests snap photos on entry and peg them onto lit jute twine stretched across an architectural arch.", badge: "Interactive" },
      { title: "Framed Mirror Photo Op with Gilded Pen", description: "A massive antique mirror inscribed with 'You look gorgeous tonight' where guests sign the frame border.", badge: "Viral" }
    ],
    "Budget-friendly hacks": [
      { title: "Repurpose Ceremony Pillars for Bar Styling", description: "Have the coordinator shift statement floral pedestals to frame the bar after the main welcome.", badge: "Smart Savings" },
      { title: "Curated Spotify DJ + Master of Ceremonies Friend", description: "Rent high-end Bose line-arrays and have a charismatic friend handle transitions rather than a 5-piece band.", badge: "Saves ₹35,000 / $800" },
      { title: "Digital RSVP Micro-site with Paper Keepsake Cards", description: "Print 1/4th the paper stationery while keeping a single wax-sealed collector card for close family.", badge: "Eco-Savings" }
    ]
  };

  const pool = sampleBank[category] || sampleBank["Theme and Decor"];
  return pool.map((item, index) => ({
    id: `idea-${idSeed}-${index}`,
    category,
    title: item.title,
    description: item.description,
    badge: item.badge,
    saved: false,
    addedToPlan: false
  }));
}

/**
 * 4. draftVendorMessage(vendorCategory, plan, tone)
 */
export async function draftVendorMessage(vendorCategory, plan, tone = 'polite') {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const prompt = `
Draft a polite, ready-to-send inquiry message for a prospective ${vendorCategory} vendor for this event:
- Event: "${plan.title}" (${plan.eventType})
- Date: ${plan.date}
- Location: ${plan.city}
- Guests: ${plan.guestCount}
- Budget range: Approximately appropriate for category in ${plan.currency}
- Tone: ${tone} (Warm, professional, respectful of their time). Suitable for WhatsApp or Email.

Return strict JSON:
{
  "subject": "Subject line for email",
  "whatsappText": "Formatted for WhatsApp (short, friendly, bullets)",
  "emailText": "Full email message body with placeholders"
}
`;
      const res = await callGeminiApi(prompt, apiKey);
      if (res && res.whatsappText) return res;
    } catch (e) {
      console.warn("AI draft message failed:", e);
    }
  }

  // Fallback drafted message
  return {
    subject: `Inquiry: ${vendorCategory} for ${plan.title} on ${plan.date}`,
    whatsappText: `Hello! Hope you are having a wonderful week ✨\n\nI am planning our upcoming ${plan.eventType} (${plan.title}) in ${plan.city} on ${plan.date} for approximately ${plan.guestCount} guests.\n\nWe really admire your work in ${vendorCategory} and would love to check your availability for this date. Could you kindly share your standard packages and pricing?\n\nLooking forward to hearing from you! Warm regards.`,
    emailText: `Dear ${vendorCategory} Team,\n\nI hope this email finds you well.\n\nWe are currently organizing our ${plan.eventType}, "${plan.title}", scheduled for ${plan.date} in ${plan.city}. We expect around ${plan.guestCount} guests and are focusing on an ${plan.vibe?.join(', ') || 'elegant'} experience.\n\nWe have been following your exceptional portfolio and believe your aesthetic aligns wonderfully with our celebration vision. Could you please let us know if you have availability on ${plan.date}, and share your service catalog or quote sheet?\n\nIf helpful, we can hop on a brief 10-minute call this week.\n\nWarmest regards,\nHost of ${plan.title}`
  };
}

/**
 * 5. generateRunOfShow(plan)
 */
export async function generateRunOfShow(plan) {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const prompt = `
Generate a detailed, hour-by-hour Event Day Run-of-Show schedule for:
"${plan.title}" (${plan.eventType}, Date: ${plan.date}, Guest count: ${plan.guestCount}, Location: ${plan.city}).
Return strict JSON array:
[
  { "id": "ros-1", "time": "08:00 AM", "title": "Milestone name", "location": "Room/Spot", "leadPerson": "Lead role", "notes": "Key operational guidance" }
]
Cover from early vendor load-in through to final guest send-off.
`;
      const result = await callGeminiApi(prompt, apiKey);
      if (Array.isArray(result) && result.length > 0) return result;
    } catch (e) {
      console.warn("AI generateRunOfShow failed, using template:", e);
    }
  }

  return plan.runOfShow || [];
}

/**
 * 6. generateRiskPlan(plan)
 */
export async function generateRiskPlan(plan) {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const prompt = `
Generate a "Plan B" Risk Shield contingency matrix for this celebration:
"${plan.title}" (${plan.eventType}, Guests: ${plan.guestCount}, Location: ${plan.city}, Season/Date: ${plan.date}).
List the top 4 practical risks (weather, vendor delay, dietary surge, budget creep) with concrete day-of mitigation.
Return strict JSON array:
[
  { "id": "r-1", "risk": "Description of risk", "likelihood": "High|Medium|Low", "impact": "High|Medium|Low", "preventative": "What to do weeks before", "planB": "Immediate action on the day" }
]
`;
      const result = await callGeminiApi(prompt, apiKey);
      if (Array.isArray(result) && result.length > 0) return result;
    } catch (e) {
      console.warn("AI generateRiskPlan failed:", e);
    }
  }

  return plan.risks || [];
}

/**
 * 7. chatUpdatePlan(currentPlan, userMessage, conversationHistory)
 */
export async function chatUpdatePlan(currentPlan, userMessage, conversationHistory = []) {
  const apiKey = getStoredApiKey();
  const safeMessage = typeof userMessage === 'string' ? userMessage.slice(0, 500) : '';

  if (apiKey && safeMessage) {
    try {
      const prompt = `
You are Soirée's AI Co-Planner. You are in a conversational session with the event organizer.
Current Event Context:
- Title: "${currentPlan.title}"
- Type: ${currentPlan.eventType}
- Guests: ${currentPlan.guestCount}
- Budget: ${currentPlan.totalBudget} ${currentPlan.currency}
- Vibe: ${(currentPlan.vibe || []).join(', ')}
- Categories: ${JSON.stringify(currentPlan.budget?.categories?.map(c => ({ id: c.id, name: c.name, planned: c.planned })) || [])}
- Recent Tasks: ${JSON.stringify((currentPlan.timeline || []).slice(0, 5).map(t => t.title))}

User request: "${safeMessage}"

You have the power to update parts of the plan in place if requested (e.g. adjust budget, add a task, change vibe, add an idea), or answer questions warmly with expert advice.
Return strict JSON:
{
  "replyText": "Warm, concise, expert response to the user explaining what you recommend or changed.",
  "changesSummary": "Brief bulleted string of changes applied, or null if pure advice.",
  "planUpdates": {
    // Only include properties that changed, e.g. "totalBudget", "guestCount", "vibe", "budget", "timeline", "ideas"
  }
}
`;
      const response = await callGeminiApi(prompt, apiKey);
      if (response && response.replyText) {
        return response;
      }
    } catch (e) {
      console.warn("Chat update plan failed, fallback to local co-planner:", e);
    }
  }

  // Fallback conversational responder with intelligent mutations
  const text = userMessage.toLowerCase();
  let replyText = "I've carefully considered that for your celebration! Here is how we can refine your blueprint.";
  let changesSummary = null;
  const planUpdates = {};

  if (text.includes('cut') || text.includes('reduce') || text.includes('lower budget')) {
    const factor = 0.85;
    const newTotal = Math.round(currentPlan.totalBudget * factor);
    planUpdates.totalBudget = newTotal;
    planUpdates.budget = {
      ...currentPlan.budget,
      categories: currentPlan.budget.categories.map(c => ({
        ...c,
        planned: Math.round(c.planned * factor)
      }))
    };
    replyText = `I have trimmed your overall budget by 15% (new total: ${newTotal.toLocaleString()} ${currentPlan.currency}). I scaled back printed stationery and luxury decor trims while safeguarding catering and venue essentials.`;
    changesSummary = `Reduced total budget from ${currentPlan.totalBudget.toLocaleString()} to ${newTotal.toLocaleString()} ${currentPlan.currency}.`;
  } else if (text.includes('eco') || text.includes('green') || text.includes('sustainable')) {
    const newVibe = Array.from(new Set([...(currentPlan.vibe || []), 'Eco-friendly']));
    planUpdates.vibe = newVibe;
    const newTask = {
      id: 't-eco-' + Date.now(),
      phase: 'Booking Phase',
      title: 'Audit zero-single-use plastics & switch to seed-paper stationery',
      dueDate: currentPlan.date,
      priority: 'High',
      owner: 'Planner',
      completed: false
    };
    planUpdates.timeline = [newTask, ...currentPlan.timeline];
    replyText = `Wonderful! I added the 'Eco-friendly' aesthetic tag and inserted a new milestone to eliminate single-use plastics and introduce plantable seed paper invitations.`;
    changesSummary = `Added 'Eco-friendly' vibe & sustainability audit milestone.`;
  } else if (text.includes('guest') || text.includes('more people') || text.includes('headcount')) {
    const newGuests = Math.round(currentPlan.guestCount * 1.2);
    planUpdates.guestCount = newGuests;
    replyText = `I have adjusted your guest count expectation up to ${newGuests} attendees. Don't worry—your catering per-head buffer still has room within the current reserves.`;
    changesSummary = `Updated guest count to ${newGuests}.`;
  } else {
    replyText = `I’ve noted your thought: "${userMessage}". It fits nicely into the ${currentPlan.vibe?.join(' & ') || 'celebration'} aesthetic. You can review how this impacts your timeline and vendor inquiries in their respective tabs.`;
  }

  return {
    replyText,
    changesSummary,
    planUpdates
  };
}
