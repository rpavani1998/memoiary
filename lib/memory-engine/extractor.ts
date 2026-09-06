import { generateContentWithFallback } from "@/lib/gemini";
import {
  ExtractedBundle,
  CaptureDimensions,
  EpistemicSource,
  Entity,
  Episode,
  Relationship,
  Emotion,
  MemoryState,
  Learning
} from "./types";

interface ExtractionOptions {
  userId: string;
  captureId: string;
  rawText: string;
  source?: string;
  referenceDate?: string;
  timezone?: string;
  mediaContext?: string;
}

export class MemoryExtractor {
  async extract(options: ExtractionOptions): Promise<ExtractedBundle> {
    const { userId, captureId, rawText, referenceDate = new Date().toISOString(), timezone = "UTC" } = options;

    const systemPrompt = `You are the Extraction Engine of Memoiary, a Personal Memory System.
Your job is to parse the user's autobiographical capture into structured memory components.

CURRENT REFERENCE TIME: ${referenceDate} (${timezone})

EXTRACTION RULES:
1. ENTITIES: Extract distinct entities (PERSON, ORGANIZATION, PLACE, MEDIA, PROJECT, CONCEPT, EVENT).
   - For TV shows, movies, books, podcasts, categorize as MEDIA.
   - Note characters, actors, colleagues, friends, places.
2. EPISODES: Autobiographical events or activities experienced or reported by the user.
   - Title: Short descriptive title.
   - Summary: Concise recap of the experience/reaction.
   - Date: Absolute ISO-8601 date resolved from relative words ("today", "yesterday", "last Thursday").
   - EntitiesInvolved: List of entity names mentioned.
3. RELATIONSHIPS: Connections between entities (e.g. Rahul -> brother, Rahul -> colleague).
   - Distinguish active vs historical relationships if mentioned.
4. EMOTIONS: Emotional states mentioned.
   - subjectType: "USER" if the user felt it, "OBSERVED_OTHER" if someone else exhibited it.
   - subjectName: The person who felt/exhibited it.
5. LEARNINGS: Realizations, personal rules, or active states.

Return valid JSON adhering to the exact schema.`;

    const schema = {
      type: "object",
      properties: {
        entities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              category: {
                type: "string",
                enum: ["PERSON", "ORGANIZATION", "PLACE", "MEDIA", "PROJECT", "CONCEPT", "EVENT"]
              },
              aliases: { type: "array", items: { type: "string" } },
              confidence: { type: "number" }
            },
            required: ["name", "category"]
          }
        },
        episodes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" },
              date: { type: "string" },
              location: { type: "string" },
              entitiesInvolved: { type: "array", items: { type: "string" } }
            },
            required: ["title", "summary", "date", "entitiesInvolved"]
          }
        },
        relationships: {
          type: "array",
          items: {
            type: "object",
            properties: {
              sourceName: { type: "string" },
              targetName: { type: "string" },
              predicate: { type: "string" },
              status: { type: "string", enum: ["active", "historical", "tentative"] }
            },
            required: ["sourceName", "targetName", "predicate"]
          }
        },
        emotions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              emotion: { type: "string" },
              subjectType: { type: "string", enum: ["USER", "OBSERVED_OTHER"] },
              subjectName: { type: "string" },
              context: { type: "string" }
            },
            required: ["emotion", "subjectType"]
          }
        },
        learnings: {
          type: "array",
          items: {
            type: "object",
            properties: {
              content: { type: "string" },
              category: { type: "string" }
            },
            required: ["content"]
          }
        }
      },
      required: ["entities", "episodes", "relationships", "emotions", "learnings"]
    };

    try {
      const response = await generateContentWithFallback(rawText, {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1
      });

      const parsed = JSON.parse(response.text || "{}");
      const timestamp = new Date().toISOString();

      const entities: Entity[] = (parsed.entities || []).map((e: any) => ({
        id: `ent_${Math.random().toString(36).substring(2, 9)}`,
        userId,
        name: e.name,
        category: e.category || "CONCEPT",
        aliases: e.aliases || [],
        epistemicStatus: EpistemicSource.USER_SAID,
        confidence: e.confidence || 0.9,
        firstObserved: timestamp,
        lastObserved: timestamp
      }));

      const episodes: Episode[] = (parsed.episodes || []).map((ep: any) => ({
        id: `ep_${Math.random().toString(36).substring(2, 9)}`,
        userId,
        captureId,
        title: ep.title,
        summary: ep.summary,
        rawContent: rawText,
        date: ep.date || timestamp.split("T")[0],
        location: ep.location,
        entitiesInvolved: ep.entitiesInvolved || [],
        emotions: parsed.emotions || [],
        learnings: (parsed.learnings || []).map((l: any) => l.content),
        epistemicStatus: EpistemicSource.USER_SAID,
        createdAt: timestamp
      }));

      const relationships: Relationship[] = (parsed.relationships || []).map((r: any) => ({
        id: `rel_${Math.random().toString(36).substring(2, 9)}`,
        userId,
        sourceId: r.sourceName,
        sourceName: r.sourceName,
        targetId: r.targetName,
        targetName: r.targetName,
        predicate: r.predicate,
        status: r.status || "active",
        validFrom: r.validFrom,
        validTo: r.validTo,
        epistemicStatus: EpistemicSource.USER_SAID,
        confidence: 0.9,
        sourceCaptureId: captureId
      }));

      const emotions: Emotion[] = parsed.emotions || [];
      const learnings: Learning[] = (parsed.learnings || []).map((l: any) => ({
        id: `lrn_${Math.random().toString(36).substring(2, 9)}`,
        userId,
        content: l.content,
        category: l.category,
        sourceCaptureId: captureId,
        createdAt: timestamp
      }));

      return {
        entities,
        episodes,
        relationships,
        emotions,
        states: [],
        learnings
      };
    } catch (error) {
      console.error("Extraction error:", error);
      const timestamp = new Date().toISOString();
      return {
        entities: [],
        episodes: [
          {
            id: `ep_${Math.random().toString(36).substring(2, 9)}`,
            userId,
            captureId,
            title: rawText.substring(0, 30),
            summary: rawText,
            rawContent: rawText,
            date: timestamp.split("T")[0],
            entitiesInvolved: [],
            epistemicStatus: EpistemicSource.USER_SAID,
            createdAt: timestamp
          }
        ],
        relationships: [],
        emotions: [],
        states: [],
        learnings: []
      };
    }
  }

  async extractDimensions(options: ExtractionOptions): Promise<CaptureDimensions> {
    const { rawText, source = "text", referenceDate = new Date().toISOString(), mediaContext } = options;

    const systemPrompt = `You are Memoiary's Dimension Extractor. Analyze the user's capture and extract rich metadata dimensions.

CURRENT TIME: ${referenceDate}
SOURCE TYPE: ${source}
${mediaContext ? `MEDIA CONTEXT: ${mediaContext}` : ""}

You must extract:
1. SUMMARY: A 1-2 sentence evocative summary of the capture's essence.
2. MOOD: The overall emotional atmosphere (e.g., "reflective", "excited", "melancholic", "hopeful", "anxious").
3. TONE: The writing/speaking tone (e.g., "casual", "contemplative", "urgent", "playful", "vulnerable").
4. EMOTIONS: Array of detected emotions with intensity (0-1) and valence.
5. PEOPLE: Names of people mentioned or referenced.
6. PLACES: Locations mentioned or implied.
7. TOPICS: Key themes/topics (2-5 words each).
8. TIME CONTEXT: When the event happened (e.g., "yesterday evening", "this morning", "last week").
9. WISHES: Array of explicit or implicit desires, recipes/dishes to try, travel goals, or bucket list aspirations. Categorize subCategory as "culinary" (food/recipes), "travel", or "creative".
10. INTENTIONS: Array of explicit commitments, promises made to others, tasks, or follow-ups. Categorize subCategory as "promise" or "action", and specify personMentioned if applicable.
11. EVENTS: Array of explicit events, birthdays, anniversaries, celebrations, or attended gatherings mentioned. Categorize category as "birthday", "milestone", "gathering", or "celebration".
12. RAW ANALYSIS: A brief analytical observation about the capture (what's interesting, what pattern it fits).

Return ONLY valid JSON matching this schema.`;

    const schema = {
      type: "object",
      properties: {
        summary: { type: "string" },
        mood: { type: "string" },
        tone: { type: "string" },
        emotions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              intensity: { type: "number" },
              valence: { type: "string", enum: ["positive", "negative", "mixed", "neutral"] }
            },
            required: ["label", "intensity", "valence"]
          }
        },
        people: { type: "array", items: { type: "string" } },
        places: { type: "array", items: { type: "string" } },
        topics: { type: "array", items: { type: "string" } },
        timeContext: { type: "string" },
        wishes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              subCategory: { type: "string", enum: ["culinary", "travel", "creative"] }
            },
            required: ["text", "subCategory"]
          }
        },
        intentions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              subCategory: { type: "string", enum: ["promise", "action"] },
              personMentioned: { type: "string" }
            },
            required: ["text", "subCategory"]
          }
        },
        events: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              date: { type: "string" },
              category: { type: "string", enum: ["birthday", "milestone", "gathering", "celebration"] },
              people: { type: "array", items: { type: "string" } },
              location: { type: "string" }
            },
            required: ["title", "category"]
          }
        },
        rawAnalysis: { type: "string" }
      },
      required: ["summary", "mood", "tone", "emotions", "people", "places", "topics", "timeContext", "rawAnalysis"]
    };

    try {
      const response = await generateContentWithFallback(rawText, {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2
      });

      const parsed = JSON.parse(response.text || "{}");
      const knownPeople = ["Maya", "Kabir", "Ananya", "Priya", "Rohan", "Sarah"];
      const detectedPeople = Array.from(
        new Set([
          ...(Array.isArray(parsed.people) ? parsed.people : []),
          ...knownPeople.filter((p) => rawText.toLowerCase().includes(p.toLowerCase()))
        ])
      );

      return {
        summary: parsed.summary || rawText.substring(0, 100),
        mood: parsed.mood || "neutral",
        tone: parsed.tone || "casual",
        emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
        people: detectedPeople,
        places: Array.isArray(parsed.places) ? parsed.places : [],
        topics: Array.isArray(parsed.topics) ? parsed.topics : [],
        timeContext: parsed.timeContext || "recently",
        wishes: Array.isArray(parsed.wishes) ? parsed.wishes : [],
        intentions: Array.isArray(parsed.intentions) ? parsed.intentions : [],
        events: Array.isArray(parsed.events) ? parsed.events : [],
        rawAnalysis: parsed.rawAnalysis || "",
        mediaInsights: mediaContext ? { sceneDescription: mediaContext } : undefined
      };
    } catch (error) {
      console.error("Dimension extraction error:", error);
      return {
        summary: rawText.substring(0, 120),
        mood: "neutral",
        tone: "casual",
        emotions: [],
        people: [],
        places: [],
        topics: [],
        timeContext: "recently",
        rawAnalysis: ""
      };
    }
  }
}

export async function extractMemoryBundle(content: string, referenceDate?: string): Promise<ExtractedBundle> {
  const extractor = new MemoryExtractor();
  return extractor.extract({
    userId: "system",
    captureId: `cap_${Date.now()}`,
    rawText: content,
    referenceDate
  });
}
