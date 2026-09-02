import { generateContentWithFallback } from "@/lib/gemini";
import { MemoryStore } from "./store";
import {
  ExtractedBundle,
  ClarificationCandidate,
  ClarificationType,
  EpistemicSource,
  SignificanceLevel
} from "./types";

interface ConsistencyOptions {
  userId: string;
  captureId: string;
  rawInput: string;
  extractedBundle: ExtractedBundle;
  store: MemoryStore;
  referenceDate?: string;
}

export interface ConsistencyResult {
  hasConflict: boolean;
  clarifications: ClarificationCandidate[];
  adjustedBundle: ExtractedBundle;
  isDirectUserCorrection?: boolean;
  correctionDetails?: {
    originalValue: string;
    correctedValue: string;
    targetField: string;
  };
}

export class ConsistencyEngine {
  async checkConsistency(options: ConsistencyOptions): Promise<ConsistencyResult> {
    const { userId, captureId, rawInput, extractedBundle, store, referenceDate = new Date().toISOString() } = options;

    const existingEntities = await store.getEntities();
    const existingRelationships = await store.getRelationships();
    const existingEpisodes = await store.getEpisodes(20);

    // 1. Check for Ambiguity (e.g., multiple entities named "Sam")
    const ambiguityClarifications: ClarificationCandidate[] = [];
    for (const extractedEnt of extractedBundle.entities) {
      if (extractedEnt.category === "PERSON") {
        const matching = existingEntities.filter(
          (e) => e.category === "PERSON" && e.name.toLowerCase() === extractedEnt.name.toLowerCase()
        );
        if (matching.length > 1) {
          // Multiple people with same name exist in personal memory
          const optionsList = matching.map((m) => {
            const rels = existingRelationships.filter((r) => r.targetId === m.id || r.sourceId === m.id);
            const desc = rels.map((r) => r.predicate).join(", ") || m.attributes?.role || "contact";
            return `${m.name} (${desc})`;
          });

          ambiguityClarifications.push({
            id: `clar_${Math.random().toString(36).substring(2, 9)}`,
            userId,
            captureId,
            type: "ambiguity",
            question: `Which ${extractedEnt.name} did you meet? (${optionsList.join(" or ")})`,
            context: `Multiple people named "${extractedEnt.name}" are recorded in your memory graph.`,
            originalClaim: {
              field: "entity",
              value: extractedEnt.name,
              rawSnippet: rawInput,
              entitiesInvolved: [extractedEnt.name]
            },
            suggestedResolution: {
              correctedField: "entityId",
              options: optionsList,
              explanation: "Select the specific person to attach this memory to."
            },
            epistemicStatus: EpistemicSource.SYSTEM_SUSPECTS,
            confidence: 0.95,
            significance: "high",
            status: "pending",
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    // 2. Run Gemini Consistency & World-Knowledge / Temporal Analysis
    const prompt = `You are the Memory Consistency & Epistemic Reasoning Engine.
Your role is to act like a thoughtful, careful friend who remembers well — NOT an aggressive fact-checker.

CURRENT INPUT:
"${rawInput}"

EXTRACTED DATA:
${JSON.stringify({
  entities: extractedBundle.entities.map((e) => ({ name: e.name, category: e.category })),
  episodes: extractedBundle.episodes.map((ep) => ({ title: ep.title, date: ep.date, summary: ep.summary })),
  relationships: extractedBundle.relationships.map((r) => ({ source: r.sourceName, target: r.targetName, predicate: r.predicate }))
})}

EXISTING PERSONAL MEMORY CONTEXT:
- Known Entities: ${JSON.stringify(existingEntities.map((e) => ({ name: e.name, category: e.category, aliases: e.aliases })))}
- Known Relationships: ${JSON.stringify(existingRelationships.map((r) => ({ source: r.sourceName || r.sourceId, target: r.targetName || r.targetId, predicate: r.predicate, status: r.status, validFrom: r.validFrom, validTo: r.validTo })))}
- Recent Episodes: ${JSON.stringify(existingEpisodes.map((ep) => ({ title: ep.title, date: ep.date })))}

EVALUATION PRINCIPLES:
1. ENTITY MISMATCH / WORLD KNOWLEDGE CONFLICT:
   - Example: Mentioning "Friends" with Sheldon, Leonard, Raj, Howard. Sheldon/Leonard/Raj/Howard are characters from "The Big Bang Theory", not "Friends".
   - If there is strong evidence of a media/entity mixup, flag this with high confidence and suggest the likely real entity (e.g. The Big Bang Theory).
   - Question tone: "Do you mean The Big Bang Theory? Sheldon, Leonard, Raj and Howard are from that show."
2. TEMPORAL INCONSISTENCY & HISTORICAL VALIDITY:
   - Do NOT flag minor time differences (e.g., "around 7" vs 7:07 is NOT a contradiction).
   - Historical context is valid: If a person worked at Google in the past or met in a Google context, "I met CU at Google yesterday" is NOT an error even if they currently work at Microsoft.
   - Only flag if there is a severe, high-confidence, impossible temporal conflict.
3. MULTIPLE VALID RELATIONSHIPS:
   - "Rahul is my brother" and "Rahul is also my colleague" are BOTH valid relationships! This is NEVER a contradiction.
4. USER DIRECT CORRECTION:
   - If the user explicitly says "Actually, I met Rahul Thursday, not Wednesday" or "Correction: ...", identify this as a direct user correction (isDirectUserCorrection = true).
   - Target field: the field being corrected (e.g. "date"), originalValue: "Wednesday", correctedValue: "Thursday".
5. CONFIDENCE & SIGNIFICANCE:
   - High-confidence + meaningful contradiction -> flag clarification (significance: "high").
   - Minor, pedantic, or low-confidence discrepancies -> DO NOT flag (hasIssue = false).

Return valid JSON adhering to the schema.`;

    const schema = {
      type: "object",
      properties: {
        hasIssue: { type: "boolean" },
        isDirectUserCorrection: { type: "boolean" },
        correctionDetails: {
          type: "object",
          properties: {
            targetField: { type: "string" },
            originalValue: { type: "string" },
            correctedValue: { type: "string" },
            explanation: { type: "string" }
          }
        },
        clarification: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: [
                "entity_mismatch",
                "world_knowledge_conflict",
                "temporal_inconsistency",
                "contradiction",
                "ambiguity",
                "user_correction"
              ]
            },
            question: { type: "string" },
            context: { type: "string" },
            suggestedEntity: { type: "string" },
            suggestedField: { type: "string" },
            suggestedValue: { type: "string" },
            explanation: { type: "string" },
            confidence: { type: "number" },
            significance: { type: "string", enum: ["high", "medium", "low"] }
          }
        }
      },
      required: ["hasIssue"]
    };

    try {
      const response = await generateContentWithFallback(prompt, {
        systemInstruction: "You are an accurate, compassionate epistemic consistency validator.",
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1
      });

      const parsed = JSON.parse(response.text || "{}");
      const generatedClarifications: ClarificationCandidate[] = [...ambiguityClarifications];

      // Handle Direct User Correction if detected
      if (parsed.isDirectUserCorrection && parsed.correctionDetails) {
        // Adjust the bundle directly for user's explicit correction
        const adjustedBundle = { ...extractedBundle };
        if (parsed.correctionDetails.targetField === "date" && adjustedBundle.episodes.length > 0) {
          adjustedBundle.episodes[0].date = parsed.correctionDetails.correctedValue;
          adjustedBundle.episodes[0].epistemicStatus = EpistemicSource.USER_CORRECTED;
        }

        return {
          hasConflict: false,
          clarifications: [],
          adjustedBundle,
          isDirectUserCorrection: true,
          correctionDetails: parsed.correctionDetails
        };
      }

      if (parsed.hasIssue && parsed.clarification && parsed.clarification.significance === "high") {
        const clar = parsed.clarification;
        generatedClarifications.push({
          id: `clar_${Math.random().toString(36).substring(2, 9)}`,
          userId,
          captureId,
          type: (clar.type as ClarificationType) || "entity_mismatch",
          question: clar.question,
          context: clar.context || clar.explanation || "",
          originalClaim: {
            rawSnippet: rawInput,
            field: clar.suggestedField || "entity",
            value: clar.suggestedValue
          },
          suggestedResolution: {
            correctedEntity: clar.suggestedEntity,
            correctedField: clar.suggestedField,
            correctedValue: clar.suggestedValue,
            explanation: clar.explanation
          },
          epistemicStatus: EpistemicSource.SYSTEM_SUSPECTS,
          confidence: clar.confidence || 0.9,
          significance: (clar.significance as SignificanceLevel) || "high",
          status: "pending",
          createdAt: new Date().toISOString()
        });
      }

      return {
        hasConflict: generatedClarifications.length > 0,
        clarifications: generatedClarifications,
        adjustedBundle: extractedBundle
      };
    } catch (error) {
      console.error("Consistency engine check error:", error);
      return {
        hasConflict: ambiguityClarifications.length > 0,
        clarifications: ambiguityClarifications,
        adjustedBundle: extractedBundle
      };
    }
  }
}
