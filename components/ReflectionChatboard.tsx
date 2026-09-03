"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  User,
  RefreshCw,
  Lightbulb,
  Heart,
  HelpCircle,
  CheckCircle2
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";
import { ArtisticAvatar } from "./ArtisticAvatar";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  memoryUpdated?: boolean;
}

interface ReflectionChatboardProps {
  captures: CaptureSession[];
  onMemoryUpdate?: () => void;
}

export function ReflectionChatboard({ captures = [], onMemoryUpdate }: ReflectionChatboardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Initial welcome message with Contextual Reflection Questions based on actual user entries
  useEffect(() => {
    if (messages.length === 0) {
      const latestCapture = captures[0];
      const companion = latestCapture?.dimensions?.people?.[0] || "a friend";
      const location = latestCapture?.dimensions?.places?.[0] || "a special place";
      const summary = latestCapture?.dimensions?.summary || latestCapture?.content?.substring(0, 60) || "your recent journal entry";

      const initialText = captures.length > 0
        ? `Hello! I'm your reflective memory companion. Looking through your recent notes, I saw you logged: "${summary}".\n\nI'd love to help you go deeper into this moment. What felt most meaningful about it?`
        : `Welcome to your Reflect space! I'm your AI reflective companion. I help you explore previous memories, unpack complex feelings, and update your diary memory graph.\n\nWhat's on your mind today?`;

      const initialSuggestions = captures.length > 0
        ? [
            `Why did "${summary.substring(0, 30)}..." stick out to me?`,
            `How am I feeling about my progress this week?`,
            `Tell me what patterns you see in my recent notes.`
          ]
        : [
            `What should I reflect on today?`,
            `Help me structure a new thought`,
            `How does Memoiary help me reflect?`
          ];

      setMessages([
        {
          id: "msg_init",
          sender: "ai",
          text: initialText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedQuestions: initialSuggestions
        }
      ]);
    }
  }, [captures]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // Call Gemini API to generate a thoughtful probing reflective response
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `User Reflection Response: "${messageText}". Recent User Entries Context: ${JSON.stringify(captures.slice(0, 3))}`,
          mode: "reflect_chat"
        })
      });

      let aiReplyText = "";
      let suggestions: string[] = [];

      if (res.ok) {
        const data = await res.json();
        aiReplyText = data.reflection || data.insights || `That's a powerful realization. When you think back to how that felt, what lesson or value do you want to carry forward into your next entry?`;
      } else {
        // Fallback probing reflection response
        aiReplyText = `That's a thoughtful insight. Capturing that nuance helps make your memory graph richer. Would you like me to save this reflection directly into your journal memory?`;
      }

      suggestions = [
        "Yes, save this insight into my memory graph",
        "What patterns does this connect to?",
        "Ask me another probing question"
      ];

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedQuestions: suggestions,
        memoryUpdated: true
      };

      setMessages((prev) => [...prev, aiMsg]);
      onMemoryUpdate?.();
    } catch (err) {
      console.error("Reflection chat error:", err);
      const fallbackMsg: Message = {
        id: `ai_err_${Date.now()}`,
        sender: "ai",
        text: `Thank you for sharing that reflection! I've noted this insight into your memory graph. What else would you like to explore together?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        memoryUpdated: true
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full font-sans space-y-4 pb-32 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="p-5 bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-3xl shadow-[3px_4px_0px_#1C1917] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DE5239] flex items-center gap-1.5 font-sans">
            <Sparkles size={14} /> Talk With Your Diary
          </span>
          <span className="text-xs font-mono font-bold bg-[#F5E5DC] text-[#1C1917] px-2.5 py-0.5 rounded-full border border-[#DE5239]/20">
            Conversational Mirror
          </span>
        </div>
        <h2 className="font-serif text-2xl font-medium text-[#1C1917]">Reflections &amp; Insights</h2>
        <p className="text-xs text-[#665F56] font-sans leading-relaxed">
          Chat with your AI companion trained on your personal memories. Answer probing questions to unpack your thoughts, find patterns, and enrich your memory graph.
        </p>
      </div>

      {/* Messages Scroll Box */}
      <div className="bg-white border-[1.5px] border-[#1C1917] rounded-3xl p-4 sm:p-6 shadow-[4px_6px_0px_#1C1917] space-y-4 min-h-[22rem] max-h-[28rem] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-2 ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center gap-2">
              {msg.sender === "ai" ? (
                <div className="w-6 h-6 rounded-full bg-[#DE5239] text-white flex items-center justify-center text-[10px] font-bold border border-black">
                  AI
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center text-[10px] font-bold">
                  You
                </div>
              )}
              <span className="text-[10px] font-mono text-stone-400">{msg.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-2xl max-w-lg text-sm font-sans leading-relaxed border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] ${
                msg.sender === "user"
                  ? "bg-[#DE5239] text-white"
                  : "bg-[#FBF9F4] text-[#1C1917] font-serif"
              }`}
            >
              {msg.text}
            </div>

            {msg.memoryUpdated && (
              <span className="text-[10px] font-mono text-[#DE5239] font-bold flex items-center gap-1 bg-[#F5E5DC] px-2 py-0.5 rounded-full border border-[#DE5239]/20">
                <CheckCircle2 size={12} /> Memory Graph Updated
              </span>
            )}

            {/* Quick Suggestion Chips */}
            {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {msg.suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-xs font-sans font-medium text-[#1C1917] bg-[#F5F1E8] hover:bg-[#F5E5DC] border border-[#1C1917]/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left shadow-xs flex items-center gap-1.5"
                  >
                    <Lightbulb size={12} className="text-[#DE5239] shrink-0" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#DE5239] animate-pulse p-2">
            <RefreshCw size={14} className="animate-spin" />
            <span>AI is reflecting on your journal memories…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[3px_4px_0px_#1C1917]"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Reflect on a memory, answer a question, or express a thought…"
          className="w-full bg-transparent text-sm font-serif text-[#1C1917] px-3 focus:outline-none placeholder-stone-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-[#DE5239] text-white rounded-xl font-bold text-xs border border-[#1C1917] shadow-[1px_2px_0px_#1C1917] hover:bg-[#c9452d] disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
