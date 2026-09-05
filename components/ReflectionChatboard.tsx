"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  RefreshCw,
  CheckCircle2,
  BookmarkPlus,
  Check,
  Plus,
  History,
  MessageSquare,
  Trash2,
  ArrowRight,
  Clock,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";
import { useJournal } from "@/lib/context/JournalContext";

export interface Message {
  id: string;
  sender: "diary" | "user";
  text: string;
  timestamp: string;
  quickPrompts?: string[];
  memoryUpdated?: boolean;
  isQueryResponse?: boolean;
}

export interface ChatSessionThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface ReflectionChatboardProps {
  captures: CaptureSession[];
  onMemoryUpdate?: () => void;
  messages?: Message[];
  onMessagesChange?: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

export function ReflectionChatboard({
  captures = [],
  onMemoryUpdate,
  messages: externalMessages,
  onMessagesChange
}: ReflectionChatboardProps) {
  const [internalMessages, setInternalMessages] = useState<Message[]>([]);
  const messages = externalMessages !== undefined ? externalMessages : internalMessages;
  const hasInitializedRef = useRef(false);

  // Saved Threads State (persisted to localStorage)
  const [savedThreads, setSavedThreads] = useState<ChatSessionThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const updateMessages = (updater: (prev: Message[]) => Message[]) => {
    setInternalMessages(updater);
    if (onMessagesChange) {
      onMessagesChange((prev: Message[]) => {
        const currentPrev = Array.isArray(prev) ? prev : [];
        return updater(currentPrev);
      });
    }
  };

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingIsQuestion, setPendingIsQuestion] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [savingChat, setSavingChat] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isQuestionText = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.endsWith("?")) return true;
    const lower = trimmed.toLowerCase();
    const questionStarters = [
      "what", "why", "how", "when", "who", "where", "which",
      "can i", "can you", "did i", "tell me", "do i", "is there", "are there",
      "summarize", "explain", "show me", "search", "list", "recap"
    ];
    return questionStarters.some((qs) => lower.startsWith(qs) || lower.includes(` ${qs} `));
  };

  // Load saved chat threads from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("memoiary_saved_chat_threads");
      if (saved) {
        setSavedThreads(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load saved chat threads", e);
    }
  }, []);

  // Sync active thread updates to localStorage
  const persistThreads = (threads: ChatSessionThread[]) => {
    setSavedThreads(threads);
    try {
      localStorage.setItem("memoiary_saved_chat_threads", JSON.stringify(threads));
    } catch (e) {
      console.warn("Failed to persist saved chat threads", e);
    }
  };

  // Journal context for saving capture
  let submitCapture: any = null;
  try {
    const journalContext = useJournal();
    submitCapture = journalContext?.submitCapture;
  } catch {
    // Graceful fallback if context isn't wrapped
  }

  // 1. SAVE CHAT THREAD & TIMELINE
  const handleSaveChatToJournal = async () => {
    const nonInitMsgs = messages.filter((m) => m.id !== "msg_init");
    if (nonInitMsgs.length === 0) return;

    const conversationText = nonInitMsgs
      .map((m) => `${m.sender === "user" ? "User Reflection" : "Journal Reflection"}: ${m.text}`)
      .join("\n\n");

    setSavingChat(true);
    try {
      // Save to Journal Timeline Capture
      if (submitCapture) {
        await submitCapture(
          `Saved AI Conversation:\n\n${conversationText}`,
          "text",
          undefined,
          undefined,
          undefined,
          "Saved AI Reflection Chat"
        );
      }

      // Generate Title from first user message
      const firstUserMsg = nonInitMsgs.find((m) => m.sender === "user")?.text || "Reflection Chat";
      const threadTitle = firstUserMsg.length > 35 ? firstUserMsg.substring(0, 35) + "..." : firstUserMsg;

      const nowStr = new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

      const currentThreadId = activeThreadId || `thread_${Date.now()}`;
      const updatedThreadObj: ChatSessionThread = {
        id: currentThreadId,
        title: threadTitle,
        createdAt: nowStr,
        updatedAt: nowStr,
        messages: [...messages]
      };

      const existingIndex = savedThreads.findIndex((t) => t.id === currentThreadId);
      let newThreads: ChatSessionThread[] = [];
      if (existingIndex >= 0) {
        newThreads = [...savedThreads];
        newThreads[existingIndex] = updatedThreadObj;
      } else {
        newThreads = [updatedThreadObj, ...savedThreads];
      }

      persistThreads(newThreads);
      setActiveThreadId(currentThreadId);

      const saveMsg: Message = {
        id: `save_${Date.now()}`,
        sender: "diary",
        text: "✨ I've saved our conversation thread! It is now saved in your Saved Threads and woven into your journal memory graph.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        memoryUpdated: true
      };

      updateMessages((prev) => [...prev, saveMsg]);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
      onMemoryUpdate?.();
    } catch (err) {
      console.error("Failed to save chat reflection:", err);
    } finally {
      setSavingChat(false);
    }
  };

  // 2. NEW CHAT ACTION
  const handleNewChat = () => {
    setActiveThreadId(null);
    hasInitializedRef.current = false;
    const latestCapture = captures[0];
    const summary = latestCapture?.dimensions?.summary || latestCapture?.content?.substring(0, 50);

    let initialText = "Welcome to a fresh reflection space... Grounded strictly in what you've journaled, this space helps you reflect on your entries, trace connections, and unpack your thoughts.\n\nWhat would you like to explore today?";
    let prompts = [
      "I want to reflect on something that happened today",
      "Let me unpack a thought from my journal",
      "Help me add details to a recent memory"
    ];

    if (latestCapture && summary) {
      initialText = `Welcome to a new chat... Grounded in your recent journal note ("${summary}").\n\nWhat would you like to talk about today? We can unpack what you journaled, trace past connections, or explore a new reflection.`;
      prompts = [
        `Let's unpack "${summary.substring(0, 30)}..."`,
        "I want to reflect on another entry",
        "Help me fill in missing details"
      ];
    }

    updateMessages(() => [
      {
        id: "msg_init",
        sender: "diary",
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickPrompts: prompts
      }
    ]);
  };

  // 3. CONTINUE PAST CHAT THREAD
  const handleContinueThread = (thread: ChatSessionThread) => {
    setActiveThreadId(thread.id);
    updateMessages(() => [...thread.messages]);
    setIsHistoryOpen(false);
  };

  // 4. DELETE SAVED THREAD
  const handleDeleteThread = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    const updated = savedThreads.filter((t) => t.id !== threadId);
    persistThreads(updated);
    if (activeThreadId === threadId) {
      handleNewChat();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Web Speech API Voice Listening setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your reflection below!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  // Initial Welcome Message
  useEffect(() => {
    if (!hasInitializedRef.current && messages.length === 0) {
      hasInitializedRef.current = true;
      const latestCapture = captures[0];
      const summary = latestCapture?.dimensions?.summary || latestCapture?.content?.substring(0, 50);

      let initialText = "Welcome to your reflection space... Grounded strictly in what you've journaled, this space helps you reflect on your entries, trace connections, and unpack your thoughts.\n\nWhat would you like to explore today?";
      let prompts = [
        "I want to reflect on something that happened today",
        "Let me unpack a thought from my journal",
        "Help me add details to a recent memory"
      ];

      if (latestCapture && summary) {
        initialText = `Welcome back... Grounded in your recent journal note ("${summary}").\n\nWhat would you like to talk about today? We can unpack what you journaled, trace past connections, or explore a new reflection.`;
        prompts = [
          `Let's unpack "${summary.substring(0, 30)}..."`,
          "I want to reflect on another entry",
          "Help me fill in missing details"
        ];
      }

      updateMessages(() => [
        {
          id: "msg_init",
          sender: "diary",
          text: initialText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          quickPrompts: prompts
        }
      ]);
    }
  }, [captures]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText) return;

    if (messageText === "Save this reflection") {
      await handleSaveChatToJournal();
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const isQuestion = isQuestionText(messageText);

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Immediately add user message to messages state
    updateMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setPendingIsQuestion(isQuestion);
    setLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== "msg_init")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text
        }));

      const entryContent = captures[0]?.content || "User journal reflection space";

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryContent,
          message: messageText,
          chatHistory
        })
      });

      let diaryReply = "";
      let newPrompts: string[] = [];

      if (res.ok) {
        const data = await res.json();
        diaryReply = data.text || (isQuestion
          ? `Grounded in your recorded journal entries, here is what I found. What else would you like to explore?`
          : `Grounded in your journal entries, I've noted this reflection. What else would you like to explore?`);
      } else {
        diaryReply = isQuestion
          ? `Grounded in your recorded memory history, I searched your entries regarding your question. Would you like to ask something more specific?`
          : `I've noted this reflection in your memory timeline. What else would you like to unpack?`;
      }

      newPrompts = isQuestion
        ? [
            "Ask another question",
            "Unpack a specific entry",
            "Save this conversation"
          ]
        : [
            "Save this reflection",
            "Ask me a question",
            "I'm feeling good for now"
          ];

      const replyMsg: Message = {
        id: `diary_${Date.now()}`,
        sender: "diary",
        text: diaryReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickPrompts: newPrompts,
        memoryUpdated: !isQuestion,
        isQueryResponse: isQuestion
      };

      updateMessages((prev) => [...prev, replyMsg]);

      // Auto update saved thread if active
      if (activeThreadId) {
        setSavedThreads((prevThreads) => {
          const existingIdx = prevThreads.findIndex((t) => t.id === activeThreadId);
          if (existingIdx >= 0) {
            const updatedThreads = [...prevThreads];
            const currentMsgs = updatedThreads[existingIdx].messages || [];
            updatedThreads[existingIdx] = {
              ...updatedThreads[existingIdx],
              updatedAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
              messages: [...currentMsgs, userMsg, replyMsg]
            };
            persistThreads(updatedThreads);
            return updatedThreads;
          }
          return prevThreads;
        });
      }

      onMemoryUpdate?.();
    } catch (err) {
      console.error("Diary reflect chat error:", err);
      const fallbackMsg: Message = {
        id: `diary_err_${Date.now()}`,
        sender: "diary",
        text: isQuestion
          ? `I've searched your journal timeline for your question. What else would you like to inquire about?`
          : `Thanks for sharing! I've saved these details into your memory graph.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        memoryUpdated: !isQuestion,
        isQueryResponse: isQuestion
      };
      updateMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto font-sans overflow-hidden">
      {/* ── CHAT TOP HEADER BAR (Stationary) ── */}
      <div className="px-3 sm:px-4 py-2.5 border-b border-[#1C1917]/10 flex items-center justify-between shrink-0 bg-[#FAF7F0] gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#DE5239]" />
          <h2 className="font-serif font-medium text-base sm:text-lg text-[#1C1917]">Journal Reflection Mirror</h2>
        </div>
        
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="text-xs font-sans font-bold flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-[#F5E5DC] text-[#1C1917] border border-[#1C1917]/20 rounded-xl transition-all cursor-pointer shadow-xs"
            title="Start a new chat session"
          >
            <Plus size={14} className="text-[#DE5239]" />
            <span>New Chat</span>
          </button>

          {/* History / Saved Threads Button */}
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className={`text-xs font-sans font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
              isHistoryOpen
                ? "bg-[#1C1917] text-white border-[#1C1917]"
                : "bg-white text-[#1C1917] border-[#1C1917]/20 hover:bg-[#F5E5DC]"
            }`}
          >
            <History size={14} />
            <span>Saved Threads ({savedThreads.length})</span>
            {isHistoryOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Save Chat Button */}
          <button
            onClick={handleSaveChatToJournal}
            disabled={savingChat || messages.length <= 1}
            className="text-xs font-sans font-bold flex items-center gap-1.5 px-3 py-1.5 bg-[#DE5239] hover:bg-[#c9452d] text-white rounded-xl shadow-[1px_2px_0px_#1C1917] transition-all cursor-pointer disabled:opacity-40"
          >
            {savedToast ? <Check size={14} /> : <BookmarkPlus size={14} />}
            <span>{savedToast ? "Saved!" : savingChat ? "Saving..." : "Save Chat"}</span>
          </button>
        </div>
      </div>

      {/* ── SAVED CHAT THREADS DRAWER OVERLAY ── */}
      {isHistoryOpen && (
        <div className="bg-white border-b-[1.5px] border-[#1C1917] p-4 shadow-md space-y-3 shrink-0 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-2">
            <span className="text-xs font-mono uppercase font-bold text-[#DE5239] flex items-center gap-1.5">
              <History size={14} /> Past Saved Conversations ({savedThreads.length})
            </span>
            <button onClick={() => setIsHistoryOpen(false)} className="text-stone-400 hover:text-stone-700 p-1">
              <X size={16} />
            </button>
          </div>

          {savedThreads.length === 0 ? (
            <div className="p-6 text-center text-xs font-sans text-[#665F56] space-y-1">
              <MessageSquare size={24} className="mx-auto text-stone-300" />
              <p className="font-serif font-bold text-sm text-[#1C1917]">No Saved Chat Threads Yet</p>
              <p>Click &ldquo;Save Chat&rdquo; during any conversation to save the thread and continue it anytime!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {savedThreads.map((thread) => {
                const isActive = activeThreadId === thread.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => handleContinueThread(thread)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 relative group ${
                      isActive
                        ? "bg-[#F5E5DC] border-[#DE5239] shadow-[2px_3px_0px_#DE5239]"
                        : "bg-[#FAF7F0] border-[#1C1917]/20 hover:border-[#1C1917] shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#665F56]">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {thread.updatedAt}
                      </span>
                      <button
                        onClick={(e) => handleDeleteThread(e, thread.id)}
                        className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 p-0.5 transition-opacity"
                        title="Delete Thread"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <h4 className="font-serif text-xs font-bold text-[#1C1917] line-clamp-1">
                      {thread.title}
                    </h4>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-[#DE5239] font-bold">
                        {thread.messages.filter((m) => m.sender === "user").length} user messages
                      </span>
                      <span className="text-[10px] font-sans font-bold text-[#DE5239] flex items-center gap-0.5">
                        Continue <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SCROLLABLE MESSAGES CONTAINER ONLY (WhatsApp / iMessage Style) ── */}
      <div className="flex-1 bg-[#FAF7F0] p-4 sm:p-5 space-y-4 overflow-y-auto min-h-0 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1.5 ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500">
              <span className="font-serif font-bold text-[#DE5239]">
                {msg.sender === "diary" ? "Your Diary" : "You"}
              </span>
              <span>· {msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 sm:p-4 rounded-2xl max-w-lg text-sm sm:text-base leading-relaxed border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] ${
                msg.sender === "user"
                  ? "bg-[#DE5239] text-white font-sans"
                  : "bg-white text-[#1C1917] font-serif whitespace-pre-line"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "diary" && (msg.memoryUpdated || msg.isQueryResponse) && (
              <span className="text-[10px] font-mono text-[#DE5239] font-bold flex items-center gap-1 bg-[#F5E5DC] px-2.5 py-0.5 rounded-full border border-[#DE5239]/20">
                <CheckCircle2 size={12} />
                {msg.isQueryResponse ? "Reflected from Journal Memory" : "Diary Memory Enriched"}
              </span>
            )}

            {/* Quick Prompts */}
            {msg.quickPrompts && msg.quickPrompts.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {msg.quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="text-xs font-sans font-medium text-[#1C1917] bg-white hover:bg-[#F5E5DC] border border-[#1C1917]/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    &ldquo;{p}&rdquo;
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#DE5239] animate-pulse p-2 font-serif">
            <RefreshCw size={14} className="animate-spin" />
            <span>
              {pendingIsQuestion
                ? "Searching your journal memories and reflecting..."
                : "Reflecting on your entry and linking to your memory graph..."}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── STATIONARY BOTTOM CHAT BAR WITH INPUT + SEND BUTTON (WhatsApp Style) ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-1 mb-20 sm:mb-22 shrink-0 flex items-center gap-2 p-2 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[3px_4px_0px_#1C1917]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening to your voice..." : "Talk to your diary about anything on your mind…"}
          className="w-full bg-transparent text-sm sm:text-base font-serif text-[#1C1917] px-3 focus:outline-none placeholder-stone-400"
        />

        {/* Mic Voice Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl border border-[#1C1917] transition-all cursor-pointer flex items-center justify-center ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-[#F5E5DC] text-[#DE5239] hover:bg-[#DE5239] hover:text-white"
          }`}
          title={isListening ? "Stop listening" : "Speak to your diary"}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Reply Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-[#DE5239] text-white rounded-xl font-bold text-xs sm:text-sm border border-[#1C1917] shadow-[1px_2px_0px_#1C1917] hover:bg-[#c9452d] disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0 font-sans"
        >
          <span>Reply</span>
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
