import { MemoryStore } from "./store";
import { Entity, Episode, Relationship, MemoryState, ClarificationCandidate } from "./types";

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
    const { query = "", entityNames = [], maxEpisodes = 5 } = options;

    const allEntities = await this.store.getEntities();
    const allRelationships = await this.store.getRelationships();
    const allEpisodes = await this.store.getEpisodes(maxEpisodes * 2);
    const allStates = await this.store.getStates();
    const pendingClarifications = await this.store.getClarifications("pending");

    const queryLower = query.toLowerCase();

    // Filter relevant entities
    const relevantEntities = allEntities.filter((e) => {
      const matchName = entityNames.some((name) => name.toLowerCase() === e.name.toLowerCase());
      const inQuery = queryLower.includes(e.name.toLowerCase()) || (e.aliases && e.aliases.some((a) => queryLower.includes(a.toLowerCase())));
      return matchName || inQuery;
    });

    // Match relevant relationships
    const relIds = new Set(relevantEntities.map((e) => e.id));
    const relevantRelationships = allRelationships.filter(
      (r) => relIds.has(r.sourceId) || relIds.has(r.targetId)
    );

    // Score & select episodes
    const scoredEpisodes = allEpisodes.map((ep) => {
      let score = 0;
      if (ep.title && queryLower.includes(ep.title.toLowerCase())) score += 5;
      if (ep.summary && queryLower.includes(ep.summary.toLowerCase())) score += 3;
      if (ep.entitiesInvolved && ep.entitiesInvolved.some((name) => queryLower.includes(name.toLowerCase()))) score += 4;
      return { ep, score };
    });

    scoredEpisodes.sort((a, b) => b.score - a.score);
    const recentEpisodes = (scoredEpisodes.length > 0 && scoredEpisodes[0].score > 0
      ? scoredEpisodes.map((s) => s.ep)
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
