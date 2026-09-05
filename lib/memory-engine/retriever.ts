import { MemoryStore } from "./store";
import { Entity, Episode, Relationship, MemoryState, ClarificationCandidate } from "./types";
import { PERSON_VISUAL_REGISTRY } from "./person-graph";
import { RAW_JOURNAL_CAPTURES } from "./seeded-data";

interface RetrievalOptions {
  query?: string;
  entityNames?: string[];
  targetEntityId?: string;
  timeWindowDays?: number;
  maxEpisodes?: number;
  maxEntities?: number;
}

export interface RetrievedContext {
  relevantEntities: Entity[];
  relevantRelationships: Relationship[];
  recentEpisodes: Episode[];
  activeStates: MemoryState[];
  pendingClarifications: ClarificationCandidate[];
}

export class MemoryRetriever {
  private store: MemoryStore;

  constructor(private userId: string) {
    this.store = new MemoryStore(userId);
  }

  async retrieveContext(options: RetrievalOptions = {}): Promise<RetrievedContext> {
    const { query = "", entityNames = [], maxEpisodes = 15 } = options;

    let allEntities = await this.store.getEntities();
    let allRelationships = await this.store.getRelationships();
    let allEpisodes = await this.store.getEpisodes(100);
    const allStates = await this.store.getStates();
    const pendingClarifications = await this.store.getClarifications("pending");

    if (allEntities.length === 0) {
      allEntities = Object.values(PERSON_VISUAL_REGISTRY).map((p) => ({
        id: `ent_${p.name.toLowerCase()}`,
        userId: this.userId,
        name: p.name,
        category: "PERSON",
        description: `${p.role || "Friend"}. ${p.baseDescriptor}. Traits: ${p.evolvedTraits.join(", ")}`,
        aliases: [p.name.toLowerCase()],
        firstMentioned: p.lastUpdated,
        lastMentioned: p.lastUpdated,
        mentionCount: 5
      }));
    }

    if (allEpisodes.length === 0) {
      const knownNames = ["Maya", "Kabir", "Ananya", "Priya", "Rohan", "Sanya", "Sarah", "Vikram"];
      allEpisodes = RAW_JOURNAL_CAPTURES.map((cap) => {
        const peopleInContent: string[] = [];
        knownNames.forEach((n) => {
          if (cap.content.toLowerCase().includes(n.toLowerCase())) {
            peopleInContent.push(n);
          }
        });

        return {
          id: cap.id,
          userId: cap.userId || this.userId,
          title: cap.dimensions?.title || cap.content.substring(0, 45),
          summary: cap.dimensions?.summary || cap.content,
          date: cap.createdAt,
          entitiesInvolved: cap.dimensions?.people || peopleInContent,
          content: cap.content
        } as any;
      });
    }

    const queryLower = query.toLowerCase();

    // Identify target entity names
    const targetNames = new Set<string>(entityNames.map((n) => n.toLowerCase()));

    // Match relevant entities against query or explicit names
    const relevantEntities = allEntities.filter((e) => {
      const nameLower = e.name.toLowerCase();
      const matchExplicit = targetNames.has(nameLower);
      const inQuery = queryLower.includes(nameLower) || (e.aliases && e.aliases.some((a) => queryLower.includes(a.toLowerCase())));
      if (inQuery || matchExplicit) {
        targetNames.add(nameLower);
        return true;
      }
      return false;
    });

    // Match relevant relationships
    const relIds = new Set(relevantEntities.map((e) => e.id));
    const relevantRelationships = allRelationships.filter(
      (r) => relIds.has(r.sourceId) || relIds.has(r.targetId)
    );

    // Filter significant tokens from query
    const stopWords = new Set(["what", "were", "with", "have", "about", "from", "that", "this", "some", "your", "they", "them", "then", "than", "when", "where", "which", "could", "would", "should", "does", "think", "my", "reflections", "are"]);
    const queryTokens = queryLower
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));

    // Score & select episodes properly
    const scoredEpisodes = allEpisodes.map((ep) => {
      let score = 0;
      const titleLower = (ep.title || "").toLowerCase();
      const summaryLower = (ep.summary || "").toLowerCase();
      const contentLower = ((ep as any).content || "").toLowerCase();
      const entitiesInvolvedLower = (ep.entitiesInvolved || []).map((n) => n.toLowerCase());

      // Entity match (highest weight)
      for (const tName of targetNames) {
        if (entitiesInvolvedLower.includes(tName)) score += 10;
        else if (titleLower.includes(tName)) score += 8;
        else if (summaryLower.includes(tName)) score += 6;
        else if (contentLower.includes(tName)) score += 5;
      }

      // Keyword token match
      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 4;
        if (summaryLower.includes(token)) score += 3;
        if (contentLower.includes(token)) score += 2;
      }

      return { ep, score };
    });

    const matchingEpisodes = scoredEpisodes
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    const recentEpisodes = (matchingEpisodes.length > 0
      ? matchingEpisodes.map((s) => s.ep)
      : allEpisodes
    ).slice(0, maxEpisodes);

    const activeStates = allStates.filter((s) => s.status === "active");

    return {
      relevantEntities: relevantEntities.length > 0 ? relevantEntities : allEntities.slice(0, 5),
      relevantRelationships,
      recentEpisodes,
      activeStates,
      pendingClarifications
    };
  }
}
