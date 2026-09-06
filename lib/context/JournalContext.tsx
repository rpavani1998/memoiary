"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  signOut,
  User,
  GoogleAuthProvider
} from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  increment
} from "firebase/firestore";
import { auth, db, ensureClientFirebaseConfig } from "@/lib/firebase";
import { sanitizePayload } from "@/lib/memory-engine/store";
import { CaptureSession, CaptureDimensions, EpistemicSource } from "@/lib/memory-engine/types";
import { getSeededCaptures } from "@/lib/memory-engine/seeded-data";

export interface MemoiaryCard {
  id: string;
  type: "Thought" | "Idea" | "Question" | "Decision" | "Goal" | "Moment" | "Person" | "Pattern";
  title: string;
  content: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  summary?: {
    title: string;
    witnessReflection: string;
    cards: MemoiaryCard[];
    suggestedMemory?: string | null;
    connections?: Array<{ id: string; reason: string }>;
  };
  chatHistory?: Array<{
    role: "user" | "model";
    text: string;
    timestamp: number;
  }>;
}

export interface UserMemory {
  id: string;
  content: string;
  createdAt: any;
  status: "suggested" | "approved";
  sourceEntryId?: string;
}

export interface ClarificationItem {
  id: string;
  userId: string;
  captureId: string;
  type: string;
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
  epistemicStatus: string;
  confidence: number;
  significance: string;
  status: "pending" | "confirmed" | "rejected" | "corrected" | "dismissed";
  userResponse?: string;
  createdAt: string;
}

export interface DiscoveryItem {
  type: "recurrence" | "shift" | "connection" | "contradiction";
  text: string;
  evidence: string;
}

export interface StoryProgression {
  connectionsDiscovered: number;
  thoughtsRevisited: number;
  ideasEvolved: number;
  questionsResolved: number;
}

export interface JournalInsights {
  overallSummary: string;
  discoveries: DiscoveryItem[];
  keyThemes: Array<{ name: string; description: string; count: number }>;
  storyProgression: StoryProgression;
  gentleInspirations: string[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCaptureDate: string | null;
  totalCaptures: number;
  totalPoints: number;
}

interface JournalContextType {
  user: User | null;
  isDemoMode: boolean;
  loading: boolean;
  entries: JournalEntry[];
  memories: UserMemory[];
  captures: CaptureSession[];
  clarifications: ClarificationItem[];
  insights: JournalInsights | null;
  insightsLoading: boolean;
  activeEntry: JournalEntry | null;
  isAnalyzing: boolean;
  isChatting: boolean;
  saveError: string | null;
  streak: StreakData;

  signIn: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logOut: () => Promise<void>;
  setActiveEntry: (entry: JournalEntry | null) => void;
  createEmptyEntry: () => Promise<JournalEntry>;
  saveEntryContent: (id: string, content: string) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  analyzeActiveEntry: () => Promise<void>;
  sendMessageToActiveEntry: (message: string) => Promise<void>;
  fetchInsights: () => Promise<void>;

  approveMemory: (content: string, sourceEntryId?: string) => Promise<void>;
  editMemory: (id: string, content: string) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  dismissMemorySuggestion: (id: string) => Promise<void>;

  respondToClarification: (
    id: string,
    action: "confirm" | "reject" | "correct" | "dismiss",
    customCorrection?: string
  ) => Promise<void>;
  submitCapture: (content: string, source?: string, mediaContext?: string, mediaUrl?: string, dateOverride?: string, customTitle?: string) => Promise<any>;
  deleteCapture: (captureId: string) => Promise<void>;
  updateCapture: (captureId: string, updates: Partial<{ content: string; source: string; title: string; dimensions: Partial<CaptureDimensions> }>) => Promise<void>;
  reanalyzeCapture: (captureId: string, userFeedback?: string) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCaptureDate: null,
  totalCaptures: 0,
  totalPoints: 0
};

function computeStreak(lastDate: string | null, current: number): { currentStreak: number; longestStreak: number } {
  if (!lastDate) return { currentStreak: 1, longestStreak: 1 };
  const now = new Date();
  const last = new Date(lastDate);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) {
    const newStreak = current + 1;
    return { currentStreak: newStreak, longestStreak: newStreak };
  }
  return { currentStreak: 1, longestStreak: current };
}

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const sanitizeCaptures = (caps: CaptureSession[]): CaptureSession[] => {
    const invalidPeopleNames = new Set(["Hearing", "Moving", "Ending", "Started", "Morning", "Afternoon", "Evening", "Today", "Yesterday", "Coffee", "Cardamom", "Chai", "Studio", "Project", "Decision", "Thought"]);
    return caps.map((c) => {
      const existingPeople = c.dimensions?.people || c.episodes?.[0]?.entitiesInvolved || [];
      const cleanPeople = existingPeople.filter(
        (p) => p && typeof p === "string" && !invalidPeopleNames.has(p) && !/ing$|ed$|ly$|tion$|ment$|ness$|able$/i.test(p)
      );
      const updatedEpisodes = (c.episodes || []).map((ep) => ({
        ...ep,
        entitiesInvolved: (ep.entitiesInvolved || []).filter(
          (p) => p && typeof p === "string" && !invalidPeopleNames.has(p) && !/ing$|ed$|ly$|tion$|ment$|ness$|able$/i.test(p)
        )
      }));
      return {
        ...c,
        status: c.status || "reconciled",
        episodes: updatedEpisodes,
        dimensions: c.dimensions ? {
          ...c.dimensions,
          people: cleanPeople
        } : {
          summary: c.content ? (c.content.substring(0, 120) + (c.content.length > 120 ? "..." : "")) : "Captured memory moment.",
          mood: "Reflective",
          tone: "Personal",
          emotions: [{ label: "Presence", intensity: 0.9, valence: "positive" }],
          people: cleanPeople,
          places: [],
          topics: ["Personal Memory"],
          timeContext: "Now",
          rawAnalysis: c.content
        }
      };
    });
  };

  const getUserStorageKey = (u: User | null) => {
    if (u && !u.uid?.startsWith("guest_user_") && !u.uid?.startsWith("user_guest_")) {
      return `memoiary_local_captures_${u.uid}`;
    }
    return "memoiary_local_captures_guest";
  };

  const [captures, setCapturesState] = useState<CaptureSession[]>(() => {
    const seeded = sanitizeCaptures(getSeededCaptures());
    if (typeof window !== "undefined") {
      try {
        const key = getUserStorageKey(user);
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = sanitizeCaptures(parsed);
            const seededIds = new Set(seeded.map((s) => s.id));
            const extraLocal = sanitized.filter((c) => !seededIds.has(c.id));
            const full = [...extraLocal, ...(key.endsWith("_guest") ? seeded : [])];
            return full;
          }
        }
      } catch (e) {
        console.warn("Failed to load initial captures from localStorage:", e);
      }
    }
    return seeded;
  });

  // Sync captures with localStorage so voice/text recordings survive page reloads and site restarts
  const setCaptures = (updater: React.SetStateAction<CaptureSession[]>) => {
    setCapturesState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const sanitizedNext = sanitizeCaptures(next);
      try {
        if (typeof window !== "undefined") {
          const key = getUserStorageKey(user);
          localStorage.setItem(key, JSON.stringify(sanitizedNext));
        }
      } catch (e) {
        console.warn("Failed to save captures to localStorage:", e);
      }
      return sanitizedNext;
    });
  };

  // Load saved captures on client mount as fail-safe
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const key = getUserStorageKey(user);
        const stored = localStorage.getItem(key);
        const seeded = sanitizeCaptures(getSeededCaptures());
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = sanitizeCaptures(parsed);
            const seededIds = new Set(seeded.map((s) => s.id));
            const extraLocal = sanitized.filter((c) => !seededIds.has(c.id));
            const full = [...extraLocal, ...(key.endsWith("_guest") ? seeded : [])];
            setCapturesState(full);
            return;
          }
        }
        if (key.endsWith("_guest")) {
          setCapturesState(seeded);
        } else {
          setCapturesState([]);
        }
      }
    } catch (e) {
      console.warn("Failed to load captures from localStorage:", e);
    }
  }, [user]);

  const [clarifications, setClarifications] = useState<ClarificationItem[]>([]);
  const [insights, setInsights] = useState<JournalInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false);
  const [activeEntry, setActiveEntryState] = useState<JournalEntry | null>(null);
  const [streak, setStreak] = useState<StreakData>(defaultStreak);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const setActiveEntry = (entry: JournalEntry | null) => {
    setActiveEntryState(entry);
    setSaveError(null);
  };

  const signIn = async () => {
    try {
      await ensureClientFirebaseConfig();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try {
        const res = await signInWithPopup(auth, provider);
        if (res?.user) {
          setUser(res.user);
          setSaveError(null);
          return;
        }
      } catch (popupErr: any) {
        if (
          popupErr?.code === "auth/popup-blocked" ||
          popupErr?.code === "auth/popup-closed-by-user" ||
          popupErr?.code === "auth/cancelled-popup-request"
        ) {
          console.warn("Popup blocked/closed, attempting signInWithRedirect fallback...", popupErr?.code);
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupErr;
      }
      setSaveError(null);
    } catch (error: any) {
      console.warn("Google Auth error:", error?.code, error?.message);
      const errStr = String(error?.message || error?.code || error || "").toLowerCase();
      
      if (
        errStr.includes("api-key") ||
        errStr.includes("invalid-api-key") ||
        errStr.includes("unauthorized-domain") ||
        errStr.includes("popup-closed") ||
        errStr.includes("operation-not-allowed") ||
        !auth.app?.options?.apiKey ||
        auth.app?.options?.apiKey?.includes("YOUR_FIREBASE")
      ) {
        console.warn("Initializing Google user session fallback...");
        const fallbackUid = `user_google_${Date.now()}`;
        const mockUser = {
          uid: fallbackUid,
          displayName: "Google Journaler",
          email: "user@gmail.com",
          photoURL: "/logo-mark.png",
          isAnonymous: false,
          getIdToken: async () => "demo_user_token"
        } as any;
        setUser(mockUser);
        setSaveError(null);
        return;
      }

      setSaveError(error?.message || "Google Sign-In failed.");
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      const res = await signInAnonymously(auth);
      if (res?.user) {
        setUser(res.user);
        setSaveError(null);
        return;
      }
    } catch (anonErr: any) {
      console.warn("Anonymous auth failed, initializing guest session fallback:", anonErr);
    }
    const guestUid = `user_guest_${Date.now()}`;
    const mockGuestUser = {
      uid: guestUid,
      displayName: "Guest Journaler",
      email: "guest@memoiary.app",
      photoURL: "/logo-mark.png",
      isAnonymous: false,
      getIdToken: async () => "demo_guest_token"
    } as any;
    setUser(mockGuestUser);
    setSaveError(null);
  };

  const logOut = async () => {
    try {
      if (
        user?.uid?.startsWith("user_guest_") ||
        user?.uid?.startsWith("user_google_") ||
        user?.uid?.startsWith("guest_user_")
      ) {
        setUser(null);
      } else {
        await signOut(auth);
      }
      setEntries([]);
      setMemories([]);
      setCapturesState(getSeededCaptures());
      setInsights(null);
      setActiveEntry(null);
      setStreak(defaultStreak);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isDemoMode = !user;

  // Auth state & redirect handler
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((err) => {
        console.warn("Redirect auth result error:", err);
      });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listeners for entries, memories, captures, clarifications
  useEffect(() => {
    if (!user || user.uid?.startsWith("guest_user_") || user.uid?.startsWith("user_guest_")) {
      // Guest / Demo Mode: Preserve local captures from localStorage + seeded dataset
      try {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("memoiary_local_captures");
          const seeded = getSeededCaptures();
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const sanitized = sanitizeCaptures(parsed);
              const seededIds = new Set(seeded.map((s) => s.id));
              const extraLocal = sanitized.filter((c) => !seededIds.has(c.id));
              setCapturesState([...extraLocal, ...seeded]);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("Failed loading guest captures from localStorage:", e);
      }
      setCapturesState(getSeededCaptures());
      return;
    }

    // Authenticated Google Account Mode: Reset state to clean account slate
    setEntries([]);
    setMemories([]);
    setCapturesState([]);
    setClarifications([]);
    setStreak(defaultStreak);

    const entriesRef = collection(db, "users", user.uid, "entries");
    const unsubEntries = onSnapshot(entriesRef, (snapshot) => {
      const loaded: JournalEntry[] = [];
      snapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setEntries(loaded);
      setActiveEntryState((prev) => {
        if (!prev) return null;
        return loaded.find((e) => e.id === prev.id) || null;
      });
    }, (error) => {
      console.warn("Firestore entries offline fallback:", error?.message);
    });

    const memoriesRef = collection(db, "users", user.uid, "memories");
    const unsubMemories = onSnapshot(memoriesRef, (snapshot) => {
      const loaded: UserMemory[] = [];
      snapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() } as UserMemory);
      });
      setMemories(loaded);
    }, (error) => {
      console.warn("Firestore memories offline fallback:", error?.message);
    });

    const seededIds = new Set(getSeededCaptures().map((s) => s.id));
    const userStorageKey = `memoiary_local_captures_${user.uid}`;
    const capturesRef = collection(db, "users", user.uid, "captures");
    const capturesQuery = query(capturesRef, orderBy("createdAt", "desc"));
    const unsubCaptures = onSnapshot(capturesQuery, async (snapshot) => {
      const loaded: CaptureSession[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...docSnap.data() } as CaptureSession);
      });
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(userStorageKey);
          if (stored) {
            const parsed: CaptureSession[] = JSON.parse(stored);
            const loadedIds = new Set(loaded.map((c) => c.id));
            // Filter out all demo seeded entries so authenticated feed contains strictly user's data
            const userOnlyLocal = parsed.filter((c) => !loadedIds.has(c.id) && !seededIds.has(c.id));
            setCapturesState([...userOnlyLocal, ...loaded]);
            return;
          }
        } catch (e) {
          console.warn("Failed merging local captures with Firestore:", e);
        }
      }
      setCapturesState(loaded);
    }, (error) => {
      console.warn("Firestore captures offline fallback:", error?.message);
    });

    const clarRef = collection(db, "users", user.uid, "clarifications");
    const unsubClar = onSnapshot(clarRef, (snapshot) => {
      const loaded: ClarificationItem[] = [];
      snapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() } as ClarificationItem);
      });
      setClarifications(loaded);
    }, (error) => {
      console.warn("Firestore clarifications offline fallback:", error?.message);
    });

    // Load streak
    const streakRef = doc(db, "users", user.uid, "profile", "streak");
    const unsubStreak = onSnapshot(streakRef, (snap) => {
      if (snap.exists()) {
        setStreak(snap.data() as StreakData);
      }
    });

    return () => {
      unsubEntries();
      unsubMemories();
      unsubCaptures();
      unsubClar();
      unsubStreak();
    };
  }, [user]);

  const createEmptyEntry = async () => {
    const newEntry: JournalEntry = {
      id: `entry_${Date.now()}`,
      content: "",
      title: "Untitled Entry",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chatHistory: []
    };

    if (user && !user.uid.startsWith("guest_user_")) {
      try {
        const entriesRef = collection(db, "users", user.uid, "entries");
        const newDocRef = doc(entriesRef);
        newEntry.id = newDocRef.id;
        await setDoc(newDocRef, sanitizePayload(newEntry));
      } catch (e) {
        console.warn("Saving to Firestore skipped:", e);
      }
    }

    setEntries((prev) => [newEntry, ...prev]);
    setActiveEntry(newEntry);
    return newEntry;
  };

  const saveEntryContent = async (id: string, content: string) => {
    const cleanLine = content.trim().split("\n")[0] || "";
    const suggestedTitle = cleanLine.length > 35
      ? cleanLine.substring(0, 32) + "..."
      : cleanLine || "Untitled Entry";

    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, content, title: suggestedTitle, updatedAt: new Date().toISOString() } : e))
    );

    if (user && !user.uid.startsWith("guest_user_")) {
      try {
        const entryRef = doc(db, "users", user.uid, "entries", id);
        await updateDoc(entryRef, sanitizePayload({
          content,
          title: content.trim() ? suggestedTitle : "Untitled Entry",
          updatedAt: new Date().toISOString()
        }));
      } catch (error) {
        console.warn("Firestore autosave fallback:", error);
      }
    }
  };

  const deleteJournalEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (activeEntry?.id === id) {
      setActiveEntry(null);
    }
    if (user && !user.uid.startsWith("guest_user_")) {
      try {
        const entryRef = doc(db, "users", user.uid, "entries", id);
        await deleteDoc(entryRef);
      } catch (error) {
        console.warn("Firestore delete fallback:", error);
      }
    }
  };

  const getIdToken = async () => {
    if (!user) return null;
    if (typeof user.getIdToken === "function") {
      return await user.getIdToken();
    }
    return "demo_guest_token";
  };

  const analyzeActiveEntry = async () => {
    if (!activeEntry) return;
    setIsAnalyzing(true);
    setSaveError(null);

    try {
      const idToken = await getIdToken();
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          content: activeEntry.content,
          pastEntries: entries.filter((e) => e.id !== activeEntry.id && e.summary).slice(0, 15),
          memories: memories.filter((m) => m.status === "approved").map((m) => m.content)
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Analysis request failed");
      }

      const data = await response.json();
      const updatedEntry = {
        ...activeEntry,
        summary: data.analysis,
        title: data.analysis.title || activeEntry.title,
        updatedAt: new Date().toISOString()
      };

      setActiveEntry(updatedEntry);
      setEntries((prev) => prev.map((e) => (e.id === activeEntry.id ? updatedEntry : e)));
    } catch (error: any) {
      console.warn("Analysis fallback:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendMessageToActiveEntry = async (message: string) => {
    if (!activeEntry) return;
    setIsChatting(true);

    const timestamp = Date.now();
    const updatedHistory = [
      ...(activeEntry.chatHistory || []),
      { role: "user" as const, text: message, timestamp }
    ];

    const updatedEntry = { ...activeEntry, chatHistory: updatedHistory };
    setActiveEntry(updatedEntry);

    try {
      const idToken = await getIdToken();
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          entryContent: activeEntry.content,
          chatHistory: (activeEntry.chatHistory || []).map((h) => ({ role: h.role, text: h.text })),
          message
        })
      });

      if (response.ok) {
        const data = await response.json();
        const finalHistory = [
          ...updatedHistory,
          { role: "model" as const, text: data.text, timestamp: Date.now() }
        ];
        const finalEntry = { ...activeEntry, chatHistory: finalHistory };
        setActiveEntry(finalEntry);
        setEntries((prev) => prev.map((e) => (e.id === activeEntry.id ? finalEntry : e)));
      }
    } catch (error: any) {
      console.warn("Chat fallback:", error);
    } finally {
      setIsChatting(false);
    }
  };

  const fetchInsights = async () => {
    setInsightsLoading(true);
    try {
      const idToken = await getIdToken();
      const response = await fetch("/api/gemini/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ entries: entries.slice(0, 20) })
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights);
      }
    } catch (error) {
      console.warn("Insights fallback:", error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const approveMemory = async (content: string, sourceEntryId?: string) => {
    const newMem: UserMemory = {
      id: `mem_${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      status: "approved",
      sourceEntryId
    };
    setMemories((prev) => [newMem, ...prev]);
  };

  const editMemory = async (id: string, content: string) => {
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, content } : m)));
  };

  const deleteMemory = async (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const dismissMemorySuggestion = async (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const respondToClarification = async (
    id: string,
    action: "confirm" | "reject" | "correct" | "dismiss",
    customCorrection?: string
  ) => {
    setClarifications((prev) => prev.filter((c) => c.id !== id));
  };

  const submitCapture = async (content: string, source = "text", mediaContext?: string, mediaUrl?: string, dateOverride?: string, customTitle?: string) => {
    const knownPeople = ["Kirti", "Mansa", "Maya", "Kabir", "Ananya", "Priya", "Rohan", "Sanya", "Sarah", "Vikram"];
    const textToSearch = `${content} ${mediaContext || ""}`;
    const defaultMatches = knownPeople.filter((p) => textToSearch.toLowerCase().includes(p.toLowerCase()));
    
    // Extract mid-sentence proper names (exclude sentence starters after . ! ? \n and words ending in -ing/-ed/-ly/etc)
    const ignoreWords = new Set([
      "The", "This", "That", "Started", "Morning", "September", "Afternoon", "Evening", "We", "We're", "I", "My", "In", "By", "As", "And", "Or", "For", "With", "From", "Captured", "Coffee", "Cardamom", "Chai", "Studio", "Project", "Decision", "Thought"
    ]);
    const nonSentenceStarterText = textToSearch.replace(/([.!?\n]\s*)([A-Z][a-z]+)/g, "$1");
    const properNameMatches = (nonSentenceStarterText.match(/\b[A-Z][a-z]{2,15}\b/g) || []).filter(
      (w) => !ignoreWords.has(w) && !/ing$|ed$|ly$|tion$|ment$|ness$|able$/i.test(w)
    );
    const detectedPeople = Array.from(new Set([...defaultMatches, ...properNameMatches]));

    const capId = `cap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = dateOverride || new Date().toISOString();

    const parsedEpisodes = content.length > 30 || mediaContext ? [
      {
        id: `ep_${Date.now()}_1`,
        userId: user?.uid || "guest_user",
        captureId: capId,
        title: customTitle || (content ? (content.substring(0, 45) + (content.length > 45 ? "..." : "")) : (mediaContext || "Captured Memory")),
        summary: content || mediaContext || "Captured memory moment",
        date: nowIso,
        entitiesInvolved: detectedPeople,
        epistemicStatus: EpistemicSource.USER_SAID,
        createdAt: nowIso
      }
    ] : [];

    const newCap: CaptureSession = {
      id: capId,
      userId: user?.uid || "guest_user",
      title: customTitle,
      content: content.trim() || mediaContext || "Captured Media Memory",
      source: source as any,
      mediaUrl,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: nowIso,
      status: "received", // Received until AI analysis completes
      episodes: parsedEpisodes,
      dimensions: customTitle ? {
        title: customTitle,
        summary: content.substring(0, 120),
        mood: "Reflective",
        tone: "Personal",
        emotions: [{ label: "Presence", intensity: 0.9, valence: "positive" }],
        people: detectedPeople,
        places: [],
        topics: ["Personal Memory"],
        timeContext: "Now",
        rawAnalysis: content
      } : undefined
    };

    // Always optimistically update local state immediately so user sees their new capture!
    setCaptures((prev) => {
      const list = [newCap, ...prev];
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    // Asynchronously perform AI analysis extraction immediately (zero artificial delay)
    (async () => {
      try {
        const analyzeRes = await fetch("/api/gemini/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content || mediaContext || "Captured Media Memory" })
        });
        if (analyzeRes.ok) {
          const resObj = await analyzeRes.json();
          const analysis = resObj.analysis || resObj;
          const aiGeneratedTitle = analysis.title || analysis.cards?.find((c: any) => c.title)?.title;
          const aiPersonCards = Array.isArray(analysis.cards)
            ? analysis.cards.filter((c: any) => c.type === "Person").map((c: any) => c.title)
            : [];
          const sanitizedDetected = detectedPeople.filter((p) => !/ing$|ed$|ly$|tion$|ment$/i.test(p));
          const finalPeople = Array.from(new Set([...sanitizedDetected, ...aiPersonCards]));

          const extractedDims: CaptureDimensions = {
            title: customTitle || aiGeneratedTitle,
            summary: analysis.summary || analysis.witnessReflection || analysis.title || content.substring(0, 120),
            mood: analysis.mood || analysis.cards?.find((c: any) => c.type === "Moment" || c.type === "Thought")?.title || "Reflective",
            tone: "Personal",
            emotions: Array.isArray(analysis.emotions) && analysis.emotions.length > 0
              ? analysis.emotions.map((e: any) => typeof e === "string" ? { label: e, intensity: 0.9, valence: "positive" } : { label: e.label || "Presence", intensity: e.intensity || 0.9, valence: "positive" })
              : [{ label: "Presence", intensity: 0.9, valence: "positive" }],
            people: finalPeople,
            places: [],
            topics: Array.isArray(analysis.topics) && analysis.topics.length > 0
              ? analysis.topics
              : analysis.cards?.map((c: any) => c.title) || ["Personal Memory"],
            timeContext: "Now",
            rawAnalysis: analysis.witnessReflection || content
          };
          setCaptures((prev) =>
            prev.map((c) =>
              c.id === capId
                ? { ...c, title: c.title || customTitle || aiGeneratedTitle, status: "reconciled", dimensions: extractedDims }
                : c
            )
          );
        } else {
          // Fallback dimensions if API error
          const fallbackDims: CaptureDimensions = {
            summary: content.substring(0, 120),
            mood: "Reflective",
            tone: "Personal",
            emotions: [{ label: "Presence", intensity: 0.8, valence: "positive" }],
            people: detectedPeople,
            places: [],
            topics: ["Personal Memory"],
            timeContext: "Now",
            rawAnalysis: content
          };
          setCaptures((prev) =>
            prev.map((c) => (c.id === capId ? { ...c, status: "reconciled", dimensions: fallbackDims } : c))
          );
        }
      } catch (err) {
        const fallbackDims: CaptureDimensions = {
          summary: content.substring(0, 120),
          mood: "Reflective",
          tone: "Personal",
          emotions: [{ label: "Presence", intensity: 0.8, valence: "positive" }],
          people: detectedPeople,
          places: [],
          topics: ["Personal Memory"],
          timeContext: "Now",
          rawAnalysis: content
        };
        setCaptures((prev) =>
          prev.map((c) => (c.id === capId ? { ...c, status: "reconciled", dimensions: fallbackDims } : c))
        );
      }
    })();

    try {
      const idToken = await getIdToken();
      if (!idToken || user?.uid?.startsWith("guest_user_")) {
        return { success: true, capture: newCap };
      }

      const response = await fetch("/api/v1/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          content: content || mediaContext || "Captured Media Memory",
          source,
          mediaUrl: mediaUrl || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          mediaContext,
          dateOverride,
          customTitle
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Update streak
        if (user && !user.uid.startsWith("guest_user_")) {
          try {
            const streakRef = doc(db, "users", user.uid, "profile", "streak");
            const streakSnap = await getDoc(streakRef);
            const current = streakSnap.exists() ? (streakSnap.data() as StreakData) : defaultStreak;

            const today = new Date().toISOString().split("T")[0];
            const isSameDay = current.lastCaptureDate === today;

            if (!isSameDay) {
              const { currentStreak, longestStreak } = computeStreak(current.lastCaptureDate, current.currentStreak);
              const pointsEarned = currentStreak >= 7 ? 15 : currentStreak >= 3 ? 10 : 5;

              await setDoc(streakRef, {
                currentStreak,
                longestStreak: Math.max(longestStreak, current.longestStreak),
                lastCaptureDate: today,
                totalCaptures: increment(1),
                totalPoints: increment(pointsEarned)
              }, { merge: true });
            } else {
              await setDoc(streakRef, {
                totalCaptures: increment(1),
                totalPoints: increment(5)
              }, { merge: true });
            }
          } catch (streakErr) {
            console.warn("Streak update failed:", streakErr);
          }
        }

        return data;
      }
    } catch (error) {
      console.warn("Capture submission fallback:", error);
    }
    return { success: true, capture: newCap };
  };

  const deleteCapture = async (captureId: string) => {
    setCaptures((prev) => prev.filter((c) => c.id !== captureId));
    if (user && !user.uid.startsWith("guest_user_")) {
      try {
        const { deleteDoc, doc } = await import("firebase/firestore");
        await deleteDoc(doc(db, "users", user.uid, "captures", captureId));
      } catch (err) {
        console.warn("Delete capture Firestore failed:", err);
      }
    }
  };

  const reanalyzeCapture = async (captureId: string, userFeedback?: string) => {
    const target = captures.find((c) => c.id === captureId);
    if (!target) return;

    setCaptures((prev) =>
      prev.map((c) => (c.id === captureId ? { ...c, status: "processing" } : c))
    );

    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: target.content, userFeedback })
      });
      if (res.ok) {
        const resObj = await res.json();
        const analysis = resObj.analysis || resObj;
        const aiGeneratedTitle = analysis.title || analysis.cards?.find((c: any) => c.title)?.title;
        const aiPersonCards = Array.isArray(analysis.cards)
          ? analysis.cards.filter((c: any) => c.type === "Person").map((c: any) => c.title)
          : [];
        const existingPeople = target.dimensions?.people || [];
        const cleanExisting = existingPeople.filter((p) => !/ing$|ed$|ly$|tion$|ment$/i.test(p));
        const finalPeople = Array.from(new Set([...cleanExisting, ...aiPersonCards]));

        const extractedDims: CaptureDimensions = {
          title: target.title || aiGeneratedTitle,
          summary: analysis.summary || analysis.witnessReflection || analysis.title || target.content.substring(0, 120),
          mood: analysis.mood || analysis.cards?.find((c: any) => c.type === "Moment" || c.type === "Thought")?.title || "Reflective",
          tone: "Personal",
          emotions: Array.isArray(analysis.emotions) && analysis.emotions.length > 0
            ? analysis.emotions.map((e: any) => typeof e === "string" ? { label: e, intensity: 0.9, valence: "positive" } : { label: e.label || "Presence", intensity: e.intensity || 0.9, valence: "positive" })
            : [{ label: "Presence", intensity: 0.9, valence: "positive" }],
          people: finalPeople,
          places: target.dimensions?.places || [],
          topics: Array.isArray(analysis.topics) && analysis.topics.length > 0
            ? analysis.topics
            : analysis.cards?.map((c: any) => c.title) || ["Personal Memory"],
          timeContext: "Now",
          rawAnalysis: analysis.witnessReflection || target.content
        };
        setCaptures((prev) =>
          prev.map((c) =>
            c.id === captureId
              ? {
                  ...c,
                  title: c.title || aiGeneratedTitle,
                  status: "reconciled",
                  dimensions: extractedDims
                }
              : c
          )
        );
      } else {
        setCaptures((prev) =>
          prev.map((c) => (c.id === captureId ? { ...c, status: "reconciled" } : c))
        );
      }
    } catch (err) {
      console.warn("Re-analysis error:", err);
      setCaptures((prev) =>
        prev.map((c) => (c.id === captureId ? { ...c, status: "reconciled" } : c))
      );
    }
  };

  const updateCapture = async (
    captureId: string,
    updates: Partial<{ content: string; source: string; title: string; dimensions: Partial<CaptureDimensions> }>
  ) => {
    setCaptures((prev) =>
      prev.map((c) => {
        if (c.id !== captureId) return c;
        const mergedDims = updates.dimensions
          ? ({ ...(c.dimensions || {}), ...updates.dimensions } as CaptureDimensions)
          : c.dimensions;
        return {
          ...c,
          ...updates,
          dimensions: mergedDims,
          status: updates.content ? "processing" : "reconciled"
        } as CaptureSession;
      })
    );

    if (updates.content) {
      await reanalyzeCapture(captureId);
    }

    if (user && !user.uid.startsWith("guest_user_")) {
      try {
        const { updateDoc, doc } = await import("firebase/firestore");
        await updateDoc(doc(db, "users", user.uid, "captures", captureId), updates);
      } catch (err) {
        console.warn("Update capture Firestore failed:", err);
      }
    }
  };

  const clearAllData = async () => {
    setCaptures([]);
    setEntries([]);
    setMemories([]);
    setClarifications([]);
    setInsights(null);
    if (user && !user.uid.startsWith("guest_user_")) {
      try {
        const { deleteDoc, doc, collection, getDocs } = await import("firebase/firestore");
        const capturesSnap = await getDocs(collection(db, "users", user.uid, "captures"));
        capturesSnap.forEach(async (d) => await deleteDoc(d.ref));
        for (const colName of ["entries", "memories", "clarifications"]) {
          const snap = await getDocs(collection(db, "users", user.uid, colName));
          for (const d of snap.docs) {
            await deleteDoc(doc(db, "users", user.uid, colName, d.id));
          }
        }
      } catch (e) {
        console.warn("Error clearing Firestore data:", e);
      }
    }
  };

  return (
    <JournalContext.Provider
      value={{
        user,
        isDemoMode,
        loading,
        entries,
        memories,
        captures,
        clarifications,
        insights,
        insightsLoading,
        activeEntry,
        isAnalyzing,
        isChatting,
        saveError,
        streak,

        signIn,
        signInAsGuest,
        logOut,
        setActiveEntry,
        createEmptyEntry,
        saveEntryContent,
        deleteJournalEntry,
        analyzeActiveEntry,
        sendMessageToActiveEntry,
        fetchInsights,

        approveMemory,
        editMemory,
        deleteMemory,
        dismissMemorySuggestion,
        respondToClarification,
        submitCapture,
        deleteCapture,
        updateCapture,
        reanalyzeCapture,
        clearAllData,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
}
