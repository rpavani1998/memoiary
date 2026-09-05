import fs from "fs";
import path from "path";
import { RAW_JOURNAL_CAPTURES } from "../lib/memory-engine/seeded-data";
import { CaptureSession, CaptureDimensions } from "../lib/memory-engine/types";

// High quality AI extractions for all 43 entries across August & September
const AI_EXTRACTIONS_MAP: Record<string, Partial<CaptureDimensions>> = {
  cap_aug_01_a: {
    title: "Morning Coffee & Quiet Reflections with Maya",
    summary: "Reflective morning coffee date with Maya at Third Wave Coffee discussing her upcoming move to London and the fast passage of time.",
    mood: "reflective",
    tone: "contemplative",
    emotions: [
      { label: "nostalgia", intensity: 0.8, valence: "mixed" },
      { label: "serenity", intensity: 0.85, valence: "positive" },
      { label: "anticipation", intensity: 0.6, valence: "positive" }
    ],
    people: ["Maya"],
    places: ["Third Wave Coffee", "Jubilee Hills", "London"],
    topics: ["passage of time", "academic transition", "friendship rituals"],
    timeContext: "August 1, 2026 (morning)",
    rawAnalysis: "Strong emotional grounding around life transitions and physical relocation to London."
  },
  cap_aug_01_b: {
    title: "Monsoon Dusk & Studio Skylines with Ananya",
    summary: "Photograph captured of monsoon clouds over Jubilee Hills skyline while taking a tea break with Ananya after a design jam.",
    mood: "serene",
    tone: "poetic",
    emotions: [
      { label: "contentment", intensity: 0.85, valence: "positive" },
      { label: "inspiration", intensity: 0.7, valence: "positive" }
    ],
    people: ["Ananya"],
    places: ["Jubilee Hills"],
    topics: ["monsoon weather", "shared chai", "design collaboration", "urban skyline"],
    timeContext: "August 1, 2026 (dusk)",
    rawAnalysis: "Visual capture capturing aesthetic atmosphere and creative camaraderie."
  },
  cap_aug_02: {
    title: "KBR Park Evening Solitude & Memory Musings",
    summary: "Voice memo recorded during an evening walk around KBR National Park contemplating how memories evolve like living narratives.",
    mood: "reflective",
    tone: "contemplative",
    emotions: [
      { label: "peacefulness", intensity: 0.9, valence: "positive" },
      { label: "philosophical wonder", intensity: 0.75, valence: "positive" }
    ],
    people: [],
    places: ["KBR National Park"],
    topics: ["nature of memory", "personal growth", "monsoon breeze", "identity"],
    timeContext: "August 2, 2026 (evening)",
    rawAnalysis: "Solo reflective voice note emphasizing memory persistence and self-inquiry."
  },
  cap_aug_03: {
    title: "Sprint Planning Session with Kabir at Mindspace",
    summary: "Productive technical planning session with Kabir at Mindspace IT Park mapping out the autobiographical memory reconciliation graph pipeline.",
    mood: "focused",
    tone: "professional",
    emotions: [
      { label: "intellectual engagement", intensity: 0.85, valence: "positive" },
      { label: "camaraderie", intensity: 0.75, valence: "positive" }
    ],
    people: ["Kabir"],
    places: ["Mindspace IT Park"],
    topics: ["sprint planning", "graph memory architecture", "entity disambiguation", "reconciliation pipeline"],
    timeContext: "August 3, 2026 (workday)",
    rawAnalysis: "Technical work context highlighting system architecture alignment with Kabir."
  },
  cap_aug_04_a: {
    title: "Rainy Afternoon Design Studio Jam with Ananya",
    summary: "Ananya visited the Banjara Hills studio during heavy rainfall to sketch hand-drawn card UI layouts over hot chai.",
    mood: "cozy",
    tone: "collaborative",
    emotions: [
      { label: "creativity", intensity: 0.85, valence: "positive" },
      { label: "warmth", intensity: 0.8, valence: "positive" }
    ],
    people: ["Ananya"],
    places: ["Banjara Hills", "Studio"],
    topics: ["visual design identity", "hand-drawn sketches", "rainy day chai"],
    timeContext: "August 4, 2026 (afternoon)",
    rawAnalysis: "Creative focus on tactile UI design and aesthetics with Ananya."
  },
  cap_aug_04_b: {
    title: "Desk Setup Reorganization & Digital Cleanout",
    summary: "Late evening voice note while reorganizing physical desk setup and archiving older project folders to clear mental space.",
    mood: "orderly",
    tone: "casual",
    emotions: [
      { label: "relief", intensity: 0.7, valence: "positive" },
      { label: "clarity", intensity: 0.8, valence: "positive" }
    ],
    people: [],
    places: ["Home Office"],
    topics: ["workspace optimization", "digital decluttering", "focus"],
    timeContext: "August 4, 2026 (night)",
    rawAnalysis: "Routine organizational capture reflecting personal clarity."
  },
  cap_aug_05: {
    title: "Testing Entity Resolution Benchmarks with Kabir",
    summary: "Benchmarking person graph algorithms with Kabir at the office, resolving duplicate entity nodes cleanly.",
    mood: "accomplished",
    tone: "analytical",
    emotions: [
      { label: "satisfaction", intensity: 0.8, valence: "positive" },
      { label: "curiosity", intensity: 0.75, valence: "positive" }
    ],
    people: ["Kabir"],
    places: ["Mindspace IT Park"],
    topics: ["entity resolution", "graph algorithms", "benchmarks"],
    timeContext: "August 5, 2026 (afternoon)",
    rawAnalysis: "Core engineering milestone in graph reconciliation."
  },
  cap_aug_06_a: {
    title: "Morning Jog through KBR Trail & Birdsong",
    summary: "Early morning voice note after a 5km jog through KBR National Park listening to bird calls in fresh post-rain air.",
    mood: "energized",
    tone: "upbeat",
    emotions: [
      { label: "vitality", intensity: 0.9, valence: "positive" },
      { label: "clarity", intensity: 0.85, valence: "positive" }
    ],
    people: [],
    places: ["KBR National Park"],
    topics: ["morning fitness", "monsoon air", "birdsong"],
    timeContext: "August 6, 2026 (morning)",
    rawAnalysis: "Physical wellness and nature sensory experience."
  },
  cap_aug_06_b: {
    title: "Dinner at Roast CCX with Rohan & Project Catchup",
    summary: "Caught up with Rohan over wood-fired pizza at Roast CCX, discussing his new AI hardware startup idea.",
    mood: "convivial",
    tone: "warm",
    emotions: [
      { label: "excitement", intensity: 0.8, valence: "positive" },
      { label: "friendship", intensity: 0.85, valence: "positive" }
    ],
    people: ["Rohan"],
    places: ["Roast CCX", "Jubilee Hills"],
    topics: ["hardware startup", "entrepreneurship", "wood-fired pizza"],
    timeContext: "August 6, 2026 (night)",
    rawAnalysis: "Social connection with Rohan highlighting entrepreneurial brainstorming."
  },
  cap_aug_07: {
    title: "Code Review & Refactoring Epistemic State Machine",
    summary: "Deep work block streamlining epistemic state transitions (USER_SAID vs AI_INFERRED) in the core memory schema.",
    mood: "deep focus",
    tone: "technical",
    emotions: [
      { label: "flow state", intensity: 0.9, valence: "positive" }
    ],
    people: [],
    places: ["Studio"],
    topics: ["epistemic state", "code architecture", "refactoring"],
    timeContext: "August 7, 2026 (day)",
    rawAnalysis: "Technical precision around data provenance model."
  },
  cap_aug_08: {
    title: "Weekend Trip Planning to Ananthagiri Hills with Maya",
    summary: "Café chat with Maya planning a weekend trek to Ananthagiri Hills before her departure to London next month.",
    mood: "joyful",
    tone: "enthusiastic",
    emotions: [
      { label: "anticipation", intensity: 0.85, valence: "positive" },
      { label: "warmth", intensity: 0.8, valence: "positive" }
    ],
    people: ["Maya"],
    places: ["Third Wave Coffee", "Ananthagiri Hills"],
    topics: ["weekend trek", "nature getaway", "friendship farewell"],
    timeContext: "August 8, 2026 (weekend)",
    rawAnalysis: "Planning outdoor trip with Maya as part of farewell series."
  },
  cap_aug_09: {
    title: "Sunday Reading Session: Philosophy of Time & Mind",
    summary: "Spent Sunday afternoon reading Henri Bergson's Matter and Memory on the balcony while sipping Earl Grey tea.",
    mood: "philosophical",
    tone: "reflective",
    emotions: [
      { label: "intellectual serenity", intensity: 0.9, valence: "positive" }
    ],
    people: [],
    places: ["Home Balcony"],
    topics: ["Bergson philosophy", "duration of time", "subjective memory"],
    timeContext: "August 9, 2026 (Sunday)",
    rawAnalysis: "Philosophical inspiration directly informing memory engine design."
  },
  cap_aug_10: {
    title: "Weekly Sync with Kabir, Ananya & Sarah",
    summary: "Full team sync reviewing UX prototypes with Ananya, backend graph progress with Kabir, and launch timelines with Sarah.",
    mood: "collaborative",
    tone: "structured",
    emotions: [
      { label: "alignment", intensity: 0.85, valence: "positive" },
      { label: "optimism", intensity: 0.8, valence: "positive" }
    ],
    people: ["Kabir", "Ananya", "Sarah"],
    places: ["Mindspace IT Park"],
    topics: ["team sync", "UX prototypes", "graph engine", "launch roadmap"],
    timeContext: "August 10, 2026 (morning)",
    rawAnalysis: "Cross-functional team alignment with all core collaborators."
  },
  cap_aug_11: {
    title: "Voice Memo: Reflections on Digital Identity & Privacy",
    summary: "Evening audio note recording thoughts on user data ownership and offline zero-knowledge privacy in personal AI.",
    mood: "serious",
    tone: "thoughtful",
    emotions: [
      { label: "conviction", intensity: 0.85, valence: "positive" }
    ],
    people: [],
    places: ["Studio"],
    topics: ["data privacy", "user sovereignty", "ethical AI"],
    timeContext: "August 11, 2026 (evening)",
    rawAnalysis: "Ethical framing of privacy boundaries in memory storage."
  },
  cap_aug_12: {
    title: "Coffee with Rohan: Hardware Prototypes & Sensors",
    summary: "Met Rohan at Hole in the Wall Cafe to inspect his ambient audio capture hardware prototype.",
    mood: "curious",
    tone: "geeky",
    emotions: [
      { label: "fascination", intensity: 0.85, valence: "positive" }
    ],
    people: ["Rohan"],
    places: ["Hole in the Wall Cafe", "Jubilee Hills"],
    topics: ["hardware prototype", "ambient recording", "sensor tech"],
    timeContext: "August 12, 2026 (afternoon)",
    rawAnalysis: "Hardware exploration session with Rohan."
  },
  cap_aug_13: {
    title: "Sunset Photography Session at Durgam Cheruvu Lake",
    summary: "Walked across Durgam Cheruvu cable bridge capturing photos of monsoon clouds reflected on the lake water.",
    mood: "awe",
    tone: "artistic",
    emotions: [
      { label: "wonder", intensity: 0.9, valence: "positive" },
      { label: "peace", intensity: 0.85, valence: "positive" }
    ],
    people: [],
    places: ["Durgam Cheruvu", "Knowledge City"],
    topics: ["sunset photography", "monsoon reflections", "urban nature"],
    timeContext: "August 13, 2026 (sunset)",
    rawAnalysis: "Visual aesthetic photo capture."
  },
  cap_aug_14: {
    title: "Deep Dive into Temporal Memory Clustering with Kabir",
    summary: "Whiteboarding session with Kabir refining how memory episodes cluster by temporal proximity and thematic affinity.",
    mood: "analytical",
    tone: "rigorous",
    emotions: [
      { label: "breakthrough joy", intensity: 0.85, valence: "positive" }
    ],
    people: ["Kabir"],
    places: ["Mindspace IT Park"],
    topics: ["temporal clustering", "memory episodes", "algorithm design"],
    timeContext: "August 14, 2026 (afternoon)",
    rawAnalysis: "Algorithm innovation block with Kabir."
  },
  cap_aug_15_a: {
    title: "Independence Day Breakfast with Family & Friends",
    summary: "Morning breakfast gathering with Maya, Rohan, and family eating hot idlis and dosa while watching the flag hoisting.",
    mood: "festive",
    tone: "warm",
    emotions: [
      { label: "patriotism", intensity: 0.8, valence: "positive" },
      { label: "community warmth", intensity: 0.9, valence: "positive" }
    ],
    people: ["Maya", "Rohan"],
    places: ["Jubilee Hills"],
    topics: ["Independence Day", "traditional breakfast", "community"],
    timeContext: "August 15, 2026 (morning)",
    rawAnalysis: "Holiday social celebration with close circle."
  },
  cap_aug_15_b: {
    title: "Afternoon Studio Session: Crafting Collage Engine",
    summary: "Building the automatic visual collage generator that stitches photos and quotes into weekly summary cards.",
    mood: "creative",
    tone: "focused",
    emotions: [
      { label: "artistic pride", intensity: 0.85, valence: "positive" }
    ],
    people: [],
    places: ["Studio"],
    topics: ["collage engine", "UI components", "weekly summaries"],
    timeContext: "August 15, 2026 (afternoon)",
    rawAnalysis: "UI engineering focus on story collages."
  },
  cap_aug_15_c: {
    title: "Late Night Voice Memo: Independence & Personal Freedom",
    summary: "Quiet late night reflection on what freedom means in creative work and building meaningful software.",
    mood: "reflective",
    tone: "introspective",
    emotions: [
      { label: "gratitude", intensity: 0.85, valence: "positive" }
    ],
    people: [],
    places: ["Home"],
    topics: ["creative freedom", "purpose", "software craft"],
    timeContext: "August 15, 2026 (night)",
    rawAnalysis: "Introspective voice memo on autonomy and craft."
  },
  cap_aug_16: {
    title: "Trek to Ananthagiri Hills with Maya & Rohan",
    summary: "Full day trek through lush green Ananthagiri forests with Maya and Rohan. Misty weather, wild trails, and endless laughing.",
    mood: "exhilarated",
    tone: "adventurous",
    emotions: [
      { label: "joy", intensity: 0.95, valence: "positive" },
      { label: "friendship bond", intensity: 0.9, valence: "positive" }
    ],
    people: ["Maya", "Rohan"],
    places: ["Ananthagiri Hills", "Vikarabad"],
    topics: ["forest trek", "monsoon mist", "wilderness", "friendship memory"],
    timeContext: "August 16, 2026 (all day)",
    rawAnalysis: "Major outdoor milestone event with Maya and Rohan."
  },
  cap_aug_17: {
    title: "Rest Day & Photo Sorting after Ananthagiri Trek",
    summary: "Lazy Monday evening organizing trek photos and creating a shared album with Maya and Rohan.",
    mood: "relaxed",
    tone: "casual",
    emotions: [
      { label: "satisfaction", intensity: 0.8, valence: "positive" }
    ],
    people: ["Maya", "Rohan"],
    places: ["Home"],
    topics: ["photo curation", "memories", "rest"],
    timeContext: "August 17, 2026 (evening)",
    rawAnalysis: "Post-event curation and memory anchoring."
  },
  cap_aug_18: {
    title: "Design Review of Person Graph Cards with Ananya",
    summary: "Reviewed Ananya's hand-drawn avatars and artistic background textures for person detail cards.",
    mood: "inspired",
    tone: "artistic",
    emotions: [
      { label: "aesthetic delight", intensity: 0.9, valence: "positive" }
    ],
    people: ["Ananya"],
    places: ["Studio", "Banjara Hills"],
    topics: ["hand-drawn UI", "ArtisticAvatar", "design system"],
    timeContext: "August 18, 2026 (afternoon)",
    rawAnalysis: "UI visual design alignment with Ananya."
  },
  cap_aug_19: {
    title: "Voice Memo: The Beauty of Unstructured Audio Journaling",
    summary: "Reflecting on how voice journaling captures subtle emotional inflections that typing often flattens.",
    mood: "contemplative",
    tone: "thoughtful",
    emotions: [
      { label: "mindfulness", intensity: 0.8, valence: "positive" }
    ],
    people: [],
    places: ["Car Drive"],
    topics: ["voice notes", "emotional tone", "journaling modalities"],
    timeContext: "August 19, 2026 (dusk)",
    rawAnalysis: "Reflection on input modality nuances."
  },
  cap_aug_20: {
    title: "Preparation for Maya's Farewell Party",
    summary: "Met Ananya and Kabir to plan Maya's surprise farewell dinner next week before her flight to London.",
    mood: "warm & sentimental",
    tone: "caring",
    emotions: [
      { label: "affection", intensity: 0.9, valence: "positive" },
      { label: "bittersweetness", intensity: 0.7, valence: "mixed" }
    ],
    people: ["Maya", "Kabir", "Ananya"],
    places: ["Jubilee Hills"],
    topics: ["farewell planning", "surprise party", "friendship gift"],
    timeContext: "August 20, 2026 (evening)",
    rawAnalysis: "Group coordination for Maya's send-off."
  },
  cap_aug_21_a: {
    title: "Morning Standup & Memory Pipeline Demo",
    summary: "Demonstrated real-time emotion extraction and entity linking to Kabir and Sarah in the morning standup.",
    mood: "focused",
    tone: "professional",
    emotions: [
      { label: "pride", intensity: 0.8, valence: "positive" }
    ],
    people: ["Kabir", "Sarah"],
    places: ["Mindspace IT Park"],
    topics: ["demo", "pipeline", "emotion extraction"],
    timeContext: "August 21, 2026 (morning)",
    rawAnalysis: "Internal milestone demonstration."
  },
  cap_aug_21_b: {
    title: "Deep Alignment Session: London Relocation, Entity Disambiguation & Memory Architecture",
    summary: "A rich 3-hour discussion with Maya, Kabir, and Ananya at Third Wave Coffee covering Maya's upcoming move to London, complex entity resolution in our graph database, privacy boundary ethics for autobiographical AI, and hand-drawn card UI mockups.",
    mood: "collaborative & reflective",
    tone: "intellectual, warm, contemplative",
    emotions: [
      { label: "intellectual engagement", intensity: 0.9, valence: "positive" },
      { label: "bittersweet nostalgia", intensity: 0.8, valence: "mixed" },
      { label: "creative inspiration", intensity: 0.85, valence: "positive" },
      { label: "camaraderie", intensity: 0.9, valence: "positive" }
    ],
    people: ["Maya", "Kabir", "Ananya"],
    places: ["Third Wave Coffee", "Jubilee Hills", "London", "Imperial College London"],
    topics: [
      "London relocation",
      "graph entity disambiguation",
      "privacy ethics",
      "hand-drawn card UI",
      "philosophy of fading memories",
      "autobiographical architecture"
    ],
    timeContext: "August 21, 2026 (afternoon)",
    rawAnalysis: "Landmark multi-topic 800-word journal entry demonstrating complex multi-entity narrative synthesis across technical, emotional, and design domains."
  },
  cap_aug_22: {
    title: "Priya's Arrival from Mumbai & Irani Chai at Charminar",
    summary: "Voice note recorded right outside Charminar! Priya flew in from Mumbai for the weekend. We got Irani chai and Osmania biscuits while Priya caught up with Maya on her London move.",
    mood: "joyous",
    tone: "lively",
    emotions: [
      { label: "elation", intensity: 0.9, valence: "positive" },
      { label: "hospitality", intensity: 0.85, valence: "positive" }
    ],
    people: ["Priya", "Maya"],
    places: ["Charminar", "Old City", "Mumbai"],
    topics: ["Irani chai", "reunion", "Old City heritage", "London move"],
    timeContext: "August 22, 2026 (afternoon)",
    rawAnalysis: "High-energy reunion entry introducing Priya."
  },
  cap_aug_23: {
    title: "Long Walk in KBR Park with Priya, Maya & Ananya",
    summary: "Long walk in KBR Park with Priya, Maya, and Ananya. Priya was wearing her coral top, telling hilarious stories from college. We talked about how friendships evolve across cities.",
    mood: "nostalgic & warm",
    tone: "affectionate",
    emotions: [
      { label: "warmth", intensity: 0.9, valence: "positive" },
      { label: "laughter", intensity: 0.85, valence: "positive" }
    ],
    people: ["Priya", "Maya", "Ananya"],
    places: ["KBR National Park"],
    topics: ["college stories", "evolving friendships", "walk in the park"],
    timeContext: "August 23, 2026 (late afternoon)",
    rawAnalysis: "Group bonding session with 3 key female friends."
  },
  cap_aug_24: {
    title: "Bidding Farewell to Priya at Airport & Morning Coffee",
    summary: "Saw Priya off to the airport early morning. Stopped at Third Wave Coffee before heading to work. Grateful for friends who make years feel like days when you reunite.",
    mood: "grateful & tender",
    tone: "heartfelt",
    emotions: [
      { label: "gratitude", intensity: 0.9, valence: "positive" },
      { label: "tenderness", intensity: 0.8, valence: "positive" }
    ],
    people: ["Priya"],
    places: ["Rajiv Gandhi International Airport", "Third Wave Coffee"],
    topics: ["airport sendoff", "enduring friendship", "morning routine"],
    timeContext: "August 24, 2026 (morning)",
    rawAnalysis: "Emotional sendoff note for Priya."
  },
  cap_aug_25: {
    title: "Helping Maya Label Luggage Tags & Leather Notebook Gift",
    summary: "Voice recording after helping Maya label her luggage tags. She was nervous and excited all at once. I gave her a leather-bound notebook as a farewell gift.",
    mood: "sentimental",
    tone: "tender",
    emotions: [
      { label: "affection", intensity: 0.9, valence: "positive" },
      { label: "bittersweetness", intensity: 0.85, valence: "mixed" }
    ],
    people: ["Maya"],
    places: ["Jubilee Hills"],
    topics: ["luggage packing", "farewell gift", "leather notebook", "London transition"],
    timeContext: "August 25, 2026 (evening)",
    rawAnalysis: "Intimate packing milestone with Maya."
  },
  cap_aug_26: {
    title: "Maya's Farewell Dinner at Olive Bistro with Friends",
    summary: "Maya's grand farewell dinner at Olive Bistro overlooking Durgam Cheruvu! Kabir, Ananya, Rohan, Priya, and Sarah all gathered. Speeches, laughter, and tearful hugs.",
    mood: "celebratory & emotional",
    tone: "heartfelt",
    emotions: [
      { label: "love", intensity: 0.95, valence: "positive" },
      { label: "bittersweet nostalgia", intensity: 0.9, valence: "mixed" },
      { label: "camaraderie", intensity: 0.9, valence: "positive" }
    ],
    people: ["Maya", "Kabir", "Ananya", "Rohan", "Priya", "Sarah"],
    places: ["Olive Bistro", "Durgam Cheruvu", "London"],
    topics: ["farewell dinner", "friendship speeches", "celebration", "Durgam Cheruvu view"],
    timeContext: "August 26, 2026 (night)",
    rawAnalysis: "Peak emotional anchor entry connecting all 6 core characters."
  },
  cap_aug_27: {
    title: "Accompanying Maya to Airport & Emotional Departure",
    summary: "Drove Maya to RGIA for her midnight flight to Heathrow. Watching her walk through departure gate was surreal. End of a chapter, start of her London journey.",
    mood: "poignantly reflective",
    tone: "vulnerable",
    emotions: [
      { label: "sorrow", intensity: 0.7, valence: "negative" },
      { label: "hope", intensity: 0.85, valence: "positive" },
      { label: "deep affection", intensity: 0.9, valence: "positive" }
    ],
    people: ["Maya"],
    places: ["Rajiv Gandhi International Airport", "Heathrow Airport", "London"],
    topics: ["flight departure", "Heathrow", "chapter transition", "goodbye"],
    timeContext: "August 27, 2026 (midnight)",
    rawAnalysis: "Major life transition milestone."
  },
  cap_aug_28: {
    title: "Quiet Reflection Day & First Text from Maya in London",
    summary: "Quiet day at home. Received a whatsapp message from Maya: 'Landed at Heathrow! It's raining in London!'. Smiled reading it, knowing she's safe.",
    mood: "reassured",
    tone: "gentle",
    emotions: [
      { label: "relief", intensity: 0.9, valence: "positive" },
      { label: "peace", intensity: 0.85, valence: "positive" }
    ],
    people: ["Maya"],
    places: ["London", "Heathrow Airport", "Home"],
    topics: ["safe arrival", "WhatsApp check-in", "London weather"],
    timeContext: "August 28, 2026 (afternoon)",
    rawAnalysis: "Reassurance and resolution of travel tension."
  },
  cap_aug_29_a: {
    title: "Morning Coffee at Third Wave: Processing the Quiet",
    summary: "Morning coffee at Third Wave alone. The cafe felt different without Maya sitting across, but the quiet routine brought peace.",
    mood: "pensive",
    tone: "quiet",
    emotions: [
      { label: "solitude", intensity: 0.8, valence: "neutral" },
      { label: "peace", intensity: 0.8, valence: "positive" }
    ],
    people: ["Maya"],
    places: ["Third Wave Coffee", "Jubilee Hills"],
    topics: ["solo coffee", "adjusting to change", "morning stillness"],
    timeContext: "August 29, 2026 (morning)",
    rawAnalysis: "Post-departure adjustment entry."
  },
  cap_aug_29_b: {
    title: "Afternoon Code Session with Kabir on Memory Graph",
    summary: "Met Kabir at Mindspace to push the new graph query optimization into production. High productivity flow state.",
    mood: "focused",
    tone: "energetic",
    emotions: [
      { label: "flow state", intensity: 0.9, valence: "positive" },
      { label: "achievement", intensity: 0.85, valence: "positive" }
    ],
    people: ["Kabir"],
    places: ["Mindspace IT Park"],
    topics: ["graph optimization", "production push", "coding flow"],
    timeContext: "August 29, 2026 (afternoon)",
    rawAnalysis: "Engineering milestone accomplishment."
  },
  cap_aug_29_c: {
    title: "Evening Chai with Ananya discussing London Trip",
    summary: "Ananya came over in the evening. We drank ginger chai on the balcony and started planning a trip to visit Maya in London this December!",
    mood: "excited",
    tone: "cheerful",
    emotions: [
      { label: "anticipation", intensity: 0.9, valence: "positive" },
      { label: "joy", intensity: 0.85, valence: "positive" }
    ],
    people: ["Ananya", "Maya"],
    places: ["Home Balcony", "London"],
    topics: ["December travel plan", "ginger chai", "visiting London"],
    timeContext: "August 29, 2026 (night)",
    rawAnalysis: "Future travel planning with Ananya."
  },
  cap_aug_30: {
    title: "Sunday Video Call with Maya in her London Flat",
    summary: "1-hour video call with Maya showing her new flat in Bloomsbury, London! She showed us the view of brick chimneys and green parks outside her window.",
    mood: "delighted",
    tone: "warm & humorous",
    emotions: [
      { label: "connection", intensity: 0.9, valence: "positive" },
      { label: "happiness", intensity: 0.85, valence: "positive" }
    ],
    people: ["Maya"],
    places: ["Bloomsbury", "London"],
    topics: ["video call", "London flat tour", "long distance connection"],
    timeContext: "August 30, 2026 (Sunday)",
    rawAnalysis: "Transnational connection via video call."
  },
  cap_aug_31: {
    title: "August Retrospective: Month of Transitions & Connections",
    summary: "Voice memo reviewing the entire month of August. From monsoon rain in Hyderabad to Maya's move to London, sprint planning with Kabir, design with Ananya, and reunions with Priya & Rohan.",
    mood: "deeply reflective",
    tone: "profound",
    emotions: [
      { label: "gratitude", intensity: 0.95, valence: "positive" },
      { label: "fulfillment", intensity: 0.9, valence: "positive" },
      { label: "wisdom", intensity: 0.85, valence: "positive" }
    ],
    people: ["Maya", "Kabir", "Ananya", "Rohan", "Priya", "Sarah"],
    places: ["Hyderabad", "London", "Jubilee Hills", "KBR National Park"],
    topics: ["monthly retrospective", "autobiographical memory", "life transitions", "cherished bonds"],
    timeContext: "August 31, 2026 (month end)",
    rawAnalysis: "Comprehensive monthly synthesis tying together all characters, places, and memory threads."
  },
  cap_sep_01: {
    title: "September Kickoff & Product Roadmap with Sarah",
    summary: "Morning coffee with Sarah outlining product milestones for September: launch readiness, memory search, and entity cards.",
    mood: "determined",
    tone: "focused",
    emotions: [
      { label: "clarity", intensity: 0.85, valence: "positive" },
      { label: "drive", intensity: 0.85, valence: "positive" }
    ],
    people: ["Sarah"],
    places: ["Third Wave Coffee"],
    topics: ["September roadmap", "launch readiness", "entity search"],
    timeContext: "September 1, 2026 (morning)",
    rawAnalysis: "New month vision setting with Sarah."
  },
  cap_sep_02: {
    title: "Polishing Hand-Drawn Timeline & Story Graph Cards",
    summary: "Worked with Kabir and Ananya on polishing the timeline view switcher and hand-drawn story graph cards. The synthesis of weekly and monthly collages feels so personal.",
    mood: "creative & satisfied",
    tone: "collaborative",
    emotions: [
      { label: "pride", intensity: 0.9, valence: "positive" },
      { label: "craftsmanship", intensity: 0.85, valence: "positive" }
    ],
    people: ["Kabir", "Ananya"],
    places: ["Studio"],
    topics: ["timeline switcher", "hand-drawn card UI", "story collages"],
    timeContext: "September 2, 2026 (afternoon)",
    rawAnalysis: "UI polish milestone with Kabir and Ananya."
  },
  cap_sep_03: {
    title: "User Testing Feedback & Automatic Entity Tagging",
    summary: "Voice note recorded at Third Wave Coffee. Met Sarah to review user testing feedback. People love how Memoiary automatically highlights their friends and places without manual tagging.",
    mood: "enthusiastic",
    tone: "encouraged",
    emotions: [
      { label: "validation", intensity: 0.9, valence: "positive" },
      { label: "excitement", intensity: 0.85, valence: "positive" }
    ],
    people: ["Sarah"],
    places: ["Third Wave Coffee"],
    topics: ["user testing feedback", "automatic entity tagging", "user delight"],
    timeContext: "September 3, 2026 (morning)",
    rawAnalysis: "User validation session confirming auto-extraction magic."
  },
  cap_sep_04: {
    title: "Complete System Integration & August Dataset Verification",
    summary: "Tested all UI views and memory engine extractors against our complete August data. People, places, timeline modes, and graph connections rendering with complete integrity.",
    mood: "triumphant",
    tone: "confident",
    emotions: [
      { label: "fulfillment", intensity: 0.95, valence: "positive" },
      { label: "confidence", intensity: 0.9, valence: "positive" }
    ],
    people: ["Maya", "Kabir", "Ananya", "Rohan", "Priya", "Sarah"],
    places: ["Hyderabad", "London", "Jubilee Hills", "Mindspace IT Park", "KBR National Park"],
    topics: ["system verification", "memory engine validation", "data integrity"],
    timeContext: "September 4, 2026 (evening)",
    rawAnalysis: "Final verification milestone."
  }
};

function buildDataset() {
  console.log(`Building full AI extracted captures for all ${RAW_JOURNAL_CAPTURES.length} entries...`);

  const processedCaptures: CaptureSession[] = RAW_JOURNAL_CAPTURES.map((raw) => {
    const ext = AI_EXTRACTIONS_MAP[raw.id] || {
      title: raw.content.substring(0, 35),
      summary: raw.content.substring(0, 100),
      mood: "reflective",
      tone: "personal",
      emotions: [{ label: "Presence", intensity: 0.8, valence: "positive" }],
      people: [],
      places: [],
      topics: ["Personal Memory"],
      timeContext: raw.createdAt.split("T")[0],
      rawAnalysis: raw.content
    };

    const dims: CaptureDimensions = {
      title: ext.title || raw.content.substring(0, 35),
      summary: ext.summary || raw.content.substring(0, 100),
      mood: ext.mood || "reflective",
      tone: ext.tone || "personal",
      emotions: ext.emotions || [{ label: "Presence", intensity: 0.8, valence: "positive" }],
      people: ext.people || [],
      places: ext.places || [],
      topics: ext.topics || ["Personal Memory"],
      timeContext: ext.timeContext || raw.createdAt.split("T")[0],
      rawAnalysis: ext.rawAnalysis || raw.content,
      mediaInsights: raw.mediaUrl ? { sceneDescription: `Media attachment at ${raw.mediaUrl}` } : undefined
    };

    return {
      ...raw,
      title: dims.title,
      status: "reconciled",
      dimensions: dims,
      episodes: [
        {
          id: `ep_${raw.id}`,
          userId: raw.userId,
          captureId: raw.id,
          title: dims.title || raw.content.substring(0, 30),
          summary: dims.summary,
          date: raw.createdAt.split("T")[0],
          location: dims.places[0] || undefined,
          entitiesInvolved: [...dims.people, ...dims.places],
          epistemicStatus: "USER_SAID" as any,
          createdAt: raw.createdAt
        }
      ]
    };
  });

  const outputCode = `import { CaptureSession, EpistemicSource } from "./types";

export const RAW_JOURNAL_CAPTURES: CaptureSession[] = ${JSON.stringify(RAW_JOURNAL_CAPTURES, null, 2)};

export const AI_EXTRACTED_CAPTURES: CaptureSession[] = ${JSON.stringify(processedCaptures, null, 2).replace(/"epistemicStatus": "USER_SAID"/g, "epistemicStatus: EpistemicSource.USER_SAID")};

let cachedProcessedCaptures: CaptureSession[] | null = null;

export function setProcessedSeededCaptures(captures: CaptureSession[]) {
  cachedProcessedCaptures = captures;
}

export function getSeededCaptures(userId = "guest_user"): CaptureSession[] {
  if (cachedProcessedCaptures && cachedProcessedCaptures.length > 0) {
    return cachedProcessedCaptures;
  }
  return AI_EXTRACTED_CAPTURES;
}
`;

  const seededDataPath = path.resolve(process.cwd(), "lib/memory-engine/seeded-data.ts");
  fs.writeFileSync(seededDataPath, outputCode, "utf8");
  console.log(`✅ Successfully updated lib/memory-engine/seeded-data.ts with complete AI analysis across all 43 entries!`);
}

buildDataset();
