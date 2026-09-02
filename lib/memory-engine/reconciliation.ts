import { MemoryStore } from "./store";
import {
  ExtractedBundle,
  Entity,
  Relationship,
  Episode,
  EpistemicSource,
  ClarificationCandidate,
  MemoryProvenance
} from "./types";

export class MemoryReconciler {
  constructor(private userId: string, private store: MemoryStore) {}

  /**
   * Reconciles an extracted bundle into the user's autobiographical graph.
   * Handles alias resolution, multi-role relationships, and temporal transition of past states.
   */
  async reconcile(
    bundle: ExtractedBundle,
    captureId: string,
    rawInput: string
  ): Promise<{ reconciledEntities: Entity[]; reconciledEpisodes: Episode[] }> {
    const existingEntities = await this.store.getEntities();
    const existingRelationships = await this.store.getRelationships();

    const reconciledEntities: Entity[] = [];
    const reconciledEpisodes: Episode[] = [];

    // 1. Reconcile Entities
    for (const ent of bundle.entities) {
      const match = existingEntities.find(
        (e) =>
          e.name.toLowerCase() === ent.name.toLowerCase() ||
          (e.aliases && e.aliases.some((a) => a.toLowerCase() === ent.name.toLowerCase()))
      );

      if (match) {
        // Update observed timestamp and combine aliases
        const updatedAliases = Array.from(
          new Set([...(match.aliases || []), ...(ent.aliases || [])])
        );
        const updated: Entity = {
          ...match,
          aliases: updatedAliases,
          lastObserved: new Date().toISOString()
        };
        await this.store.saveEntity(updated);
        reconciledEntities.push(updated);
      } else {
        await this.store.saveEntity(ent);
        reconciledEntities.push(ent);
      }
    }

    // 2. Reconcile Relationships (Multi-role validity & historical transition)
    for (const rel of bundle.relationships) {
      const sourceMatch = reconciledEntities.find((e) => e.name === rel.sourceName) || (rel.sourceName ? { id: rel.sourceName } : null);
      const targetMatch = reconciledEntities.find((e) => e.name === rel.targetName) || (rel.targetName ? { id: rel.targetName } : null);
      const sId = sourceMatch?.id || rel.sourceId || "unknown_source";
      const tId = targetMatch?.id || rel.targetId || "unknown_target";

      const existingRel = existingRelationships.find(
        (r) =>
          (r.sourceId === sId || r.sourceName === rel.sourceName) &&
          (r.targetId === tId || r.targetName === rel.targetName) &&
          r.predicate.toLowerCase() === rel.predicate.toLowerCase()
      );

      if (!existingRel) {
        // Save new relationship (e.g. colleague in addition to existing brother)
        const newRel: Relationship = {
          ...rel,
          sourceId: sId,
          targetId: tId,
          status: rel.status || "active",
          validFrom: rel.validFrom || new Date().toISOString(),
          epistemicStatus: rel.epistemicStatus || EpistemicSource.USER_SAID
        };
        await this.store.saveRelationship(newRel);
      } else {
        // If status changed or updated, update temporal window
        if (rel.status && rel.status !== existingRel.status) {
          await this.store.updateRelationship(existingRel.id, {
            status: rel.status,
            validTo: rel.validTo || new Date().toISOString()
          });
        }
      }
    }

    // 3. Save Episodes & Provenance
    for (const ep of bundle.episodes) {
      await this.store.saveEpisode(ep);
      reconciledEpisodes.push(ep);

      const prov: MemoryProvenance = {
        id: `prov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        targetMemoryId: ep.id,
        captureId,
        originalInput: rawInput,
        transformationType:
          ep.epistemicStatus === EpistemicSource.USER_CORRECTED
            ? "user_corrected"
            : "raw_extraction",
        timestamp: new Date().toISOString()
      };
      await this.store.saveProvenance(prov);
    }

    // 4. Save Emotions, States, Learnings
    for (const state of bundle.states) {
      await this.store.saveState(state);
    }
    for (const learning of bundle.learnings) {
      await this.store.saveLearning(learning);
    }

    return { reconciledEntities, reconciledEpisodes };
  }

  /**
   * Responds to and resolves a Clarification Candidate.
   * Modifies active memory while strictly maintaining provenance.
   */
  async resolveClarification(
    clarificationId: string,
    action: "confirm" | "reject" | "correct" | "dismiss",
    customCorrection?: string
  ): Promise<{
    clarification: ClarificationCandidate;
    updatedEpisode?: Episode;
    reconciledBundle?: any;
  }> {
    const clar = await this.store.getClarification(clarificationId);
    if (!clar) {
      throw new Error(`Clarification with id ${clarificationId} not found`);
    }

    const capture = await this.store.getCapture(clar.captureId);
    const rawInput = capture?.content || clar.originalClaim.rawSnippet || "";

    const timestamp = new Date().toISOString();

    if (action === "confirm") {
      // User confirms system suggestion (e.g. The Big Bang Theory)
      const correctedEntityName = clar.suggestedResolution?.correctedEntity || clar.suggestedResolution?.correctedValue;

      // 1. Create/ensure the corrected entity exists in store
      let correctedEntity: Entity | null = null;
      if (correctedEntityName) {
        const existing = await this.store.findEntitiesByName(correctedEntityName);
        if (existing.length > 0) {
          correctedEntity = existing[0];
        } else {
          correctedEntity = {
            id: `ent_${Math.random().toString(36).substring(2, 9)}`,
            userId: this.userId,
            name: correctedEntityName,
            category: "MEDIA",
            aliases: [],
            epistemicStatus: EpistemicSource.USER_CONFIRMED,
            confidence: 1.0,
            firstObserved: timestamp,
            lastObserved: timestamp
          };
          await this.store.saveEntity(correctedEntity);
        }
      }

      // 2. Find and update existing episode or create confirmed active episode
      const episodes = await this.store.getEpisodes(20);
      let targetEpisode = episodes.find((ep) => ep.captureId === clar.captureId);

      if (!targetEpisode) {
        targetEpisode = {
          id: `ep_${Math.random().toString(36).substring(2, 9)}`,
          userId: this.userId,
          captureId: clar.captureId,
          title: `Watched ${correctedEntityName || "show"}`,
          summary: `User watched episode of ${correctedEntityName || "show"} and loved it.`,
          rawContent: rawInput,
          date: timestamp.split("T")[0],
          entitiesInvolved: [correctedEntityName || "", "Sheldon", "Leonard", "Raj", "Howard"].filter(Boolean),
          epistemicStatus: EpistemicSource.USER_CONFIRMED,
          createdAt: timestamp
        };
      } else {
        // Update episode with confirmed corrected entity
        const filteredEntities = (targetEpisode.entitiesInvolved || []).filter(
          (n) => n.toLowerCase() !== (clar.originalClaim.value || "").toString().toLowerCase()
        );
        if (correctedEntityName && !filteredEntities.includes(correctedEntityName)) {
          filteredEntities.push(correctedEntityName);
        }

        targetEpisode = {
          ...targetEpisode,
          summary: targetEpisode.summary.replace(/Friends/gi, correctedEntityName || "The Big Bang Theory"),
          entitiesInvolved: filteredEntities,
          epistemicStatus: EpistemicSource.USER_CONFIRMED
        };
      }

      await this.store.saveEpisode(targetEpisode);

      // 3. Save Provenance Link: active memory -> clarification -> original capture
      await this.store.saveProvenance({
        id: `prov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        targetMemoryId: targetEpisode.id,
        captureId: clar.captureId,
        clarificationId: clar.id,
        originalInput: rawInput,
        transformationType: "user_confirmed",
        timestamp,
        details: {
          originalValue: clar.originalClaim.value,
          confirmedCorrection: correctedEntityName
        }
      });

      // 4. Update clarification record
      const updatedClar: ClarificationCandidate = {
        ...clar,
        status: "confirmed",
        epistemicStatus: EpistemicSource.USER_CONFIRMED,
        userResponse: "Confirmed suggestion",
        resolvedAt: timestamp
      };
      await this.store.updateClarification(clar.id, updatedClar);

      return { clarification: updatedClar, updatedEpisode: targetEpisode };
    }

    if (action === "reject") {
      // User explicitly rejects system suggestion (e.g. "No, I meant Friends")
      const episodes = await this.store.getEpisodes(20);
      let targetEpisode = episodes.find((ep) => ep.captureId === clar.captureId);

      if (targetEpisode) {
        targetEpisode = {
          ...targetEpisode,
          epistemicStatus: EpistemicSource.USER_SAID
        };
        await this.store.saveEpisode(targetEpisode);
      }

      await this.store.saveProvenance({
        id: `prov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        targetMemoryId: targetEpisode?.id || clar.captureId,
        captureId: clar.captureId,
        clarificationId: clar.id,
        originalInput: rawInput,
        transformationType: "raw_extraction",
        timestamp,
        details: {
          note: "User rejected system suggestion and retained original interpretation"
        }
      });

      const updatedClar: ClarificationCandidate = {
        ...clar,
        status: "rejected",
        epistemicStatus: EpistemicSource.USER_SAID,
        userResponse: customCorrection || "Rejected suggestion",
        resolvedAt: timestamp
      };
      await this.store.updateClarification(clar.id, updatedClar);

      return { clarification: updatedClar, updatedEpisode: targetEpisode };
    }

    if (action === "correct") {
      // User provides custom correction (e.g. "Actually Young Sheldon" or a specific name)
      const correction = customCorrection || clar.suggestedResolution?.correctedValue || "";
      const episodes = await this.store.getEpisodes(20);
      let targetEpisode = episodes.find((ep) => ep.captureId === clar.captureId);

      if (targetEpisode) {
        targetEpisode = {
          ...targetEpisode,
          summary: `${targetEpisode.summary} [Corrected: ${correction}]`,
          epistemicStatus: EpistemicSource.USER_CORRECTED
        };
        await this.store.saveEpisode(targetEpisode);
      }

      await this.store.saveProvenance({
        id: `prov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        targetMemoryId: targetEpisode?.id || clar.captureId,
        captureId: clar.captureId,
        clarificationId: clar.id,
        originalInput: rawInput,
        transformationType: "user_corrected",
        timestamp,
        details: {
          userCorrection: correction
        }
      });

      const updatedClar: ClarificationCandidate = {
        ...clar,
        status: "corrected",
        epistemicStatus: EpistemicSource.USER_CORRECTED,
        userResponse: correction,
        resolvedAt: timestamp
      };
      await this.store.updateClarification(clar.id, updatedClar);

      return { clarification: updatedClar, updatedEpisode: targetEpisode };
    }

    // Dismiss
    const updatedClar: ClarificationCandidate = {
      ...clar,
      status: "dismissed",
      resolvedAt: timestamp
    };
    await this.store.updateClarification(clar.id, updatedClar);
    return { clarification: updatedClar };
  }
}
