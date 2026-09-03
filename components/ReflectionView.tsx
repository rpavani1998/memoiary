"use client";

import React, { useState } from "react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";
import { Send, Mic } from "lucide-react";

interface ReflectionMessage {
  id: string;
  sender: "you" | "assistant";
  text: string;
}

export function ReflectionView() {
  const [messages, setMessages] = useState<ReflectionMessage[]>([
    {
      id: "1",
      sender: "you",
      text: "I've been thinking about CU again.",
    },
    {
      id: "2",
      sender: "assistant",
      text: "You'd mentioned the project the last time you talked about her. What happened?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ReflectionMessage = {
      id: Date.now().toString(),
      sender: "you",
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsReplying(true);

    // Simulate calm memory assistant reply after 1.2s
    setTimeout(() => {
      const assistantMsg: ReflectionMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "That makes sense. It seems like when you two work together at Blue Tokai, ideas flow quickly but execution details create friction. How do you feel about bringing it up next time?",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsReplying(false);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-32 font-sans">
      {/* Calm Header */}
      <div className="text-center space-y-3 pt-2 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-3xl p-6 shadow-[3px_4px_0px_#1C1917]">
        <div className="flex justify-center">
          <img src="/logo-mark.png" alt="Memoiary Icon" className="h-16 w-auto object-contain" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
          Reflect with Memoiary
        </h2>
        <p className="text-xs text-[#665F56] font-sans">
          A quiet sounding board weaving your scattered thoughts into interconnected clarity.
        </p>
      </div>

      {/* Calm Dialogue Surface */}
      <div className="space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1.5 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl p-4 shadow-[2px_3px_0px_#1C1917]">
            <span className="text-[10px] uppercase tracking-wider text-[#DE5239] font-bold font-sans flex items-center gap-1.5">
              <span className="node-dot" />
              {msg.sender === "you" ? "You" : "Memoiary"}
            </span>
            <p
              className={`font-serif text-base leading-relaxed ${
                msg.sender === "you"
                  ? "text-[#1C1917] font-medium"
                  : "text-[#1C1917] italic border-l-2 border-[#DE5239] pl-3 py-1"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}

        {isReplying && (
          <div className="space-y-1 py-3 border-[1.5px] border-[#1C1917] bg-[#F5E5DC] rounded-2xl p-4 shadow-[2px_3px_0px_#1C1917]">
            <span className="text-[10px] uppercase tracking-wider text-[#DE5239] font-bold font-sans flex items-center gap-1.5">
              <span className="node-dot" />
              Memoiary
            </span>
            <p className="font-serif italic text-[#DE5239] text-sm animate-pulse">
              Weaving your thoughts into memory...
            </p>
          </div>
        )}
      </div>

      {/* Responsive Input Area */}
      <div className="sticky bottom-20 md:bottom-6 left-0 right-0 z-20 pt-4">
        <form
          onSubmit={handleSend}
          className="bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-2xl p-2.5 shadow-[3px_4px_0px_#1C1917] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's on your mind..."
            className="flex-1 px-4 py-2.5 text-sm font-serif text-[#1C1917] placeholder-[#665F56] outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-[#DE5239] hover:bg-[#C6422A] text-white border-[1.5px] border-[#1C1917] rounded-xl cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
