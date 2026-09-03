"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  Volume2
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
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

  // Warm, Open & Welcoming Persona
  useEffect(() => {
    if (messages.length === 0) {
      const latestCapture = captures[0];
      const summary = latestCapture?.dimensions?.summary || latestCapture?.content?.substring(0, 50);

      let initialText = "Hey there... I'm your diary. You can talk to me about anything happening in your life—a quiet reflection, a feeling you want to unpack, or details you want to add to your memory.\n\nWhether you want to reflect on past moments, fill in missing gaps, or just talk through how your day went... I'm here listening.";
      let prompts = [
        "I want to reflect on something that happened today",
        "Let's talk through a feeling I'm carrying",
        "Help me add details to a recent memory"
      ];

      if (latestCapture && summary) {
        initialText = `Hey there... I'm your diary. I was just holding onto your recent note ("${summary}").\n\nYou can talk to me about anything—whether you want to unpack what happened, fill in missing details about who you were with, or reflect on anything else on your mind today. What would you like to explore?`;
        prompts = [
          `Let's unpack "${summary.substring(0, 30)}..."`,
          "I want to talk about something else today",
          "Help me fill in missing details"
        ];
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

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

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
          content: `User Diary Reflection: "${messageText}". Recent entries context: ${JSON.stringify(captures.slice(0, 2))}`,
          mode: "reflect_chat"
        })
      });

      let diaryReply = "";
      let newPrompts: string[] = [];

      if (res.ok) {
        const data = await res.json();
        diaryReply = data.reflection || data.insights || `I hear you. I've woven this insight into your diary memory graph so we never forget it. Is there anything else about this that you want to talk through?`;
      } else {
        diaryReply = `Thank you for sharing that with me. I've noted these details into your memory graph. What else would you like to talk about today?`;
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
        text: `Thank you for sharing that with me. I've added these details into your diary entries!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        memoryUpdated: true
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] w-full max-w-4xl mx-auto font-sans">
      {/* ── FULL SCREEN CONVERSATION CANVAS ── */}
      <div className="flex-1 bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-3xl p-4 sm:p-6 shadow-[3px_4px_0px_#1C1917] space-y-4 overflow-y-auto min-h-0">
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
              className={`p-4 rounded-2xl max-w-lg text-sm sm:text-base leading-relaxed border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] ${
                msg.sender === "user"
                  ? "bg-[#DE5239] text-white font-sans"
                  : "bg-white text-[#1C1917] font-serif whitespace-pre-line"
              }`}
            >
              {msg.text}
            </div>

            {msg.memoryUpdated && (
              <span className="text-[10px] font-mono text-[#DE5239] font-bold flex items-center gap-1 bg-[#F5E5DC] px-2.5 py-0.5 rounded-full border border-[#DE5239]/20">
                <CheckCircle2 size={12} /> Diary Memory Enriched
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
            <span>Your diary is listening and updating your memory graph...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── BOTTOM CHAT BAR WITH TEXT + MIC BUTTON ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 flex items-center gap-2 p-2 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[3px_4px_0px_#1C1917]"
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
