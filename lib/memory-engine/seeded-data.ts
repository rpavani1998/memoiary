import { CaptureSession, EpistemicSource } from "./types";

export const RAW_JOURNAL_CAPTURES: CaptureSession[] = [
  {
    "id": "cap_aug_01_a",
    "userId": "guest_user",
    "content": "Starting August with a quiet morning at Third Wave Coffee in Jubilee Hills. Maya joined me with her golden brown scarf and physical paper journal. We talked about how fast this year is moving and her upcoming move to London for LSE next month. The morning sun hit the patio just right.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-01T09:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_01_b",
    "userId": "guest_user",
    "content": "Captured this photo of the monsoon clouds breaking over the Jubilee Hills skyline after work. Shared chai with Ananya on the balcony while reviewing color swatches for the memory app.",
    "source": "image",
    "mediaUrl": "/images/rooftop-chai.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-01T17:45:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_02",
    "userId": "guest_user",
    "content": "Voice note from my evening walk around KBR National Park perimeter. The monsoon breeze was incredible today. I was thinking about how memory isn't just a record of what happened, but a living narrative of who we were becoming in those quiet, unscripted moments.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-02T18:15:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_03",
    "userId": "guest_user",
    "content": "Sprint planning day with Kabir at Mindspace IT Park. He had his wireframe glasses on and rust-orange sweater despite the mild AC. We sketched out the graph memory reconciliation pipeline—how entity nodes like people and places should connect to autobiographical episodes.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-03T11:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_04_a",
    "userId": "guest_user",
    "content": "Ananya stopped by the studio while rain poured over Banjara Hills. She brought sketchpads with vibrant color swatches for the app's visual identity. We drank hot chai and watched the rain wash over the trees.",
    "source": "image",
    "mediaUrl": "/images/rooftop-chai.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-04T16:45:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_04_b",
    "userId": "guest_user",
    "content": "Late evening voice memo while organizing my desk. Realized how much calmer I feel when working on tactile design systems rather than pure code optimization.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-04T21:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_05",
    "userId": "guest_user",
    "content": "Product alignment lunch with Sarah at Roastery Coffee House. She reminded me that users don't want another complex database—they want a sanctuary that preserves how their days felt. Validated our memory stream interface.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-05T14:20:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_06_a",
    "userId": "guest_user",
    "content": "Voice note recorded at Mindspace IT Park during lunch break with Kabir. Discussed prompt fallback ladders between Gemini 3.6 Flash and Gemini 3.1 Pro Preview to guarantee zero downtime during peak inference bursts.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-06T13:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_06_b",
    "userId": "guest_user",
    "content": "Late night voice note. Dinner with Maya and Kabir earlier. We laughed about how Kabir tried to explain vector embeddings to Maya over pasta, and Maya countered with a quote from Virginia Woolf. It struck me how rare these simple dinners are.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-06T21:10:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_07",
    "userId": "guest_user",
    "content": "Quick video recording capturing the golden hour light filtering through the neem trees at KBR Park. The sound of birds before sunset was so calming after a long week of code reviews.",
    "source": "video",
    "mediaUrl": "/assets/poster-end.png",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-07T17:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_08",
    "userId": "guest_user",
    "content": "Spent 4 hours at Tattva Cafe with Ananya and Maya. Ananya was painting hand-drawn watercolor icons on her tablet while Maya read her LSE orientation materials. I worked on entity extraction prompt templates.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-08T15:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_09",
    "userId": "guest_user",
    "content": "Voice memo at Third Wave. Maya brought her packing checklist for London. It feels surreal that in three weeks she'll be across the ocean. We agreed to do a weekly memory audio sync once she settles.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-09T10:15:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_10",
    "userId": "guest_user",
    "content": "Kabir cracked the prompt latency bottleneck! We cut inference response time from 3.2 seconds down to 800ms using structured JSON outputs and fallback model routing. Celebrated with late-night biryani.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-10T19:40:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_11",
    "userId": "guest_user",
    "content": "Took an hour off in the afternoon to walk along Hussain Sagar lakefront. The cool monsoon air cleared my head. Sometimes walking away from the screen is the fastest way to solve an architectural block.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-11T13:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_12",
    "userId": "guest_user",
    "content": "Recorded this voice note while organizing my bookshelves. Rohan called from Bengaluru to say he's taking the Friday train down for the weekend! Maya is coming over too. Can't wait to have everyone together.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-12T20:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_13",
    "userId": "guest_user",
    "content": "Captured a picture of my espresso and handwritten notes during a review session with Sarah. We finalized the privacy architecture: strict single-tenant user partitioning in Firestore.",
    "source": "image",
    "mediaUrl": "/images/cafe-notes.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-13T16:20:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_14",
    "userId": "guest_user",
    "content": "Rohan arrived from Bengaluru with his acoustic guitar in his signature dark green jacket. Kabir brought takeout, and Maya arrived right after work. Rohan played a new melody he composed during his train ride.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-14T22:15:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_15_a",
    "userId": "guest_user",
    "content": "Morning voice note at home studio. Making breakfast for Rohan, Maya, and Kabir before we head out for the weekend drive around Hyderabad.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-15T10:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_15_b",
    "userId": "guest_user",
    "content": "Photo of espresso and napkin sketches at Tattva Cafe with Rohan and Ananya during our afternoon break.",
    "source": "image",
    "mediaUrl": "/images/cafe-notes.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-15T14:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_15_c",
    "userId": "guest_user",
    "content": "Video memory: Driving across Durgam Cheruvu Cable Bridge with Rohan, Maya, Kabir, and Ananya at sunset. Rohan was playing his guitar in the backseat while the city lights came alive over the water.",
    "source": "video",
    "mediaUrl": "/assets/poster-end.png",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-15T19:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_16",
    "userId": "guest_user",
    "content": "Sunday brunch at Tattva Cafe before Rohan headed back to Bengaluru. Ananya sketched a quick caricature of Rohan playing guitar on a napkin. We promised to meet up in Bengaluru next month.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-16T17:45:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_17",
    "userId": "guest_user",
    "content": "Quick voice note walking into the office. The energy from the weekend with Rohan, Maya, and Kabir gave me so much motivation. We are building something really meaningful here.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-17T09:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_18",
    "userId": "guest_user",
    "content": "Two coffees, three pages of design specs, one core idea that stayed: memory isn't chronological cataloging—it's emotional clustering around people, places, and meaningful shifts.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-18T16:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_19",
    "userId": "guest_user",
    "content": "Rainy afternoon picture. Maya stopped by after her visa appointment to celebrate her approved UK visa! We left our rain-drenched shoes at the doorway and made hot ginger tea.",
    "source": "image",
    "mediaUrl": "/images/doorway-shoes.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-19T14:10:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_20",
    "userId": "guest_user",
    "content": "Deep technical session with Kabir and Sarah. We reviewed how person graphs maintain persistent visual identities and traits as users journal about their friends over time.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-20T18:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_21_a",
    "userId": "guest_user",
    "content": "Morning code freeze sync with Kabir at Mindspace IT Park. Verified build artifacts and test suite coverage before our evening strategy dinner.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-21T11:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_21_b",
    "userId": "guest_user",
    "content": "Full 4-Hour Deep Dinner Conversation with Maya, Kabir, Sarah, and Ananya at Roastery Coffee House:\n\nWe stayed at Roastery Coffee House until 11:30 PM tonight, moving from the outdoor garden patio to the inner lounge as the monsoon rain picked up. It turned into one of the most sprawling, intellectually exhilarating, and emotionally candid conversations we’ve had all year, weaving across five completely different dimensions:\n\n1. Maya's London Transition & Relocation Anxiety:\nMaya opened up about her looming move to the UK for her Master's at LSE next week. She’s currently torn between two housing options—a small studio near Bloomsbury close to the LSE campus versus a shared flat in Holborn with two international students. She talked about the visceral weight of leaving Banjara Hills, where her family has lived for twenty years. We spent an hour dissecting the emotional friction of packing up a life into two 23kg suitcases. Sarah pointed out how transitions force us to decide which memories are foundational anchors and which ones we can let go of. Maya admitted she was terrified of the academic intensity at LSE, but Ananya reminded her of how effortlessly she handled her undergraduate thesis under pressure.\n\n2. AI Memory Graph Disambiguation & Entity Resolution:\nKabir pulled out his laptop to show us a breakthrough in the graph memory engine. He had been struggling with entity disambiguation—specifically how the AI system distinguishes between two different people named 'Sarah' (e.g. Sarah our co-founder vs Sarah his cousin in Chicago) or how it resolves historical vs active relationships. He demonstrated a two-stage temporal graph reconciliation algorithm that evaluates co-occurrence context, sentiment proximity, and timestamp deltas. We debated whether entity resolution should be deterministic or probabilistic, and Kabir showed how epistemic status tags (USER_SAID vs SYSTEM_INFERRED vs USER_CONFIRMED) prevent the AI from making false hallucinated assumptions about a user's life.\n\n3. Product Sanctuary Philosophy & Anti-Therapist Guardrails:\nSarah brought the conversation back to product ethics and AI boundary design. She strongly argued that Memoiary must NEVER morph into a preachy AI therapist, life coach, or motivational bot. 'The moment an app tells a user how they *should* feel or gives unsolicited advice like *you need to stay positive*, it breaks sacred trust,' Sarah emphasized. We spent thirty minutes auditing our system instructions to enforce a strict 'objective witness' stance—inspired by ancient narrative traditions—where the system quietly reflects back patterns, connections, and time-shifted contrasts without judgment or prescription.\n\n4. Visual Design Identity & Hand-Drawn Character Personas:\nAnanya laid out her color swatches and character sketches for the app interface. She explained why she deliberately avoided slick 3D emojis and generic stock avatars in favor of tactile, pencil-and-watercolor line drawings. For Maya, she used warm terracotta and golden-brown scarf accents (#F5E5DC / #DE5239); for Kabir, soft sky blue and rust-orange (#E0F2FE / #0284C7); for Rohan, deep moss green (#E2EBD8 / #4D7C0F). Ananya argued that visual memory is deeply sensory—when users view their friend cards or weekly recaps, the artistic texture evokes warmth rather than cold digital utility.\n\n5. Time, Memory Continuity, and Lifelong Friendship:\nAs the cafe was closing, we sat in quiet reflection watching the rain stream down the glass windows. We talked about how rare it is for a group of friends with completely different backgrounds—computer science, economics, fine art, and product strategy—to remain so tightly connected over years. We realized that Memoiary itself is a testament to this friendship: built out of our late-night debates, design sessions, and shared coffee mornings. Maya smiled, held up her tea cup, and said, 'No matter where in the world we are next month, this story doesn't end—it just adds a new chapter.'",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-21T21:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_22",
    "userId": "guest_user",
    "content": "Voice note recorded right outside Charminar! Priya flew in from Mumbai for the weekend. We got Irani chai and Osmania biscuits while Priya caught up with Maya on her London move.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-22T12:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_23",
    "userId": "guest_user",
    "content": "Long walk in KBR Park with Priya, Maya, and Ananya. Priya was wearing her coral top, telling hilarious stories from college. We talked about how friendships evolve across cities.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-23T16:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_24",
    "userId": "guest_user",
    "content": "Saw Priya off to the airport early morning. Stopped at Third Wave Coffee before heading to work. Grateful for friends who make years feel like days when you reunite.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-24T10:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_25",
    "userId": "guest_user",
    "content": "Voice recording after helping Maya label her luggage tags. She was nervous and excited all at once. I gave her a leather-bound notebook as a farewell gift.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-25T19:15:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_26",
    "userId": "guest_user",
    "content": "Completed feature freeze for the memory engine with Kabir. Ran automated test suites across entities, episodes, relationships, and clarification logic. Everything passed clean.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-26T15:45:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_27",
    "userId": "guest_user",
    "content": "Ananya unveiled her final hand-drawn visual story collage at Tattva Cafe! Maya loved seeing her golden brown scarf captured in the story canvas artwork.",
    "source": "image",
    "mediaUrl": "/collages/daily_collage_sketch.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-27T17:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_28",
    "userId": "guest_user",
    "content": "Quiet evening at home reflecting on the past month. August has been a whirlwind of work sprints, weekend trips, and preparing for big life shifts.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-28T20:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_29_a",
    "userId": "guest_user",
    "content": "Voice recording helping Maya seal her final suitcase at her Banjara Hills apartment. Taping the UK shipping labels together.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-29T11:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_29_b",
    "userId": "guest_user",
    "content": "Captured this photo of Ananya presenting the framed hand-drawn memory canvas to Maya on the terrace.",
    "source": "image",
    "mediaUrl": "/collages/daily_collage_sketch.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-29T17:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_29_c",
    "userId": "guest_user",
    "content": "Video memory from Maya's rooftop farewell tea gathering. Everyone came—Kabir, Ananya, Sarah, Rohan sent a video jam message, and Priya called in from Mumbai. Maya wore her golden scarf and raised a toast.",
    "source": "video",
    "mediaUrl": "/assets/poster-end.png",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-29T21:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_30",
    "userId": "guest_user",
    "content": "Voice memo recorded on the drive back from Rajiv Gandhi International Airport. Maya checked in her bags and gave me a long hug before walking through international security. London awaits her.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-30T16:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_aug_31",
    "userId": "guest_user",
    "content": "Sitting at Third Wave Coffee on the final night of August 2026. 31 days captured. Looking back at this month—from late-night AI latency wins with Kabir to Rohan's acoustic jams, Priya's Old City chai, and Maya's departure for London. This month was lived fully.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-31T22:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_sep_01",
    "userId": "guest_user",
    "content": "Maya called from her London flat! She was walking near Holborn and LSE. Her voice was full of wonder. We laughed that her golden scarf is already getting heavy use in the UK drizzle.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-09-01T09:00:00Z",
    "status": "received"
  },
  {
    "id": "cap_sep_02",
    "userId": "guest_user",
    "content": "Worked with Kabir and Ananya on polishing the timeline view switcher and hand-drawn story graph cards. The synthesis of weekly and monthly collages feels so personal.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-09-02T14:30:00Z",
    "status": "received"
  },
  {
    "id": "cap_sep_03",
    "userId": "guest_user",
    "content": "Voice note recorded at Third Wave Coffee. Met Sarah to review user testing feedback. People love how Memoiary automatically highlights their friends and places without manual tagging.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-09-03T11:20:00Z",
    "status": "received"
  },
  {
    "id": "cap_sep_04",
    "userId": "guest_user",
    "content": "Tested all UI views and memory engine extractors against our complete August data. People, places, timeline modes, and graph connections rendering with complete integrity.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-09-04T18:00:00Z",
    "status": "received"
  }
];

export const AI_EXTRACTED_CAPTURES: CaptureSession[] = [
  {
    "id": "cap_aug_01_a",
    "userId": "guest_user",
    "content": "Starting August with a quiet morning at Third Wave Coffee in Jubilee Hills. Maya joined me with her golden brown scarf and physical paper journal. We talked about how fast this year is moving and her upcoming move to London for LSE next month. The morning sun hit the patio just right.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-01T09:30:00Z",
    "status": "reconciled",
    "title": "Morning Coffee & Quiet Reflections with Maya",
    "dimensions": {
      "title": "Morning Coffee & Quiet Reflections with Maya",
      "summary": "Reflective morning coffee date with Maya at Third Wave Coffee discussing her upcoming move to London and the fast passage of time.",
      "mood": "reflective",
      "tone": "contemplative",
      "emotions": [
        {
          "label": "nostalgia",
          "intensity": 0.8,
          "valence": "mixed"
        },
        {
          "label": "serenity",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "anticipation",
          "intensity": 0.6,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya"
      ],
      "places": [
        "Third Wave Coffee",
        "Jubilee Hills",
        "London"
      ],
      "topics": [
        "passage of time",
        "academic transition",
        "friendship rituals"
      ],
      "timeContext": "August 1, 2026 (morning)",
      "rawAnalysis": "Strong emotional grounding around life transitions and physical relocation to London."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_01_a",
        "userId": "guest_user",
        "captureId": "cap_aug_01_a",
        "title": "Morning Coffee & Quiet Reflections with Maya",
        "summary": "Reflective morning coffee date with Maya at Third Wave Coffee discussing her upcoming move to London and the fast passage of time.",
        "date": "2026-08-01",
        "location": "Third Wave Coffee",
        "entitiesInvolved": [
          "Maya",
          "Third Wave Coffee",
          "Jubilee Hills",
          "London"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-01T09:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_01_b",
    "userId": "guest_user",
    "content": "Captured this photo of the monsoon clouds breaking over the Jubilee Hills skyline after work. Shared chai with Ananya on the balcony while reviewing color swatches for the memory app.",
    "source": "image",
    "mediaUrl": "/images/rooftop-chai.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-01T17:45:00Z",
    "status": "reconciled",
    "title": "Monsoon Dusk & Studio Skylines with Ananya",
    "dimensions": {
      "title": "Monsoon Dusk & Studio Skylines with Ananya",
      "summary": "Photograph captured of monsoon clouds over Jubilee Hills skyline while taking a tea break with Ananya after a design jam.",
      "mood": "serene",
      "tone": "poetic",
      "emotions": [
        {
          "label": "contentment",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "inspiration",
          "intensity": 0.7,
          "valence": "positive"
        }
      ],
      "people": [
        "Ananya"
      ],
      "places": [
        "Jubilee Hills"
      ],
      "topics": [
        "monsoon weather",
        "shared chai",
        "design collaboration",
        "urban skyline"
      ],
      "timeContext": "August 1, 2026 (dusk)",
      "rawAnalysis": "Visual capture capturing aesthetic atmosphere and creative camaraderie.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /images/rooftop-chai.jpg"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_01_b",
        "userId": "guest_user",
        "captureId": "cap_aug_01_b",
        "title": "Monsoon Dusk & Studio Skylines with Ananya",
        "summary": "Photograph captured of monsoon clouds over Jubilee Hills skyline while taking a tea break with Ananya after a design jam.",
        "date": "2026-08-01",
        "location": "Jubilee Hills",
        "entitiesInvolved": [
          "Ananya",
          "Jubilee Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-01T17:45:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_02",
    "userId": "guest_user",
    "content": "Voice note from my evening walk around KBR National Park perimeter. The monsoon breeze was incredible today. I was thinking about how memory isn't just a record of what happened, but a living narrative of who we were becoming in those quiet, unscripted moments.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-02T18:15:00Z",
    "status": "reconciled",
    "title": "KBR Park Evening Solitude & Memory Musings",
    "dimensions": {
      "title": "KBR Park Evening Solitude & Memory Musings",
      "summary": "Voice memo recorded during an evening walk around KBR National Park contemplating how memories evolve like living narratives.",
      "mood": "reflective",
      "tone": "contemplative",
      "emotions": [
        {
          "label": "peacefulness",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "philosophical wonder",
          "intensity": 0.75,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "KBR National Park"
      ],
      "topics": [
        "nature of memory",
        "personal growth",
        "monsoon breeze",
        "identity"
      ],
      "timeContext": "August 2, 2026 (evening)",
      "rawAnalysis": "Solo reflective voice note emphasizing memory persistence and self-inquiry."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_02",
        "userId": "guest_user",
        "captureId": "cap_aug_02",
        "title": "KBR Park Evening Solitude & Memory Musings",
        "summary": "Voice memo recorded during an evening walk around KBR National Park contemplating how memories evolve like living narratives.",
        "date": "2026-08-02",
        "location": "KBR National Park",
        "entitiesInvolved": [
          "KBR National Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-02T18:15:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_03",
    "userId": "guest_user",
    "content": "Sprint planning day with Kabir at Mindspace IT Park. He had his wireframe glasses on and rust-orange sweater despite the mild AC. We sketched out the graph memory reconciliation pipeline—how entity nodes like people and places should connect to autobiographical episodes.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-03T11:00:00Z",
    "status": "reconciled",
    "title": "Sprint Planning Session with Kabir at Mindspace",
    "dimensions": {
      "title": "Sprint Planning Session with Kabir at Mindspace",
      "summary": "Productive technical planning session with Kabir at Mindspace IT Park mapping out the autobiographical memory reconciliation graph pipeline.",
      "mood": "focused",
      "tone": "professional",
      "emotions": [
        {
          "label": "intellectual engagement",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "camaraderie",
          "intensity": 0.75,
          "valence": "positive"
        }
      ],
      "people": [
        "Kabir"
      ],
      "places": [
        "Mindspace IT Park"
      ],
      "topics": [
        "sprint planning",
        "graph memory architecture",
        "entity disambiguation",
        "reconciliation pipeline"
      ],
      "timeContext": "August 3, 2026 (workday)",
      "rawAnalysis": "Technical work context highlighting system architecture alignment with Kabir."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_03",
        "userId": "guest_user",
        "captureId": "cap_aug_03",
        "title": "Sprint Planning Session with Kabir at Mindspace",
        "summary": "Productive technical planning session with Kabir at Mindspace IT Park mapping out the autobiographical memory reconciliation graph pipeline.",
        "date": "2026-08-03",
        "location": "Mindspace IT Park",
        "entitiesInvolved": [
          "Kabir",
          "Mindspace IT Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-03T11:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_04_a",
    "userId": "guest_user",
    "content": "Ananya stopped by the studio while rain poured over Banjara Hills. She brought sketchpads with vibrant color swatches for the app's visual identity. We drank hot chai and watched the rain wash over the trees.",
    "source": "image",
    "mediaUrl": "/images/rooftop-chai.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-04T16:45:00Z",
    "status": "reconciled",
    "title": "Rainy Afternoon Design Studio Jam with Ananya",
    "dimensions": {
      "title": "Rainy Afternoon Design Studio Jam with Ananya",
      "summary": "Ananya visited the Banjara Hills studio during heavy rainfall to sketch hand-drawn card UI layouts over hot chai.",
      "mood": "cozy",
      "tone": "collaborative",
      "emotions": [
        {
          "label": "creativity",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "warmth",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [
        "Ananya"
      ],
      "places": [
        "Banjara Hills",
        "Studio"
      ],
      "topics": [
        "visual design identity",
        "hand-drawn sketches",
        "rainy day chai"
      ],
      "timeContext": "August 4, 2026 (afternoon)",
      "rawAnalysis": "Creative focus on tactile UI design and aesthetics with Ananya.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /images/rooftop-chai.jpg"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_04_a",
        "userId": "guest_user",
        "captureId": "cap_aug_04_a",
        "title": "Rainy Afternoon Design Studio Jam with Ananya",
        "summary": "Ananya visited the Banjara Hills studio during heavy rainfall to sketch hand-drawn card UI layouts over hot chai.",
        "date": "2026-08-04",
        "location": "Banjara Hills",
        "entitiesInvolved": [
          "Ananya",
          "Banjara Hills",
          "Studio"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-04T16:45:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_04_b",
    "userId": "guest_user",
    "content": "Late evening voice memo while organizing my desk. Realized how much calmer I feel when working on tactile design systems rather than pure code optimization.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-04T21:30:00Z",
    "status": "reconciled",
    "title": "Desk Setup Reorganization & Digital Cleanout",
    "dimensions": {
      "title": "Desk Setup Reorganization & Digital Cleanout",
      "summary": "Late evening voice note while reorganizing physical desk setup and archiving older project folders to clear mental space.",
      "mood": "orderly",
      "tone": "casual",
      "emotions": [
        {
          "label": "relief",
          "intensity": 0.7,
          "valence": "positive"
        },
        {
          "label": "clarity",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "Home Office"
      ],
      "topics": [
        "workspace optimization",
        "digital decluttering",
        "focus"
      ],
      "timeContext": "August 4, 2026 (night)",
      "rawAnalysis": "Routine organizational capture reflecting personal clarity."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_04_b",
        "userId": "guest_user",
        "captureId": "cap_aug_04_b",
        "title": "Desk Setup Reorganization & Digital Cleanout",
        "summary": "Late evening voice note while reorganizing physical desk setup and archiving older project folders to clear mental space.",
        "date": "2026-08-04",
        "location": "Home Office",
        "entitiesInvolved": [
          "Home Office"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-04T21:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_05",
    "userId": "guest_user",
    "content": "Product alignment lunch with Sarah at Roastery Coffee House. She reminded me that users don't want another complex database—they want a sanctuary that preserves how their days felt. Validated our memory stream interface.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-05T14:20:00Z",
    "status": "reconciled",
    "title": "Testing Entity Resolution Benchmarks with Kabir",
    "dimensions": {
      "title": "Testing Entity Resolution Benchmarks with Kabir",
      "summary": "Benchmarking person graph algorithms with Kabir at the office, resolving duplicate entity nodes cleanly.",
      "mood": "accomplished",
      "tone": "analytical",
      "emotions": [
        {
          "label": "satisfaction",
          "intensity": 0.8,
          "valence": "positive"
        },
        {
          "label": "curiosity",
          "intensity": 0.75,
          "valence": "positive"
        }
      ],
      "people": [
        "Kabir"
      ],
      "places": [
        "Mindspace IT Park"
      ],
      "topics": [
        "entity resolution",
        "graph algorithms",
        "benchmarks"
      ],
      "timeContext": "August 5, 2026 (afternoon)",
      "rawAnalysis": "Core engineering milestone in graph reconciliation."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_05",
        "userId": "guest_user",
        "captureId": "cap_aug_05",
        "title": "Testing Entity Resolution Benchmarks with Kabir",
        "summary": "Benchmarking person graph algorithms with Kabir at the office, resolving duplicate entity nodes cleanly.",
        "date": "2026-08-05",
        "location": "Mindspace IT Park",
        "entitiesInvolved": [
          "Kabir",
          "Mindspace IT Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-05T14:20:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_06_a",
    "userId": "guest_user",
    "content": "Voice note recorded at Mindspace IT Park during lunch break with Kabir. Discussed prompt fallback ladders between Gemini 3.6 Flash and Gemini 3.1 Pro Preview to guarantee zero downtime during peak inference bursts.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-06T13:00:00Z",
    "status": "reconciled",
    "title": "Morning Jog through KBR Trail & Birdsong",
    "dimensions": {
      "title": "Morning Jog through KBR Trail & Birdsong",
      "summary": "Early morning voice note after a 5km jog through KBR National Park listening to bird calls in fresh post-rain air.",
      "mood": "energized",
      "tone": "upbeat",
      "emotions": [
        {
          "label": "vitality",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "clarity",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "KBR National Park"
      ],
      "topics": [
        "morning fitness",
        "monsoon air",
        "birdsong"
      ],
      "timeContext": "August 6, 2026 (morning)",
      "rawAnalysis": "Physical wellness and nature sensory experience."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_06_a",
        "userId": "guest_user",
        "captureId": "cap_aug_06_a",
        "title": "Morning Jog through KBR Trail & Birdsong",
        "summary": "Early morning voice note after a 5km jog through KBR National Park listening to bird calls in fresh post-rain air.",
        "date": "2026-08-06",
        "location": "KBR National Park",
        "entitiesInvolved": [
          "KBR National Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-06T13:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_06_b",
    "userId": "guest_user",
    "content": "Late night voice note. Dinner with Maya and Kabir earlier. We laughed about how Kabir tried to explain vector embeddings to Maya over pasta, and Maya countered with a quote from Virginia Woolf. It struck me how rare these simple dinners are.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-06T21:10:00Z",
    "status": "reconciled",
    "title": "Dinner at Roast CCX with Rohan & Project Catchup",
    "dimensions": {
      "title": "Dinner at Roast CCX with Rohan & Project Catchup",
      "summary": "Caught up with Rohan over wood-fired pizza at Roast CCX, discussing his new AI hardware startup idea.",
      "mood": "convivial",
      "tone": "warm",
      "emotions": [
        {
          "label": "excitement",
          "intensity": 0.8,
          "valence": "positive"
        },
        {
          "label": "friendship",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Rohan"
      ],
      "places": [
        "Roast CCX",
        "Jubilee Hills"
      ],
      "topics": [
        "hardware startup",
        "entrepreneurship",
        "wood-fired pizza"
      ],
      "timeContext": "August 6, 2026 (night)",
      "rawAnalysis": "Social connection with Rohan highlighting entrepreneurial brainstorming."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_06_b",
        "userId": "guest_user",
        "captureId": "cap_aug_06_b",
        "title": "Dinner at Roast CCX with Rohan & Project Catchup",
        "summary": "Caught up with Rohan over wood-fired pizza at Roast CCX, discussing his new AI hardware startup idea.",
        "date": "2026-08-06",
        "location": "Roast CCX",
        "entitiesInvolved": [
          "Rohan",
          "Roast CCX",
          "Jubilee Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-06T21:10:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_07",
    "userId": "guest_user",
    "content": "Quick video recording capturing the golden hour light filtering through the neem trees at KBR Park. The sound of birds before sunset was so calming after a long week of code reviews.",
    "source": "video",
    "mediaUrl": "/assets/poster-end.png",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-07T17:30:00Z",
    "status": "reconciled",
    "title": "Code Review & Refactoring Epistemic State Machine",
    "dimensions": {
      "title": "Code Review & Refactoring Epistemic State Machine",
      "summary": "Deep work block streamlining epistemic state transitions (USER_SAID vs AI_INFERRED) in the core memory schema.",
      "mood": "deep focus",
      "tone": "technical",
      "emotions": [
        {
          "label": "flow state",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "Studio"
      ],
      "topics": [
        "epistemic state",
        "code architecture",
        "refactoring"
      ],
      "timeContext": "August 7, 2026 (day)",
      "rawAnalysis": "Technical precision around data provenance model.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /assets/poster-end.png"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_07",
        "userId": "guest_user",
        "captureId": "cap_aug_07",
        "title": "Code Review & Refactoring Epistemic State Machine",
        "summary": "Deep work block streamlining epistemic state transitions (USER_SAID vs AI_INFERRED) in the core memory schema.",
        "date": "2026-08-07",
        "location": "Studio",
        "entitiesInvolved": [
          "Studio"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-07T17:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_08",
    "userId": "guest_user",
    "content": "Spent 4 hours at Tattva Cafe with Ananya and Maya. Ananya was painting hand-drawn watercolor icons on her tablet while Maya read her LSE orientation materials. I worked on entity extraction prompt templates.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-08T15:00:00Z",
    "status": "reconciled",
    "title": "Weekend Trip Planning to Ananthagiri Hills with Maya",
    "dimensions": {
      "title": "Weekend Trip Planning to Ananthagiri Hills with Maya",
      "summary": "Café chat with Maya planning a weekend trek to Ananthagiri Hills before her departure to London next month.",
      "mood": "joyful",
      "tone": "enthusiastic",
      "emotions": [
        {
          "label": "anticipation",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "warmth",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya"
      ],
      "places": [
        "Third Wave Coffee",
        "Ananthagiri Hills"
      ],
      "topics": [
        "weekend trek",
        "nature getaway",
        "friendship farewell"
      ],
      "timeContext": "August 8, 2026 (weekend)",
      "rawAnalysis": "Planning outdoor trip with Maya as part of farewell series."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_08",
        "userId": "guest_user",
        "captureId": "cap_aug_08",
        "title": "Weekend Trip Planning to Ananthagiri Hills with Maya",
        "summary": "Café chat with Maya planning a weekend trek to Ananthagiri Hills before her departure to London next month.",
        "date": "2026-08-08",
        "location": "Third Wave Coffee",
        "entitiesInvolved": [
          "Maya",
          "Third Wave Coffee",
          "Ananthagiri Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-08T15:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_09",
    "userId": "guest_user",
    "content": "Voice memo at Third Wave. Maya brought her packing checklist for London. It feels surreal that in three weeks she'll be across the ocean. We agreed to do a weekly memory audio sync once she settles.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-09T10:15:00Z",
    "status": "reconciled",
    "title": "Sunday Reading Session: Philosophy of Time & Mind",
    "dimensions": {
      "title": "Sunday Reading Session: Philosophy of Time & Mind",
      "summary": "Spent Sunday afternoon reading Henri Bergson's Matter and Memory on the balcony while sipping Earl Grey tea.",
      "mood": "philosophical",
      "tone": "reflective",
      "emotions": [
        {
          "label": "intellectual serenity",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "Home Balcony"
      ],
      "topics": [
        "Bergson philosophy",
        "duration of time",
        "subjective memory"
      ],
      "timeContext": "August 9, 2026 (Sunday)",
      "rawAnalysis": "Philosophical inspiration directly informing memory engine design."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_09",
        "userId": "guest_user",
        "captureId": "cap_aug_09",
        "title": "Sunday Reading Session: Philosophy of Time & Mind",
        "summary": "Spent Sunday afternoon reading Henri Bergson's Matter and Memory on the balcony while sipping Earl Grey tea.",
        "date": "2026-08-09",
        "location": "Home Balcony",
        "entitiesInvolved": [
          "Home Balcony"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-09T10:15:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_10",
    "userId": "guest_user",
    "content": "Kabir cracked the prompt latency bottleneck! We cut inference response time from 3.2 seconds down to 800ms using structured JSON outputs and fallback model routing. Celebrated with late-night biryani.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-10T19:40:00Z",
    "status": "reconciled",
    "title": "Weekly Sync with Kabir, Ananya & Sarah",
    "dimensions": {
      "title": "Weekly Sync with Kabir, Ananya & Sarah",
      "summary": "Full team sync reviewing UX prototypes with Ananya, backend graph progress with Kabir, and launch timelines with Sarah.",
      "mood": "collaborative",
      "tone": "structured",
      "emotions": [
        {
          "label": "alignment",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "optimism",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [
        "Kabir",
        "Ananya",
        "Sarah"
      ],
      "places": [
        "Mindspace IT Park"
      ],
      "topics": [
        "team sync",
        "UX prototypes",
        "graph engine",
        "launch roadmap"
      ],
      "timeContext": "August 10, 2026 (morning)",
      "rawAnalysis": "Cross-functional team alignment with all core collaborators."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_10",
        "userId": "guest_user",
        "captureId": "cap_aug_10",
        "title": "Weekly Sync with Kabir, Ananya & Sarah",
        "summary": "Full team sync reviewing UX prototypes with Ananya, backend graph progress with Kabir, and launch timelines with Sarah.",
        "date": "2026-08-10",
        "location": "Mindspace IT Park",
        "entitiesInvolved": [
          "Kabir",
          "Ananya",
          "Sarah",
          "Mindspace IT Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-10T19:40:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_11",
    "userId": "guest_user",
    "content": "Took an hour off in the afternoon to walk along Hussain Sagar lakefront. The cool monsoon air cleared my head. Sometimes walking away from the screen is the fastest way to solve an architectural block.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-11T13:00:00Z",
    "status": "reconciled",
    "title": "Voice Memo: Reflections on Digital Identity & Privacy",
    "dimensions": {
      "title": "Voice Memo: Reflections on Digital Identity & Privacy",
      "summary": "Evening audio note recording thoughts on user data ownership and offline zero-knowledge privacy in personal AI.",
      "mood": "serious",
      "tone": "thoughtful",
      "emotions": [
        {
          "label": "conviction",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "Studio"
      ],
      "topics": [
        "data privacy",
        "user sovereignty",
        "ethical AI"
      ],
      "timeContext": "August 11, 2026 (evening)",
      "rawAnalysis": "Ethical framing of privacy boundaries in memory storage."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_11",
        "userId": "guest_user",
        "captureId": "cap_aug_11",
        "title": "Voice Memo: Reflections on Digital Identity & Privacy",
        "summary": "Evening audio note recording thoughts on user data ownership and offline zero-knowledge privacy in personal AI.",
        "date": "2026-08-11",
        "location": "Studio",
        "entitiesInvolved": [
          "Studio"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-11T13:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_12",
    "userId": "guest_user",
    "content": "Recorded this voice note while organizing my bookshelves. Rohan called from Bengaluru to say he's taking the Friday train down for the weekend! Maya is coming over too. Can't wait to have everyone together.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-12T20:30:00Z",
    "status": "reconciled",
    "title": "Coffee with Rohan: Hardware Prototypes & Sensors",
    "dimensions": {
      "title": "Coffee with Rohan: Hardware Prototypes & Sensors",
      "summary": "Met Rohan at Hole in the Wall Cafe to inspect his ambient audio capture hardware prototype.",
      "mood": "curious",
      "tone": "geeky",
      "emotions": [
        {
          "label": "fascination",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Rohan"
      ],
      "places": [
        "Hole in the Wall Cafe",
        "Jubilee Hills"
      ],
      "topics": [
        "hardware prototype",
        "ambient recording",
        "sensor tech"
      ],
      "timeContext": "August 12, 2026 (afternoon)",
      "rawAnalysis": "Hardware exploration session with Rohan."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_12",
        "userId": "guest_user",
        "captureId": "cap_aug_12",
        "title": "Coffee with Rohan: Hardware Prototypes & Sensors",
        "summary": "Met Rohan at Hole in the Wall Cafe to inspect his ambient audio capture hardware prototype.",
        "date": "2026-08-12",
        "location": "Hole in the Wall Cafe",
        "entitiesInvolved": [
          "Rohan",
          "Hole in the Wall Cafe",
          "Jubilee Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-12T20:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_13",
    "userId": "guest_user",
    "content": "Captured a picture of my espresso and handwritten notes during a review session with Sarah. We finalized the privacy architecture: strict single-tenant user partitioning in Firestore.",
    "source": "image",
    "mediaUrl": "/images/cafe-notes.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-13T16:20:00Z",
    "status": "reconciled",
    "title": "Sunset Photography Session at Durgam Cheruvu Lake",
    "dimensions": {
      "title": "Sunset Photography Session at Durgam Cheruvu Lake",
      "summary": "Walked across Durgam Cheruvu cable bridge capturing photos of monsoon clouds reflected on the lake water.",
      "mood": "awe",
      "tone": "artistic",
      "emotions": [
        {
          "label": "wonder",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "peace",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "Durgam Cheruvu",
        "Knowledge City"
      ],
      "topics": [
        "sunset photography",
        "monsoon reflections",
        "urban nature"
      ],
      "timeContext": "August 13, 2026 (sunset)",
      "rawAnalysis": "Visual aesthetic photo capture.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /images/cafe-notes.jpg"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_13",
        "userId": "guest_user",
        "captureId": "cap_aug_13",
        "title": "Sunset Photography Session at Durgam Cheruvu Lake",
        "summary": "Walked across Durgam Cheruvu cable bridge capturing photos of monsoon clouds reflected on the lake water.",
        "date": "2026-08-13",
        "location": "Durgam Cheruvu",
        "entitiesInvolved": [
          "Durgam Cheruvu",
          "Knowledge City"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-13T16:20:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_14",
    "userId": "guest_user",
    "content": "Rohan arrived from Bengaluru with his acoustic guitar in his signature dark green jacket. Kabir brought takeout, and Maya arrived right after work. Rohan played a new melody he composed during his train ride.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-14T22:15:00Z",
    "status": "reconciled",
    "title": "Deep Dive into Temporal Memory Clustering with Kabir",
    "dimensions": {
      "title": "Deep Dive into Temporal Memory Clustering with Kabir",
      "summary": "Whiteboarding session with Kabir refining how memory episodes cluster by temporal proximity and thematic affinity.",
      "mood": "analytical",
      "tone": "rigorous",
      "emotions": [
        {
          "label": "breakthrough joy",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Kabir"
      ],
      "places": [
        "Mindspace IT Park"
      ],
      "topics": [
        "temporal clustering",
        "memory episodes",
        "algorithm design"
      ],
      "timeContext": "August 14, 2026 (afternoon)",
      "rawAnalysis": "Algorithm innovation block with Kabir."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_14",
        "userId": "guest_user",
        "captureId": "cap_aug_14",
        "title": "Deep Dive into Temporal Memory Clustering with Kabir",
        "summary": "Whiteboarding session with Kabir refining how memory episodes cluster by temporal proximity and thematic affinity.",
        "date": "2026-08-14",
        "location": "Mindspace IT Park",
        "entitiesInvolved": [
          "Kabir",
          "Mindspace IT Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-14T22:15:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_15_a",
    "userId": "guest_user",
    "content": "Morning voice note at home studio. Making breakfast for Rohan, Maya, and Kabir before we head out for the weekend drive around Hyderabad.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-15T10:00:00Z",
    "status": "reconciled",
    "title": "Independence Day Breakfast with Family & Friends",
    "dimensions": {
      "title": "Independence Day Breakfast with Family & Friends",
      "summary": "Morning breakfast gathering with Maya, Rohan, and family eating hot idlis and dosa while watching the flag hoisting.",
      "mood": "festive",
      "tone": "warm",
      "emotions": [
        {
          "label": "patriotism",
          "intensity": 0.8,
          "valence": "positive"
        },
        {
          "label": "community warmth",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya",
        "Rohan"
      ],
      "places": [
        "Jubilee Hills"
      ],
      "topics": [
        "Independence Day",
        "traditional breakfast",
        "community"
      ],
      "timeContext": "August 15, 2026 (morning)",
      "rawAnalysis": "Holiday social celebration with close circle."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_15_a",
        "userId": "guest_user",
        "captureId": "cap_aug_15_a",
        "title": "Independence Day Breakfast with Family & Friends",
        "summary": "Morning breakfast gathering with Maya, Rohan, and family eating hot idlis and dosa while watching the flag hoisting.",
        "date": "2026-08-15",
        "location": "Jubilee Hills",
        "entitiesInvolved": [
          "Maya",
          "Rohan",
          "Jubilee Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-15T10:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_15_b",
    "userId": "guest_user",
    "content": "Photo of espresso and napkin sketches at Tattva Cafe with Rohan and Ananya during our afternoon break.",
    "source": "image",
    "mediaUrl": "/images/cafe-notes.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-15T14:30:00Z",
    "status": "reconciled",
    "title": "Afternoon Studio Session: Crafting Collage Engine",
    "dimensions": {
      "title": "Afternoon Studio Session: Crafting Collage Engine",
      "summary": "Building the automatic visual collage generator that stitches photos and quotes into weekly summary cards.",
      "mood": "creative",
      "tone": "focused",
      "emotions": [
        {
          "label": "artistic pride",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "Studio"
      ],
      "topics": [
        "collage engine",
        "UI components",
        "weekly summaries"
      ],
      "timeContext": "August 15, 2026 (afternoon)",
      "rawAnalysis": "UI engineering focus on story collages.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /images/cafe-notes.jpg"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_15_b",
        "userId": "guest_user",
        "captureId": "cap_aug_15_b",
        "title": "Afternoon Studio Session: Crafting Collage Engine",
        "summary": "Building the automatic visual collage generator that stitches photos and quotes into weekly summary cards.",
        "date": "2026-08-15",
        "location": "Studio",
        "entitiesInvolved": [
          "Studio"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-15T14:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_15_c",
    "userId": "guest_user",
    "content": "Video memory: Driving across Durgam Cheruvu Cable Bridge with Rohan, Maya, Kabir, and Ananya at sunset. Rohan was playing his guitar in the backseat while the city lights came alive over the water.",
    "source": "video",
    "mediaUrl": "/assets/poster-end.png",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-15T19:00:00Z",
    "status": "reconciled",
    "title": "Late Night Voice Memo: Independence & Personal Freedom",
    "dimensions": {
      "title": "Late Night Voice Memo: Independence & Personal Freedom",
      "summary": "Quiet late night reflection on what freedom means in creative work and building meaningful software.",
      "mood": "reflective",
      "tone": "introspective",
      "emotions": [
        {
          "label": "gratitude",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "Home"
      ],
      "topics": [
        "creative freedom",
        "purpose",
        "software craft"
      ],
      "timeContext": "August 15, 2026 (night)",
      "rawAnalysis": "Introspective voice memo on autonomy and craft.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /assets/poster-end.png"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_15_c",
        "userId": "guest_user",
        "captureId": "cap_aug_15_c",
        "title": "Late Night Voice Memo: Independence & Personal Freedom",
        "summary": "Quiet late night reflection on what freedom means in creative work and building meaningful software.",
        "date": "2026-08-15",
        "location": "Home",
        "entitiesInvolved": [
          "Home"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-15T19:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_16",
    "userId": "guest_user",
    "content": "Sunday brunch at Tattva Cafe before Rohan headed back to Bengaluru. Ananya sketched a quick caricature of Rohan playing guitar on a napkin. We promised to meet up in Bengaluru next month.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-16T17:45:00Z",
    "status": "reconciled",
    "title": "Trek to Ananthagiri Hills with Maya & Rohan",
    "dimensions": {
      "title": "Trek to Ananthagiri Hills with Maya & Rohan",
      "summary": "Full day trek through lush green Ananthagiri forests with Maya and Rohan. Misty weather, wild trails, and endless laughing.",
      "mood": "exhilarated",
      "tone": "adventurous",
      "emotions": [
        {
          "label": "joy",
          "intensity": 0.95,
          "valence": "positive"
        },
        {
          "label": "friendship bond",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya",
        "Rohan"
      ],
      "places": [
        "Ananthagiri Hills",
        "Vikarabad"
      ],
      "topics": [
        "forest trek",
        "monsoon mist",
        "wilderness",
        "friendship memory"
      ],
      "timeContext": "August 16, 2026 (all day)",
      "rawAnalysis": "Major outdoor milestone event with Maya and Rohan."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_16",
        "userId": "guest_user",
        "captureId": "cap_aug_16",
        "title": "Trek to Ananthagiri Hills with Maya & Rohan",
        "summary": "Full day trek through lush green Ananthagiri forests with Maya and Rohan. Misty weather, wild trails, and endless laughing.",
        "date": "2026-08-16",
        "location": "Ananthagiri Hills",
        "entitiesInvolved": [
          "Maya",
          "Rohan",
          "Ananthagiri Hills",
          "Vikarabad"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-16T17:45:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_17",
    "userId": "guest_user",
    "content": "Quick voice note walking into the office. The energy from the weekend with Rohan, Maya, and Kabir gave me so much motivation. We are building something really meaningful here.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-17T09:30:00Z",
    "status": "reconciled",
    "title": "Rest Day & Photo Sorting after Ananthagiri Trek",
    "dimensions": {
      "title": "Rest Day & Photo Sorting after Ananthagiri Trek",
      "summary": "Lazy Monday evening organizing trek photos and creating a shared album with Maya and Rohan.",
      "mood": "relaxed",
      "tone": "casual",
      "emotions": [
        {
          "label": "satisfaction",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya",
        "Rohan"
      ],
      "places": [
        "Home"
      ],
      "topics": [
        "photo curation",
        "memories",
        "rest"
      ],
      "timeContext": "August 17, 2026 (evening)",
      "rawAnalysis": "Post-event curation and memory anchoring."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_17",
        "userId": "guest_user",
        "captureId": "cap_aug_17",
        "title": "Rest Day & Photo Sorting after Ananthagiri Trek",
        "summary": "Lazy Monday evening organizing trek photos and creating a shared album with Maya and Rohan.",
        "date": "2026-08-17",
        "location": "Home",
        "entitiesInvolved": [
          "Maya",
          "Rohan",
          "Home"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-17T09:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_18",
    "userId": "guest_user",
    "content": "Two coffees, three pages of design specs, one core idea that stayed: memory isn't chronological cataloging—it's emotional clustering around people, places, and meaningful shifts.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-18T16:00:00Z",
    "status": "reconciled",
    "title": "Design Review of Person Graph Cards with Ananya",
    "dimensions": {
      "title": "Design Review of Person Graph Cards with Ananya",
      "summary": "Reviewed Ananya's hand-drawn avatars and artistic background textures for person detail cards.",
      "mood": "inspired",
      "tone": "artistic",
      "emotions": [
        {
          "label": "aesthetic delight",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [
        "Ananya"
      ],
      "places": [
        "Studio",
        "Banjara Hills"
      ],
      "topics": [
        "hand-drawn UI",
        "ArtisticAvatar",
        "design system"
      ],
      "timeContext": "August 18, 2026 (afternoon)",
      "rawAnalysis": "UI visual design alignment with Ananya."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_18",
        "userId": "guest_user",
        "captureId": "cap_aug_18",
        "title": "Design Review of Person Graph Cards with Ananya",
        "summary": "Reviewed Ananya's hand-drawn avatars and artistic background textures for person detail cards.",
        "date": "2026-08-18",
        "location": "Studio",
        "entitiesInvolved": [
          "Ananya",
          "Studio",
          "Banjara Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-18T16:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_19",
    "userId": "guest_user",
    "content": "Rainy afternoon picture. Maya stopped by after her visa appointment to celebrate her approved UK visa! We left our rain-drenched shoes at the doorway and made hot ginger tea.",
    "source": "image",
    "mediaUrl": "/images/doorway-shoes.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-19T14:10:00Z",
    "status": "reconciled",
    "title": "Voice Memo: The Beauty of Unstructured Audio Journaling",
    "dimensions": {
      "title": "Voice Memo: The Beauty of Unstructured Audio Journaling",
      "summary": "Reflecting on how voice journaling captures subtle emotional inflections that typing often flattens.",
      "mood": "contemplative",
      "tone": "thoughtful",
      "emotions": [
        {
          "label": "mindfulness",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [],
      "places": [
        "Car Drive"
      ],
      "topics": [
        "voice notes",
        "emotional tone",
        "journaling modalities"
      ],
      "timeContext": "August 19, 2026 (dusk)",
      "rawAnalysis": "Reflection on input modality nuances.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /images/doorway-shoes.jpg"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_19",
        "userId": "guest_user",
        "captureId": "cap_aug_19",
        "title": "Voice Memo: The Beauty of Unstructured Audio Journaling",
        "summary": "Reflecting on how voice journaling captures subtle emotional inflections that typing often flattens.",
        "date": "2026-08-19",
        "location": "Car Drive",
        "entitiesInvolved": [
          "Car Drive"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-19T14:10:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_20",
    "userId": "guest_user",
    "content": "Deep technical session with Kabir and Sarah. We reviewed how person graphs maintain persistent visual identities and traits as users journal about their friends over time.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-20T18:30:00Z",
    "status": "reconciled",
    "title": "Preparation for Maya's Farewell Party",
    "dimensions": {
      "title": "Preparation for Maya's Farewell Party",
      "summary": "Met Ananya and Kabir to plan Maya's surprise farewell dinner next week before her flight to London.",
      "mood": "warm & sentimental",
      "tone": "caring",
      "emotions": [
        {
          "label": "affection",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "bittersweetness",
          "intensity": 0.7,
          "valence": "mixed"
        }
      ],
      "people": [
        "Maya",
        "Kabir",
        "Ananya"
      ],
      "places": [
        "Jubilee Hills"
      ],
      "topics": [
        "farewell planning",
        "surprise party",
        "friendship gift"
      ],
      "timeContext": "August 20, 2026 (evening)",
      "rawAnalysis": "Group coordination for Maya's send-off."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_20",
        "userId": "guest_user",
        "captureId": "cap_aug_20",
        "title": "Preparation for Maya's Farewell Party",
        "summary": "Met Ananya and Kabir to plan Maya's surprise farewell dinner next week before her flight to London.",
        "date": "2026-08-20",
        "location": "Jubilee Hills",
        "entitiesInvolved": [
          "Maya",
          "Kabir",
          "Ananya",
          "Jubilee Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-20T18:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_21_a",
    "userId": "guest_user",
    "content": "Morning code freeze sync with Kabir at Mindspace IT Park. Verified build artifacts and test suite coverage before our evening strategy dinner.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-21T11:00:00Z",
    "status": "reconciled",
    "title": "Morning Standup & Memory Pipeline Demo",
    "dimensions": {
      "title": "Morning Standup & Memory Pipeline Demo",
      "summary": "Demonstrated real-time emotion extraction and entity linking to Kabir and Sarah in the morning standup.",
      "mood": "focused",
      "tone": "professional",
      "emotions": [
        {
          "label": "pride",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [
        "Kabir",
        "Sarah"
      ],
      "places": [
        "Mindspace IT Park"
      ],
      "topics": [
        "demo",
        "pipeline",
        "emotion extraction"
      ],
      "timeContext": "August 21, 2026 (morning)",
      "rawAnalysis": "Internal milestone demonstration."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_21_a",
        "userId": "guest_user",
        "captureId": "cap_aug_21_a",
        "title": "Morning Standup & Memory Pipeline Demo",
        "summary": "Demonstrated real-time emotion extraction and entity linking to Kabir and Sarah in the morning standup.",
        "date": "2026-08-21",
        "location": "Mindspace IT Park",
        "entitiesInvolved": [
          "Kabir",
          "Sarah",
          "Mindspace IT Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-21T11:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_21_b",
    "userId": "guest_user",
    "content": "Full 4-Hour Deep Dinner Conversation with Maya, Kabir, Sarah, and Ananya at Roastery Coffee House:\n\nWe stayed at Roastery Coffee House until 11:30 PM tonight, moving from the outdoor garden patio to the inner lounge as the monsoon rain picked up. It turned into one of the most sprawling, intellectually exhilarating, and emotionally candid conversations we’ve had all year, weaving across five completely different dimensions:\n\n1. Maya's London Transition & Relocation Anxiety:\nMaya opened up about her looming move to the UK for her Master's at LSE next week. She’s currently torn between two housing options—a small studio near Bloomsbury close to the LSE campus versus a shared flat in Holborn with two international students. She talked about the visceral weight of leaving Banjara Hills, where her family has lived for twenty years. We spent an hour dissecting the emotional friction of packing up a life into two 23kg suitcases. Sarah pointed out how transitions force us to decide which memories are foundational anchors and which ones we can let go of. Maya admitted she was terrified of the academic intensity at LSE, but Ananya reminded her of how effortlessly she handled her undergraduate thesis under pressure.\n\n2. AI Memory Graph Disambiguation & Entity Resolution:\nKabir pulled out his laptop to show us a breakthrough in the graph memory engine. He had been struggling with entity disambiguation—specifically how the AI system distinguishes between two different people named 'Sarah' (e.g. Sarah our co-founder vs Sarah his cousin in Chicago) or how it resolves historical vs active relationships. He demonstrated a two-stage temporal graph reconciliation algorithm that evaluates co-occurrence context, sentiment proximity, and timestamp deltas. We debated whether entity resolution should be deterministic or probabilistic, and Kabir showed how epistemic status tags (USER_SAID vs SYSTEM_INFERRED vs USER_CONFIRMED) prevent the AI from making false hallucinated assumptions about a user's life.\n\n3. Product Sanctuary Philosophy & Anti-Therapist Guardrails:\nSarah brought the conversation back to product ethics and AI boundary design. She strongly argued that Memoiary must NEVER morph into a preachy AI therapist, life coach, or motivational bot. 'The moment an app tells a user how they *should* feel or gives unsolicited advice like *you need to stay positive*, it breaks sacred trust,' Sarah emphasized. We spent thirty minutes auditing our system instructions to enforce a strict 'objective witness' stance—inspired by ancient narrative traditions—where the system quietly reflects back patterns, connections, and time-shifted contrasts without judgment or prescription.\n\n4. Visual Design Identity & Hand-Drawn Character Personas:\nAnanya laid out her color swatches and character sketches for the app interface. She explained why she deliberately avoided slick 3D emojis and generic stock avatars in favor of tactile, pencil-and-watercolor line drawings. For Maya, she used warm terracotta and golden-brown scarf accents (#F5E5DC / #DE5239); for Kabir, soft sky blue and rust-orange (#E0F2FE / #0284C7); for Rohan, deep moss green (#E2EBD8 / #4D7C0F). Ananya argued that visual memory is deeply sensory—when users view their friend cards or weekly recaps, the artistic texture evokes warmth rather than cold digital utility.\n\n5. Time, Memory Continuity, and Lifelong Friendship:\nAs the cafe was closing, we sat in quiet reflection watching the rain stream down the glass windows. We talked about how rare it is for a group of friends with completely different backgrounds—computer science, economics, fine art, and product strategy—to remain so tightly connected over years. We realized that Memoiary itself is a testament to this friendship: built out of our late-night debates, design sessions, and shared coffee mornings. Maya smiled, held up her tea cup, and said, 'No matter where in the world we are next month, this story doesn't end—it just adds a new chapter.'",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-21T21:00:00Z",
    "status": "reconciled",
    "title": "Deep Alignment Session: London Relocation, Entity Disambiguation & Memory Architecture",
    "dimensions": {
      "title": "Deep Alignment Session: London Relocation, Entity Disambiguation & Memory Architecture",
      "summary": "A rich 3-hour discussion with Maya, Kabir, and Ananya at Third Wave Coffee covering Maya's upcoming move to London, complex entity resolution in our graph database, privacy boundary ethics for autobiographical AI, and hand-drawn card UI mockups.",
      "mood": "collaborative & reflective",
      "tone": "intellectual, warm, contemplative",
      "emotions": [
        {
          "label": "intellectual engagement",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "bittersweet nostalgia",
          "intensity": 0.8,
          "valence": "mixed"
        },
        {
          "label": "creative inspiration",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "camaraderie",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya",
        "Kabir",
        "Ananya"
      ],
      "places": [
        "Third Wave Coffee",
        "Jubilee Hills",
        "London",
        "Imperial College London"
      ],
      "topics": [
        "London relocation",
        "graph entity disambiguation",
        "privacy ethics",
        "hand-drawn card UI",
        "philosophy of fading memories",
        "autobiographical architecture"
      ],
      "timeContext": "August 21, 2026 (afternoon)",
      "rawAnalysis": "Landmark multi-topic 800-word journal entry demonstrating complex multi-entity narrative synthesis across technical, emotional, and design domains."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_21_b",
        "userId": "guest_user",
        "captureId": "cap_aug_21_b",
        "title": "Deep Alignment Session: London Relocation, Entity Disambiguation & Memory Architecture",
        "summary": "A rich 3-hour discussion with Maya, Kabir, and Ananya at Third Wave Coffee covering Maya's upcoming move to London, complex entity resolution in our graph database, privacy boundary ethics for autobiographical AI, and hand-drawn card UI mockups.",
        "date": "2026-08-21",
        "location": "Third Wave Coffee",
        "entitiesInvolved": [
          "Maya",
          "Kabir",
          "Ananya",
          "Third Wave Coffee",
          "Jubilee Hills",
          "London",
          "Imperial College London"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-21T21:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_22",
    "userId": "guest_user",
    "content": "Voice note recorded right outside Charminar! Priya flew in from Mumbai for the weekend. We got Irani chai and Osmania biscuits while Priya caught up with Maya on her London move.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-22T12:00:00Z",
    "status": "reconciled",
    "title": "Priya's Arrival from Mumbai & Irani Chai at Charminar",
    "dimensions": {
      "title": "Priya's Arrival from Mumbai & Irani Chai at Charminar",
      "summary": "Voice note recorded right outside Charminar! Priya flew in from Mumbai for the weekend. We got Irani chai and Osmania biscuits while Priya caught up with Maya on her London move.",
      "mood": "joyous",
      "tone": "lively",
      "emotions": [
        {
          "label": "elation",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "hospitality",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Priya",
        "Maya"
      ],
      "places": [
        "Charminar",
        "Old City",
        "Mumbai"
      ],
      "topics": [
        "Irani chai",
        "reunion",
        "Old City heritage",
        "London move"
      ],
      "timeContext": "August 22, 2026 (afternoon)",
      "rawAnalysis": "High-energy reunion entry introducing Priya."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_22",
        "userId": "guest_user",
        "captureId": "cap_aug_22",
        "title": "Priya's Arrival from Mumbai & Irani Chai at Charminar",
        "summary": "Voice note recorded right outside Charminar! Priya flew in from Mumbai for the weekend. We got Irani chai and Osmania biscuits while Priya caught up with Maya on her London move.",
        "date": "2026-08-22",
        "location": "Charminar",
        "entitiesInvolved": [
          "Priya",
          "Maya",
          "Charminar",
          "Old City",
          "Mumbai"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-22T12:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_23",
    "userId": "guest_user",
    "content": "Long walk in KBR Park with Priya, Maya, and Ananya. Priya was wearing her coral top, telling hilarious stories from college. We talked about how friendships evolve across cities.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-23T16:30:00Z",
    "status": "reconciled",
    "title": "Long Walk in KBR Park with Priya, Maya & Ananya",
    "dimensions": {
      "title": "Long Walk in KBR Park with Priya, Maya & Ananya",
      "summary": "Long walk in KBR Park with Priya, Maya, and Ananya. Priya was wearing her coral top, telling hilarious stories from college. We talked about how friendships evolve across cities.",
      "mood": "nostalgic & warm",
      "tone": "affectionate",
      "emotions": [
        {
          "label": "warmth",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "laughter",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Priya",
        "Maya",
        "Ananya"
      ],
      "places": [
        "KBR National Park"
      ],
      "topics": [
        "college stories",
        "evolving friendships",
        "walk in the park"
      ],
      "timeContext": "August 23, 2026 (late afternoon)",
      "rawAnalysis": "Group bonding session with 3 key female friends."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_23",
        "userId": "guest_user",
        "captureId": "cap_aug_23",
        "title": "Long Walk in KBR Park with Priya, Maya & Ananya",
        "summary": "Long walk in KBR Park with Priya, Maya, and Ananya. Priya was wearing her coral top, telling hilarious stories from college. We talked about how friendships evolve across cities.",
        "date": "2026-08-23",
        "location": "KBR National Park",
        "entitiesInvolved": [
          "Priya",
          "Maya",
          "Ananya",
          "KBR National Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-23T16:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_24",
    "userId": "guest_user",
    "content": "Saw Priya off to the airport early morning. Stopped at Third Wave Coffee before heading to work. Grateful for friends who make years feel like days when you reunite.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-24T10:00:00Z",
    "status": "reconciled",
    "title": "Bidding Farewell to Priya at Airport & Morning Coffee",
    "dimensions": {
      "title": "Bidding Farewell to Priya at Airport & Morning Coffee",
      "summary": "Saw Priya off to the airport early morning. Stopped at Third Wave Coffee before heading to work. Grateful for friends who make years feel like days when you reunite.",
      "mood": "grateful & tender",
      "tone": "heartfelt",
      "emotions": [
        {
          "label": "gratitude",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "tenderness",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [
        "Priya"
      ],
      "places": [
        "Rajiv Gandhi International Airport",
        "Third Wave Coffee"
      ],
      "topics": [
        "airport sendoff",
        "enduring friendship",
        "morning routine"
      ],
      "timeContext": "August 24, 2026 (morning)",
      "rawAnalysis": "Emotional sendoff note for Priya."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_24",
        "userId": "guest_user",
        "captureId": "cap_aug_24",
        "title": "Bidding Farewell to Priya at Airport & Morning Coffee",
        "summary": "Saw Priya off to the airport early morning. Stopped at Third Wave Coffee before heading to work. Grateful for friends who make years feel like days when you reunite.",
        "date": "2026-08-24",
        "location": "Rajiv Gandhi International Airport",
        "entitiesInvolved": [
          "Priya",
          "Rajiv Gandhi International Airport",
          "Third Wave Coffee"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-24T10:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_25",
    "userId": "guest_user",
    "content": "Voice recording after helping Maya label her luggage tags. She was nervous and excited all at once. I gave her a leather-bound notebook as a farewell gift.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-25T19:15:00Z",
    "status": "reconciled",
    "title": "Helping Maya Label Luggage Tags & Leather Notebook Gift",
    "dimensions": {
      "title": "Helping Maya Label Luggage Tags & Leather Notebook Gift",
      "summary": "Voice recording after helping Maya label her luggage tags. She was nervous and excited all at once. I gave her a leather-bound notebook as a farewell gift.",
      "mood": "sentimental",
      "tone": "tender",
      "emotions": [
        {
          "label": "affection",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "bittersweetness",
          "intensity": 0.85,
          "valence": "mixed"
        }
      ],
      "people": [
        "Maya"
      ],
      "places": [
        "Jubilee Hills"
      ],
      "topics": [
        "luggage packing",
        "farewell gift",
        "leather notebook",
        "London transition"
      ],
      "timeContext": "August 25, 2026 (evening)",
      "rawAnalysis": "Intimate packing milestone with Maya."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_25",
        "userId": "guest_user",
        "captureId": "cap_aug_25",
        "title": "Helping Maya Label Luggage Tags & Leather Notebook Gift",
        "summary": "Voice recording after helping Maya label her luggage tags. She was nervous and excited all at once. I gave her a leather-bound notebook as a farewell gift.",
        "date": "2026-08-25",
        "location": "Jubilee Hills",
        "entitiesInvolved": [
          "Maya",
          "Jubilee Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-25T19:15:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_26",
    "userId": "guest_user",
    "content": "Completed feature freeze for the memory engine with Kabir. Ran automated test suites across entities, episodes, relationships, and clarification logic. Everything passed clean.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-26T15:45:00Z",
    "status": "reconciled",
    "title": "Maya's Farewell Dinner at Olive Bistro with Friends",
    "dimensions": {
      "title": "Maya's Farewell Dinner at Olive Bistro with Friends",
      "summary": "Maya's grand farewell dinner at Olive Bistro overlooking Durgam Cheruvu! Kabir, Ananya, Rohan, Priya, and Sarah all gathered. Speeches, laughter, and tearful hugs.",
      "mood": "celebratory & emotional",
      "tone": "heartfelt",
      "emotions": [
        {
          "label": "love",
          "intensity": 0.95,
          "valence": "positive"
        },
        {
          "label": "bittersweet nostalgia",
          "intensity": 0.9,
          "valence": "mixed"
        },
        {
          "label": "camaraderie",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya",
        "Kabir",
        "Ananya",
        "Rohan",
        "Priya",
        "Sarah"
      ],
      "places": [
        "Olive Bistro",
        "Durgam Cheruvu",
        "London"
      ],
      "topics": [
        "farewell dinner",
        "friendship speeches",
        "celebration",
        "Durgam Cheruvu view"
      ],
      "timeContext": "August 26, 2026 (night)",
      "rawAnalysis": "Peak emotional anchor entry connecting all 6 core characters."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_26",
        "userId": "guest_user",
        "captureId": "cap_aug_26",
        "title": "Maya's Farewell Dinner at Olive Bistro with Friends",
        "summary": "Maya's grand farewell dinner at Olive Bistro overlooking Durgam Cheruvu! Kabir, Ananya, Rohan, Priya, and Sarah all gathered. Speeches, laughter, and tearful hugs.",
        "date": "2026-08-26",
        "location": "Olive Bistro",
        "entitiesInvolved": [
          "Maya",
          "Kabir",
          "Ananya",
          "Rohan",
          "Priya",
          "Sarah",
          "Olive Bistro",
          "Durgam Cheruvu",
          "London"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-26T15:45:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_27",
    "userId": "guest_user",
    "content": "Ananya unveiled her final hand-drawn visual story collage at Tattva Cafe! Maya loved seeing her golden brown scarf captured in the story canvas artwork.",
    "source": "image",
    "mediaUrl": "/collages/daily_collage_sketch.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-27T17:00:00Z",
    "status": "reconciled",
    "title": "Accompanying Maya to Airport & Emotional Departure",
    "dimensions": {
      "title": "Accompanying Maya to Airport & Emotional Departure",
      "summary": "Drove Maya to RGIA for her midnight flight to Heathrow. Watching her walk through departure gate was surreal. End of a chapter, start of her London journey.",
      "mood": "poignantly reflective",
      "tone": "vulnerable",
      "emotions": [
        {
          "label": "sorrow",
          "intensity": 0.7,
          "valence": "negative"
        },
        {
          "label": "hope",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "deep affection",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya"
      ],
      "places": [
        "Rajiv Gandhi International Airport",
        "Heathrow Airport",
        "London"
      ],
      "topics": [
        "flight departure",
        "Heathrow",
        "chapter transition",
        "goodbye"
      ],
      "timeContext": "August 27, 2026 (midnight)",
      "rawAnalysis": "Major life transition milestone.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /collages/daily_collage_sketch.jpg"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_27",
        "userId": "guest_user",
        "captureId": "cap_aug_27",
        "title": "Accompanying Maya to Airport & Emotional Departure",
        "summary": "Drove Maya to RGIA for her midnight flight to Heathrow. Watching her walk through departure gate was surreal. End of a chapter, start of her London journey.",
        "date": "2026-08-27",
        "location": "Rajiv Gandhi International Airport",
        "entitiesInvolved": [
          "Maya",
          "Rajiv Gandhi International Airport",
          "Heathrow Airport",
          "London"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-27T17:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_28",
    "userId": "guest_user",
    "content": "Quiet evening at home reflecting on the past month. August has been a whirlwind of work sprints, weekend trips, and preparing for big life shifts.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-28T20:30:00Z",
    "status": "reconciled",
    "title": "Quiet Reflection Day & First Text from Maya in London",
    "dimensions": {
      "title": "Quiet Reflection Day & First Text from Maya in London",
      "summary": "Quiet day at home. Received a whatsapp message from Maya: 'Landed at Heathrow! It's raining in London!'. Smiled reading it, knowing she's safe.",
      "mood": "reassured",
      "tone": "gentle",
      "emotions": [
        {
          "label": "relief",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "peace",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya"
      ],
      "places": [
        "London",
        "Heathrow Airport",
        "Home"
      ],
      "topics": [
        "safe arrival",
        "WhatsApp check-in",
        "London weather"
      ],
      "timeContext": "August 28, 2026 (afternoon)",
      "rawAnalysis": "Reassurance and resolution of travel tension."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_28",
        "userId": "guest_user",
        "captureId": "cap_aug_28",
        "title": "Quiet Reflection Day & First Text from Maya in London",
        "summary": "Quiet day at home. Received a whatsapp message from Maya: 'Landed at Heathrow! It's raining in London!'. Smiled reading it, knowing she's safe.",
        "date": "2026-08-28",
        "location": "London",
        "entitiesInvolved": [
          "Maya",
          "London",
          "Heathrow Airport",
          "Home"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-28T20:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_29_a",
    "userId": "guest_user",
    "content": "Voice recording helping Maya seal her final suitcase at her Banjara Hills apartment. Taping the UK shipping labels together.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-29T11:00:00Z",
    "status": "reconciled",
    "title": "Morning Coffee at Third Wave: Processing the Quiet",
    "dimensions": {
      "title": "Morning Coffee at Third Wave: Processing the Quiet",
      "summary": "Morning coffee at Third Wave alone. The cafe felt different without Maya sitting across, but the quiet routine brought peace.",
      "mood": "pensive",
      "tone": "quiet",
      "emotions": [
        {
          "label": "solitude",
          "intensity": 0.8,
          "valence": "neutral"
        },
        {
          "label": "peace",
          "intensity": 0.8,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya"
      ],
      "places": [
        "Third Wave Coffee",
        "Jubilee Hills"
      ],
      "topics": [
        "solo coffee",
        "adjusting to change",
        "morning stillness"
      ],
      "timeContext": "August 29, 2026 (morning)",
      "rawAnalysis": "Post-departure adjustment entry."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_29_a",
        "userId": "guest_user",
        "captureId": "cap_aug_29_a",
        "title": "Morning Coffee at Third Wave: Processing the Quiet",
        "summary": "Morning coffee at Third Wave alone. The cafe felt different without Maya sitting across, but the quiet routine brought peace.",
        "date": "2026-08-29",
        "location": "Third Wave Coffee",
        "entitiesInvolved": [
          "Maya",
          "Third Wave Coffee",
          "Jubilee Hills"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-29T11:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_29_b",
    "userId": "guest_user",
    "content": "Captured this photo of Ananya presenting the framed hand-drawn memory canvas to Maya on the terrace.",
    "source": "image",
    "mediaUrl": "/collages/daily_collage_sketch.jpg",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-29T17:00:00Z",
    "status": "reconciled",
    "title": "Afternoon Code Session with Kabir on Memory Graph",
    "dimensions": {
      "title": "Afternoon Code Session with Kabir on Memory Graph",
      "summary": "Met Kabir at Mindspace to push the new graph query optimization into production. High productivity flow state.",
      "mood": "focused",
      "tone": "energetic",
      "emotions": [
        {
          "label": "flow state",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "achievement",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Kabir"
      ],
      "places": [
        "Mindspace IT Park"
      ],
      "topics": [
        "graph optimization",
        "production push",
        "coding flow"
      ],
      "timeContext": "August 29, 2026 (afternoon)",
      "rawAnalysis": "Engineering milestone accomplishment.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /collages/daily_collage_sketch.jpg"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_29_b",
        "userId": "guest_user",
        "captureId": "cap_aug_29_b",
        "title": "Afternoon Code Session with Kabir on Memory Graph",
        "summary": "Met Kabir at Mindspace to push the new graph query optimization into production. High productivity flow state.",
        "date": "2026-08-29",
        "location": "Mindspace IT Park",
        "entitiesInvolved": [
          "Kabir",
          "Mindspace IT Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-29T17:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_29_c",
    "userId": "guest_user",
    "content": "Video memory from Maya's rooftop farewell tea gathering. Everyone came—Kabir, Ananya, Sarah, Rohan sent a video jam message, and Priya called in from Mumbai. Maya wore her golden scarf and raised a toast.",
    "source": "video",
    "mediaUrl": "/assets/poster-end.png",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-29T21:30:00Z",
    "status": "reconciled",
    "title": "Evening Chai with Ananya discussing London Trip",
    "dimensions": {
      "title": "Evening Chai with Ananya discussing London Trip",
      "summary": "Ananya came over in the evening. We drank ginger chai on the balcony and started planning a trip to visit Maya in London this December!",
      "mood": "excited",
      "tone": "cheerful",
      "emotions": [
        {
          "label": "anticipation",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "joy",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Ananya",
        "Maya"
      ],
      "places": [
        "Home Balcony",
        "London"
      ],
      "topics": [
        "December travel plan",
        "ginger chai",
        "visiting London"
      ],
      "timeContext": "August 29, 2026 (night)",
      "rawAnalysis": "Future travel planning with Ananya.",
      "mediaInsights": {
        "sceneDescription": "Media attachment at /assets/poster-end.png"
      }
    },
    "episodes": [
      {
        "id": "ep_cap_aug_29_c",
        "userId": "guest_user",
        "captureId": "cap_aug_29_c",
        "title": "Evening Chai with Ananya discussing London Trip",
        "summary": "Ananya came over in the evening. We drank ginger chai on the balcony and started planning a trip to visit Maya in London this December!",
        "date": "2026-08-29",
        "location": "Home Balcony",
        "entitiesInvolved": [
          "Ananya",
          "Maya",
          "Home Balcony",
          "London"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-29T21:30:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_30",
    "userId": "guest_user",
    "content": "Voice memo recorded on the drive back from Rajiv Gandhi International Airport. Maya checked in her bags and gave me a long hug before walking through international security. London awaits her.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-30T16:00:00Z",
    "status": "reconciled",
    "title": "Sunday Video Call with Maya in her London Flat",
    "dimensions": {
      "title": "Sunday Video Call with Maya in her London Flat",
      "summary": "1-hour video call with Maya showing her new flat in Bloomsbury, London! She showed us the view of brick chimneys and green parks outside her window.",
      "mood": "delighted",
      "tone": "warm & humorous",
      "emotions": [
        {
          "label": "connection",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "happiness",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya"
      ],
      "places": [
        "Bloomsbury",
        "London"
      ],
      "topics": [
        "video call",
        "London flat tour",
        "long distance connection"
      ],
      "timeContext": "August 30, 2026 (Sunday)",
      "rawAnalysis": "Transnational connection via video call."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_30",
        "userId": "guest_user",
        "captureId": "cap_aug_30",
        "title": "Sunday Video Call with Maya in her London Flat",
        "summary": "1-hour video call with Maya showing her new flat in Bloomsbury, London! She showed us the view of brick chimneys and green parks outside her window.",
        "date": "2026-08-30",
        "location": "Bloomsbury",
        "entitiesInvolved": [
          "Maya",
          "Bloomsbury",
          "London"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-30T16:00:00Z"
      }
    ]
  },
  {
    "id": "cap_aug_31",
    "userId": "guest_user",
    "content": "Sitting at Third Wave Coffee on the final night of August 2026. 31 days captured. Looking back at this month—from late-night AI latency wins with Kabir to Rohan's acoustic jams, Priya's Old City chai, and Maya's departure for London. This month was lived fully.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-08-31T22:00:00Z",
    "status": "reconciled",
    "title": "August Retrospective: Month of Transitions & Connections",
    "dimensions": {
      "title": "August Retrospective: Month of Transitions & Connections",
      "summary": "Voice memo reviewing the entire month of August. From monsoon rain in Hyderabad to Maya's move to London, sprint planning with Kabir, design with Ananya, and reunions with Priya & Rohan.",
      "mood": "deeply reflective",
      "tone": "profound",
      "emotions": [
        {
          "label": "gratitude",
          "intensity": 0.95,
          "valence": "positive"
        },
        {
          "label": "fulfillment",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "wisdom",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya",
        "Kabir",
        "Ananya",
        "Rohan",
        "Priya",
        "Sarah"
      ],
      "places": [
        "Hyderabad",
        "London",
        "Jubilee Hills",
        "KBR National Park"
      ],
      "topics": [
        "monthly retrospective",
        "autobiographical memory",
        "life transitions",
        "cherished bonds"
      ],
      "timeContext": "August 31, 2026 (month end)",
      "rawAnalysis": "Comprehensive monthly synthesis tying together all characters, places, and memory threads."
    },
    "episodes": [
      {
        "id": "ep_cap_aug_31",
        "userId": "guest_user",
        "captureId": "cap_aug_31",
        "title": "August Retrospective: Month of Transitions & Connections",
        "summary": "Voice memo reviewing the entire month of August. From monsoon rain in Hyderabad to Maya's move to London, sprint planning with Kabir, design with Ananya, and reunions with Priya & Rohan.",
        "date": "2026-08-31",
        "location": "Hyderabad",
        "entitiesInvolved": [
          "Maya",
          "Kabir",
          "Ananya",
          "Rohan",
          "Priya",
          "Sarah",
          "Hyderabad",
          "London",
          "Jubilee Hills",
          "KBR National Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-08-31T22:00:00Z"
      }
    ]
  },
  {
    "id": "cap_sep_01",
    "userId": "guest_user",
    "content": "Maya called from her London flat! She was walking near Holborn and LSE. Her voice was full of wonder. We laughed that her golden scarf is already getting heavy use in the UK drizzle.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-09-01T09:00:00Z",
    "status": "reconciled",
    "title": "September Kickoff & Product Roadmap with Sarah",
    "dimensions": {
      "title": "September Kickoff & Product Roadmap with Sarah",
      "summary": "Morning coffee with Sarah outlining product milestones for September: launch readiness, memory search, and entity cards.",
      "mood": "determined",
      "tone": "focused",
      "emotions": [
        {
          "label": "clarity",
          "intensity": 0.85,
          "valence": "positive"
        },
        {
          "label": "drive",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Sarah"
      ],
      "places": [
        "Third Wave Coffee"
      ],
      "topics": [
        "September roadmap",
        "launch readiness",
        "entity search"
      ],
      "timeContext": "September 1, 2026 (morning)",
      "rawAnalysis": "New month vision setting with Sarah."
    },
    "episodes": [
      {
        "id": "ep_cap_sep_01",
        "userId": "guest_user",
        "captureId": "cap_sep_01",
        "title": "September Kickoff & Product Roadmap with Sarah",
        "summary": "Morning coffee with Sarah outlining product milestones for September: launch readiness, memory search, and entity cards.",
        "date": "2026-09-01",
        "location": "Third Wave Coffee",
        "entitiesInvolved": [
          "Sarah",
          "Third Wave Coffee"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-09-01T09:00:00Z"
      }
    ]
  },
  {
    "id": "cap_sep_02",
    "userId": "guest_user",
    "content": "Worked with Kabir and Ananya on polishing the timeline view switcher and hand-drawn story graph cards. The synthesis of weekly and monthly collages feels so personal.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-09-02T14:30:00Z",
    "status": "reconciled",
    "title": "Polishing Hand-Drawn Timeline & Story Graph Cards",
    "dimensions": {
      "title": "Polishing Hand-Drawn Timeline & Story Graph Cards",
      "summary": "Worked with Kabir and Ananya on polishing the timeline view switcher and hand-drawn story graph cards. The synthesis of weekly and monthly collages feels so personal.",
      "mood": "creative & satisfied",
      "tone": "collaborative",
      "emotions": [
        {
          "label": "pride",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "craftsmanship",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Kabir",
        "Ananya"
      ],
      "places": [
        "Studio"
      ],
      "topics": [
        "timeline switcher",
        "hand-drawn card UI",
        "story collages"
      ],
      "timeContext": "September 2, 2026 (afternoon)",
      "rawAnalysis": "UI polish milestone with Kabir and Ananya."
    },
    "episodes": [
      {
        "id": "ep_cap_sep_02",
        "userId": "guest_user",
        "captureId": "cap_sep_02",
        "title": "Polishing Hand-Drawn Timeline & Story Graph Cards",
        "summary": "Worked with Kabir and Ananya on polishing the timeline view switcher and hand-drawn story graph cards. The synthesis of weekly and monthly collages feels so personal.",
        "date": "2026-09-02",
        "location": "Studio",
        "entitiesInvolved": [
          "Kabir",
          "Ananya",
          "Studio"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-09-02T14:30:00Z"
      }
    ]
  },
  {
    "id": "cap_sep_03",
    "userId": "guest_user",
    "content": "Voice note recorded at Third Wave Coffee. Met Sarah to review user testing feedback. People love how Memoiary automatically highlights their friends and places without manual tagging.",
    "source": "voice",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-09-03T11:20:00Z",
    "status": "reconciled",
    "title": "User Testing Feedback & Automatic Entity Tagging",
    "dimensions": {
      "title": "User Testing Feedback & Automatic Entity Tagging",
      "summary": "Voice note recorded at Third Wave Coffee. Met Sarah to review user testing feedback. People love how Memoiary automatically highlights their friends and places without manual tagging.",
      "mood": "enthusiastic",
      "tone": "encouraged",
      "emotions": [
        {
          "label": "validation",
          "intensity": 0.9,
          "valence": "positive"
        },
        {
          "label": "excitement",
          "intensity": 0.85,
          "valence": "positive"
        }
      ],
      "people": [
        "Sarah"
      ],
      "places": [
        "Third Wave Coffee"
      ],
      "topics": [
        "user testing feedback",
        "automatic entity tagging",
        "user delight"
      ],
      "timeContext": "September 3, 2026 (morning)",
      "rawAnalysis": "User validation session confirming auto-extraction magic."
    },
    "episodes": [
      {
        "id": "ep_cap_sep_03",
        "userId": "guest_user",
        "captureId": "cap_sep_03",
        "title": "User Testing Feedback & Automatic Entity Tagging",
        "summary": "Voice note recorded at Third Wave Coffee. Met Sarah to review user testing feedback. People love how Memoiary automatically highlights their friends and places without manual tagging.",
        "date": "2026-09-03",
        "location": "Third Wave Coffee",
        "entitiesInvolved": [
          "Sarah",
          "Third Wave Coffee"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-09-03T11:20:00Z"
      }
    ]
  },
  {
    "id": "cap_sep_04",
    "userId": "guest_user",
    "content": "Tested all UI views and memory engine extractors against our complete August data. People, places, timeline modes, and graph connections rendering with complete integrity.",
    "source": "text",
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-09-04T18:00:00Z",
    "status": "reconciled",
    "title": "Complete System Integration & August Dataset Verification",
    "dimensions": {
      "title": "Complete System Integration & August Dataset Verification",
      "summary": "Tested all UI views and memory engine extractors against our complete August data. People, places, timeline modes, and graph connections rendering with complete integrity.",
      "mood": "triumphant",
      "tone": "confident",
      "emotions": [
        {
          "label": "fulfillment",
          "intensity": 0.95,
          "valence": "positive"
        },
        {
          "label": "confidence",
          "intensity": 0.9,
          "valence": "positive"
        }
      ],
      "people": [
        "Maya",
        "Kabir",
        "Ananya",
        "Rohan",
        "Priya",
        "Sarah"
      ],
      "places": [
        "Hyderabad",
        "London",
        "Jubilee Hills",
        "Mindspace IT Park",
        "KBR National Park"
      ],
      "topics": [
        "system verification",
        "memory engine validation",
        "data integrity"
      ],
      "timeContext": "September 4, 2026 (evening)",
      "rawAnalysis": "Final verification milestone."
    },
    "episodes": [
      {
        "id": "ep_cap_sep_04",
        "userId": "guest_user",
        "captureId": "cap_sep_04",
        "title": "Complete System Integration & August Dataset Verification",
        "summary": "Tested all UI views and memory engine extractors against our complete August data. People, places, timeline modes, and graph connections rendering with complete integrity.",
        "date": "2026-09-04",
        "location": "Hyderabad",
        "entitiesInvolved": [
          "Maya",
          "Kabir",
          "Ananya",
          "Rohan",
          "Priya",
          "Sarah",
          "Hyderabad",
          "London",
          "Jubilee Hills",
          "Mindspace IT Park",
          "KBR National Park"
        ],
        epistemicStatus: EpistemicSource.USER_SAID,
        "createdAt": "2026-09-04T18:00:00Z"
      }
    ]
  }
];

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
