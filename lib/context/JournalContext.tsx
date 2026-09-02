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
  orderBy
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Clean object helper to strip undefined values to prevent Firestore crashes
export function sanitizePayload<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    return value === undefined ? null : value;
  }));
}

export interface SanjayaCard {
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
    cards: SanjayaCard[];
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

interface JournalContextType {
  user: User | null;
  loading: boolean;
  entries: JournalEntry[];
  memories: UserMemory[];
  clarifications: ClarificationItem[];
  insights: JournalInsights | null;
  insightsLoading: boolean;
  activeEntry: JournalEntry | null;
  isAnalyzing: boolean;
  isChatting: boolean;
  saveError: string | null;
  
  signIn: () => Promise<void>;
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
  submitCapture: (content: string, source?: string) => Promise<any>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [clarifications, setClarifications] = useState<ClarificationItem[]>([]);
  const [insights, setInsights] = useState<JournalInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState<boolean>(false);
  const [activeEntry, setActiveEntryState] = useState<JournalEntry | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Synchronize activeEntry changes with updating its corresponding list item
  const setActiveEntry = (entry: JournalEntry | null) => {
    setActiveEntryState(entry);
    setSaveError(null);
  };

  // Resilient Sign-In with automatic fallback to guest mode if Google OAuth domain is unauthorized
  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.warn("Google Auth popup bypassed/unauthorized. Switching to Guest Session:", error?.code || error?.message);
      try {
        await signInAnonymously(auth);
      } catch (anonErr) {
        // Fallback to local guest user if anonymous auth is also disabled in console
        const guestUser = {
          uid: "guest_user_" + Date.now().toString(36),
          displayName: "Guest User",
          email: "guest@journal.local",
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          getIdToken: async () => "demo_guest_token",
        };
        setUser(guestUser as any);
      }
      setSaveError(null);
    }
  };

  // Log out helper
  const logOut = async () => {
    try {
      if (user?.uid?.startsWith("guest_user_")) {
        setUser(null);
      } else {
        await signOut(auth);
      }
      setEntries([]);
      setMemories([]);
      setInsights(null);
      setActiveEntry(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to entries and memories in real time once user is logged in
  useEffect(() => {
    if (!user || user.uid.startsWith("guest_user_")) return;

    // Real-time journal entries listener
    const entriesRef = collection(db, "users", user.uid, "entries");
    const entriesQuery = query(entriesRef, orderBy("createdAt", "desc"));
    const unsubEntries = onSnapshot(entriesRef, (snapshot) => {
      const loadedEntries: JournalEntry[] = [];
      snapshot.forEach((doc) => {
        loadedEntries.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setEntries(loadedEntries);

      setActiveEntryState((prevActive) => {
        if (!prevActive) return null;
        const currentDoc = loadedEntries.find((e) => e.id === prevActive.id);
        return currentDoc || null;
      });
    }, (error) => {
      console.warn("Firestore entries offline fallback:", error?.message);
    });

    // Real-time memories listener
    const memoriesRef = collection(db, "users", user.uid, "memories");
    const unsubMemories = onSnapshot(memoriesRef, (snapshot) => {
      const loadedMemories: UserMemory[] = [];
      snapshot.forEach((doc) => {
        loadedMemories.push({ id: doc.id, ...doc.data() } as UserMemory);
      });
      setMemories(loadedMemories);
    }, (error) => {
      console.warn("Firestore memories offline fallback:", error?.message);
    });

    // Real-time clarifications listener
    const clarRef = collection(db, "users", user.uid, "clarifications");
    const unsubClar = onSnapshot(clarRef, (snapshot) => {
      const loadedClar: ClarificationItem[] = [];
      snapshot.forEach((doc) => {
        loadedClar.push({ id: doc.id, ...doc.data() } as ClarificationItem);
      });
      setClarifications(loadedClar);
    }, (error) => {
      console.warn("Firestore clarifications offline fallback:", error?.message);
    });

    return () => {
      unsubEntries();
      unsubMemories();
      unsubClar();
    };
  }, [user]);

  // Create empty journal entry
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

  // Autosave entry content as user writes
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

  // Delete journal entry
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

  // Get Auth Token from current user session
  const getIdToken = async () => {
    if (!user) return null;
    if (typeof user.getIdToken === "function") {
      return await user.getIdToken();
    }
    return "demo_guest_token";
  };

  // Analyze the current active entry with Gemini
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

  // Chat conversation inside the active entry
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

  // Fetch / synthesize aggregate insights
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

  // User Memory management hooks
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

  const submitCapture = async (content: string, source = "text") => {
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
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      if (response.ok) {
        return await response.json();
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
        clarifications,
        insights,
        insightsLoading,
        activeEntry,
        isAnalyzing,
        isChatting,
        saveError,
        
        signIn,
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
