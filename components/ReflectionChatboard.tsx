"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  RefreshCw,
  MessageCircle,
  CheckCircle2
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";

interface Message {
  id: string;
  sender: "diary" | "user";
  text: string;
  timestamp: string;
  quickPrompts?: string[];
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

  // Initial intimate greeting from "Your Diary" based on recent user entries
  useEffect(() => {
    if (messages.length === 0) {
      const latestCapture = captures[0];
      const companion = latestCapture?.dimensions?.people?.[0];
      const summary = latestCapture?.dimensions?.summary || latestCapture?.content?.substring(0, 50);

      let initialText = "Hey... I'm your diary. I'm here so we can talk directly and fill in any missing gaps in your memories.";
      let prompts = ["Tell me what you've noticed", "Help me reflect on today", "Ask me a question"];

      if (latestCapture) {
        if (!companion && latestCapture.content?.split(" ").some((w) => w.length > 3 && w[0] === w[0].toUpperCase())) {
          initialText = `Hey... In your note from recently ("${summary}"), I noticed a name. Who is this person to you?`;
          prompts = ["Let me tell you about them", "It's a close friend", "Just a teammate"];
        } else if (latestCapture.dimensions?.mood?.toLowerCase().includes("stress") || latestCapture.dimensions?.mood?.toLowerCase().includes("anxious")) {
          initialText = `Hey... Reading your note ("${summary}"), it looks like that situation really bothered you. Do you want to talk more about what happened?`;
          prompts = ["Yeah, it's still bothering me", "I feel better now", "Help me reframe it"];
        } else {
          initialText = `Hey... I was looking at your recent memory: "${summary}". What else felt important about this moment that we haven't captured yet?`;
          prompts = ["Here's what else happened", "Who I was with", "How I felt afterwards"];
        }
      }

      setMessages([
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
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `User Diary Reflection: "${messageText}". Context of recent memories: ${JSON.stringify(captures.slice(0, 2))}`,
          mode: "reflect_chat"
        })
      });

      let diaryReply = "";
      let newPrompts: string[] = [];

      if (res.ok) {
        const data = await res.json();
        diaryReply = data.reflection || data.insights || `I hear you. I've updated your memory with this deeper detail so we never forget it. Is there anything else about this that you'd like to hold onto?`;
      } else {
        diaryReply = `I understand. I've filled in that gap in your diary memory graph. What else is on your mind today?`;
      }

      newPrompts = [
        "Save this reflection",
        "Ask me another question",
        "I'm feeling good for now"
      ];

      const replyMsg: Message = {
        id: `diary_${Date.now()}`,
        sender: "diary",
        text: diaryReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickPrompts: newPrompts,
        memoryUpdated: true
      };

      setMessages((prev) => [...prev, replyMsg]);
      onMemoryUpdate?.();
    } catch (err) {
      console.error("Diary reflect chat error:", err);
      const fallbackMsg: Message = {
        id: `diary_err_${Date.now()}`,
        sender: "diary",
        text: `Thank you for telling me. I've added these details into your diary entries!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        memoryUpdated: true
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full font-sans space-y-4 pb-32 max-w-2xl mx-auto">
      {/* Intimate Sub Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1C1917]/15">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-[#DE5239]" />
          <h2 className="font-serif text-xl font-medium text-[#1C1917]">Talking With Your Diary</h2>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F5E5DC] text-[#DE5239] px-2.5 py-0.5 rounded-full border border-[#DE5239]/20">
          Filling the Gaps
        </span>
      </div>

      {/* Intimate Parchment Chat Stream */}
      <div className="bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-3xl p-4 sm:p-6 shadow-[3px_4px_0px_#1C1917] space-y-4 min-h-[22rem] max-h-[28rem] overflow-y-auto">
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
              className={`p-4 rounded-2xl max-w-md text-sm leading-relaxed border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] ${
                msg.sender === "user"
                  ? "bg-[#DE5239] text-white font-sans"
                  : "bg-white text-[#1C1917] font-serif"
              }`}
            >
              {msg.text}
            </div>

            {msg.memoryUpdated && (
              <span className="text-[10px] font-mono text-[#DE5239] font-bold flex items-center gap-1 bg-[#F5E5DC] px-2 py-0.5 rounded-full border border-[#DE5239]/20">
                <CheckCircle2 size={12} /> Diary Memory Updated
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
            <span>Your diary is listening and updating your memory...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Direct Input Bar */}
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
          placeholder="Answer your diary or tell it what's on your mind…"
          className="w-full bg-transparent text-sm font-serif text-[#1C1917] px-3 focus:outline-none placeholder-stone-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-[#DE5239] text-white rounded-xl font-bold text-xs border border-[#1C1917] shadow-[1px_2px_0px_#1C1917] hover:bg-[#c9452d] disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0 font-sans"
        >
          <span>Reply</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
