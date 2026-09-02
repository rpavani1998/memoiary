import { MemoryStore } from "./store";
import { generateContentWithFallback, safeParseJson } from "@/lib/gemini";
import { CandidatePattern } from "./types";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export class MemoryMaintenanceService {
  private store: MemoryStore;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.store = new MemoryStore(userId);
  }

  /**
   * Scans existing episodes, learnings, and states to discover recurring candidate patterns.
   */
  async runPatternDetection(): Promise<CandidatePattern[]> {
    const episodes = await this.store.listEpisodes(30);
    const learnings = await this.store.listLearnings();
    const states = await this.store.listStates();

    if (episodes.length < 2) {
      return [];
    }

    const digest = {
      episodes: episodes.map((e) => ({ id: e.id, title: e.title, summary: e.summary, date: e.startTime })),
      learnings: learnings.map((l) => l.statement),
      activeStates: states.map((s) => ({ type: s.type, content: s.content }))
    };

    const systemInstruction = `You are the Pattern Miner of the Personal Memory Engine.
Analyze the user's episodic history, learnings, and internal states to discover recurring patterns, behavioral loops, or evolutionary shifts over time.

Rules:
- Ground every pattern in specific episode IDs.
- Do not manufacture generic pop-psychology tropes.
- Return ONLY valid JSON matching this schema:
{
  "patterns": [
    {
      "statement": "string describing the pattern objectively (e.g., 'You tend to question project scope when collaborative responsibilities are undefined')",
      "supportingEpisodeIds": ["string"],
      "confidence": 0.0 - 1.0
    }
  ]
}`;

    const prompt = `Here is the user's autobiographical history:\n${JSON.stringify(digest, null, 2)}`;

    try {
      const result = await generateContentWithFallback(prompt, {
        systemInstruction,
        temperature: 0.2
      });

      const parsed = safeParseJson<{ patterns: Array<{ statement: string; supportingEpisodeIds: string[]; confidence: number }> }>(
        result.text,
        { patterns: [] }
      );

      const existingPatterns = await this.store.listPatterns();
      const createdPatterns: CandidatePattern[] = [];

      for (const p of parsed.patterns || []) {
        const alreadyExists = existingPatterns.some(
          (ep) => ((ep.statement || ep.title || "").toLowerCase().trim()) === ((p.statement || "").toLowerCase().trim())
        );

        if (!alreadyExists) {
          const newPattern: CandidatePattern = {
            id: generateId("pat"),
            userId: this.userId,
            title: p.statement || "Observed Pattern",
            description: p.statement || "",
            statement: p.statement,
            supportingEpisodeIds: p.supportingEpisodeIds || [],
            confidence: p.confidence || 0.8,
            status: "candidate",
            createdAt: new Date().toISOString()
          };

          await this.store.savePattern(newPattern);
          createdPatterns.push(newPattern);
        }
      }

      return createdPatterns;
    } catch (error) {
      console.error("Pattern detection failed:", error);
      return [];
    }
  }

  /**
   * Scans for potentially duplicate entities and returns merge candidates.
   */
  async findDuplicateEntities(): Promise<Array<{ entityA: string; entityB: string; reason: string }>> {
    const entities = await this.store.listEntities();
    const duplicates: Array<{ entityA: string; entityB: string; reason: string }> = [];

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const a = entities[i];
        const b = entities[j];
        if (a.type !== b.type) continue;

        const aName = (a.canonicalName || a.name || "").toLowerCase().trim();
        const bName = (b.canonicalName || b.name || "").toLowerCase().trim();

        if (aName && bName && aName === bName) {
          duplicates.push({
            entityA: a.id,
            entityB: b.id,
            reason: `Exact name match: "${a.canonicalName || a.name}"`
          });
        } else if (a.aliases && a.aliases.some((alias) => alias.toLowerCase().trim() === bName)) {
          duplicates.push({
            entityA: a.id,
            entityB: b.id,
            reason: `Entity "${a.canonicalName || a.name}" has alias matching "${b.canonicalName || b.name}"`
          });
        }
      }
    }

    return duplicates;
  }
}
