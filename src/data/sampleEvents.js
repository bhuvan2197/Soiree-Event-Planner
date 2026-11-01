export const SAMPLE_EVENTS = {
  wedding: {
    id: "sample-wedding",
    title: "Aarav & Meera’s Royal Courtyard Engagement",
    eventType: "Engagement",
    tagline: "An intimate, candlelit dusk celebration blending heritage Rajasthani elegance with contemporary warmth.",
    date: "2026-03-28",
    city: "Jaipur / Heritage Resort",
    guestCount: 120,
    totalBudget: 800000,
    currency: "INR",
    currencySymbol: "₹",
    vibe: ["Intimate", "Traditional", "Elegant"],
    dietary: "Strictly Vegetarian (Gourmet regional Rajasthani & modern fusion)",
    culturalNotes: "Traditional Marwari Roka exchange at twilight followed by acoustic Sufi folk music under banyan fairy lights.",
    readinessScore: 68,
    budget: {
      contingencyPercent: 8,
      categories: [
        { id: "venue", name: "Heritage Haveli Courtyard & Lawn", planned: 240000, actual: 235000, notes: "Includes heritage lighting and courtyard stage setup" },
        { id: "catering", name: "Artisanal Vegetarian Feast & Chaat Bar", planned: 220000, actual: 215000, notes: "7-course royal thali style + artisanal mocktail bar" },
        { id: "decor", name: "Marigold, Tuberose & Brass Lantern Decor", planned: 110000, actual: 125000, notes: "Low seating diwans with mirrorwork cushions" },
        { id: "photography", name: "Fine-Art Candid Photo & Cinematic Reel", planned: 75000, actual: 70000, notes: "2 photographers + 1 dedicated social reel creator" },
        { id: "entertainment", name: "Acoustic Sufi Duo & Folk Musicians", planned: 45000, actual: 45000, notes: "Sitar & flute welcome + evening Sufi singer" },
        { id: "attire", name: "Heritage Ensembles & Turban Tie Artist", planned: 30000, actual: 25000, notes: "Ivory & burgundy safas for family" },
        { id: "invitations", name: "Wax-Sealed Deckle Edge Paper Invites", planned: 16000, actual: 14500, notes: "Custom calligraphy + interactive WhatsApp video invite" },
        { id: "favors", name: "Silver Mint Boxes & Attar Perfume Vials", planned: 20000, actual: 18000, notes: "Handmade scented vetiver & rose botanical attar" },
        { id: "contingency", name: "Unforeseen Weather & Overtime Buffer", planned: 44000, actual: 0, notes: "Reserved safety buffer (5-10%)" }
      ]
    },
    timeline: [
      { id: "t1", phase: "Early Planning", title: "Finalize heritage courtyard contract & deposit", dueDate: "2025-12-10", priority: "High", owner: "Aarav", completed: true },
      { id: "t2", phase: "Early Planning", title: "Lock vegetarian caterer menu tasting session", dueDate: "2025-12-20", priority: "High", owner: "Meera", completed: true },
      { id: "t3", phase: "Booking Phase", title: "Book candid documentary photographer & drone pilot", dueDate: "2026-01-15", priority: "High", owner: "Aarav", completed: true },
      { id: "t4", phase: "Booking Phase", title: "Contract Sufi acoustic vocalist & traditional nagada welcome", dueDate: "2026-01-25", priority: "Medium", owner: "Planner", completed: true },
      { id: "t5", phase: "Booking Phase", title: "Design bespoke wax-seal paper suite & WhatsApp micro-site", dueDate: "2026-02-05", priority: "Medium", owner: "Meera", completed: true },
      { id: "t6", phase: "Finalizing", title: "Source 120 custom Gulab attar vials & embroidered favor pouches", dueDate: "2026-02-28", priority: "Low", owner: "Family", completed: false },
      { id: "t7", phase: "Finalizing", title: "Review lighting scheme: 150 brass lanterns & floating lotus candles", dueDate: "2026-03-10", priority: "Medium", owner: "Planner", completed: false },
      { id: "t8", phase: "Final Week", title: "Finalize dietary counts (Jain vs Vegan requirements)", dueDate: "2026-03-22", priority: "High", owner: "Meera", completed: false },
      { id: "t9", phase: "Final Week", title: "Run-of-show walkthrough with ring bearer & emcee", dueDate: "2026-03-25", priority: "Medium", owner: "Aarav", completed: false },
      { id: "t10", phase: "Event Day", title: "Haveli flower setup inspection & sound acoustic check", dueDate: "2026-03-28", priority: "High", owner: "Planner", completed: false }
    ],
    runOfShow: [
      { id: "ros1", time: "03:30 PM", title: "Vendor Setup & Floral Mandap Delivery", location: "Courtyard", leadPerson: "Florist / Coordinator", notes: "Check freshness of marigolds and placement of Diwans." },
      { id: "ros2", time: "05:00 PM", title: "Guest Welcome & Shehnai/Flute Welcome Drinks", location: "Haveli Foyer", leadPerson: "Host Family", notes: "Serve chilled Khas-Khus sherbet & saffron almond thandai." },
      { id: "ros3", time: "06:15 PM", title: "Sunset Ring Exchange & Floral Shower", location: "Central Stepwell Stage", leadPerson: "Priest & Siblings", notes: "Petal cannons timed right at ring slide; acoustic sitar crescendos." },
      { id: "ros4", time: "07:00 PM", title: "Cocktail Hours & Live Chaat Stations", location: "Lawn Veranda", leadPerson: "Caterer", notes: "Live Lucknowi tokri chaat & wood-fired stuffed kulchas." },
      { id: "ros5", time: "08:15 PM", title: "Acoustic Sufi Musical Night & Family Speeches", location: "Main Stage", leadPerson: "Vocalist / Aarav", notes: "3 short family toasts (max 4 min each), open seating under lights." },
      { id: "ros6", time: "09:30 PM", title: "Royal Sit-Down Dinner & Mithai Station", location: "Dining Courtyard", leadPerson: "Banquet Captain", notes: "Warm Ghevar & Malpua served live with rabdi." },
      { id: "ros7", time: "11:00 PM", title: "Attar Favor Gifting & Farewell Sent-off", location: "Departure Gate", leadPerson: "Parents", notes: "Handing out wax-sealed favor boxes to guests." }
    ],
    vendors: [
      {
        id: "v-cat-venue",
        category: "Venue",
        whatToLookFor: "Acoustic curfew hours, generator backup, green rooms, outside caterer royalty rules.",
        questionsToAsk: "Does the booking include courtyard lighting? What is the rain backup hall capacity?",
        redFlags: "Hidden mandatory decor vendor lock-ins with 25% surcharge.",
        typicalBudgetRange: "₹2,00,000 – ₹3,00,000",
        vendors: [
          { id: "vnd1", name: "Royal Bagh Heritage Haveli", contact: "+91 98290 11223", status: "Booked", quote: 235000, advancePaid: 100000, notes: "Courtyard + 4 deluxe bridal suites included" }
        ]
      },
      {
        id: "v-cat-catering",
        category: "Catering",
        whatToLookFor: "Distinct Jain/Garlic-free prep stations, live counter efficiency, staff uniform polish.",
        questionsToAsk: "Can you accommodate 25 strictly Jain guests without cross contamination?",
        redFlags: "Inability to provide on-site live food warmer setups during outdoor evening chill.",
        typicalBudgetRange: "₹1,400 – ₹1,800 per plate",
        vendors: [
          { id: "vnd2", name: "Saffron Royal Banquets", contact: "+91 94140 88761", status: "Booked", quote: 215000, advancePaid: 80000, notes: "All-inclusive tasting verified on Dec 20" }
        ]
      },
      {
        id: "v-cat-decor",
        category: "Decor & Florals",
        whatToLookFor: "Eco-friendly floral foam alternatives, real brass urns vs painted plastic.",
        questionsToAsk: "Will the floral arches be set up 3 hours prior to guest arrival to avoid wilting?",
        redFlags: "Using synthetic plastic garlands without prior disclosure.",
        typicalBudgetRange: "₹90,000 – ₹1,30,000",
        vendors: [
          { id: "vnd3", name: "Petals & Parchment Atelier", contact: "+91 99281 44556", status: "Quote received", quote: 125000, advancePaid: 0, notes: "Awaiting final mock-up sketch for stage backdrop" }
        ]
      },
      {
        id: "v-cat-photo",
        category: "Photography",
        whatToLookFor: "Mastery in twilight natural light & candid non-posed emotion captures.",
        questionsToAsk: "What is your turnaround time for the 60-second teaser reel for Instagram?",
        redFlags: "No second shooter included in package.",
        typicalBudgetRange: "₹60,000 – ₹85,000",
        vendors: [
          { id: "vnd4", name: "Candid Stories by Varun", contact: "+91 97841 33219", status: "Booked", quote: 70000, advancePaid: 35000, notes: "Delivering teaser within 48 hours" }
        ]
      }
    ],
    ideas: [
      { id: "i1", category: "Theme and Decor", title: "Sunset Brass & Tuberose Installation", description: "Cluster antique brass urulis filled with floating lotus buds and 400 hand-poured beeswax candles around the central fountain.", badge: "Guest Favorite", saved: true, addedToPlan: true },
      { id: "i2", category: "Menu", title: "Artisanal Regional Chaat Flights", description: "Three mini tastings: Palak patta chaat, smoked dal pakodi with plum chutney, and saffron rabdi jalebi skewers.", badge: "Signature Dish", saved: true, addedToPlan: true },
      { id: "i3", category: "Entertainment and Games", title: "The 'How Well Do They Know Each Other' Heritage Quiz", description: "A witty 10-question trivia game host-led before dinner with a brass trophy for the winning table.", badge: "Interactive", saved: false, addedToPlan: false },
      { id: "i4", category: "Invitations wording", title: "Wax-Sealed Parchment with Poetic Urdu Couplet", description: "'Under twilight skies and ancient arches, join us as two stories become one...' Printed in burgundy ink on handmade deckle paper.", badge: "Editorial", saved: true, addedToPlan: true },
      { id: "i5", category: "Return gifts/favors", title: "Hand-blended Khus & Rose Attar Vials", description: "Bespoke 10ml crystal flacons stamped with couple's monogram wax seal, sourced from Kannauj perfumers.", badge: "Bespoke", saved: true, addedToPlan: true },
      { id: "i6", category: "Photo-moment ideas", title: "Bougainvillea Arch with Vintage Mirror Seating Chart", description: "Calligraphed antique mirror surrounded by deep magenta and ivory bougainvillea.", badge: "Viral Photo Spot", saved: false, addedToPlan: false },
      { id: "i7", category: "Budget-friendly hacks", title: "Transition Ceremony Florals to Evening Dinner Tables", description: "Use modular floral urns that can be moved by coordinators in 10 minutes from stage to banquet tables, saving ₹25,000.", badge: "Smart Savings", saved: true, addedToPlan: true }
    ],
    guests: [
      { id: "g1", name: "Vikram & Sunita Singhania", partySize: 2, group: "Family", dietary: "Vegetarian", status: "Confirmed" },
      { id: "g2", name: "Ananya Sharma & Guest", partySize: 2, group: "Close Friends", dietary: "Jain Vegetarian", status: "Confirmed" },
      { id: "g3", name: "Devansh Mehta", partySize: 1, group: "Close Friends", dietary: "Vegetarian", status: "Confirmed" },
      { id: "g4", name: "Rajiv & Pratibha Agarwal", partySize: 4, group: "Family", dietary: "Vegetarian", status: "Confirmed" },
      { id: "g5", name: "Kunal Kapoor", partySize: 1, group: "Colleagues", dietary: "Vegan", status: "Invited" },
      { id: "g6", name: "Dr. Arvind Joshi", partySize: 2, group: "VIP", dietary: "Jain Vegetarian", status: "Confirmed" },
      { id: "g7", name: "Pooja & Rohan Sen", partySize: 2, group: "Close Friends", dietary: "Vegetarian", status: "Declined" }
    ],
    risks: [
      { id: "r1", risk: "Sudden evening unseasonal rain shower", likelihood: "Medium", impact: "High", preventative: "Reserve Haveli inner glass hall as pre-cleared rain backup with identical seating capacity.", planB: "Lighting tech moves lanterns under colonnaded verandahs within 12 minutes." },
      { id: "r2", risk: "Acoustic volume curfew at 10:00 PM by local authorities", likelihood: "High", impact: "Medium", preventative: "Schedule folk band from 7:00 PM to 9:45 PM; switch to ambient indoor acoustic music inside the salon.", planB: "Move late-night desserts into enclosed darbar hall." },
      { id: "r3", risk: "Over-budget due to last-minute out-of-town guest accommodations", likelihood: "Medium", impact: "Medium", preventative: "Set a strict RSVP deadline 14 days prior; block fixed room allocation only.", planB: "Draw from designated ₹44,000 contingency reserve." },
      { id: "r4", risk: "Outdoor dusk humidity wilting delicate floral decor", likelihood: "Low", impact: "Medium", preventative: "Use hardier flora (tuberose, marigold, local jasmine) instead of imported hydrangeas.", planB: "Keep backup floral sprays in air-conditioned storage till 4:30 PM." }
    ]
  },

  birthday: {
    id: "sample-birthday",
    title: "Maya’s 30th Velvet & Vinyl Rooftop Soirée",
    eventType: "Birthday",
    tagline: "A moody, glamorous rooftop gathering celebrating milestone thirty with warm vinyl grooves, curated natural wines, and custom cocktail pairings.",
    date: "2026-05-16",
    city: "Brooklyn, NY",
    guestCount: 45,
    totalBudget: 4500,
    currency: "USD",
    currencySymbol: "$",
    vibe: ["Modern", "Fun", "Intimate"],
    dietary: "Gluten-free friendly, Mediterranean tapas, artisanal dairy & non-alcoholic zero-proof options",
    culturalNotes: "No traditional awkward birthday songs; emphasis on great music, cozy lounge vignettes, and disposable camera memories.",
    readinessScore: 75,
    budget: {
      contingencyPercent: 8,
      categories: [
        { id: "venue", name: "Loft Rooftop Rental with Manhattan View", planned: 1600, actual: 1600, notes: "Private access 5 PM to 12 AM" },
        { id: "catering", name: "Mediterranean Mezze Grazing & Sliders", planned: 1100, actual: 1050, notes: "Mezze table, lamb & halloumi sliders" },
        { id: "drinks", name: "Natural Wine Bar & Signature Spritzes", planned: 650, actual: 600, notes: "Orange wine, Pet-Nat, and bespoke rosemary spritz" },
        { id: "cake", name: "Vintage Heart Lambeth Buttercream Cake", planned: 220, actual: 240, notes: "Espresso chocolate mousse with cherry glaze" },
        { id: "decor", name: "Velvet Drapery, Disco Orbs & Burgundy Florals", planned: 350, actual: 380, notes: "Deep burgundy dahlias and mirror ball reflections" },
        { id: "music", name: "Vinyl DJ Set & Turntable Rental", planned: 350, actual: 350, notes: "70s disco, French funk & neo-soul" },
        { id: "favors", name: "Mini Matchboxes & Custom Mixtape Cassettes", planned: 90, actual: 80, notes: "Custom Spotify QR tape matchbox favors" },
        { id: "contingency", name: "Weather Canopy & Breakage Deposit", planned: 140, actual: 0, notes: "Safety buffer for unexpected rooftop heaters" }
      ]
    },
    timeline: [
      { id: "t1", phase: "Early Planning", title: "Reserve boutique rooftop loft with skyline backdrop", dueDate: "2026-03-01", priority: "High", owner: "Maya", completed: true },
      { id: "t2", phase: "Booking Phase", title: "Order bespoke Lambeth piping vintage cake", dueDate: "2026-03-20", priority: "Medium", owner: "Maya", completed: true },
      { id: "t3", phase: "Booking Phase", title: "Contract Vinyl DJ for 4-hour evening set", dueDate: "2026-04-05", priority: "High", owner: "Co-host", completed: true },
      { id: "t4", phase: "Finalizing", title: "Curate natural wine selection with local bottle shop", dueDate: "2026-04-20", priority: "Medium", owner: "Maya", completed: true },
      { id: "t5", phase: "Final Week", title: "Pick up 40 custom branded retro matchboxes & 10 disposable cameras", dueDate: "2026-05-10", priority: "Low", owner: "Best Friend", completed: false },
      { id: "t6", phase: "Event Day", title: "Ice delivery & bar garnish setup (charred rosemary, dehydrated citrus)", dueDate: "2026-05-16", priority: "High", owner: "Co-host", completed: false }
    ],
    runOfShow: [
      { id: "ros1", time: "05:30 PM", title: "Rooftop Styling & Grazing Board Installation", location: "Rooftop Terrace", leadPerson: "Coordinator & Florist", notes: "Set up burgundy linens and fairy lights" },
      { id: "ros2", time: "06:30 PM", title: "Golden Hour Arrival & Welcoming Spritz", location: "Lounge Area", leadPerson: "Host", notes: "Hand guests disposable cameras and signature spritz" },
      { id: "ros3", time: "07:45 PM", title: "Vinyl DJ Sets the Mood & Hot Sliders Served", location: "DJ Booth & Food Bar", leadPerson: "DJ Leo", notes: "Transition into upbeat funk and French house" },
      { id: "ros4", time: "09:15 PM", title: "Surprise Toast & Vintage Lambeth Cake Cutting", location: "Center Lounge", leadPerson: "Friends", notes: "Sparkler candles lit, champagne tower toast" },
      { id: "ros5", time: "10:30 PM", title: "Late Night Dancing Under the Skyline", location: "Deck", leadPerson: "DJ", notes: "Serve mini warm churros with spiced chocolate" },
      { id: "ros6", time: "12:00 AM", title: "Wrap-up & Camera Collection", location: "Exit", leadPerson: "Co-host", notes: "Collect disposable cameras for darkroom development" }
    ],
    vendors: [
      {
        id: "v-cat-venue",
        category: "Venue",
        whatToLookFor: "Rain canopy options, sound permit, elevator access for load-in.",
        questionsToAsk: "Is there a service elevator for DJ equipment and ice bins?",
        redFlags: "Strict noise fines after 10 PM without advance disclosure.",
        typicalBudgetRange: "$1,400 – $1,800",
        vendors: [
          { id: "vnd1", name: "DUMBO Skyline Loft", contact: "events@dumboloft.com", status: "Booked", quote: 1600, advancePaid: 800, notes: "Includes terrace lounge furniture & string lighting" }
        ]
      },
      {
        id: "v-cat-cake",
        category: "Bakery / Cake Designer",
        whatToLookFor: "Structural integrity of tiered cakes in warm May weather.",
        questionsToAsk: "Can you recreate Victorian Lambeth piping with deep burgundy lettering?",
        redFlags: "Fondant-heavy recipes that taste dry.",
        typicalBudgetRange: "$200 – $300",
        vendors: [
          { id: "vnd2", name: "Sweet Poison Pastry Studio", contact: "+1 (917) 555-0199", status: "Booked", quote: 240, advancePaid: 120, notes: "Dark chocolate espresso buttercream with cherry accents" }
        ]
      }
    ],
    ideas: [
      { id: "i1", category: "Theme and Decor", title: "Burgundy Velvet & Amber Candle Vignettes", description: "Cluster brass candleholders on crushed burgundy velvet table runners with tiny disco ball accents.", badge: "Vibe Setter", saved: true, addedToPlan: true },
      { id: "i2", category: "Menu", title: "Custom 'Maya’s Thirty' Signature Spritz", description: "Amaro Montenegro, prosecco, blood orange splash, and charred rosemary sprig.", badge: "Crowd Pleaser", saved: true, addedToPlan: true },
      { id: "i3", category: "Entertainment and Games", title: "Collaborative Vinyl Guestbook", description: "Guests use metallic gold and silver pens to write birthday notes on vintage vinyl record sleeves.", badge: "Keepsake", saved: true, addedToPlan: true },
      { id: "i4", category: "Photo-moment ideas", title: "Golden Hour Manhattan Skyline Golden Hour Couch", description: "A low-slung caramel leather sofa facing the sunset skyline with a basket of Polaroid cameras.", badge: "Iconic", saved: true, addedToPlan: true }
    ],
    guests: [
      { id: "g1", name: "Elena Rostova", partySize: 1, group: "Close Friends", dietary: "Gluten-Free", status: "Confirmed" },
      { id: "g2", name: "Marcus & Chloe Vance", partySize: 2, group: "Close Friends", dietary: "None", status: "Confirmed" },
      { id: "g3", name: "Samira Khan", partySize: 1, group: "Colleagues", dietary: "Vegetarian", status: "Confirmed" },
      { id: "g4", name: "Liam O'Connor", partySize: 1, group: "Close Friends", dietary: "None", status: "Invited" }
    ],
    risks: [
      { id: "r1", risk: "Windy gusts blowing lightweight rooftop napkins & glassware", likelihood: "Medium", impact: "Low", preventative: "Use weighted heavy amber tumblers and linen cloth clips.", planB: "Set up cocktail tables closer to the brick windbreak wall." },
      { id: "r2", risk: "Spring temperature drop after sunset", likelihood: "High", impact: "Medium", preventative: "Ensure loft includes 3 commercial standing patio heaters.", planB: "Keep 25 folded burgundy cashmere throws in wicker baskets for guests." }
    ]
  },

  community: {
    id: "sample-community",
    title: "Willow Glen Community Spring Artisan & Harvest Fair",
    eventType: "Community Event",
    tagline: "A vibrant, zero-waste neighborhood celebration bringing together 350 local families, indie artisans, organic farmers, and live acoustic buskers.",
    date: "2026-04-18",
    city: "San Jose, CA",
    guestCount: 350,
    totalBudget: 12000,
    currency: "USD",
    currencySymbol: "$",
    vibe: ["Grand", "Eco-friendly", "Traditional"],
    dietary: "Organic, Plant-forward, Allergen-labeled community food trucks",
    culturalNotes: "Zero single-use plastics mandate; compostable packaging stations; land acknowledgment ceremony at 11 AM.",
    readinessScore: 82,
    budget: {
      contingencyPercent: 10,
      categories: [
        { id: "permits", name: "City Park Permits, Street Closure & Insurance", planned: 2400, actual: 2350, notes: "Parks & Rec approval + event liability rider" },
        { id: "tents", name: "Canopy Booths, Tables & Power Distribution", planned: 3200, actual: 3100, notes: "30 artisan stalls + 4 community info tents" },
        { id: "stage", name: "Solar-Powered Acoustic Sound Stage", planned: 1800, actual: 1750, notes: "PA system, mic kit, solar battery bank" },
        { id: "waste", name: "Zero-Waste Sorting Stations & Composting Crew", planned: 1200, actual: 1200, notes: "Volunteers + Green Waste bin rental" },
        { id: "signage", name: "Recycled Cardboard & Chalkboard Directional Signs", planned: 600, actual: 520, notes: "Locally hand-lettered reusable signs" },
        { id: "activities", name: "Kids Seed-Bomb Workshop & Ceramic Clay Booth", planned: 800, actual: 850, notes: "Non-toxic organic materials and take-home plants" },
        { id: "marketing", name: "Neighborhood Postcards & Community Flyering", planned: 800, actual: 750, notes: "FSC certified recycled paper printing" },
        { id: "contingency", name: "Emergency Rain Tents & Medical First Aid", planned: 1200, actual: 0, notes: "Reserve emergency contingency" }
      ]
    },
    timeline: [
      { id: "t1", phase: "Early Planning", title: "Submit Municipal Street Closure & Park Permit", dueDate: "2026-01-10", priority: "High", owner: "Fair Committee", completed: true },
      { id: "t2", phase: "Early Planning", title: "Jury and select 30 local artisan craft vendors", dueDate: "2026-02-15", priority: "High", owner: "Jury Team", completed: true },
      { id: "t3", phase: "Booking Phase", title: "Contract solar battery audio technician", dueDate: "2026-03-01", priority: "Medium", owner: "Tech Lead", completed: true },
      { id: "t4", phase: "Finalizing", title: "Recruit 24 community volunteer marshals for shift rotations", dueDate: "2026-03-25", priority: "High", owner: "Volunteer Coord", completed: true },
      { id: "t5", phase: "Final Week", title: "Print festival maps on seed paper & distribute schedule", dueDate: "2026-04-10", priority: "Medium", owner: "Design Lead", completed: false },
      { id: "t6", phase: "Event Day", title: "Fair setup: 7:00 AM stall inspection & first-aid booth check", dueDate: "2026-04-18", priority: "High", owner: "Fair Chair", completed: false }
    ],
    runOfShow: [
      { id: "ros1", time: "07:00 AM", title: "Artisan Vendor Load-in & Stall Marking", location: "Main Promenade", leadPerson: "Operations Team", notes: "Ensure vehicles exit festival zone before 9:30 AM" },
      { id: "ros2", time: "10:00 AM", title: "Festival Gates Open & Acoustic Opening Chorus", location: "Community Stage", leadPerson: "High School Band", notes: "Opening welcome and ribbon cutting" },
      { id: "ros3", time: "11:30 AM", title: "Seed-Bomb & Pollinator Planting Workshop", location: "Family Tent", leadPerson: "Master Gardeners", notes: "Hands-on wildflower seed making for kids" },
      { id: "ros4", time: "01:00 PM", title: "Local Chef Sourdough & Honey Tasting", location: "Culinary Pavilion", leadPerson: "Chef Julian", notes: "Free public tasting showcasing local apiaries" },
      { id: "ros5", time: "03:30 PM", title: "Raffle Drawing & Best Artisan Stall Award", location: "Stage", leadPerson: "Mayor / Council Rep", notes: "Announce winners for handmade craft showcase" },
      { id: "ros6", time: "05:00 PM", title: "Festival Conclusion & Zero-Waste Teardown", location: "Entire Park", leadPerson: "Green Team", notes: "Weigh diverted compostable waste; target 95% zero waste" }
    ],
    vendors: [
      {
        id: "v-cat-permits",
        category: "City Permits & Security",
        whatToLookFor: "Timelines for barricade drop-off and police traffic plan sign-off.",
        questionsToAsk: "Does the park pavilion permit include amplified sound until 5 PM?",
        redFlags: "Failure to provide certified certificate of insurance (COI) 30 days prior.",
        typicalBudgetRange: "$2,000 – $2,800",
        vendors: [
          { id: "vnd1", name: "San Jose Special Events Bureau", contact: "events@sanjoseca.gov", status: "Booked", quote: 2350, advancePaid: 2350, notes: "Permit approved #SJ-2026-0418" }
        ]
      },
      {
        id: "v-cat-sound",
        category: "Audio & Solar Stage",
        whatToLookFor: "Zero fossil fuel generators; silent battery operation for clean air.",
        questionsToAsk: "How many hours of runtime does the solar battery bank provide with cloudy skies?",
        redFlags: "No backup power invertor.",
        typicalBudgetRange: "$1,500 – $2,200",
        vendors: [
          { id: "vnd2", name: "SunVolt Audio Collective", contact: "+1 (408) 555-8822", status: "Booked", quote: 1750, advancePaid: 900, notes: "Zero-emission solar rig with 4 wireless mics" }
        ]
      }
    ],
    ideas: [
      { id: "i1", category: "Theme and Decor", title: "Burlap & Wildflower Bunting Garlands", description: "Strung overhead between trees using natural unbleached jute rope and pressed dried botanical flags.", badge: "Eco Aesthetic", saved: true, addedToPlan: true },
      { id: "i2", category: "Return gifts/favors", title: "Seed Paper Festival Maps", description: "Printed with organic soy ink on paper embedded with California poppy seeds—guests plant their maps at home.", badge: "Zero Waste", saved: true, addedToPlan: true },
      { id: "i3", category: "Entertainment and Games", title: "Community Chalk Mural Wall", description: "A 50-foot chalkboard installation where attendees draw what community means to them.", badge: "Interactive", saved: true, addedToPlan: true },
      { id: "i4", category: "Budget-friendly hacks", title: "High School Volunteer Hours Partnership", description: "Partner with local environmental clubs for event marshal credits in exchange for free meal vouchers.", badge: "Smart Savings", saved: true, addedToPlan: true }
    ],
    guests: [
      { id: "g1", name: "Artisan Vendor Group (30 Booths)", partySize: 60, group: "VIP", dietary: "Various", status: "Confirmed" },
      { id: "g2", name: "Volunteer Marshals Squad", partySize: 24, group: "Family", dietary: "Vegetarian/Vegan", status: "Confirmed" },
      { id: "g3", name: "City Council Delegation", partySize: 5, group: "VIP", dietary: "None", status: "Confirmed" }
    ],
    risks: [
      { id: "r1", risk: "Spring rain showers dampening outdoor park lawns", likelihood: "Medium", impact: "High", preventative: "Reserve 3 large heavy-duty marquee canopies on 48-hour tentative hold.", planB: "Relocate stage and acoustic workshops under the park's permanent covered pavilion." },
      { id: "r2", risk: "Overflow street parking congesting neighborhood residents", likelihood: "High", impact: "Medium", preventative: "Secure free weekend parking permit for nearby middle school lot with shuttle van.", planB: "Place volunteer traffic directors with signage at key intersections." }
    ]
  }
};
