import { generateContentWithFallback } from "@/lib/gemini";
import {
  ExtractedBundle,
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
  referenceDate?: string;
  timezone?: string;
}

export class MemoryExtractor {
  async extract(options: ExtractionOptions): Promise<ExtractedBundle> {
    const { userId, captureId, rawText, referenceDate = new Date().toISOString(), timezone = "UTC" } = options;

    const systemPrompt = `You are the Extraction Engine of a Personal Memory System.
Your job is to parse the user's autobiographical capture into structured memory components.

CURRENT REFERENCE TIME: ${referenceDate} (${timezone})

EXTRACTION RULES:
1. ENTITIES: Extract distinct entities (PERSON, ORGANIZATION, PLACE, MEDIA, PROJECT, CONCEPT).
   - For TV shows, movies, books, podcasts, categorize as MEDIA.
   - Note characters, actors, colleagues, friends, places.
2. EPISODES: Autobiographical events or activities experienced or reported by the user.
   - Title: Short descriptive title.
   - Summary: Concise recap of the experience/reaction.
   - Date: Absolute ISO-8601 date resolved from relative words ("today", "yesterday", "last Thursday").
   - EntitiesInvolved: List of entity names mentioned.
3. RELATIONSHIPS: Connections between entities (e.g. Rahul -> brother, Rahul -> colleague, CU -> works_at Google, user -> watched -> Friends).
   - Distinguish active vs historical relationships if mentioned.
   - Note: multiple roles (e.g. brother AND colleague) are both valid relationships!
4. EMOTIONS: Emotional states mentioned.
   - subjectType: "USER" if the user felt it, "OBSERVED_OTHER" if someone else exhibited it (e.g. "Alex seemed stressed").
   - subjectName: The person who felt/exhibited it.
5. LEARNINGS & STATES: Realizations, personal rules, or active states.

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
              status: { type: "string", enum: ["active", "historical", "tentative"] },
              validFrom: { type: "string" },
              validTo: { type: "string" }
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
      // Resilient fallback: create a basic episode
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

