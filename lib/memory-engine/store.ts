import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  CaptureSession,
  ClarificationCandidate,
  Entity,
  Episode,
  Relationship,
  MemoryState,
  Learning,
  Pattern,
  MemoryProvenance,
  ExtractedBundle
} from "./types";

export function sanitizePayload<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_, value) => (value === undefined ? null : value))
  );
}

export class MemoryStore {
  constructor(private userId: string) {}

  // ----------------- Captures -----------------
  async saveCapture(capture: CaptureSession): Promise<void> {
    const docRef = doc(db, "users", this.userId, "captures", capture.id);
    await setDoc(docRef, sanitizePayload(capture));
  }

  async getCapture(captureId: string): Promise<CaptureSession | null> {
    const docRef = doc(db, "users", this.userId, "captures", captureId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as CaptureSession) : null;
  }

  async getCaptures(max = 30): Promise<CaptureSession[]> {
    const colRef = collection(db, "users", this.userId, "captures");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as CaptureSession);
  }

  // ----------------- Clarifications -----------------
  async saveClarification(clarification: ClarificationCandidate): Promise<void> {
    const docRef = doc(db, "users", this.userId, "clarifications", clarification.id);
    await setDoc(docRef, sanitizePayload(clarification));
  }

  async getClarification(clarificationId: string): Promise<ClarificationCandidate | null> {
    const docRef = doc(db, "users", this.userId, "clarifications", clarificationId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as ClarificationCandidate) : null;
  }

  async getClarifications(status?: string): Promise<ClarificationCandidate[]> {
    const colRef = collection(db, "users", this.userId, "clarifications");
    const q = status
      ? query(colRef, where("status", "==", status), orderBy("createdAt", "desc"))
      : query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as ClarificationCandidate);
  }

  async updateClarification(
    clarificationId: string,
    updates: Partial<ClarificationCandidate>
  ): Promise<void> {
    const docRef = doc(db, "users", this.userId, "clarifications", clarificationId);
    await updateDoc(docRef, sanitizePayload(updates));
  }

  // ----------------- Entities -----------------
  async saveEntity(entity: Entity): Promise<void> {
    const docRef = doc(db, "users", this.userId, "entities", entity.id);
    await setDoc(docRef, sanitizePayload(entity));
  }

  async getEntity(entityId: string): Promise<Entity | null> {
    const docRef = doc(db, "users", this.userId, "entities", entityId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Entity) : null;
  }

  async getEntities(category?: string): Promise<Entity[]> {
    const colRef = collection(db, "users", this.userId, "entities");
    const q = category
      ? query(colRef, where("category", "==", category))
      : colRef;
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Entity);
  }

  async listEntities(category?: string): Promise<Entity[]> {
    return this.getEntities(category);
  }

  async updateEntity(entityId: string, updates: Partial<Entity>): Promise<void> {
    const docRef = doc(db, "users", this.userId, "entities", entityId);
    await updateDoc(docRef, sanitizePayload(updates));
  }

  async deleteEntity(entityId: string): Promise<void> {
    const docRef = doc(db, "users", this.userId, "entities", entityId);
    await deleteDoc(docRef);
  }

  async findEntitiesByName(name: string): Promise<Entity[]> {
    const norm = name.trim().toLowerCase();
    const all = await this.getEntities();
    return all.filter(
      (e) =>
        e.name.toLowerCase() === norm ||
        (e.aliases && e.aliases.some((a) => a.toLowerCase() === norm))
    );
  }

  // ----------------- Relationships -----------------
  async saveRelationship(rel: Relationship): Promise<void> {
    const docRef = doc(db, "users", this.userId, "relationships", rel.id);
    await setDoc(docRef, sanitizePayload(rel));
  }

  async getRelationship(relId: string): Promise<Relationship | null> {
    const docRef = doc(db, "users", this.userId, "relationships", relId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Relationship) : null;
  }

  async getRelationships(entityId?: string): Promise<Relationship[]> {
    const colRef = collection(db, "users", this.userId, "relationships");
    const snap = await getDocs(colRef);
    const all = snap.docs.map((d) => d.data() as Relationship);
    if (!entityId) return all;
    return all.filter((r) => r.sourceId === entityId || r.targetId === entityId);
  }

  async getRelationshipsForEntity(entityId: string): Promise<Relationship[]> {
    return this.getRelationships(entityId);
  }

  async updateRelationship(
    relId: string,
    updates: Partial<Relationship>
  ): Promise<void> {
    const docRef = doc(db, "users", this.userId, "relationships", relId);
    await updateDoc(docRef, sanitizePayload(updates));
  }

  async deleteRelationship(relId: string): Promise<void> {
    const docRef = doc(db, "users", this.userId, "relationships", relId);
    await deleteDoc(docRef);
  }

  // ----------------- Episodes -----------------
  async saveEpisode(episode: Episode): Promise<void> {
    const docRef = doc(db, "users", this.userId, "episodes", episode.id);
    await setDoc(docRef, sanitizePayload(episode));
  }

  async getEpisode(episodeId: string): Promise<Episode | null> {
    const docRef = doc(db, "users", this.userId, "episodes", episodeId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Episode) : null;
  }

  async getEpisodes(max = 50): Promise<Episode[]> {
    const colRef = collection(db, "users", this.userId, "episodes");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Episode);
  }

  async listEpisodes(max = 50): Promise<Episode[]> {
    return this.getEpisodes(max);
  }

  async updateEpisode(episodeId: string, updates: Partial<Episode>): Promise<void> {
    const docRef = doc(db, "users", this.userId, "episodes", episodeId);
    await updateDoc(docRef, sanitizePayload(updates));
  }

  async deleteEpisode(episodeId: string): Promise<void> {
    const docRef = doc(db, "users", this.userId, "episodes", episodeId);
    await deleteDoc(docRef);
  }

  async getEpisodesForEntity(entityName: string): Promise<Episode[]> {
    const norm = entityName.toLowerCase();
    const episodes = await this.getEpisodes(100);
    return episodes.filter((ep) =>
      ep.entitiesInvolved?.some((name) => name.toLowerCase() === norm)
    );
  }

  // ----------------- States, Learnings, Provenance & Patterns -----------------
  async saveState(state: MemoryState): Promise<void> {
    const docRef = doc(db, "users", this.userId, "states", state.id);
    await setDoc(docRef, sanitizePayload(state));
  }

  async getState(stateId: string): Promise<MemoryState | null> {
    const docRef = doc(db, "users", this.userId, "states", stateId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as MemoryState) : null;
  }

  async getStates(): Promise<MemoryState[]> {
    const colRef = collection(db, "users", this.userId, "states");
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as MemoryState);
  }

  async listStates(): Promise<MemoryState[]> {
    return this.getStates();
  }

  async updateState(stateId: string, updates: Partial<MemoryState>): Promise<void> {
    const docRef = doc(db, "users", this.userId, "states", stateId);
    await updateDoc(docRef, sanitizePayload(updates));
  }

  async deleteState(stateId: string): Promise<void> {
    const docRef = doc(db, "users", this.userId, "states", stateId);
    await deleteDoc(docRef);
  }

  async saveLearning(learning: Learning): Promise<void> {
    const docRef = doc(db, "users", this.userId, "learnings", learning.id);
    await setDoc(docRef, sanitizePayload(learning));
  }

  async getLearnings(): Promise<Learning[]> {
    const colRef = collection(db, "users", this.userId, "learnings");
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as Learning);
  }

  async listLearnings(): Promise<Learning[]> {
    return this.getLearnings();
  }

  async updateLearning(learningId: string, updates: Partial<Learning>): Promise<void> {
    const docRef = doc(db, "users", this.userId, "learnings", learningId);
    await updateDoc(docRef, sanitizePayload(updates));
  }

  async deleteLearning(learningId: string): Promise<void> {
    const docRef = doc(db, "users", this.userId, "learnings", learningId);
    await deleteDoc(docRef);
  }

  async savePattern(pattern: Pattern): Promise<void> {
    const docRef = doc(db, "users", this.userId, "patterns", pattern.id);
    await setDoc(docRef, sanitizePayload(pattern));
  }

  async getPatterns(): Promise<Pattern[]> {
    const colRef = collection(db, "users", this.userId, "patterns");
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => d.data() as Pattern);
  }

  async listPatterns(): Promise<Pattern[]> {
    return this.getPatterns();
  }

  async saveProvenance(prov: MemoryProvenance): Promise<void> {
    const docRef = doc(db, "users", this.userId, "provenance", prov.id);
    await setDoc(docRef, sanitizePayload(prov));
  }

  async getProvenanceForMemory(memoryId: string): Promise<MemoryProvenance[]> {
    const colRef = collection(db, "users", this.userId, "provenance");
    const q = query(colRef, where("targetMemoryId", "==", memoryId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as MemoryProvenance);
  }

  // ----------------- Batch Ingest Bundle -----------------
  async persistBundle(bundle: ExtractedBundle, captureId: string, rawInput: string): Promise<void> {
    for (const entity of bundle.entities) {
      await this.saveEntity(entity);
    }
    for (const rel of bundle.relationships) {
      await this.saveRelationship(rel);
    }
    for (const ep of bundle.episodes) {
      await this.saveEpisode(ep);
      await this.saveProvenance({
        id: `prov_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        targetMemoryId: ep.id,
        captureId,
        originalInput: rawInput,
        transformationType: "raw_extraction",
        timestamp: new Date().toISOString()
      });
    }
    for (const state of bundle.states) {
      await this.saveState(state);
    }
    for (const learning of bundle.learnings) {
      await this.saveLearning(learning);
    }
    if (bundle.clarifications) {
      for (const clar of bundle.clarifications) {
        await this.saveClarification(clar);
      }
    }
  }
}
