"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
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
import { auth, db } from "@/lib/firebase";
import { sanitizePayload } from "@/lib/memory-engine/store";
import { CaptureSession, CaptureDimensions } from "@/lib/memory-engine/types";

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
  submitCapture: (content: string, source?: string, mediaContext?: string) => Promise<any>;
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
  const [captures, setCaptures] = useState<CaptureSession[]>([]);
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
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      setSaveError(null);
    } catch (error: any) {
      console.warn("Google Auth error:", error?.code, error?.message);
      if (error?.code === "auth/unauthorized-domain") {
        setSaveError("This domain is not authorized in Firebase Console. Add it to Authentication > Authorized domains.");
        return;
      } else if (error?.code === "auth/popup-closed-by-user") {
        setSaveError("Sign in popup was closed. Please try again.");
      } else {
        setSaveError(error?.message || "Google Sign-In failed.");
      }
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
      setSaveError(null);
    } catch (anonErr) {
      console.warn("Anonymous auth failed:", anonErr);
      setSaveError("Anonymous sign-in is not enabled. Enable it in Firebase Console > Authentication > Sign-in method.");
    }
  };

  const logOut = async () => {
    try {
      if (user?.uid?.startsWith("guest_user_")) {
        setUser(null);
      } else {
        await signOut(auth);
      }
      setEntries([]);
      setMemories([]);
      setCaptures([]);
      setInsights(null);
      setActiveEntry(null);
      setStreak(defaultStreak);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listeners for entries, memories, captures, clarifications
  useEffect(() => {
    if (!user || user.uid.startsWith("guest_user_")) return;

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

    const capturesRef = collection(db, "users", user.uid, "captures");
    const capturesQuery = query(capturesRef, orderBy("createdAt", "desc"));
    const unsubCaptures = onSnapshot(capturesQuery, (snapshot) => {
      const loaded: CaptureSession[] = [];
      snapshot.forEach((doc) => {
        loaded.push({ id: doc.id, ...doc.data() } as CaptureSession);
      });
      setCaptures(loaded);
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

  const submitCapture = async (content: string, source = "text", mediaContext?: string) => {
    try {
      const idToken = await getIdToken();
      const response = await fetch("/api/v1/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          content,
          source,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          mediaContext
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
  };

  return (
    <JournalContext.Provider
      value={{
        user,
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
        submitCapture
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
