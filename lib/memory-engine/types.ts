export enum EpistemicSource {
  USER_SAID = "USER_SAID",
  SYSTEM_KNOWS = "SYSTEM_KNOWS",
  SYSTEM_INFERRED = "SYSTEM_INFERRED",
  SYSTEM_SUSPECTS = "SYSTEM_SUSPECTS",
  USER_CONFIRMED = "USER_CONFIRMED",
  USER_CORRECTED = "USER_CORRECTED"
}

export type ClarificationType =
  | "ambiguity"
  | "entity_mismatch"
  | "world_knowledge_conflict"
  | "temporal_inconsistency"
  | "contradiction"
  | "user_correction";

export type ClarificationStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "corrected"
  | "dismissed";

export type SignificanceLevel = "high" | "medium" | "low";

export interface ClarificationCandidate {
  id: string;
  userId: string;
  captureId: string;
  type: ClarificationType;
  question: string;
  context: string;
  originalClaim: {
    field?: string;
    value?: any;
    rawSnippet?: string;
    entitiesInvolved?: string[];
  };
  suggestedResolution?: {
    correctedEntity?: string;
    correctedField?: string;
    correctedValue?: any;
    explanation?: string;
    options?: string[];
  };
  epistemicStatus: EpistemicSource;
  confidence: number;
  significance: SignificanceLevel;
  status: ClarificationStatus;
  userResponse?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Entity {
  id: string;
  userId: string;
  name: string;
  canonicalName?: string;
  type?: string;
  category?: "PERSON" | "ORGANIZATION" | "PLACE" | "MEDIA" | "PROJECT" | "CONCEPT" | "EVENT";
  aliases?: string[];
  attributes?: Record<string, any>;
  description?: string;
  occupation?: string;
  importanceScore?: number;
  confidenceScore?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  lastMentionedAt?: string;
  epistemicStatus?: EpistemicSource;
  confidence?: number;
  firstObserved?: string;
  lastObserved?: string;
  sourceEpisodeIds?: string[];
  isAmbiguous?: boolean;
}

export interface Relationship {
  id: string;
  userId: string;
  sourceId: string;
  sourceName?: string;
  targetId: string;
  targetName?: string;
  predicate: string; // e.g. "brother", "colleague", "works_at", "watched", "likes"
  status: "active" | "historical" | "tentative";
  validFrom?: string;
  validTo?: string;
  epistemicStatus: EpistemicSource;
  confidence: number;
  sourceCaptureId?: string;
}

export interface Emotion {
  id?: string;
  emotion: string;
  intensity?: number;
  valence?: "positive" | "negative" | "mixed" | "neutral";
  subjectType: "USER" | "OBSERVED_OTHER";
  subjectName?: string;
  context?: string;
}

export interface Episode {
  id: string;
  userId: string;
  captureId: string;
  title: string;
  summary: string;
  rawContent?: string;
  date: string;
  startTime?: string;
  location?: string;
  entitiesInvolved: string[];
  emotions?: Emotion[];
  learnings?: string[];
  epistemicStatus: EpistemicSource;
  createdAt: string;
}

export interface MemoryState {
  id: string;
  userId: string;
  key: string;
  value: string;
  type?: string;
  content?: string;
  status: "active" | "superseded";
  validFrom: string;
  validTo?: string;
  epistemicStatus: EpistemicSource;
  sourceCaptureId: string;
}

export interface Learning {
  id: string;
  userId: string;
  content: string;
  statement?: string;
  category?: string;
  sourceCaptureId: string;
  createdAt: string;
}

export interface Pattern {
  id: string;
  userId: string;
  title: string;
  description: string;
  statement?: string;
  supportingEpisodeIds: string[];
  confidence: number;
  status: "candidate" | "confirmed" | "dismissed";
  createdAt: string;
}

export type CandidatePattern = Pattern;


export interface MemoryProvenance {
  id: string;
  targetMemoryId: string;
  captureId: string;
  clarificationId?: string;
  originalInput: string;
  transformationType: "raw_extraction" | "user_confirmed" | "user_corrected" | "temporal_shift";
  timestamp: string;
  details?: Record<string, any>;
}

export interface CaptureDimensions {
  title?: string;
  summary: string;
  mood: string;
  tone: string;
  emotions: Array<{ label: string; intensity: number; valence: "positive" | "negative" | "mixed" | "neutral" }>;
  people: string[];
  places: string[];
  topics: string[];
  timeContext: string;
  wishes?: Array<{ text: string; subCategory: "culinary" | "travel" | "creative" }>;
  intentions?: Array<{ text: string; subCategory: "promise" | "action"; personMentioned?: string }>;
  events?: Array<{
    title: string;
    date: string;
    category: "birthday" | "milestone" | "gathering" | "celebration";
    people?: string[];
    location?: string;
  }>;
  mediaInsights?: {
    transcription?: string;
    sceneDescription?: string;
    detectedObjects?: string[];
    audioEmotion?: string;
    faceCount?: number;
  };
  rawAnalysis: string;
}

export interface CaptureSession {
  id: string;
  userId: string;
  title?: string;
  content: string;
  source: "text" | "voice" | "image" | "video" | "document";
  mediaUrl?: string;
  timezone?: string;
  createdAt: string;
  status: "received" | "extracted" | "clarification_needed" | "reconciled" | "saved_unanalyzed" | "processing";
  dimensions?: CaptureDimensions;
  episodes?: Episode[];
}

export interface ExtractedBundle {
  entities: Entity[];
  episodes: Episode[];
  relationships: Relationship[];
  emotions: Emotion[];
  states: MemoryState[];
  learnings: Learning[];
  clarifications?: ClarificationCandidate[];
}

export interface MediaAsset {
  id: string;
  userId?: string;
  captureId?: string;
  captureSessionId?: string;
  url?: string;
  type: string;
  storageUri?: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  transcription?: string;
  ocrText?: string;
  processingStatus?: string;
  createdAt: string;
}

